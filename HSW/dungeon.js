window.onload = function init() {
    const width = 300; const length = 300;
	var SKY;

    const canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(100, canvas.width / canvas.height, 0.1, 3000);
    // 카메라 초기 위치
    camera.position.set(0, 10, 5);

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
    // 멤버 각자 맵에 해당하는 번호 한승우: 1, 박영빈: 2, 임동현: 3, 장은성: 4
    var indexNumber=1;
    
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
            //Q키를 누르면 다음 장소로 순간이동
            case 'KeyQ':
                indexNumber += 1;
                if(indexNumber % 4 == 1){
                    //한승우의 던전 좌표로 카메라가 이동
                    camera.position.set(0, 10, 5);
                }
                if (indexNumber % 4 ==2){
                    //박영빈의 던전좌표로 카메라가 이동
                    camera.position.set(100, 100, 100);

                }
                if (indexNumber % 4 ==3){
                    //임동현의 던전좌표로 카메라가 이동
                    camera.position.set(200, 200, 200);

                }
                if (indexNumber % 4 == 0){
                    //장은성의 던전좌표로 카메라가 이동
                    camera.position.set(300, 300, 300);

                }

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

    const pointLight = new THREE.PointLight(0xffffff, 0.9);
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


    // 배경 추가
    createSolluna();
    createMountain();
    createSky();
    createTree(15);

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

		SKY.rotation.x += 0.0001;
		SKY.rotation.z += 0.0001;

        // velocity 감속 (마찰 효과를 위해)
        velocity.x *= 0.9;
        velocity.z *= 0.9;
        //카메라의 좌표를 log로 알려주는 코드
        console.log(`Player Position: x=${camera.position.x.toFixed(0)}, y=${camera.position.y.toFixed(0)}, z=${camera.position.z.toFixed(0)}`);
        renderer.render(scene, camera);
    }

    animate();

    function createSolluna()
    {
        var directionalLight;

        var sun = createRotatingSphere('sun', 100, 0, 900, 30);
        directionalLight = new THREE.DirectionalLight(0xffaf00, 0.3);
        sun.add(directionalLight);
        directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
        sun.add(directionalLight);
        scene.add(sun); 

        moon = createRotatingSphere('moon', 100, 0, 900, 30);
        directionalLight = new THREE.DirectionalLight(0x003f70, 0.3);
        moon.add(directionalLight);
        directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
        moon.add(directionalLight);
        scene.add(moon);

        directionalLight.castShadow = true;
    }

    function createMountain() 
    {
        const yPos = -5;

        var mountain_1 = createMountainTerrain(width, length * 1.8);
        mountain_1.position.set(width + width / 3, yPos, width/2);
        mountain_1.receiveShadow = false;
        mountain_1.castShadow = false; 
        scene.add(mountain_1);

        var mountain_2 = createMountainTerrain(width, length * 1.8);
        mountain_2.position.set(- width / 2 - width / 3, yPos, width/2);
        mountain_2.receiveShadow = false;
        mountain_2.castShadow = false; 
        scene.add(mountain_2);

        var mountain_3 = createMountainTerrain(width * 1.8, length);
        mountain_3.position.set(width/4, yPos, length / 2 + length);
        mountain_3.receiveShadow = false;
        mountain_3.castShadow = false; 
        scene.add(mountain_3);
    }

    function createSky()
    {
        var sky = new THREE.TextureLoader().load('../Resources/sky/yale8.jpg');
        sky.repeat = new THREE.Vector2(3,3);
        sky.offset = new THREE.Vector2(0,0);
        sky.wrapS = THREE.RepeatWrapping;
        sky.wrapT = THREE.RepeatWrapping;

        SKY = new THREE.Mesh(
            new THREE.SphereGeometry(1000, 64, 64),
            new THREE.MeshPhongMaterial({map: sky, side: THREE.DoubleSide})
        );

        scene.add(SKY);
    }

    function createTree() {
        for (let i = 0; i < 6; i++) {
            const z = -30 + i * 60;
            const size = 0.7 + Math.random() * (1.2 - 0.7);
            const tree = growTree(size);
            tree.position.set(-60, 0, z);
            scene.add(tree);
        }
    
        for (let i = 0; i < 6; i++) {
            const z = -30 + i * 60; 
            const size = 0.7 + Math.random() * (1.2 - 0.7);
            const tree = growTree(size);
            tree.position.set(220, 0, z);
            scene.add(tree);
        }
    
        for (let i = 0; i < 5; i++) {
            const x = -30 + i * 50;
            const size = 0.7 + Math.random() * (1.2 - 0.7);
            const tree = growTree(size);
            tree.position.set(x, 0, 270);
            scene.add(tree);
        }
    } 
};
