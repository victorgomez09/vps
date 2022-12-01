import { Command } from 'commander';
import { dockerEngine } from '@vk8sp/engine';

const program = new Command();

program
  .name('vk8sp CLI')
  .description('CLI to deploy, scale, rename, etc vk8sp applications')
  .version('0.0.1');

program
  .command('deploy-from-cloud')
  .description('Deploy an Docker image from an Registry cloud')
  .option('-i, --imageName <string>', 'image name to run')
  .option('-p, --ports <string...>', 'ports binding for docker container')
  .option('-e, --env <string...>', 'env variables for docker container')
  .option('-n, --name <string>', 'docker container name')
  .action((args) => {
    dockerEngine.runImageFromCloudRegistry({
      name: args.name,
      imageName: args.imageName,
      ports: args.ports,
      envVariables: args.env,
    });
  });

program
  .command('deploy-from-git')
  .description('Deploy an Docker image from a Git repository')
  .option('-n, --name <string>', 'image name to create')
  .option('-v, --version <string>', 'version of image')
  .option('-g, --git <string>', 'git repository url')
  .action((args) => {
    dockerEngine.runImageFromDockerfile({
      name: args.name,
      version: args.version,
      git: args.git,
    });
  });

program.parse();
