
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
import * as InputHelpers from "./Libs/inputHelpers.js";
import * as Helpers from "./Libs/helpers.js";

const s2 = Math.sqrt(2)/2;


let gradient = new T.TextureLoader().load("./Texture/gradient.png");
let rplus = new T.TextureLoader().load("./Texture/rplus.png");
let rminus = new T.TextureLoader().load("./Texture/rminus.png");

class Flat extends GrObject {
    constructor(params={}) {
        let forward = params.forward || 0.0;
        let nsteps = params.steps || 8;
        let size = params.size || 2;
        //
        let geometry = new T.Geometry();
        //
        let uvs = [];
        for(let step=0; step<=nsteps; step++) {
            let f = (step % 2 == 1) ? forward : 0;
            geometry.vertices.push(new T.Vector3( step * (size/nsteps), 0, f));
            geometry.vertices.push(new T.Vector3( step * (size/nsteps), size, f));
            uvs.push(new T.Vector2(step/4,0));
            uvs.push(new T.Vector2(step/4,1));
        }
        //
        let ruv1 = new T.Vector2(0,0);
        let ruv2 = new T.Vector2(0,1);
        let ruv3 = new T.Vector2(1,0);
        let ruv4 = new T.Vector2(1,1);
        //
        geometry.faceVertexUvs = [ [] ];
        for(let step=0; step<nsteps; step++) {
            let v1 = step*2;
            let v2 = step*2+1;
            let v3 = (step+1)*2;
            let v4 = (step+1)*2+1;
            // 
            let dir = !(step % 2);
            //
            let f1 = new T.Face3(v1,v2,v3);
            geometry.faces.push(f1);
            if (dir)
                geometry.faceVertexUvs[0].push([ruv3,ruv4,ruv1]);
            else
                geometry.faceVertexUvs[0].push([ruv1,ruv2,ruv3]);

            let f2 = new T.Face3(v2,v4,v3);
            geometry.faces.push(f2);
            if (dir)
                geometry.faceVertexUvs[0].push([ruv4,ruv2,ruv1]);
            else
                geometry.faceVertexUvs[0].push([ruv2,ruv4,ruv3]);

            if (params.bentNormals) {
                f1.normal = new T.Vector3(s2 * (dir ? 1 : -1),0,s2);
                f2.normal = new T.Vector3(s2 * (dir ? 1 : -1),0,s2);
            }
    
        }
            
        if (!params.bentNormals)
            geometry.computeFaceNormals();
        geometry.uvsNeedUpdate=true;
        //
        let matprops = {color:"white", side:T.DoubleSide};
        //
        if (params.map || params.bump) {
            let grad = gradient; 
            if (params.map) matprops["map"] = grad;
            if (params.bump) matprops["bumpMap"] = grad;
        }
        if (params.normalMap) {
            matprops["normalMap"] = rplus;
        }
        let material = new T.MeshStandardMaterial(matprops);
        material.bumpScale = 1;
        let mesh = new T.Mesh(geometry,material);
        //
        super("Flat",mesh);
        //
        mesh.translateX(params.x || 0);
        mesh.translateX(params.y || 0);
        mesh.translateX(params.z || 0);
    }
}


function test() {
    let mydiv = document.getElementById("texture-triangle");

    let box = InputHelpers.makeBoxDiv({width: (mydiv ? 640:820)},mydiv);
    if (!mydiv) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead("Bump Map (Wavy) Test",box);
    InputHelpers.makeParagraph("From Left to right: " +
        "flat surface, actual wavy surface, changing the normals,"+ 
        "bump map texture, bump map, normal map",box);

    let world = new GrWorld({width:(mydiv ? 600:800), where:box, 
        lightColoring:"xtreme",
        // sideLightColors:[0xFF8080,0x80FFFF]
    });

    let objs = [];
    let dx = -6;

    objs.push(new Flat({x: dx+=3}));
    objs.push(new Flat({x: dx+=3, forward:0.5}));
    objs.push(new Flat({x: dx+=3, bentNormals:true}));
    objs.push(new Flat({x: dx+=3, map:true}));
    objs.push(new Flat({x: dx+=3, bump:true}));

    objs.push(new Flat({x: dx+=3, normalMap:true}));

    objs.forEach(ob => world.add(ob));

    let div = InputHelpers.makeBoxDiv({},box);

    let sl = new InputHelpers.LabelSlider("ry", {min:-2,max:2,where:div});
    sl.oninput = function(evt) {
        let v = sl.value();
        objs.forEach(ob => ob.objects[0].rotation.y = v);
    };

    world.ambient.intensity = 1;

    world.go();
}
Helpers.onWindowOnload(test);
