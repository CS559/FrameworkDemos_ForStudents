
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
import * as AutoUI from "./Framework/AutoUI.js";

const s2 = Math.sqrt(2)/2;

let cylcount = 0;

// the texture we will use over and over
let texture = new T.TextureLoader().load("./THREE/UV_Grid_Sm.jpg");
texture.flipY = false;

class MyCylinder extends GrObject {
    constructor(params={}) {
        let sides = params.sides || 6;
        let height = params.height || 2;
        let radius = params.radius || 1;

        let group = new T.Group();
        super(`MyCylinder-${cylcount++}`,group);

        this.geom = new T.Geometry();

        // vertices
        // get the normals so we can stuck them in place
        let normals = [];
        let stepTheta = Math.PI * 2 / sides;
        for(let thetaSteps = 0; thetaSteps < sides; thetaSteps++) {
            let theta = stepTheta * thetaSteps;
            this.geom.vertices.push(new T.Vector3(Math.cos(theta)*radius,0,     Math.sin(theta)*radius));
            normals.push(new T.Vector3(Math.cos(theta),0,Math.sin(theta)));
            this.geom.vertices.push(new T.Vector3(Math.cos(theta)*radius,height,Math.sin(theta)*radius));
            normals.push(new T.Vector3(Math.cos(theta),0,Math.sin(theta)));
        }
        // faces
        function face(v1,v2,v3) {
            let f = new T.Face3(v1,v2,v3);
            if (!params.flatNormals) {
                f.vertexNormals[0] = normals[v1];
                f.vertexNormals[1] = normals[v2];
                f.vertexNormals[2] = normals[v3];
            }
            return f;
        }

        for (let ct = 0; ct < sides; ct++) {
            let nct = (ct+1)%sides;
            this.geom.faces.push(face(ct*2, ct*2+1, nct*2));
            this.geom.faces.push(face(nct*2,ct*2+1,nct*2+1));
        }
        if (params.flatNormals) {
            this.geom.computeFlatVertexNormals();
        }
        this.material = new T.MeshStandardMaterial({color:"0xFFFFFF",side:T.DoubleSide});
        this.mesh = new T.Mesh(this.geom, this.material);
        group.add(this.mesh);
        group.translateX(params.x || 0);
        group.translateY(params.y || 0);
        group.translateZ(params.z || 0);
    }
}


function test() {
    let box = InputHelpers.makeBoxDiv({width:1050});
    InputHelpers.makeBreak();   // sticks a break after the box
   
    InputHelpers.makeHead("Normals Test",box);

    let world = new GrWorld({width:1000, height:600, where:box, ambient:.75});
 
    world.add(new MyCylinder({height:3,x:-1,z:3,flatNormals:true}));
    world.add(new MyCylinder({height:3,x:3,z:3}));

    world.add(new MyCylinder({height:3,x:-3,z:-3,flatNormals:true,sides:12}));
    world.add(new MyCylinder({height:3,x:1,z:-3, sides:12}));

    world.go();
}
Helpers.onWindowOnload(test);

