const data = require("./data.js");
require('dotenv').config();
// const keepAlive = require("./server.js");

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
    const num = content.match(/\b\d+(\.\d+)?\b/g);
    const regexArr = [/.*사용법.*/, /.*동방어구.*/, /.*주무기.*/, /.*각성무기.*/, /.*채널추천.*/, /.*강화.*/, /.*공구간.*/, /.*방구간.*/, /.*보물.*/, /.*보스.*/];

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
            \n !강화확률 30% or !강화확률 30 
            \n =========================================
            \n 공구간 
            \n !공구간 240 
            \n =========================================
            \n 방구간 
            \n !방구간 240
            \n =========================================
            \n 보물 (영성, 선단, 크투낙, 독선,눈물, 천안)
            \n !보물 영성
            \n =========================================
            \n 보스 시간 
            \n !보스
            \n =========================================
        `);

    } else if (regexArr[1].test(content)) {

        if (num === null || num === undefined || num - 1 < 0) {
            message.channel.send("하..빡통쉑 제대로 쳐라");
            return;
        }

        message.channel.send(`
            동방어구 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.defensive[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.defensive)}개 우둔은 알빠노
        `);

    } else if (regexArr[2].test(content)) {

        if (num === null || num === undefined || num - 1 < 0) {
            message.channel.send("하..빡통쉑 제대로 쳐라");
            return;
        }

        message.channel.send(`
            주무기 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.mainWeapon[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.mainWeapon)}개 
        `);

    } else if (regexArr[3].test(content)) {

        if (num === null || num === undefined || num - 1 < 0) {
            message.channel.send("하..빡통쉑 제대로 쳐라");
            return;
        }

        message.channel.send(`
            각성무기 카프라스 ${num - 1}에서 ${num}까지 필요수량 ${data.arousalWeapon[num - 1]}개 누적 카프라스 ${accumulateCaphras(num[0], data.arousalWeapon)}개 
        `);

    } else if (regexArr[4].test(content)) {

        const min = 0;
        const max = data.channels.length - 1;

        message.channel.send(`오늘의 채널은 ${data.channels[Math.floor(Math.random() * (max - min + 1)) + min]} 입니다.`);

    } else if (regexArr[5].test(content)) {

        if (num * 0.01 > 1) {
            message.channel.send("아잇 싯팔 꼴받게 하지말라고");
            return;
        } else if (/-\w+/g.test(content)) {
            message.channel.send("마이너스 넣지말라고");
            return;
        }

        let interval = setInterval(() => {
            message.channel.send(".");
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);

            if (Math.random() < num * 0.01) {
                message.channel.send("기린쉑 이걸 성공하누");
            } else {
                message.channel.send("실패~~~~~~~~~~~~~~!");
            }
        }, 5000);

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

        if (content === "!보물 영성") {
            message.channel.send("가모스 글로벌 한시간 기준");
            treasure(message, 0.026);
        } else if (content === "!보물 선단") {
            message.channel.send("가모스 글로벌 한시간 기준");
            treasure(message, 0.019);
        } else if (content === "!보물 가크투낙") {
            message.channel.send("가모스 글로벌 한시간 기준");
            treasure(message, 0.017);
        } else if (content === "!보물 독선") {
            message.channel.send("가모스 글로벌 한시간 기준");
            treasure(message, 0.017);
        } else if (content === "!보물 눈물") {
            message.channel.send("가모스 글로벌 한시간 기준");
            treasure(message, 0.01);
        } else if (content === "!보물 천안") {
            message.channel.send("가모스 글로벌 한시간 기준");
            message.channel.send("확률정보없음");
        } else {
            message.channel.send("제대로 입력하셈;;");
        }

    } else if (regexArr[9].test(content)) {

        const date = new Date();
        const currentDay = date.getDay();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();

        let closestBoss = null;
        let minDiff = Number.MAX_SAFE_INTEGER;

        for (const day in data.boss) {
            const bosses = data.boss[day];
            for (const bossInfo of bosses) {
                const [bossHour, bossMinute] = bossInfo.time.split(" : ").map(Number);
                if (currentDay === getDay(day) && (currentHour < bossHour || (currentHour === bossHour && currentMinute < bossMinute))) {
                    const diff = (bossHour - currentHour) * 60 + (bossMinute - currentMinute);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestBoss = bossInfo;
                    }
                }
            }
        }

        function getDay(day) {
            const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            return days.indexOf(day);
        }

        message.channel.send(`현재 가장 가까운 보스는 ${closestBoss.time} 시간에 출현 하는 ${closestBoss.bossName}입니다.`);

    } else {

        if (message.author.username === "신익수") {
            message.channel.send("빡통익수 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!! 그만해!!!!!");
        } else {
            message.channel.send("사용법보고 다시 입력해주세요.");
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
        message.channel.send(`${message.author.username}님 이걸 쳐 먹네..`);
    } else {
        if (message.author.username === "신민기") {
            message.channel.send(`민기야 안뜬다고!!!! 돌아가!!!!ㅋㅋㅋ`);
        } else {
            message.channel.send(`${message.author.username}님 뜨겠냐고ㅋㅋ`);
        }
    }
}

// keepAlive();
// 봇과 서버를 연결해주는 부분
client.login(process.env.TOKEN);
