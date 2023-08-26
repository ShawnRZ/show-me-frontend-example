<script setup>

import { useRoute } from 'vue-router';
import { getSummonerByName, getRankedStats, getMatchHistoryByPuuid, launchSpectate } from '@/lcu';
import { ref, watch } from 'vue';
import { ElNotification } from 'element-plus';
import { useMetadataStore } from '@/stores/metadata';
import { switchRankedTier } from '@/tool';

import GameDetail from './components/GameDetail/index.vue';

const Route = useRoute();
const metadata = useMetadataStore();

const summoner = ref(null);
const rankedStats = ref(null);
const matchHistory = ref(null);
const currentPage = ref(1);
const gameId = ref(0);

const isGameDetailShow = ref(false);

const showGameDetail = (id) => {
    /**
     * 关闭对局详情
     */
    if (gameId.value === id && isGameDetailShow.value === true) {
        isGameDetailShow.value = false;
        gameId.value = 0;
        return;
    }
    /**
     * 切换对局
     */
    if (isGameDetailShow.value === true && gameId.value !== id) {
        gameId.value = id;
    }
    /**
     * 打开对局详情
     */
    if (isGameDetailShow.value === false) {
        gameId.value = id;
        isGameDetailShow.value = true;
    }
}

// 替换翻页数据
watch(currentPage, async (page, oldPage) => {
    console.debug(currentPage.value);
    if (!summoner.value) {
        return;
    }
    try {
        const m = await getMatchHistoryByPuuid(summoner.value.puuid, (currentPage.value - 1) * 6, (currentPage.value - 1) * 6 + 5);
        console.debug(m);
        matchHistory.value = m.games.games;
    } catch (error) {
        currentPage.value = oldPage;
        ElNotification.info({
            title: '无法查询战绩信息',
            message: error,
            position: 'bottom-right'
        });
        return;
    }
});

const loadData = async () => {
    try {
        const s = await getSummonerByName(Route.query.name);
        console.debug(s);
        summoner.value = s;
    } catch (error) {
        ElNotification.info({
            title: '查询失败',
            message: error,
            position: 'bottom-right'
        });
        return;
    }

    try {
        const r = await getRankedStats(summoner.value.puuid);
        console.debug(r);
        rankedStats.value = r;
    } catch (error) {
        ElNotification.info({
            title: '无法查询段位信息',
            message: error,
            position: 'bottom-right'
        });
        return;
    }

    if (currentPage.value === 1) {
        try {
            const m = await getMatchHistoryByPuuid(summoner.value.puuid, 0, 5);
            console.debug(m);
            matchHistory.value = m.games.games;
        } catch (error) {
            ElNotification.info({
                title: '无法查询战绩信息',
                message: error,
                position: 'bottom-right'
            });
            return;
        }
    } else {
        currentPage.value = 1;
    }
}

watch(() => Route.query.name, async () => {
    console.log(Route.query.name);
    // 收起对局详情
    isGameDetailShow.value = false;
    // 重置页面数据
    summoner.value = null;
    rankedStats.value = null;
    matchHistory.value = null;
    currentPage.value = 1;
    gameId.value = 0;


    if (!Route.query.name) {
        return;
    }
    await loadData();

}, {
    immediate: true
});

const copyMyName = () => {
    navigator.clipboard.writeText(summoner.value.displayName).then(() => {
        ElNotification.success({
            title: '提示',
            message: '复制成功',
            position: 'bottom-right'
        })
    }).catch(() => {
        ElNotification.error({
            title: '提示',
            message: '复制失败',
            position: 'bottom-right'
        })
    });
}

const switchGameMode = (queueId) => {
    switch (queueId) {
        case 430:
            return '匹配模式';
        case 420:
            return '单/双 排';
        case 440:
            return '灵活排位';
        case 450:
            return '极地大乱斗';
        case 700:
            return '冠军杯赛';
        case 840:
            return '新手人机';
        case 830:
            return '入门人机';
        case 850:
            return '一般人机';
        case 2000:
            return '新手教程 第一部分';
        case 2010:
            return '新手教程 第二部分';
        case 2020:
            return '新手教程 第三部分';
        case 1700:
            return '斗魂竞技场';

        default:
            return '未知模式';
    }
}

const stampToDate = (stamp) => {
    const d = new Date(stamp);
    return d.toLocaleDateString();
}

const spectate = async (puuid) => {
    try {
        await launchSpectate(puuid);
        ElNotification.success({
            title: '观战拉起成功',
            position: 'bottom-right',
        });
    } catch (error) {
        ElNotification.info({
            title: '观战拉起失败',
            message: '请确认当前玩家正在游戏中:' + error,
            position: 'bottom-right',
        });
    }
}

</script>

