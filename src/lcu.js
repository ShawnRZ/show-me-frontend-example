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
    // try {
    await invoke("connect");
    const gf = await listen("Gameflow", async (e) => {
        console.log(e);
        switch (e.payload) {
            case "ChampSelect":
                const cs = await listen("ChampionSelect", async () => {
                    const temp = await listen("Gameflow", async (e) => {
                        cs();
                        temp();
                    })
                    let res = await invoke("get_champ_select_session");
                    let cs = JSON.parse(res);
                });
                break;

            default:
                cs();
                console.log("取消监听英雄选择");
                break;
        }
    });
    const cc = await listen("ConnectionClosed", () => {
        gf();
        cc();
        console.log("断开连接");
    })
    // } catch (err) {
    //     console.log(err);
    // }
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
    let s = await invoke("get_current_summoner");
    return s;
}

export async function getSummonerByName(name) {
    // try {
    //     let res = await invoke("get_summoner_by_name", { name: name });
    //     console.log(res);
    // } catch (err) {
    //     console.log(err);
    // }
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