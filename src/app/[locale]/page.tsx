import { list_cars } from "@/actions/car.actions";
import CarCard from "@/components/CarCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Home() {
  const listed_cars = await list_cars();

  if (!listed_cars || listed_cars.length === 0) {
    return <div>No cars available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10">
      {listed_cars.map((car, index) => (
        <Suspense key={index} fallback={<Skeleton className="h-96 w-full" />}>
          <CarCard key={car.id} car={car} />
        </Suspense>
      ))}
    </div>
  );
}
