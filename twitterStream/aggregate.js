var fs = require('fs');

var tweetsByHandle = JSON.parse(fs.readFileSync('allTeamSearch-20120418-1400.json', 'utf8'));

var teamHandles = Object.keys(tweetsByHandle);
console.log(teamHandles);

function hour(d){
  if (typeof d=='string') d = new Date(d);
  return d.toISOString().substring(0,13);
}

var zeros = [];
for (i=0;i<teamHandles.length;i++) zeros.push(0);
// console.log('zeros',JSON.stringify(zeros));

var tweetsByTime = {
  // hour = "2012-04-18T18":[1,5,7,8,..Count_(teams)]
}
total=0;
teamHandles.forEach(function(team,teamIndex){
  var tweets = tweetsByHandle[team];
  console.log('Doing team',team,tweets.length);
  tweets.forEach(function(tweet){
    // console.log(tweet);
    var stamp = hour(tweet.created_at);
    // console.log(stamp,'+1');
    if (!tweetsByTime[stamp]){
      tweetsByTime[stamp]=zeros.slice(0);
      console.log('new stamp:',stamp,tweetsByTime[stamp]);
    }
    tweetsByTime[stamp]=tweetsByTime[stamp]||zeros.slice(0);
    tweetsByTime[stamp][teamIndex]++;
    total++;
  });
});


Array.prototype.transpose = function() {

  // Calculate the width and height of the Array
  var a = this,
  w = a.length ? a.length : 0,
  h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
  * @var {Number} i Counter
  * @var {Number} j Counter
  * @var {Array} t Transposed data is stored in this array.
  */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};
var stamps = Object.keys(tweetsByTime);
console.log('stamps',stamps.length);
stamps.sort();
raw=[];
stamps.forEach(function(stamp){
  var counts = tweetsByTime[stamp];
  // console.log(stamp,JSON.stringify(counts),total);
  raw.push(counts);
});

console.log('\n');
raw = raw.transpose();
raw.forEach(function(layer){
  layer.forEach(function(y,x){
    layer[x]={x:x,y:y};
    // console.log(x,i);
  })
})
console.log(JSON.stringify(raw));
