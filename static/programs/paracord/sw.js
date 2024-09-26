if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let a={};const o=s=>i(s,r),c={module:{uri:r},exports:a,require:o};e[r]=Promise.all(n.map((s=>c[s]||o(s)))).then((s=>(l(...s),a)))}}define(["./workbox-56a10583"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/About-44b866a7.js",revision:null},{url:"assets/Collapsible-beba5fc1.js",revision:null},{url:"assets/downloader-2790525b.js",revision:null},{url:"assets/Enterprise-459192c9.js",revision:null},{url:"assets/GenericHeader-b6f3410d.js",revision:null},{url:"assets/Home-ed117472.js",revision:null},{url:"assets/index-8e29a41c.js",revision:null},{url:"assets/index-b05acfd9.css",revision:null},{url:"assets/InfiniteScroll-8d0fe7e7.js",revision:null},{url:"assets/PasswordModal-050a6a96.js",revision:null},{url:"assets/PasswordModal-99c276e9.css",revision:null},{url:"assets/roomConfig-0e0bf8eb.js",revision:null},{url:"assets/RoomCreator-05a566d3.js",revision:null},{url:"assets/sandbox-70eac9fd.js",revision:null},{url:"assets/util-10c81017.js",revision:null},{url:"index.html",revision:"a3eb639cbdcc292857ea6248268c9809"},{url:"registerSW.js",revision:"fb14c435ef2b9d0c4565293d03c1f5b2"},{url:"logo.svg",revision:"40c5cdbd3954b7fae4e15a0d55349c1a"},{url:"iconMasks/maskable_icon_x128.png",revision:"cc20d8f3f19bfd06fa1975951f0e751d"},{url:"iconMasks/maskable_icon_x192.png",revision:"745f0ffdea4ed6008d9e8bb597001995"},{url:"iconMasks/maskable_icon_x384.png",revision:"343c7af6864da040ebe8c6570cf5da09"},{url:"iconMasks/maskable_icon_x48.png",revision:"de3ede3f62fd89821c6913b47c29c29e"},{url:"iconMasks/maskable_icon_x512.png",revision:"eba9b69c13d53079f968022932351f0a"},{url:"iconMasks/maskable_icon_x72.png",revision:"5fd821fabbe228a58a66c7fe6fdaa2a7"},{url:"iconMasks/maskable_icon_x96.png",revision:"a70fc4a4dbb48b10227fce59f132d6ac"},{url:"manifest.webmanifest",revision:"75aace56efbb4f5270afee0a60a0fe48"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
const WRITE = 0;
const PULL = 0;
const ERROR = 1;
const ABORT = 1;
const CLOSE = 2;
const PING = 3;
class MessagePortSource {
  controller;
  constructor(port) {
    this.port = port;
    this.port.onmessage = (evt) => this.onMessage(evt.data);
  }
  start(controller) {
    this.controller = controller;
  }
  pull() {
    this.port.postMessage({ type: PULL });
  }
  cancel(reason) {
    this.port.postMessage({ type: ERROR, reason: reason.message });
    this.port.close();
  }
  onMessage(message) {
    if (message.type === WRITE) {
      this.controller.enqueue(message.chunk);
    }
    if (message.type === ABORT) {
      this.controller.error(message.reason);
      this.port.close();
    }
    if (message.type === CLOSE) {
      this.controller.close();
      this.port.close();
    }
  }
}
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
const map = new Map();
globalThis.addEventListener("message", (evt) => {
  const data = evt.data;
  if (data.url && data.readablePort) {
    data.rs = new ReadableStream(
      new MessagePortSource(evt.data.readablePort),
      new CountQueuingStrategy({ highWaterMark: 4 }),
    );
    map.set(data.url, data);
  }
});
globalThis.addEventListener("fetch", (evt) => {
  const url = evt.request.url;
  const data = map.get(url);
  if (!data) {
    return null;
  }
  map.delete(url);
  evt.respondWith(new Response(data.rs, { headers: data.headers }));
});
