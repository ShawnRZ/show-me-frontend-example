<script setup>
import { getSummonerById, getRankedStats, getMatchHistoryByPuuid } from '@/lcu';
import { ElNotification } from 'element-plus';
import { computed, ref } from 'vue';
import { useMetadataStore } from '@/stores/metadata';
import { switchRankedTier } from '@/tool';
import { computedAsync } from '@vueuse/core';

const metadata = useMetadataStore();

const props = defineProps({ 'p': Object });

const summoner = computedAsync(
    async () => {
        console.log(props.p);
        if (props.p.summonerId === 0) {
            return null;
        }
        try {
            let s = await getSummonerById(props.p.summonerId);
            console.log(s);
            return s;
        } catch (error) {
            ElNotification.info({
                title: '召唤师查询失败',
                message: `${props.p.summonerId},${error}`,
                position: 'bottom-right'
            });
        }
        return null;
    },
    null,
    {
        lazy: true
    }
);
const rankedTier = computedAsync(
    async () => {
        if (summoner.value === null) {
            return '';
        }
        try {
            const r = await getRankedStats(summoner.value.puuid);
            let tier = switchRankedTier(r.queueMap['RANKED_SOLO_5x5'].tier);
            tier += '/'
            tier += switchRankedTier(r.queueMap['RANKED_FLEX_SR'].tier);
            return tier;
        } catch (error) {
            ElNotification.info({
                title: '查询段位失败',
                message: `${summoner.displayName},${error}`,
                position: 'bottom-right',
            });
        }
        return '';
    },
    null,
    {
        lazy: true,
    }
)
const matchHistory = computedAsync(
    async () => {
        let mh;
        let gameCount = 0;
        let win = 0;
        let lose = 0;
        let kills = 0;
        let deaths = 0;
        let assists = 0;
        for (let i = 0; i < 3; i++) {
            let res;
            try {
                res = await getMatchHistoryByPuuid(summoner.value.puuid, 20 * i, 20 * i + 19);
            } catch (error) {
                ElNotification.info({
                    title: '战绩查询失败',
                    message: `${summoner.value.displayName},${error}`,
                    position: 'bottom-right',
                });
                return '';
            }
            for (let j = 0; j < res.games.games.length; j++) {
                const g = res.games.games[j];
                if (g.queueId !== 420 && g.queueId !== 440) {
                    continue;
                }
                if (g.participants[0].stats.win == true) {
                    win++;
                } else {
                    lose++;
                }
                gameCount++;
                kills += g.participants[0].stats.kills;
                deaths += g.participants[0].stats.deaths;
                assists += g.participants[0].stats.assists;
                if (gameCount >= 20) {
                    break;
                }
            }
            if (gameCount >= 20) {
                break;
            }
            if (res.games.gameCount < 20) {
                console.log('可查询对局数不足');
                break;
            }

        }
        return `对局胜率:${win}/${gameCount}<br/>${kills}/${deaths}/${assists}`;
    },
    null,
    {
        lazy: true,
    }
)

console.log('Player', props.p);
</script>

<template>
    <el-card shadow="hover" class="player">
        <div class="champion">
            <el-avatar :src="metadata.getChampionIconPath(props.p.championId)"></el-avatar>
        </div>
        <div v-if="summoner !== null" class="summoner-name">
            {{ summoner.displayName }}
        </div>
        <div v-if="summoner !== null" class="ranked-tier">
            {{ rankedTier }}
        </div>
        <div v-if="summoner !== null" class="level">
            召唤师等级：{{ summoner.summonerLevel }}
        </div>
        <div v-if="summoner !== null" class="asd" v-html="matchHistory">
        </div>
        <!-- <div>
            championId:{{ props.p.championId }}
        </div>
        <div>
            assignedPosition: {{ props.p.assignedPosition }}
        </div>
        <div>
            cellId:{{ props.p.cellId }}
        </div>
        <div>
            championPickIntent: {{ props.p.championPickIntent }}
        </div>
        <div>
            playerType:{{ props.p.playerType }}
        </div>
        <div>
            selectedSkinId:{{ props.p.selectedSkinId }}
        </div>
        <div>
            spell1Id:{{ props.p.spell1Id }}
        </div>
        <div>
            spell2Id:{{ props.p.spell2Id }}
        </div>
        <div>
            summonerId:{{ props.p.summonerId }}
        </div>
        <div>
            wardSkinId:{{ props.p.wardSkinId }}
        </div> -->
    </el-card>
</template>


<style lang="scss">
.player {
    width: 200px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .champion,
    .summoner-name,
    .ranked-tier,
    .level,
    .asd {
        display: flex;
        flex-direction: column;
        align-items: center;

    }
}
</style>