function createKochSnowflake(size, level) {
    const vertices = [];
    let x = -size / 2;
    let y = size * Math.sqrt(3) / 6;
    let dir = 0;

    function fd(d) {
        x += d * Math.cos(dir);
        y += d * Math.sin(dir);
        vertices.push(new THREE.Vector3(x, y, 0));
    }

    function lt(a) {
        dir += a * Math.PI / 180;
    }

    function rt(a) {
        lt(-a);
    }

    function kochSegment(len, level) {
        if (level) {
            len /= 3.0;
            level--;
            kochSegment(len, level);
            lt(60);
            kochSegment(len, level);
            rt(120);
            kochSegment(len, level);
            lt(60);
            kochSegment(len, level);
        } else {
            fd(len);
        }
    }

    fd(0);
    for (let i = 0; i < 3; i++) {
        kochSegment(size, level);
        rt(120);
    }

    const shape = new THREE.Shape();
    shape.moveTo(vertices[0].x, vertices[0].y);
    vertices.forEach(vertex => shape.lineTo(vertex.x, vertex.y));
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    
    const snowflakeGroup = new THREE.Group();
    snowflakeGroup.add(mesh);
    
    return snowflakeGroup;
}