"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { list_cars } from "@/actions/car.actions";

type CarType = Awaited<ReturnType<typeof list_cars>>[number];

interface CarCardProps {
  car: CarType;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Calculate availability
  const activeBookings = car.bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;
  const isAvailable = activeBookings === 0;

  const getStatusText = () => {
    if (isAvailable) return "Available";
    return "Booked";
  };

  // Image navigation
  const nextImage = () => {
    if (car.image.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.image.length);
    }
  };

  const prevImage = () => {
    if (car.image.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + car.image.length) % car.image.length
      );
    }
  };

  // Fallback image
  const currentImage = car.image[currentImageIndex] || "/placeholder-car.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={currentImage}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Image Navigation */}
        {car.image.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {car.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-primary/50 hover:bg-primary/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold truncate">
              {car.brand} {car.model}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{car.year}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold">${car.price}</span>
            </div>
            <span className="text-xs text-muted-foreground">per day</span>
          </div>
        </div>
      </CardHeader>

      {/* Footer Actions */}
      <CardFooter className="pt-4">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {isAvailable ? (
            <Button size="sm" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          ) : (
            <Button size="sm" disabled className="flex-1">
              Currently Booked
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
