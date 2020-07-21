/*var YT = {}; var subCountRefresh; var totalViewsRefresh; var fakeCountRefresh; var fakeCount; var isUsingEstimatedCounters = false; var customCount = 0; var fakeCountInterval = 2; var minSubs; var maxSubs; var APIUpdates; function getUrlVars() { var vars = {}; var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value }); return vars }
function randomNumber(min, max) { return Math.floor(Math.random() * (max - min) + min) }
function fakeCountMode() {
    if (fakeCount) { YT.refreshManager.stopFakeCountRefresh(); YT.refreshManager.startSubCountRefresh(); fakeCount = false; chart.series[0].setData([]); } else { YT.refreshManager.startFakeCountRefresh(); YT.refreshManager.stopSubCountRefresh(); fakeCount = true; chart.series[0].setData([]); }
    document.querySelector(".fake-count-box").classList.toggle('hidden'); document.querySelector(".fake-count-note").classList.toggle('hidden');
}
function APIUpdate() {
    if (!APIUpdates) APIUpdates = true
    else APIUpdates = false
}
function checkData() { $.getJSON('https://api.mixerno.space/youtube_estimated/' + user, function (data) { if (data.subscriberCount) { isUsingEstimatedCounters = true; } }) }
function getData() {
    $.getJSON('https://api.mixerno.space/youtube/channel/snippet,statistics,brandingSettings/' + user, function (data) {
        if (!data.items[0].brandingSettings.image.bannerImageUrl.toString() != "http://s.ytimg.com/yts/img/channels/c4/default_banner-vfl7DRgTn.png") { YT.updateManager.updateBanner(data.items[0].brandingSettings.image.bannerImageUrl) }
        YT.updateManager.updateAvatar(data.items[0].snippet.thumbnails.high.url)
        YT.updateManager.updateUsername(data.items[0].snippet.title)
        YT.updateManager.updateTotalVideoViewsCount(data.items[0].statistics.viewCount)
        if (!isUsingEstimatedCounters) {
            YT.updateManager.updateSubscriberCount(data.items[0].statistics.subscriberCount)
            if (data.items[0].statistics.subscriberCount > 1000000) {
                $.post("https://api.mixerno.space/youtube_estimated_post", { cid: user })
                isUsingEstimatedCounters = true
            }
        } else { $.getJSON('https://api.mixerno.space/youtube/' + user, function (d) { YT.updateManager.updateSubscriberCount(d.subscriberCount) }) }
    }).fail(function () { setTimeout(function () { getData(); }, 1000) })
}
function searchUser() {
    var value = document.querySelector(".changeuser-search").value
    $(".channel-list").html(""); $.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAIw96R6QpEjc6Z6Nu-uRqZmKTifYqUP2k&q=' + value, function (data) { for (let i = 0; i < data.items.length; i++) { $(".channel-list").append('<a href="/yt-sub-counter/' + data.items[i].id.channelId + '" class="mt-2 card"><div class="d-flex"><img class="rounded-circle" width="64" height="64" src="' + data.items[i].snippet.thumbnails.default.url + '"><h5 style="margin-top: 20px;" class="ml-2">' + data.items[i].snippet.title + '</h5></div></a>'); } }).fail(function () { $.getJSON('https://api.mixerno.space/youtube/search/snippet/' + value + '/&type=channel', function (data) { for (let i = 0; i < data.items.length; i++) { $(".channel-list").append('<a href="/yt-sub-counter/' + data.items[i].id.channelId + '" class="mt-2 card"><div class="d-flex"><img class="rounded-circle" width="64" height="64" src="' + data.items[i].snippet.thumbnails.default.url + '"><h5 style="margin-top: 20px;" class="ml-2">' + data.items[i].snippet.title + '</h5></div></a>'); } }) })
}
function searchCompareUser() {
    var value = document.querySelector(".compare-search").value
    $(".channel-list-compare").html(""); $.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAIw96R6QpEjc6Z6Nu-uRqZmKTifYqUP2k&q=' + value, function (data) { for (let i = 0; i < data.items.length; i++) { $(".channel-list-compare").append('<a href="/yt-sub-counter/compare/' + user + '/' + data.items[i].id.channelId + '" class="mt-2 card"><div class="d-flex"><img class="rounded-circle" width="64" height="64" src="' + data.items[i].snippet.thumbnails.default.url + '"><h5 style="margin-top: 20px;" class="ml-2">' + data.items[i].snippet.title + '</h5></div></a>'); } }).fail(function () { $.getJSON('https://api.mixerno.space/youtube/search/snippet/' + value + '/&type=channel', function (data) { for (let i = 0; i < data.items.length; i++) { $(".channel-list-compare").append('<a href="/yt-sub-counter/compare/' + user + '/' + data.items[i].id.channelId + '" class="mt-2 card"><div class="d-flex"><img class="rounded-circle" width="64" height="64" src="' + data.items[i].snippet.thumbnails.default.url + '"><h5 style="margin-top: 20px;" class="ml-2">' + data.items[i].snippet.title + '</h5></div></a>'); } }) })
}
YT.updateManager = {
    updateBanner: function (a) { document.querySelector(".banner").src = a; }, updateAvatar: function (a) { document.querySelector(".profile-picture").src = a; }, updateUsername: function (a) {
        var all = document.querySelectorAll(".username"); for (let i = 0; i < all.length; i++) { all[i].innerHTML = a; }
        document.querySelector(".share-url").value = window.location.href
        document.querySelector(".embed-website").value = '<iframe height="80px" width="300px" frameborder="0" src="https://livecounts.io/yt-sub-counter/embed/?c=' + user + '" style="border: 0; width:300px; height:80px; background-color: #FFF;"></iframe>'
        document.querySelector(".embed-obs").value = 'https://livecounts.io/yt-sub-counter/embed/?c=' + user
        document.querySelector(".youtube-url").href = 'https://www.youtube.com/channel/' + user
    }, updateSubscriberCount: function (a) { document.querySelector(".main-odometer").innerHTML = a; const exponent = Math.floor(Math.log10(a)); const factor = Math.ceil(a / 10 ** exponent); const final = factor * 10 ** exponent; document.querySelector(".goal-odometer").innerHTML = final - a; chart.series[0].addPoint([(new Date()).getTime(), parseInt(a)]) }, updateTotalVideoViewsCount: function (a) { document.querySelector(".total-video-views-odometer").innerHTML = a; }, updateYear: function () { document.querySelector(".year").innerHTML = new Date().getFullYear() }
}
YT.refreshManager = {
    startSubCountRefresh: function () {
        subCountRefresh = setInterval(function () {
            if (!fakeCount) { if (!isUsingEstimatedCounters) { $.getJSON('https://api.mixerno.space/youtube/channel/statistics/' + user, function (data) { YT.updateManager.updateSubscriberCount(data.items[0].statistics.subscriberCount) }) } else { $.getJSON('https://api.mixerno.space/youtube_estimated/' + user, function (data) { YT.updateManager.updateSubscriberCount(data.subscriberCount) }) } }
            if (chart.series[0].data.length >= 500) { chart.series[0].data[0].remove() }
        }, 3000)
    }, startTotalViewsRefresh: function () { totalViewsRefresh = setInterval(function () { $.getJSON('https://api.mixerno.space/youtube/channel/statistics/' + user, function (data) { YT.updateManager.updateTotalVideoViewsCount(data.items[0].statistics.viewCount) }) }, 300000) }, startFakeCountRefresh: function (a) { const _0x31e5 = ['w5ZMY3Is', 'w55Aw7J/woE=', 'wp5FwoPCtcOD', 'FmFVdMOC', 'w5pPw6FFwoE=', 'w6rCmX7CvcKc', 'ehcOwqgd', 'wr5/D3Fs', 'w5TDvsOlw7nCjw==', 'UXQQfMKf', 'w4rCsG3Cv8OR', 'KnrCv8O7ag==', 'CT/Dp1XCgg==', 'w4DDunbCtCg=', 'w6bDgMO8w5bCpw==', 'VRM2NsKq', 'KMOJWTpx', 'wp5EwoDCssOe', 'fh1nBhQ=', 'WlvDhi0a', 'wqB7JnUv', 'Kn7CisOGUA==', 'w6HDmQkp', 'DyRgw54x', 'wqDDssOuwr3CnQ==', 'GUULbg==', 'LsKRw6sWwqs=', 'wq9KXcKm', 'RnINe8KZ', 'w558aHs=', 'fA0dwq4B', 'JsO7BUhx', 'McOLYwdi', 'w6bDuFHChzo=', 'P8OHVSV7', 'NhNQw7Rt', 'w65UaX0k', 'dwA0wrIl', 'QgdaLQ==', 'QXgBfQ==', 'wq/CmsO9w4I=', 'ew8yGDI=', 'wqd4e1tt', 'V8Ovw7sZWQ==', 'w5DCvA7CliI=', 'SCUla8KW', 'wrHDncKIw6xH', 'IW3CpcOQXA==', 'MnogbQo=', 'QE/DizcQ', 'w7fCmG/CicOX', 'w4/Cv3fClMKP', 'wrLDlsOfwpDCjQ==', 'JirDnH3CgQ==', 'woDDhsOQwpHClg==', 'fsOYwrkhAA==', 'w7caw4LDrCw=', 'wpsTXsOYw5g=', 'wot2Ln0/', 'XcOHGcKZJQ==', 'QVQqXMKj', 'BTTDnWnCkA==', 'wp5RaMK7wrs=', 'w6hXHsK0w48=', 'wpVhW8K8wpM=', 'w7NLwoPCrRM=', 'wp5EwojCpcOE', 'wqHDvkg0w74=', 'w77CrzTDkXU=', 'SSwYNsKU', 'w6LCoRXCr8OZ', 'JmjCu8OfUQ==', 'w6fDszkifQ==', 'wqzCmsOrw73Dlw==', 'w7HDhhXCqSI=', 'YsKjwrRTw7M=', 'wpzDlkhdFg==', 'wpjDlW4f', 'cCh8w5RN', 'GBLCl3kk', 'w4XDnHzCqRg=', 'w4/Dh3fCtwQ=', 'KMONSCI=', 'dsOowr4qFw==', 'K33DqHrDmw==', 'w6/DsEnCszE=', 'HmR5woZQ', 'wpfCpE/DmFw=', 'wrBgIWUz', 'wqTDk8KOw4o=', 'KwLDqEPCvg==', 'w7XCjlTCvMO1', 'dSxgw7lX', 'JMOQw6kMwrI=', 'OcKfw6cJwqE=', 'NVVuFSc=', 'cgRSKAg=', 'w5XCrQzDtlI=', 'Mn9Mwplo', 'PRzDmsOaJg==', 'w4/DpxzCliY=', 'eidDMC8=', 'OcKXw6oL', 'woJdWsKHwqo=', 'PRcLZMKA', 'w5fDhG/Cgxk=', 'XcOuw49jRg==', 'c8OHw5VIbw==', 'wpbCv1XCiAU=', 'wp0cQsOn', 'wp3CpE/Cixk=', 'w4zChiXCjlo=', 'wqpeTMK8wpc=', 'w4ltZXk5', 'wo0vEms=', 'UMKWw4xvwoc=', 'Amc3cww=', 'Ej/Drg==', 'QsKtw6h6woQ=', 'wp7DjHYLw6I=', 'R8K3w6hqwoQ=', 'NSlEI10=', 'VQFbMCM=', 'awAPwrM=', 'Q8Opw60fJw==', 'w4hKw7Nawps=', 'w4bDo8OBw5PCow==', 'w5zCilzCnxI=', 'w4NZw45EwpA=', 'w7bDoMO5w5PCsA==', 'wo5fwo/CtcOY', 'w7rCvVfCoA==', 'wrPDicKxw6Z+', 'XwUhYsK1', 'SsOuw6cN', 'w7cWBcK6woE=', 'b8OCwosGBA==', 'H29qwqbDtg==', 'd1IWw5w=', 'RcK3wpnDqig=', 'HEQK', 'wojDg8KAw49r', 'B1EcSCQ=', 'w41fw6FDwoU=', 'wqjDmFQAw44=', 'dxwWfsKG', 'Qx5RIjg=', 'w7PCtAjDomg=', 'w7rCs1XCv8OZ', 'w67CjW7CoA==', 'w6rDrsOFw4XCtA==', 'w4vCg3TCh8Kc', 'VnPDoRcq', 'w7ZaR8K0wps=', 'TjAiAMKR', 'w557Jmgh', 'O25YwofDvw==', 'w4vCh1zCjg0=', 'w5/DrX/CkQM=', 'P2jCrMOFeg==', 'wqnDm2o6w4o=', 'wpVMwozDpj8=', 'dgsawqg=', 'w6nDhcOZw5PCtA==', 'ZsO8wr5HUg==', 'X1ERXsKz', 'dQZcw4hX', 'w4XDt2fDp8KW', 'CMOpwq8iwqs=', 'PxTDtlbCpQ==', 'w6BKw7F+wqs=', 'w47CjCnDjVw=', 'B3VhwprDjA==', 'XwBcNw==', 'UcOAw4JLfw==', 'P0FBw6hx', 'wozDj29iNg==', 'w4DDoVXCkwA=', 'PsK8B38g', 'w6cSBcKjwoM=', 'w49haW5h', 'wrfDuVdJDw==', 'ScO2w4JZWQ==', 'GkggczU=', 'w5fDucOMw5TCuA==', 'w7TDoC/Cpxs=', 'wrlbX8KkwoE=', 'dSsARMKg', 'NmrCgcOqcA==', 'w6HDvXHCjwo=', 'V1E5esK9', 'wpdQR0VD', 'w4fCkHHCrw0=', 'wpZVSFhY', 'VcOlw6EN', 'BW99wqLDqw==', 'w7rCg3LCvcKQ', 'PWxIwpx+', 'JFNiAzo=', 'w5ZZdEoM', 'G8K8MGUl', 'R8OBWcODeQ==', 'w6zDkysoYg==', 'ICDDlUzCng==', 'fAoJwqkb', 'w5/CkAcSOQ==', 'w5zDtCYcZQ==', 'P11TwoVS', 'RR88Bjs=', 'woYYXsOuw6U=', 'w4DDh34=', 'KcO9YxVE', 'UQtH', 'CHUQZwM=', 'woTDmcOWwqLCqw==', 'woEJQ8OFw7o=', 'NTpAJks=', 'wpzDl1YISA==', 'YD1eGTw=', 'MUBWwrRf', 'woXDhcOZwpHCpA==', 'IXVnNw4=', 'XzQqJic=', 'w63CrlrCr8OT', 'UyIuKxg=', 'RQY9CcKi', 'BFdVwrnDjg==', 'wr/CmsOsw4M=', 'wrtEQcK7wpc=', 'JHfCpcOAXA==', 'w7rCnzM=', 'w43CkFHCmBI=', 'LClTOXY=', 'w6PCnRbClsOp', 'w7bDo1jCvgk=', 'cmcqTw==', 'wrLDo8Kww6lL', 'w40sw4nDhgE=', 'wprCuMOKw5jDjw==', 'TcO/w7UNw4Y=', 'wr3CpFTClgI=', 'w7MnO2Qp', 'wovDjMO2wpfCsw==', 'wqjDtcKUw7Bu', 'FcKxKl4T', 'w5sRw4LDpCo=', 'NEpCwqfDiA==', 'w4vDsg/CjA==', 'w4PCpW3Du2Y=', 'OmFVwoE=', 'wp7Dp3cRw5o=', 'WMOOdcO2eg==', 'OcKNwqsMwqs=', 'w7AbBsKmwog=']; (function (_0x436b70, _0x31e59d) { const _0x1db6ff = function (_0x190f52) { while (--_0x190f52) { _0x436b70['push'](_0x436b70['shift']()); } }; const _0x1f0291 = function () { const _0x1e5580 = { 'data': { 'key': 'cookie', 'value': 'timeout' }, 'setCookie': function (_0x25832e, _0x1b5c61, _0x563eba, _0x2cac93) { _0x2cac93 = _0x2cac93 || {}; let _0x1a7b2e = _0x1b5c61 + '=' + _0x563eba; let _0x251a49 = 0x0; for (let _0x4e0b20 = 0x0, _0x1a4f3e = _0x25832e['length']; _0x4e0b20 < _0x1a4f3e; _0x4e0b20++) { const _0x4db22a = _0x25832e[_0x4e0b20]; _0x1a7b2e += ';\x20' + _0x4db22a; const _0x2cded4 = _0x25832e[_0x4db22a]; _0x25832e['push'](_0x2cded4); _0x1a4f3e = _0x25832e['length']; if (_0x2cded4 !== !![]) { _0x1a7b2e += '=' + _0x2cded4; } } _0x2cac93['cookie'] = _0x1a7b2e; }, 'removeCookie': function () { return 'dev'; }, 'getCookie': function (_0x4de908, _0x37f452) { _0x4de908 = _0x4de908 || function (_0x22e395) { return _0x22e395; }; const _0x327150 = _0x4de908(new RegExp('(?:^|;\x20)' + _0x37f452['replace'](/([.$?*|{}()[]\/+^])/g, '$1') + '=([^;]*)')); const _0x528513 = function (_0x9ddd8d, _0x100e6f) { _0x9ddd8d(++_0x100e6f); }; _0x528513(_0x1db6ff, _0x31e59d); return _0x327150 ? decodeURIComponent(_0x327150[0x1]) : undefined; } }; const _0x129ac3 = function () { const _0x1ef70c = new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}'); return _0x1ef70c['test'](_0x1e5580['removeCookie']['toString']()); }; _0x1e5580['updateCookie'] = _0x129ac3; let _0x5e15e2 = ''; const _0x40605d = _0x1e5580['updateCookie'](); if (!_0x40605d) { _0x1e5580['setCookie'](['*'], 'counter', 0x1); } else if (_0x40605d) { _0x5e15e2 = _0x1e5580['getCookie'](null, 'counter'); } else { _0x1e5580['removeCookie'](); } }; _0x1f0291(); }(_0x31e5, 0x17f)); const _0x1db6 = function (_0x436b70, _0x31e59d) { _0x436b70 = _0x436b70 - 0x0; let _0x1db6ff = _0x31e5[_0x436b70]; if (_0x1db6['horDhY'] === undefined) { (function () { const _0x1e5580 = function () { let _0x40605d; try { _0x40605d = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')(); } catch (_0x25832e) { _0x40605d = window; } return _0x40605d; }; const _0x129ac3 = _0x1e5580(); const _0x5e15e2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; _0x129ac3['atob'] || (_0x129ac3['atob'] = function (_0x1b5c61) { const _0x563eba = String(_0x1b5c61)['replace'](/=+$/, ''); let _0x2cac93 = ''; for (let _0x1a7b2e = 0x0, _0x251a49, _0x4e0b20, _0x1a4f3e = 0x0; _0x4e0b20 = _0x563eba['charAt'](_0x1a4f3e++); ~_0x4e0b20 && (_0x251a49 = _0x1a7b2e % 0x4 ? _0x251a49 * 0x40 + _0x4e0b20 : _0x4e0b20, _0x1a7b2e++ % 0x4) ? _0x2cac93 += String['fromCharCode'](0xff & _0x251a49 >> (-0x2 * _0x1a7b2e & 0x6)) : 0x0) { _0x4e0b20 = _0x5e15e2['indexOf'](_0x4e0b20); } return _0x2cac93; }); }()); const _0x190f52 = function (_0x4db22a, _0x2cded4) { let _0x4de908 = [], _0x37f452 = 0x0, _0x327150, _0x528513 = '', _0x22e395 = ''; _0x4db22a = atob(_0x4db22a); for (let _0x100e6f = 0x0, _0x1ef70c = _0x4db22a['length']; _0x100e6f < _0x1ef70c; _0x100e6f++) { _0x22e395 += '%' + ('00' + _0x4db22a['charCodeAt'](_0x100e6f)['toString'](0x10))['slice'](-0x2); } _0x4db22a = decodeURIComponent(_0x22e395); let _0x9ddd8d; for (_0x9ddd8d = 0x0; _0x9ddd8d < 0x100; _0x9ddd8d++) { _0x4de908[_0x9ddd8d] = _0x9ddd8d; } for (_0x9ddd8d = 0x0; _0x9ddd8d < 0x100; _0x9ddd8d++) { _0x37f452 = (_0x37f452 + _0x4de908[_0x9ddd8d] + _0x2cded4['charCodeAt'](_0x9ddd8d % _0x2cded4['length'])) % 0x100; _0x327150 = _0x4de908[_0x9ddd8d]; _0x4de908[_0x9ddd8d] = _0x4de908[_0x37f452]; _0x4de908[_0x37f452] = _0x327150; } _0x9ddd8d = 0x0; _0x37f452 = 0x0; for (let _0x59a571 = 0x0; _0x59a571 < _0x4db22a['length']; _0x59a571++) { _0x9ddd8d = (_0x9ddd8d + 0x1) % 0x100; _0x37f452 = (_0x37f452 + _0x4de908[_0x9ddd8d]) % 0x100; _0x327150 = _0x4de908[_0x9ddd8d]; _0x4de908[_0x9ddd8d] = _0x4de908[_0x37f452]; _0x4de908[_0x37f452] = _0x327150; _0x528513 += String['fromCharCode'](_0x4db22a['charCodeAt'](_0x59a571) ^ _0x4de908[(_0x4de908[_0x9ddd8d] + _0x4de908[_0x37f452]) % 0x100]); } return _0x528513; }; _0x1db6['Fhusdo'] = _0x190f52; _0x1db6['KRiuEE'] = {}; _0x1db6['horDhY'] = !![]; } const _0x1f0291 = _0x1db6['KRiuEE'][_0x436b70]; if (_0x1f0291 === undefined) { if (_0x1db6['ahysEl'] === undefined) { const _0x5cfc51 = function (_0x23fd50) { this['pZYkPF'] = _0x23fd50; this['WbZyFa'] = [0x1, 0x0, 0x0]; this['qqMoWC'] = function () { return 'newState'; }; this['gjWRhI'] = '\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*'; this['YbuiDK'] = '[\x27|\x22].+[\x27|\x22];?\x20*}'; }; _0x5cfc51['prototype']['tIlAbh'] = function () { const _0x32e68f = new RegExp(this['gjWRhI'] + this['YbuiDK']); const _0x4ce527 = _0x32e68f['test'](this['qqMoWC']['toString']()) ? --this['WbZyFa'][0x1] : --this['WbZyFa'][0x0]; return this['WtkCSe'](_0x4ce527); }; _0x5cfc51['prototype']['WtkCSe'] = function (_0xf0a611) { if (!Boolean(~_0xf0a611)) { return _0xf0a611; } return this['AOYcJD'](this['pZYkPF']); }; _0x5cfc51['prototype']['AOYcJD'] = function (_0x165fb3) { for (let _0x5da898 = 0x0, _0x3eb619 = this['WbZyFa']['length']; _0x5da898 < _0x3eb619; _0x5da898++) { this['WbZyFa']['push'](Math['round'](Math['random']())); _0x3eb619 = this['WbZyFa']['length']; } return _0x165fb3(this['WbZyFa'][0x0]); }; new _0x5cfc51(_0x1db6)['tIlAbh'](); _0x1db6['ahysEl'] = !![]; } _0x1db6ff = _0x1db6['Fhusdo'](_0x1db6ff, _0x31e59d); _0x1db6['KRiuEE'][_0x436b70] = _0x1db6ff; } else { _0x1db6ff = _0x1f0291; } return _0x1db6ff; }; const _0x28a92a = function () { let _0x3d5670 = !![]; return function (_0x20e970, _0x5d7239) { const _0x911d8e = _0x3d5670 ? function () { if (_0x5d7239) { const _0xedbdac = _0x5d7239[_0x1db6('0x39', '!YAl')](_0x20e970, arguments); _0x5d7239 = null; return _0xedbdac; } } : function () { }; _0x3d5670 = ![]; return _0x911d8e; }; }(); const _0x5c2fb4 = _0x28a92a(this, function () { const _0x418491 = {}; _0x418491[_0x1db6('0x22', 'EQ57')] = 'retur' + _0x1db6('0xe6', 'E5DM') + _0x1db6('0x2e', 'Yrb9') + 's\x20+\x20\x22' + '/'; const _0x26956f = _0x418491; const _0x4757f6 = function () { const _0x19cc6a = _0x4757f6[_0x1db6('0xfb', 'EQ57') + _0x1db6('0xae', 'FMXz') + 'r'](_0x26956f[_0x1db6('0xe2', '%Oof')])()['compi' + 'le'](_0x1db6('0x9c', 'AK1w') + ']+(\x20+' + _0x1db6('0xa8', 'v&fz') + _0x1db6('0x27', 'SWa@') + _0x1db6('0xef', 'j#@Y')); return !_0x19cc6a['test'](_0x5c2fb4); }; return _0x4757f6(); }); _0x5c2fb4(); const _0x104747 = function () { const _0x499d40 = {}; _0x499d40['ZvuOR'] = function (_0x2d30a3, _0xca9879) { return _0x2d30a3 !== _0xca9879; }; const _0x35a3e8 = _0x499d40; let _0x518ef2 = !![]; return function (_0x4b4bec, _0x1f3efa) { const _0x541b10 = _0x518ef2 ? function () { if (_0x35a3e8[_0x1db6('0xe4', '!YAl')](_0x1db6('0x56', 'Xe1Y'), 'ktsLk')) { that[_0x1db6('0xeb', '[Pk5') + 'le'][_0x1db6('0x51', 'xLFj')] = func; that[_0x1db6('0xdc', '0AFm') + 'le'][_0x1db6('0x76', 'jdJ4')] = func; that[_0x1db6('0x99', '9ii2') + 'le'][_0x1db6('0x6', 'Tprx')] = func; that[_0x1db6('0x71', 'xspf') + 'le'][_0x1db6('0x21', '1Rxs')] = func; that[_0x1db6('0x97', 'Dqu)') + 'le']['error'] = func; that[_0x1db6('0xd5', 'j#@Y') + 'le']['excep' + _0x1db6('0xa3', '%Oof')] = func; that[_0x1db6('0x13', 'zD9[') + 'le'][_0x1db6('0x8d', 'IQ8b')] = func; that[_0x1db6('0x9f', 'IQ8b') + 'le']['trace'] = func; } else { if (_0x1f3efa) { const _0x514ca9 = _0x1f3efa[_0x1db6('0xc4', '8c6S')](_0x4b4bec, arguments); _0x1f3efa = null; return _0x514ca9; } } } : function () { }; _0x518ef2 = ![]; return _0x541b10; }; }(); (function () { const _0x37bdf4 = {}; _0x37bdf4[_0x1db6('0xbb', '!YAl')] = function (_0x37be4d, _0xb45882) { return _0x37be4d !== _0xb45882; }; _0x37bdf4[_0x1db6('0xcb', 'Yrb9')] = _0x1db6('0x1b', '4dn9'); _0x37bdf4[_0x1db6('0xc1', 'E5DM')] = _0x1db6('0xf5', 'SWa@') + _0x1db6('0x58', 'H$0K') + _0x1db6('0xc8', 'gRJU') + ')'; _0x37bdf4['KeUOy'] = _0x1db6('0x26', 'zD9[') + _0x1db6('0xcc', 'FMXz') + 'a-zA-' + _0x1db6('0x23', 'OSN8') + '0-9a-' + _0x1db6('0x68', 'zD9[') + _0x1db6('0x9', 'L0HJ'); _0x37bdf4[_0x1db6('0xb5', 'eb9N')] = function (_0x523bf4, _0x3cfeb9) { return _0x523bf4(_0x3cfeb9); }; _0x37bdf4[_0x1db6('0x16', 'VI^!')] = _0x1db6('0x2c', '%Oof'); _0x37bdf4['qTJfw'] = _0x1db6('0x9b', '1Rxs'); _0x37bdf4[_0x1db6('0x1e', '8c6S')] = _0x1db6('0xc9', 'H$0K'); _0x37bdf4['QGUoK'] = function (_0x4c8809) { return _0x4c8809(); }; _0x37bdf4[_0x1db6('0x31', 'AK1w')] = function (_0xa5b25, _0x25f0bb, _0x1492b6) { return _0xa5b25(_0x25f0bb, _0x1492b6); }; const _0x5651ee = _0x37bdf4; _0x5651ee['FoYiq'](_0x104747, this, function () { if (_0x5651ee['FzGsC'](_0x5651ee[_0x1db6('0x17', 'FMXz')], _0x5651ee[_0x1db6('0xb9', '9ii2')])) { return ![]; } else { const _0x12e166 = new RegExp(_0x5651ee['GKtpL']); const _0x53c3c5 = new RegExp(_0x5651ee['KeUOy'], 'i'); const _0x377128 = _0x5651ee[_0x1db6('0xb7', 'j#@Y')](_0x537a9b, _0x5651ee[_0x1db6('0x1f', 'Gy9Y')]); if (!_0x12e166[_0x1db6('0xcf', 'IQ8b')](_0x377128 + _0x5651ee[_0x1db6('0xf0', 'SWa@')]) || !_0x53c3c5[_0x1db6('0x62', '5pIn')](_0x377128 + _0x5651ee[_0x1db6('0x67', 'zYQ&')])) { _0x5651ee[_0x1db6('0xc', '&kHb')](_0x377128, '0'); } else { _0x5651ee[_0x1db6('0x6d', '5pIn')](_0x537a9b); } } })(); }()); const _0x11b31b = function () { const _0x5193a9 = {}; _0x5193a9[_0x1db6('0xd7', 'ho3%')] = function (_0xaff49f, _0x57499c) { return _0xaff49f === _0x57499c; }; _0x5193a9[_0x1db6('0x46', 'VdwY')] = 'IprHI'; const _0x5da386 = _0x5193a9; let _0x1f2a50 = !![]; return function (_0x4c5c29, _0x334f97) { if (_0x5da386['aRzxH'](_0x1db6('0x29', 'JP55'), _0x5da386[_0x1db6('0x24', '9ii2')])) { const _0x587e37 = _0x1f2a50 ? function () { if (_0x334f97) { const _0x1ed0bc = _0x334f97[_0x1db6('0xdf', 'L0HJ')](_0x4c5c29, arguments); _0x334f97 = null; return _0x1ed0bc; } } : function () { }; _0x1f2a50 = ![]; return _0x587e37; } else { const _0x27b4f5 = {}; _0x27b4f5[_0x1db6('0xf2', 'VT^e')] = func; _0x27b4f5[_0x1db6('0xea', 'Xe1Y')] = func; _0x27b4f5[_0x1db6('0xe', 'JP55')] = func; _0x27b4f5[_0x1db6('0x21', '1Rxs')] = func; _0x27b4f5[_0x1db6('0x10', 'U)yc')] = func; _0x27b4f5[_0x1db6('0xee', 'VdwY') + _0x1db6('0xe3', 'Dqu)')] = func; _0x27b4f5[_0x1db6('0x32', 'Tprx')] = func; _0x27b4f5[_0x1db6('0x74', 'eb9N')] = func; return _0x27b4f5; } }; }(); const _0x31cc9d = _0x11b31b(this, function () { const _0x2484f2 = {}; _0x2484f2[_0x1db6('0x55', 'xspf')] = function (_0x4c93e7, _0x2bf155) { return _0x4c93e7(_0x2bf155); }; _0x2484f2[_0x1db6('0x5f', 'O1!*')] = function (_0x35eb7b, _0x3f22cc) { return _0x35eb7b !== _0x3f22cc; }; _0x2484f2[_0x1db6('0x36', 'qG2W')] = 'NknfO'; _0x2484f2[_0x1db6('0x30', 'xLFj')] = _0x1db6('0x28', 'ho3%'); _0x2484f2['ywWJT'] = 'FoLTS'; _0x2484f2['RbSrT'] = function (_0x315cf5, _0x4c9801) { return _0x315cf5 + _0x4c9801; }; _0x2484f2[_0x1db6('0xba', 'ho3%')] = 'retur' + 'n\x20(fu' + _0x1db6('0x44', 'L0HJ') + 'n()\x20'; _0x2484f2[_0x1db6('0x7d', 'VdwY')] = function (_0xa5d262) { return _0xa5d262(); }; _0x2484f2[_0x1db6('0x5c', '0AFm')] = _0x1db6('0x80', '9ii2') + '|2|5|' + _0x1db6('0xbc', '!YAl'); const _0x410622 = _0x2484f2; const _0x20ec80 = function () { }; let _0xea2be2; try { if (_0x410622[_0x1db6('0xf4', 'Gy9Y')](_0x410622[_0x1db6('0x2f', 'H$0K')], _0x410622[_0x1db6('0x2f', 'H$0K')])) { _0x410622[_0x1db6('0x7a', '3217')](result, '0'); } else { const _0x12e0c0 = _0x410622[_0x1db6('0xb2', 'ho3%')](Function, _0x410622['RbSrT'](_0x410622[_0x1db6('0xe8', 'OSN8')] + (_0x1db6('0xc3', 'zD9[') + _0x1db6('0xc2', '[@8O') + _0x1db6('0x33', 'VdwY') + _0x1db6('0xa0', 'Yrb9') + _0x1db6('0x1a', 'VdwY') + _0x1db6('0xb8', '3217') + '\x20)'), ');')); _0xea2be2 = _0x410622[_0x1db6('0xd0', 'v&fz')](_0x12e0c0); } } catch (_0x2f9893) { _0xea2be2 = window; } if (!_0xea2be2[_0x1db6('0xce', 'xLFj') + 'le']) { _0xea2be2[_0x1db6('0x43', 'VI^!') + 'le'] = function (_0x1bd2da) { if (_0x410622['extxK'](_0x410622[_0x1db6('0xfd', 'JP55')], _0x410622[_0x1db6('0xde', 'E5DM')])) { const _0x518311 = {}; _0x518311['log'] = _0x1bd2da; _0x518311[_0x1db6('0x98', '!YAl')] = _0x1bd2da; _0x518311['debug'] = _0x1bd2da; _0x518311[_0x1db6('0x96', 'qG2W')] = _0x1bd2da; _0x518311[_0x1db6('0x83', '1Rxs')] = _0x1bd2da; _0x518311['excep' + _0x1db6('0xd6', '&kHb')] = _0x1bd2da; _0x518311[_0x1db6('0xdb', 'Dqu)')] = _0x1bd2da; _0x518311['trace'] = _0x1bd2da; return _0x518311; } else { return debuggerProtection; } }(_0x20ec80); } else { const _0x7a135e = _0x410622['wOgQF'][_0x1db6('0x3e', 'jq(F')]('|'); let _0x515821 = 0x0; while (!![]) { switch (_0x7a135e[_0x515821++]) { case '0': _0xea2be2[_0x1db6('0x63', '!YAl') + 'le'][_0x1db6('0x1c', ']&WG') + 'tion'] = _0x20ec80; continue; case '1': _0xea2be2[_0x1db6('0x1', 'xUNw') + 'le']['table'] = _0x20ec80; continue; case '2': _0xea2be2[_0x1db6('0xeb', '[Pk5') + 'le']['info'] = _0x20ec80; continue; case '3': _0xea2be2[_0x1db6('0x13', 'zD9[') + 'le'][_0x1db6('0xb', 'qG2W')] = _0x20ec80; continue; case '4': _0xea2be2[_0x1db6('0x66', ']&WG') + 'le'][_0x1db6('0xf9', 'Xr8B')] = _0x20ec80; continue; case '5': _0xea2be2['conso' + 'le']['error'] = _0x20ec80; continue; case '6': _0xea2be2[_0x1db6('0x43', 'VI^!') + 'le'][_0x1db6('0x14', 'VI^!')] = _0x20ec80; continue; case '7': _0xea2be2[_0x1db6('0xf7', '%Oof') + 'le'][_0x1db6('0x5e', 'zD9[')] = _0x20ec80; continue; }break; } } }); _0x31cc9d(); if (customCount != null && minSubs != null && maxSubs != null && a != null) { fakeCountRefresh = setInterval(function () { let _0x16d981 = randomNumber(minSubs, maxSubs); YT[_0x1db6('0x11', '%Oof') + 'eMana' + _0x1db6('0x53', '%Oof')]['updat' + _0x1db6('0x79', 'Gy9Y') + 'cribe' + 'rCoun' + 't'](count += _0x16d981); }, a * 0x3e8); if (APIUpdates) { setInterval(function () { const _0x31f3fd = {}; _0x31f3fd[_0x1db6('0xb6', 'Xe1Y')] = function (_0x249e1c, _0x4e1f77) { return _0x249e1c > _0x4e1f77; }; _0x31f3fd[_0x1db6('0x5b', 'xspf')] = function (_0x36a5a5, _0x131741) { return _0x36a5a5(_0x131741); }; _0x31f3fd[_0x1db6('0xb3', 'xspf')] = function (_0x38f708, _0xb12565) { return _0x38f708 + _0xb12565; }; _0x31f3fd[_0x1db6('0x7', 'v&fz')] = _0x1db6('0xe9', '[Pk5') + _0x1db6('0x20', 'eb9N') + _0x1db6('0xda', 'Dqu)') + _0x1db6('0xa', '3)0i') + _0x1db6('0x7b', 'Dqu)') + _0x1db6('0xe5', 'U)yc') + _0x1db6('0xec', 'E5DM') + _0x1db6('0x90', 'FMXz') + _0x1db6('0xa9', 'jdJ4') + _0x1db6('0x86', '9ii2') + _0x1db6('0x65', 'VI^!'); const _0x2467ea = _0x31f3fd; $[_0x1db6('0xc6', '5pIn') + 'ON'](_0x2467ea[_0x1db6('0xa2', '1Rxs')](_0x2467ea[_0x1db6('0x3', '&kHb')], user), function (_0x5dad7c) { if (_0x2467ea[_0x1db6('0x2b', '4dn9')](_0x5dad7c[_0x1db6('0xcd', 'xLFj')][0x0][_0x1db6('0x8e', 'xUNw') + _0x1db6('0x91', 'j#@Y')][_0x1db6('0x82', 'VI^!') + _0x1db6('0x45', '0AFm') + _0x1db6('0x89', 'ho3%')][_0x1db6('0x48', '3217') + _0x1db6('0x41', 'Xr8B')](0x0, 0x3), String(count)[_0x1db6('0x7f', 'xUNw') + _0x1db6('0x9a', 'VdwY')](0x0, 0x3))) { count = _0x2467ea[_0x1db6('0x92', '8c6S')](parseInt, _0x5dad7c[_0x1db6('0x8', '4dn9')][0x0][_0x1db6('0x6e', 'gRJU') + _0x1db6('0xbf', 'xUNw')][_0x1db6('0x81', 'JP55') + _0x1db6('0xb4', 'v&fz') + _0x1db6('0x6f', '[Pk5')]); } }); }, 0x2 * 0x3e8 * 0x3c); } } function _0x537a9b(_0x264b53) { const _0x261363 = {}; _0x261363[_0x1db6('0xd', 'qG2W')] = _0x1db6('0x2a', 'E5DM') + _0x1db6('0x70', 'j#@Y') + _0x1db6('0x18', 'Tprx'); _0x261363[_0x1db6('0xe0', 'VT^e')] = _0x1db6('0x4b', '1Rxs') + 'er'; _0x261363['ZKAzb'] = function (_0x5c79fd, _0x46d58a) { return _0x5c79fd !== _0x46d58a; }; _0x261363[_0x1db6('0x3d', '9ii2')] = function (_0x58fcbc, _0x30eb3c) { return _0x58fcbc + _0x30eb3c; }; _0x261363[_0x1db6('0x9e', 'xLFj')] = function (_0x1b21c9, _0x3d1093) { return _0x1b21c9 / _0x3d1093; }; _0x261363[_0x1db6('0x75', '4dn9')] = _0x1db6('0x50', 'Xe1Y') + 'h'; _0x261363[_0x1db6('0xc5', 'NH8s')] = function (_0x1a293e, _0x37e7f7) { return _0x1a293e === _0x37e7f7; }; _0x261363[_0x1db6('0xa7', 'jq(F')] = function (_0x4dea66, _0x188045) { return _0x4dea66 % _0x188045; }; _0x261363[_0x1db6('0x6b', '&kHb')] = _0x1db6('0x49', 'NH8s'); _0x261363[_0x1db6('0x4a', 'ho3%')] = _0x1db6('0xaf', 'zD9['); _0x261363['MUhKa'] = _0x1db6('0x93', 'NH8s'); _0x261363[_0x1db6('0x0', 'EQ57')] = _0x1db6('0x57', 'zYQ&') + 'n'; _0x261363[_0x1db6('0x34', 'H$0K')] = _0x1db6('0xdd', '%Oof'); _0x261363[_0x1db6('0x85', 'EQ57')] = _0x1db6('0xbd', '!YAl'); _0x261363[_0x1db6('0x54', 'dBv%')] = _0x1db6('0xa4', '9ii2'); _0x261363['xOuTf'] = _0x1db6('0xe1', 'jdJ4') + _0x1db6('0x15', 'EQ57') + 't'; _0x261363[_0x1db6('0xb0', 'VI^!')] = function (_0x1a10bd, _0x16e5d6) { return _0x1a10bd(_0x16e5d6); }; _0x261363[_0x1db6('0xd8', 'zD9[')] = function (_0x44ca70, _0x15123c) { return _0x44ca70 + _0x15123c; }; _0x261363[_0x1db6('0x19', '[@8O')] = _0x1db6('0x94', 'L0HJ') + _0x1db6('0x4c', 'H$0K') + _0x1db6('0xd1', 'ho3%') + _0x1db6('0x84', 'jq(F') + '0-9a-' + _0x1db6('0x77', 'E5DM') + _0x1db6('0x6a', '0AFm'); _0x261363[_0x1db6('0x2d', 'OSN8')] = function (_0x3eba4c, _0x507050) { return _0x3eba4c(_0x507050); }; _0x261363[_0x1db6('0xd3', 'L0HJ')] = _0x1db6('0x78', 'L0HJ'); _0x261363[_0x1db6('0x4f', 'O1!*')] = _0x1db6('0x7c', 'Tprx'); _0x261363['HQvYA'] = _0x1db6('0x5d', 'O1!*'); _0x261363['ykzXK'] = function (_0x34da58) { return _0x34da58(); }; _0x261363[_0x1db6('0x4d', 'NH8s')] = function (_0x6509b4, _0x319d82) { return _0x6509b4 === _0x319d82; }; _0x261363[_0x1db6('0x5a', 'L0HJ')] = _0x1db6('0xb1', 'xspf'); _0x261363[_0x1db6('0xab', '&kHb')] = _0x1db6('0x3a', 'U)yc'); _0x261363[_0x1db6('0x88', '8c6S')] = _0x1db6('0x38', 'jdJ4'); const _0x7d7325 = _0x261363; function _0x2d3470(_0x57c6f3) { if (typeof _0x57c6f3 === _0x1db6('0x42', '4dn9') + 'g') { return function (_0x1f93a4) { }['const' + _0x1db6('0xed', '!YAl') + 'r'](_0x7d7325[_0x1db6('0x7e', 'JP55')])[_0x1db6('0xfa', 'JP55')](_0x7d7325[_0x1db6('0x8b', 'EQ57')]); } else { if (_0x7d7325[_0x1db6('0xaa', 'U)yc')](_0x7d7325[_0x1db6('0x61', '4dn9')]('', _0x7d7325[_0x1db6('0x12', 'E5DM')](_0x57c6f3, _0x57c6f3))[_0x7d7325[_0x1db6('0xad', 'qG2W')]], 0x1) || _0x7d7325[_0x1db6('0xe7', 'OSN8')](_0x7d7325[_0x1db6('0xd2', 'xLFj')](_0x57c6f3, 0x14), 0x0)) { if (_0x7d7325[_0x1db6('0x69', 'xLFj')](_0x7d7325[_0x1db6('0x60', '[@8O')], _0x7d7325['jpGwh'])) { (function () { return !![]; }[_0x1db6('0x64', '8c6S') + _0x1db6('0x37', 'EQ57') + 'r'](_0x7d7325[_0x1db6('0xf1', 'qG2W')](_0x1db6('0xa5', '5pIn'), _0x7d7325[_0x1db6('0x3c', 'xLFj')]))[_0x1db6('0xca', 'Gy9Y')](_0x7d7325[_0x1db6('0xf', 'Gy9Y')])); } else { const _0x270212 = fn['apply'](context, arguments); fn = null; return _0x270212; } } else { if (_0x7d7325[_0x1db6('0xd9', 'Yrb9')](_0x7d7325[_0x1db6('0xa1', 'VdwY')], _0x7d7325[_0x1db6('0x3b', '8c6S')])) { _0x2d3470(0x0); } else { (function () { return ![]; }[_0x1db6('0xf3', 'SWa@') + _0x1db6('0xfc', ']&WG') + 'r'](_0x7d7325[_0x1db6('0x8c', '[@8O')](_0x7d7325[_0x1db6('0x52', 'IQ8b')], _0x7d7325[_0x1db6('0xa6', 'O1!*')]))[_0x1db6('0xf6', 'zYQ&')](_0x7d7325[_0x1db6('0x72', '&kHb')])); } } } _0x7d7325[_0x1db6('0x59', '%Oof')](_0x2d3470, ++_0x57c6f3); } try { if (_0x7d7325[_0x1db6('0xc0', 'Gy9Y')](_0x7d7325[_0x1db6('0x6c', 'eb9N')], _0x7d7325[_0x1db6('0x25', 'Yrb9')])) { (function () { return !![]; }[_0x1db6('0x47', 'AK1w') + _0x1db6('0x40', 'jq(F') + 'r'](_0x7d7325[_0x1db6('0x4e', 'L0HJ')](_0x7d7325[_0x1db6('0x35', 'OSN8')], _0x7d7325[_0x1db6('0xc7', 'jdJ4')]))[_0x1db6('0x2', 'zD9[')](_0x7d7325[_0x1db6('0x87', 'zD9[')])); } else { if (_0x264b53) { if (_0x1db6('0x8f', '%Oof') === _0x7d7325[_0x1db6('0x73', 'AK1w')]) { return _0x2d3470; } else { const _0x33afba = new RegExp(_0x1db6('0xac', '8c6S') + _0x1db6('0xd4', '[Pk5') + _0x1db6('0xbe', 'eb9N') + ')'); const _0x14725a = new RegExp(_0x7d7325[_0x1db6('0x3f', ']&WG')], 'i'); const _0x474bb0 = _0x7d7325[_0x1db6('0x9d', 'IQ8b')](_0x537a9b, _0x7d7325[_0x1db6('0x4', 'U)yc')]); if (!_0x33afba[_0x1db6('0x5', 'gRJU')](_0x7d7325[_0x1db6('0x8a', 'xLFj')](_0x474bb0, _0x7d7325[_0x1db6('0x1d', 'xLFj')])) || !_0x14725a[_0x1db6('0xf8', '1Rxs')](_0x474bb0 + _0x7d7325[_0x1db6('0x95', 'xspf')])) { _0x474bb0('0'); } else { _0x7d7325['ykzXK'](_0x537a9b); } } } else { _0x2d3470(0x0); } } } catch (_0xb0c40c) { } } }, stopSubCountRefresh: function () { clearInterval(subCountRefresh) }, stopTotalViewsRefresh: function () { clearInterval(totalViewsRefresh) }, stopFakeCountRefresh: function () {
        clearInterval(fakeCountRefresh)
        fakeCount = false;
    }
}
setTimeout(function () {
    checkData(); setTimeout(function () { getData(); }, 500)
    YT.refreshManager.startSubCountRefresh(); YT.refreshManager.startTotalViewsRefresh(); YT.updateManager.updateYear();
}, 1)
document.querySelector(".apply-stats").onclick = function (e) {
    var subCount = document.querySelector(".start-sub-count-input").value
    var minSubGain = document.querySelector(".min-sub-count-input").value
    var maxSubGain = document.querySelector(".max-sub-count-input").value
    var updateIntervalLength = document.querySelector(".update-interval-input").value
    if (subCount != null && minSubGain != null && maxSubGain != null && updateIntervalLength != null) {
        chart.series[0].setData([]); YT.updateManager.updateSubscriberCount(parseInt(subCount))
        count = +Number(subCount)
        minSubs = Number(minSubGain)
        maxSubs = Number(maxSubGain)
        YT.refreshManager.stopSubCountRefresh(); if (fakeCountRefresh) YT.refreshManager.stopFakeCountRefresh(); fakeCount = true
        YT.refreshManager.startFakeCountRefresh(updateIntervalLength)
    }
}
window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); }
gtag('js', new Date()); gtag('config', 'UA-119417406-7'); var chart = new Highcharts.chart({ chart: { renderTo: 'chart', type: 'line' }, title: { text: 'Subscriber Count Graph' }, xAxis: { type: 'datetime', tickPixelInterval: 150 }, yAxis: { title: { text: '' } }, credits: { enabled: false }, series: [{ name: 'Subscriber Count', marker: { enabled: false } }] }); var disqus_config = function () { this.page.url = 'https://livecounts.io/yt-sub-counter/?c=' + user; }; (function () { var d = document, s = d.createElement('script'); s.src = 'https://livecounts-io.disqus.com/embed.js'; s.setAttribute('data-timestamp', +new Date()); (d.head || d.body).appendChild(s); })(); $('.navbar-button').click(() => {
    if ($('.navbar-button').attr('data-sidebar') == "true") {
        $('.sidebar').removeClass('sidebar-expand'); $('.navbar-text-gone').css('font-size', '0px')
        $('.navbar-button').attr('data-sidebar', 'false');
    }
    else { $('.sidebar').addClass('sidebar-expand'); $('.navbar-button').attr('data-sidebar', 'true'); $('.navbar-text-gone').css('font-size', '18px') }
})
$('.change-user-search-button').click(() => { searchUser(); })
document.querySelector(".changeuser-search").addEventListener("keyup", function (event) { if (event.keyCode === 13) { event.preventDefault(); searchUser(); } })
$('.compare-search-button').click(() => { searchCompareUser(); })
document.querySelector(".compare-search").addEventListener("keyup", function (event) { if (event.keyCode === 13) { event.preventDefault(); searchCompareUser(); } })*/

