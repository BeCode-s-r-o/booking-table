import { DeleteIcon } from "@chakra-ui/icons";
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
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
import "moment/locale/sk";
import { TDay, TFirebaseCollections, TReservation, TRoom } from "../types";
import { RoomCellItem } from "./RoomCellItem";
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
  const fs = getFirestore();

  const getReservationsForDay = (roomId: string, dayValue: number) => {
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

    return (
      <RoomCellItem
        reservation={reservation}
        dayType={dayType}
        refetch={refetch}
        handleEditReservation={handleEditReservation}
      />
    );
  };

  const handleChangeRoomName = (roomId: string) => (value: string) => {
    const roomRef = doc(fs, TFirebaseCollections.ROOMS, roomId);
    updateDoc(roomRef, { name: value });
  };

  const deleteRoom = (roomId: string) => () => {
    const roomRef = doc(fs, TFirebaseCollections.ROOMS, roomId);
    const reservationstoDelete: TReservation[] = reservations.filter(
      (reservation: TReservation) => reservation.roomId === roomId
    );
    reservationstoDelete.forEach((reservation: TReservation) => {
      const reservationRef = doc(
        fs,
        TFirebaseCollections.RESERVATIONS,
        reservation.id
      );
      deleteDoc(reservationRef);
    });

    deleteDoc(roomRef);
    refetch();
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
                <DeleteIcon
                  boxSize={3}
                  mr="2"
                  color="rgba(255,0,0,0.5)"
                  onClick={deleteRoom(room.id)}
                  cursor={"pointer"}
                />
                <Editable
                  defaultValue={room.name}
                  onSubmit={handleChangeRoomName(room.id)}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Td>
              {days.map((day) => {
                const reservations = getReservationsForDay(room.id, day.value);
                return (
                  <Td p="0" key={day.value}>
                    <Box
                      position="relative"
                      width="100%"
                      display="flex"
                      height="50px"
                    >
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
