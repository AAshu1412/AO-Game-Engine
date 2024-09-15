import { useBabylon } from "@/babylon/useBabylon"


function InstanceBox() {
    const {babylonInstanceEngine} = useBabylon();

    return (
      <div className="w-[13%] h-screen bg-pink-600 flex flex-row justify-center">
       <div className="flex flex-col gap-10">
       <h1 className="text-xl font-medium">InstanceBox</h1>
       <div className="flex flex-col items-center gap-5">
        {/* <button className="border-2 border-black rounded-md p-5" onClick={()=>babylonInstanceEngine.ground()}>
            Ground
        </button>
        <button className="border-2 border-black rounded-md p-5" onClick={()=>{babylonInstanceEngine.gizmo(); babylonInstanceEngine.box(1);  }}>
            Box
        </button>
        <button className="border-2 border-black rounded-md p-5" onClick={()=>babylonInstanceEngine.sphere()}>
            Sphere
        </button> */}
         <button className="border-2 border-black rounded-md p-5">
            Ground
        </button>
        <button className="border-2 border-black rounded-md p-5" >
            Box
        </button>
        <button className="border-2 border-black rounded-md p-5" >
            Sphere
        </button>

       </div>
       </div>
      
       {/* <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" /> */}
      </div>
    )
  }
  
  export default InstanceBox
  