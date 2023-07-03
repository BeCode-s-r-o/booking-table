import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import moment from "moment";
import { FC } from "react";
import {
  bottomComponentProps,
  middleComponentProps,
  topComponentProps,
} from "../constants";
import { TFirebaseCollections, TReservation } from "../types";

type Props = {
  reservation: TReservation;
  dayType: string;
  refetch: () => void;
  handleEditReservation: (reservation: TReservation) => void;
};

export const RoomCellItem: FC<Props> = ({
  reservation,
  dayType,
  refetch,
  handleEditReservation,
}) => {
  switch (dayType) {
    case "start":
      return (
        <Box position="relative" width="100%" height="50px">
          <CellItem
            {...topComponentProps}
            color="blue"
            reservation={reservation}
            refetch={refetch}
            handleEditReservation={handleEditReservation}
          />
        </Box>
      );
    case "middle":
      return (
        <Box position="relative" width="100%" height="50px">
          <CellItem
            color="blue"
            {...middleComponentProps}
            reservation={reservation}
            refetch={refetch}
            handleEditReservation={handleEditReservation}
          />
        </Box>
      );
    case "end":
      return (
        <Box position="relative" width="100%" height="50px">
          <CellItem
            color="blue"
            {...bottomComponentProps}
            reservation={reservation}
            refetch={refetch}
            handleEditReservation={handleEditReservation}
          />
        </Box>
      );
    case "full":
    default:
      return (
        <Box position="relative" height="50px">
          <CellItem
            color="blue"
            {...middleComponentProps}
            reservation={reservation}
            refetch={refetch}
            handleEditReservation={handleEditReservation}
          />
        </Box>
      );
  }
};

type CellItemProps = {
  children?: React.ReactNode;
  color: string;
  clipPath?: string;
  reservation: TReservation;
  textAlign: string;
  refetch: () => void;
  handleEditReservation: (reservation: TReservation) => void;
};

const CellItem: FC<CellItemProps> = ({
  color,
  clipPath,
  reservation,
  textAlign,
  refetch,
  handleEditReservation,
}) => {
  const deleteReservation = (id: string) => async () => {
    await deleteDoc(doc(getFirestore(), TFirebaseCollections.RESERVATIONS, id));
    refetch();
  };

  return (
    <Box position="relative" width="100%" height="100%">
      <Box
        position="absolute"
        background={color}
        width="100%"
        height="100%"
        clipPath={clipPath}
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent={textAlign}
      >
        <Popover>
          <PopoverTrigger>
            <Text color="white">
              {reservation.name.length > 10
                ? reservation.name.substring(0, 10) + "..."
                : reservation.name}
            </Text>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody p="6">
              <Text textAlign="center" fontWeight="bold">
                {reservation.name}
              </Text>
              <Text textAlign="center">
                {moment(reservation.start).format("DD.MM.")} -{" "}
                {moment(reservation.end).format("DD.MM.")}
              </Text>
              {reservation.price && (
                <Text textAlign="center">{reservation.price}€</Text>
              )}

              <Text textAlign="center" whiteSpace="normal">
                {reservation.note}
              </Text>

              <Center>
                <Stack direction="row" mt="2" spacing={4}>
                  <DeleteIcon
                    mr="2"
                    color="rgba(255,0,0,0.5)"
                    onClick={deleteReservation(reservation.id)}
                    cursor={"pointer"}
                  />
                  <EditIcon
                    onClick={() => handleEditReservation(reservation)}
                    cursor={"pointer"}
                  />
                </Stack>
              </Center>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  );
};

export default RoomCellItem;
