d3.json('liveByHandle.json',function(dataByHandle){
  // console.log(dataByHandle);
  // var baseColor = d3.interpolateRgb("#aad", "#556");
  // var baseColor = d3.interpolateRgb("#daa", "#655");
  // var baseColor = d3.interpolateRgb("red", "blue");
  var baseColor = d3.interpolateHsl("hsl(0,99%,80%)","hsl(360,99%,80%)");
  (function exportCData(){
    var cdata=[];
    cdata.push("/* Generated C++ static data (don't forget to adjust member signature .hpp .cpp)*/");
    cdata.push("const char* teamHandles[] = {");
    var keys=d3.keys(dataByHandle);
    var dataLength=0;
    keys.forEach(function(handle){
      cdata.push('    "'+handle+'",');
      dataLength = dataByHandle[handle].length;
    });
    cdata.push("};");
    cdata.push("const float twitterCounts[]["+dataLength+"] = {");
    keys.forEach(function(handle,i){
      var dataForHandle = dataByHandle[handle].join(',');
      console.log(i,dataLength,dataForHandle);
      cdata.push('    {'+dataForHandle+'}'+((i<dataLength-1)?',':''));
    })
    cdata.push("};");

    d3.select("#cdata").text(cdata.join("\n"));
  })();
  
  var model={
    data:[],
    handles:d3.keys(dataByHandle),
    selected:[], // these are two selected rows from data
    color:function(idx){ return baseColor(idx/model.handles.length);}
  }
  // transform the incoming data from [y1,y2,y3]->[{x:0,y:y1},{x:1,y:y2},{x:2,y:y3}]
  var idx=-1;
  for (handle in dataByHandle) {
    idx++;
    var dataForHandle = dataByHandle[handle];
    // console.log('vector length',dataForHandle.length);
    var row = [];
    dataForHandle.forEach(function(value,i){
      row.push({x:i,y:value,idx:idx})
    });
    model.data.push(row);
  }
  console.log(model.handles,model.handles.length);
  function randHandle(){
    return model.handles[Math.floor(Math.random()*99971)%model.handles.length];
  }

  function pickNRows(allrows,n){ // pick n rows
    nrows = allrows.slice(0); // shallow copy
    while (nrows.length>n){
      var rowToRemove = Math.floor(Math.random()*99971)%nrows.length;
      nrows.splice(rowToRemove,1);
    }
    return nrows;
  }

  var m = model.data[0].length; // number of samples per layer

  var width = 960,
      height = 500;

  function genData(){
    return d3.layout.stack().offset("silhouette")(pickNRows(model.data,2));
  }
  function genArea(data){
    var mx = m - 1;
    var my = d3.max(data/*.concat(data1)*/, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });
    // normalize x so range is width
    var area = d3.svg.area()
        .interpolate('basis') // basis, cardinal
        .x(function(d) { return d.x * width / mx; })
        .y0(function(d) { return height - d.y0 * height / my; })
        .y1(function(d) { return height - (d.y + d.y0) * height / my; });
    return area;
  }

  var vis = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height);

  model.selected = genData();
  d3.select("#matchup").text(model.handles[model.selected[0][0].idx]+' vs '+model.handles[model.selected[1][0].idx]);

  vis.selectAll("path.layer")
    .data(model.selected)
    .enter().append("path")
      .attr("class","layer")
      .style("fill", function(row) { return model.color(row[0].idx); })
      .attr("d", genArea(model.selected))
      .on("mouseover", fade(.5))
      .on("mouseout", fade(1));

  var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x*2*Math.PI; })
    .endAngle(function(d) { return (d.x + d.dx)*2*Math.PI; })
    .innerRadius(function(d) { return d.y*height/2; })
    .outerRadius(function(d) { return (d.y + d.dy)*height/2; });


  var arcData=[
  {x:0.0,dx:0.1, y:0.8,dy:.2, idx:1, dir:-1},
  {x:0.0,dx:0.1, y:0.8,dy:.2, idx:1, dir: 1},

  {x:0.4,dx:0.1, y:0.8,dy:.2, idx:0, dir: 1},
  {x:0.4,dx:0.1, y:0.8,dy:.2, idx:0,  dir:-1}
  ];

  var transl="translate(" + 0*width / 2 + "," + height / 2 + ")";
  var toggleDir=1;
  vis.selectAll("path.arc")
      .data(arcData)
      .enter().append("path")
        .attr("transform", function(d) { return transl+"rotate(" + (toggleDir*d.dir*36) + ")"; })
        .attr("class","arc")
        .attr("d", arc)
        .style("fill", function(arc) { return model.color(model.selected[arc.idx][0].idx); })

  function transition() {

    toggleDir=toggleDir*-1;
    prevColors=[model.color(model.selected[0][0].idx),model.color(model.selected[1][0].idx)]
    model.selected = genData();

    d3.select("#matchup").text(model.handles[model.selected[0][0].idx]+' vs '+model.handles[model.selected[1][0].idx]);

    d3.selectAll("path.layer")
        .data(model.selected)
      .transition()
        .duration(2000)
        .style("fill", function(row) { return model.color(row[0].idx); })
        .attr("d", genArea(model.selected));

    
    d3.selectAll("path.arc")
      .data(arcData)
      .transition()
        .duration(2000)
        .style("fill", function(arc) { 
          if (arc.dir*(arc.idx*2-1)*toggleDir==-1) return prevColors[arc.idx];
          return model.color(model.selected[arc.idx][0].idx);
        })
        .style("opacity", function(arc){
          if (arc.dir*(arc.idx*2-1)*toggleDir==-1) return 0.2;
          return 1;
        })
        .attr("d", arc)
        .attr("transform", function(d) { return transl+"rotate(" + (toggleDir*d.dir*36) + ")"; })

  }

  /** Returns an event handler for fading a given stream. */
  function fade(opacity) {
    return function(g, i) {
      vis.selectAll("path.layer")
          .filter(function(d,ii) {
            return ii!=i;
          })
        .transition()
          .style("opacity", opacity);
    };
  }
if(1)  setInterval(function(){
    transition();
  },6000)
  
});



