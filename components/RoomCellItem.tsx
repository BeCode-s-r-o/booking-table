import { Box } from "@chakra-ui/react";
import { FC } from "react";
import {
  bottomComponentProps,
  middleComponentProps,
  topComponentProps,
} from "../constants";
import { TReservation } from "../types";

type CellItemProps = {
  children?: React.ReactNode;
  color: string;
  clipPath?: string;
  reservation: TReservation;
  textAlign: string;
  zIndex: number;
};

type Props = {
  reservation: TReservation;
  dayType: string;
};

export const RoomCellItem: FC<Props> = ({ reservation, dayType }) => {
  switch (dayType) {
    case "start":
      return (
        <Box position="relative" width="100%" height="50px">
          <CellItem
            {...topComponentProps}
            color="blue"
            reservation={reservation}
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
          />
        </Box>
      );
    case "full":
    default:
      return (
        <Box position="relative" width="50%" height="50px">
          <CellItem
            color="blue"
            {...middleComponentProps}
            reservation={reservation}
          />
        </Box>
      );
  }
};

const CellItem: FC<CellItemProps> = ({
  color,
  clipPath,
  reservation,
  textAlign,
  zIndex,
}) => (
  <Box position="relative" width="100%" height="100%" zIndex={zIndex}>
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
      color="black"
    >
      {reservation.name}
    </Box>
  </Box>
);

export default RoomCellItem;
