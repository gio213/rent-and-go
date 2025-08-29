import { get_current_user } from "@/actions/user.actions";
import { Bookings, BookingsTable } from "./data-table";
import UnauthorizedPage from "../unauthorized/page";
import { get_user_booking } from "@/actions/car.booking.actions";

export default async function DemoPage() {
  const user = await get_current_user();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const bookings = (await get_user_booking()) as Bookings;

  return (
    <div className="container mx-auto py-10">
      <BookingsTable bookings={bookings} />
    </div>
  );
}
