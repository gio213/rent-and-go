import React from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { create_stripe_checkout_session } from "@/actions/stirpe.actions";
import { BookCarFormDataDetailedType } from "@/validation/book-car-validation";
import {
  differenceInDays,
  format,
  isValid,
  addDays,
  startOfDay,
} from "date-fns";
import {
  CalendarIcon,
  Clock,
  DollarSign,
  Car,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

type BookCarProps = {
  bookData: Omit<BookCarFormDataDetailedType, "startDate" | "endDate">;
  initialStartDate?: Date;
  initialEndDate?: Date;
};

const BookCar = ({
  bookData,
  initialStartDate,
  initialEndDate,
}: BookCarProps) => {
  const { user } = useAuth();

  // Determine the minimum selectable date
  const getMinimumDate = () => {
    // If we have initial dates, start from the initial end date
    if (
      initialStartDate &&
      initialEndDate &&
      isValid(initialStartDate) &&
      isValid(initialEndDate)
    ) {
      // Use startOfDay to normalize the date and avoid time comparison issues
      return startOfDay(initialEndDate);
    }
    // Otherwise, start from current date
    return startOfDay(new Date());
  };

  const minimumDate = getMinimumDate();

  // Set initial state based on whether we have initial dates or not
  const getInitialStartDate = () => {
    if (
      initialStartDate &&
      initialEndDate &&
      isValid(initialStartDate) &&
      isValid(initialEndDate)
    ) {
      // If we have initial booking dates, new booking starts from the initial end date
      return startOfDay(initialEndDate);
    }
    // For new bookings, start from current date
    return startOfDay(new Date());
  };

  const getInitialEndDate = () => {
    if (
      initialStartDate &&
      initialEndDate &&
      isValid(initialStartDate) &&
      isValid(initialEndDate)
    ) {
      // If we have initial booking dates, default end date is one day after initial end date
      return startOfDay(addDays(initialEndDate, 1));
    }
    // For new bookings, default end date is one day after start date
    return startOfDay(addDays(new Date(), 1));
  };

  const [startDate, setStartDate] = React.useState<Date>(getInitialStartDate());
  const [endDate, setEndDate] = React.useState<Date>(getInitialEndDate());
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [durationDays, setDurationDays] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [bookingStep, setBookingStep] = React.useState<
    "selecting" | "confirmed" | "processing"
  >("selecting");
  const locale = useLocale();

  React.useEffect(() => {
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      const duration = differenceInDays(endDate, startDate);
      const finalDuration = Math.max(duration, 1);

      setDurationDays(finalDuration);
      setTotalPrice(finalDuration * bookData.pricePerDay);

      // Update booking step - confirmed when we have valid dates
      if (finalDuration >= 1) {
        setBookingStep("confirmed");
      } else {
        setBookingStep("selecting");
      }
    } else {
      setBookingStep("selecting");
    }
  }, [startDate, endDate, bookData.pricePerDay]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setBookingStep("selecting");
      return;
    }

    // Normalize dates to avoid time comparison issues
    let newStartDate = startOfDay(range.from);

    // Ensure start date is not before minimum date
    if (newStartDate < minimumDate) {
      newStartDate = minimumDate;
    }

    setStartDate(newStartDate);

    if (range.to) {
      // Ensure end date is after start date
      let newEndDate = startOfDay(range.to);
      if (newEndDate <= newStartDate) {
        newEndDate = addDays(newStartDate, 1);
      }
      setEndDate(newEndDate);
    } else {
      // If only start date is selected, set end date to next day
      setEndDate(addDays(newStartDate, 1));
    }
  };

  const router = useRouter();

  const bookDataForStripe: BookCarFormDataDetailedType = {
    ...bookData,
    startDate,
    endDate,
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setBookingStep("processing");

    try {
      if (!user) {
        // Preserve current path and query so user returns after login
        try {
          const returnUrl = window.location.pathname + window.location.search;
          return router.push(
            `/${locale}/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
          );
        } catch (e) {
          return router.push(`/${locale}/auth/login`);
        }
      }
      const res = await create_stripe_checkout_session(bookDataForStripe);

      if (res?.success && res.url) {
        window.location.href = res.url;
      } else {
        console.error("Failed to create Stripe session:", res);
        setBookingStep("confirmed");
      }
    } catch (e) {
      console.error("Unexpected error creating Stripe session:", e);
      setBookingStep("confirmed");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRange: DateRange = {
    from: startDate,
    to: endDate,
  };

  // Safe date formatting function
  const formatDate = (date: Date) => {
    if (!date || !isValid(date)) {
      console.warn("Invalid date passed to formatDate");
      return "Invalid Date";
    }
    try {
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Fixed validation logic - normalize dates for comparison
  const isValidSelection =
    startDate &&
    endDate &&
    isValid(startDate) &&
    isValid(endDate) &&
    durationDays >= 1 &&
    startOfDay(startDate).getTime() >= minimumDate.getTime();

  // Debug logging (remove this in production)
  console.log("Booking validation debug:", {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    minimumDate: minimumDate.toISOString(),
    durationDays,
    isValidSelection,
    hasInitialDates: !!(initialStartDate && initialEndDate),
    startDateNormalized: startOfDay(startDate || new Date()).getTime(),
    minimumDateNormalized: minimumDate.getTime(),
    dateComparison:
      startOfDay(startDate || new Date()).getTime() >= minimumDate.getTime(),
  });

  // Check if this is extending an existing booking
  const isExtendingBooking =
    initialStartDate &&
    initialEndDate &&
    isValid(initialStartDate) &&
    isValid(initialEndDate);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          <h2 className="text-xl font-semibold">
            {isExtendingBooking
              ? "Extend Your Booking"
              : "Complete Your Booking"}
          </h2>
        </div>
        <p className="text-sm opacity-75">
          {isExtendingBooking
            ? `Select your extended rental dates starting from ${formatDate(
                minimumDate
              )}`
            : "Select your preferred rental dates to continue with the booking process"}
        </p>
      </div>

      {/* Existing Booking Info (if extending) */}
      {isExtendingBooking && (
        <div className="border rounded-lg p-4 space-y-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Current Booking
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs opacity-60">Current Pickup Date</p>
              <p className="font-medium">{formatDate(initialStartDate!)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs opacity-60">Current Return Date</p>
              <p className="font-medium">{formatDate(initialEndDate!)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Date Selection Card */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isExtendingBooking
              ? "Extended Rental Dates"
              : "Selected Rental Dates"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs opacity-60">
              {isExtendingBooking ? "New Pickup Date" : "Pickup Date"}
            </p>
            <p className="font-medium">{formatDate(startDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs opacity-60">
              {isExtendingBooking ? "New Return Date" : "Return Date"}
            </p>
            <p className="font-medium">{formatDate(endDate)}</p>
          </div>
        </div>
      </div>

      {/* Calendar Section - Always Visible */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <label className="text-sm font-medium">
            Select Your Rental Period
          </label>
        </div>

        <div className="border rounded-lg p-4">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleDateSelect}
            disabled={(date) => startOfDay(date) < minimumDate}
            defaultMonth={minimumDate} // Calendar opens on the month of minimum date
            today={new Date()} // Mark current date
            numberOfMonths={2}
            ISOWeek
            autoFocus
            className="mx-auto"
          />
        </div>
      </div>

      {/* Booking Summary */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 font-medium">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">
            {isExtendingBooking ? "Extension Summary" : "Booking Summary"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-60" />
              <span className="text-sm">
                {isExtendingBooking ? "Extension Duration" : "Duration"}
              </span>
            </div>
            <span className="font-medium">
              {durationDays} {durationDays === 1 ? "day" : "days"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Daily Rate</span>
            <span className="font-medium">${bookData.pricePerDay}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {isExtendingBooking ? "Extension Amount" : "Total Amount"}
              </span>
              <span className="text-xl font-bold">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {bookingStep === "selecting" && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Please select your rental dates to continue
          </span>
        </div>
      )}

      {bookingStep === "processing" && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Processing your booking...
          </span>
        </div>
      )}

      {bookingStep === "confirmed" && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Dates selected successfully! Ready to proceed.
          </span>
        </div>
      )}

      {/* Action Button */}
      <Button
        className="w-full py-3 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleSubmit}
        disabled={!isValidSelection || isLoading}
        variant="default"
      >
        {!user
          ? "Login to Book"
          : isLoading
          ? "Processing..."
          : `Proceed to Payment • $${totalPrice.toLocaleString()}`}
      </Button>

      {/* Additional Info */}
      <div className="text-center space-y-2">
        <p className="text-xs opacity-60">
          {isExtendingBooking
            ? "Your booking extension will be confirmed after successful payment"
            : "Your booking will be confirmed after successful payment"}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs opacity-60">
          <span>✓ Free cancellation</span>
          <span>✓ Instant confirmation</span>
          <span>✓ Secure payment</span>
        </div>
      </div>
    </div>
  );
};

export default BookCar;
