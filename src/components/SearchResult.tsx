"use client";
import { useSearch } from "@/context/search-context";
import { Loader2, Users, DoorOpen, Fuel, Search, Car } from "lucide-react";
import { CarForRent } from "@/generated/prisma";
import { Input } from "./ui/input";
import Link from "next/link";
import { useLocale } from "next-intl";
import { DialogClose } from "@/components/ui/dialog";

export function SearchResults() {
  const {
    setQuery,
    results,
    isLoading,
    error,
    query,
  }: {
    query: string;
    setQuery: (query: string) => void;
    results: CarForRent[];
    isLoading: boolean;
    error: string | null;
  } = useSearch();

  const locale = useLocale();

  if (error) {
    return <div className="p-4 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed search input at top */}
      <div className="flex-shrink-0 mb-4">
        <Input
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cars..."
          className="w-full"
        />
      </div>

      {/* Scrollable results area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6" />
            <span className="ml-2 text-sm">Searching...</span>
          </div>
        ) : query && results.length === 0 ? (
          // Show "nothing found" message only when user has searched but no results
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Car className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-medium mb-2">No cars found</h3>
            <p className="text-sm  max-w-sm">
              We couldn't find any cars matching "{query}". Try searching with
              different keywords or check your spelling.
            </p>
          </div>
        ) : !query ? (
          // Show initial state when no search query
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-16 w-16  mb-4" />
            <h3 className="text-lg font-medium mb-2">Start your search</h3>
            <p className="text-sm  max-w-sm">
              Enter a car brand, model, or any keyword to find the perfect
              vehicle for your needs.
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {/* pr-2 for scrollbar spacing */}
            {results.map((car) => (
              <DialogClose key={car.id} asChild>
                <Link
                  href={`/${locale}/car-detail/${car.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-3 hover:opacity-80 rounded cursor-pointer border transition-opacity">
                    {car.image && car.image.length > 0 && (
                      <div className="w-16 h-12 overflow-hidden rounded flex-shrink-0">
                        <img
                          src={car.image[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm truncate hover:text-ring">
                            {car.brand} {car.model}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            {car.year && <span>{car.year}</span>}
                            {car.type && <span>• {car.type}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm">
                            ${car.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs">
                        {car.seats && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{car.seats}</span>
                          </div>
                        )}
                        {car.doors && (
                          <div className="flex items-center gap-1">
                            <DoorOpen className="h-3 w-3" />
                            <span>{car.doors}</span>
                          </div>
                        )}
                        {car.fuelType && (
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            <span>{car.fuelType}</span>
                          </div>
                        )}
                        {car.transmission && <span>{car.transmission}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </DialogClose>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
