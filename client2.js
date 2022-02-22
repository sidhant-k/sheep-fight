const Colyseus = require("colyseus.js");

//const client = new Colyseus.Client('ws://52.66.221.61:4020');
const client = new Colyseus.Client('ws://localhost:4020');

client.joinOrCreate("room", {
    battleId: "testBattle5001",
    userId: "00dd223c-7c1a-42f7-9888-8defadb7b39e"
}).then(room => {
    console.log(room.sessionId, "joined", room.id);
    
    room.onMessage("startTimer", (message) => {
        console.log("start timer", message);
    })

    // room.onMessage("matchFound", (message) => {
    //     console.log(room.sessionId, "received on", room.id, message);
    //     room.send("joinGame");
    // });

    // room.onMessage("state", (message) => {
    //     console.log("state: ",message);
    // })

    // room.onMessage("newMove", (message) => {
    //     console.log("message: ", message);
    //  })

    // room.onMessage("spawnTimer", (message) => {
    //     console.log("timer: ",message);
    // }) 

    room.onMessage("joinGame", (message) => {
        console.log("client: ",room.sessionId, "battle data: ",message);
        let payload = {
            sheep: 4,
            lane: 2
        }
        room.send("newMove", payload);
    })

    room.onMessage("collision", (message) => {
        console.log("collision message ->", message);
    })

    room.onMessage("gameOver", (message) => {
        console.log("GAME OVER");
        console.log("message: ",message);
        //room.send("gameLeaveRequest");
    })

    room.onMessage("chat", (message) => {
        console.log(message);
    })

    
    // let payload = {
    //     userId: "jkehfkje"
    // }
    // room.send("hand-shake", payload);

    room.onLeave((code) => {
        console.log(client.id, "left", room.name);
    });

    room.onError((code, message) => {
        console.log(client.id, "couldn't join", room.name);
    });

}).catch(e => {
    console.log("JOIN ERROR", e);
});
