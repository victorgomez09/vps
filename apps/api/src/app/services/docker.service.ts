import { DockerEngine } from '@vk8sp/engine';
import { Request, Response } from 'express';
import { DockerRunSchema } from '../interfaces/docker.interface';

export const pullImageFromCloud = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const imageName = req.query.image as string;
  if (!imageName) return res.status(500).json('Image name cannot be empty');
  // await dockerEngine.pullImageFromCloudRegistry(imageName);
  return res.status(200).json(`Image ${imageName} pulled`);
};

export const runImageFromCloud = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body as DockerRunSchema;
  if (!data) return res.status(500).json('Data cannot be empty');
  // await dockerEngine.runImageFromCloudRegistry(data);
  return res.status(200).json(`Image ${data.imageName} running`);
};
