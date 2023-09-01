import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '@/pages/home/index.vue';
import HomeTitle from '@/pages/home/title.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            name: 'home',
            path: '/home',
            components: {
                main: Home,
                title: HomeTitle
            }
        },
        {
            name: 'about',
            path: '/about',
            components: {
                main: () => import('@/pages/about/index.vue'),
                title: () => import('@/pages/about/title.vue')
            }
        },
        {
            name: 'search',
            path: '/search',
            components: {
                main: () => import('@/pages/search/index.vue'),
                title: () => import('@/pages/search/title.vue')
            }
        },
        {
            name: 'setting',
            path: '/setting',
            components: {
                main: () => import('@/pages/setting/index.vue'),
                title: () => import('@/pages/setting/title.vue')
            }
        },
        {
            name: 'lolaram',
            path: '/lolaram',
            components: {
                main: () => import('@/pages/lolaram/index.vue'),
                title: () => import('@/pages/lolaram/title.vue')
            }
        }
        ,
        {
            name: 'current',
            path: '/current',
            components: {
                main: () => import('@/pages/current/index.vue'),
                title: () => import('@/pages/current/title.vue')
            }
        }
    ]
});

