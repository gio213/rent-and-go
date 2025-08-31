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
import BookCarForm from "./BookCar";
import { Modal } from "./Modal";
import { nextDay } from "date-fns";

type CarDetail = Awaited<ReturnType<typeof car_details>>;

const CarDetailComponent = ({ car }: { car: CarDetail }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!car) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
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

  // prepare booking data for BookCarForm

  const bookData = {
    carId: car.id,
    pricePerDay: car.price,
    carName: car.brand,
    carModel: car.model,
    carImage: car.image[0],
  };

  const lastBooking = car.bookings.reduce((latest, booking) => {
    const latestStartDate = latest.startDate || new Date(0);
    const bookingStartDate = booking.startDate || nextDay;

    return bookingStartDate > latestStartDate ? booking : latest;
  }, {} as (typeof car.bookings)[number]);
  console.log("lastBooking", lastBooking);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden p-0">
            <div className="aspect-[4/3] relative bg-muted">
              {car.image && car.image.length > 0 ? (
                <Image
                  src={selectedImage || car.image[0]}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>

          {/* Image Thumbnails */}
          {car.image && car.image.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {car.image.map((image, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md p-0 ${
                    selectedImage === image || (!selectedImage && index === 0)
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={image}
                      alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Car Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-3">
                    {car.year}
                  </Badge>
                  <CardTitle className="text-3xl font-bold mb-2">
                    {car.brand} {car.model}
                  </CardTitle>
                  <CardDescription className="text-2xl font-semibold text-primary flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {car.price}/day
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </div>

              <Separator />

              {/* Vehicle Features */}
              <div>
                <h3 className="font-semibold mb-4">Vehicle Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Car className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {car.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Passengers</p>
                      <p className="text-sm text-muted-foreground">
                        {car.seats}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Car className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Transmission</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {car.transmission}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Fuel className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Fuel Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {car.fuelType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <DoorOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Doors</p>
                      <p className="text-sm text-muted-foreground">
                        {car.doors}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Insurance</p>
                      <p className="text-sm text-muted-foreground">Included</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Section */}
              <div className="space-y-4 ">
                <h3 className="font-semibold">Book This Vehicle</h3>
                <Modal
                  type="booking"
                  className="max-w-3xl"
                  key={lastBooking.id}
                >
                  <BookCarForm
                    bookData={bookData}
                    initialStartDate={lastBooking.startDate}
                    initialEndDate={lastBooking.endDate}
                  />
                </Modal>
              </div>
            </CardContent>
            <div className="p-4 border-t"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarDetailComponent;
