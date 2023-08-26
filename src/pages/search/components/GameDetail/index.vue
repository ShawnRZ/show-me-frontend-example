<script setup>
import { ElNotification } from 'element-plus';
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useMetadataStore } from '@/stores/metadata';
import { getMatchById } from '@/lcu'

import RankTier from './components/RankTier.vue';

const props = defineProps({ 'gameId': Number, 'name': String });

const game = ref(null);
const metadata = useMetadataStore();
const Router = useRouter();

watch(() => props.gameId, async () => {
    console.debug('当前对局id: ', props.gameId);
    try {
        game.value = await getMatchById(props.gameId);
        console.debug('当前对局信息：', game.value);
    } catch (error) {
        ElNotification.info({
            title: '获取对局信息失败',
            message: error,
            position: 'bottom-right'
        })
    }
}, {
    immediate: true
});

const redTeam = computed(() => {
    const t = game.value.participants.filter(p => p.teamId === 100);
    console.debug('redTeam', t);
    return t
});

const blueTeam = computed(() => {
    const t = game.value.participants.filter(p => p.teamId === 200);
    console.debug('blueTeam', t);
    return t;
});

const winTeam = computed(() => {
    for (let i = 0; i < game.value.teams.length; i++) {
        const t = game.value.teams[i];
        if (t.win === 'Win') {
            return t.teamId;
        }
    }
});

const redTeamKills = computed(() => {
    let k = 0;
    for (let i = 0; i < game.value.participants.length; i++) {
        const p = game.value.participants[i];
        if (p.teamId === 100) {
            k += p.stats.kills;
        }
    }
    return k;
});

const blueTeamKills = computed(() => {
    let k = 0;
    for (let i = 0; i < game.value.participants.length; i++) {
        const p = game.value.participants[i];
        if (p.teamId === 200) {
            k += p.stats.kills;
        }
    }
    return k;
});

const search = (name) => {
    if (name.value === '') {
        return;
    }
    Router.push({
        path: '/search',
        query: {
            name: name
        }
    });
}



</script>

