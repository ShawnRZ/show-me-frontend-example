import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
    state: () => ({
        metadata: 1,// 0 使用 cd, 1 使用 tc.
    }),
});