uniform float squareSize;
varying vec3 outpos;
void main()	{
    outpos=position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
