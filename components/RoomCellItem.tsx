import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { bottomComponentProps, topComponentProps } from "../constants";
import { TReservation } from "../types";
import { CellItem } from "./CellItem";

type Props = {
  reservation: TReservation;
  dayType: string;
  refetch: () => void;
  handleEditReservation: (reservation: TReservation) => void;
  hasOverlap: boolean;
};

export const RoomCellItem: FC<Props> = ({
  reservation,
  dayType,
  refetch,
  handleEditReservation,
  hasOverlap,
}) => {
  const globalComponentProps = {
    reservation,
    refetch,
    handleEditReservation,
    color: "blue.400",
  };

  const propsBasedOnDayType: any = {
    start: topComponentProps(hasOverlap),
    middle: { textAlign: "center" },
    end: bottomComponentProps(hasOverlap),
    full: { textAlign: "center" },
  };

  return (
    <Box position="relative" width="100%" height="50px">
      <CellItem {...propsBasedOnDayType[dayType]} {...globalComponentProps} />
    </Box>
  );
};

export default RoomCellItem;
