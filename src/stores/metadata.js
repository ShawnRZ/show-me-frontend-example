import { defineStore } from 'pinia';
import { fetch } from '@tauri-apps/api/http';
import { useConfigStore } from './config';



export const useMetadataStore = defineStore('metadata', {
    state: () => ({
        cd: {
            runes: new Map,
            runestyles: new Map,
            items: new Map,
            spells: new Map,
            queues: new Map,
        },
        tc: {
            heros: new Map,
            items: new Map,
            runes: new Map,
            spells: new Map,
        },
    }),
    getters: {
        getRune() {
            const config = useConfigStore();
            switch (config.metadata) {
                case 0:
                    return (id) => {
                        return '';
                    };
                case 1:
                    return (id) => {
                        if (id === 0) {
                            return '';
                        }
                        return this.tc.runes.get(`${id}`).icon;
                    };
                default:
                    return '';
            }
        },
        getItem() {
            const config = useConfigStore();
            switch (config.metadata) {
                case 0:

                    return;
                case 1:
                    return (id) => {
                        if (id === 0) {
                            id = 7050;
                        }
                        return `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
                    };
                default:
                    return;
            }
        },
        getSpell() {
            const config = useConfigStore();
            switch (config.metadata) {
                case 0:
                    return;
                case 1:
                    return (id) => {
                        if (id === 0) {
                            return '';
                        }
                        return this.tc.spells.get(`${id}`).icon;
                    };

                default:
                    return;
            }
        },
        getQueueName() {
            return (id) => {
                return this.cd.queues.get(`${id}`).name;
            };
        },
        getRuneEndOfGameStatDescs() {
            return (id, var1, var2, var3) => {
                if (id === 0) {
                    return '未知符文';
                }
                const endOfGameStatDescs = this.cd.runes.get(id).endOfGameStatDescs;
                let baseText = '';
                for (let i = 0; i < endOfGameStatDescs.length; i++) {
                    if (i !== 0) {
                        baseText += '<br/>';
                    }
                    const e = endOfGameStatDescs[i];
                    baseText += e;
                }
                const text = baseText.replace('@eogvar1@', var1).replace('@eogvar2@', var2).replace('@eogvar3@', var3);
                return text;
            }
        },
        getProfileIconPath() {
            const configStore = useConfigStore();
            switch (configStore.metadata) {
                case 0:
                    return (id) => {
                        const baseUrl = `https://cdn.communitydragon.org/latest/profile-icon/${id}`;
                        return baseUrl;
                    };
                case 1:
                    return (id) => {
                        if (id === -1) {
                            return 'https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/29.png';
                        }
                        const baseUrl = `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${id}.png`;
                        return baseUrl;
                    }
                default:
                    break;
            }
        },
        getChampionIconPath() {
            const config = useConfigStore();
            switch (config.metadata) {
                case 0:
                    return (id) => {
                        const baseUrl = `https://cdn.communitydragon.org/latest/champion/${id}/square`;
                        return baseUrl;
                    };
                case 1:
                    return (id) => {
                        if (id == 0) {
                            return 'https://cdn.communitydragon.org/latest/champion/None/square'
                        }
                        const name = this.tc.heros.get(`${id}`).alias;
                        const baseUrl = `https://game.gtimg.cn/images/lol/act/img/champion/${name}.png`;
                        return baseUrl;
                    }
                default:
                    break;
            }
        }
    },
    actions: {
        async init() {
            const configStore = useConfigStore();
            switch (configStore.metadata) {
                case 0:
                    // 初始化 cd 元数据
                    await this.initRunes_cd();
                    await this.initRunestyle_cd();
                    await this.initItems_cd();
                    await this.initSpells_cd();
                    await this.initQueues_cd();
                    break;
                case 1:
                    // 初始化 tc 元数据
                    await this.initHeros_tc();
                    await this.initItems_tc();
                    await this.initRunes_tc();
                    await this.initSpells_tc();
                    await this.initQueues_cd();
                    await this.initRunes_cd();
                    break;

                default:
                    throw new Error('元数据初始化失败，设置错误！');
            }
            return true;
        },
        async initRunes_cd() {
            const perksUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perks.json';
            try {
                const perksList = await fetch(perksUrl).then(res => res.data);
                this.cd.runes.clear();
                for (let i = 0; i < perksList.length; i++) {
                    const e = perksList[i];
                    this.cd.runes.set(e.id, e);
                }
            } catch (error) {
                throw new Error('runes_cd 初始化失败: ' + error);
            }
        },
        async initRunestyle_cd() {
            const perkstylesUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perkstyles.json';
            try {
                const perkstylesList = await fetch(perkstylesUrl).then(res => res.data.styles);
                this.cd.runestyles.clear();
                for (let i = 0; i < perkstylesList.length; i++) {
                    const e = perkstylesList[i];
                    this.cd.runestyles.set(e.id, e);
                }
            } catch (error) {
                throw new Error('runestyles_cd 初始化失败: ' + error);
            }
        },
        async initItems_cd() {
            const itemsUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/items.json';
            try {
                const itemsList = await fetch(itemsUrl).then(res => res.data);
                this.cd.items.clear();
                for (let i = 0; i < itemsList.length; i++) {
                    const e = itemsList[i];
                    this.cd.items.set(e.id, e);
                }
            } catch (error) {
                throw new Error('items_cd 初始化失败: ' + error);
            }
        },
        async initSpells_cd() {
            const spellsUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/summoner-spells.json';
            try {
                const spellsList = await fetch(spellsUrl).then(res => res.data);
                this.cd.spells.clear();
                for (let i = 0; i < spellsList.length; i++) {
                    const e = spellsList[i];
                    this.cd.spells.set(e.id, e);
                }
            } catch (error) {
                throw new Error('spells_cd 初始化失败: ' + error);
            }
        },
        async initQueues_cd() {
            const queuesUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/queues.json';
            try {
                const queues = await fetch(queuesUrl).then(res => res.data);
                this.cd.queues.clear();
                for (const [key, value] of Object.entries(queues)) {
                    this.cd.queues.set(key, value);
                }
            } catch (error) {
                throw new Error('queues_cd 初始化失败: ' + error);
            }
        },

        async initHeros_tc() {
            const herosUrl = 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js';
            try {
                const res = await fetch(herosUrl).then(res => res.data.hero);
                this.tc.heros.clear();
                res.forEach(h => {
                    this.tc.heros.set(h.heroId, h);
                });
            } catch (error) {
                throw new Error('heros_tc 初始化失败: ' + error);
            }
        },
        async initItems_tc() {
            const itemsUrl = 'https://game.gtimg.cn/images/lol/act/img/js/items/items.js';
            try {
                const res = await fetch(itemsUrl).then(res => res.data.items);
                this.tc.items.clear();
                res.forEach(i => {
                    this.tc.items.set(i.itemId, i);
                });
            } catch (error) {
                throw new Error('items_tc 初始化失败' + error);
            }
        },
        async initRunes_tc() {
            const runesUrl = 'https://game.gtimg.cn/images/lol/act/img/js/runeList/rune_list.js';
            try {
                const res = await fetch(runesUrl).then(res => res.data.rune);
                this.tc.runes.clear();
                for (const [key, value] of Object.entries(res)) {
                    this.tc.runes.set(key, value);
                }
            } catch (error) {
                throw new Error('runes_tc 初始化失败' + error);
            }
        },
        async initSpells_tc() {
            const spellsUrl = 'https://game.gtimg.cn/images/lol/act/img/js/summonerskillList/summonerskill_list.js';
            try {
                const res = await fetch(spellsUrl).then(res => res.data.summonerskill);
                this.tc.spells.clear();
                for (const [key, value] of Object.entries(res)) {
                    this.tc.spells.set(key, value);
                }
            } catch (error) {
                throw new Error('spells_tc 初始化失败' + error);
            }
        },
    }

});