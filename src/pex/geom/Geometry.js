define(["pex/core/Edge", "pex/core/Face3", "pex/core/Face4"], function(Edge, Face3, Face4) {
  function Geometry() {

  }

  Geometry.MAX_VERTICES = 65536;


  //We should be more inteligent here and split by faces and then
  //recompute edges or sth like that. For now Ijust assume that if
  //geometry has faces it doesn't edges.
  Geometry.prototype.split = function(maxVertices) {
    maxVertices = maxVertices || Geometry.MAX_VERTICES;

    var geometries = [];
    var attributes = {"vertices":"", "texCoords":"", "normals":"", "colors":""};

    if (this.faces) {
      console.log("Geometry.split ERROR : Only edge meshes are supported at the moment");
      return;
    }
    else if (this.edges) {
      console.log("Geometry.split edges");
      var geometry = null;
      var numVertices = 0;
      for(var i=0; i<this.edges.length; i++) {
        if (geometry == null) {
          console.log("Geometry.split geometries.length : " + (geometries.length + 1));
          geometry = new Geometry();
          geometry.edges = [];
          for(var attribName in attributes) {
            if (!this[attribName]) continue;
            geometry[attribName] = [];
          }
          geometries.push(geometry);
          numVertices = 0;
        }

        var edge = this.edges[i];

        var full = false;
        for(var attribName in attributes) {
          if (!this[attribName]) continue;
          geometry[attribName].push(this[attribName][edge.a]);
          geometry[attribName].push(this[attribName][edge.b]);
          if (geometry[attribName].length >= Geometry.MAX_VERTICES - 2) {
            full = true;
          }
        }

        geometry.edges.push(new Edge(numVertices, numVertices+1));
        numVertices += 2;

        if (full) {
          //console.log(geometry.edges);
          //console.log(geometry.vertices.length);
          geometry = null;
          //return geometries;
        }
      }
    }
    else {
      //we gonna draw unindexed array so no problem and no need to split
      geometries.push(this);
    }


    return geometries;
  }

  Geometry.prototype.computeEdges = function() {
    this.edges = [];
    this.vertexEdges = [];

    for(var i=0; i<this.vertices.length; i++) {
      this.vertexEdges.push([]);
    }

    for(var i=0; i<this.faces.length; i++) {
      var face = this.faces[i];
      if (face instanceof Face3) {
        this.edges.push(new Edge(face.a, face.b));
        this.edges.push(new Edge(face.b, face.c));
        this.edges.push(new Edge(face.c, face.a));
      }
      else if (face instanceof Face4) {
        this.edges.push(new Edge(face.a, face.b));
        this.edges.push(new Edge(face.b, face.c));
        this.edges.push(new Edge(face.c, face.d));
        this.edges.push(new Edge(face.d, face.a));
      }
    }

    //remove duplicates
    for(var i=0; i<this.edges.length; i++) {
      var edgeI = this.edges[i];
      for(var j=i+1; j<this.edges.length; j++) {
        var edgeJ = this.edges[j];
        if ((edgeI.a == edgeJ.a && edgeI.b == edgeJ.b) || (edgeI.a == edgeJ.b && edgeI.b == edgeJ.a)) {
          this.edges.splice(j, 1);
          j--;
        }
      }
      this.vertexEdges[edgeI.a].push(edgeI);
      this.vertexEdges[edgeI.b].push(edgeI);
    }
  }

  return Geometry;
});