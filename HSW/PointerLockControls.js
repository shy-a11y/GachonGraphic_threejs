THREE.PointerLockControls = function (camera, domElement) {
    var scope = this;

    // 카메라가 컨트롤의 대상
    camera.rotation.set(0, 0, 0);

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 1.6;
    yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;

    function onMouseMove(event) {
        if (scope.isLocked === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    }

    function onPointerlockChange() {
        scope.isLocked = (document.pointerLockElement === domElement);
    }

    function onPointerlockError() {
        console.error('PointerLockControls: Unable to use Pointer Lock API');
    }

    this.lock = function () {
        domElement.requestPointerLock();
    };

    this.unlock = function () {
        document.exitPointerLock();
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('pointerlockchange', onPointerlockChange, false);
    document.addEventListener('pointerlockerror', onPointerlockError, false);

    this.getObject = function () {
        return yawObject;
    };

    this.isLocked = false;

    this.moveForward = function (distance) {
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction); // 방향만 움직이도록 수정
        yawObject.position.addScaledVector(direction, distance); // yawObject의 위치를 업데이트
    };

    this.moveRight = function (distance) {
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.crossVectors(camera.up, direction); // 오른쪽 방향으로 이동
        yawObject.position.addScaledVector(direction, distance);
    };
};
