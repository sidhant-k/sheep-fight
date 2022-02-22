export const BLOWFISH_SECRET_KEY = "ewar@2020_Super_Key";

export const oneUnitMassSpeed = 0.5;

export const events = {
    handShake: "handShake",
    joinGame: "joinGame",
    getState: "getState",
    state: "state",
    newMove: "newMove",
    lineCrossed: "lineCrossed",
    gameOver: "gameOver",
    unknownEventReceived: "unknownEventReceived",
    gameFreeze: "gameFreeze",
    gameRestart: "gameRestart",
    gameLeaveRequest: "gameLeaveRequest",
    collision: "collision",
    spawnTimer: "spawnTimer",
    startTimer: "startTimer",
    chat: "chat",
    spawnValidate: "spawnValidate",
    ping: "ping",
    pong: "pong",
};

let getBattleDataUrl;
let publishResultUrl;
let userDetailsUrl;
if (process.env.NODE_PORT == "prod") {
    getBattleDataUrl = 'https://v2.api.ewar.in/live/api/ewar/battle/';
    publishResultUrl = 'https://v2.api.ewar.in/live/api/ewar/result';
    userDetailsUrl = 'https://v2.api.ewar.in/live/api/ewar/user/';
}
else {
    getBattleDataUrl = 'https://stagingv2.ewar.in/live/api/ewar/battle/';
    publishResultUrl = 'https://stagingv2.ewar.in/live/api/ewar/result';
    userDetailsUrl = 'https://stagingv2.ewar.in/live/api/:provider/user/';
}

export const url = {
    getBattleDataUrl: getBattleDataUrl,
    publishResultUrl: publishResultUrl
}

export const getDeductHealth = (sheep) => {
    switch (sheep) {
        case 5: {
            return 5;
            break;
        }
        case 4: {
            return 4;
            break;
        }
        case 3: {
            return 3;
            break;
        }
        case 2: {
            return 2;
            break;
        }
        case 1: {
            return 1;
            break;
        }
        case 6: {
            return 6;
            break;
        }
        default: {
            return 0;
            break;
        }
    }
}
