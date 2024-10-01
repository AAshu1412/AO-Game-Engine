import { useBabylon } from "@/babylon/useBabylon";
import { useEffect, useState } from "react";
import { Vector3 } from "@babylonjs/core";

function CommonMeshBuilder({ index }) {
  const [commonObject, setCommonObject] = useState();
  const [commonGeneralProperty, setCommonGeneralProperty] = useState([]);
  const [commonTransformationsProperty, setCommonTransformationsProperty] =
    useState([]);
  const [commonDisplayProperty, setCommonDisplayProperty] = useState([]);
  const { allMesh, setAllMesh, gizmoUpdate } = useBabylon();

  useEffect(()=>{
    if (index !== null && index !== undefined && allMesh[index]) {
        const CommonObject = allMesh[index];
    const commonTransformerData = [
        { name: "Position", property: CommonObject.position, editable: true },
        { name: "Rotation", property: CommonObject.rotation, editable: true },
        { name: "Scaling", property: CommonObject.scaling, editable: true },
      ];
      setCommonTransformationsProperty(commonTransformerData);
    }
  },[gizmoUpdate]);

  useEffect(() => {
    if (index !== null && index !== undefined && allMesh[index]) {
      const CommonObject = allMesh[index];
      setCommonObject(CommonObject);
      const commonGeneralData = [
        { name: "ID", property: CommonObject.id, editable: false },
        { name: "Name", property: CommonObject.name, editable: true },
        { name: "Unique ID", property: CommonObject.uniqueId, editable: false },
        {
          name: "Class",
          property: CommonObject.getClassName(),
          editable: false,
        },
        {
          name: "Vertices",
          property: CommonObject.getTotalVertices(),
          editable: false,
        },
        { name: "Faces", property: CommonObject.face, editable: false },
        {
          name: "Sub-meshes",
          property: CommonObject.subMeshes.length,
          editable: false,
        },
        {
          name: "Parent",
          property: CommonObject.parent ? CommonObject.parent.name : "None",
          editable: false,
        },
        {
          name: "Is enabled",
          property: CommonObject.isEnabled(),
          editable: true,
        },
        {
          name: "Is pickable",
          property: CommonObject.isPickable,
          editable: true,
        },
        {
          name: "Active Material",
          property: CommonObject.material
            ? CommonObject.material.getActiveTextures().length
            : "None",
          editable: false,
        },
      ];

      const commonTransformerData = [
        { name: "Position", property: CommonObject.position, editable: true },
        { name: "Rotation", property: CommonObject.rotation, editable: true },
        { name: "Scaling", property: CommonObject.scaling, editable: true },
      ];

      const commonDisplayData = [
        {
          name: "Visibility",
          property: CommonObject.visibility,
          editable: true,
        },
        {
          name: "Orientation",
          property: CommonObject.sideOrientation,
          editable: true,
        },
        {
          name: "Alpha Index",
          property: CommonObject.alphaIndex,
          editable: true,
        },
        {
          name: "Receive Shadows",
          property: CommonObject.receiveShadows,
          editable: true,
        },
        {
          name: "Infinite Distance",
          property: CommonObject.infiniteDistance,
          editable: true,
        },
        {
          name: "Rendering Group ID",
          property: CommonObject.renderingGroupId,
          editable: true,
        },
        {
          name: "Layer Mask",
          property: CommonObject.layerMask,
          editable: true,
        },
      ];

      setCommonGeneralProperty(commonGeneralData);
      setCommonTransformationsProperty(commonTransformerData);
      setCommonDisplayProperty(commonDisplayData);
      // console.log(CommonObject.name+"------")
    } else {
      setCommonObject(undefined);
    }
  }, [index, allMesh, setAllMesh]);

  const handleInputChange = (name, value) => {
    console.log(name, value);
    setAllMesh((prevAllMesh) => {
      const mesh = [...prevAllMesh];

      if (name === "Name") mesh[index].name = value;
      if (name === "Is enabled") mesh[index].setEnabled(value);
      if (name === "Is pickable") mesh[index].isPickable = value;
      if (name === "Position-PX") mesh[index].position = new Vector3(value,mesh[index].position._y,mesh[index].position._z);
      if (name === "Position-PY") mesh[index].position = new Vector3(mesh[index].position._x,value,mesh[index].position._z);
      if (name === "Position-PZ") mesh[index].position = new Vector3(mesh[index].position._x,mesh[index].position._y,value);
      if (name === "Rotation-RX") mesh[index].rotation = new Vector3(value,mesh[index].rotation._y,mesh[index].rotation._z);
      if (name === "Rotation-RY") mesh[index].rotation = new Vector3(mesh[index].rotation._x,value,mesh[index].rotation._z);
      if (name === "Rotation-RZ") mesh[index].rotation = new Vector3(mesh[index].rotation._x,mesh[index].rotation._y,value);
      if (name === "Scaling-SX") mesh[index].scaling = new Vector3(value,mesh[index].scaling._y,mesh[index].scaling._z);
      if (name === "Scaling-SY") mesh[index].scaling = new Vector3(mesh[index].scaling._x,value,mesh[index].scaling._z);
      if (name === "Scaling-SZ") mesh[index].scaling = new Vector3(mesh[index].scaling._x,mesh[index].scaling._y,value);
      if (name === "Visibility") mesh[index].visibility = value;
      if (name === "Orientation") mesh[index].sideOrientation = value;
      if (name === "Alpha Index") mesh[index].alphaIndex = value;
      if (name === "Receive Shadows") mesh[index].receiveShadows = value;
      if (name === "Infinite Distance") mesh[index].infiniteDistance = value;
      if (name === "Rendering Group ID") mesh[index].renderingGroupId = value;
      if (name === "Layer Mask") mesh[index].layerMask = value;

      return mesh;
    });
  };

  return (
    <>
      {commonObject ? (
        <div className="w-full flex flex-col text-white h-[70vh] overflow-y-scroll">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="bg-[#555555] p-1">
                <h1 className="font-bold text-md">GENERAL</h1>
              </div>
              <div className="flex flex-col">
                {commonGeneralProperty.map((val, key) => {
                  return (
                    <div
                      key={key}
                      className="flex flex-row justify-between p-1 border-b border-[#555555]"
                    >
                      <h1>{val.name}</h1>
                      {val.editable ? (
                        val.name === "Is enabled" ? (
                          <input
                            type="checkbox"
                            checked={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.checked)
                            }
                          />
                        ) : val.name === "Is pickable" ? (
                          <input
                            type="checkbox"
                            checked={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.checked)
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        )
                      ) : (
                        <h1>{val.property}</h1>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#555555] p-1">
                <h1 className="font-bold text-md">TRANSFORMS</h1>
              </div>
              <div className="flex flex-col">
                {commonTransformationsProperty.map((val, key) => {
                  return (
                    <div
                      key={key}
                      className="flex flex-row justify-between p-1 border-b border-[#555555]"
                    >
                      <h1>{val.name}</h1>
                      {val.editable ? (
                        val.name === "Position" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property._x}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-PX`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._y}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-PY`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._z}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-PZ`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                          </div>
                        ) : val.name === "Rotation" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property._x * 57.2958}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-RX`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._y * 57.2958}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-RY`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._z * 57.2958}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-RZ`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property._x}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SX`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._y}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SY`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property._z}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SZ`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                          </div>
                        )
                      ) : (
                        <h1>0,0,0</h1>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#555555] p-1">
                <h1 className="font-bold text-md">DISPLAY</h1>
              </div>
              <div className="flex flex-col">
                {commonDisplayProperty.map((val, key) => {
                  return (
                    <div
                      key={key}
                      className="flex flex-row justify-between p-1 border-b border-[#555555]"
                    >
                      <h1 className="w-16">{val.name}</h1>
                      {val.editable ? (
                        val.name === "Visibility" ? (
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        ) : val.name === "Orientation" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        ) : val.name === "Alpha Index" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        ) : val.name === "Receive Shadows" ? (
                          <input
                            type="checkbox"
                            checked={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.checked)
                            }
                          />
                        ) : val.name === "Infinite Distance" ? (
                          <input
                            type="checkbox"
                            checked={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.checked)
                            }
                          />
                        ) : val.name === "Rendering Group ID" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        ) : val.name === "Layer Mask" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                            className="w-32 bg-gray-700 text-white p-1"
                          />
                        )
                      ) : (
                        <h1>{val.property}</h1>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-500 text-white">No object selected</div>
      )}
    </>
  );
}

export default CommonMeshBuilder;
