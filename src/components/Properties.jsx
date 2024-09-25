import { useBabylon } from "@/babylon/useBabylon";

function Properties() {
  const { babylonInstanceEngine } = useBabylon();

  return <div className="w-[18%] h-screen bg-orange-600">Properties</div>;
}

export default Properties;
