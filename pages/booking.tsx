import { Box, Center, Spinner, useDisclosure } from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import moment from "moment";
import "moment/locale/sk";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  //hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { rooms, reservations, setRooms, refetch } = useFetchData();
  const router = useRouter();
  //constants
  const days = generateWeek(weekOffset);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditReservation = (data: TReservation) => {
    setIsEdit(true);
    setEditData(data);
    onOpen();
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

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
