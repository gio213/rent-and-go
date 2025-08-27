import { get_user_booking } from "@/actions/car.booking.actions";
import UserBookingsComponent from "@/components/UserBookingsComponent";
import React from "react";

const page = async () => {
  const bookings = await get_user_booking();

  return (
    <div>
      {/* <UserBookingsComponent
        bookings={bookings.bookings!}
        success={bookings.success!}
        message={bookings.message!}
        /> */}
      booking page
    </div>
  );
};

export default page;
