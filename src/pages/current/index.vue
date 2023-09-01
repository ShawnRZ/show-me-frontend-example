<script setup>
import { listen } from '@tauri-apps/api/event';
import { onUnmounted, ref } from 'vue';

import { getChampSelectSession, getGameflowSession } from '@/lcu';
import { ElNotification } from 'element-plus';

import Player from './components/Player.vue';

// 玩家列表
const myTeam = ref([]);
const theirTeam = ref([]);

/**
 * 刷新页面数据。
 */
const refresh = async () => {
    try {
        const res = await getChampSelectSession();
        const pList = JSON.parse(res);
        myTeam.value = pList.myTeam;
        theirTeam.value = pList.theirTeam;
    } catch (error) {
        ElNotification.info({
            title: '当前没有进行中的对局',
            message: error,
            position: 'bottom-right'
        });
        return;
    }
};

/**
 * 监听 ChampSelect 事件，在合适的时机刷新页面数据。
 */
let cs;
let st;
listen('ChampSelect', async (d) => {
    clearTimeout(st);
    st = setTimeout(async () => {
        await refresh();
    }, 500);
}).then((res) => {
    cs = res;
});

/**
 * 监听 Gameflow 事件
 */
listen('Gameflow', async (e) => {
    if (e.payload !== 'InProgress') {
        return;
    }
    try {
        let ses = JSON.parse(await getGameflowSession())
        console.log(ses);
    } catch (error) {
        ElNotification.info({
            title: '获取对局信息失败',
            message: error,
            position: 'bottom-right',
        });
    }
})

/**
 * 销毁组件时取消事件监听器。
 */
onUnmounted(() => {
    cs();
    console.log("cs已销毁");
})





refresh();
</script>

<template>
    <div class="my-team" v-if="myTeam">
        <Player v-for="p in myTeam" :p="p" :key="p.cellId"></Player>
    </div>
    <div class="their-team" v-if="theirTeam">
        <Player v-for="p in theirTeam" :p="p" :key="p.cellId"></Player>
    </div>
</template>

<style lang="scss" scoped>
.my-team,
.their-team {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.their-team {
    margin-top: 10px;
}
</style>