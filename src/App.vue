<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { ElNotification } from 'element-plus';

import { useMetadataStore } from '@/stores/metadata.js'

import headerCard from '@/headerCard/index.vue';
import asideCard from '@/asideCard/index.vue';
import mainCard from '@/mainCard/index.vue';


const Metadata = useMetadataStore();

const init = async () => {
  let times = 1;
  let n = ElNotification.info({
    title: '正在初始化...',
    position: 'bottom-right',
    duration: 0,
  });
  while (times <= 3) {
    if (await Metadata.init()) {
      ElNotification.success({
        title: '初始化成功',
        position: 'bottom-right',
        duration: 0,
      })
      n.close();
      break;
    } else {
      ElNotification.success({
        title: `第${times}/3次初始化失败`,
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
      <asideCard data-tauri-drag-region></asideCard>
    </el-aside>
    <el-container>
      <el-header data-tauri-drag-region style="border-bottom: 1px solid rgb(113, 113, 113);">
        <headerCard data-tauri-drag-region></headerCard>
      </el-header>
      <el-main>
        <mainCard></mainCard>
      </el-main>

    </el-container>
  </el-container>
</template>

<style scoped></style>
