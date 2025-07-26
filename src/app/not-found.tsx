import NotFoundFuzzyText from "@/components/NotFoundFuzzyText";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <NotFoundFuzzyText
        baseIntensity={0.18}
        children="Not Found"
        classname="font-finger"
        colorClass="text-yellow-500"
      />
    </div>
  );
}
