import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Engine, Scene,KeyboardEventTypes } from "@babylonjs/core";
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
         this.camera = new FreeCamera(
          "camera1",
          new Vector3(0, 5, -10),
          this.scene
        );

        // This targets the camera to scene origin
        this.camera.setTarget(Vector3.Zero());

        const canvas = this.scene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas
        this.camera.attachControl(_canva, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight(
          "light",
          new Vector3(0, 1, 0),
          this.scene
        );

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        console.log("Scene ios working");
        // new DebugLayer(this.scene).show({embedMode:true})
// this.run();

      } else {
        // this.scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        console.log("Scene is not working");
      }
    }

    run() {
      if (this.engine && this.scene) {
        this.engine.runRenderLoop(() => {
          // if (typeof onRender === "function") onRender(scene);
        //   new DebugLayer(this.scene).show({embedMode:true})

          this.scene.render();
        });
      }
    }

    debu(){
        new DebugLayer(this.scene).show({embedMode:true})
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

    sphere(){
        const keyPress = {
            w: false,
            a: false,
            s: false,
            d: false
        }
        const initialSpeed = 0;
        const desiredSpeed = 0.01;
        const acceleration = 0.0001;
        const deceleration = 0.001;
    
        let currentSpeed = initialSpeed;
    
        // Set up easing function
        const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
        };

        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, this.scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    this.scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
                    case "a":
                    case "A":
                        keyPress['a'] = true;
                    break
                    case "d":
                    case "D":
                        keyPress['d'] = true;
                    break
                    case "w":
                    case "W":
                        keyPress['w'] = true;
                    break
                    case "s":
                    case "S":
                        keyPress['s'] = true;
                    break
                }
			break;
            case KeyboardEventTypes.KEYUP:
                switch (kbInfo.event.key) {
                    case "a":
                    case "A":
                        keyPress['a'] = false;
                    break
                    case "d":
                    case "D":
                        keyPress['d'] = false;
                    break
                    case "w":
                    case "W":
                        keyPress['w'] = false;
                    break
                    case "s":
                    case "S":
                        keyPress['s'] = false;
                    break
                }
            break;
		}
	});

    this.scene.registerBeforeRender(() => {
        if (keyPress['w'] || keyPress['a'] || keyPress['s'] || keyPress['d']) {
            if (currentSpeed < desiredSpeed) {
                currentSpeed = Math.min(currentSpeed + acceleration, desiredSpeed);
            }
        } else {
            if (currentSpeed > 0) {
                currentSpeed = Math.max(currentSpeed - deceleration, 0);
            }
        }
        const sign = Math.sign(this.camera.alpha);
        let movement = new Vector3(0,0,0);
        if (keyPress['w']) {
            const angle = -this.camera.alpha + (sign === -1 ? Math.PI / 2 : -Math.PI / 2);
            movement = new Vector3(Math.sin(angle), 0, Math.cos(angle));
		}
        if (keyPress['a']) {
            const angle = this.camera.alpha + (sign === 1 ? -Math.PI : Math.PI);
            movement = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        }
        if (keyPress['d']) {
            const angle = this.camera.alpha + (sign === 1 ? -Math.PI : Math.PI);
            movement = new Vector3(Math.sin(angle), 0, Math.cos(angle));
        }
        if (keyPress['s']) {
            const angle = -this.camera.alpha + (sign === -1 ? Math.PI / 2 : -Math.PI / 2);
            movement = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        }

        movement.normalize();
        const scaledSpeed = currentSpeed * this.scene.getEngine().getDeltaTime();
        movement.scaleInPlace(scaledSpeed);
        sphere.position.addInPlace(movement);

    })
    this.run();
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
