# Streamgraphs
Use the stacked example to get team rankings
  
Use the stream example for twitter data

## To serve this directory:

    python -m SimpleHTTPServer 9999

Then go to [Stack example](http://localhost:9999/stack.html) 
or [Stream example](http://localhost:9999/stream.html)
or [Head2Head](http://localhost:9999/head2head.html)
    
OR with node:

    node server.js
    open http://localhost:3000/head2head.html

    #to deploy on cloudfoundry
    vmc push nothinbutnetc80fe
    vmc update nothinbutnetc80fe
    vmc delete nothinbutnetc80fe
    open http://nothinbutnetc80fe.cloudfoundry.com/head2head.html
    
## refs

* [d3 streamgraphs](https://github.com/mbostock/d3.git)
* [Processing Streamgraphs](https://github.com/jsundram/streamgraph.js.git)
