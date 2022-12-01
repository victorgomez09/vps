export interface DockerRunSchema {
  imageName: string;
  ports?: string[];
  volumes?: string[];
  envVariables?: string[];
  name: string;
}

export interface DockerRunGit {
  name: string;
  version: string;
  git: string;
}
