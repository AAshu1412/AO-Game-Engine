import { useEffect, useRef } from "react";
import { useBabylon } from "../babylon/useBabylon";

function SceneBox() {
  const { babylonInstanceEngine } = useBabylon();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // const baby=new BabylonInstanceEngine(canvas);
      babylonInstanceEngine.initialize(canvas);
      babylonInstanceEngine.run();
      babylonInstanceEngine.resize();
      babylonInstanceEngine.gizmo();
      // babylonInstanceEngine.debu();
      // babylonInstanceEngine.gizmo();
      // babylonInstanceEngine.ground();
      // babylonInstanceEngine.box(1);
      // baby.box(4);

      // #075b3e
      //#2cead7
    }
  }, []);

  return (
    <div className="w-[72%] h-screen bg-black border-[#2cead7] border-2 ">
      <div className="flex flex-row justify-between px-10">
        <h1 className="font-medium text-white">SceneBox</h1>
        <button
          className="border-2 border-[#2cead7] w-52 hover:bg-red-500 active:bg-red-700 transition duration-300 font-medium text-white"
          onClick={() => babylonInstanceEngine.debu()}
        >
          Properties
        </button>
      </div>

      <canvas ref={canvasRef} className="w-[100%] h-[600px]" />
    </div>
  );
}

export default SceneBox;
