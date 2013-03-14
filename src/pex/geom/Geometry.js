define(['pex/geom/Vec2Array', 'pex/geom/Vec3Array', 'pex/geom/Vec4Array'], function(Vec2Array, Vec3Array, Vec4Array) {
  var elementSizeMap = {
    'Vec2' : 2,
    'Vec3' : 3,
    'Vec4' : 4
  };

  function Geometry(attribs) {
    this.faces = [];
    this.edges = [];
    this.attribs = attribs || {};

    for(var attribName in this.attribs) {
      var attrib = this.attribs[attribName];
      attrib.isDirty = true;
      attrib.elementSize = elementSizeMap[attrib.type];
      if (attrib.type == 'Vec2') { attrib.data = new Vec2Array(attrib.length); }
      if (attrib.type == 'Vec3') { attrib.data = new Vec3Array(attrib.length); }
      if (attrib.type == 'Vec4') { attrib.data = new Vec4Array(attrib.length); }
    }
  }

  return Geometry;
});