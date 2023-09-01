import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { ElNotification } from "element-plus";

export async function getParameter() {
    let lp;
    try {
        lp = await invoke("get_parameter");
    } catch (err) {
        ElNotification.error({
            title: "获取参数失败",
            message: err,
            position: "bottom-right"
        })
    }
    return lp;
}

export async function refreshParameter() {
    await invoke("refresh_parameter");
}

export async function connect() {
    await invoke("connect");
    const cc = await listen("ConnectionClosed", () => {
        cc();
        console.log("断开连接");
    })
}

export async function getChampSelectSession() {
    return await invoke("get_champ_select_session");
}

export async function getCurrentSummoner() {
    let s = await invoke("get_current_summoner");
    return s;
}

export async function getSummonerByName(name) {
    let res = await invoke("get_summoner_by_name", { name: name });
    return res;
}

export async function getMatchHistoryByPuuid(puuid, beg, end) {
    let res = await invoke("get_match_history_by_puuid", { puuid: puuid, beg: beg, end: end });
    return res;
}

export async function getMatchById(id) {
    let res = await invoke("get_match_by_id", { id: id });
    return res;
}

export async function getRankedStats(puuid) {
    let res = await invoke("get_ranked_stats", { puuid: puuid });
    return res;
}

export async function launchSpectate(puuid) {
    await invoke("launch_spectate", { puuid: puuid });
}

export async function testAndSetCer() {
    return await invoke("test_and_set_cer");
}

export async function getSummonerById(id) {
    return await invoke("get_summoner_by_id", { id: parseInt(id) });
}

export async function getGameflowSession() {
    return await invoke("get_gameflow_session");
}