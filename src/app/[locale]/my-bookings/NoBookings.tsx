import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

const NoBookings = () => {
  const locale = useLocale();
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 " />
          </div>

          <h3 className="text-lg font-semibold  mb-2">No bookings yet</h3>

          <p className=" mb-6 max-w-sm">
            You don't have any bookings at the moment. Create your first booking
            to get started.
          </p>

          <Button
            className="w-full"
            onClick={() => console.log("Create booking clicked")}
          >
            <Plus className="w-4 h-4 mr-2" />
            <Link href={`/${locale}/`}>Book a car</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoBookings;
