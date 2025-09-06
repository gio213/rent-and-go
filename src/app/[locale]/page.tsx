import { filter_cars_typed } from "@/actions/car.actions";
import CarCard from "@/components/CarCard";
import Filter from "@/components/Filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface HomePageProps {
  params: { locale: string };
  searchParams: Promise<{
    minPrice?: string | string[];
    maxPrice?: string | string[];
    type?: string | string[];
    fuelType?: string | string[];
    transmission?: string | string[];
  }>;
}

// Alternative version with even cleaner param handling
async function page({ params, searchParams }: HomePageProps) {
  const sp = await searchParams;
  console.log("Search Params:", sp);
  // More concise filter extraction
  const filters = {
    minPrice: sp.minPrice
      ? parseInt(
          Array.isArray(sp.minPrice) ? sp.minPrice[0] : sp.minPrice,
          10
        ) || undefined
      : undefined,
    maxPrice: sp.maxPrice
      ? parseInt(
          Array.isArray(sp.maxPrice) ? sp.maxPrice[0] : sp.maxPrice,
          10
        ) || undefined
      : undefined,
    type: Array.isArray(sp.type) ? sp.type[0] : sp.type || undefined,
    fuelType: Array.isArray(sp.fuelType)
      ? sp.fuelType[0]
      : sp.fuelType || undefined,
    transmission: Array.isArray(sp.transmission)
      ? sp.transmission[0]
      : sp.transmission || undefined,
  };

  // Remove undefined values to avoid passing empty filters
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  const result = await filter_cars_typed(sp);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6">
      <aside className="md:sticky md:top-24 md:self-start">
        <Filter />
      </aside>
      <main className="flex-1">
        {result.data.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No cars found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {result.data.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default page;
