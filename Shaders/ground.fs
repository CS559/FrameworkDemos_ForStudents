        varying vec3 outpos;
        uniform float squareSize;
        uniform vec3 color1;
        uniform vec3 color2;
        void main()	{
            float xs = step(1.0,mod(outpos.x,2.0));
            float ys = step(1.0,mod(outpos.y,2.0));

            float ss = (xs>.5) ? ys : 1.0-ys;

            gl_FragColor = vec4(mix(color1,color2,ss), 1.);
        }
    