"use client";
import { get_user_booking } from "@/actions/car.booking.actions";
import ToolTip from "@/components/ToolTip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale } from "next-intl";
import Link from "next/link";
import NoBookings from "./NoBookings";
import { use, useEffect, useState } from "react";

export type Bookings = Awaited<ReturnType<typeof get_user_booking>>;

export function BookingsTable({ bookings }: { bookings: Bookings }) {
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  // Calculate total amount for footer
  const totalAmount =
    bookings.bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) ||
    0;

  const locale = useLocale();

  if (!bookings.bookings || bookings.bookings.length === 0) {
    return <NoBookings />;
  }

  useEffect(() => {
    setLoadingImg(true);
    const t = setTimeout(() => setLoadingImg(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Table>
      <TableCaption>A list of your recent bookings.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Total Days</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead className="text-right">Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.bookings?.map((booking) => (
          <TableRow
            key={booking.id}
            className="hover:bg-accent hover:cursor-pointer"
          >
            <TableCell className="font-medium">
              <Link
                href={`/${locale}/car-detail/${booking.carId}`}
                className="hover:underline text-primary"
              >
                {booking.id}
              </Link>
            </TableCell>
            <TableCell>
              <ToolTip
                trigger={booking.car.brand}
                imageSrc={booking.car.image[0]}
                imageAlt={booking.car.brand}
                loading={loadingImg}
              />
            </TableCell>
            <TableCell>{booking.car.model}</TableCell>
            <TableCell>
              {new Date(booking.startDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(booking.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{booking.durationDays}</TableCell>
            <TableCell>{booking.status}</TableCell>
            <TableCell className="text-right">${booking.totalPrice}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total</TableCell>
          <TableCell className="text-right">${totalAmount}</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
