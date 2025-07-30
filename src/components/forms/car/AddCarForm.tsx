"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CarFormData,
  CarFormValidationSchema,
} from "@/validation/car-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Car,
  DollarSign,
  Calendar,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { add_car } from "@/actions/car.actions";
import { toast } from "sonner";

const AddCarForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CarFormData>({
    resolver: zodResolver(CarFormValidationSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      description: "",
      pricePerDay: 0,
      images: [],
    },
  });

  const onSubmit = async (data: CarFormData) => {
    setIsLoading(true);
    try {
      const result = await add_car(data);
      toast.success(result.message);
      form.reset();
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add car");
    } finally {
      setIsLoading(false);
    }
  };

  const t = useTranslations("AddCarForm");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("title") || "Add New Car"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t("description") ||
            "Fill in the details to add a new car to the rental fleet"}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Brand Field */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("brand") || "Brand"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={
                        t("brandPlaceholder") ||
                        "Enter car brand (e.g., Toyota, BMW)"
                      }
                      className="pl-11 h-12 rounded-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* Model Field */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("model") || "Model"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={
                        t("modelPlaceholder") ||
                        "Enter car model (e.g., Camry, X5)"
                      }
                      className="pl-11 h-12 rounded-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* Year Field */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("year") || "Year"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={
                        t("yearPlaceholder") || "Enter year (e.g., 2023)"
                      }
                      className="pl-11 h-12 rounded-lg"
                      maxLength={4}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* Price Per Day Field */}
          <FormField
            control={form.control}
            name="pricePerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("pricePerDay") || "Price Per Day"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder={
                        t("pricePlaceholder") || "Enter daily rental price"
                      }
                      className="pl-11 h-12 rounded-lg"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("description placeholder") || "Description"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      placeholder={
                        t("descriptionPlaceholder") ||
                        "Describe the car features, condition, etc."
                      }
                      className="pl-11 min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* Images Field */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  {t("images") || "Car Images"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="pl-11 h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
                <p className="text-xs text-gray-500">
                  {t("imageHint") ||
                    "Upload multiple images. Max 5MB per image."}
                </p>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("adding") || "Adding Car..."}
              </>
            ) : (
              t("addCar") || "Add Car"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCarForm;
