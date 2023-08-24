<script setup>

import { appWindow } from '@tauri-apps/api/window';
import { useDark, useToggle } from '@vueuse/core';
import { ref } from 'vue';

let lock = ref(false);
function setAlwayOnTop() {
    lock.value = !lock.value;
    appWindow.setAlwaysOnTop(lock.value);
}

const isDark = useDark();
const toggleDark = useToggle(isDark);


</script>

<template>
    <div class="sys-button">

        <div class="light-icon" @click="toggleDark()">
            <el-icon v-if="isDark">
                <Sunny />
            </el-icon>
            <el-icon v-else>
                <Moon />
            </el-icon>
        </div>

        <div class="lock-icon" @click="setAlwayOnTop()">
            <el-icon v-if="lock">
                <Lock />
            </el-icon>
            <el-icon v-else>
                <Unlock />
            </el-icon>
        </div>

        <div class="minus-icon" @click="appWindow.minimize()">
            <el-icon>
                <Minus />
            </el-icon>
        </div>

        <div class="close-icon" @click="appWindow.close()">
            <el-icon>
                <Close />
            </el-icon>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.sys-button {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;

    .el-icon {
        font-size: 18px;
    }

    .close-icon,
    .light-icon,
    .lock-icon,
    .unlock-icon,
    .minus-icon {
        width: 45px;
        cursor: pointer;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all;
        transition-duration: 0.3s;
    }

    .close-icon:hover {
        background-color: red;
    }

    .minus-icon:hover,
    .light-icon:hover,
    .lock-icon:hover {
        background-color: rgba(113, 113, 113, 0.4);
    }

}
</style>