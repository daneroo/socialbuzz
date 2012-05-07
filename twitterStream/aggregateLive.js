var fs = require('fs')

parseJSONbyLineFile('liveStream.json',handleTweet,output);

var tweetsByTime = {
  // stamp==hour = "2012-04-18T18":[1,5,7,8,..Count_(teams)]
}

function output(){
  // output an array of { "@teamHandle":[{stamp:"2012-04-19T07:00:00Z",count:1234}]
  // we have tweetsByTime[stamp][teamIndex]
  // map to  tweetsByHandle[handle][...data series]
  var tweetsByHandle={};

  var stamps = Object.keys(tweetsByTime);
  stamps.sort();
  stamps.forEach(function(stamp){
    var countsByTeamIndexForStamp = tweetsByTime[stamp];
    countsByTeamIndexForStamp.forEach(function(count,teamIndex){
      var handle=teamHandles[teamIndex];
      tweetsByHandle[handle]=tweetsByHandle[handle]||[];
      // just the data
      tweetsByHandle[handle].push(count);
      // data structure for d3
      // tweetsByHandle[handle].push({stamp:stamp,y:count});      
    });
  });
  console.log(JSON.stringify(tweetsByHandle))
}

var tweetCount=0;
function handleTweet(tweet){
  tweetCount++;
  var stamp = hour(tweet.created_at);
  // tweet.entities.hashtags[].text := (#)LAKERS
  // tweet.entities.user_mentions[].screen_name := (@)celtics
  tweet.entities.user_mentions.forEach(function(mention){
    handle = teamHandleFromScreenName(mention.screen_name);
    if (handle) incrementTweet(handle,stamp)
    // if (handle) console.error(' -- ',handle,tweetsByTime[stamp][teamIndexFromHandle(handle)]);
  });
  // console.error('tweet',stamp,tweetCount);
}

var zeros = null; // array of |teamHandles| zeros
function incrementTweet(handle,stamp){
  if (!zeros){ zeros=[]; for (i=0;i<teamHandles.length;i++) {zeros.push(0);}}
  // to mark progress
  if (!tweetsByTime[stamp]) console.error('stamp:',stamp,'total',tweetCount);
  tweetsByTime[stamp]=tweetsByTime[stamp]||zeros.slice(0);
  var teamIndex = teamIndexFromHandle(handle);
  tweetsByTime[stamp][teamIndex]++;
  // console.error('          ++increment',stamp,handle,teamIndex,tweetsByTime[stamp][teamIndex]);
}

function hour(d){
  if (typeof d=='string') d = new Date(d);
  return d.toISOString().substring(0,13)+':00:00Z';
}

function parseJSONbyLineFile(fileName, cb,doneCallback){
  var stream = fs.createReadStream(fileName)
  var iteration = 0, header = [], buffer = ""
  stream.addListener('data', function(data){
    buffer+=data.toString()
    var parts = buffer.split('\n')
    parts.forEach(function(line, i){
      if(i == parts.length-1) return;
      var jsonObj = handleJSONLine(line);
      if (cb) cb(jsonObj)
    })
    buffer = parts[parts.length-1]
  });

  stream.addListener('end',doneCallback);

  function handleJSONLine(line){
    // console.error('got a line',lineCount++);
    jsonObj = JSON.parse(line);
    return jsonObj;
  }
}

var teamHandles=[
'@atlanta_hawks',// Atlanta Hawks
'@celtics', //Boston Celtics –
'@bobcats', //Charlotte Bobcats - 
'@chicagobulls', //Chicago Bulls – 
'@cavs', //Cleveland Cavaliers – 
'@dallasmavs', //Dallas Mavericks – 
'@denvernuggets', //Denver Nuggets - 
'@detroitpistons', //Detroit Pistons - 
'@warriors', //Golden State Warriors – 
'@HoustonRockets', //Houston Rockets - 
'@indianapacers', //Indiana Pacers - 
'@LAClippers', //Los Angeles Clippers - 
'@lakers', //Los Angeles Lakers - 
'@memgrizz', //Memphis Grizzlies - 
'@MIAMIHEAT',//Miami Heat - 
'@bucks', //Milwaukee Bucks - 
'@mntimberwolves', //Minnesota Timberolves - 
'@netsbasketball', //New Jersey Nets - 
'@hornets', //New Orleans Hornets - 
'@thenyknicks', //New York Knicks – 
'@okcthunder', //Oklahoma City Thunder - 
'@Orlando_Magic', //Orlando Magic - 
'@sixers', //Philadelphia 76ers - 
'@phoenixsuns',//Phoenix Suns - 
'@pdxtrailblazers', //Portland Trailblazers
'@sacramentokings', //Sacramento Kings - 
'@spurs', //San Antonio Spurs - 
'@raptors', //Toronto Raptors – 
'@utah_jazz', //Utah Jazz - 
'@washwizards' //Washington Wizards - 
];
function teamCount(){
  return teamHandles.length;
}
var teamHandleLookup=null; // init with { 'miamiheat':'@MIAMIHEAT',...}
function teamHandleFromScreenName(screen_name){
  if (!teamHandleLookup){
    teamHandleLookup={};
    teamHandles.forEach(function(teamHandle){
      teamHandleLookup[teamHandle.substring(1).toLowerCase()]=teamHandle;
    });
  }
  return teamHandleLookup[screen_name.toLowerCase()];
}
var teamIndexLookup=null; // init with { 'miamiheat':'@MIAMIHEAT',...}
function teamIndexFromHandle(handle){
  if (!teamIndexLookup){
    teamIndexLookup={};
    teamHandles.forEach(function(teamHandle,teamIndex){
      teamIndexLookup[teamHandle]=teamIndex;
    });
  }
  return teamIndexLookup[handle];
}
