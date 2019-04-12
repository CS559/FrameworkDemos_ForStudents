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

// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
// "Texture/HDRIHeaven/flower_road"
// "Texture/HDRIHeaven/hdri_machine_shop_02_2k"
// "Texture/HDRIHeaven/noon_grass_1k"
const envTextureBase = "Texture/HDRIHeaven/hdri_machine_shop_02_2k";

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name,ext="png", swapBottomFront=true) {
    return new T.CubeTextureLoader().load([
        name + "_Right."  +ext,
        name + "_Left."   +ext,
        name + "_Top."    +ext,
        name + (swapBottomFront ? "_Front."  : "_Bottom.") +ext,
        name + "_Back."   +ext,
        name + (swapBottomFront ? "_Bottom." : "_Front.")  +ext
    ]);
}
class Metal extends GrObject {
    constructor(params = {}) {
        let geometry = new T.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
        let loader  = new T.TextureLoader();
        let texture = loader.load("Texture/Metal/bc.png");
        let normal = loader.load("Texture/bump.png");
        let bump = loader.load("Texture/Metal/ht.png");
        let ambient = loader.load("Texture/Metal/ao.png");
        let rough = loader.load("Texture/Metal/rg.png");
        let metal = loader.load("Texture/Metal/ml.png");
        let env = cubeTextureHelp(envTextureBase);
        let material = new T.MeshStandardMaterial({map: texture, side:T.DoubleSide, normalMap: normal, bumpMap: bump, aoMap: ambient, roughnessMap: rough, metalnessMap: metal, envMap: env});
        let mesh = new T.Mesh(geometry, material);
        let size = params.size || 1;
        mesh.scale.set(size, size, size);
        super("Metal", mesh);
    }
}

function test() {

    let world = new GrWorld({groundplane:false, lookfrom:new T.Vector3(0, 0, 0), far:20000});
    world.scene.background = cubeTextureHelp(envTextureBase);

    let metal = new Metal({size:10});
    world.add(metal);

    world.go();
}
Helpers.onWindowOnload(test);