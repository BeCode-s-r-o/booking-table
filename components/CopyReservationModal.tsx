import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useState } from "react";
import { uuid } from "uuidv4";
import { useFetchData } from "../hooks";
import { TFirebaseCollections, TReservation } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  existingReservation: TReservation | null | undefined;
  refetch: () => void;
};

const CopyReservationModal = ({
  isOpen,
  onClose,
  existingReservation,
  refetch,
}: Props) => {
  const {
    rooms,
    reservations: reservationsFromBe,
    setReservations,
  } = useFetchData();

  const [newRoom, setNewRoom] = useState<string>("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewRoom(value);
  };

  const handleClose = () => {
    onClose();
  };

  const avalableRooms = rooms.filter(
    (room) => room.id !== existingReservation?.roomId
  );

  const handleSubmit = async () => {
    if (!existingReservation) return;
    const id = uuid();
    const newReservation: TReservation = {
      ...existingReservation,
      id,
      roomId: newRoom,
    };

    setReservations([...reservationsFromBe, newReservation]);
    await setDoc(
      doc(getFirestore(), TFirebaseCollections.RESERVATIONS, id),
      newReservation
    );
    refetch();
    setNewRoom("");
    handleClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Kopírovať rezerváciu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <small>Izba</small>
            <Select onChange={handleSelectChange} value={newRoom}>
              <option key={""} value={""}>
                Vyberte izbu
              </option>
              {avalableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!newRoom}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Kopírovať
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CopyReservationModal;
