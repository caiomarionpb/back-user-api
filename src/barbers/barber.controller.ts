import { Request, Response } from "express";
import * as barberService from "./barber.service";

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await barberService.getBarbers();
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar barbeiros." });
  }
};
