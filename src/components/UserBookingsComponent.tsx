import { get_user_booking } from "@/actions/car.booking.actions";
import React from "react";

type UserBookings = Awaited<ReturnType<(typeof get_user_booking)>>;

const UserBookingsComponent = ({ bookings }: UserBookings) => {
  return (
    <div>
      {bookings?.map((booking) => (
        <div key={booking.id}>{booking.car.brand}</div>
      ))}
    </div>
  );
};

export default UserBookingsComponent;
