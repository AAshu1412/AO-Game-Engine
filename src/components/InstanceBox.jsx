import { useBabylon } from "@/babylon/useBabylon"

function InstanceBox() {
    const { babylonInstanceEngine } = useBabylon();

    return (
      <div className="w-full sm:w-[20%] lg:w-[13%] h-screen bg-[#191919] border-[#2cead7] border-r-transparent text-white border-2 flex flex-row justify-center">
       <div className="flex flex-col gap-10 p-4">
       <h1 className="text-lg sm:text-xl font-medium">InstanceBox</h1>
       <div className="flex flex-col items-center gap-5 text-white">
        <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => babylonInstanceEngine.ground()}>
            Ground
        </button>
        <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => { babylonInstanceEngine.box(1); }}>
            Box
        </button>
        <button className="border-2 border-[#2cead7] w-full sm:w-40 lg:w-52 p-2 sm:p-3 hover:bg-red-500 active:bg-red-700 transition duration-300" 
          onClick={() => babylonInstanceEngine.sphere()}>
            Sphere
        </button>
       </div>
       </div>
      </div>
    )
}

export default InstanceBox
