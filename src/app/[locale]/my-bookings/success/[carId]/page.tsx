import BookingSuccessComponent from "@/components/BookingSuccessComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ carId: string }>;
}) {
  const { carId } = await params;
  return (
    <div>
      <BookingSuccessComponent carId={carId} seconds={5} />
    </div>
  );
}
