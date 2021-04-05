# Tiza - A data visualization library, based in D3.js.

Beta version.

License: GPLv3

## Features
This library aims to provide a set of complete interactive visualizations for analizing public contracts, both yearly and as relations.


## Usage

Insert the script into the page
```
<script type="text/javascript" src="tiza.js"></script>
```

Each type of graph is a function that needs to be called with specific paramets.


### yearlyContractsBar
Recieves year summary data, split by role, and generates three yearly count and amount bar graphs.

Recieves a mandatory options parameter.
- data - object - each key is a year, and it's value is an object with two numeric properties: value and count
- amountKeyName - string - Label for the amount axis
- countKeyName - string - Label for the count axis
- barColors - object - Each key is the label of an axis, the values are objects, with keys based on the summary type and two string properties, with keys being amount or count, and values being css representations of colors (#hex or rgb()). Default values are provided in tiza.barColors.
- target - string - id of an empty div to contain the chart


Example:
``` 
<script>
  tiza.yearlyContractsBar({
    target: "#chart-year-buyer", 
    amountKeyName: "Importe",
    countKeyName: "Cantidad",
    barColors: {
        "Importe": tiza.barColors["buyer"].amount,
        "Cantidad": tiza.barColors["buyer"].count
    },
    type: "buyer", 
    data: { '2002': { value: 1388121.6875, count: 3 },
  '2003': { value: 1453713152, count: 1 },
  '2005': { value: 2448522.4375, count: 4 },
  '2007': { value: 3373499904, count: 1 } } 
  });
</script>
``` 

### contractTypePie
Recieves type summary data, split by role, and generates three type amount pie charts.

Recieves a mandatory options parameter.
- data - array
- nameLabels - array
- procurementColors - object - Each key is the label of an axis, the values are objects, with keys based on the summary type and two string properties, with keys being the procurement type (open, direct, limited or undefined), and values being css representations of colors (#hex or rgb()). Default values are provided in tiza.procurementColors.
- target - string - id of an empty div to contain the chart


Example:
``` 
<script>
  tiza.yearlyContractsBar({
    target: "#chart-year-buyer", 
    amountKeyName: "Importe",
    countKeyName: "Cantidad",
    barColors: {
        "Importe": tiza.barColors["buyer"].amount,
        "Cantidad": tiza.barColors["buyer"].count
    },
    type: "buyer", 
    data: { '2002': { value: 1388121.6875, count: 3 },
  '2003': { value: 1453713152, count: 1 },
  '2005': { value: 2448522.4375, count: 4 },
  '2007': { value: 3373499904, count: 1 } } 
  });
</script>
``` 

### moneyFlow
Recieves relation summary data, i.e., a collection of nodes and links, and represents a network.

Recieves a mandatory options parameter.
- data.nodes - array - Each element is an object with the following properties 
- - id - string - id for the node
- - weight - number - size of the node
- - type - string - node type (supplier, buyer, dependencia, contactPoint)
- - label - string - name to display in the node
- data.links - array - Each element is an object with the following properties 
- - target - string - id of the target node for the link
- - source - string - id of the source of the link
- - classification - string - type of node
- - type - string - type of relation (direct, open, selective, undefined)
- - weight - number - size of the link
- target - string - For the moment, the target div for this diagram is hardcoded as "graph-container"

Example: 
```

<script>
  tiza.moneyFlow({target: "graph-container", data: { nodes:
   [ { id: 'polietilenos-del-sur-sa-de-cv',
       weight: 2,
       type: 'supplier',
       label: 'POLIETILENOS DEL SUR, SA DE C.V' },
     { id: 'serv-prof-integrales-para-el-desarrollo-regional-sc',
       weight: 2,
       type: 'supplier',
       label: 'SERV. PROF. INTEGRALES PARA EL DESARROLLO REGIONAL S.C.' },
     { id: 'colegio-de-postgraduados',
       weight: 1,
       type: 'supplier',
       label: 'COLEGIO DE POSTGRADUADOS' },
     { id: 'corporacion-chapingo-sa-de-cv',
       weight: 1,
       type: 'supplier',
       label: 'CORPORACION CHAPINGO S. A. DE C. V.' },
     { id: 'corzo-&-pla-enterpise-sa-de-cv',
       weight: 1,
       type: 'supplier',
       label: 'CORZO & PLA ENTERPISE S.A. DE.C.V' },
     { id: 'maquilas-plasticas-poliducto-c-sa-de-cv',
       weight: 1,
       type: 'supplier',
       label: 'MAQUILAS PLASTICAS POLIDUCTO "C", S.A. DE C.V.' },
     { id: 'plasticos-y-fertilizantes-de-morelos-sa-de-cv',
       weight: 1,
       type: 'supplier',
       label: 'PLASTICOS Y FERTILIZANTES DE MORELOS, S.A. DE C.V.' },
     { id:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       weight: 9,
       type: 'uc',
       label: 'Dirección de Administración y Finanzas' },
     { id:
        'secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       type: 'dependencia',
       weight: 9,
       label:
        'SECRETARÍA DE DESARROLLO AGROPECUARIO, RURAL, FORESTAL PESCA Y ALIMENTACIÓN DEL ESTADO DE VERACRUZ' } ],
  links:
   [ { target: 'polietilenos-del-sur-sa-de-cv',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 2 },
     { target: 'serv-prof-integrales-para-el-desarrollo-regional-sc',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 2 },
     { target: 'colegio-de-postgraduados',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 1 },
     { target: 'corporacion-chapingo-sa-de-cv',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 1 },
     { target: 'corzo-&-pla-enterpise-sa-de-cv',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 1 },
     { target: 'maquilas-plasticas-poliducto-c-sa-de-cv',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 1 },
     { target: 'plasticos-y-fertilizantes-de-morelos-sa-de-cv',
       source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       classification: 'supplier',
       type: 'open',
       weight: 1 },
     { source:
        'direccion-de-administracion-y-finanzas-secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       target:
        'secretaria-de-desarrollo-agropecuario-rural-forestal-pesca-y-alimentacion-del-estado-de-veracruz',
       type: 'open',
       classification: 'dependencia',
       weight: 9 } ] } });

</script>
```

## ToDo
- Make functions more abstract
- Add more functions