<template>
    <div style="display: flex;">
        <div class="summoner-info">
            <el-card class="profile" body-style="display:flex;" shadow="hover" v-if="summoner">
                <div class="avatar">
                    <el-avatar shape="square" :size="100" :src="metadata.getProfileIconPath(summoner.profileIconId)" />
                    <div class="level"><span>{{ summoner.summonerLevel }}</span></div>
                </div>
                <div v-show="!isGameDetailShow">
                    <h1 class="summoner-name">
                        {{ summoner.displayName }}
                        <br>
                        <el-icon class="copy" @click="copyMyName()" size="large">
                            <CopyDocument />
                        </el-icon>
                        <span>&nbsp;</span>
                        <el-tooltip>
                            <template #content>观战</template>
                            <el-icon class="spectate" @click="spectate(summoner.puuid)" size="large">
                                <VideoCamera />
                            </el-icon>
                        </el-tooltip>
                        <span>&nbsp;</span>
                        <el-icon class="refresh" size="large" @click="loadData()">
                            <Refresh />
                        </el-icon>
                    </h1>
                    <span class="privacy">{{ summoner.privacy === "PRIVATE" ? '隐藏生涯' : '公开生涯' }}</span>
                </div>
            </el-card>

            <!-- 单排卡片 -->
            <el-card class="solo-rank" shadow="hover" body-style="display: flex;" v-if="rankedStats">
                <template #header>
                    <span>单/双排</span>
                </template>
                <img :src="`${rankedStats.queueMap['RANKED_SOLO_5x5'].tier.toLowerCase()}.png`"
                    onerror="this.src='unranked.png'" alt="">
                <div class="rank-tier" v-show="!isGameDetailShow">
                    {{ switchRankedTier(rankedStats.queueMap['RANKED_SOLO_5x5'].tier) }} {{
                        rankedStats.queueMap['RANKED_SOLO_5x5'].division }}
                    <br>
                    {{ rankedStats.queueMap['RANKED_SOLO_5x5'].leaguePoints }} LP
                </div>
            </el-card>

            <!-- 灵活卡片 -->
            <el-card class="flex-rank" shadow="hover" body-style="display: flex;" v-if="rankedStats">
                <template #header>
                    <span>灵活排位</span>
                </template>
                <img :src="`${rankedStats.queueMap['RANKED_FLEX_SR'].tier.toLowerCase()}.png`" alt=""
                    onerror="this.src='unranked.png'">
                <div class="rank-tier" v-show="!isGameDetailShow">
                    {{ switchRankedTier(rankedStats.queueMap['RANKED_FLEX_SR'].tier) }} {{
                        rankedStats.queueMap['RANKED_FLEX_SR'].division }}
                    <br>
                    {{ rankedStats.queueMap['RANKED_FLEX_SR'].leaguePoints }} LP
                </div>
            </el-card>
        </div>
        <div class="match-history" v-if="matchHistory">
            <div :class="['game', game.participants[0].stats.win ? 'win' : 'lose']" v-for="game in matchHistory"
                :key="game.gameId">
                <div class="info">
                    <div :class="['game-mode', game.participants[0].stats.win ? 'win-color' : 'lose-color']">
                        {{ switchGameMode(game.queueId) }}
                    </div>
                    <div class="time-stamp">
                        {{ stampToDate(game.gameCreation) }}
                    </div>

                    <div
                        style="width: 48px;height: 1px; background-color: rgba(113, 113, 113,0.8);margin-top: 5px;margin-bottom: 5px;">
                    </div>

                    <div class="result">
                        {{ game.participants[0].stats.win ? '胜利' : '失败' }}
                    </div>
                    <div class="duration">
                        {{ (game.gameDuration / 60).toFixed() }}分{{ game.gameDuration % 60 }}秒
                    </div>
                </div>
                <div class="detail">
                    <div class="champion">
                        <el-avatar class="champion-icon"
                            :src="metadata.getChampionIconPath(game.participants[0].championId)" />
                        <div class="spells">
                            <el-avatar shape="square" :size="20" :src="metadata.getSpell(game.participants[0].spell1Id)" />
                            <el-avatar shape="square" :size="20" :src="metadata.getSpell(game.participants[0].spell2Id)" />
                        </div>
                        <div class="runes">
                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(game.participants[0].stats.perk0,
                                        game.participants[0].stats.perk0Var1, game.participants[0].stats.perk0Var2,
                                        game.participants[0].stats.perk0Var3)"></div>
                                </template>
                                <el-avatar :size="20" :src="metadata.getRune(game.participants[0].stats.perk0)" />
                            </el-tooltip>
                            <el-avatar :size="20" :src="metadata.getRune(game.participants[0].stats.perkSubStyle)" />
                        </div>
                        <div class="kda">
                            <div class="k-d-a">
                                <span class="k">{{ game.participants[0].stats.kills }}</span>
                                <span class="g">&nbsp;/&nbsp;</span>
                                <span class="d">{{ game.participants[0].stats.deaths }}</span>
                                <span class="g">&nbsp;/&nbsp;</span>
                                <span class="a">{{ game.participants[0].stats.assists }}</span>

                            </div>
                            <div class="ratio">
                                {{ ((game.participants[0].stats.kills + game.participants[0].stats.assists) /
                                    game.participants[0].stats.deaths).toFixed(2) }}:1
                                KDA
                            </div>
                        </div>
                    </div>
                    <div class="items">
                        <img :src="metadata.getItem(game.participants[0].stats.item0)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item1)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item2)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item3)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item4)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item5)" alt="">
                        <img :src="metadata.getItem(game.participants[0].stats.item6)" alt="">
                    </div>
                </div>
                <div class="stats">
                    <el-tooltip content="分均补刀(Minions Per Minute)">
                        {{ (game.participants[0].stats.totalMinionsKilled / (game.gameDuration / 60)).toFixed(2) }} MPM
                    </el-tooltip>
                    <br>
                    <el-tooltip content="分均经济(Gold Per Minute)">
                        {{ (game.participants[0].stats.goldEarned / (game.gameDuration / 60)).toFixed() }} GPM
                    </el-tooltip>
                    <br>
                    <el-tooltip content="分均伤害(Damage Per Minute)">
                        {{ (game.participants[0].stats.totalDamageDealtToChampions / (game.gameDuration / 60)).toFixed() }}
                        DPM
                    </el-tooltip>
                </div>
                <div :class="{ 'action': true, 'activated': game.gameId === gameId && isGameDetailShow }"
                    @click="showGameDetail(game.gameId)">
                    <el-icon>
                        <View />
                    </el-icon>
                </div>
            </div>
            <el-pagination small background :page-size="6" layout="prev, pager, next" :total="100"
                v-model:current-page="currentPage" />
        </div>
        <GameDetail v-if="isGameDetailShow" :game-id="gameId" :name="summoner.displayName"></GameDetail>
    </div>
