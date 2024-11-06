function createSlime(size, mode) {
    function getRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return (red << 16) | (green << 8) | blue;
    }

    const slimeColor = getRandomColor();

    var slimeMaterial = new THREE.MeshPhongMaterial({
        color: slimeColor,
        shininess: 70
    });

    var slime = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        slimeMaterial 
    );

    slime.position.set(0, size / 2, 0);
    slime.castShadow = true;
    slime.receiveShadow = true;

    var eyeSize = size * 0.1; 
    var eyeGeometry = new THREE.SphereGeometry(eyeSize, 16, 16);
    var eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    var leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-size * 0.15, size * 0.25, size * 0.5);
    slime.add(leftEye);

    var rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(size * 0.15, size * 0.25, size * 0.5);
    slime.add(rightEye);

    function createMouth() {
        var mouthRadius = size * 0.2;
        var mouthTubeRadius = size * 0.02;
        var mouthGeometry;

        switch (mode) {
            case 'happy':
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, Math.PI); 
                break;
            case 'sad':
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, -Math.PI); 
                break;
            case 'angry':
                mouthGeometry = new THREE.CylinderGeometry(mouthTubeRadius, mouthTubeRadius, mouthRadius, 16); 
                mouthGeometry.rotateX(Math.PI / 2);
                break;
            default:
                mouthGeometry = new THREE.TorusGeometry(mouthRadius, mouthTubeRadius, 6, 20, Math.PI); 
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
