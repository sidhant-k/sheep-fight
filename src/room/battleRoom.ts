import { Room, Client, ServerError, Delayed } from "colyseus";
import axios from "axios";
import { events, url, getDeductHealth, oneUnitMassSpeed } from "../constant";
import { State, Player, QueueObject } from "./schema/roomState";
import { publishResult } from "./publishResult";

//const generalSheepArray = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

export class battleRoom extends Room<State> {

    private joinTimer!: Delayed;
    private joinCounter: number = 3;
    private joinFlag: number = 0;
    private findWinnerFlag: number = 0;

    OnGetState(client: Client) {
        console.log("all players-->>", this.clients[0].id);
        console.log("event received for gate state ->");
        let payload = {
            clientId: client.id,
            health: this.state.players.get(`${client.id}`)?.health,
            lane: this.state.players.get(`${client.id}`)?.lane,
            sheep: this.state.players.get(`${client.id}`)?.sheep
        };
        this.broadcast(events.state, payload);
    }

    OnNewMove(client: Client, data: any) {
        console.log("event received for new move-------------->>>>>>>>>>>>>>>>>>>>>>");
        let player = this.state.players.get(`${client.id}`);
        if (player.spawnFlag == 0 && this.joinFlag == 1) {
            player.spawnCounter = 4;
            player.spawnFlag = 1;
            player.sheep = Math.floor(Math.random() * 5) + 1;
            console.log("new sheep spawn -->", client.id, "lane:", data.lane, "sheep:", player.sheep);
            player.lane = data.lane;
            let payload = {
                clientId: client.id,
                health: player.health,
                sheep: player.sheep,
                lane: player.lane
            }
            this.broadcast(events.newMove, payload);

            player.spawnTimer = this.clock.setInterval(() => {
                this.spawnCountDownTimer(player, client);
            }, 1000);
        }

    }

    onSpawnValidate(client: Client, data: any) {
        let player = this.state.players.get(`${client.id}`);
        if (player.lane == data.lane && player.sheep == data.sheep) {
            console.log("sheep validated ->>", data);
            let queueObject = new QueueObject();
            queueObject.sheep = player.sheep;
            switch (data.lane) {
                case 1: {
                    player.laneQueue1.push(queueObject);
                    break;
                }
                case 2: {
                    player.laneQueue2.push(queueObject);
                    break;
                }
                case 3: {
                    player.laneQueue3.push(queueObject);
                    break;
                }
                case 4: {
                    player.laneQueue4.push(queueObject);
                    break;
                }
                case 5: {
                    player.laneQueue5.push(queueObject);
                    break;
                }
            }

            // player.spawnTimer = this.clock.setInterval(() => {
            //     this.spawnCountDownTimer(player, client);
            // }, 1000);
        }
        else {
            console.log("sheep didnt validate!!!! ->", data);
        }
    }

    spawnCountDownTimer(player: Player, client: Client) {
        if (player.spawnCounter > 0) {
            this.broadcast(events.spawnTimer, { clientId: client.id, timeLeft: player.spawnCounter, maxTime: 3 });
            if (player.spawnCounter == 1 && player.spawnTimer) {
                player.spawnTimer.clear();
                player.spawnFlag = 0;
            }
        }
        player.spawnCounter--;
    }

