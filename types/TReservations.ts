export type TReservation = {
  id: string;
  roomId: string;
  start: number;
  end: number;
  name: string;
  halfDay: boolean;
};

export type TDay = { value: number; label: string };
