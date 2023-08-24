<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { ElNotification } from 'element-plus';

import { useMetadataStore } from '@/stores/metadata.js'

import HeaderCard from '@/components/HeaderCard/index.vue';
import AsideCard from '@/components/AsideCard/index.vue';
import MainCard from '@/components/MainCard/index.vue';


const metadata = useMetadataStore();

const init = async () => {
    let times = 1;
    let n = ElNotification.info({
        title: '正在初始化...',
        position: 'bottom-right',
        duration: 0,
    });
    while (times <= 3) {
        try {
            const res = await metadata.init();
            if (res) {
                ElNotification.success({
                    title: '初始化成功',
                    position: 'bottom-right',
                    duration: 0,
                })
                n.close();
                break;
            }
        } catch (error) {
            ElNotification.success({
                title: `第${times}/3次初始化失败`,
                message: error,
                position: 'bottom-right',
                duration: 0,
            })
            times++;
        }
    }
}
init();

</script>

<template>
    <el-container style="height: 100%;">
        <el-aside data-tauri-drag-region width="200px" style="border-right: 1px solid rgb(113, 113, 113);">
            <AsideCard data-tauri-drag-region></AsideCard>
        </el-aside>
        <el-container>
            <el-header data-tauri-drag-region style="border-bottom: 1px solid rgb(113, 113, 113);">
                <HeaderCard data-tauri-drag-region></HeaderCard>
            </el-header>
            <el-main>
                <MainCard></MainCard>
            </el-main>

        </el-container>
    </el-container>
</template>

<style scoped></style>
