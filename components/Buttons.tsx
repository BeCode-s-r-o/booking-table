import { Button, Center, Stack, useToast } from "@chakra-ui/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { uuid } from "uuidv4";
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

  return (
    <Center mb={["2", "5"]}>
      <Stack direction={["column", "row"]} spacing={4} align="center">
        <Button
          onClick={() => setWeekOffset(weekOffset - 1)}
          colorScheme="blue"
          variant="outline"
        >
          Minulý týždeň
        </Button>
        <Button
          onClick={() => setWeekOffset(0)}
          colorScheme="blue"
          variant="outline"
        >
          Tento týždeň
        </Button>
        <Button
          onClick={() => setWeekOffset(weekOffset + 1)}
          colorScheme="blue"
          variant="outline"
        >
          Ďalší týždeň
        </Button>
        <Button onClick={addRoom} colorScheme="blue">
          Pridať izbu
        </Button>
        <Button onClick={onOpen} colorScheme="blue">
          Pridať rezerváciu
        </Button>
      </Stack>
    </Center>
  );
};

export default Buttons;
