/*jshint esversion: 6 */
// @ts-check

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

// get things we need
import { GrWorld } from "./Framework/GrWorld.js";
import {GrObject } from "./Framework/GrObject.js";  // only for typing
import * as InputHelpers from "./Libs/inputHelpers.js";
import * as Helpers from "./Libs/helpers.js";
import * as SimpleObjects from "./Framework/SimpleObjects.js";

let check = new T.TextureLoader().load("./Texture/paintBump.png");

/**
 * 
 * @param {GrObject} obj 
 * @param {number} [speed=1] - rotations per second
 */
function spinY(obj, speed=0.25) {
    obj.advance = function(delta,timeOfDay) {
        obj.objects.forEach(obj => obj.rotateY(speed*delta/1000*Math.PI));
    };
    return obj;
}


function test() {
    let mydiv;

    let box = InputHelpers.makeBoxDiv({width: (mydiv ? 640:820)},mydiv);
    if (!mydiv) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead("Bump Map Test",box);

    let world = new GrWorld({width:(mydiv ? 600:800), where:box
    });

    let objs = [];
    let dx = -6;

    let shaderMat = new T.MeshStandardMaterial({color:"white",bumpMap:check,side:T.DoubleSide});

    world.add(spinY(new SimpleObjects.GrSphere({x:-2,y:1, material:shaderMat})));
    world.add(spinY(new SimpleObjects.GrSquareSign({x:2,y:1,size:1,material:shaderMat})));

    world.ambient.intensity = 1;

    world.go();
}
Helpers.onWindowOnload(test);
