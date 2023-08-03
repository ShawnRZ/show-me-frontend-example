import { invoke } from "@tauri-apps/api";

export async function getParameter() {
    let lp;
    try {
        lp = await invoke("get_parameter");
    } catch (err) {
        console.log(err);
    }
    return lp;
}

export async function refreshParameter() {
    try {
        await invoke("refresh_parameter");
    } catch (err) {
        console.log(err);
    }
}

export async function connect() {
    try {
        await invoke("connect");
    } catch (err) {
        console.log(err);
    }
}

export async function getChampSelectSession() {
    try {
        let res = await invoke("get_champ_select_session");
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getCurrentSummoner() {
    try {
        let res = await invoke("get_current_summoner");
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getSummonerByName(name) {
    try {
        let res = await invoke("get_summoner_by_name", { name: name });
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getMatchHistoryByPuuid(puuid, beg, end) {
    try {
        let res = await invoke("get_match_history_by_puuid", { puuid: puuid, beg: beg, end: end });
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

export async function getMatchById(id) {
    try {
        let res = await invoke("get_match_by_id", { id: id });
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}


