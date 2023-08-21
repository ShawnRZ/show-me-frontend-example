import { defineStore } from 'pinia';
import { fetch } from '@tauri-apps/api/http';

export const useMetadataStore = defineStore('metadata', {
    state: () => ({
        perks: null,
        perkstyles: null,
        items: null,
        spells: null,
        queues: null,
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
            return (id) => {
                if (id === 0) {
                    id = 7050;
                }
                const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/';
                console.info(id, this.getItems.get(id));
                const iconPath = this.getItems.get(id).iconPath;
                const path = iconPath.replace('/lol-game-data/assets/ASSETS/Items/Icons2D/', baseUrl).toLowerCase();
                return path;
            }
        },
        getPerkIconPath() {
            return (id) => {
                if (id === 0) {
                    return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png';
                }
                const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/';
                console.info(id, this.getPerks.get(id));
                const iconPath = this.getPerks.get(id).iconPath;
                const path = iconPath.replace('/lol-game-data/assets/v1/perk-images/Styles/', baseUrl).toLowerCase();
                return path;
            }
        },
        getPerkStylesIconPath() {
            return (id) => {
                if (id === 0) {
                    return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png';
                }
                const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/';
                console.info(id, this.getPerkStyles.get(id));
                const iconPath = this.getPerkStyles.get(id).iconPath;
                const path = iconPath.replace('/lol-game-data/assets/v1/perk-images/Styles/', baseUrl).toLowerCase();
                return path;
            }
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
        }
    },
    actions: {
        async init() {
            const itemsUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/items.json';
            const perkstylesUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perkstyles.json';
            const perksUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/perks.json';
            const queuesUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/queues.json';
            const spellsUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1/summoner-spells.json';
            try {
                const itemsList = await fetch(itemsUrl).then(res => res.data);
                const items = new Map();
                for (let i = 0; i < itemsList.length; i++) {
                    const e = itemsList[i];
                    items.set(e.id, e);
                }
                this.items = items;
            } catch (error) {
                console.log('itemsList 初始化失败', error);
                return false;
            }

            try {
                const perksList = await fetch(perksUrl).then(res => res.data);
                const perks = new Map();
                for (let i = 0; i < perksList.length; i++) {
                    const e = perksList[i];
                    perks.set(e.id, e);
                }
                this.perks = perks;
            } catch (error) {
                console.log('itemsList 初始化失败', error);
                return false;
            }

            try {
                const queues = await fetch(queuesUrl).then(res => res.data);
                this.queues = queues;
            } catch (error) {
                console.log('queuesList 初始化失败', error);
                return false;
            }

            try {
                const spellsList = await fetch(spellsUrl).then(res => res.data);
                const spells = new Map();
                for (let i = 0; i < spellsList.length; i++) {
                    const e = spellsList[i];
                    spells.set(e.id, e);
                }
                this.spells = spells;
            } catch (error) {
                console.log('queuesList 初始化失败', error);
                return false;
            }

            try {
                const perkstylesList = await fetch(perkstylesUrl).then(res => res.data.styles);
                const perkstyles = new Map();
                for (let i = 0; i < perkstylesList.length; i++) {
                    const e = perkstylesList[i];
                    perkstyles.set(e.id, e);
                }
                this.perkstyles = perkstyles;
            } catch (error) {
                console.log('perkstyles 初始化失败', error);
                return false;

            }

            return true;
        }
    }
});