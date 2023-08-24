<script setup>
import { ref, watch } from 'vue';
import { getRankedStats, getSummonerByName } from '@/lcu';
import { switchRankedTier } from '@/tool';


const props = defineProps(['name']);

const tier = ref('');
watch(() => props.name, async () => {
    const s = await getSummonerByName(props.name);
    const r = await getRankedStats(s.puuid);
    tier.value = switchRankedTier(r.queueMap['RANKED_SOLO_5x5'].tier);
    tier.value += '/';
    tier.value += switchRankedTier(r.queueMap['RANKED_FLEX_SR'].tier);
}, {
    immediate: true
});


</script>



<template>
    {{ tier }}
</template>

<style lang="scss" scoped></style>