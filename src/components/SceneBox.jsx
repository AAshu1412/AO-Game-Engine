// import { FreeCamera, Vector3, HemisphericLight, MeshBuilder,DebugLayer} from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import { useEffect, useRef } from "react";
// import { Inspector } from 'babylonjs';
// let box;

// const onSceneReady = (scene) => {
//   // This creates and positions a free camera (non-mesh)
//   const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

//   // This targets the camera to scene origin
//   camera.setTarget(Vector3.Zero());

//   const canvas = scene.getEngine().getRenderingCanvas();

//   // This attaches the camera to the canvas
//   camera.attachControl(canvas, true);

//   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//   const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

//   // Default intensity is 1. Let's dim the light a small amount
//   light.intensity = 0.7;

//   // Our built-in 'box' shape.
//   box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

//   // Move the box upward 1/2 its height
//   box.position.y = 1;

//   // Our built-in 'ground' shape.
//   MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

// //   const deb=new DebugLayer(scene);
// //   deb.show( {
// //     overlay: false,
// //     showExplorer: true,
// //     showInspector: true,
// //     embedMode: false,
// //     handleResize: true,
// //     enablePopup: true,
// // });
// // console.log("Isvibible", JSON.stringify(deb.isVisible()));
// // scene.debugLayer.show();
// new DebugLayer(scene).show({embedMode:true})

// };

// /**
//  * Will run on every frame render.  We are spinning the box on y-axis.
//  */
// const onRender = (scene) => {
//   if (box !== undefined) {
//     const deltaTimeInMillis = scene.getEngine().getDeltaTime();

//     const rpm = 10;
//     box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
//   }
// };

// function SceneBox() {

//     return (
//       <div className="w-[83%] h-screen bg-red-600">
//        SceneBox
//        <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" className="w-[100%]"/>
//       </div>
//     )
//   }

//   export default SceneBox

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useBabylon } from "@/babylon/useBabylon";
import { MeshBuilder } from "babylonjs";

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
      // babylonInstanceEngine.debu();
      babylonInstanceEngine.gizmo();
      // babylonInstanceEngine.gizmo();
      // babylonInstanceEngine.ground();
      // babylonInstanceEngine.box(1);
      // baby.box(4);

      // #075b3e
      //#2cead7
    }
  }, []);

  return (
    <div className="w-[83%] h-screen bg-black border-[#2cead7] border-2 ">
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
