import { Bookmark, PocketResponse } from "../types";

const consumer_key = '106588-f57ba7211117b9488375182';
const access_token = '42a2857b-61c8-0f23-2530-93d6ce';

// chrome.action.onClicked.addListener(async (tab) => {
  // const redirect_url = chrome.identity.getRedirectURL();
  // const requestToken = await getOAuthRequestToken();

  // chrome.identity.launchWebAuthFlow({
  //   url: `https://getpocket.com/auth/authorize?request_token=${requestToken.code}&redirect_uri=${redirect_url}*`,
  //   interactive: true,
  // }, async () => {
  //   const accessToken = await getOAuthAccessToken(requestToken.code);
  //   console.log({accessToken});
  // });
// });

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.action === 'getAccessToken') {
//     const requestToken = await getOAuthRequestToken();
//     const accessToken = await getOAuthAccessToken(requestToken.code);
    
//     console.log({ accessToken });
//     sendResponse({});
//   }
// });

// async function getOAuthRequestToken() {
//   return fetch('https://getpocket.com/v3/oauth/request', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'X-Accept': 'application/json',
//     },
//     body: JSON.stringify({
//       consumer_key,
//       redirect_uri: 'index.html',
//     }),
//   }).then((response) => response.json()).catch((error) => {
//     console.error(error);
//   });
// }

// async function getOAuthAccessToken(code) {
//   return fetch('https://getpocket.com/v3/oauth/authorize', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'X-Accept': 'application/json',
//     },
//     body: JSON.stringify({
//       consumer_key,
//       code,
//     }),
//   }).then((response) => response.json()).catch((error) => {
//     console.error(error);
//   });
// }

export async function getBookmarks(latest?: Bookmark) {
  const since = latest?.created_at
    ? Math.floor(latest.created_at.getTime() / 1000)
    : null;
  
  return fetch('https://getpocket.com/v3/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key,
      access_token,
      detailType: 'complete',
      sort: 'newest',
      tag: 'readinglist',
      since,
      // count: 15
    }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then((data: PocketResponse) => {
    if (data.error) {
      console.log({ data });
      
      throw new Error(data.error);
    }
    return Object.values(data.list);
  })
  .catch((error) => {
    console.error(error);
  });
}