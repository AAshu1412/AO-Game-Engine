import { useBabylon } from "@/babylon/useBabylon";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";

function InstanceBox() {
  const {
    babylonInstanceEngine,
    allMesh,
    setAllMesh,
    Box,
    Sphere,
    Ground,
    Cylinder,
    Cone,
    HemisphericLights,
  } = useBabylon();

  return (
    <div className="w-full sm:w-[20%] lg:w-[13%] h-screen bg-[#333333] border-[#2cead7] border-r-transparent text-white border-2 flex flex-row justify-center">
      <div className="flex flex-col gap-10 p-4">
        <h1 className="text-lg sm:text-xl font-medium">InstanceBox</h1>
        <div className="flex flex-col items-center gap-5 text-white">
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const ground = new Ground(scene);
              setAllMesh((prevMesh) => [...prevMesh, ground]);
            }}
          >
            Ground
          </button>
          {/* <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => { babylonInstanceEngine.box(1); }}>
            Box
        </button> */}
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const box = new Box(scene);
              setAllMesh((prevMesh) => [...prevMesh, box]);
            }}
          >
            Box
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const sphere = new Sphere(scene);
              setAllMesh((prevMesh) => [...prevMesh, sphere]);
            }}
          >
            Sphere
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const cylinder = new Cylinder(scene);
              setAllMesh((prevMesh) => [...prevMesh, cylinder]);
            }}
          >
            Cylinder
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const cone = new Cone(scene);
              setAllMesh((prevMesh) => [...prevMesh, cone]);
            }}
          >
            Cone
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstanceBox;
