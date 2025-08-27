"use client";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";

type BookingSuccessComponentProps = {
  carId: string;
  seconds: number;
};

const BookingSuccessComponent = ({
  carId,
  seconds,
}: BookingSuccessComponentProps) => {
  const [countdown, setCountdown] = React.useState<number>(seconds);
  const router = useRouter();
  const locale = useLocale();
  const url = useSearchParams();

  const fullUrl = `${url.get("base")}/${locale}/my-bookings/success/${carId}`;

  React.useEffect(() => {
    if (!carId || !fullUrl) {
      router.push(`/${locale}`);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      router.push(`/${locale}/my-bookings`);
    }

    return () => clearInterval(interval);
  }, [countdown, carId, router, locale, fullUrl]);

  const handleViewBookings = () => {
    router.push(`/${locale}/my-bookings`);
  };

  const handleViewThisBooking = () => {
    router.push(fullUrl);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-border">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your car reservation has been successfully created
            </p>
          </div>

          {/* Booking ID Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="px-3 py-1">
              <Calendar className="w-3 h-3 mr-1" />
              Booking ID: {carId.slice(-8).toUpperCase()}
            </Badge>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Redirecting in
              </span>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center">
                  <span className="text-lg font-bold tabular-nums">
                    {countdown}
                  </span>
                </div>
                <div
                  className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"
                  style={{
                    animationDuration: `${seconds}s`,
                    animationTimingFunction: "linear",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to your registered email
              address
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccessComponent;
