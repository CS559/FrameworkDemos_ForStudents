/*
 * graphics town "standard" vertex shader
 * assumes that everything comes from THREE
 * 
 * WARNING: this doesn't include all of the attributes/uniforms that
 *  THREE.JS provides by default
 */

 /* Provided by THREE: (see https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram)
 // = object.matrixWorld
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 v_normal;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // compute the normal and pass it to fragment
    v_normal = normalize(normalMatrix * normal);

    // pass the texture coordinate to the fragment
    v_uv = uv;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}