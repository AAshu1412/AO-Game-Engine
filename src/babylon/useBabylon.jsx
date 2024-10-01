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
  LightGizmo,
  GizmoManager,
  PositionGizmo,
  Color3,
  RotationGizmo,
  Axis,
  Space,
  DirectionalLight,
} from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/inspector";

import { parse, stringify, toJSON, fromJSON } from "flatted";

/////////////////////////////////////////////////////////////////////////////////
export const BabylonContext = createContext();
/////////////////////////////////////////////////////////////////////////////////
function stringify12(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

/////////////////////////////////////////////////////////////////////////////////
// Provider -----------------------

export const BabylonProvider = ({ children }) => {
  const [allMesh, setAllMesh] = useState([]);
  const [gizmoUpdate, setGizmoUpdate] = useState([]);

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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        light.diffuse = new Color3(1, 0, 0);
        light.groundColor = new Color3(0, 0, 1);
        light.specular = new Color3(0, 1, 0);
        this.llightGizmo(light);
        console.log("Scene is working: " + stringify12(this.scene));
        // new DebugLayer(this.scene).show({embedMode:true})
        // this.run();
      } else {
        // this.scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        console.log("Scene is not working");
      }
    }

    llightGizmo(customLight) {
      const lightGizmo = new LightGizmo();

      lightGizmo.scaleRatio = 2;

      lightGizmo.light = customLight;

      const gizmoManager = new GizmoManager(this.scene);

      gizmoManager.positionGizmoEnabled = true;

      gizmoManager.rotationGizmoEnabled = true;

      gizmoManager.usePointerToAttachGizmos = false;

      gizmoManager.attachToMesh(lightGizmo.attachedMesh);

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  const utilLayer= new UtilityLayerRenderer(this.scene);
      //   var gizmo_scale = new PositionGizmo(utilLayer);
      //     var gizmo_rational = new RotationGizmo(utilLayer);

      //     gizmo_scale.attachedMesh = customLight;
      //     gizmo_rational.attachedMesh = customLight;

      //     // Keep the gizmo fixed to local rotation
      //     gizmo_scale.updateGizmoRotationToMatchAttachedMesh = true;
      //     gizmo_scale.updateGizmoPositionToMatchAttachedMesh = true;
      //     gizmo_rational.updateGizmoRotationToMatchAttachedMesh = false;
      //     gizmo_rational.updateGizmoPositionToMatchAttachedMesh = true;
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      console.log("IDK it works");
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

    returnScene() {
      return this.scene;
    }

    debu() {
      try {
        this.scene.debugLayer.show({
          embedMode: true,
          gizmoCamera: this.camera,
        });

        // new DebugLayer(this.scene).show({
        //   embedMode: true,
        //   gizmoCamera: this.camera,
        // });
        console.log("aaa-- " + stringify12(this.scene));
      } catch (error) {
        const scene = this.returnScene();
        scene.debugLayer.show({
          embedMode: true,
          gizmoCamera: this.camera,
        });
        console.log("ccc--");
      }
    }

    resize() {
      if (this.engine) {
        this.engine.resize();
      }
    }

    gizmo() {
      var utilLayer = new UtilityLayerRenderer(this.scene);
      var translationGizmo = new PositionGizmo(utilLayer);
      translationGizmo.updateGizmoRotationToMatchAttachedMesh = false;

      var rotationGizmo = new RotationGizmo(utilLayer);
      // rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;

      var objClick = [];

      // event on position gizmo x drag
      translationGizmo.xGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.x += event.delta.x;
          });
          setGizmoUpdate((prevValue)=>{
           const gizmoUPDATE=[...prevValue];
           return gizmoUPDATE;
          })
      });

      // event on position gizmo y drag
      translationGizmo.yGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.y += event.delta.y;
          });
          setGizmoUpdate((prevValue)=>{
            const gizmoUPDATE=[...prevValue];
            return gizmoUPDATE;
           })
      });

      // event on position gizmo z drag
      translationGizmo.zGizmo.dragBehavior.onDragObservable.add((event) => {
        objClick
          .filter((mesh) => mesh != translationGizmo.attachedMesh)
          .forEach((mesh) => {
            mesh.position.z += event.delta.z;
          });
          setGizmoUpdate((prevValue)=>{
            const gizmoUPDATE=[...prevValue];
            return gizmoUPDATE;
           })
      });

      // event on rotation gizmo x drag
      rotationGizmo.xGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.x += rotationGizmo.xGizmo.angle;
            mesh.rotate(Axis.X, rotationGizmo.xGizmo.angle, Space.LOCAL);
          });
          setGizmoUpdate((prevValue)=>{
            const gizmoUPDATE=[...prevValue];
            return gizmoUPDATE;
           });
        rotationGizmo.xGizmo.angle = 0;
       
      });

      // event on rotation gizmo y drag
      rotationGizmo.yGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.y += rotationGizmo.yGizmo.angle;
            mesh.rotate(Axis.Y, rotationGizmo.yGizmo.angle, Space.LOCAL);
          });
          setGizmoUpdate((prevValue)=>{
            const gizmoUPDATE=[...prevValue];
            return gizmoUPDATE;
           });
        rotationGizmo.yGizmo.angle = 0;
       
      });

      // event on rotation gizmo z drag
      rotationGizmo.zGizmo.dragBehavior.onDragObservable.add(() => {
        objClick
          .filter((mesh) => mesh != rotationGizmo.attachedMesh)
          .forEach((mesh) => {
            // mesh.rotation.z += rotationGizmo.zGizmo.angle;
            mesh.rotate(Axis.Z, rotationGizmo.zGizmo.angle, Space.LOCAL);
          });
          setGizmoUpdate((prevValue)=>{
            const gizmoUPDATE=[...prevValue];
            return gizmoUPDATE;
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
      console.log("Starting box function with y_pos: " + y_pos); // Add this log to check if function is called

      // Our built-in 'box' shape.
      try {
        this.boxs = MeshBuilder.CreateBox(
          "box",
          { size: 2, updatable: true },
          this.scene
        );

        console.log("Box created, setting position..."); // Check if box creation succeeds
        if (isNaN(y_pos)) {
          console.error("y_pos is not a valid number: ", y_pos);
        }
        // Move the box upward 1/2 its height
        this.boxs.position.y = y_pos;
        this.scene.render();

        console.log("Position set to y_pos: " + this.boxs.position.y); // This should now show the updated y position
        // console.log("dadw : "+  this.boxs._getData({})); // Check if execution reaches this point

        //   var gizmo_scale = new ScaleGizmo(this.utilLayer);
        //   var gizmo_rational = new BABYLON.RotationGizmo(this.utilLayer);

        //   gizmo_scale.attachedMesh = boxs;
        //   gizmo_rational.attachedMesh = boxs;

        //   // Keep the gizmo fixed to local rotation
        //   gizmo_scale.updateGizmoRotationToMatchAttachedMesh = true;
        //   gizmo_scale.updateGizmoPositionToMatchAttachedMesh = true;
        //   gizmo_rational.updateGizmoRotationToMatchAttachedMesh = false;
        //   gizmo_rational.updateGizmoPositionToMatchAttachedMesh = true;

        console.log("Box : " + this.boxs); // Final log to show the box object
      } catch (error) {
        console.error("An error occurred: ", error); // Log any errors that might occur
      }
    }

    getPosition() {
      console.log("Position set to y_pos: " + this.boxs.position);
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

  class Box extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.box = MeshBuilder.CreateBox(
        "box",
        { size: 2, updatable: true },
        this.scene
      );

      console.log("Box : " + this.box + " ID : " + this.box.uniqueId);
    }

    setPosition(
      x = this.box.position.x,
      y = this.box.position.y,
      z = this.box.position.z
    ) {
      this.box.position.x = x;
      this.box.position.y = y;
      this.box.position.z = z;
    }

    getPosition() {
      return this.box.position;
    }

    setScaling(
      x = this.box.scaling.x,
      y = this.box.scaling.y,
      z = this.box.scaling.z
    ) {
      this.box.scaling.x = x;
      this.box.scaling.y = y;
      this.box.scaling.z = z;
    }

    getScaling() {
      return this.box.scaling;
    }

    setRotation(
      x = this.box.rotation.x,
      y = this.box.rotation.y,
      z = this.box.rotation.z
    ) {
      this.box.rotation.x = x;
      this.box.rotation.y = y;
      this.box.rotation.z = z;
    }
    getRotation() {
      return this.box.rotation;
    }

    getUniqueId() {
      return this.box.uniqueId;
    }
    getParentId() {
      const parent = this.box.parent;
      if (parent == null) {
        return 0;
      }
      return parent.uniqueId;
    }

    getName() {
      return this.box.name;
    }
  }

  class Sphere extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.sphere = MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        this.scene
      );

      console.log("Sphere : " + this.sphere);
    }
    setPosition(
      x = this.sphere.position.x,
      y = this.sphere.position.y,
      z = this.sphere.position.z
    ) {
      this.sphere.position.x = x;
      this.sphere.position.y = y;
      this.sphere.position.z = z;
    }

    getPosition() {
      return this.sphere.position;
    }

    setScaling(
      x = this.sphere.scaling.x,
      y = this.sphere.scaling.y,
      z = this.sphere.scaling.z
    ) {
      this.sphere.scaling.x = x;
      this.sphere.scaling.y = y;
      this.sphere.scaling.z = z;
    }

    getScaling() {
      return this.sphere.scaling;
    }

    setRotation(
      x = this.sphere.rotation.x,
      y = this.sphere.rotation.y,
      z = this.sphere.rotation.z
    ) {
      this.sphere.rotation.x = x;
      this.sphere.rotation.y = y;
      this.sphere.rotation.z = z;
    }
    getRotation() {
      return this.sphere.rotation;
    }
    getUniqueId() {
      return this.sphere.uniqueId;
    }
    getParentId() {
      const parent = this.sphere.parent;
      if (parent == null) {
        return 0;
      }
      return parent.uniqueId;
    }
    getName() {
      return this.sphere.name;
    }
  }

  class Ground extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.ground = MeshBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        this.scene
      );

      console.log(
        "Ground : " + this.ground.layerMask + " ID : " + this.ground.position
      );
    }

    generalInfo() {
      const id = this.ground.id;
      const name = this.ground.name;
      const uniqueID = this.ground.uniqueId;
      const _class = this.ground.getClassName;
      const vertices = this.ground.isE;
      const faces = this.ground.face;
    }

    setPosition(
      x = this.ground.position.x,
      y = this.ground.position.y,
      z = this.ground.position.z
    ) {
      this.ground.position.x = x;
      this.ground.position.y = y;
      this.ground.position.z = z;
    }

    getPosition() {
      return this.ground.position;
    }

    setScaling(
      x = this.ground.scaling.x,
      y = this.ground.scaling.y,
      z = this.ground.scaling.z
    ) {
      this.ground.scaling.x = x;
      this.ground.scaling.y = y;
      this.ground.scaling.z = z;
    }

    getScaling() {
      return this.ground.scaling;
    }

    setRotation(
      x = this.ground.rotation.x,
      y = this.ground.rotation.y,
      z = this.ground.rotation.z
    ) {
      this.ground.rotation.x = x;
      this.ground.rotation.y = y;
      this.ground.rotation.z = z;
    }
    getRotation() {
      return this.ground.rotation;
    }
    getUniqueId() {
      return this.ground.uniqueId;
    }
    getParentId() {
      const parent = this.ground.parent;
      if (parent == null) {
        return 0;
      }
      return parent.uniqueId;
    }
    getName() {
      return this.ground.name;
    }
  }

  class Cylinder extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.cylinder = MeshBuilder.CreateCylinder("cylinder", {});

      console.log("Cylinder : " + this.cylinder);
    }
    setPosition(
      x = this.cylinder.position.x,
      y = this.cylinder.position.y,
      z = this.cylinder.position.z
    ) {
      this.cylinder.position.x = x;
      this.cylinder.position.y = y;
      this.cylinder.position.z = z;
    }

    getPosition() {
      return this.cylinder.position;
    }

    setScaling(
      x = this.cylinder.scaling.x,
      y = this.cylinder.scaling.y,
      z = this.cylinder.scaling.z
    ) {
      this.cylinder.scaling.x = x;
      this.cylinder.scaling.y = y;
      this.cylinder.scaling.z = z;
    }

    getScaling() {
      return this.cylinder.scaling;
    }

    setRotation(
      x = this.cylinder.rotation.x,
      y = this.cylinder.rotation.y,
      z = this.cylinder.rotation.z
    ) {
      this.cylinder.rotation.x = x;
      this.cylinder.rotation.y = y;
      this.cylinder.rotation.z = z;
    }
    getRotation() {
      return this.cylinder.rotation;
    }
    getUniqueId() {
      return this.cylinder.uniqueId;
    }
    getParentId() {
      const parent = this.cylinder.parent;
      if (parent == null) {
        return 0;
      }
      return parent.uniqueId;
    }
    getName() {
      return this.cylinder.name;
    }
  }

  class Cone extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.cone = MeshBuilder.CreateCylinder("cylinder", { diameterTop: 0 });

      console.log("Cone : " + this.cone);
    }
    getUniqueId() {
      return this.cone.uniqueId;
    }
    getParentId() {
      const parent = this.cone.parent;
      if (parent == null) {
        return 0;
      }
      return parent.uniqueId;
    }
    getName() {
      return this.cone.name;
    }
  }

  class HemisphericLights extends BabylonInstanceEngine {
    constructor(scene) {
      super(scene);
      this.hemisphericLight = new HemisphericLight(
        "hemisphericLight",
        new Vector3(0, 1, 0),
        this.scene
      );
    }

    setDirection(x, y, z) {
      this.hemisphericLight.direction = new Vector3(x, y, z);
    }

    setIntensity(intensity) {
      this.hemisphericLight.intensity = intensity;
    }
    setDiffuse(r, g, b) {
      this.hemisphericLight.diffuse = new Color3(r, g, b);
    }
    setGroundColor(r, g, b) {
      this.hemisphericLight.groundColor = new Color3(r, g, b);
    }
    setSpecular(r, g, b) {
      this.hemisphericLight.specular = new Color3(r, g, b);
    }

    getIntensity() {
      return this.hemisphericLight.intensity;
    }

    getProperties() {
      const data = {
        id: this.hemisphericLight.id,
        name: this.hemisphericLight.name,
        uniqueId: this.hemisphericLight.uniqueId,
        class: this.hemisphericLight.getClassName,
        parent: this.hemisphericLight.parent,
      };
      return data;
    }
    getDiffuse() {
      return this.hemisphericLight.diffuse;
    }
    getGroundColor() {
      return this.hemisphericLight.groundColor;
    }
    getSpecular() {
      return this.hemisphericLight.specular;
    }

    getDirection() {
      return this.hemisphericLight.direction;
    }
  }

  const babylonInstanceEngine = new BabylonInstanceEngine();

  return (
    <BabylonContext.Provider
      value={{
        babylonInstanceEngine,
        allMesh,
        setAllMesh,
        Box,
        Sphere,
        Ground,
        Cylinder,
        Cone,
        HemisphericLights,gizmoUpdate,
      }}
    >
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
