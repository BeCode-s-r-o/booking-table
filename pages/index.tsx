import moment from "moment";
import "moment/locale/sk";
import { useState } from "react";

import { Box, useDisclosure } from "@chakra-ui/react";
import { Buttons, ReservationModal, Table } from "../components";
import { useFetchData } from "../hooks";
import { TReservation } from "../types";

moment.locale("sk");

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<TReservation | null>(null);
  const { rooms, reservations, setRooms, refetch } = useFetchData();
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

  const handleEditReservation = (data: TReservation) => {
    setIsEdit(true);
    setEditData(data);
    onOpen();
  };

  return (
    <Box p="4">
      <Buttons
        onOpen={onOpen}
        setWeekOffset={setWeekOffset}
        weekOffset={weekOffset}
        rooms={rooms}
        setRooms={setRooms}
      />
      <Table
        days={days}
        rooms={rooms}
        reservations={reservations}
        refetch={refetch}
        handleEditReservation={handleEditReservation}
      />
      <ReservationModal
        key={isEdit ? editData?.id : "new"}
        isOpen={isOpen}
        onClose={onClose}
        isEdit={isEdit}
        refetch={refetch}
        setIsEdit={setIsEdit}
        editData={editData}
      />
    </Box>
  );
};

export default Index;
