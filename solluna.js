function createRotatingSphere(type, radius, centerY, distance, duration) {
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    let material;

    if (type === 'moon') {
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x003f70),
            side: THREE.DoubleSide,
            flatShading: true,
        });
    } else if (type === 'sun') {
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffa500),
            side: THREE.DoubleSide,
            flatShading: true,
        });
    } else {
        throw new Error("Invalid type. Use 'moon' or 'sun'.");
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.y = centerY;

    const positionArray = geometry.attributes.position.array;
    const randomArray = new Float32Array(positionArray.length);

    for (let i = 0; i < positionArray.length; i += 3) {
        randomArray[i] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
    }

    const clock = new THREE.Clock();

    function animate() {
        const elapsedTime = clock.getElapsedTime();
        const angle = (elapsedTime / duration) * Math.PI * 2;

        const initialAngleOffset = type === 'sun' ? 0 : Math.PI;

        sphere.position.y = centerY + Math.cos(angle + initialAngleOffset) * distance;
        sphere.position.z = centerY + Math.sin(angle + initialAngleOffset) * distance;
        sphere.rotation.x += 0.01;

        for (let i = 0; i < positionArray.length; i += 3) {
            positionArray[i] += Math.sin(elapsedTime * 3 + randomArray[i] * 100) * 0.2;
            positionArray[i + 1] += Math.sin(elapsedTime * 3 + randomArray[i + 1] * 100) * 0.2;
            positionArray[i + 2] += Math.sin(elapsedTime * 3 + randomArray[i + 2] * 100) * 0.2;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    const animateFrame = function () {
        animate();
        requestAnimationFrame(animateFrame);
    };
    animateFrame();

    return sphere;
}
