import { Th, Thead, Tr } from "@chakra-ui/react";
import { TDay } from "../../types";

type Props = {
  days: TDay[];
};

export const TableDays = ({ days }: Props) => {
  return (
    <Thead>
      <Tr>
        <Th>Izba</Th>
        {days.map((day) => (
          <Th key={day.value}>{day.label}</Th>
        ))}
      </Tr>
    </Thead>
  );
};
