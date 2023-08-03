<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import { getSummonerByName, getCurrentSummoner, getParameter, refreshParameter, connect, getChampSelectSession, getMatchHistoryByPuuid, getMatchById } from "./api"

let token = ref("");
let port = ref(0);

async function f1() {
  let lp = await getParameter();
  token.value = lp.token;
  port.value = lp.port;
}

async function f2() {
  await refreshParameter();
}

async function f3() {
  await connect();
}

async function f4() {
  await getChampSelectSession();
}

async function f5() {
  await getCurrentSummoner();
}

let name_input = ref("");
async function f6() {
  console.log(name_input.value);
  await getSummonerByName(name_input.value);
}

let puuid = ref("");
let beg = ref(0);
let end = ref(0);
async function f7() {
  console.log(name_input.value);
  await getMatchHistoryByPuuid(puuid.value, beg.value, end.value);
}

let match_id = ref(0);
async function f8() {
  await getMatchById(match_id.value);
}


</script>

<template>
  <div class="container">
    <button @click="f1">getParameter</button>
    <p> {{ token }}</p>
    <p> {{ port }}</p>
    <button @click="f2">refreshParameter</button>
    <button @click="f3">connect</button>
    <button @click="f4">getChampSelectSession</button>
    <button @click="f5">getCurrentSummoner</button>
    <input type="text" v-model="name_input">
    <button @click="f6">getSummonerByName</button>
    <div>
      <input type="text" v-model="puuid">
      <input type="number" v-model="beg">
      <input type="number" v-model="end">
    </div>
    <button @click="f7">getMatchHistoryByPuuid</button>
    <input type="number" v-model="match_id">
    <button @click="f8">getMatchById</button>


  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
