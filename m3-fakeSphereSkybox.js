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
import { GrObject } from "./Framework/GrObject.js";
import * as Helpers from "./Libs/helpers.js";

class Skybox extends GrObject {
    constructor(params = {}) {
        let geometry = new T.SphereBufferGeometry(10000, 100, 100);
        let loader  = new T.TextureLoader();
        let texture = loader.load("Texture/sky.jpg");
        let material = new T.MeshPhongMaterial({map: texture, side:T.BackSide, flatShading:true});
        let mesh = new T.Mesh(geometry, material);
        super("Skybox", mesh);
    }
}

class Rock extends GrObject {
    constructor(params = {}) {
        let geometry = new T.SphereBufferGeometry(1, 100, 100);
        let loader  = new T.TextureLoader();
        let texture = loader.load("Texture/Rock/bc.jpg");
        let normal = loader.load("Texture/Rock/nl.jpg");
        let height = loader.load("Texture/Rock/ht.png");
        let ambient = loader.load("Texture/Rock/ao.jpg");
        let rough = loader.load("Texture/Rock/rg.jpg");
        let material = new T.MeshStandardMaterial({map: texture, side:T.DoubleSide, normalMap: normal, displacementMap: height, aoMap: ambient, roughnessMap: rough});
        let mesh = new T.Mesh(geometry, material);
        let size = params.size || 1;
        mesh.scale.set(size, size, size);
        super("Rock", mesh);
    }
}

function test() {

    let world = new GrWorld({groundplane:false, lookfrom:new T.Vector3(0, 0, 0), far:20000});
    world.controls.maxDistance = 50;

    let box1 = new Skybox();
    world.add(box1);

    let rock1 = new Rock({size:5});
    world.add(rock1);

    world.go();
}
Helpers.onWindowOnload(test);