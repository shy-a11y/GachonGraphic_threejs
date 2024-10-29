window.onload = function init() {
    const canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 2, 5); // 카메라 초기 위치

    // PointerLockControls 추가
    const controls = new THREE.PointerLockControls(camera, renderer.domElement);
    
    const instructions = document.getElementById("instructions");
    const startButton = document.getElementById("startButton");

    startButton.addEventListener('click', function () {
        controls.lock();
    });

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        instructions.style.display = 'block';
    });

    scene.add(controls.getObject());

    // 플레이어 움직임 처리
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    
    // 키보드 이벤트 처리
    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // 빛 설정
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(0, 200, 100);
    scene.add(pointLight);

    // GLTF 로드
    const loader = new THREE.GLTFLoader();
    loader.load('models/scene.gltf', function (gltf) {
        dungeon = gltf.scene.children[0];
        dungeon.scale.set(20, 20, 20);
        dungeon.position.set(0, 0, 0); // 원점에 위치
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });

    // 충돌 처리 위한 Raycaster
    const raycaster = new THREE.Raycaster();
    const objects = [];

    function animate() {
        requestAnimationFrame(animate);

        // 이동 처리
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // 대각선 이동 시 속도 일정 유지

        if (moveForward || moveBackward) velocity.z -= direction.z * 0.1;
        if (moveLeft || moveRight) velocity.x -= direction.x * 0.1;

        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);

        // 충돌 감지 (Raycaster 사용)
        raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            velocity.y = Math.max(0, velocity.y); // 충돌 시 중력 제거
        }

        velocity.y -= 0.01; // 중력 추가
        camera.position.y = Math.max(2, camera.position.y + velocity.y); // 바닥을 뚫지 않게 함

        renderer.render(scene, camera);
    }

    animate();
};
