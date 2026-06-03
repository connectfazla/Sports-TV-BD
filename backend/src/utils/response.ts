import { Response } from 'express';

export const ok = (res: Response, data: unknown, message = 'OK') =>
  res.json({ success: true, message, data });

export const created = (res: Response, data: unknown) =>
  res.status(201).json({ success: true, message: 'Created', data });

export const noContent = (res: Response) => res.status(204).send();

export const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, message });

export const unauthorized = (res: Response, message = 'Unauthorized') =>
  res.status(401).json({ success: false, message });

export const forbidden = (res: Response, message = 'Forbidden') =>
  res.status(403).json({ success: false, message });

export const notFound = (res: Response, message = 'Not found') =>
  res.status(404).json({ success: false, message });

export const serverError = (res: Response, message = 'Internal server error') =>
  res.status(500).json({ success: false, message });
