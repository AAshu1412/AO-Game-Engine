import { useBabylon } from "@/babylon/useBabylon";
import { useEffect, useState } from "react";

function GroundBuilder({ index }) {
  const [groundObject, setGroundObject] = useState();
  const [groundGeneralProperty, setGroundGeneralProperty] = useState([]);
  const { allMesh } = useBabylon();

  // State to manage the editable properties
  const [editableProperties, setEditableProperties] = useState({});

  useEffect(() => {
    if (index !== null && index !== undefined && allMesh[index]) {
      const GroundObject = allMesh[index];
      setGroundObject(GroundObject);
      const data = [
        { name: "ID", property: GroundObject.id, editable: false },
        { name: "Name", property: GroundObject.name, editable: true }, // Editable
        { name: "Unique ID", property: GroundObject.uniqueId, editable: false },
        { name: "Class", property: GroundObject.getClassName(), editable: false },
        { name: "Vertices", property: GroundObject.getTotalVertices(), editable: false },
        { name: "Faces", property: GroundObject.face, editable: false },
        { name: "Sub-meshes", property: GroundObject.subMeshes.length, editable: false },
        {
          name: "Parent",
          property: GroundObject.parent ? GroundObject.parent.name : "None",
          editable: false,
        },
        {
          name: "Is enabled",
          property: GroundObject.isEnabled(),
          editable: true, // Editable
        },
        {
          name: "Is pickable",
          property: GroundObject.isPickable,
          editable: true, // Editable
        },
        {
          name: "Active Material",
          property: GroundObject.material
            ? GroundObject.material.getActiveTextures().length
            : "None",
          editable: false,
        },
      ];

      setGroundGeneralProperty(data);
    } else {
      setGroundObject(undefined); // Reset if index is invalid
    }
  }, [index, allMesh]);

  const handleInputChange = (name, value) => {
    // Update editableProperties state based on input change
    setEditableProperties((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If "Name" is changed, you may want to also update groundObject directly or implement a method to do so.
    if (name === "Name") {
      setGroundObject((prev) => ({ ...prev, name: value })); // Assuming you can modify the name like this
    }
  };

  return (
    <>
      {groundObject ? (
        <div className="w-full flex flex-col text-white">
          <div className="flex flex-col">
            <div className="bg-[#555555] p-1">
              <h1 className="font-bold text-md">GENERAL</h1>
            </div>
            <div className="flex flex-col">
              {groundGeneralProperty.map((val, key) => {
                return (
                  <div key={key} className="flex flex-row justify-between p-1 border-b border-[#555555]">
                    <h1>{val.name}</h1>
                    {val.editable ? (
                      // Render editable inputs based on property
                      val.name === "Is enabled" ? (
                        <input
                          type="checkbox"
                          checked={editableProperties[val.name] ?? val.property}
                          onChange={(e) => handleInputChange(val.name, e.target.checked)}
                        />
                      ) : val.name === "Is pickable" ? (
                        <input
                          type="checkbox"
                          checked={editableProperties[val.name] ?? val.property}
                          onChange={(e) => handleInputChange(val.name, e.target.checked)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editableProperties[val.name] ?? val.property}
                          onChange={(e) => handleInputChange(val.name, e.target.value)}
                          className="bg-gray-700 text-white p-1"
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
      ) : (
        <div className="bg-gray-500 text-white">No object selected</div>
      )}
    </>
  );
}

export default GroundBuilder;
