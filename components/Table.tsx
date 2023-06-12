import {
  Box,
  Table as ChakraTable,
  Editable,
  EditableInput,
  EditablePreview,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import moment from "moment";
import "moment/locale/sk";
import { useFetchData } from "../hooks";
import { TDay, TFirebaseCollections, TReservation, TRoom } from "../types";
import { RoomCellItem } from "./RoomCellItem";
moment.locale("sk");

type Props = {
  days: TDay[];
  rooms: TRoom[];
  reservations: TReservation[];
};

export const Table = ({ days, rooms, reservations }: Props) => {
  const { setRooms } = useFetchData();
  const getReservationsForDay = (roomId: string, dayValue: number) => {
    return reservations.filter((reservation) => {
      const reservationStart = moment(reservation.start)
        .startOf("day")
        .valueOf();
      const reservationEnd = moment(reservation.end).startOf("day").valueOf();
      return (
        reservation.roomId === roomId &&
        dayValue >= reservationStart &&
        dayValue <= reservationEnd
      );
    });
  };

  const getReservationCellContent = (
    dayMoment: moment.Moment,
    reservation?: TReservation
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

    return <RoomCellItem reservation={reservation} dayType={dayType} />;
  };

  const handleDeleteRoom = async (roomId: string) => async () => {
    console.log("delete room", roomId);
    await deleteDoc(doc(getFirestore(), TFirebaseCollections.ROOMS, roomId));
    setRooms((prevState) => prevState.filter((room) => room.id !== roomId));
  };

  return (
    <TableContainer>
      <ChakraTable variant="simple">
        <Thead>
          <Tr>
            <Th>Izba</Th>
            {days.map((day) => (
              <Th key={day.value}>{day.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rooms.map((room) => (
            <Tr key={room.id}>
              <Td display="flex" alignItems="center">
                <Editable defaultValue={room.name}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Td>
              {days.map((day) => {
                const reservations = getReservationsForDay(room.id, day.value);
                return (
                  <Td p="0" key={day.value}>
                    <Box position="relative" width="100%" height="50px">
                      {reservations.map((reservation) =>
                        getReservationCellContent(
                          moment(day.value),
                          reservation
                        )
                      )}
                    </Box>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
};

export default Table;