    OnLineCrossed(client: Client, data: any) {
        try {
            console.log("event received for line crossed ->", client.id, data);
            let healthDeduct = 0
            let opponentClientId;
            for (let index = 0; index < this.maxClients; index++) {
                if (client.id != this.clients[index].id) {
                    opponentClientId = this.clients[index].id;
                }
            }
            let player = this.state.players.get(`${client.id}`);
            let opponentPlayer = this.state.players.get(`${opponentClientId}`);
            let popQueue;
            let flag = 0;
            switch (data.lane) {
                case 1: {
                    if (data.direction == 1) {
                        if (player.collisionQueue1.length > 0 && player.collisionQueue1.at(0).sheep == data.sheep) {
                            popQueue = player.collisionQueue1.shift();
                            flag = 1;
                        }
                        else if (player.laneQueue1.length > 0 && player.laneQueue1.at(0).sheep == data.sheep) {
                            popQueue = player.laneQueue1.shift();
                            flag = 1;
                        }
                    }
                    else if (data.direction == -1) {
                        let lastIndex = player.collisionQueue1.length - 1;
                        if (player.collisionQueue1.length > 0 && player.collisionQueue1.at(lastIndex).sheep == data.sheep) {
                            popQueue = player.collisionQueue1.pop();
                        }
                    }
                    break;
                }
                case 2: {
                    if (data.direction == 1) {
                        if (player.collisionQueue2.length > 0 && player.collisionQueue2.at(0).sheep == data.sheep) {
                            popQueue = player.collisionQueue2.shift();
                            flag = 1;
                        }
                        else if (player.laneQueue2.length > 0 && player.laneQueue2.at(0).sheep == data.sheep) {
                            popQueue = player.laneQueue2.shift();
                            flag = 1;
                        }
                    }
                    else if (data.direction == -1) {
                        let lastIndex = player.collisionQueue2.length - 1;
                        if (player.collisionQueue2.length > 0 && player.collisionQueue2.at(lastIndex).sheep == data.sheep) {
                            popQueue = player.collisionQueue2.pop();
                        }
                    }
                    break;
                }
                case 3: {
                    if (data.direction == 1) {
                        if (player.collisionQueue3.length > 0 && player.collisionQueue3.at(0).sheep == data.sheep) {
                            popQueue = player.collisionQueue3.shift();
                            flag = 1;
                        }
                        else if (player.laneQueue3.length > 0 && player.laneQueue3.at(0).sheep == data.sheep) {
                            popQueue = player.laneQueue3.shift();
                            flag = 1;
                        }
                    }
                    else if (data.direction == -1) {
                        let lastIndex = player.collisionQueue3.length - 1;
                        if (player.collisionQueue3.length > 0 && player.collisionQueue3.at(lastIndex).sheep == data.sheep) {
                            popQueue = player.collisionQueue3.pop();
                        }
                    }
                    break;
                }
                case 4: {
                    if (data.direction == 1) {
                        if (player.collisionQueue4.length > 0 && player.collisionQueue4.at(0).sheep == data.sheep) {
                            popQueue = player.collisionQueue4.shift();
                            flag = 1;
                        }
                        else if (player.laneQueue4.length > 0 && player.laneQueue4.at(0).sheep == data.sheep) {
                            popQueue = player.laneQueue4.shift();
                            flag = 1;
                        }
                    }
                    else if (data.direction == -1) {
                        let lastIndex = player.collisionQueue4.length - 1;
                        if (player.collisionQueue4.length > 0 && player.collisionQueue4.at(lastIndex).sheep == data.sheep) {
                            popQueue = player.collisionQueue4.pop();
                        }
                    }
                    break;
                }
                case 5: {
                    if (data.direction == 1) {
                        if (player.collisionQueue5.length > 0 && player.collisionQueue5.at(0).sheep == data.sheep) {
                            popQueue = player.collisionQueue5.shift();
                            flag = 1;
                        }
                        else if (player.laneQueue5.length > 0 && player.laneQueue5.at(0).sheep == data.sheep) {
                            popQueue = player.laneQueue5.shift();
                            flag = 1;
                        }
                    }
                    else if (data.direction == -1) {
                        let lastIndex = player.collisionQueue5.length - 1;
                        if (player.collisionQueue5.length > 0 && player.collisionQueue5.at(lastIndex).sheep == data.sheep) {
                            popQueue = player.collisionQueue5.pop();
                        }
                    }
                    break;
                }
            }

            if (flag == 1) {
                healthDeduct = 1 * getDeductHealth(data.sheep);
                opponentPlayer.health -= healthDeduct;
            }
            console.log("queue poped-->> sheep: ", popQueue.sheep, client.id, "direction", data.direction);
            if (opponentPlayer.health < 0) {
                opponentPlayer.health = 0;
            }
            let payload = {
                data: [
                    {
                        clientId: client.id,
                        deductHealth: 0
                    },
                    {
                        clientId: opponentClientId,
                        deductHealth: healthDeduct
                    }
                ]
            };
            console.log("broadcasting event for line crossed ->", payload);
            this.broadcast(events.lineCrossed, payload);
            if (opponentPlayer.health <= 0) {
                let winner = {
                    winnerClientId: client.id
                }
                let result = {
                    "battleId": `${this.roomId}`,
                    "result": [
                        {
                            "id": player.userId,
                            "score": player.health
                        },
                        {
                            "id": opponentPlayer.userId,
                            "score": opponentPlayer.health
                        }
                    ]
                }
                console.log("result for publish-->> ", result);

                this.clock.setTimeout(() => {
                    this.broadcast(events.gameOver, winner);
                }, 1000)
                //publishResult(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    OnCollision(client: Client, data: any) {
        try {
            console.log("event received for collision-->>", client.id, data);
            let player = this.state.players.get(`${client.id}`);
            console.log("checking sheep in lane-->>");
            let opponentClientId;
            for (let index = 0; index < this.maxClients; index++) {
                if (client.id != this.clients[index].id) {
                    opponentClientId = this.clients[index].id;
                }
            }
            let opponentPlayer = this.state.players.get(`${opponentClientId}`);
            let playerHerdSum = 0;
            let opponentPlayerHerdSum = 0;
            switch (data.lane) {
                case 1: {
                    if (player.laneQueue1.at(0).sheep == data.sheep) {
                        player.laneQueue1.shift();
                        let queueObject = new QueueObject();
                        queueObject.sheep = data.sheep;
                        player.collisionQueue1.push(queueObject);

                        if (opponentPlayer.collisionQueue1.length > 0) {

                            for (let index = 0; index < player.collisionQueue1.length; index++) {
                                playerHerdSum += player.collisionQueue1.at(index).sheep;
                            }

                            for (let index = 0; index < opponentPlayer.collisionQueue1.length; index++) {
                                opponentPlayerHerdSum += opponentPlayer.collisionQueue1.at(index).sheep;
                            }
                        }
                    }
                    break;
                }
                case 2: {
                    if (player.laneQueue2.at(0).sheep == data.sheep) {
                        player.laneQueue2.shift();
                        let queueObject = new QueueObject();
                        queueObject.sheep = data.sheep;
                        player.collisionQueue2.push(queueObject);

                        if (opponentPlayer.collisionQueue2.length > 0) {
                            for (let index = 0; index < player.collisionQueue2.length; index++) {
                                playerHerdSum += player.collisionQueue2.at(index).sheep;
                            }

                            for (let index = 0; index < opponentPlayer.collisionQueue2.length; index++) {
                                opponentPlayerHerdSum += opponentPlayer.collisionQueue2.at(index).sheep;
                            }
                        }
                    }
                    break;
                }
                case 3: {
                    if (player.laneQueue3.at(0).sheep == data.sheep) {
                        player.laneQueue3.shift();
                        let queueObject = new QueueObject();
                        queueObject.sheep = data.sheep;
                        player.collisionQueue3.push(queueObject);

                        if (opponentPlayer.collisionQueue3.length > 0) {
                            for (let index = 0; index < player.collisionQueue3.length; index++) {
                                playerHerdSum += player.collisionQueue3.at(index).sheep;
                            }

                            for (let index = 0; index < opponentPlayer.collisionQueue3.length; index++) {
                                opponentPlayerHerdSum += opponentPlayer.collisionQueue3.at(index).sheep;
                            }
                        }
                    }
                    break;
                }
                case 4: {
                    if (player.laneQueue4.at(0).sheep == data.sheep) {
                        player.laneQueue4.shift();
                        let queueObject = new QueueObject();
                        queueObject.sheep = data.sheep;
                        player.collisionQueue4.push(queueObject);

                        if (opponentPlayer.collisionQueue4.length > 0) {
                            for (let index = 0; index < player.collisionQueue4.length; index++) {
                                playerHerdSum += player.collisionQueue4.at(index).sheep;
                            }

                            for (let index = 0; index < opponentPlayer.collisionQueue4.length; index++) {
                                opponentPlayerHerdSum += opponentPlayer.collisionQueue4.at(index).sheep;
                            }
                        }
                    }
                    break;
                }
                case 5: {
                    if (player.laneQueue5.at(0).sheep == data.sheep) {
                        player.laneQueue5.shift();
                        let queueObject = new QueueObject();
                        queueObject.sheep = data.sheep;
                        player.collisionQueue5.push(queueObject);

                        if (opponentPlayer.collisionQueue5.length > 0) {
                            for (let index = 0; index < player.collisionQueue5.length; index++) {
                                playerHerdSum += player.collisionQueue5.at(index).sheep;
                            }

                            for (let index = 0; index < opponentPlayer.collisionQueue5.length; index++) {
                                opponentPlayerHerdSum += opponentPlayer.collisionQueue5.at(index).sheep;
                            }
                        }
                    }
                    break;
                }
            }

            if (playerHerdSum > 0 && opponentPlayerHerdSum > 0) {
                let directionTowardsClient;
                let herdMomentSum = Math.abs(playerHerdSum - opponentPlayerHerdSum);
                let playerHerdSpeed = 0.00;
                let opponentPlayerHerdSpeed = 0.00;
                let playerHerdDirection = 0;;
                let opponentPlayerHerdDirection = 0;
                if (playerHerdSum > opponentPlayerHerdSum) {
                    playerHerdDirection = 1;
                    opponentPlayerHerdDirection = -1;
                    playerHerdSpeed = herdMomentSum * oneUnitMassSpeed;
                    opponentPlayerHerdSpeed = -1 * playerHerdSpeed;
                }
                else if (playerHerdSum < opponentPlayerHerdSum) {
                    playerHerdDirection = -1;
                    opponentPlayerHerdDirection = 1;
                    opponentPlayerHerdSpeed = herdMomentSum * oneUnitMassSpeed;
                    playerHerdSpeed = -1 * opponentPlayerHerdSpeed;
                }

                let playerPayload = {
                    lane: data.lane,
                    direction: playerHerdDirection,
                    clientId: client.id,
                    sheepHerdSum: playerHerdSum,
                    opponentHerdSum: opponentPlayerHerdSum,
                    speed: playerHerdSpeed
                }

                let opponentPlayerPayload = {
                    lane: data.lane,
                    direction: opponentPlayerHerdDirection,
                    clientId: opponentClientId,
                    sheepHerdSum: opponentPlayerHerdSum,
                    opponentHerdSum: playerHerdSum,
                    speed: opponentPlayerHerdSpeed
                }
                console.log("broadcasting collision ->", JSON.stringify(playerPayload), JSON.stringify(opponentPlayerPayload));
                client.send(events.collision, playerPayload);
                this.broadcast(events.collision, opponentPlayerPayload, {except: client});
            }
        } catch (error) {
            console.log(error);
        }
    }

    onFindWinner(clientId: any) {
        this.findWinnerFlag = 1;
        console.log("on find winner called-->>");
        let losePlayer = this.state.players.get(`${clientId}`);
        losePlayer.health = 0;
        let winPlayer;
        let winnerClientId;
        this.state.players.forEach((value, key) => {
            if (clientId != key) {
                winPlayer = this.state.players.get(`${key}`);
                winnerClientId = key;
            }
        })

        let result = {
            "battleId": `${this.roomId}`,
            "result": [
                {
                    "id": winPlayer.userId,
                    "score": winPlayer.health
                },
                {
                    "id": losePlayer.userId,
                    "score": losePlayer.health
                }
            ]
        }
        console.log("result for publish-->", result);
        let winner = {
            winnerClientId: winnerClientId
        }
        this.broadcast(events.gameOver, winner)
        this.clock.setTimeout(() => {
            this.disconnect();
        }, 1000)
        //publishResult(result);
        //this.disconnect();
    }

    onCreate(options: any) {
        this.maxClients = 2;
        this.setState(new State());
        console.log("GAME ROOM CREATED WITH OPTIONS", options);
        this.roomId = options["battleId"];
        console.log("now room id is: ", this.roomId);

        this.onMessage(events.handShake, (client, message) => {
            let currentState = this.state.players.get(`${client.id}`)?.health
            console.log("client: ", client.id, "message :", message, "state: ", currentState);
        })

        this.onMessage("*", (client, message, payload) => {
            //console.log("all message -> ", message, "payload-> ", payload);
            switch (message) {
                case events.getState: {
                    this.OnGetState(client);
                    break;
                }
                case events.newMove: {
                    this.OnNewMove(client, payload);
                    break;
                }
                case events.lineCrossed: {
                    this.OnLineCrossed(client, payload);
                    break;
                }
                case events.gameLeaveRequest: {
                    this.onFindWinner(client.id);
                    break;
                }
                case events.collision: {
                    this.OnCollision(client, payload);
                    break;
                }
                case events.chat: {
                    console.log("chat received ->", payload.msgNum);
                    let PayLoad = {
                        clientId: client.id,
                        msgNum: payload.msgNum
                    }
                    this.broadcast(events.chat, PayLoad);
                    break;
                }
                case events.spawnValidate: {
                    this.onSpawnValidate(client, payload);
                }
                case events.ping: {
                    client.send(events.pong);
                    break;
                }
                default: {
                    client.send(events.unknownEventReceived);
                    break;
                }
            }
        })
    }

    async onAuth(client: Client, options: any) {
        console.log("on auth user id->", options["userId"]);
        if (options["userId"]) {
            try {
                let userData = "asnbkjdasb";
                // let response = await axios.get(`${url.getBattleDataUrl}${this.roomId}`)
                // //console.log("userData -->>", response.data);
                // let users = response.data.result.players;
                // for (let index = 0; index < users.length; index++) {
                //     if (options["userId"] == users[index].id) {
                //         //console.log("userId found in auth-->", users[index].id);
                //         userData = users[index];
                //     }
                // }
                // if (userData) {
                //     return users;
                // }
                // else {
                //     return false;
                // }
            } catch (error) {
                throw new ServerError(500, 'Something went wrong!');
            }
        }
        else {
            throw new ServerError(400, "no userId provided");
        }
    }

    onJoin(client: Client, options: any, auth: any) {
        //console.log("auth->", auth);
        console.log("JOINED GAME ROOM:", client.sessionId, "on roomId: ", this.roomId);
        try {
            this.state.players.set(client.id, new Player());
            let player = this.state.players.get(`${client.id}`);
            player.userId = options["userId"];

            // generalSheepArray.sort(() => Math.random() - 0.5);
            // generalSheepArray.forEach(element => {
            //     player.sheepMoves.push(element);
            // })

            if (this.clients.length == this.maxClients) {
                //console.log("battle data-->>",JSON.stringify(response.data));
                let payload = {
                    battleData: "kjsbkjfhg",
                }
                //this.broadcast(events.joinGame, payload);

                this.joinTimer = this.clock.setInterval(() => {
                    this.joinCountDownTimer(payload);
                }, 1000);
            }
        } catch (error) {
            throw new ServerError(500, 'Something went wrong!');
        }
    }

    joinCountDownTimer(payload: any) {
        if (this.joinCounter >= 0) {
            this.broadcast(events.startTimer, { timeLeft: this.joinCounter });
        }
        else {
            this.broadcast(events.joinGame, payload);
            if (this.joinTimer) {
                this.joinFlag = 1;
                this.joinTimer.clear();
                this.joinCounter = 3;
            }
        }
        this.joinCounter--;
    }

    async onLeave(client: Client, consented: boolean) {
        console.log("user leaved", client.sessionId, consented);
        try {
            if (!consented) {
                console.log("not consented leave waiting for reconnection -->>>>>");
                this.broadcast(events.gameFreeze);
                await this.allowReconnection(client, 2);
                this.broadcast(events.gameRestart);
            }
        } catch (e) {
            // 20 seconds expired. let's remove the client.
            if (this.findWinnerFlag == 0) {
                this.onFindWinner(client.id);
            }
        }
    }

    onDispose() {
        console.log("room disposed");
    }

}