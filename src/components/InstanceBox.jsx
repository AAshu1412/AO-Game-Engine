import { useBabylon } from "@/babylon/useBabylon";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import { MeshBuilder, HemisphericLight, Vector3, DirectionalLight } from "@babylonjs/core";

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
      <div className="flex flex-col gap-10 w-full ">
        <h1 className="text-lg sm:text-xl font-medium p-4 ">InstanceBox</h1>
        <div className="flex flex-col gap-4 w-full ">
        <div className="bg-[#555555] p-1 ">
          <h1 className="font-bold text-md">MESH BUILDER</h1>
        </div>
        <div className="flex flex-col items-center gap-5 text-white">
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const ground = MeshBuilder.CreateGround(
                "ground",
                { width: 6, height: 6 },
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, ground]);
            }}
          >
            Ground
          </button>
          {/* <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => { babylonInstanceEngine.box(1); }}>
            Box
        </button> */}
          {/* <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const box = new Box(scene);
              setAllMesh((prevMesh) => [...prevMesh, box]);
            }}
          >
            Box
          </button> */}
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              // const scene = babylonInstanceEngine.returnScene();
              // const box = new Box(scene);
              const scene = babylonInstanceEngine.returnScene();
              const box = MeshBuilder.CreateBox(
                "box",
                { size: 2, updatable: true },
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, box]);
            }}
          >
            Box
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const sphere = MeshBuilder.CreateSphere(
                "sphere",
                { diameter: 2, segments: 32 },
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, sphere]);
            }}
          >
            Sphere
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const cylinder = MeshBuilder.CreateCylinder(
                "cylinder",
                {},
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, cylinder]);
            }}
          >
            Cylinder
          </button>
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const cone = MeshBuilder.CreateCylinder(
                "cylinder",
                { diameterTop: 0 },
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, cone]);
            }}
          >
            Cone
          </button>
        </div>
        </div>
        <div className="flex flex-col gap-4 w-full ">
        <div className="bg-[#555555] p-1 ">
          <h1 className="font-bold text-md">CAMERAS</h1>
        </div>
        <div className="flex flex-col items-center gap-5 text-white">
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const hemisphericLight = new HemisphericLight(
                "hemisphericLight",
                new Vector3(0, 1, 0),
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, hemisphericLight]);
            }}
          >
            Hemispheric 
          </button>
          {/* <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => { babylonInstanceEngine.box(1); }}>
            Box
        </button> */}
          {/* <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              const scene = babylonInstanceEngine.returnScene();
              const box = new Box(scene);
              setAllMesh((prevMesh) => [...prevMesh, box]);
            }}
          >
            Box
          </button> */}
          <button
            className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300"
            onClick={() => {
              // const scene = babylonInstanceEngine.returnScene();
              // const box = new Box(scene);
              const scene = babylonInstanceEngine.returnScene();
              const directionLight = new DirectionalLight(
                "directionLight",
                new Vector3(0, 1, 0),
                scene
              );
              setAllMesh((prevMesh) => [...prevMesh, directionLight]);
            }}
          >
            Directional
          </button>
         
        </div>
        </div>
        
        
      </div>
    </div>
  );
}

export default InstanceBox;
