import moment from "moment";
import { TReservation } from "../types";

export const hasConflictingReservation = (
  reservationsFromBe: TReservation[],
  newReservation: TReservation
) =>
  reservationsFromBe.some((existingReservation: TReservation) => {
    const isSameRoom = existingReservation.roomId === newReservation.roomId;

    const newReservationStart = moment(newReservation.start);
    const newReservationEnd = moment(newReservation.end);
    const existingReservationStart = moment(existingReservation.start);
    const existingReservationEnd = moment(existingReservation.end);

    const startInExisting = newReservationStart.isBetween(
      existingReservationStart,
      existingReservationEnd,
      undefined,
      "[)"
    );
    const endInExisting = newReservationEnd.isBetween(
      existingReservationStart,
      existingReservationEnd,
      undefined,
      "(]"
    );
    const existingInNew =
      existingReservationStart.isBetween(
        newReservationStart,
        newReservationEnd,
        undefined,
        "[)"
      ) &&
      existingReservationEnd.isBetween(
        newReservationStart,
        newReservationEnd,
        undefined,
        "(]"
      );

    return isSameRoom && (startInExisting || endInExisting || existingInNew);
  });
