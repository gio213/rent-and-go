import React from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { create_stripe_checkout_session } from "@/actions/stirpe.actions";

interface BookCarProps {
  pricePerDay: number;
}

const BookCar = ({ pricePerDay }: BookCarProps) => {
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [durationDays, setDurationDays] = React.useState<number>(1);

  // Calculate duration and total price when dates change
  React.useEffect(() => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const duration = daysDiff > 0 ? daysDiff : 1;
      const total = duration * pricePerDay;

      setDurationDays(duration);
      setTotalPrice(total);
    }
  }, [startDate, endDate, pricePerDay]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      setStartDate(range.from);

      // If end date is selected, use it; otherwise use start date
      if (range.to) {
        setEndDate(range.to);
      } else {
        setEndDate(range.from);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await create_stripe_checkout_session(
        totalPrice,
        "bmw",
        "",
        durationDays,
        "cmdw3hhg600008okrmnh8s5an"
      );

      if (res?.success && res.url) {
        window.location.href = res.url; // ✅ Stripe-ზე გადასვლა
      } else {
        console.error("Failed to create Stripe session:", res); // მხოლოდ წარუმატებლობაზე
      }
    } catch (e) {
      console.error("Unexpected error creating Stripe session:", e);
      alert("Unexpected error");
    }
  };

  // Create DateRange object for the calendar
  const selectedRange: DateRange = {
    from: startDate,
    to: endDate,
  };

  return (
    <div className="mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Rental Dates
        </label>
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()} // Disable past dates
          ISOWeek
          autoFocus
        />
      </div>

      {/* Display booking summary */}
      <div className="p-4  rounded-lg">
        <p className="text-sm ">Duration: {durationDays} day(s)</p>
        <p className="text-lg font-semibold">Total Price: ${totalPrice}</p>
      </div>

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        variant="secondary"
      >
        Book Now
      </Button>
    </div>
  );
};

export default BookCar;
