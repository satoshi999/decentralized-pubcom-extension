import {ContractBase, Account, account} from '../eth-lib/src';
import {commentStoreAbi} from '../config/abi';
import { browser } from 'webextension-polyfill-ts';

export type Setting = {
  endpoint:string;
  contractAddress:string;
}

class Wallet {
  private _commentStore;
  private _account:Account;
  private _setting:Setting;

  constructor() {}

  public get commentStore() {
    return this._commentStore;
  }

  public get account() {
    return this._account;
  }

  public get setting() {
    return this._setting;
  }

  public get isConnected() {
    return (this._commentStore)
  }

  public async connect(createAccount:boolean = false, endpoint?:string, contractAddress?:string, privateKey?:string) {
    if(createAccount) {
      this._account = account.create();
      await browser.storage.local.set({account: this._account});
    } else if(privateKey) {
      this._account = account.privateKeyToAccount(privateKey) as Account;
      await browser.storage.local.set({account: account.privateKeyToAccount(privateKey)});
    }

    if(endpoint && contractAddress) {
      await browser.storage.local.set({setting: {endpoint, contractAddress}});
    }

    this._account = (await browser.storage.local.get('account')).account as Account;
    this._setting = (await browser.storage.local.get('setting')).account as Setting;

    if(this._account && this._account.privateKey && this._setting.endpoint && this._setting.contractAddress) {
      this._commentStore = new ContractBase(this._account.privateKey, this._setting.contractAddress, commentStoreAbi, this._setting.endpoint);
    }
  }
}

export const wallet = new Wallet();