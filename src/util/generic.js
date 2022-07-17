export const DEFAULT_TOKEN_ICON = "https://design-system.immutable.com/currency_icons/currency--erc20.svg"

export const EVENT_ICONS = {
    send: `<svg class="bigger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.081 13.081"><g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(12.374 6.957) rotate(135)"><path id="Path_4" data-name="Path 4" d="M8.838,0H0" transform="translate(0 4.419)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_5" data-name="Path 5" d="M4.419,8.838,0,4.419,4.419,0" transform="translate(0)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>`,
    receive: `<svg class="bigger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.021 13.021"><g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(0.707 7.00) rotate(-45)"><path id="Path_4" data-name="Path 4" d="M8.781,0H0" transform="translate(0 4.391)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_5" data-name="Path 5" d="M4.391,8.781,0,4.391,4.391,0" transform="translate(0 0)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>`,
    deposit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.345 10.345"><g id="Icon_feather-upload" data-name="Icon feather-upload" transform="translate(0.875 0.875)"><path id="Path_11" data-name="Path 11" d="M13.1,22.5v1.91a.955.955,0,0,1-.955.955H5.455A.955.955,0,0,1,4.5,24.41V22.5" transform="translate(-4.5 -16.77)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/><path id="Path_12" data-name="Path 12" d="M15.275,6.888,12.888,4.5,10.5,6.888" transform="translate(-8.59 -4.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/><path id="Path_13" data-name="Path 13" d="M18,4.5v5.73" transform="translate(-13.702 -4.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/></g></svg>`,
    withdraw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.345 10.345"><g id="Icon_feather-download" data-name="Icon feather-download" transform="translate(0.875 0.875)"><path id="Path_8" data-name="Path 8" d="M13.1,22.5v1.91a.955.955,0,0,1-.955.955H5.455A.955.955,0,0,1,4.5,24.41V22.5" transform="translate(-4.5 -16.77)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/><path id="Path_9" data-name="Path 9" d="M10.5,15l2.388,2.388L15.275,15" transform="translate(-8.59 -11.657)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/><path id="Path_10" data-name="Path 10" d="M18,10.23V4.5" transform="translate(-13.702 -4.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/></g></svg>`,
    buy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.045 9.045"><g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(1 1)"><path id="Path_6" data-name="Path 6" d="M18,7.5v7.045" transform="translate(-14.477 -7.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_7" data-name="Path 7" d="M7.5,18h7.045" transform="translate(-7.5 -14.477)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>`,
    sell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.045 9.045"><g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(1 1)"><path id="Path_7" data-name="Path 7" d="M7.5,18h7.045" transform="translate(-7.5 -14.477)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>`
}

export const sliceAddress = (addy, n = 6) => `${addy.slice(0, n)}...${addy.slice(n * -1)}`