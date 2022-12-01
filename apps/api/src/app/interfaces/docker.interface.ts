export interface DockerRunSchema {
  imageName: string;
  ports?: string[];
  volumes?: string[];
  envVariables?: string[];
  name: string;
}
