<script setup>
import { ElNotification } from 'element-plus';
import { testAndSetCer } from '@/lcu';

const installCer = async () => {
    try {
        let res = await testAndSetCer();
        if (res) {
            ElNotification.success({
                title: '安装成功',
                message: '证书安装成功',
                position: 'bottom-right'
            });
        } else {
            ElNotification.info({
                title: '证书已经安装',
                message: '检测到证书已经安装了，所以什么都没有做。',
                position: 'bottom-right'
            })
        }
    } catch (error) {
        ElNotification.error({
            title: '安装失败',
            message: error,
            position: 'bottom-right'
        });
    }
}
</script>

<template>
    <el-button @click="installCer()">安装CER证书</el-button>
</template>

<style lang="scss" scoped></style>