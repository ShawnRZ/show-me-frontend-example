import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '@/mainCard/components/home/index.vue';
import About from '@/mainCard/components/about/index.vue';
import Search from '@/mainCard/components/search/index.vue';
import Setting from '@/mainCard/components/setting/index.vue';

import homeTitle from '@/headerCard/components/title/homeTitle.vue';
import searchTitle from '@/headerCard/components/title/searchTitle.vue';
import aboutTitle from '@/headerCard/components/title/aboutTitle.vue';
import settingTitle from '@/headerCard/components/title/settingTitle.vue';

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
                title: homeTitle
            }
        },
        {
            name: 'about',
            path: '/about',
            components: {
                main: About,
                title: aboutTitle
            }
        },
        {
            name: 'search',
            path: '/search',
            components: {
                main: Search,
                title: searchTitle
            }
        },
        {
            name: 'setting',
            path: '/setting',
            components: {
                main: Setting,
                title: settingTitle
            }
        }
    ]
});

