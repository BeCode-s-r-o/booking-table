import moment from "moment";
import "moment/locale/sk";
import { useState } from "react";

import { useDisclosure } from "@chakra-ui/react";
import { Buttons, ReservationModal, Table } from "../components";
import { useFetchData } from "../hooks";

moment.locale("sk");

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { rooms, reservations, setRooms } = useFetchData();
  const [weekOffset, setWeekOffset] = useState(0);

  const generateWeek = (offset: number) => {
    const startOfWeek = moment().startOf("week").add(offset, "weeks");
    const week = Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek.clone().add(i, "days");
      return {
        value: day.valueOf(),
        label: day.format("dddd, D.M.YYYY"),
      };
    });
    return week;
  };

  const days = generateWeek(weekOffset);

  return (
    <>
      <Buttons
        onOpen={onOpen}
        setWeekOffset={setWeekOffset}
        weekOffset={weekOffset}
        rooms={rooms}
        setRooms={setRooms}
      />
      <Table days={days} rooms={rooms} reservations={reservations} />
      <ReservationModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Index;
