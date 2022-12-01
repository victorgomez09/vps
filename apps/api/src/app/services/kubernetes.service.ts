import { exec } from 'child_process';

export const kubernetesVersion = () => {
  exec('kubectl version', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

export const showNamespaces = () => {
  exec('kubectl get namespace', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

export const createNamespace = (namespace: string) => {
  // kubectl create namespace <add-namespace-here> --dry-run=client -o yaml | kubectl apply -f -
  exec(`kubectl create namespace ${namespace} --dry-run=client -o yaml | kubectl apply -f -`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}
