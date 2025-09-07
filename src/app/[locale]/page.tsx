import { filter_cars_typed } from "@/actions/car.actions";
import CarCard from "@/components/CarCard";
import CarsWithLoadMore from "@/components/CarsWithLoadMore";
import Filter from "@/components/Filter";

type SearchParams = {
  minPrice?: string | string[];
  maxPrice?: string | string[];
  type?: string | string[];
  fuelType?: string | string[];
  transmission?: string | string[];
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  console.log("Search params on page:", sp);
  // use whichever your action expects (sp or cleanFilters)
  const result = await filter_cars_typed({
    page: 1,
    limit: 4,
    ...sp,
  });

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-6">
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
          <CarsWithLoadMore
            initialCars={result.data}
            initialPage={result.page || 1}
            initialHasMore={result.hasMore || false}
          />
        )}
      </main>
    </div>
  );
}
