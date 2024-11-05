function createSlime(size, mode) {
    // 랜덤 색상 생성 함수
    function getRandomColor() {
        return Math.floor(Math.random() * 16777215); // 0x000000에서 0xFFFFFF 범위의 랜덤 색상
    }

    var slime = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshPhongMaterial({
            color: getRandomColor(), // 랜덤 색상 사용
            emissive: 0x00aa00,
            specular: 0x003300,
            shininess: 70
        })
    );

    slime.position.set(0, size / 2, 0);
    slime.castShadow = true;
    slime.receiveShadow = true;

    // 눈 크기 설정
    var eyeSize = size * 0.1; // 더 작은 눈
    var eyeGeometry = new THREE.SphereGeometry(eyeSize, 16, 16);
    var eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // 왼쪽 눈
    var leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-size * 0.15, size * 0.25, size * 0.5);
    slime.add(leftEye);

    // 오른쪽 눈
    var rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(size * 0.15, size * 0.25, size * 0.5);
    slime.add(rightEye);

    // 입을 설정하는 함수
    function createMouth() {
        var mouthRadius = size * 0.2; // 입 크기
        var mouthTubeRadius = size * 0.02; // 입 두께
        var mouthGeometry;

        switch (mode) {
            case 'happy':
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, Math.PI); // 웃는 입
                break;
            case 'sad':
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, -Math.PI); // 슬픈 입
                break;
            case 'angry':
                mouthGeometry = new THREE.CylinderGeometry(mouthTubeRadius, mouthTubeRadius, mouthRadius, 16); // 화난 입
                mouthGeometry.rotateX(Math.PI / 2);
                break;
            default:
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, Math.PI); // 기본: 웃는 입
                break;
        }

        var mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        var mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, size * -0.1, size * 0.5);
        slime.add(mouth);
    }

    createMouth();

    return slime;
}
