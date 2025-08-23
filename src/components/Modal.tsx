import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog modal>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default">
            Book Now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Car</DialogTitle>
            <DialogDescription>
              Fill in the details below to book your car.
            </DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
