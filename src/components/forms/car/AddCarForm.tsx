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
  Settings,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { add_car } from "@/actions/car.actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      transmission: "",
      fuelType: "",
      seats: 1,
      doors: 1,
      type: "SEDAN",
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Vehicle Identity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Car className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Vehicle Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("brand") || "Brand"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("brandPlaceholder") ||
                              "Enter car brand (e.g., Toyota, BMW)"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("model") || "Model"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("modelPlaceholder") ||
                              "Enter car model (e.g., Camry, X5)"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("type") || "Type"}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a transmission type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value="SEDAN">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="TRUCK">Truck</SelectItem>
                                <SelectItem value="COUPE">Coupe</SelectItem>
                                <SelectItem value="CONVERTIBLE">
                                  Convertible
                                </SelectItem>
                                <SelectItem value="HATCHBACK">
                                  Hatchback
                                </SelectItem>
                                <SelectItem value="MINIVAN">Minivan</SelectItem>
                                <SelectItem value="WAGON">Wagon</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("year") || "Year"}
                        </FormLabel>
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

                  <FormField
                    control={form.control}
                    name="pricePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
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

              {/* Technical Specifications Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Technical Specifications
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("transmission") || "Transmission"}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a transmission type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Transmissions</SelectLabel>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="automatic">
                                  Automatic
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("fuelType") || "Fuel Type"}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Fuel Types</SelectLabel>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="electric">
                                  Electric
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("doors") || "Doors"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2-5"
                            min="1"
                            max="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Capacity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Capacity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("seats") || "Seats"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1-8"
                            min="1"
                            max="8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t("carDescription") || "Car Description"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            t("descriptionPlaceholder") ||
                            "Describe the car features, condition, amenities, etc."
                          }
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Car Images</h3>
                </div>

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t("images") || "Upload Images"}
                      </FormLabel>
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

                          {selectedImages.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-muted-foreground">
                                Selected Images ({selectedImages.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedImages.map((file, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-2 px-3 py-2"
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    <span className="text-xs max-w-[120px] truncate">
                                      {file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="ml-1 hover:text-destructive transition-colors"
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
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("imageHint") ||
                          "Upload multiple images. Max 5MB per image, recommended formats: JPG, PNG, WebP."}
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t">
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
