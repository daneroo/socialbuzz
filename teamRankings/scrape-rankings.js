//var page = new WebPage();
var page = require('webpage').create();
var fs = require('fs');

var server = 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Std_Div.html';

page.onConsoleMessage = function(msg) {
    stamplog('>> '+msg);
};
page.onAlert = function(msg) {
    console.log('>>> '+msg);
};

stamplog('fetching league rankings ');

page.open(server, function (status) {
  if (status !== 'success') {
    stamplog('Unable to post!');
    phantom.exit();
  } else {
      stamplog('got the page');
      if (page.injectJs("jquery-1.6.4.min.js")) {}

      var rankings = page.evaluate(function() {
          // jQuery is loaded, now manipulate the DOM, no need to wait for ready?!
          // that way we can return the value...
          //$(document).ready(extractPortfolio);
          return extractRankings();
          function extractRankings(){
            rankings = [];
            var division='None';
            $('table.mainStandings > tbody > tr').each(function(i,v){
              $this = $(this);
              // console.log('tr.class '+$this.prop('class'));
              if ($this.prop('class')=='') {
                conference= $this.find('td:eq(0)').text().split(' ')[0],
                console.log("--Conf: "+conference);
              } else if ($this.hasClass('title')) {
                division=$this.find('td:eq(0)').text()
                console.log("--Division: "+division);
              } else {
                 // console.log('tr.class '+$this.prop('class'));
                // console.log("--"+$(this).html());
                var notes = $this.find('td:eq(0) sup').remove().text();
                var team = {
                  conference:conference,
                  division:division,
                  name: $this.find('td:eq(0)').text(),
                  notes:notes,
                  wins: Number($this.find('td:eq(1)').text()),
                  losses : Number($this.find('td:eq(2)').text()),
                  percentage : Number($this.find('td:eq(3)').text()),
                  gamesBehind : Number($this.find('td:eq(4)').text()),
                  conferenceRecord : $this.find('td:eq(5)').text().split('-').map(Number),
                  divisionRecord : $this.find('td:eq(6)').text().split('-').map(Number),
                  homeRecord : $this.find('td:eq(7)').text().split('-').map(Number),
                  roadRecord : $this.find('td:eq(8)').text().split('-').map(Number),
                  last10Record : $this.find('td:eq(9)').text().split('-').map(Number),
                  streak : Number($this.find('td:eq(10)').text())
                }
                rankings.push(team);
                console.log(JSON.stringify(team,null,2));
              }
            });
            return rankings;
           }
      });
      //console.log(JSON.stringify(rankings,null,2));
      var f = fs.open('team-rankings.json', "w");
      f.write(JSON.stringify(rankings,null,2));
      f.close();
      console.log('wrote team-rankings.json');
      phantom.exit();
  }
});

function stamplog(msg){
    console.log(iso8601(new Date())+' '+msg);
}
function iso8601(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z';
}
