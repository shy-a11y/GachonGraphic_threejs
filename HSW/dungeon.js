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

    // 이동 처리 관련 변수들 let으로 수정
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // 키보드 이벤트 처리
    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveRight = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveLeft = true;
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
                moveRight = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveLeft = false;
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
    let dungeon;
    let walls = []; // 충돌 감지를 위한 벽 리스트

    loader.load('models/scene.gltf', function (gltf) {
        dungeon = gltf.scene.children[0];
        dungeon.scale.set(20, 20, 20);
        dungeon.position.set(0, 0, 0); // 원점에 위치
        scene.add(gltf.scene);

        // 충돌 감지용 벽 생성
        dungeon.traverse(function (child) {
            if (child.isMesh) {
                const box = new THREE.Box3().setFromObject(child);
                walls.push(box); // 각 벽의 Bounding Box를 리스트에 추가
            }
        });
    }, undefined, function (error) {
        console.error(error);
    });

    // 충돌 감지 함수
    function detectCollision(position) {
        const playerBox = new THREE.Box3().setFromCenterAndSize(
            position, new THREE.Vector3(1, 1, 1) // 플레이어의 크기를 적절히 설정
        );
        
        for (let i = 0; i < walls.length; i++) {
            if (playerBox.intersectsBox(walls[i])) {
                return true; // 충돌이 발생하면 true 반환
            }
        }
        return false;
    }

    function animate() {
        requestAnimationFrame(animate);

        // 이동 처리
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // 대각선 이동 시 속도 일정 유지

        // velocity와 direction을 활용한 이동 처리
        if (moveForward || moveBackward) velocity.z -= direction.z * 0.1;
        if (moveLeft || moveRight) velocity.x -= direction.x * 0.1;

        // 이전 카메라 위치 저장
        const previousPosition = camera.position.clone();

        // controls의 moveForward와 moveRight 함수로 이동 처리
        controls.moveRight(-velocity.x); // x 축 이동
        controls.moveForward(-velocity.z); // z 축 이동

        // 충돌이 감지되면 이전 위치로 되돌림
        if (detectCollision(camera.position)) {
            camera.position.copy(previousPosition); // 이전 위치로 되돌림
        }

        // velocity 감속 (마찰 효과를 위해)
        velocity.x *= 0.9;
        velocity.z *= 0.9;

        renderer.render(scene, camera);
    }

    animate();
};
