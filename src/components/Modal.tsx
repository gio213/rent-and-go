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

export function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          Book Now
        </Button>
      </DialogTrigger>
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
          data-lenis-prevent // 👈 HERE
        >
          <DialogHeader className="pb-4">
            <DialogTitle>Book a Car</DialogTitle>
            <DialogDescription>
              Fill in the details below to book your car.
            </DialogDescription>
          </DialogHeader>

          {/* Content container with proper spacing */}
          <div className="flex-1 overflow-y-auto">{children}</div>

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
