import { defineStore } from 'pinia';
import { fetch } from '@tauri-apps/api/http';
import { useConfigStore } from './config';



export const useMetadataStore = defineStore('metadata', {
    state: () => ({
        cd: {
            perks: new Map,
            perkstyles: new Map,
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
        getPerks() {
            return this.perks;
        },
        getPerkStyles() {
            return this.perkstyles;
        },
        getItems() {
            return this.items;
        },
        getSpells() {
            return this.spells;
        },
        getQueues() {
            return this.queues;
        },

        getItemIconPath() {
            const configStore = useConfigStore();
            switch (configStore.metadata) {
                case 0:
                    return (id) => {
                        if (id === 0) {
                            id = 7050;
                        }
                        const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/';
                        console.info(id, this.getItems.get(id));
                        const iconPath = this.getItems.get(id).iconPath;
                        const path = iconPath.replace('/lol-game-data/assets/ASSETS/Items/Icons2D/', baseUrl).toLowerCase();
                        return path;
                    };

                case 1:
                    return (id) => {
                        if (id === 0) {
                            return 'https://game.gtimg.cn/images/lol/act/img/item/7050.png'
                        }
                        return this.tc.items[id].iconPath;
                    };

                default:
                    break;
            };
        },

        getRuneIconPath() {
            const configStore = useConfigStore();
            switch (configStore.metadata) {
                case 0:
                    return (id) => {
                        if (id === 0) {
                            return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png';
                        }
                        const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/';
                        let iconPath = '';
                        if (id in this.cd.perks) {
                            iconPath = this.cd.perks[id].iconPath;
                        } else {
                            iconPath = this.cd.perkstyles[id].iconPath;
                        }
                        const path = iconPath.replace('/lol-game-data/assets/v1/perk-images/Styles/', baseUrl).toLowerCase();
                        return path;
                    };

                case 1:
                    return (id) => {
                        if (id === 0) {
                            return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png';
                        }
                        const path = this.tc.runes[id].iconPath;
                        return path;
                    };

                default:
                    break;
            };
        },

        getPerkEndOfGameStatDescs() {
            return (id, var1, var2, var3) => {
                if (id === 0) {
                    return '未知符文';
                }
                console.info(id, this.getPerks.get(id).value);
                const endOfGameStatDescs = this.getPerks.get(id).endOfGameStatDescs;
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
    },
    actions: {
        async init() {
            const configStore = useConfigStore();
            switch (configStore.metadata) {
                case 0:
                    // 初始化 cd 元数据
                    await this.initPerks_cd();
                    await this.initPerkstyle_cd();
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
                    break;

                default:
                    throw new Error('元数据初始化失败，设置错误！');
            }
            return true;
        },
        async initPerks_cd() {
            const perksUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perks.json';
            try {
                const perksList = await fetch(perksUrl).then(res => res.data);
                this.cd.perks.clear();
                for (let i = 0; i < perksList.length; i++) {
                    const e = perksList[i];
                    this.cd.perks.set(e.id, e);
                }
                console.debug('perks_cd', this.cd.perks);
            } catch (error) {
                throw new Error('perks_cd 初始化失败: ' + error);
            }
        },
        async initPerkstyle_cd() {
            const perkstylesUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perkstyles.json';
            try {
                const perkstylesList = await fetch(perkstylesUrl).then(res => res.data.styles);
                this.cd.perkstyles.clear();
                for (let i = 0; i < perkstylesList.length; i++) {
                    const e = perkstylesList[i];
                    this.cd.perkstyles.set(e.id, e);
                }
                console.debug('perkstyle_cd', this.cd.perkstyles);
            } catch (error) {
                throw new Error('perkstyle_cd 初始化失败: ' + error);
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
                console.debug('items_cd', this.cd.items);
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
                console.debug('spells_cd', this.cd.spells);
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
                console.debug('queues_cd', this.cd.queues);
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
                console.debug('heros_tc', this.tc.heros);
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
                console.debug('items_tc', this.tc.items);
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
                console.debug('runes_tc', this.tc.runes);
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
                console.debug('spells_tc', this.tc.spells);
            } catch (error) {
                throw new Error('spells_tc 初始化失败' + error);
            }
        },
    }

});