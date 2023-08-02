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

    if (message.channel.name !== "검은사막") {
        message.channel.send("야발련아 여기서 나 부르지 말라고;;");
        return;
    }

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
            \n !강화확률 n% or !강화확률 n 
            \n 강화 여러번 밑에 따라 똑같이 안치면 위에꺼 한번만 실행함 !!
            \n !강화확률 n% n번
            \n =========================================
            \n 공구간 
            \n !공구간 240 
            \n =========================================
            \n 방구간 
            \n !방구간 240
            \n =========================================
            \n 보물 (영성, 선단, 가크투낙, 독선,눈물, 천안)
            \n !보물 영성
            \n 보물 정가 재료 잡템 1개당 먹는 갯수
            \n !보물 재료 영성 3000개
            \n =========================================
            \n 보스 시간표
            \n !보스 시간표
            \n 곧 나오는 보스  
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
        const regex = /^![가-힣]+\s+(\d+(\.\d+)?%)\s+(\d+)번$/;

        if (num * 0.01 > 1) {
            message.channel.send("아잇 싯팔 꼴받게 하지말라고");
            return;
        } else if (/-\w+/g.test(content)) {
            message.channel.send("마이너스 넣지말라고");
            return;
        }

        if (regex.test(content)) {

            const exec = regex.exec(content);

            several(parseFloat(exec[3]), message, parseFloat(exec[1]) * 0.01, "강화");

        } else {

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
        const treasureRegex = [/.*영성.*/, /.*선단.*/, /.*가크투낙.*/, /.*독선.*/, /.*눈물.*/, /.*천안.*/];

        if (/.*재료.*/.test(content)) {
            if (num === null || num === undefined || num - 1 < 0) {
                message.channel.send("야발련아 똑바로 입력해!!!!");
            } else {
                if (treasureRegex[0].test(content)) {
                    treasureMaterial(num, message, 0.00020228582987761708);
                } else if (treasureRegex[1].test(content)) {
                    treasureMaterial(num, message, 0.000156335495974361);
                } else if (treasureRegex[2].test(content)) {
                    treasureMaterial(num, message, 0.00029439472444653793);
                } else if (treasureRegex[3].test(content)) {
                    treasureMaterial(num, message, 0.0002646252717134486);
                } else if (treasureRegex[4].test(content)) {
                    treasureMaterial(num, message, 0.0002581926514399206);
                } else if (treasureRegex[5].test(content)) {
                    message.channel.send("확률정보없음");
                }
            }
            return;
        }

        if (num === null || num === undefined || num - 1 < 0) {
            if (treasureRegex[0].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                treasure(message, 0.026);
            } else if (treasureRegex[1].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                treasure(message, 0.019);
            } else if (treasureRegex[2].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                treasure(message, 0.017);
            } else if (treasureRegex[3].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                treasure(message, 0.017);
            } else if (treasureRegex[4].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                treasure(message, 0.01);
            } else if (treasureRegex[5].test(content)) {
                message.channel.send("가모스 글로벌 한시간 기준");
                message.channel.send("확률정보없음");
            } else {
                message.channel.send("제대로 입력하셈;;");
            }
            return;
        } else {
            if (treasureRegex[0].test(content)) {
                several(num, message, 0.026, "보물");
            } else if (treasureRegex[1].test(content)) {
                several(num, message, 0.019, "보물");
            } else if (treasureRegex[2].test(content)) {
                several(num, message, 0.017, "보물");
            } else if (treasureRegex[3].test(content)) {
                several(num, message, 0.017, "보물");
            } else if (treasureRegex[4].test(content)) {
                several(num, message, 0.01, "보물");
            } else if (treasureRegex[5].test(content)) {
                message.channel.send("확률정보없음");
            } else {
                message.channel.send("제대로 입력하셈;;");
            }
            return;
        }

    } else if (regexArr[9].test(content)) {

        const kstTime = getKST();
        const currentDay = kstTime.getDay();
        const currentHour = kstTime.getHours();
        const currentMinute = kstTime.getMinutes();

        let minDiff = Number.MAX_SAFE_INTEGER;

        if (content === "!보스") {
            for (const day in data.boss) {
                const bosses = data.boss[day];
                for (const bossInfo of bosses) {
                    const [bossHour, bossMinute] = bossInfo.time.split(" : ").map(Number);
                    if (currentDay === getDay(day) && (currentHour < bossHour || (currentHour === bossHour && currentMinute < bossMinute))) {
                        const diff = (bossHour - currentHour) * 60 + (bossMinute - currentMinute);
                        if (diff < minDiff) {
                            minDiff = diff;
                            message.channel.send(`현재 가장 가까운 보스는 ${bossInfo.time} 시간에 출현 하는 ${bossInfo.bossName}입니다.`);
                        }
                    }
                }
            }
        } else if (content === "!보스 시간표") {
            message.channel.send(`오늘 보스 시간표입니다.`);
            for (const day in data.boss) {
                const bosses = data.boss[day];
                if (currentDay === getDay(day)) {
                    for (const bossInfo of bosses) {
                        message.channel.send(`
                            \n ${bossInfo.time}에 ${bossInfo.bossName}
                        `);
                    }
                }
            }
        }

    } else {
        message.channel.send("사용법보고 다시 입력해주세요.");
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
        message.channel.send(`${message.author.username}님 축하드립니다 드셨군요..`);
    } else {
        message.channel.send(`${message.author.username}님 안타깝게도 못 드셨습니다.`);
    }

}

// 보물 재료
function treasureMaterial(n, message, percent) {

    let sum = 0;

    for (let i = 0; i < n; i++) {
        if (Math.random() <= percent) {
            sum++;
        }
    }

    message.channel.send(`잡템 ${n}개 먹을때 동안 보물 재료 ${sum}개 드셨습니다.`);

}

//n 번 돌려서 성공 실패 확인
function several(n, message, percent, name) {

    let sum = name === "강화" ? 1 : 0;

    while (Math.random() >= percent) {
        sum++;
        if (sum >= n) {
            name === "강화"
                ? message.channel.send(`실패!!`)
                : message.channel.send(`드랍 실패!!`)
            return;
        }
    }

    if (name === "보물") {
        message.channel.send(`${sum}번째만에 드셨네요;;`);
    } else if (name === "강화") {
        message.channel.send(`${sum}번째만 성공하셨네요;;`);
    } else {
        message.channel.send("사용법을 다시 확인해주세요");
    }

}

// 요일 구하기
function getDay(day) {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days.indexOf(day);
}

// 한국 표준시 구하기
function getKST() {
    const currentTime = new Date();
    const timezoneOffset = currentTime.getTimezoneOffset() / 60;
    const kstTimezoneOffset = 9;
    const kstOffset = kstTimezoneOffset + timezoneOffset;
    currentTime.setHours(currentTime.getHours() + kstOffset);
    return currentTime;
}

keepAlive();
// 봇과 서버를 연결해주는 부분
client.login(process.env.TOKEN);