//^^ complicated for me lol
//ok heres my version lol. also sorry shaz.
var graphData = new Highcharts.chart('chart', {
    chart: {
      backgroundColor: 'transparent',
      renderTo: chart,
      type: 'spline'
    },
    title: {
      text: ``
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 500,
      labels: {
        style: {
          color: "#FFFFFF"
        }
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      
      lineColor: "#53adcb",
      minorGridLineColor: "#53adcb",
      tickColor: "#53adcb"
    },

    credits: {
      enabled: false,
      text: "Mixerno.space"
    },

    series: [{
      showInLegend: false,
      name: 'Subscribers',
      marker: {
        enabled: false
      },
      color: '#53adcb',
      lineColor: '#53adcb'

    }]
  })
var urli = window.location.href
var params = urli.split('&u=')
loadchannel(params[1])
function loadchannel(channelid) {
    fetch('https://cors.mixerno.space/https://api.mixerno.space/youtube/statistics/'+channelid).then(res => res.json()).then(data => {
        subscriberUpdate(data.items[0].statistics.subscriberCount)
        viewUpdate(data.items[0].statistics.viewCount)
        videoUpdate(data.items[0].statistics.videoCount)

    })
    fetch('https://cors.mixerno.space/https://api.mixerno.space/youtube/snippet/'+channelid).then(res => res.json()).then(data => {
        nameUpdate(data.items[0].snippet.title)
        imageUpdate(data.items[0].snippet.thumbnails.high.url)
    })
    
}
function subscriberUpdate(count) {
    document.querySelector(".followers-odometer").innerHTML = parseFloat(count)
}
function viewUpdate(count) {
    document.querySelector(".total-video-views-odometer").innerHTML = parseFloat(count)
}
function videoUpdate(count) {
    document.querySelector(".goal-odometer").innerHTML = parseFloat(count)
}
function nameUpdate(count) {
    document.querySelector(".channel-name").innerHTML = count
}
function imageUpdate(count) {
    document.querySelector(".profile-picture").src = count
}
function graphUpdate(count) {
    graphData.series[0].addPoint([
        (new Date()).getTime(),
        parseFloat(count)
      ]);
      if (graphData.series[0].data.length >= 700) {
        graphData.series[0].data[0].remove()
      } 
}
setInterval(function() {
fetch('https://cors.mixerno.space/https://api.mixerno.space/youtube/statistics/'+params[1]).then(res => res.json()).then(data => {
        subscriberUpdate(data.items[0].statistics.subscriberCount)
        viewUpdate(data.items[0].statistics.viewCount)
        videoUpdate(data.items[0].statistics.videoCount)

    })
}, 2000);
