
// create a demo room only
var rooms = require("demo_room");
var users = require("demo_user");
rooms.create("demo");


app.get("/rooms/:id/chats", fetchRoom, function(req, res) {
   res.send(res.locals.room.latest());
});

app.post("/rooms/:id/chats", fetchRoom, function(req, res) {
   var room = res.locals.room;
   room.chat(req.body);
   res.send(200);
});

app.get("/rooms/:id/events", fetchRoom, function(req, res) {
   var room = res.locals.room;
   var sse = startSees(res);
   room.on("chat", sendChat);

   req.once("end", function() {
      rooms.removeListener("chat", sendChat);
   });

   function sendChat(chat) {
      sse("chat", chat);
   }
});

app.get("/users/:id", function(req, res) {
   users.get(req.params.id, function(err, user) {
      if(err) {
         return res.send(404);
      }

      res.send(user);
   });
});
app.post("/users", function(req, res) {
   users.create(function(err, user) {
      if(err) {
         return res.send(500);
      }

      res.send(user);
   });
});

function startSees(res) {
   res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
   });
   res.write("\n");

   return function sendSse(name,data,id) {
      res.write("event: " + name + "\n");
      if(id) res.write("id: " + id + "\n");
      res.write("data: " + JSON.stringify(data) + "\n\n");
   }
}

function fetchRoom(req, res, next) {
   var room = rooms.get(req.params.id);
   if(room) {
      res.locals.room = room;
      next();
   } else {
      res.status(404).end();
   }
}

