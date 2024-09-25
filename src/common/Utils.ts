import browser from "webextension-polyfill";

export async function getCountry() {
    const country = ((await browser.storage.local.get("country"))?.country) ?? "US";
    return country;
}