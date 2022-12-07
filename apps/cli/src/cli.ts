import 'reflect-metadata';
import { Command } from 'commander';
import { DockerEngine } from '@vk8sp/engine';
import { container } from 'tsyringe';

const program = new Command();
const docker = container.resolve(DockerEngine);

program
  .name('vk8sp CLI')
  .description('CLI to deploy, scale, rename, etc vk8sp applications')
  .version('0.0.1');

program
  .command('init')
  .description('Init Docker swarm with a local registry')
  .action(async () => {
    await docker.initializeDocker();
  });

program
  .command('deploy-from-cloud')
  .description('Deploy an Docker image from an Registry cloud')
  .option('-i, --imageName <string>', 'image name to run')
  .option('-p, --ports <string...>', 'ports binding for docker container')
  .option('-e, --env <string...>', 'env variables for docker container')
  .option('-n, --name <string>', 'docker container name')
  .action((args) => {});

program
  .command('deploy-from-git')
  .description('Deploy an Docker image from a Git repository')
  .option('-n, --name <string>', 'image name to create')
  .option('-v, --version <string>', 'version of image')
  .option('-g, --git <string>', 'git repository url')
  .action((args) => {});

program.parse();
