export type TReservation = {
  id: string;
  roomId: string;
  start: number;
  end: number;
  note?: string;
  price?: string;
  name: string;
};

export type TDay = { value: number; label: string };
