"use client";
import { car_details } from "@/actions/car.actions";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Car,
  Clock,
  DollarSign,
  DoorOpen,
  Fuel,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import BookCar from "./BookCar";
import BookCarForm from "./BookCar";

type CarDetail = Awaited<ReturnType<typeof car_details>>;

const CarDetailComponent = ({ car }: { car: CarDetail }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  if (!car) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Car not found
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            The car you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeBookings = car.bookings.filter(
    (booking) => booking.status === "CONFIRMED" || booking.status === "PENDING"
  );

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Car Details Card */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative">
            {car.image && car.image.length > 0 ? (
              <div className="aspect-video relative">
                <Image
                  src={selectedImage ? selectedImage : car.image[0]}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Car className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Car Information */}
          <CardContent className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="mb-2">
                  Manufacture year: {car.year}
                </Badge>
              </div>
              <CardTitle className="text-2xl">
                {car.brand} {car.model}
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-primary">
                ${car.price}/day
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {car.description}
              </p>

              <Separator />

              {/* Car Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{car.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{car.seats} Passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize"> {car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize"> {car.doors} Doors</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Insurance Included</span>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <BookCarForm />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Additional Images Grid */}
      {car.image && car.image.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>More photos of this vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {car.image.map((image, index) => (
                <div
                  key={index}
                  className="aspect-video relative rounded-lg overflow-hidden"
                >
                  <Image
                    onClick={() => setSelectedImage(image)}
                    src={image}
                    alt={`${car.brand} ${car.model} - Image ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarDetailComponent;
