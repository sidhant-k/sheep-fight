const Colyseus = require("colyseus.js");

//const client = new Colyseus.Client('ws://52.66.221.61:4020');
const client = new Colyseus.Client('ws://localhost:4020');

client.joinOrCreate("room", {
    battleId: "testBattle5001",
    userId: "00dd2016-d472-427b-a967-b4a505d0245c"
}).then(room => {
    console.log(room.sessionId, "joined", room.id);
     
    room.onMessage("startTimer", (message) => {
        console.log("start timer", message);
    })

    room.onMessage("collision", (message) => {
        console.log("collision message ->", message);
    })

    // room.onMessage("matchFound", (message) => {
    //     console.log(room.sessionId, "received on", room.id, message);
    //     room.send("joinGame");
    // });

    // room.onMessage("state", (message) => {
    //     console.log("state: ",message);
    //     let payload = {
    //         sheep: 4,
    //         lane: 2
    //     }
    //     room.send("newMove", payload);
    // })

    // room.onMessage("newMove", (message) => {
    //    console.log("message: ", message);
    // })

    room.onMessage("spawnTimer", (message) => {
        console.log("timer: ",message);
        let payload = {
            sheep: 4,
            lane: 2
        }
        //room.send("newMove", payload);
        if(message.timeLeft = 1){
            room.send("collision",payload);
        }
    }) 

    // room.onMessage("state1", (message) => {
    //     let payload = {
    //         sheep: 5,
    //         lane: 2
    //     }
    //     room.send("lineCrossed", payload);
    //     room.send("gameLeaveRequest");
    // })

    room.onMessage("joinGame", (message) => {
        console.log("client: ",room.sessionId, "battle data: ",message);
        //room.send("getState");
        let payload = {
                    sheep: 4,
                    lane: 2
                }
                room.send("newMove", payload);
    })

    room.onMessage("chat", (message) => {
        console.log(message);
    })

    room.onMessage("gameOver", (message) => {
        console.log("GAME OVER");
        //room.leave();
        console.log("message: ",message);
        //room.send("gameLeaveRequest");
    })
    
    // let payload = {
    //     userId: "jkehfkje"
    // }
    // room.send("hand-shake", payload);

    room.onLeave((code) => {
        console.log(room.sessionId, "left", room.name);
    });

    room.onError((code, message) => {
        console.log(client.id, "couldn't join", room.name);
    });

}).catch(e => {
    console.log("JOIN ERROR", e);
});
