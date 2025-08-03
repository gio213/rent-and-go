import React from "react";
import { Button } from "./ui/button";
import { Calendar, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  BookCarFormDataDetailedType,
  BookCarValidationSchemaDetailed,
} from "@/validation/book-car-validation";
import { zodResolver } from "@hookform/resolvers/zod";

const BookCarForm = () => {
  const form = useForm<BookCarFormDataDetailedType>({
    resolver: zodResolver(BookCarValidationSchemaDetailed),
    defaultValues: {
      carId: "",
      startDate: new Date(),
      endDate: new Date(),
      totalPrice: 0,
      durationDays: 1,
      userId: "",
    },
  });
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button className="flex-1">
        <Calendar className="mr-2 h-4 w-4" />
        Book Now
      </Button>
      <Button variant="outline" className="flex-1">
        <Clock className="mr-2 h-4 w-4" />
        Check Availability
      </Button>
    </div>
  );
};

export default BookCarForm;