</template>

<style lang="scss" scoped>
.el-card {
    // width: 130px;
    margin-bottom: 10px;
    overflow-x: hidden;

    img {
        width: 100px;
    }
}

.summoner-info {

    .profile {

        .avatar {
            width: 100px;

            .el-avatar {
                border-radius: 20px;
            }

            .level {
                margin-top: -13px;
                text-align: center;

                span {
                    background-color: rgb(113, 113, 113);
                    border-radius: 10px;
                    padding: 0 6px;
                    margin: 0px auto;
                    display: inline-block;
                }
            }
        }

        .summoner-name {
            margin-left: 10px;
            font-size: 24px;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
                overflow: visible;
            }

            .copy,
            .spectate,
            .refresh {
                cursor: pointer;
            }
        }

        .privacy {
            margin-left: 10px;
            font-size: 12px;
            color: #999;
        }
    }
}

.lose {
    border-left-color: rgb(232, 64, 87);
    background-color: rgba(232, 64, 87, 0.3);

    .action {
        color: rgb(232, 64, 87);
        background-color: rgb(232, 64, 87, 0.4);
        height: 100%;
        flex-grow: 1;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
}

.win {
    border-left-color: rgb(83, 131, 232);
    background-color: rgba(83, 131, 232, 0.3);

    .action {
        color: rgb(83, 131, 232);
        background-color: rgb(83, 131, 232, 0.4);
        height: 100%;
        flex-grow: 1;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
}

.win-color {
    color: rgb(83, 131, 232);
}

.lose-color {
    color: rgb(232, 64, 87);
}

.match-history {
    margin-left: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .game {
        width: 400px;
        height: 90px;
        margin-bottom: 5px;
        border-radius: 4px;
        border-left-width: 6px;
        border-left-style: solid;
        display: flex;
        align-items: center;

        .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;
            width: 80px;

            .game-mode {
                font-size: 12px;
                font-weight: 700;
            }

            .time-stamp,
            .duration {
                color: rgb(113, 113, 113, 0.8);
                font-size: 12px;
            }

            .result {
                color: rgb(113, 113, 113, 0.8);
                font-size: 12px;
                font-weight: 700;
            }
        }

        .detail {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .champion {
                display: flex;

                .champion-icon {
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                }

                .spells {
                    display: flex;
                    flex-direction: column;
                    margin-left: 2px;
                }

                .kda {
                    margin-left: 10px;

                    .k-d-a {
                        display: flex;
                        align-items: center;
                        font-size: 15px;
                        font-weight: 700;
                        width: 100px;

                        .k,
                        .a,
                        .d {
                            font-size: 15px;
                            font-weight: 700;
                            line-height: 22px;
                        }

                        .g {
                            color: rgb(113, 113, 113);
                        }

                        .d {
                            color: red;
                        }
                    }

                    .ratio {
                        color: rgb(113, 113, 113, 0.8);
                        font-size: 12px;
                    }
                }

                .runes {
                    display: flex;
                    flex-direction: column;
                    margin-left: 1px;

                    .el-avatar {
                        background-color: transparent;
                    }
                }
            }

            .items {
                height: 20px;
                margin-top: 10px;

                img {
                    width: 20px;
                    height: 20px;
                    margin-right: 1px;
                    border-radius: 4px;
                    background-image: url('https://show-me-static.zexuan.ren/item/7050.png');
                }
            }
        }

        .stats {
            border-left: 1px solid rgb(113, 113, 113, 0.3);
            padding-left: 10px;
            width: 70px;
            color: rgb(113, 113, 113, 0.8);
            font-size: 12px;

        }

        .action {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: rgba(0, 0, 0, 0);
            }
        }

        .activated {
            background-color: rgb(232, 64, 87, 0);
        }
    }


}
</style>