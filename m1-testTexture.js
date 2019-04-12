
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

// the texture we will use over and over
let texture = new T.TextureLoader().load("./THREE/UV_Grid_Sm.jpg");
texture.flipY = false;

class TextureGadget extends GrObject {
    constructor() {
        let group = new T.Group();
        super("TextureGadget",group,
                [["u1",0,1,0.25],
                 ["v1",0,1,0.25],
                 ["u2",0,1,0.75],
                 ["v2",0,1,0.25],
                 ["u3",0,1,0.5],
                 ["v3",0,1,0.75],
                ]);


        let geometry = new T.Geometry();

        // define the vertices
        let xyz0 = new T.Vector3(0,0,0);    this.uv0 = new T.Vector2(0,0);
        let xyz1 = new T.Vector3(1,0,0);    this.uv1 = new T.Vector2(1,0);
        let xyz2 = new T.Vector3(0,1,0);    this.uv2 = new T.Vector2(0,1);
        let xyz3 = new T.Vector3(1,1,0);    this.uv3 = new T.Vector2(1,1);
    
        // add the vertices to the object
        geometry.vertices.push(xyz0);
        geometry.vertices.push(xyz1);
        geometry.vertices.push(xyz2);
        geometry.vertices.push(xyz3);

        // add the faces
        geometry.faces.push(new T.Face3(0,1,2));
        geometry.faces.push(new T.Face3(1,3,2));

        // create the texture list for each face
        let uvFace0 = [ this.uv0, this.uv1, this.uv2 ];
        let uvFace1 = [ this.uv1, this.uv3, this.uv2 ];

        // create the texture layer
        let uvLayer = [ uvFace0, uvFace1 ];

        // add the layer to the geometry
        geometry.faceVertexUvs = [ uvLayer ];

        //
        let material = new T.MeshBasicMaterial({color:"white",map:texture});
        let mesh = new T.Mesh(geometry,material);
        group.add(mesh);

        // a polyline to show where the texture is coming from
        this.lineGeom= new T.Geometry();
        this.v1 = new T.Vector3(0.25,0.25,0.01);
        this.v2 = new T.Vector3(0.5, 0.25,0.01);
        this.v3 = new T.Vector3(0.25,0.5, 0.01);

        this.lineGeom.vertices.push(this.v1);
        this.lineGeom.vertices.push(this.v2);
        this.lineGeom.vertices.push(this.v3);
        this.lineGeom.vertices.push(this.v1);

        this.lineMat = new T.LineBasicMaterial({color:"white", linewidth:5});
        this.line = new T.Line(this.lineGeom,this.lineMat);
        group.add(this.line);

        // the Triangle showing the texture
        this.triGeom = new T.Geometry();
        this.triGeom.vertices.push(new T.Vector3(1.25,0,0));
        this.triGeom.vertices.push(new T.Vector3(2.25,0,0));
        this.triGeom.vertices.push(new T.Vector3(1.75,1,0));
        this.triGeom.faces.push(new T.Face3(0,1,2));
        // @ts-ignore
        this.triGeom.faceVertexUvs = [ [ [this.v1,this.v2,this.v3] ] ];
        this.triMat = new T.MeshBasicMaterial({map:texture});
        this.triMesh = new T.Mesh(this.triGeom,this.triMat);
        group.add(this.triMesh);
        
    }
    update(paramVals) {
        this.v1.x = paramVals[0];
        this.v1.y = paramVals[1];
        this.v2.x = paramVals[2];
        this.v2.y = paramVals[3];
        this.v3.x = paramVals[4];
        this.v3.y = paramVals[5];
        this.lineGeom.verticesNeedUpdate = true;
        this.triGeom.uvsNeedUpdate = true;
    }
}


function test() {
    let box = InputHelpers.makeBoxDiv({width:1050});
    InputHelpers.makeBreak();   // sticks a break after the box
   
    InputHelpers.makeHead("Texture Test",box);

    let left = -0.25;
    let right = 2.5;
    let top = 1.25;
    let bottom = -0.25;

    let myCam = new T.OrthographicCamera(left,right,top,bottom,-1,1);
    let world = new GrWorld({width:1000, height:1000 * (top-bottom)/(right-left), where:box, camera:myCam});
 

    let tt = new TextureGadget();
    world.add(tt);

    let ai = new AutoUI.AutoUI(tt,500,box);

    world.go();
}
Helpers.onWindowOnload(test);

