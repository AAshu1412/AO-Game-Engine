import { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  Mesh,
  Engine,
  Scene,
  KeyboardEventTypes,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  UtilityLayerRenderer,
  ScaleGizmo,
  DebugLayer,
} from "@babylonjs/core";
import { parse, stringify, toJSON, fromJSON } from "flatted";

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
    canvas;

    initialize(_canva) {
      // const { current: canvas } = reactCanvas;
      // if (!canvas) return;
      if (!_canva) return;
      this.canvas = _canva;
      this.engine = new Engine(this.canvas);
      this.scene = new Scene(this.engine);
      this.run();
      if (this.scene.isReady()) {
        // console.log(this.scene);
        // This creates and positions a free camera (non-mesh)
        // this.camera = new FreeCamera(
        //   "camera1",
        //   new Vector3(0, 5, -10),
        //   this.scene
        // );

        // // This targets the camera to scene origin
        // this.camera.setTarget(Vector3.Zero());

        // const canvas = this.scene.getEngine().getRenderingCanvas();

        // // This attaches the camera to the canvas
        // this.camera.attachControl(this.canvas, true);

        this.camera = new ArcRotateCamera(
          "camera1",
          (3 * Math.PI) / 2,
          -Math.PI / 2,
          20,
          Vector3.Zero(),
          this.scene
        );

        // This targets the camera to scene origin
        this.camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);

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

    debu() {
      console.log("aaa--");

      new DebugLayer(this.scene).show({
        embedMode: true,
        gizmoCamera: this.camera,
      });
    }

    resize() {
      if (this.engine) {
        this.engine.resize();
      }
    }

    gizmo() {
      var utilLayer = new UtilityLayerRenderer(this.scene);
      var translationGizmo = new BABYLON.PositionGizmo(utilLayer);
      translationGizmo.updateGizmoRotationToMatchAttachedMesh = false;

      var rotationGizmo = new BABYLON.RotationGizmo(utilLayer);
      // rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;

      var objClick = [];

      // event on position gizmo x drag
      translationGizmo.xGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.x += event.delta.x;
          });
      });

      // event on position gizmo y drag
      translationGizmo.yGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.y += event.delta.y;
          });
      });

      // event on position gizmo z drag
      translationGizmo.zGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.z += event.delta.z;
          });
      });

      // event on rotation gizmo x drag
      rotationGizmo.xGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.x += rotationGizmo.xGizmo.angle;
            mesh.rotate(
              BABYLON.Axis.X,
              rotationGizmo.xGizmo.angle,
              BABYLON.Space.LOCAL
            );
          });
        rotationGizmo.xGizmo.angle = 0;
      });

      // event on rotation gizmo y drag
      rotationGizmo.yGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.y += rotationGizmo.yGizmo.angle;
            mesh.rotate(
              BABYLON.Axis.Y,
              rotationGizmo.yGizmo.angle,
              BABYLON.Space.LOCAL
            );
          });
        rotationGizmo.yGizmo.angle = 0;
      });

      // event on rotation gizmo z drag
      rotationGizmo.zGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.z += rotationGizmo.zGizmo.angle;
            mesh.rotate(
              BABYLON.Axis.Z,
              rotationGizmo.zGizmo.angle,
              BABYLON.Space.LOCAL
            );
          });
        rotationGizmo.zGizmo.angle = 0;
      });

      // click event
      this.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERTAP: {
            var pickResult = this.scene.pick(
              this.scene.pointerX,
              this.scene.pointerY
            );
            if (pickResult.hit) {
              pickResult.pickedMesh.showBoundingBox = true;
              translationGizmo.attachedMesh = pickResult.pickedMesh;
              rotationGizmo.attachedMesh = pickResult.pickedMesh;
              objClick.push(pickResult.pickedMesh);
            } else {
              objClick.forEach((mesh) => (mesh.showBoundingBox = false));
              translationGizmo.attachedMesh = undefined;
              rotationGizmo.attachedMesh = undefined;
              objClick = [];
            }
            break;
          }
        }
      });
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

      //   var gizmo_scale = new ScaleGizmo(this.utilLayer);
      //   var gizmo_rational = new BABYLON.RotationGizmo(this.utilLayer);

      //   gizmo_scale.attachedMesh = boxs;
      //   gizmo_rational.attachedMesh = boxs;

      //   // Keep the gizmo fixed to local rotation
      //   gizmo_scale.updateGizmoRotationToMatchAttachedMesh = true;
      //   gizmo_scale.updateGizmoPositionToMatchAttachedMesh = true;
      //   gizmo_rational.updateGizmoRotationToMatchAttachedMesh = false;
      //   gizmo_rational.updateGizmoPositionToMatchAttachedMesh = true;
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

    sphere() {
      const keyPress = {
        w: false,
        a: false,
        s: false,
        d: false,
      };
      const initialSpeed = 0;
      const desiredSpeed = 0.01;
      const acceleration = 0.0001;
      const deceleration = 0.001;

      let currentSpeed = initialSpeed;

      // Set up easing function
      const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
      };

      var sphere = MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        this.scene
      );

      // Move the sphere upward 1/2 its height
      sphere.position.y = 1;
      this.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case KeyboardEventTypes.KEYDOWN:
            switch (kbInfo.event.key) {
              case "a":
              case "A":
                keyPress["a"] = true;
                break;
              case "d":
              case "D":
                keyPress["d"] = true;
                break;
              case "w":
              case "W":
                keyPress["w"] = true;
                break;
              case "s":
              case "S":
                keyPress["s"] = true;
                break;
            }
            break;
          case KeyboardEventTypes.KEYUP:
            switch (kbInfo.event.key) {
              case "a":
              case "A":
                keyPress["a"] = false;
                break;
              case "d":
              case "D":
                keyPress["d"] = false;
                break;
              case "w":
              case "W":
                keyPress["w"] = false;
                break;
              case "s":
              case "S":
                keyPress["s"] = false;
                break;
            }
            break;
        }
      });

      this.scene.registerBeforeRender(() => {
        if (keyPress["w"] || keyPress["a"] || keyPress["s"] || keyPress["d"]) {
          if (currentSpeed < desiredSpeed) {
            currentSpeed = Math.min(currentSpeed + acceleration, desiredSpeed);
          }
        } else {
          if (currentSpeed > 0) {
            currentSpeed = Math.max(currentSpeed - deceleration, 0);
          }
        }
        const sign = Math.sign(this.camera.alpha);
        let movement = new Vector3(0, 0, 0);
        if (keyPress["w"]) {
          const angle =
            -this.camera.alpha + (sign === -1 ? Math.PI / 2 : -Math.PI / 2);
          movement = new Vector3(Math.sin(angle), 0, Math.cos(angle));
        }
        if (keyPress["a"]) {
          const angle = this.camera.alpha + (sign === 1 ? -Math.PI : Math.PI);
          movement = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        }
        if (keyPress["d"]) {
          const angle = this.camera.alpha + (sign === 1 ? -Math.PI : Math.PI);
          movement = new Vector3(Math.sin(angle), 0, Math.cos(angle));
        }
        if (keyPress["s"]) {
          const angle =
            -this.camera.alpha + (sign === -1 ? Math.PI / 2 : -Math.PI / 2);
          movement = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        }

        movement.normalize();
        const scaledSpeed =
          currentSpeed * this.scene.getEngine().getDeltaTime();
        movement.scaleInPlace(scaledSpeed);
        sphere.position.addInPlace(movement);
      });
      alert("Use W,A,S,D to move the ball");
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
