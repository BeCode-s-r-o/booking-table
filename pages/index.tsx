import moment from "moment";
import "moment/locale/sk";
import { useState } from "react";

import { Box, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { Buttons, ReservationModal, Table } from "../components";
import { useFetchData } from "../hooks";
import { TReservation } from "../types";
import { generateWeek } from "../utils/dateUtils";

moment.locale("sk");

const Index = () => {
  //states
  const [weekOffset, setWeekOffset] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<TReservation | null>(null);
  //hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { rooms, reservations, setRooms, refetch } = useFetchData();
  //constants
  const days = generateWeek(weekOffset);

  const handleEditReservation = (data: TReservation) => {
    setIsEdit(true);
    setEditData(data);
    onOpen();
  };

  return (
    <Box py="4">
      <Head>
        <title>Granárium Booking Admin</title>
      </Head>
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
