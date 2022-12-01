export interface DockerRunSchema {
  imageName: string;
  ports?: string[];
  volumes?: string[];
  envVariables?: string[];
  name: string;
}

export interface DockerRunDockerfile {
  name: string;
  tag: string;
  dockerfile: string;
}