<template>
    <div class="game-detail" v-if="game">
        <div class="participants">
            <!-- 红色方 -->
            <div :class="['redSide', winTeam === 100 ? 'win' : 'lose']">
                <div :class="['participant', game.participantIdentities[p.participantId - 1].player.summonerName === props.name ? 'target' : '']"
                    v-for="p in redTeam" v-if="redTeam">
                    <el-avatar :size="40" :src="metadata.getChampionIconPath(p.championId)" />
                    <div class="spells">
                        <el-avatar :size="20" shape="square" :src="metadata.getSpell(p.spell1Id)"></el-avatar>
                        <el-avatar :size="20" shape="square" :src="metadata.getSpell(p.spell2Id)"></el-avatar>
                    </div>
                    <div class="items-runes">
                        <div class="runes">
                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk0,
                                        p.stats.perk0Var1, p.stats.perk0Var2,
                                        p.stats.perk0Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk0)"></el-avatar>
                            </el-tooltip>
                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk1,
                                        p.stats.perk1Var1, p.stats.perk1Var2,
                                        p.stats.perk1Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk1)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk2,
                                        p.stats.perk2Var1, p.stats.perk2Var2,
                                        p.stats.perk2Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk2)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk3,
                                        p.stats.perk3Var1, p.stats.perk3Var2,
                                        p.stats.perk3Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk3)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk4,
                                        p.stats.perk4Var1, p.stats.perk4Var2,
                                        p.stats.perk4Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk4)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk5,
                                        p.stats.perk5Var1, p.stats.perk5Var2,
                                        p.stats.perk5Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk5)"></el-avatar>
                            </el-tooltip>
                        </div>
                        <div class="items">
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item0)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item1)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item2)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item3)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item4)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item5)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item6)"></el-avatar>
                        </div>
                    </div>
                    <div class="summoner">
                        <div class="name "
                            @click="search(game.participantIdentities[p.participantId - 1].player.summonerName)">
                            {{ game.participantIdentities[p.participantId - 1].player.summonerName }}
                        </div>
                        <div class="tier">
                            <RankTier :name="game.participantIdentities[p.participantId - 1].player.summonerName">
                            </RankTier>
                        </div>
                    </div>
                    <div class="k-d-a">
                        <div class="kda">
                            {{ p.stats.kills }}
                            /
                            {{ p.stats.deaths }}
                            /
                            {{ p.stats.assists }}
                            ({{ ((p.stats.kills + p.stats.assists) / redTeamKills * 100).toFixed() }}%)
                        </div>
                        <div class="ratio">
                            <span v-if="p.stats.deaths === 0">Perfect</span>
                            <span v-else>{{ ((p.stats.kills + p.stats.assists) / p.stats.deaths).toFixed(2) }}:1 </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 蓝色方 -->
            <div :class="['blueSide', winTeam === 200 ? 'win' : 'lose']">
                <div :class="['participant', game.participantIdentities[p.participantId - 1].player.summonerName === props.name ? 'target' : '']"
                    v-for="p in blueTeam" v-if="blueTeam">
                    <el-avatar :size="40" :src="metadata.getChampionIconPath(p.championId)" />
                    <div class="spells">
                        <el-avatar :size="20" shape="square" :src="metadata.getSpell(p.spell1Id)"></el-avatar>
                        <el-avatar :size="20" shape="square" :src="metadata.getSpell(p.spell2Id)"></el-avatar>
                    </div>
                    <div class="items-runes">
                        <div class="runes">
                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk0,
                                        p.stats.perk0Var1, p.stats.perk0Var2,
                                        p.stats.perk0Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk0)"></el-avatar>
                            </el-tooltip>
                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk1,
                                        p.stats.perk1Var1, p.stats.perk1Var2,
                                        p.stats.perk1Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk1)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk2,
                                        p.stats.perk2Var1, p.stats.perk2Var2,
                                        p.stats.perk2Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk2)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk3,
                                        p.stats.perk3Var1, p.stats.perk3Var2,
                                        p.stats.perk3Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk3)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk4,
                                        p.stats.perk4Var1, p.stats.perk4Var2,
                                        p.stats.perk4Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk4)"></el-avatar>
                            </el-tooltip>

                            <el-tooltip>
                                <template #content>
                                    <div v-html="metadata.getRuneEndOfGameStatDescs(p.stats.perk5,
                                        p.stats.perk5Var1, p.stats.perk5Var2,
                                        p.stats.perk5Var3)"></div>
                                </template>
                                <el-avatar :size="20" shape="square" :src="metadata.getRune(p.stats.perk5)"></el-avatar>
                            </el-tooltip>

                        </div>
                        <div class="items">
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item0)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item1)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item2)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item3)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item4)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item5)"></el-avatar>
                            <el-avatar :size="20" shape="square" :src="metadata.getItem(p.stats.item6)"></el-avatar>
                        </div>
                    </div>
                    <div class="summoner">
                        <div class="name"
                            @click="search(game.participantIdentities[p.participantId - 1].player.summonerName)">
                            {{ game.participantIdentities[p.participantId - 1].player.summonerName }}
                        </div>
                        <div class="tier">
                            <RankTier :name="game.participantIdentities[p.participantId - 1].player.summonerName">
                            </RankTier>
                        </div>
                    </div>
                    <div class="k-d-a">
                        <div class="kda">
                            {{ p.stats.kills }}
                            /
                            {{ p.stats.deaths }}
                            /
                            {{ p.stats.assists }}
                            ({{ ((p.stats.kills + p.stats.assists) / blueTeamKills * 100).toFixed() }}%)
                        </div>
                        <div class="ratio">
                            <span v-if="p.stats.deaths === 0">Perfect</span>
                            <span v-else>{{ ((p.stats.kills + p.stats.assists) / p.stats.deaths).toFixed(2) }}:1 </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.lose {
    background-color: rgba(232, 64, 87, 0.3);

    .target {
        background-color: rgba(255, 0, 0, 0.1);
    }
}

.win {
    background-color: rgba(83, 131, 232, 0.3);

    .target {
        background-color: rgba(0, 0, 255, 0.1);
    }
}

.game-detail {
    margin-left: 10px;

    .participants {
        .participant {
            display: flex;
            align-items: center;
            padding: 5px;

            .spells {
                display: flex;
                flex-direction: column;
                margin-left: 1px;
            }

            .items-runes {
                .runes {
                    display: flex;

                    .el-avatar {
                        background-color: transparent;
                        margin-left: 1px;
                    }
                }

                .items {
                    display: flex;

                    .el-avatar {
                        margin-left: 1px;
                    }
                }
            }

            .summoner {
                width: 120px;

                .name {
                    overflow-x: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 12px;
                    cursor: pointer;
                    text-align: center;

                    &:hover {
                        overflow-x: visible;
                    }
                }

                .tier {
                    font-size: 12px;
                    color: rgb(113, 113, 113);
                    text-align: center;
                }
            }

            .k-d-a {
                .kda {
                    color: rgb(113, 113, 113);
                    font-size: 1px;
                }

                .ratio {
                    color: rgb(113, 113, 113);
                    font-size: 1px;
                }
            }
        }
    }
}
</style>