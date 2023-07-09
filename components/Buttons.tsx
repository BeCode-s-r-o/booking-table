import { AddIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Center, Input, Stack, useToast } from "@chakra-ui/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import moment from "moment";
import { uuid } from "uuidv4";
import { useWindowSize } from "../hooks/useWindowSize";
import { TFirebaseCollections, TRoom } from "../types";

type Props = {
  setWeekOffset: (offset: number) => void;
  weekOffset: number;
  rooms: TRoom[];
  setRooms: (rooms: TRoom[]) => void;
  onOpen: () => void;
};

const Buttons = ({
  setWeekOffset,
  weekOffset,
  rooms,
  setRooms,
  onOpen,
}: Props) => {
  const toast = useToast();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const addRoom = async () => {
    const id = uuid();
    const roomName = `Izba ${rooms.length + 1}`;
    const newRoom: TRoom = {
      id,
      name: roomName,
      order: rooms.length + 1,
    };
    setRooms([...rooms, newRoom]);
    await setDoc(doc(getFirestore(), TFirebaseCollections.ROOMS, id), newRoom);
    toast({
      title: `${roomName} bola pridaná!`,
      duration: 2000,
      position: "top-right",
      isClosable: true,
    });
  };

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const selectedDate = moment(value);
    const today = moment().startOf("day");
    const weeksDifference = selectedDate.diff(today, "weeks");
    setWeekOffset(weeksDifference);
  };

  return isMobile ? (
    <>
      <Center>
        <Stack direction="row" spacing={4} align="center">
          <Input
            type="date"
            variant="outline"
            w="160px"
            onChange={onChangeDate}
          />
        </Stack>
      </Center>
      <Center>
        <Stack my="3" direction="row" spacing={4} align="center">
          <Button
            onClick={() => setWeekOffset(weekOffset - 1)}
            colorScheme="blue"
            variant="outline"
          >
            <ArrowBackIcon />
          </Button>
          <Button
            onClick={() => setWeekOffset(0)}
            colorScheme="blue"
            variant="outline"
          >
            Dnes
          </Button>
          <Button
            onClick={() => setWeekOffset(weekOffset + 1)}
            colorScheme="blue"
            variant="outline"
          >
            <ArrowForwardIcon />
          </Button>
        </Stack>
      </Center>
      <Center>
        <Stack direction="row" spacing={4} align="center">
          <Button onClick={addRoom} colorScheme="blue">
            <AddIcon mr="3" /> Izba
          </Button>
          <Button onClick={onOpen} colorScheme="blue">
            <AddIcon mr="3" /> Rezervácia
          </Button>
        </Stack>
      </Center>
    </>
  ) : (
    <Center>
      <Stack my="4" direction="row" spacing={4} align="center">
        <Input
          type="date"
          variant="outline"
          w="160px"
          onChange={onChangeDate}
        />
        <Button
          onClick={() => setWeekOffset(weekOffset - 1)}
          colorScheme="blue"
          variant="outline"
        >
          <ArrowBackIcon />
        </Button>
        <Button
          onClick={() => setWeekOffset(0)}
          colorScheme="blue"
          variant="outline"
        >
          Dnes
        </Button>
        <Button
          onClick={() => setWeekOffset(weekOffset + 1)}
          colorScheme="blue"
          variant="outline"
        >
          <ArrowForwardIcon />
        </Button>
        <Button onClick={addRoom} colorScheme="blue">
          <AddIcon mr="3" /> Izba
        </Button>
        <Button onClick={onOpen} colorScheme="blue">
          <AddIcon mr="3" /> Rezervácia
        </Button>
      </Stack>
    </Center>
  );
};

export default Buttons;
