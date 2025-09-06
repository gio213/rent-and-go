"use client";
import React, { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Filter as FilterIcon } from "lucide-react";

import {
  car_fuel_types,
  car_types,
  cart_transmission_types,
} from "@/constants/filter";
import { Button } from "./ui/button";

const Filter = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleCheckboxChange = useCallback(
    (paramName: string, checked: boolean) => {
      if (checked) {
        // Using the Next.js documented pattern
        router.push(pathname + "?" + createQueryString(paramName, "true"));
      } else {
        // For unchecking, we need to remove the parameter
        const params = new URLSearchParams(searchParams.toString());
        params.delete(paramName);
        router.push(pathname + "?" + params.toString());
      }
    },

    [searchParams, pathname, router, createQueryString]
  );

  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.forEach((_, key) => {
      params.delete(key);
    });
    router.push(pathname + "?" + params.toString());
  }, [searchParams, pathname, router]);

  return (
    <Card
      className="w-full md:h-[calc(100vh-6rem)] self-start"
      data-lenis-prevent
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FilterIcon className="h-4 w-4" />
          Filter Options
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="p-0 md:h-[calc(100vh-6rem-3rem)]">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-6">
            {/* Car Types Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Car Types</h3>
              <div className="space-y-3">
                {car_types.map((car_type) => (
                  <div
                    key={car_type.value}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={car_type.value}
                      checked={searchParams.get(car_type.value) === "true"}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(car_type.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={car_type.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {car_type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Transmission Types Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Transmission</h3>
              <div className="space-y-3">
                {cart_transmission_types.map((transmission) => (
                  <div
                    key={transmission.value}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={transmission.value}
                      checked={searchParams.get(transmission.value) === "true"}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          transmission.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={transmission.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {transmission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Fuel Types Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Fuel Type</h3>
              <div className="space-y-3">
                {car_fuel_types.map((fuel_type) => (
                  <div
                    key={fuel_type.value}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={fuel_type.value}
                      checked={searchParams.get(fuel_type.value) === "true"}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          fuel_type.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={fuel_type.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {fuel_type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 pt-0">
        {/* if no filters are applied, disable the button */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearAll}
            variant="destructive"
            className="w-full "
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Filter;
