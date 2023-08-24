<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const Router = useRouter();
const searchName = ref('');

const search = () => {
    if (searchName.value === '') {
        return;
    }
    Router.push({
        path: '/search',
        query: {
            name: searchName.value
        }
    });
}



</script>

<template>
    <div class="search-bar">
        <el-input clearable prefix-icon="Search" size="large" type="text" v-model="searchName" placeholder="搜索召唤师"
            @keydown.enter="search()"></el-input>
    </div>
</template>

<style lang="scss" scoped>
.search-bar {
    width: 200px;
    margin: auto auto;
}
</style>