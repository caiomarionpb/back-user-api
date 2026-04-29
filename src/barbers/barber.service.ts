import { Barber } from "./barber.model";

const barbers: Barber[] = [
  {
    id: "1",
    name: "João",
    photoUrl: "https://via.placeholder.com/150",
    description: "Especialista em cortes clássicos.",
  },
  {
    id: "2",
    name: "Maria",
    photoUrl: "https://via.placeholder.com/150",
    description: "Especialista em cortes modernos.",
  },
  {
    id: "3",
    name: "José",
    photoUrl: "https://via.placeholder.com/150",
    description: "Especialista em barbas.",
  },
];

export const getBarbers = async (): Promise<Barber[]> => {
  // TODO: Implementar a busca de barbeiros no banco de dados
  return barbers;
};
