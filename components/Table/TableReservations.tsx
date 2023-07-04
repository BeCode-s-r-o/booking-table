import { Box, Td } from "@chakra-ui/react";
import moment from "moment";
import { TDay, TReservation, TRoom } from "../../types";
import {
  getReservationCellContent,
  getReservationsForDay,
} from "../../utils/reservationUtils";

type Props = {
  days: TDay[];
  room: TRoom;
  reservations: TReservation[];
  refetch: () => void;
  handleEditReservation: (reservation: TReservation) => void;
};

export const TableReservations = ({
  days,
  reservations: reservationsProps,
  room,
  refetch,
  handleEditReservation,
}: Props) => {
  return days.map((day) => {
    const currentDay = moment(day.value);
    const reservations = getReservationsForDay(
      room.id,
      day.value,
      reservationsProps
    );

    return (
      <Td
        borderRight="1px solid #E2E8F0"
        borderLeft="1px solid #E2E8F0"
        p="0"
        key={day.value}
      >
        <Box position="relative" width="100%" display="flex" height="50px">
          {reservations.map((reservation) =>
            getReservationCellContent(
              currentDay,
              reservation,
              reservations,
              refetch,
              handleEditReservation
            )
          )}
        </Box>
      </Td>
    );
  });
};
