//TIZA data visualization library
// D3.js wrapper
// Authors: Martín Szyszlican (ProjectPODER)
// License: GPLv3

let d4;
let callStack = [];
let waitOver = false;

function tiza_init() {
  _loadStyle("/tiza/lib/datatables.min.css", function() {});

  _loadScript("/tiza/lib/d3.v4.min.js", function() {
    d4 = d3;
    _loadScript("/tiza/lib/d3.v3.min.js", function () {
      _loadScript("/tiza/lib/nv.d3.min.js", function() {
        _loadScript("/tiza/lib/datatables.min.js", function() {
          waitOver = true;
          for (c in callStack) {
            // console.log(type c, c, type callStack[c], callStack[c])
            callStack[c].f(callStack[c].p);
          }
        });
      });
    });
  });
}


function _wait(callback) {
  return (params) => {
    if (waitOver) {
      callback(params);
    }
    else {
      callStack.push({f:callback, p:params});
    }
  }
}


function _loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function _loadStyle(url, callback) {
  // Adding the style tag to the head 
  var head = document.head;
  var style = document.createElement('link');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.href = url;

  // Then bind the event to the callback function.
  // There are several events for cross browser compatibility.
  style.onreadystatechange = callback;
  style.onload = callback;

  // Fire the loading
  head.appendChild(style);
}


//Copy code from graphics.js
// ------- GRAPHS --------

// Bar Chart - nvd3

function barChart(options) {
  let sourceData = options.data;

  const yearData = [];

  let index_amount,index_count = null;


  index_amount = yearData.length;
  yearData.push(
    {
      "key" : options.amountKeyName,
      "bar": true,
      "values" : [],
    }
  )
  index_count = yearData.length;
  yearData.push(
    {
        "key" : options.countKeyName,
        "values" : [],
        // "color": "#1b5d1c"
    },
  )
          // "color": "#db2828" amount buyer
          // "color": "#991c1c" cantidad buyer
          // "color": "#b6893e" amount funder
          // "color": "#5b441f" cantidad funder

          
  for (y in sourceData) {
    yearData[index_amount].values.push({
      x: y,
      y: sourceData[y].value
    })
    yearData[index_count].values.push({
      x: y,
      y: sourceData[y].count
    })
  }

// FUNCIÓN PARA SEPARAR Y DAR UN NUEVO ID Y NUEVA VARIABLES DE YEARDATA PARA CADA UNO

function charts(idChart, dataChart) {
    var chart;

    nv.addGraph(function() {
    chart = nv.models.linePlusBarChart()
        .margin({top: 0, right: 30, bottom: 15, left: 100})
        .legendRightAxisHint(' [der.]')
        .legendLeftAxisHint(' [izq.]')
        .color(function(d,i){ return options.barColors[d.originalKey]})
        .focusEnable(false)

    chart.y1Axis
    .tickFormat(function(d) { return '$' + d3.format(',f')(d) });

    // chart.forceX(["2020",0]);
    chart.lines.forceY([0]);

    d3.select(idChart)
        .append("svg")
        .datum(dataChart)
        .transition().duration(500).call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    console.log("tiza",idChart);
    console.log(dataChart);
    return chart;
  });
}

charts(options.target, yearData);


}
// console.log(sourceData)

const barColors = {
  "supplier_contract": {
    amount: "#278529",
    count: "#1b5d1c",
  },

  "supplier_purchase": {
    amount: "#f78529",
    count: "#fb5d1c",
  },

  "buyer_contract": {
    amount: "#db2828",
    count: "#991c1c"
  },
  "buyer_purchase": {
    amount: "#db2828",
    count: "#991c1c"
  },  
  "contactPoint_contract": {
    amount: "#db2828",
    count: "#991c1c"
  },
  "funder_contract": {
      amount: "#DA9488",
      count: "#af2020"
  }
}


// Pie Chart - nvd3

function pieChart(options) {
  let sourceData = options.data;

  const typeData = []


  for (t in sourceData) {
    typeData.push({
      "label": t,
      "value": sourceData[t].count
    })
  }

  // Pie Chart
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return options.nameLabels[d.label] })
        .y(function(d) { return d.value })
        .color(function (d) { return options.procurementColors[d.label] })
        .showLabels(true);

      d3.select(options.target)
          .append("svg")
          .datum(typeData)
          .transition().duration(350)
          .call(chart);

    return chart;
  });

}


