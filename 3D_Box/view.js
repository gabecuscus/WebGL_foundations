var gl;
var program;
var cube;



var x_angle = 0;
var y_angle = 0;
var z_angle = 0;

// de big boys
var model2clip;
var model2clip_loc;

var clip2model;
var clip2model_loc;

// the connect to the big boys
var clip2canvas;
var canvas2clip;




window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var a_ratio = canvas.width/ canvas.height;
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.4, 0.9, 1.0 );
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    cube = new Cube(gl);

    // EXERCISE:  create all the matrices here.-----------------------------------------------
    var model2object = Mat.translation( new PV(-0.5, -0.5, -0.5) );
    var object2model = Mat.translation( new PV(0.5, 0.5, 0.5) );
    console.log( "Mod_Obj_check: ",model2object.times(object2model));

    var object2rotated = new Mat();
    var rotated2object = new Mat();
    console.log("Obj_Rot_check: ", object2rotated.times(rotated2object));

    var rotated2world = new Mat();
    var world2rotated = new Mat();
    console.log("Rot_Worl_check: ", rotated2world.times(world2rotated));

    var world2view = new Mat();
    var view2world = new Mat();
    console.log("Worl_View_Check: ", world2view.times(view2world));

    var view2proj = Mat.scale( new PV(1, 1, -1) );                          // l8r, this will be 4 perspective
    var proj2view = Mat.scale( new PV(1, 1, -1) );
    console.log("View_Proj_Check: ", view2proj.times(proj2view));

    var proj2clip = Mat.scale( new PV(1/a_ratio, 1, 1) );
    var clip2proj = Mat.scale( new PV(a_ratio/1, 1, 1) );
    console.log("Proj_CLip_Check: ", proj2clip.times(clip2proj));


    // flip the order, satrt with mdel2object all the way on the right
    // then add all of the steping stones for each steps
    model2clip =  proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );
    clip2model =  object2model.times(rotated2object).times(world2rotated).times(view2world).times(proj2view).times(clip2proj);
    console.log("M2C and C2M  id check: ", model2clip.times(clip2model));



    clip2canvas = (Mat.scale(new PV(canvas.width/2, -1*canvas.height, 1, true)))   .times(Mat.translation(new PV(1,-1,0,true)));
    canvas2clip = Mat.translation(new PV(-1,1,0)).      times( Mat.scale(new PV(2/canvas.width, -2/canvas.height, 1)) );



