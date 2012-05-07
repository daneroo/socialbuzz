var fs = require('fs');
var twitter = require('ntwitter');

//twitter-credentials.json is in .gitignore : get your own credentials!
var credentials = JSON.parse(fs.readFileSync('twitter-credentials.json', 'utf8'));
var twit = new twitter(credentials);

// twit.search('nodejs OR #node', function(err, data) {
//   console.log(data);
// });

var handles = [
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


twit.verifyCredentials(function (err, data) {
 // console.log(data);
});

var delay=1000;
var grandTotal=0;
var tweetsByHandle={
 // handle:results  
}
function doit(teamIndex,page){
  var handle = handles[teamIndex];
  console.error('team',handle,'page',page);
  twit.search(handle,{rpp:100,page:page,include_entities:true}, function(err, data) {
    if(err){
      console.error('err',JSON.stringify(err));
      if (teamIndex<handles.length-2){
        setTimeout(function(){doit(teamIndex+1,1);},delay);
      } else {
        finish();
      }
    } else {
      tweetsByHandle[handle] = tweetsByHandle[handle] || [];
      tweetsByHandle[handle] = tweetsByHandle[handle].concat(data.results);
      grandTotal+=data.results.length;
      console.error('  |'+handle+'|=',tweetsByHandle[handle].length,'|all|=',grandTotal);
      if(0)data.results.forEach(function(tw,i){
        console.log(i,tw.created_at,tw.text);
      });
      // delete data.results;
      // console.log(data);
      if (page<20) {
        setTimeout(function(){doit(teamIndex,page+1);},delay);
      } else {
        if (teamIndex<handles.length-2){
          setTimeout(function(){doit(teamIndex+1,1);},delay);
        } else {
          finish();
        }
      }
    }
  });
}
function finish(){
  console.error('We are done');
  console.log(JSON.stringify(tweetsByHandle,null,2));
}
doit(0,1);
