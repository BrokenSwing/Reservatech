import {Request} from 'express';

export type KeyExtractor = (req: Request) => string;

export const bodyKeyExtractor = (keyName: string, defaultValue: string = '') => (req: Request) => {
  return req.body ? req.body[keyName] : defaultValue;
};
