class Cube {
    constructor (gl) {
        this.verts = [ new PV(0, 0, 0, true),
                       new PV(1, 0, 0, true),
                       new PV(0, 1, 0, true),
                       new PV(1, 1, 0, true),
                       new PV(0, 0, 1, true),
                       new PV(1, 0, 1, true),
                       new PV(0, 1, 1, true),
                       new PV(1, 1, 1, true) ];
        
        this.faces = [ [0, 1, 5, 4],
                       [0, 4, 6, 2],
                       [0, 2, 3, 1],
                       [7, 3, 2, 6],
                       [7, 6, 4, 5],
                       [7, 5, 1, 3] ];
        
        this.colors = [
                new PV(1.0, 0.2, 0.6, true),  // Neon Pink
                new PV(0.0, 0.8, 0.8, true),  // Turquoise Blue
                new PV(0.7, 0.5, 1.0, true),  // Soft Lavender
                new PV(1.0, 0.6, 0.5, true),  // Peachy Pink
                new PV(0.4, 1.0, 0.9, true),  // Bright Aqua
                new PV(0.6, 0.0, 1.0, true)   // Electric Purple
                        ];

        this.vertex_buffer = gl.createBuffer();
        // EXERCISE
        // Load this.verts into this.vertex_buffer
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.verts), gl.STATIC_DRAW );
        //

        this.element_buffers = [];
        // EXERCISE
        // For each face in this.faces:
        //   Create a buffer.
        //   Push it onto this.element_buffers.
        //   Load the elements of the face into that buffer.
        // See square.js for the incantation.
        for(var i=0; i<this.faces.length; i++){
            this.faces_buffer = gl.createBuffer();

            gl.bindBuffer(  gl.ELEMENT_ARRAY_BUFFER, this.faces_buffer   );
            gl.bufferData(  gl.ELEMENT_ARRAY_BUFFER, 
                            flattenElements(this.faces[i]), 
                            gl.STATIC_DRAW                              );
            
            this.element_buffers.push(this.faces_buffer);
        }
        // 
    }

    render (gl, program) {
        // EXERCISE
        // Get the locations of vPosition and color in the shader programs.
        // Connect this.vertex_buffer to vPosition.
        this.vPosition_Loc = gl.getAttribLocation( program, "vPosition");
        this.color_loc = gl.getUniformLocation( program, "color" );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.vertexAttribPointer( this.vPosition_Loc, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vPosition_Loc );
        //



        // EXERCISE
        // For each face this.faces[i]:
        //   Set uniform variable color to this.colors[i].
        //   Draw the elements in this.element_buffers[i].
        for(var i=0; i<this.faces.length; i++){
            gl.uniform4f( 
                this.color_loc, 
                this.colors[i].x, 
                this.colors[i].y,
                this.colors[i].z,
                this.colors[i].w );
                
            

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.element_buffers[i]);
            gl.drawElements( gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);
        }
        //
    }
}
        
