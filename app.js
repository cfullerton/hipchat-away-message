var wobot = require('wobot');
var app = require('express')();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'jade');
var runningBots = []
app.get('/', function(req, res) {
    res.render("index");
});
app.get('/public/*', function(req, res){
    var uid = req.params.uid,
        path = req.params[0] ? req.params[0] : 'index.html';
    res.sendfile(path, {root: './public'});
});
app.post("/",function(req,res){
  var bot = new wobot.Bot({
    jid: req.body.username,
    password: req.body.password
  });
  bot.onPrivateMessage(function(sender,message){
      message = req.body.message;
      bot.message(sender, message )
  })
  bot.connect();
  runningBots.push(bot);
  res.send("bot started")
})
app.post("/remove",function(req,res){
  for (var i=0;i<runningBots.length;i++){
    console.log(runningBots[i]);
    if (runningBots[i].jid == req.body.username +"/wobot" && runningBots[i].password){
      runningBots[i].disconnect();
      delete runningBots[i];
      res.send("autoreply removed")
      break;
    }
  }
  res.send("JID or password incorrect")
})
app.listen(8080)
