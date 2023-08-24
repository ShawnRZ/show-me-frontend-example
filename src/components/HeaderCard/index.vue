<script setup>

import sysButton from './components/SysButton.vue';
import searchBar from './components/SearchBar.vue';


</script>

<template>
    <div class="header-card">
        <router-view name="title"></router-view>
        <searchBar></searchBar>
        <sysButton></sysButton>
    </div>
</template>

<style lang="scss" scoped>
.header-card {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>