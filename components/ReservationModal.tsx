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
  Textarea,
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
  refetch: () => void;
  isEdit?: boolean;
};

const defaultReservation = {
  name: "",
  start: moment().valueOf(),
  end: moment().add(1, "day").valueOf(),
  roomId: "",
  price: "",
  note: "",
};

const ReservationModal = ({ isOpen, onClose, refetch, isEdit }: Props) => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    const hasConflictingReservation = reservationsFromBe.some(
      (existingReservation: TReservation) => {
        const isSameRoom = existingReservation.roomId === newReservation.roomId;

        const newReservationStart = moment(newReservation.start);
        const newReservationEnd = moment(newReservation.end);
        const existingReservationStart = moment(existingReservation.start);
        const existingReservationEnd = moment(existingReservation.end);

        const startInExisting = newReservationStart.isBetween(
          existingReservationStart,
          existingReservationEnd,
          undefined,
          "[]"
        );
        const endInExisting = newReservationEnd.isBetween(
          existingReservationStart,
          existingReservationEnd,
          undefined,
          "[]"
        );
        const existingInNew =
          existingReservationStart.isBetween(
            newReservationStart,
            newReservationEnd,
            undefined,
            "[]"
          ) &&
          existingReservationEnd.isBetween(
            newReservationStart,
            newReservationEnd,
            undefined,
            "[]"
          );

        return (
          isSameRoom && (startInExisting || endInExisting || existingInNew)
        );
      }
    );

    // If there's a conflicting reservation, alert the user and return early
    if (hasConflictingReservation) {
      alert(
        "There is already a full day reservation on these dates for this room"
      );
      return;
    }

    setReservations([...reservationsFromBe, newReservation]);
    await setDoc(
      doc(getFirestore(), TFirebaseCollections.RESERVATIONS, id),
      newReservation
    );
    setReservation(defaultReservation);
    refetch();
    onClose();
  };

  const defaultReservationStart = moment(defaultReservation.start).format(
    "YYYY-MM-DD"
  );
  const defaultReservationEnd = moment(defaultReservation.end).format(
    "YYYY-MM-DD"
  );

  console.log(reservation);

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
            <Input
              onChange={handleChange}
              defaultValue={defaultReservationStart}
              name="start"
              type="date"
            />
            <small>Odchod</small>
            <Input
              onChange={handleChange}
              defaultValue={defaultReservationEnd}
              name="end"
              type="date"
            />
            <small>Izba</small>
            <Select onChange={handleSelectChange} value={reservation.roomId}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
            <small>Cena</small>
            <Input onChange={handleChange} name="price" />
            <small>Poznámka</small>
            <Textarea onChange={handleChange} name="note" />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
              Zrušiť
            </Button>
            <Button
              isDisabled={!reservation.name}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Pridať
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReservationModal;
