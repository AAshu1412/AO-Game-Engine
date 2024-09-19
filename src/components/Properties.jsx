import { useBabylon } from "@/babylon/useBabylon";
import { useEffect } from "react";

function Properties() {

    const {babylonInstanceEngine} = useBabylon();

    // useEffect(()=>{
    //     babylonInstanceEngine.debu();
    // },[])

    return (
      <div className="w-[18%] h-screen bg-orange-600">
       Properties
       {/* <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" /> */}
      </div>
    )
  }
  
  export default Properties
  