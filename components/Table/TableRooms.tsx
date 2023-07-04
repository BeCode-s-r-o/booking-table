import { DeleteIcon } from "@chakra-ui/icons";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { TDay, TFirebaseCollections, TReservation, TRoom } from "../../types";
import { TableReservations } from "./TableReservations";

type Props = {
  rooms: TRoom[];
  reservations: TReservation[];
  refetch: () => void;
  days: TDay[];
  handleEditReservation: (reservation: TReservation) => void;
};

export const TableRooms = ({
  rooms,
  reservations,
  refetch,
  days,
  handleEditReservation,
}: Props) => {
  const fs = getFirestore();

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
    <Tbody>
      {rooms.map((room, index) => (
        <Tr
          backgroundColor={index % 2 === 0 ? "#F7FAFC" : "#EDF2F7"}
          key={room.id}
        >
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
          <TableReservations
            room={room}
            reservations={reservations}
            days={days}
            refetch={refetch}
            handleEditReservation={handleEditReservation}
          />
        </Tr>
      ))}
    </Tbody>
  );
};
