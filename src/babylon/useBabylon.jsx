import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  DebugLayer,
  UtilityLayerRenderer,
  ScaleGizmo,
  RotationGizmo,
} from "@babylonjs/core";

/////////////////////////////////////////////////////////////////////////////////
export const BabylonContext = createContext();
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Provider -----------------------

export const BabylonProvider = ({ children }) => {
  class BabylonInstanceEngine {
    reactCanvas = null;
    engine;
    scene;
    utilLayer;

    initialize(_canva) {
      // const { current: canvas } = reactCanvas;
      // if (!canvas) return;
      if (!_canva) return;

      this.engine = new Engine(_canva);
      this.scene = new Scene(this.engine);
      if (this.scene.isReady()) {
        // onSceneReady(scene);
        // console.log("Scene ios working");
        // console.log(this.scene);
        // This creates and positions a free camera (non-mesh)
        const camera = new FreeCamera(
          "camera1",
          new Vector3(0, 5, -10),
          this.scene
        );

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        const canvas = this.scene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas
        camera.attachControl(_canva, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight(
          "light",
          new Vector3(0, 1, 0),
          this.scene
        );

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        console.log("Scene ios working");
      } else {
        // this.scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        console.log("Scene is not working");
      }
    }

    run() {
      if (this.engine && this.scene) {
        this.engine.runRenderLoop(() => {
          // if (typeof onRender === "function") onRender(scene);
          this.scene.render();
        });
      }
    }

    resize() {
      if (this.engine) {
        this.engine.resize();
      }
    }

    gizmo() {
      this.utilLayer = new UtilityLayerRenderer(this.scene);
    }

    box(y_pos) {
      // Our built-in 'box' shape.
      const boxs = MeshBuilder.CreateBox(
        "box",
        { size: 2, updatable: true },
        this.scene
      );

      // Move the box upward 1/2 its height
      boxs.position.y = y_pos;
      var gizmo_scale = new ScaleGizmo(this.utilLayer);
      var gizmo_rational = new BABYLON.RotationGizmo(this.utilLayer);

      gizmo_scale.attachedMesh = boxs;
      gizmo_rational.attachedMesh = boxs;

      // Keep the gizmo fixed to local rotation
      gizmo_scale.updateGizmoRotationToMatchAttachedMesh = true;
      gizmo_scale.updateGizmoPositionToMatchAttachedMesh = true;
      gizmo_rational.updateGizmoRotationToMatchAttachedMesh = false;
      gizmo_rational.updateGizmoPositionToMatchAttachedMesh = true;
      console.log("Box : " + boxs);
    }

    ground() {
      // Our built-in 'ground' shape.
      const gd = MeshBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        this.scene
      );
      console.log("ground : " + gd);
    }
  }
  const babylonInstanceEngine = new BabylonInstanceEngine();


  return (
    <BabylonContext.Provider value={{ babylonInstanceEngine }}>
      {children}
    </BabylonContext.Provider>
  );
};


/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Consumer -------------------------

export const useBabylon = () => {
  const babylonContextValue = useContext(BabylonContext);
  if (!babylonContextValue) {
    throw new Error("useBabylon use outside of provider");
  }

  return babylonContextValue;
};
/////////////////////////////////////////////////////////////////////////////////
