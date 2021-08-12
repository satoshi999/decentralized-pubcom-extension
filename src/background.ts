const IPFS = require('ipfs');

console.log = (...msgs) => {
  let out = "";
  msgs.forEach((msg, i) => {
    if(i > 0) out += ',';
    out += JSON.stringify(msg);
  });
  console.trace(`${new Date().toLocaleString()}:${out}`);
}

let ipfs = null;

const REPO_NAME = "MyIPFS";
const initNode = async() => {
  console.log("init node..." + REPO_NAME);
  ipfs = await IPFS.create({
    repo: REPO_NAME
  });
}

(async() => {
  await initNode();
})();

const listRef = async() => {
  const refs = ipfs.refs.local();
  const cids = [];
  for await (const ref of refs) {
    cids.push(ref.ref);
  }
  return cids;
}

const listPin = async() => {
  const pins = ipfs.pin.ls();
  const cids = [];
  for await (const pin of pins) {
    cids.push(pin.cid.toString());
  }
  return cids;
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log("from content script:" + message);
  (async() => {
    if(!ipfs) await initNode();
    try {
      const json = JSON.parse(message);
      console.log("Parsed:" + json);
      switch(json.type) {
        case 'save':
          const res = await ipfs.add(json.data);
          console.log("ipds added:" + res.cid.toString());
          callback(res.cid.toString());
          break;
        case 'load':
          const stream = ipfs.cat(json.cid);
          let data = "";
          for await (const chunk of stream) {
            data += chunk.toString()
          }
          console.log("loaded:" + data);
          callback(data);
          break;
        case 'listPin':
          callback(await listPin());
          break;
        case 'listRef':
          callback(await listRef());
        case 'publish':
          const name = (await ipfs.name.publish(json.cid)).name;
          callback(name);
          break;    
        default:
          break;
      }
    } catch (e) {}
  })();
  return true;
});