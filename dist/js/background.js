/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/background/main.js ***!
  \********************************/
/*
 * @Author: zhizhuo 
 * @Date: 2023-01-22 15:40:56 
 * @Last Modified by: zhizhuo
 * @Last Modified time: 2023-02-02 13:45:25
 */

/* eslint-disable */
console.log("background page is ok");
let URLDATA = null;
let COOKIESDATA = null;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log('hostname')
  // console.log('cachedHost',cachedHost)
  // console.log(request);
  switch (request.cmd) {
    case 'getHost':
      let url = new URL(request.url);
      let hostname = url.hostname;
      getCache(hostname, 'getUrlInfo', function (cachedHost) {
        // console.log('hostname',hostname);
        // console.log('cachedHost',cachedHost);
        if (cachedHost) {
          sendResponse({
            'hostname': hostname,
            'host': cachedHost
          });
        }
      });
      //异步调用，必须返回true
      return true;
    case 'inject':
      return request.url;
    case 'popup':
      switch (request.click) {
        case 'geturl':
          sendResponse(URLDATA);
          break;
        case 'getcookies':
          get_cookies(URLDATA);
          sendResponse(COOKIESDATA);
          break;
        case 'do':
          sendResponse('sendurl success');
          // eslint-disable-next-line no-undef
          chrome.runtime.sendMessage({
            cmd: "background",
            click: "sendurl",
            data: URLDATA
          }, function (response) {
            console.log("response", response);
          });
          break;
        default:
          sendResponse('OK');
          break;
      }
    default:
      sendResponse('OK');
      break;
  }
  sendResponse('OK');
});
function get_cookies(url) {
  return chrome.cookies.getAll({
    url
  }, function (cookies) {
    const resList = cookies.map(item => {
      return `${item.name}=${item.value}`;
    });
    const cookieStr = resList.join(";");
    console.log("cookies-----", cookieStr);
    COOKIESDATA = cookieStr;
    return cookieStr;
  });
}
async function saveCache(host, res, key) {
  try {
    // console.log('saveCache', host, res, key);
    let result = await res; // 等待 Promise 返回结果
    // console.log('json', JSON.stringify(result));

    chrome.storage.local.get(host, function (data) {
      hostData = data[host] || {};
      hostData[key] = JSON.stringify(result);
      let newData = {};
      newData[host] = hostData;
      // console.log('newData',newData)
      chrome.storage.local.set(newData);
    });
  } catch (error) {
    console.log('saveCache error', error);
  }
}
function getCache(host, key, callback) {
  chrome.storage.local.get(host, function (data) {
    // console.log('getCache-------------------', host, key);
    // console.log('getCache', data);

    hostData = data[host] || {};
    let parsedData = JSON.parse(hostData[key] || '{}');
    callback(parsedData);
  });
}
function getUrlInfo(url, hostname) {
  // hostname = getHostname(url)
  resData = getFofaInfo(hostname);
  console.log(resData);
  saveCache(hostname, resData, 'getUrlInfo');
}

/*
 * Listen for changes in the URL in any of the tabs.
 */
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
  // console.log('onUpdated')
  if (tab.status === 'loading') {
    // console.log("tab.url",tab.url)
    //判断tab.url是否为http或https
    if (tab.url.startsWith('http') || tab.url.startsWith('https')) {
      let url = new URL(tab.url);
      hostname = url.hostname;
      // console.log("tab.url",tab.url)
      // console.log('hostname',url.hostname)
      getUrlInfo(tab.url, hostname);
    } else {
      console.log('不是http或https');
    }

    // getHostDetail(hostname)
  }
});

chrome.windows.onRemoved.addListener(function (windowId) {
  chrome.storage.local.clear(function () {
    console.log('Local storage cleared on browser close.');
  });
  // clearCache(hostname)
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  if (activeInfo.tabId) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      //判断是不是http或https
      if (tab.url.startsWith('http') || tab.url.startsWith('https')) {
        let url = new URL(tab.url);
        hostname = url.hostname;
        // console.log("tab.url",tab.url)
        // console.log('hostname',url.hostname)
        getUrlInfo(tab.url, hostname);
      } else {
        console.log('不是http或https');
      }
    });
  }
});
function makeRequest(url) {
  return fetch(url).then(response => response.json()).then(data => {
    // console.log(data);
    return data;
  }).catch(error => {
    console.error('Error:', error);
  });
}
function getFofaInfo(hostname, ip) {
  let url = 'https://amap.fofa.info/host/' + hostname;
  //判断hostname是否为空
  if (hostname) {
    return makeRequest(url);
  }
}
/******/ })()
;
//# sourceMappingURL=background.js.map