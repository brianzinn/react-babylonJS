import { PropsHandler, NodeProps } from "./SceneComponent"
import { Camera, FreeCamera, ArcRotateCamera } from "babylonjs"

export interface CameraComponent {
  camera: Camera,
  noPreventDefault: boolean
}

export type CameraProps = {
  /**
   * If there are no active cameras (on instantiation) then this camera becomes the active camera.
   */
  setActiveOnSceneIfNoneActive?: boolean
  /**
   * Defaults to 1 meter (defines the clip plane for projection matrix)
   */
  minZ?: number
  /**
   * Defaults to 10,000 meters
   */
  maxZ?: number

  /**
   * FOV is set in Radians (default is 0.8)
   */
  fov?: number

  /**
   * fovMode sets the camera frustum bounds to the viewport bounds. (default is FOVMODE_VERTICAL_FIXED)
   */
  fovMode?: number

  /**
   * By default noPreventDefault is set to false, meaning that preventDefault() is automatically called on all canvas mouse clicks and touch events.
   */
  noPreventDefault?: boolean
} & NodeProps

export class CameraPropsHandler implements PropsHandler<Camera, CameraProps> {
  handle(camera: Camera, props: CameraProps): void {
    let cameraProps: any = props

    if (cameraProps.target) {
      // optional on FreeCamera only (not all cameras)
      if (camera instanceof FreeCamera) {
        camera.setTarget(cameraProps.target)
      } else if (camera instanceof ArcRotateCamera) {
        if (!camera.target || !camera.target.equals(cameraProps.target)) {
          // console.log("Changing Arc Rotate target (does on init in ctor, but change detected).")
          camera.setTarget(cameraProps.target)
        }
      } else {
        // console.warn("attached camera - no implementation for targeting", camera, cameraProps)
      }
    }

    if (props.minZ && camera.minZ !== props.minZ) {
      camera.minZ = props.minZ
    }

    if (props.maxZ && camera.maxZ !== props.maxZ) {
      camera.maxZ = props.maxZ
    }

    if (props.fov && camera.fov !== props.fov) {
      camera.fov = props.fov
    }

    // fovMode has falsey value
    if (props.fovMode !== undefined && camera.fovMode !== props.fovMode) {
      camera.fovMode = props.fovMode
    }
  }
}
