import moment from "moment";
import { RoomCellItem } from "../components";
import { TReservation } from "../types";

export const getReservationsForDay = (
  roomId: string,
  dayValue: number,
  reservations: TReservation[]
) => {
  return reservations
    .filter((reservation) => {
      const reservationStart = moment(reservation.start)
        .startOf("day")
        .valueOf();
      const reservationEnd = moment(reservation.end).startOf("day").valueOf();
      return (
        reservation.roomId === roomId &&
        dayValue >= reservationStart &&
        dayValue <= reservationEnd
      );
    })
    .sort((a, b) => {
      return moment(a.start).valueOf() - moment(b.start).valueOf();
    });
};

export const checkOverlapReservations = (reservations: TReservation[]) => {
  const overlapDays = [];

  for (let i = 0; i < reservations.length - 1; i++) {
    const currentReservation = reservations[i];
    const nextReservation = reservations[i + 1];

    if (
      moment(currentReservation.end).isSame(
        moment(nextReservation.start),
        "day"
      )
    ) {
      overlapDays.push(moment(currentReservation.end).format("DD.MM.YYYY"));
    }
  }

  return overlapDays;
};

export const getReservationCellContent = (
  dayMoment: moment.Moment,
  reservation: TReservation,
  reservations: TReservation[],
  refetch: () => void,
  handleEditReservation: (reservation: TReservation) => void
) => {
  if (!reservation) return "-";

  const startDay = moment(reservation.start);
  const endDay = moment(reservation.end);
  let dayType = "";

  if (startDay.isSame(endDay, "day")) {
    dayType = "full";
  } else if (startDay.isSame(dayMoment, "day")) {
    dayType = "start";
  } else if (endDay.isSame(dayMoment, "day")) {
    dayType = "end";
  } else if (dayMoment.isBetween(startDay, endDay, "day", "[]")) {
    dayType = "middle";
  }

  const overlapDays = checkOverlapReservations(reservations);
  const hasOverlap = overlapDays.includes(dayMoment.format("DD.MM.YYYY"));

  return (
    <RoomCellItem
      key={reservation.id}
      reservation={reservation}
      dayType={dayType}
      refetch={refetch}
      hasOverlap={hasOverlap}
      handleEditReservation={handleEditReservation}
    />
  );
};
