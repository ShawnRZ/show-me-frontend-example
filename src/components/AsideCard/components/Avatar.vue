<script setup>
import { computed, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { listen } from "@tauri-apps/api/event";
import { useRouter } from 'vue-router';

import { refreshParameter, getCurrentSummoner, connect } from '@/lcu';
import { useMetadataStore } from '@/stores/metadata';

const Router = useRouter();
const metadataStore = useMetadataStore();
const getProfileIcon = metadataStore.getProfileIconPath;

// 召唤师
const summoner = ref(null);

// 召唤师名
const name = computed(() => {
    if (!summoner.value) {
        return '点击连接客户端';
    }
    return summoner.value.displayName;
});

// 召唤师头像URL
const profileIcon = computed(() => {
    if (!summoner.value) {
        return getProfileIcon(29);
    }
    return getProfileIcon(summoner.value.profileIconId);
});
// 是否离线
const offline = ref(true);

/**
 * 复制自己的ID到粘贴板
 */
const copyMyName = () => {
    if (!summoner.value) {
        ElNotification.info({
            title: '尚未连接客户端',
            position: 'bottom-right',
        })
        return;
    }
    navigator.clipboard.writeText(name.value).then(() => {
        ElNotification.success({
            title: '提示',
            message: '复制成功',
            position: 'bottom-right'
        });
    }).catch(() => {
        ElNotification.error({
            title: '提示',
            message: '复制失败',
            position: 'bottom-right'
        });
    });
}

/**
 * 重新连接客户端
 */
async function reConnectToClient() {
    /**
     * 刷新客户端参数
     */
    try {
        await refreshParameter();
    } catch (err) {
        ElNotification.error({
            title: "刷新参数失败",
            message: err,
            position: "bottom-right"
        });
        return;
    }
    /**
     * 重新获取当前召唤师信息
     */
    try {
        // 更新当前召唤师信息
        summoner.value = await getCurrentSummoner();
        // 重置当前路径
        Router.push({
            path: '/search',
            query: {
                name: name.value,
            }
        });
    } catch (err) {
        ElNotification.error({
            title: "获取当前玩家信息失败",
            message: err,
            position: "bottom-right"
        });
        return;
    }
    /**
     * 判断连接是否断开
     */
    if (!offline.value) {
        ElNotification.success({
            title: '刷新成功',
            position: 'bottom-right'
        });
        return;
    }
    /**
     * 连接客户端
     */
    try {
        await connect();
    } catch (error) {
        ElNotification.info({
            title: "连接失败",
            message: error,
            position: "bottom-right"
        });
        return;
    }
    /**
     * 处理断开连接事件
     */
    const cc = await listen("ConnectionClosed", () => {
        offline.value = true;
        ElNotification.info({
            title: "断开连接",
            message: "连接已断开，请重新连接",
            position: "bottom-right"
        });
        summoner.value = null;
        cc();
    });
    /**
     * 连接成功
     */
    ElNotification.success({
        title: "连接成功",
        message: "已连接至客户端",
        position: "bottom-right"
    });
    offline.value = false;
}

</script>

<template>
    <div class="avatar">
        <el-avatar :size="50" :src="profileIcon" @click="reConnectToClient()" />
        <div :class="['status', offline ? 'offline' : '']"></div>
        <div class="name">
            <el-tooltip :content="name">
                <el-text truncated size="large">{{ name }}</el-text>
            </el-tooltip>
            <br>
            <el-icon class="copy" @click="copyMyName()">
                <CopyDocument />
            </el-icon>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.avatar {
    width: 100%;
    height: 50px;
    display: flex;
    margin: 10px 0px;
    padding: 0px 10px;
    position: relative;
    flex-direction: row;
    box-sizing: border-box;

    .status {
        position: absolute;
        left: 48px;
        bottom: 0px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: green;
        border: 1px solid rgb(54, 217, 135);
        box-sizing: border-box;
    }

    .offline {
        background-color: rgb(64, 10, 18);
        border: 1px solid rgb(190, 30, 55);
    }

    .el-avatar {
        &:hover {
            cursor: pointer;
        }
    }


    .name {
        margin-left: 10px;
        width: 115px;
        user-select: none;

        .copy {
            cursor: pointer;
        }
    }
}
</style>