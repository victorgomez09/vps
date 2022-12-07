import { rmSync } from 'fs';
import { injectable } from 'tsyringe';
import { DockerRunGit, DockerRunSchema } from '../models/docker.model';
import { execAsync as execSync } from '../utils/child-node.util';
import { logger } from '../utils/logger.util';
import { removeLineBreaker } from '../utils/text.util';

@injectable()
export class DockerEngine {
  async initializeDocker(): Promise<void> {
    if (!this.isDockerRunning()) process.exit(-1);
    logger.info('[DOCKER-SERVICE] Docker registry deployment in process...');

    const { stdout: isContainerRegistryExists } = await execSync(
      `docker ps -qa -f name=registry`
    );
    if (isContainerRegistryExists) {
      const { stdout: isContainerRegistryRunning } = await execSync(
        `docker container inspect -f '{{.State.Running}}' registry`
      );
      if (removeLineBreaker(isContainerRegistryRunning) !== 'true') {
        await execSync(`docker start ${isContainerRegistryExists}`);
      }
    } else {
      const { stderr: registryErr, stdout: registryOut } = await execSync(
        'docker run -d \
        -p 5000:5000 \
        --restart=always \
        --name registry \
        -v /mnt/registry:/var/lib/registry \
        registry:2'
      );
      if (registryErr) {
        logger.error(`[DOCKER-SERVICE] Error deploying Docker registry, run it manually:
          docker run -d -p 5000:5000 --restart=always --name registry -v /mnt/registry:/var/lib/registry registry:2`);
        process.exit(-1);
      }
      logger.debug(
        `[DOCKER-SERVICE] Docker registry output: ${removeLineBreaker(
          registryOut.toString()
        )}`
      );
    }
    try {
      const { stderr: swarmErr, stdout: swarmOut } = await execSync(
        'docker swarm init'
      );
      if (swarmErr) {
        logger.error(
          `[DOCKER-SERVICE] Error creating Docker swarm, error: ${removeLineBreaker(
            swarmErr.toString()
          )}`
        );
        process.exit();
      }
      logger.debug(
        `[DOCKER-SERVICE] Docker swarm output: ${removeLineBreaker(
          swarmOut.toString()
        )}`
      );
    } catch (error) {
      logger.error(`[DOCKER-SERVICE] Error creating Docker swarm: ${error}`);
      process.exit(-1);
    }
    logger.info(`[DOCKER-SERVICE] Docker engine started!`);
  }

  private async isDockerRunning(): Promise<boolean> {
    const { stderr, stdout } = await execSync('docker -v');
    if (stderr) {
      logger.error(`[DOCKER-SERVICE] can't connect to Docker`);
      return false;
    }
    logger.info(`[DOCKER-SERVICE] ${removeLineBreaker(stdout.toString())}`);
    return true;
  }

  async pullImageFromCloudRegistry(imageName: string) {
    const { stderr, stdout } = await execSync(`docker pull ${imageName}`);
    if (stderr)
      logger.error(`[DOCKER-SERVICE] Error pulling image '${imageName}'`);
    logger.info(`[DOCKER-SERVICE] ${removeLineBreaker(stdout)}`);
  }

  async runImageFromCloudRegistry(data: DockerRunSchema): Promise<boolean> {
    logger.info(`data ${JSON.stringify(data)}`);
    if (!data.imageName) {
      logger.error('Image name cannot be empty');
      return false;
    }
    let name = data.name;
    if (!name)
      name = `${data.imageName}-${Math.random().toString(36).slice(2, 12)}`;
    let ports = '';
    if (data.ports) {
      const portsRegex = new RegExp(
        '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])(?::([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$'
      );
      const isMatch = data.ports.some((port) => portsRegex.test(port));
      if (!isMatch) return false;
      data.ports.forEach((port) => (ports += ` -p ${port}`));
    }
    let env = '';
    if (data.envVariables)
      data.envVariables.forEach((envVariable) => (env += ` -e ${envVariable}`));

    const { stderr, stdout } = await execSync(
      `docker run --name ${name} ${ports} ${env} -d ${data.imageName}`
    );
    if (stderr) {
      logger.error(`[DOCKER-SERVICE] can't run image '${data.imageName}'`);
      return false;
    }
    logger.info(`[DOCKER-SERVICE] ${removeLineBreaker(stdout)}`);
    return true;
  }

  async runImageFromDockerfile(data: DockerRunGit): Promise<boolean> {
    let name = data.name;
    if (!name) {
      logger.error('[DOCKER-SERVICE] Name cannot be empty');
      return false;
    }
    if (data.version) name += `:${data.version}`;
    if (!data.git) {
      logger.error('[DOCKER-SERVICE] Git repository url cannot be empty');
      return false;
    }

    const { stderr: gitError, stdout: gitOut } = await execSync(
      `mkdir -p /tmp/vk8sp/${data.name} && cd /tmp/vk8sp/${data.name} && git clone ${data.git} .`,
      { shell: 'true' }
    );
    if (gitError) {
      logger.error(`[DOCKER-SERVICE] Error cloning repo ${gitError}`);
      return false;
    }

    logger.info(`[DOCKER-SERVICE] Repository cloned ${gitOut}`);

    console.log('name', name);
    const { stderr, stdout } = await execSync(
      `docker build -t ${name} -f /tmp/vk8sp/${data.name}/Dockerfile .`
    );
    if (stderr) {
      logger.error(`[DOCKER-SERVICE] Error building image ${stderr}`);
      return false;
    }

    logger.info(`[DOCKER-SERVICE] Docker image created ${stdout}`);
    rmSync(`/tmp/vk8sp/${data.name}`, { recursive: true, force: true });
    return true;
  }
}

export default DockerEngine;
