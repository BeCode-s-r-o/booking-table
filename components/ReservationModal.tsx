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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import { useFetchData } from "../hooks";
import { TFirebaseCollections, TReservation } from "../types";
import { hasConflictingReservation } from "../utils";
import CopyReservationModal from "./CopyReservationModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  isEdit?: boolean;
  editData?: TReservation | null | undefined;
  setIsEdit: (isEdit: boolean) => void;
};

const defaultReservation: TReservation = {
  name: "",
  start: moment().valueOf(),
  end: moment().add(1, "day").valueOf(),
  roomId: "",
  price: "",
  note: "",
  id: "",
};

const ReservationModal = ({
  isOpen,
  onClose,
  refetch,
  isEdit,
  editData,
  setIsEdit,
}: Props) => {
  const toast = useToast();
  const {
    rooms,
    reservations: reservationsFromBe,
    setReservations,
  } = useFetchData();

  const {
    isOpen: isOpenCopy,
    onClose: onCloseCopy,
    onOpen: onOpenCopy,
  } = useDisclosure();

  const [reservation, setReservation] =
    useState<TReservation>(defaultReservation);

  useEffect(() => {
    if (isEdit && editData) {
      setReservation(editData);
    } else {
      setReservation(defaultReservation);
    }
  }, [isEdit, editData]);

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

  const handleClose = () => {
    setIsEdit(false);
    setReservation(defaultReservation);
    refetch();
    onClose();
  };

  const handleSubmit = async () => {
    if (isEdit) {
      await updateDoc(
        doc(getFirestore(), TFirebaseCollections.RESERVATIONS, reservation.id),
        reservation
      );
      handleClose();
      return;
    }
    const id = uuid();
    const newReservation: TReservation = {
      ...reservation,
      id,
    };

    if (hasConflictingReservation(reservationsFromBe, newReservation)) {
      toast({
        status: "error",
        title:
          "Na tento deň už existuje rezervácia pre túto izbu. Prosím vyberte iný deň.",
      });
      return;
    }

    setReservations([...reservationsFromBe, newReservation]);
    await setDoc(
      doc(getFirestore(), TFirebaseCollections.RESERVATIONS, id),
      newReservation
    );

    handleClose();
  };

  const defaultReservationStart = moment(defaultReservation.start).format(
    "YYYY-MM-DD"
  );
  const defaultReservationEnd = moment(defaultReservation.end).format(
    "YYYY-MM-DD"
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Upraviť" : "Pridať"} rezerváciu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <small>Meno</small>
            <Input
              onChange={handleChange}
              value={reservation.name}
              name="name"
              placeholder="Meno"
            />
            <small>Príchod</small>
            <Input
              onChange={handleChange}
              defaultValue={defaultReservationStart}
              value={moment(reservation.start).format("YYYY-MM-DD")}
              name="start"
              type="date"
            />
            <small>Odchod</small>
            <Input
              onChange={handleChange}
              defaultValue={defaultReservationEnd}
              value={moment(reservation.end).format("YYYY-MM-DD")}
              name="end"
              type="date"
            />
            <small>Izba</small>
            <Select onChange={handleSelectChange} value={reservation.roomId}>
              <option key={""} value={""}>
                Vyberte izbzu
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Select>
            <small>Cena</small>
            <Input
              onChange={handleChange}
              value={reservation.price}
              name="price"
            />
            <small>Poznámka</small>
            <Textarea
              onChange={handleChange}
              value={reservation.note}
              name="note"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="blue"
              mr={3}
              onClick={handleClose}
            >
              Zrušiť
            </Button>
            {isEdit && (
              <Button
                variant="ghost"
                colorScheme="blue"
                mr={3}
                onClick={onOpenCopy}
              >
                Kopírovať do inej izby
              </Button>
            )}
            <Button
              isDisabled={!reservation.name}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              {isEdit ? "Uložiť" : "Pridať"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CopyReservationModal
        isOpen={isOpenCopy}
        onClose={onCloseCopy}
        existingReservation={reservation}
        refetch={refetch}
      />
    </>
  );
};

export default ReservationModal;
