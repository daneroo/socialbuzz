// console.log(raw);
var n = 29, // number of layers
    m = 159, // number of samples per layer
    // data0 = d3.layout.stack().offset("wiggle")(stream_layers(n, m)),
    data0 = d3.layout.stack().offset("wiggle")(raw),
    data1 = d3.layout.stack().offset("wiggle")(stream_layers(n, m)),
    color = d3.interpolateRgb("#aad", "#556");
    // color = d3.interpolateRgb("#daa", "#655");
    color = d3.interpolateRgb("red", "blue");

var width = 960,
    height = 500,
    mx = m - 1,
    my = d3.max(data0.concat(data1), function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d) { return d.x * width / mx; })
    .y0(function(d) { return height - d.y0 * height / my; })
    .y1(function(d) { return height - (d.y + d.y0) * height / my; });

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height);

vis.selectAll("path")
    .data(data0)
  .enter().append("path")
    .style("fill", function() { return color(Math.random()); })
    .attr("d", area)
    .on("mouseover", fade(.5))
    .on("mouseout", fade(1));

function transition() {
  d3.selectAll("path")
      .data(function() {
        data1 = d3.layout.stack().offset("wiggle")(stream_layers(n, m));
        // DL:recalc max y
        my = d3.max(data0.concat(data1), function(d) {
          return d3.max(d, function(d) {
            return d.y0 + d.y;
          });
        });
        var swp = data1;
        data1 = data0;
        data0 = swp;
        return data0;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
}

/** Returns an event handler for fading a given stream. */
function fade(opacity) {
  return function(g, i) {
    vis.selectAll("path")
        .filter(function(d,ii) {
          return ii!=i;
        })
      .transition()
        .style("opacity", opacity);
  };
}
