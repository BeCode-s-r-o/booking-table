import { Table as ChakraTable, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/sk";
import { TDay, TReservation, TRoom } from "../../types";
import { TableDays } from "./TableDays";
import { TableRooms } from "./TableRooms";
moment.locale("sk");

type Props = {
  days: TDay[];
  rooms: TRoom[];
  reservations: TReservation[];
  refetch: () => void;
  handleEditReservation: (reservation: TReservation) => void;
};

export const Table = ({
  days,
  rooms,
  reservations,
  refetch,
  handleEditReservation,
}: Props) => {
  return (
    <TableContainer>
      <ChakraTable>
        <TableDays days={days} />
        <TableRooms
          rooms={rooms}
          reservations={reservations}
          refetch={refetch}
          days={days}
          handleEditReservation={handleEditReservation}
        />
      </ChakraTable>
    </TableContainer>
  );
};

export default Table;
