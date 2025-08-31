import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export function Modal({
  children,
  className,
  type,
}: {
  children: React.ReactNode;
  className?: string;
  type: "booking" | "search";
}) {
  return (
    <Dialog modal>
      {type === "search" ? (
        <DialogTrigger>
          <Input
            className="cursor-pointer focus:border-none focus:ring-0 w-48 md:w-64 placeholder:text-shadow-xs"
            placeholder="Search cars by brand, model, body type..."
            readOnly
          />
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="w-full">Book Now</Button>
        </DialogTrigger>
      )}
      <DialogOverlay>
        <DialogContent
          className={cn(
            "w-fit h-fit",
            "min-w-[600px] max-w-[95vw]",
            "min-h-[400px] max-h-[90vh]",
            "overflow-y-scroll overflow-x-hidden",
            "p-6",
            className
          )}
          data-lenis-prevent
        >
          <DialogHeader className="pb-4">
            <DialogTitle>
              {type === "search" ? "Search Cars" : "Book Your Car"}
            </DialogTitle>
            <DialogDescription>
              {type === "search"
                ? "Find the perfect car for your trip."
                : "Fill in the details below to book your car."}
            </DialogDescription>
          </DialogHeader>

          {/* Content container with proper spacing */}
          <div className={cn("flex-1 overflow-y-auto p-5")}>{children}</div>

          <DialogFooter className="pt-4 mt-6 border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
