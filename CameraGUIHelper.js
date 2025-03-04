export class CameraGUIHelper {
    constructor(camera) {
        this.camera = camera;
    }
    set fov(fov) {
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }
    get fov() {
        return this.camera.fov;
    }
    set near(near) {
        this.camera.near = near;
        this.camera.updateProjectionMatrix();
    }
    get near() {
        return this.camera.near;
    }
    set far(far) {
        this.camera.far = far;
        this.camera.updateProjectionMatrix();
    }
    get far() {
        return this.camera.far;
    }

    set positionX(x) {
        this.camera.position.x = x;
    }
    get positionX() {
        return this.camera.position.x;
    }
    set positionY(y) {
        this.camera.position.y = y;
    }
    get positionY() {
        return this.camera.position.y;
    }
    set positionZ(z) {
        this.camera.position.z = z;
    }
    get positionZ() {
        return this.camera.position.z;
    }

    set rotationX(x) {
        this.camera.rotation.x = x;
    }
    get rotationX() {
        return this.camera.rotation.x;
    }

    set rotationY(y) {
        this.camera.rotation.y = y;
    }
    get rotationY() {
        return this.camera.rotation.y;
    }

    set rotationZ(z) {
        this.camera.rotation.z = z;
    }
    get rotationZ() {
        return this.camera.rotation.z;
    }


}