//////////////////////////////////////////// EVENT LISTNEERS ////////////////////////////////////

    document.getElementById("MyButton").onclick = function () {
        console.log("You clicked My Button!");
    };

    var z_trans = 0;
    
    document.getElementById("ZPlus").onclick = function () {
        console.log("You clicked z + 0.1.");
        z_trans +=0.1;
        rotated2world = Mat.translation(new PV(0, 0, z_trans, true));
        model2clip =  proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );
    };

    document.getElementById("ZMinus").onclick = function () {
        console.log("You clicked z - 0.1.");
        z_trans-=0.1;
        rotated2world = Mat.translation(new PV(0, 0, z_trans, true));
        model2clip =  proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );
    };





    //------------------------- MOUSE-------------------------
    var clientX, clientY;
    var downWorld;
    var mouseIsDown = false;



    canvas.addEventListener("mousedown", function (e) {
        mouseIsDown = true;
        clientX = e.clientX;
        clientY = e.clientY;
        var cursorX = e.clientX - canvas.offsetLeft;
        var cursorY = e.clientY - canvas.offsetTop;
        console.log("X: " + cursorX + " Y: " + cursorY);
        var mouseCanvas = new PV(cursorX, cursorY, 0, true);
        // console.log("mouse down mouseCanvas: ", mouseCanvas,  "canvas.w_h:", canvas.width, canvas.height); // insert thsis  into mouseWorld!!!!!!!!
        // EXERCISE
        // use MOSUECANVAS!!!!!!
        // I GOTS TO GO FROM 500X BY 700Y THANG TO CLIPSACE -1 TO 1

           // if err, tryPV(-2,-2,1,true) instead   cus here -1 can flip         this mat brngs negatives in the mix                        this brings our 960x 540y siize to normalized size
        // canvas2clip =     Mat.scale(new PV(2,-2,1,true))             .times( (Mat.translation(new PV(-0.5, -0.5, 0, 1) )) )           .times(Mat.scale(new PV( 1/canvas.width, (1)/canvas.height, 1, true) ));
        // canvas2clip =     Mat.scale(new PV(2,-2,1,true))             .times( (Mat.translation(new PV(-0.5, -0.5, 0, 1) )) )           .times(Mat.scale(new PV( 1/canvas.width, (1)/canvas.height, 0, true) ));
        // console.log("c2c * mouseCan: ", canvas2clip.times(mouseCanvas));

        
        var mouseWorld = view2world.times(proj2view).times(clip2proj).times(canvas2clip).times(mouseCanvas);
        // var mouseWorld = view2world.times(proj2view).times(clip2proj).times(canvas2clip).times(mouseCanvas);
        downWorld = mouseWorld;
        




    });

    canvas.addEventListener("mouseup", function (e) {
        mouseIsDown = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (!mouseIsDown)
            return;
        var cursorX = e.clientX - canvas.offsetLeft;
        var cursorY = e.clientY - canvas.offsetTop;
        console.log("X: " + cursorX + " Y: " + cursorY);

        var mouseCanvas = new PV(cursorX, cursorY, 0, true);

        
        // cuscus special, 
        // so this like moves the cube
            // but not in the right amounts
        // console.log(cursorX/canvas.width);
        // var x_thang = 1.7;
        // var y_thang = cursorY/canvas.height;
        // EXERCISE

        // calculate mouseworld
        // var mouseWorld = ;

        // create a translation matrix using mouseWorld
            // this translation matrix would take downWorld to mouseWorld
                // and use that to update
                    // rotated2world ()()()()()
                    // and model2clip }|}|}|}|}|}|

        // who is a Mat ??
        // who is a PV  ??
        // var mouseCanvas = new PV(cursorX, cursorY, 0, true);
           // if err, tryPV(-2,-2,1,true) instead   cus here -1 can flip         this mat brngs negatives in the mix                        this brings our 960x 540y siize to normalized size
        // canvas2clip =     Mat.scale(new PV(2,-2,1,true))             .times( (Mat.translation(new PV(-0.5, -0.5, 0, 1) )) )           .times(Mat.scale(new PV( 1/canvas.width, (1)/canvas.height, 1, true) ));
        // console.log("c2c * mouseCan: ", canvas2clip.times(mouseCanvas));


        
        // var mouseWorld = view2world.times(proj2view).times(clip2proj).times(canvas2clip).times(mouseCanvas);
        // console.log(" get the difrence in x_y", mouseWorld.minus(downWorld) );


        // constantly be updating __rotated2world__
        // /* ()( */rotated2world = Mat.translation( mouseWorld.minus(downWorld) )
        // /* }|} */model2clip =  proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );

        // badckwards
        var mouseWorld = view2world.times(proj2view).times(clip2proj).times(canvas2clip).times(mouseCanvas);
        var translation_vector = mouseWorld.minus(downWorld);

        // fowards
        rotated2world = Mat.translation(translation_vector).times(rotated2world);
        model2clip = proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );

        downWorld = mouseWorld;
    });













    //-------------------------- KEYS----------------------------
    var duration = 0;
    window.onkeydown = function( event ) {
        // var key = String.fromCharCode(event.keyCode);
        // console.log("You typed " + key);
        // if (event.shiftKey)
        //     console.log("Shift is on.");
        // EXERCISE
        
        console.log("DA just EVENT STUFF SHOOPING:   ", event);
        
        
        duration+=0.01;
        if (event.key == 'x'){
            x_angle +=  duration;
        }
        if (event.key == 'X'){
            x_angle -=  duration;
        }
        if (event.key == 'y'){
            y_angle +=  duration;
        }
        if (event.key == 'Y'){
            y_angle -=  duration;
        }
        if (event.key == 'z'){
            z_angle +=  duration;
        }
        if (event.key == 'Z'){
            z_angle -=  duration;
        }
        //////////
        var rot_x_axis = Mat.rotation(1, x_angle);
        var rot_y_axis = Mat.rotation(2, y_angle);
        var rot_z_axis = Mat.rotation(0, z_angle);

        object2rotated = rot_x_axis.times(rot_y_axis).times(rot_z_axis);
        // object2rotated = Mat.rotation(1, x_angle).times(Mat.rotation(2, y_angle)).times(Mat.rotation(0, z_angle));
        model2clip =  proj2clip.times( view2proj ).times( world2view ).times( rotated2world ).times( object2rotated ).times( model2object );
        ///////////
    };
    window.onkeyup = function( event ) {
        duration = 0;
    };

    window.onresize = function (event) {
        console.log("resize " + canvas.width + " " + canvas.height);
    }

    




    render();
};


function render() {
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // EXERCISE
    model2clip_loc =  gl.getUniformLocation(program, "model2clip");
    gl.uniformMatrix4fv(model2clip_loc, false, model2clip.flatten());



    cube.render(gl, program);

    requestAnimFrame( render )
}
