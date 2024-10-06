import { useBabylon } from "@/babylon/useBabylon";
import { useEffect, useState } from "react";
import { Vector3, Color3 } from "@babylonjs/core";

function GroundBuilder({ index, typeOfLight }) {
  const [groundObject, setGroundObject] = useState();
  const [groundGeneralProperty, setGroundGeneralProperty] = useState([]);
  const [groundSetupProperty, setGroundSetupProperty] = useState([]);
  const { allMesh, setAllMesh } = useBabylon();

  useEffect(() => {
    if (index !== null && index !== undefined && allMesh[index]) {
      const GroundObject = allMesh[index];
      setGroundObject(GroundObject);
      const groundGeneralData = [
        { name: "ID", property: GroundObject.id, editable: false },
        { name: "Name", property: GroundObject.name, editable: true },
        { name: "Unique ID", property: GroundObject.uniqueId, editable: false },
        {
          name: "Class",
          property: GroundObject.getClassName(),
          editable: false,
        },

        {
          name: "Parent",
          property: GroundObject.parent ? GroundObject.parent.name : "None",
          editable: false,
        },
        {
          name: "Intensity",
          property: GroundObject.intensity,
          editable: true,
        },
      ];

      const groundSetupData = [
        { name: "Diffuse", property: GroundObject.diffuse, editable: true },
        ...(typeOfLight == "hemisphericlight"
          ? [{ name: "Ground", property: GroundObject.groundColor, editable: true }]
          : []),
        { name: "Specular", property: GroundObject.specular, editable: true },
        { name: "Direction", property: GroundObject.direction, editable: true },
      ];
      setGroundGeneralProperty(groundGeneralData);
      setGroundSetupProperty(groundSetupData);
      console.log(GroundObject.direction.x + "------");
      console.log(GroundObject.diffuse.r + "+++++");
    } else {
      setGroundObject(undefined);
    }
  }, [index, allMesh, setAllMesh]);

  const handleInputChange = (name, value) => {
    console.log(name, value);
    setAllMesh((prevAllMesh) => {
      const mesh = [...prevAllMesh];
      if (name === "Name") mesh[index].name = value;
      if (name === "Intensity") mesh[index].intensity = value;
      if (name === "Diffuse-DR")
        mesh[index].diffuse = new Color3(
          value,
          mesh[index].diffuse.g,
          mesh[index].diffuse.b
        );
      if (name === "Diffuse-DG")
        mesh[index].diffuse = new Vector3(
          mesh[index].diffuse.r,
          value,
          mesh[index].diffuse.b
        );
      if (name === "Diffuse-DB")
        mesh[index].diffuse = new Vector3(
          mesh[index].diffuse.r,
          mesh[index].diffuse.g,
          value
        );
      if (name === "Ground-GR")
        mesh[index].ground = new Color3(
          value,
          mesh[index].ground.g,
          mesh[index].ground.b
        );
      if (name === "Ground-GG")
        mesh[index].ground = new Color3(
          mesh[index].ground.r,
          value,
          mesh[index].ground.b
        );
      if (name === "Ground-GB")
        mesh[index].ground = new Color3(
          mesh[index].ground.r,
          mesh[index].ground.g,
          value
        );
      if (name === "Specular-SR")
        mesh[index].specular = new Color3(
          value,
          mesh[index].specular.g,
          mesh[index].specular.b
        );
      if (name === "Specular-SG")
        mesh[index].specular = new Color3(
          mesh[index].specular.r,
          value,
          mesh[index].specular.b
        );
      if (name === "Specular-SB")
        mesh[index].specular = new Color3(
          mesh[index].specular.r,
          mesh[index].specular.g,
          value
        );
      if (name === "Direction-DX")
        mesh[index].direction = new Vector3(
          value,
          mesh[index].direction.y,
          mesh[index].direction.z
        );
      if (name === "Direction-DY")
        mesh[index].direction = new Vector3(
          mesh[index].direction.x,
          value,
          mesh[index].direction.z
        );
      if (name === "Direction-DZ")
        mesh[index].direction = new Vector3(
          mesh[index].direction.x,
          mesh[index].direction.y,
          value
        );

      return mesh;
    });
  };

  return (
    <>
      {groundObject ? (
        <div className="w-full flex flex-col text-white h-[70vh] overflow-y-scroll">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="bg-[#555555] p-1">
                <h1 className="font-bold text-md">GENERAL</h1>
              </div>
              <div className="flex flex-col">
                {groundGeneralProperty.map((val, key) => {
                  return (
                    <div
                      key={key}
                      className="flex flex-row justify-between p-1 border-b border-[#555555]"
                    >
                      <h1>{val.name}</h1>
                      {val.editable ? (
                        val.name === "Intensity" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
                            }
                          />
                        ) : val.name === "parent_" ? (
                          <input
                            type="number"
                            value={val.property}
                            onChange={(e) =>
                              handleInputChange(val.name, e.target.value)
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
                {groundSetupProperty.map((val, key) => {
                  return (
                    <div
                      key={key}
                      className="flex flex-row justify-between p-1 border-b border-[#555555]"
                    >
                      <h1>{val.name}</h1>
                      {val.editable ? (
                        val.name === "Diffuse" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property.r}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DR`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.g}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DG`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.b}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DB`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                          </div>
                        ) : val.name === "Ground" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property.r}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-GR`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.g}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-GG`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.b}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-GB`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                          </div>
                        ) : val.name === "Specular" ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={val.property.r}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SR`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.g}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SG`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.b}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-SB`,
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
                              value={val.property.x}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DX`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.y}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DY`,
                                  e.target.value
                                )
                              }
                              className="w-32 bg-gray-700 text-white p-1"
                            />
                            <input
                              type="number"
                              value={val.property.z}
                              onChange={(e) =>
                                handleInputChange(
                                  `${val.name}-DZ`,
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
          </div>
        </div>
      ) : (
        <div className="bg-gray-500 text-white">No object selected</div>
      )}
    </>
  );
}

export default GroundBuilder;
