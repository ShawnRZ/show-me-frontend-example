<script setup>

import Avatar from './components/Avatar.vue';

</script>

<template>
    <div class="aside-card">
        <div class="logo">
            ShowMe
        </div>

        <router-link to="/">主页</router-link>
        <router-link to="/setting">设置</router-link>
        <router-link to="/about">关于</router-link>

        <div class="space"></div>

        <Avatar />
    </div>
</template>


<style lang="scss" scoped>
.aside-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;

    .logo {
        user-select: none;
    }

    .space {
        flex-grow: 1;
    }

    .logo {
        font-size: 2.5rem;
        font-weight: 600;
        line-height: 60px;
        text-align: center;
    }
}
</style>
