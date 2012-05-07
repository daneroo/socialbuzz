var fs = require('fs');
var twitter = require('ntwitter');

//twitter-credentials.json is in .gitignore : get your own credentials!
var credentials = JSON.parse(fs.readFileSync('twitter-credentials.json', 'utf8'));
var twit = new twitter(credentials);

// twit.search('nodejs OR #node', function(err, data) {
//   console.log(data);
// });

twit.verifyCredentials(function (err, data) {
 // console.log(data);
});

twit.stream('statuses/filter',{
  // count:"-150000",
  track:[
  '@chicagobulls','#bulls',
  '@MisterCbooz','@JoakimNoah',
  '@okcthunder', '#thunder',
  '@KDTrey5', '@russwest44','@JHarden13',
  '@Lakers','#lakers',

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
  ]
},function(stream) {
  stream.on('data', justLog('All'));
});


function justLog(prefix){
  return function(data){
    // console.log(prefix,'-',data.text,data.user.screen_name);
    console.log(JSON.stringify(data));
    // if (data.entities) console.log('   --',JSON.stringify(data.entities,null,2));
  };
}


// .stream('statuses/sample', function(stream) {
//   stream.on('data', function (data) {
//     console.log(data.text,data.user.screen_name);
//   });
// })

// Broken
 // twit.search('nodejs OR #node', function(err, data) {
 //   console.log(data);
 // });
