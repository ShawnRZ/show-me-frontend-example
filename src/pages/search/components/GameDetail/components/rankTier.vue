<script setup>
import { ref, watch } from 'vue';
import { getRankedStats, getSummonerById } from '@/lcu';
import { switchRankedTier } from '@/tool';


const props = defineProps(['id']);

const tier = ref('');
watch(() => props.id, async () => {
    tier.value = '';
    const s = await getSummonerById(props.id.toString());
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