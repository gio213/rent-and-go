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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ImageIcon,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { add_car } from "@/actions/car.actions";
import { toast } from "sonner";

const AddCarForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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
    const addCarPromise = add_car(data);

    toast.promise(addCarPromise, {
      loading: "Adding car...",
      success: (result) => {
        form.reset();
        setSelectedImages([]);
        setIsLoading(false);
        return result.message;
      },
      error: (error) => {
        setIsLoading(false);
        return error.message;
      },
      position: "top-right",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    form.setValue("images", files);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    form.setValue("images", newImages);
  };

  const t = useTranslations("AddCarForm");

  return (
    <div className="max-w-4xl mx-auto p-6  space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Car className="h-6 w-6" />
            {t("title") || "Add New Car"}
          </CardTitle>
          <CardDescription>
            {t("description") ||
              "Fill in the details to add a new car to the rental fleet"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Field */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("brand") || "Brand"}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder={
                                t("brandPlaceholder") ||
                                "Enter car brand (e.g., Toyota, BMW)"
                              }
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Model Field */}
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("model") || "Model"}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder={
                                t("modelPlaceholder") ||
                                "Enter car model (e.g., Camry, X5)"
                              }
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Year Field */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("year") || "Year"}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder={
                                t("yearPlaceholder") ||
                                "Enter year (e.g., 2023)"
                              }
                              className="pl-10"
                              maxLength={4}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price Per Day Field */}
                  <FormField
                    control={form.control}
                    name="pricePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("pricePerDay") || "Price Per Day"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder={
                                t("pricePlaceholder") ||
                                "Enter daily rental price"
                              }
                              className="pl-10"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Description
                </h3>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("carDescription") || "Car Description"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Textarea
                            placeholder={
                              t("descriptionPlaceholder") ||
                              "Describe the car features, condition, amenities, etc."
                            }
                            className="pl-10 min-h-[120px] resize-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Car Images
                </h3>

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("images") || "Upload Images"}</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="relative">
                            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              className="pl-10 cursor-pointer file:cursor-pointer"
                              onChange={handleImageChange}
                            />
                          </div>

                          {/* Selected Images Preview */}
                          {selectedImages.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">
                                Selected Images ({selectedImages.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedImages.map((file, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-2 px-3 py-1"
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    <span className="text-xs max-w-[100px] truncate">
                                      {file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        {t("imageHint") ||
                          "Upload multiple images. Max 5MB per image, recommended formats: JPG, PNG, WebP."}
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("adding") || "Adding Car..."}
                    </>
                  ) : (
                    <>
                      <Car className="mr-2 h-4 w-4" />
                      {t("addCar") || "Add Car to Fleet"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCarForm;
