import {
  Button,
  Input,
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
import moment from "moment";
import { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import { useFetchData } from "../hooks";
import { TFirebaseCollections, TReservation } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const defaultReservation = {
  name: "",
  start: moment().valueOf(),
  end: moment().add(1, "day").valueOf(),
  roomId: "",
};

const ReservationModal = ({ isOpen, onClose }: Props) => {
  const {
    rooms,
    reservations: reservationsFromBe,
    setReservations,
  } = useFetchData();

  const [reservation, setReservation] = useState(defaultReservation);

  useEffect(() => {
    setReservation((prevState) => ({
      ...prevState,
      roomId: rooms[0]?.id || "",
    }));
  }, [rooms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      const date = moment(value);
      setReservation((prevState) => ({
        ...prevState,
        [name]: date.valueOf(),
      }));
      return;
    }

    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setReservation((prevState) => ({
      ...prevState,
      roomId: value,
    }));
  };

  const handleSubmit = async () => {
    const id = uuid();
    const newReservation: TReservation = {
      id,
      ...reservation,
    };
    setReservations([...reservationsFromBe, newReservation]);
    await setDoc(
      doc(getFirestore(), TFirebaseCollections.RESERVATIONS, id),
      newReservation
    );
    setReservation(defaultReservation);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pridať rezerváciu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <small>Meno</small>
            <Input onChange={handleChange} name="name" placeholder="Meno" />
            <small>Príchod</small>
            <Input onChange={handleChange} name="start" type="date" />
            <small>Odchod</small>
            <Input onChange={handleChange} name="end" type="date" />
            <small>Izba</small>
            <Select onChange={handleSelectChange} value={reservation.roomId}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
              Zrušiť
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Pridať
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReservationModal;
