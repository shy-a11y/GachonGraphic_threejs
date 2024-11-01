function growTree(size) {
    const wood = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../Resources/tree/tree.jpg'),
        shininess: 100
    });

    const leaf = new THREE.PointsMaterial({
        map: new THREE.TextureLoader().load('../Resources/tree/cherry_leaf.png'),
        transparent: true,
        opacity: 0.13,
        size: 2 
    });

    let leafArr = [];
    let branchArr = [];

    function createTree(size) {
        const tree = new THREE.Group();

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.75, 1, 10, 6, 1, true),
            wood
        );
        trunk.position.set(0, 5, 0);
        tree.add(trunk);

        if (size > 0.1) {
            const branches = size > 0.8 ? 1 : 2; 

            for (let i = 0; i < branches; i++) {
                const s = i ? 0.5 : 0.8;
                const branch = createTree(size * s);
                branch.position.set(0, 10 - 2 * i, 0);
                branch.scale.set(s, s, s);
                branch.rotation.set(0, i * (Math.PI / 2), i ? 0.1 : 0);
                tree.add(branch);
                branchArr.push(branch);
            }
        }

        const leaves = new THREE.Points(new THREE.IcosahedronGeometry(0.8 / size / size), leaf); 
        leaves.position.set(0, 10, 0);
        tree.add(leaves);
        leafArr.push(leaves);

        return tree;
    }

    const tree = createTree(size);
    let t = 0;

    function animate() {
        t++;

        leafArr.forEach((leaf, index) => {
            leaf.rotation.x = 0.1 * Math.sin(t / 50 + index); 
            leaf.rotation.y = 0.1 * Math.cos(t / 50 + index); 
        });

        branchArr.forEach((branch, index) => {
            branch.rotation.x = 0.1 * Math.sin(t / 100 + index);
        });

        requestAnimationFrame(animate);
    }
    animate();

    return tree;
}
