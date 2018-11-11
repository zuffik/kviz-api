import {Request, Response} from "express";

export const login = (req: Request, res: Response) => res.json({
  success: true,
  id: Math.round(Math.random() * 11)
});
