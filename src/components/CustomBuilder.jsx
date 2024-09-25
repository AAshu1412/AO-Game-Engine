import React, { useEffect, useState } from "react";
import { useBabylon } from "@/babylon/useBabylon";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

function CustomBuilder() {
  const { allMesh } = useBabylon();
  const [treeViewData, setTreeViewData] = useState({
    id: 0,
    name: "Scene",
    children: [],
  });

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

    allMesh.forEach((val) => {
      const uniqueId = val.getUniqueId();
      const parentId = val.getParentId();
      const meshName = val.getName();

      const newNode = {
        id: uniqueId,
        name: meshName,
        children: [],
        isOpen: false,
      };

      // Check if the node already exists
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
    // Build tree view data from allMesh and set state
    const newTreeViewData = buildTreeViewData();
    setTreeViewData(newTreeViewData);
  }, [allMesh]);

  const toggleNode = (node) => {
    node.isOpen = !node.isOpen;
    setTreeViewData({ ...treeViewData }); // Trigger re-render
  };

  const handleClick = (node) => {
    console.log(`Clicked on: ${node.name}`); // Add your action here
  };

  const renderTree = (node) => (
    <div key={node.id} className="pl-4">
      <div
        className={`flex items-center cursor-pointer ${
          node.isOpen ? "text-blue-500 bg-amber-400" : "text-white"
        }`}
        onClick={() => {
          handleClick(node);
        }}
      >
        {node.children.length > 0 && (
          <span className="mr-2" onClick={() => toggleNode(node)}>
            {node.isOpen ? "[-]" : "[+]"}
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
          <div className="flex flex-col p-4 overflow-auto">
            <div className="text-lg text-white">Tree View:</div>
            <div className="mt-2">{renderTree(treeViewData)}</div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col p-4 overflow-auto">
            <span className=" text-white">Resizable Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default CustomBuilder;
