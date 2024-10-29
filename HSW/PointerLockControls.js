THREE.PointerLockControls = function (camera, domElement) {
    const scope = this;

    this.domElement = domElement || document.body;
    this.isLocked = false;

    // 시점 회전 속도 설정
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const PI_2 = Math.PI / 2;

    const sensitivity = 0.002; // 마우스 감도 조절

    function onMouseMove(event) {
        if (!scope.isLocked) return;

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        euler.setFromQuaternion(camera.quaternion);

        euler.y -= movementX * sensitivity;
        euler.x -= movementY * sensitivity;

        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x)); // 위아래 각도 제한

        camera.quaternion.setFromEuler(euler);
    }

    function onPointerlockChange() {
        if (document.pointerLockElement === scope.domElement) {
            scope.dispatchEvent({ type: 'lock' });
            scope.isLocked = true;
        } else {
            scope.dispatchEvent({ type: 'unlock' });
            scope.isLocked = false;
        }
    }

    function onPointerlockError() {
        console.error('PointerLockControls: Unable to use Pointer Lock API');
    }

    this.connect = function () {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('pointerlockchange', onPointerlockChange, false);
        document.addEventListener('pointerlockerror', onPointerlockError, false);
    };

    this.disconnect = function () {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('pointerlockchange', onPointerlockChange, false);
        document.removeEventListener('pointerlockerror', onPointerlockError, false);
    };

    this.dispose = function () {
        this.disconnect();
    };

    this.getObject = function () {
        return camera;
    };

    this.lock = function () {
        this.domElement.requestPointerLock();
    };

    this.unlock = function () {
        document.exitPointerLock();
    };

    this.moveForward = function (distance) {
        const vector = new THREE.Vector3();
        camera.getWorldDirection(vector);
        camera.position.addScaledVector(vector, distance);
    };

    this.moveRight = function (distance) {
        const vector = new THREE.Vector3();
        camera.getWorldDirection(vector);
        vector.crossVectors(camera.up, vector);
        camera.position.addScaledVector(vector, distance);
    };

    this.connect();
};
THREE.PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;
