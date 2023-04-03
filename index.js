const data = require("./data.js");
require('dotenv').config();
const keepAlive = require("./server.js");

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
    ],
});
const prefix = "!";

client.once("ready", () => {
    console.log("Ready!");
});

client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const content = message.content;
    const num = content.match(/\d+/g);
    const regexArr = [/.*사용법.*/, /.*동방어구.*/, /.*주무기.*/, /.*각성무기.*/, /.*채널추천.*/, /.*강화.*/, /.*공구간.*/, /.*방구간.*/, /.*보물.*/,];

    if (regexArr[0].test(content)) {
        message.channel.send(`
            \n =========================================
            \n 카프라스 
            \n !동방어구 10, !주무기 10, !각성무기 10 
            \n =========================================
            \n 채널추천 
            \n !채널추천 
            \n =========================================
            \n 강화 
            \n !강화확률 30% 
            \n =========================================
            \n 공구간 
            \n !공구간 240 
            \n =========================================
            \n 방구간 
            \n !방구간 240
            \n =========================================
            \n 보물 (론의 영성, 셰레칸의 선단, 잿빛 반달의 가크투낙, 마크타난의 독선,나크의 붉은 눈물, 발타라의 천안)
            \n !보물 론의 영성
            \n =========================================
        `);
    } else if (regexArr[1].test(content)) {
        message.channel.send(`
            동방어구 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.defensive[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.defensive)}개 우둔은 알빠노
        `);
    } else if (regexArr[2].test(content)) {
        message.channel.send(`
            주무기 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.mainWeapon[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.mainWeapon)}개 
        `);
    } else if (regexArr[3].test(content)) {
        message.channel.send(`
            각성무기 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.arousalWeapon[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.arousalWeapon)}개 
        `);
    } else if (regexArr[4].test(content)) {
        const min = 0;
        const max = data.channels.length - 1;

        message.channel.send(`오늘의 채널은 ${data.channels[Math.floor(Math.random() * (max - min + 1)) + min]} 입니다.`);
    } else if (regexArr[5].test(content)) {
        if (Math.random() < num * 0.01) {
            message.channel.send("기린쉑 이걸 성공하누");
        } else {
            message.channel.send("실패~~~~~~~~~~~~~~!");
        }
    } else if (regexArr[6].test(content)) {
        let final = Infinity;

        for (let i = 0; i < data.power.length; i++) {
            if (data.power[i] > num && data.power[i] < final) {
                final = data.power[i];
            }
        }

        if (final === Infinity) {
            message.channel.send(`다음 공구간을 알 수 없습니다.`);
            return;
        }

        message.channel.send(`가장 가까운 공구간은 ${final} 입니다.`);
    } else if (regexArr[7].test(content)) {
        let final = Infinity;

        for (let i = 0; i < data.defense.length; i++) {
            if (data.defense[i] > num && data.defense[i] < final) {
                final = data.defense[i];
            }
        }

        if (final === Infinity) {
            message.channel.send(`다음 방구간을 알 수 없습니다.`);
            return;
        }

        message.channel.send(`가장 가까운 방구간은 ${final} 입니다.`);
    } else if (regexArr[8].test(content)) {
        message.channel.send("가모스 글로벌 한시간 기준");
        if (content === "!보물 론의 영성") {
            treasure(message, 0.026);
        } else if (content === "!보물 셰레칸의 선단") {
            treasure(message, 0.019);
        } else if (content === "!보물 잿빛 반달의 가크투낙") {
            treasure(message, 0.017);
        } else if (content === "!보물 마크타난의 독선") {
            treasure(message, 0.017);
        } else if (content === "!보물 나크의 붉은 눈물") {
            treasure(message, 0.01);
        } else if (content === "!보물 발타라의 천안") {
            message.channel.send("확률정보없음");
        }
    }
})

// 카프라스 총합
function accumulateCaphras(number, caphrasType) {
    let sum = 0;
    for (let i = 0; i < number; i++) {
        sum += caphrasType[i];
    }
    return sum;
}

// 보물작
function treasure(message, percent) {
    if (Math.random() < percent) {
        message.channel.send("이걸 쳐 먹네..");
    } else {
        message.channel.send("뜨겠냐?ㅋㅋ");
    }
}

keepAlive();
// 봇과 서버를 연결해주는 부분
client.login(process.env.TOKEN);