const procurementColors = {
  supplier_contract: {
    "open": "#1f6a20",
    "direct": "#8AB283",
    "limited": "#DDF8D7",
    "undefined": "#8b8b8b"
  },
  supplier_purchase: {
    "open": "#1f6a20",
    "direct": "#8AB283",
    "limited": "#DDF8D7",
    "undefined": "#8b8b8b"
  },
  buyer_purchase: {
    "open": "#af2020",
    "direct": "#DA9488",
    "limited": "#FFE5DB",
    "undefined": "#8b8b8b"
  },
  buyer_contract: {
    "open": "#af2020",
    "direct": "#DA9488",
    "limited": "#FFE5DB",
    "undefined": "#8b8b8b"
  },
  contactPoint_contract: {
    "open": "#af2020",
    "direct": "#DA9488",
    "limited": "#FFE5DB",
    "undefined": "#8b8b8b"
  },
  funder_contract: {
    "open": "#9f7836",
    "direct": "#e4ac4e",
    "limited": "#ecc483",
    "undefined": "#8b8b8b"
  }
}

// Force-directed Graph - d3.v4
function flujosProveedores(options) {
  let sourceData = options.data;

  // console.log(sourceData);
  const nodes = sourceData.nodes;
  const links = sourceData.links;
  const node_colors = {
    "uc": "#aec7e8",
    "supplier": "#ff7f0e",
    "person": "#ffbb78",
    "dependencia": "#2ca02c",
  }
  const node_radius = {
    "uc": 6,
    "supplier": 10,
    "person": 8,
    "dependencia": 10,
  }
  const link_colors = {
    "open": "#98df8a",
    "limited": "#d62728",
    "direct": "#ff9896",
    "buyer": "#cccccc",
    "funder": "#666666",
    "supplier": "#9467bd",
    "undefined": "#ff0000"
  }

  const name_legend = [
    { label: 'Institución', color: "#aec7e8" },
    { label: 'Empresa', color: "#ff7f0e" },
    { label: 'Persona', color: "#ffbb78" },
    { label: 'Dependencia', color: "#2ca02c" },
    { label: 'Licitación abierta', color: "#98df8a" },
    { label: 'Adjudicación Directa', color: "#ff9896" },
    { label: 'Invitación a tres', color: "#d62728" },
    { label: 'Sin definir', color: "#8b8b8b" },
    { label: 'Regular', color: "#9467bd" }
  ];

  const node_legend = [
    { label: 'Institución', color: "#aec7e8" },
    { label: 'Empresa', color: "#ff7f0e" },
    { label: 'Persona', color: "#ffbb78" },
    { label: 'Dependencia', color: "#2ca02c" },
  ];

  const link_legend = [
    { label: 'Licitación abierta', color: "#98df8a" },
    { label: 'Adjudicación Directa', color: "#ff9896" },
    { label: 'Invitación a tres', color: "#d62728" },
    { label: 'Sin definir', color: "#8b8b8b" },
    { label: 'Regular', color: "#9467bd" }
  ];

  const linkLabels = {
    "open": "Licitación abierta",
    "direct": "Adjudicación Directa",
    "limited": "Invitación a tres",
    "undefined": "Sin definir",
    "buyer": "Dependencia",
    "funder": "Financiador",
    "supplier": "Proveedor",
    "regular": "Regular",
    "": "Sin información"
  }

  var chartDiv = document.getElementById("graph-container");
  if (!chartDiv) {
    console.error("tiza.js","flujosProveedores: No graph container");
    return false;
  }
  // $(chartDiv).height(500);
  var width = chartDiv.clientWidth;
  var height = chartDiv.clientHeight;
  var slide;

  var centerCoor = [], radiusRange = [];

  centerCoor = [width * 0.5, height * 0.5];
  radiusRange = [4,30];
  strokeRange = [0.1,5];

  var svg = d4.select("#graph-container")
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var chart = svg.append("g")
    .attr("class", "nodesChart");

  var radius = d4.scaleSqrt()
    .range(radiusRange);

  var strokeWidth = d4.scaleSqrt()
    .range(strokeRange);

  var color = d4.scaleOrdinal(d4.schemeCategory20); //d4.scale.category20().range().slice(1)


  var dOver = [];


  var simulation = d4.forceSimulation(nodes)
    .force("charge", d4.forceManyBody().strength(1).distanceMax(width/nodes.length))
    .force("center", d4.forceCenter(centerCoor[0], centerCoor[1]))
    .force("link", d4.forceLink().id(function(d) { return d.id; }).distance(1).strength(0.7))
    .force("collide",
      d4.forceCollide(function (d) { return radius(d.weight)*1.5 })
      .strength(0.9)
    )
    .force("radial", d4.forceRadial(width/4.5,centerCoor[0],centerCoor[1]).strength(0.5))
    .on("tick", ticked);

  var link = chart.append("g")
    .attr("class", "links")
    .selectAll(".link");

  var node = chart.append("g")
    .attr("class", "nodes")
    .selectAll(".node");

  var nodeCircle, nodeLabel;

// Legend
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = svg.selectAll('.legend')
          .data(node_legend)
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = 0;                       // NEW
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
          });

        legend.append("circle")
          .attr("cx", 7)
          .attr("cy", 7.7) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style('fill', function(d) { return d.color; })
          .style('stroke', function(d) { return d.color; });

        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d.label; });

  var legend2 = svg.selectAll('.legend2')
          .data(link_legend)
          .enter()
          .append('g')
          .attr('class', 'legend2')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = 150;                       // NEW
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
          });

          legend2.append('rect')
          .attr('width', legendRectSize)
          .attr('height', 4)
          .style('fill', function(d) { return d.color; })
          .style('stroke', function(d) { return d.color; });

          legend2.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d.label; });


  function update() {

    radius.domain(d4.extent(nodes, function(d){
      return d.weight;
    })).nice();

    d4.selectAll(".btn").classed("active", false);

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function(d) { return d.id;});
    node.exit().remove();
    node = node.enter().append("g")
      .attr("id", function(d) { return "node" + d.id;})
      .attr("class", "node")
      .append("circle")
      .attr("r", function(d){ return radius(d.weight); })
      .on("mouseover", function(d) {
        dOver = d;
        d4.select(this).style("cursor", "none");
        var nodeTooltip = d4.select("body")//svg
        .append("div")
        .attr('class', 'foreign-tooltip')

        var tp = nodeTooltip.append("div")
        .attr('class', 'node-tooltip')
        .html(function(d) {
          return '<p class="name">' + dOver.label + '</p>';
        });
      })
      .on("mousemove", function(d) {
        // console.log(d4.mouse(this)[0]);
        d4.select(".foreign-tooltip")
        .style("left", (d4.event.pageX - 80) + "px")
        .style("top", (d4.event.pageY + 10) + "px");
      })
      .on("mouseout", function(d) {
        // tpActive = false;
        dOver = [];
        d4.select(this).style("cursor", "default");
        d4.select(".foreign-tooltip")
        .remove();
      })
      .call(d4.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .merge(node);

    // Colorize active nodes
    d4.selectAll(".node").selectAll("circle")
    .style("fill", function(d) {
      return node_colors[d.type];
    })

    // d4.selectAll(".node").selectAll("text").remove();

    // Apply the general update pattern to the links.
    link = link.data(links);
    link.exit().remove();
    link = link.enter().append("line")
      .attr("stroke", function(d) {
        return link_colors[d.type] || "#0000FF";
      })
      .on("mouseover", function(d) {
        dOverLink = d;
        d4.select(this).style("cursor", "none");
        var linkTooltip = d4.select("body")//svg
        .append("div")
        .attr('class', 'foreign-tooltip')

        linkTooltip.append("div")
        .attr('class', 'node-tooltip')
        .html(function(d) {
          return '<p class="name">' + linkLabels[dOverLink.type] + ': ' + dOverLink.weight + '</p>';
        });
      })
      .on("mousemove", function(d) {
        // console.log(d4.mouse(this)[0]);
        d4.select(".foreign-tooltip")
        .style("left", (d4.event.pageX - 80) + "px")
        .style("top", (d4.event.pageY + 10) + "px");
      })
      .on("mouseout", function(d) {
        // tpActive = false;
        dOverLink = [];
        d4.select(this).style("cursor", "default");
        d4.select(".foreign-tooltip")
        .remove();
      })
      .merge(link);

    d4.selectAll("line")
      .style("opacity", 0.7)
      .attr("stroke-width", function(d) { return strokeWidth(d.weight); })

    nodeLabel = d4.selectAll(".node").filter(d => {return d.weight>30}).append("text")
      .html(function(d) {
        return d.label;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '1rem')//12
      .style('text-shadow', '2px 2px 2px white')//12
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .attr('class', 'bubble-label');

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links).id(function(d) { return d.id; });
    // simulation.force("link", d4.forceLink(links).id(function(d) { return d.id; }).distance(40));
    simulation.alpha(0.25);
    chart.simulation = simulation;
  }

  function ticked() {
    node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

    nodeLabel
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; });

    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  }

  function dragstarted(d) {
    if (!d4.event.active) simulation.alphaTarget(0.05).restart();//0.08
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d4.event.x;
    d.fy = d4.event.y;
  }

  function dragended(d) {
    if (!d4.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  /******** User interactions ********/

  update();
  return chart;
}


const tiza = {
  barColors: barColors,
  procurementColors: procurementColors,
  yearlyContractsBar: _wait(barChart),
  contractTypePie: _wait(pieChart),
  moneyFlow: _wait(flujosProveedores)
}

tiza_init();
