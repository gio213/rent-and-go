// components/CarsWithLoadMore.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { filter_cars_typed } from "@/actions/car.actions";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CarsWithLoadMoreProps {
  initialCars: any[];
  initialPage: number;
  initialHasMore: boolean;
}

export default function CarsWithLoadMore({
  initialCars,
  initialPage,
  initialHasMore,
}: CarsWithLoadMoreProps) {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState(initialCars);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // Convert URLSearchParams to filters object
  const getCurrentFilters = () => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      filters[key] = value;
    });
    return filters;
  };

  // Handle filter changes - reset cars and reload from page 1
  useEffect(() => {
    const resetAndReload = async () => {
      setFiltersLoading(true);
      try {
        const currentFilters = getCurrentFilters();
        console.log("Filters changed, reloading cars:", currentFilters);

        const result = await filter_cars_typed({
          page: 1,
          limit: 4,
          ...currentFilters,
        });

        if (result.success) {
          setCars(result.data);
          setPage(1);
          setHasMore(result.hasMore || false);
        } else {
          console.error("Error reloading cars:", result.error);
        }
      } catch (error) {
        console.error("Error reloading cars:", error);
      } finally {
        setFiltersLoading(false);
      }
    };

    resetAndReload();
  }, [searchParams]); // Trigger when URL search params change

  const loadMore = async () => {
    if (loading || !hasMore || filtersLoading) return;

    setLoading(true);
    try {
      const currentFilters = getCurrentFilters();
      const nextPage = page + 1;

      console.log("Loading more cars:", {
        page: nextPage,
        filters: currentFilters,
      });

      const result = await filter_cars_typed({
        page: nextPage,
        limit: 4,
        ...currentFilters,
      });

      if (result.success) {
        setCars((prev) => [...prev, ...result.data]);
        setPage(nextPage);
        setHasMore(result.hasMore || false);
      } else {
        console.error("Error loading more cars:", result.error);
      }
    } catch (error) {
      console.error("Error loading more cars:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state when filters are changing
  if (filtersLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={loading || filtersLoading}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${cars.length} shown)`
            )}
          </Button>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && cars.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-muted-foreground">
            You've reached the end! No more cars to show.
          </p>
        </div>
      )}

      {/* No results message */}
      {cars.length === 0 && !filtersLoading && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No cars found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </>
  );
}
