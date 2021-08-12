import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Account from './component/Account';
import {wallet} from '../middlewares/wallet';
import { browser } from 'webextension-polyfill-ts';

interface iState {
  showAccount: boolean;
  msg:string;
  domain: string;
}

type CommentDetail = {
  message:string;
  owner: string;
  name: string;
}

class Main extends React.Component<{}, iState> {
  constructor(state:iState) {
    super(state);
    this.state = {
      showAccount: false,
      msg:null,
      domain: null
    }
  }


  loadIpfs(cid):Promise<string> {
    return new Promise((resolve,reject) => {
      chrome.runtime.sendMessage(JSON.stringify({type:'load', cid}), async(data) => {
        resolve(data);
      });
    });
  }

  saveIpfs(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(JSON.stringify({type:'save', data:message}), async(cid) => {
        resolve(cid);
      });
    })
  }

  async componentDidMount() {
    await wallet.connect();
    await this.load();
  }

  async load() {
    const domain = await this.getDomain();
    if(domain && domain != "" && wallet.account) {
      this.setState({domain});
      const count = await wallet.commentStore.callMethod('getCommentCount', {_domain:domain});
      const comments:CommentDetail[] = [];
      for(let i=0;i<count;++i) {
        const key = await wallet.commentStore.callMethod('getComment', {_domain:domain, _index:i});
        const message = await this.loadIpfs(key);
        const owner = await wallet.commentStore.callMethod('getCommentOwner', {_domain:domain, _key:key});
        const name = await wallet.commentStore.callMethod('userName', {address: owner});
        comments.push({message, owner, name});
      }

      const table = document.getElementById('comments') as HTMLTableElement;
      table.innerHTML = "";
      for (const comment of comments) {
        const message = `${comment.message} (${comment.name})(${comment.owner})`;
        const cell = table.insertRow(0).insertCell(0);
        cell.style.borderWidth = '1px';
        cell.style.borderColor = '#000000';
        cell.style.borderStyle = 'solid';
        cell.innerHTML = message;
      }
    }
  }

  async getDomain():Promise<string> {
    const tabs = await browser.tabs.query({active: true, lastFocusedWindow: true});
    return (tabs && tabs.length > 0)? tabs[0].url: "";
    /*
    if(tabs && tabs.length > 0) {
      const url = tabs[0].url;
      const structs = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      return (structs && structs.length >= 2)? structs[1] : "";
    }
    return "";
    */
  }

  async sendMessage() {
    const message = (document.getElementById('message') as HTMLInputElement).value;
    const cid = await this.saveIpfs(message);
    const domain = await this.getDomain();
    if(domain && domain != "" && wallet.account) {
      await wallet.commentStore.sendMethod('sendMessage', {waitReceipt:true}, {_domain:domain, _key:cid});
      await this.load();
      this.setState({msg: "Send message"});
    } else {
      this.setState({msg: "This site is not supported"});
    }
  }

  render() {
    return (
      <div id="root">
        {this.state.showAccount ? <Account onClose={() => this.setState({showAccount:false})}/> : null}
        <button onClick={() => this.setState({showAccount:true})}>Account</button>
        <br/>
        <br/>Current viewing:<b>{this.state.domain}</b><br/>
        <br/>
        <table id="comments" >
        </table>
        <br/><br/>
        <textarea id="message"></textarea>
        <br/>
        <br/><b>add comment</b><br/>
        <button onClick={() => {this.sendMessage()}} >送信</button>
        <button onClick={() => {this.load()}} >更新</button>
        <br/>
        <div>{this.state.msg}</div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);