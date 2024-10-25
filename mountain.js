function createMountainTerrain(width, height) {
    const n = 128;
    const geometry = new THREE.PlaneGeometry(width, height, n, n);
    const pos = geometry.getAttribute('position');
    
    function index(x, y) {
        return x + (n + 1) * y;
    }

    function get(x, y) {
        const i = index(x, y);
        return new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    }

    function set(x, y, v) {
        pos.setXYZ(index(x, y), v.x, v.y, v.z);
    }

    function mid(x1, y1, x2, y2) {
        const v = get(x1, y1).clone().add(get(x2, y2)).divideScalar(2);
        return v;
    }

    function mid4(x1, y1, x2, y2, x3, y3, x4, y4) {
        const v = mid(x1, y1, x2, y2).add(mid(x3, y3, x4, y4)).divideScalar(2);
        return v;
    }

    function geoform(x1, y1, x2, y2) {
        if (x2 - x1 < 2) return;

        const xm = (x1 + x2) / 2;
        const ym = (y1 + y2) / 2;

        set(xm, y1, mid(x1, y1, x2, y1));
        set(x1, ym, mid(x1, y1, x1, y2));
        set(x2, ym, mid(x2, y1, x2, y2));
        set(xm, y2, mid(x1, y2, x2, y2));

        set(xm, ym, mid4(xm, y1, xm, y2, x1, ym, x2, ym));

        const r = 0.8 * (x2 - x1);
        const v = get(xm, ym);
        v.x += r * (Math.random() - 0.5) / 8;
        v.y += r * (Math.random() - 0.5) / 12;
        v.z += r * (Math.random() + 2);
        set(xm, ym, v);

        geoform(x1, y1, xm, ym);
        geoform(xm, y1, x2, ym);
        geoform(x1, ym, xm, y2);
        geoform(xm, ym, x2, y2);
    }

    geoform(0, 0, n, n);
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('/Resources/mountain_stone/blue-stone-texture.jpg'),
        bumpMap: new THREE.TextureLoader().load('Resources/mountain_stone/NormalMap.png'),
        bumpScale: 0.5,
        displacementMap: new THREE.TextureLoader().load('Resources/mountain_stone/DisplacementMap.png'),
        displacementScale: 1 / 4,
        aoMap: new THREE.TextureLoader().load('Resources/mountain_stone/AmbientOcclusionMap.png'),
        aoMapIntensity: 1,
        shininess: 20,
        side: THREE.DoubleSide,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;

    return terrain;
}