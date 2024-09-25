import browser from "webextension-polyfill";
import {type GameIdLookupResponse, type GameOverviewResponse} from "../common/_types";
import SteamId from "../common/SteamId";
import {getCountry} from "../common/Utils";
import Config from "../config";

async function gameIdLookup(steamId: SteamId): Promise<null|string> {
    const response = await fetch("https://api.isthereanydeal.com/games/lookup/v1?"+(new URLSearchParams({
        key: Config.ITADApiKey,
        appid: steamId.id.toString(),
    })));

    if (response.ok) {
        let json = await response.json();
        if (json) {
            json = json as GameIdLookupResponse;
            return json?.game?.id ?? null;
        }
    }
    return null;
}

async function gameOverview(id: string): Promise<GameOverviewResponse|null> {
    const country = await getCountry();
    const response = await fetch("https://api.isthereanydeal.com/games/overview/v2?"+(new URLSearchParams({
        key: Config.ITADApiKey,
        country
    })), {
        method: "POST",
        body: JSON.stringify([id])
    });

    if (response.ok) {
        let json = await response.json();
        if (json) {
            return json as GameOverviewResponse;
        }
    } else {
        console.error(response);
        throw new Error("Failed to fetch data");
    }
    return null;
}

export default {
    gameOverview,
    gameIdLookup
}
