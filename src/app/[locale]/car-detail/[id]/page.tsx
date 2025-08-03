import { car_details } from "@/actions/car.actions";
import CarDetailComponent from "@/components/CarDetailComponent";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const carDetailData = await car_details(id);
  return (
    <Suspense fallback={<Skeleton className="animate-spin" />}>
      <div className="container mx-auto p-4">
        <CarDetailComponent car={carDetailData} />
      </div>
    </Suspense>
  );
};

export default page;
