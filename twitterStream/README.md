# Fettch twitter data:

## Live
This is a one tweet json per line file.

    node main.js >>liveStream.json
    # or
    while true; do node main.js >>liveStream.json; sleep 10; done
    
## search
This does a twitter  search on each team handle, on big json.
It take about 940s to run. 1 search page per second to avoid rate limitting.

    node search.js >allTeamSearch-`date '+%Y%m%d-%H%M'`.json
    
## Aggregation
Produce usable aggregated data from above.

    node aggregateLive.js > liveByHandle.json
    # or even
    node aggregateLive.js > ../d3viz/liveByHandle.json  