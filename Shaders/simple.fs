/* Simple Fragment Shader
 *
 * some lighting (diffuse from above)
 * some texturing
 */

varying vec2 v_uv;
varying vec3 v_normal;

const vec3 baseColor = vec3(.9,.9,.6);

const vec3 lightDir = vec3(0,1,1);
void main() {
    // get the light direction in view space
    vec3 lightDirV = normalize((viewMatrix * vec4(lightDir,0)).xyz);

    // deal with two sided lighting
    float light = abs(dot(v_normal, lightDirV));

    //
    gl_FragColor = vec4(light * baseColor,1);
}