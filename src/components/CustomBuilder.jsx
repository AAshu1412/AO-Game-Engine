import React, { useEffect, useState } from "react";
import { useBabylon } from "../babylon/useBabylon";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import GroundBuilder from "../builder_mesh/GroundBuilder";

function CustomBuilder() {
  const { allMesh } = useBabylon();
  const [treeViewData, setTreeViewData] = useState({
    id: 0,
    name: "Scene",
    children: [],
  });
  const [saveIndex, setSaveIndex] = useState(null);

  const addChildToParent = (tree, parentId, child) => {
    if (tree.id === parentId) {
      tree.children = [...tree.children, child];
    } else if (tree.children) {
      tree.children.forEach((childNode) => {
        addChildToParent(childNode, parentId, child);
      });
    }
  };

  const buildTreeViewData = () => {
    const updatedTreeViewData = { id: 0, name: "Scene", children: [] };

    allMesh.forEach((val, index) => {
      // const uniqueId = val.getUniqueId();
      // const parentId = val.getParentId();
      // const meshName = val.getName();

      const uniqueId = val.uniqueId;
      const parent = val.parent;
      var parentId = 0;
      if (parent == null) {
        parentId = 0;
      } else {
        parentId = parent.uniqueId;
      }
      const meshName = val.name;
      const newNode = {
        id: uniqueId,
        name: meshName,
        _index: index,
        children: [],
        isOpen: false,
      };

      const nodeExists = updatedTreeViewData.children.some(
        (child) => child.id === uniqueId
      );
      if (!nodeExists) {
        if (parentId === 0) {
          updatedTreeViewData.children.push(newNode);
        } else {
          addChildToParent(updatedTreeViewData, parentId, newNode);
        }
      }
    });

    return updatedTreeViewData;
  };

  useEffect(() => {
    const newTreeViewData = buildTreeViewData();
    setTreeViewData(newTreeViewData);
  }, [allMesh]);

  const toggleNode = (node) => {
    node.isOpen = !node.isOpen;
    setTreeViewData({ ...treeViewData }); // Trigger re-render
  };

  const handleClick = (node) => {
    console.log(`Clicked on: ${node.name}`);
    // console.log(`Class: ${node}`);
    setSaveIndex(node._index);
  };

  const renderTree = (node) => (
    <div key={node.id} className="pl-4">
      <div
        className={`flex items-center cursor-pointer ${
          node.isOpen ? "text-white bg-[#555555]" : "text-white"
        }`}
        onClick={() => {
          handleClick(node);
        }}
      >
        {node.children.length > 0 && (
          <span className="mr-2" onClick={() => toggleNode(node)}>
            {node.isOpen ? <p className="text-sm font-bold">{"—"}</p>: <p className="text-2xl font-bold">{"+"}</p>}
          </span>
        )}
        {node.name}
      </div>
      {node.isOpen && node.children && (
        <div className="ml-4">{node.children.map(renderTree)}</div>
      )}
    </div>
  );
  console.log(JSON.stringify(treeViewData));
  return (
    <div className="w-[15%] bg-[#333333] border-2 border-red-600">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col overflow-auto">
            <div className="text-lg text-white">Tree View:</div>
            <div >{renderTree(treeViewData)}</div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col overflow-auto">
            <span className=" text-white">Resizable Panel</span>
            <GroundBuilder index={saveIndex} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default CustomBuilder;
