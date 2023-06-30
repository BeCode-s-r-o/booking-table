import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TFirebaseCollections, TReservation, TRoom } from "../types";

export const useFetchData = () => {
  const [rooms, setRooms] = useState<TRoom[]>([]);
  const [reservations, setReservations] = useState<TReservation[]>([]);

  const fetchRooms = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), TFirebaseCollections.ROOMS)
    );
    const data: TRoom[] = querySnapshot.docs
      .map((doc) => doc.data() as TRoom)
      .sort((a, b) => a.order - b.order);

    setRooms(data);
  };

  const fetchReservations = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), TFirebaseCollections.RESERVATIONS)
    );
    const data: TReservation[] = querySnapshot.docs.map(
      (doc) => doc.data() as TReservation
    );
    setReservations(data);
  };

  const refetch = () => {
    fetchRooms();
    fetchReservations();
  };

  useEffect(() => {
    fetchRooms();
    fetchReservations();
  }, []);

  return { rooms, setRooms, reservations, setReservations, refetch };
};
