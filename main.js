const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');


if (!gl) {
    throw new Error('WebGL not supported');
}

// Vertices
const vertexData = [
    0, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
];

// Buffer
const buffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

// Vertex shader
const vsSource = `
    precision mediump float;
    attribute vec3 pos;
    uniform mat4 u_Matrix;

    void main() {
        gl_Position = u_Matrix *vec4(pos, 1.0);
        gl_PointSize = 50.0;
    }
`;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

// Error checking for vertex shader
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(`Vertex shader compilation error: ${gl.getShaderInfoLog(vertexShader)}`);
}

// Fragment shader
const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.8, 0, 0, 1);
    }
`;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

// Error checking for fragment shader
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(`Fragment shader compilation error: ${gl.getShaderInfoLog(fragmentShader)}`);
}

// Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Linking error
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Shader program linking error: ${gl.getProgramInfoLog(program)}`);
}

const positionLocation = gl.getAttribLocation(program, "pos");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

function multiplyMatrices(matrixA, matrixB) {
    let result = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                result[i * 4 + j] += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
        }
    }
    return result;
}

 //Step2 Uniform
 const uMatrix = gl.getUniformLocation(program, 'u_Matrix')

 
    // Animation loop
    //Step4 define theta and make an animation loop
    var theta = Math.PI / 70;
    function animate() {
        requestAnimationFrame(animate);
        theta = theta + Math.PI / 500;

        //Step5 make the matrix for each rotation this must be in the animation loop funciton
        const matrixX = [
            1, 0, 0, 0,
            0, Math.cos(theta), -Math.sin(theta), 0,
            0, Math.sin(theta), Math.cos(theta), 0,
            0, 0, 0, 1
        ]
        const matrixY = [
            Math.cos(theta), 0, Math.sin(theta), 0,
            0, 1, 0, 0,
            -Math.sin(theta), 0, Math.cos(theta), 0,
            0, 0, 0, 1
        ]
        const matrixZ = [
            Math.cos(theta), -Math.sin(theta), 0, 0,
            Math.sin(theta), Math.cos(theta), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]

        //Step6 use the multiplyMatrix function to multiply all your matrices together
        var matrixXY = multiplyMatrices(matrixX, matrixY);
        var matrixXYZ = multiplyMatrices(matrixXY, matrixZ);

        //Step7 Send the final matrix to the uniform in the vertexShader 
        
            //just uncomment 1 of the gl.uniformMatrix4fv lines
        gl.uniformMatrix4fv(uMatrix, false, matrixXYZ); //All rotations
        // gl.uniformMatrix4fv(uMatrix, false, matrixX); //Just X
        // gl.uniformMatrix4fv(uMatrix, false, matrixY); //Just Y
        // gl.uniformMatrix4fv(uMatrix, false, matrixZ); //Just Z
        // gl.uniformMatrix4fv(uMatrix, false, matrixXY); //Just X and Y

    gl.clearColor(0, 0, 0, 0); // Set clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    // gl.drawArrays(gl.POINTS, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animate();

gl.clearColor(0, 0, 0, 0); // Set clear color
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
// gl.drawArrays(gl.POINTS, 0, 1);
gl.drawArrays(gl.TRIANGLES, 0, 3);