import * as React from 'react';
import {wallet} from '../../middlewares/wallet';

interface iProps {
  onClose: () => void;
}

interface iState {
  msg: string;
  address: string;
  privateKey: string;
  name: string;
}

class Container extends React.Component<iProps, iState> {
  constructor(props: iProps, state:iState) {
    super(props, state);
    this.state = {
      msg: null,
      address: null,
      privateKey: null,
      name: null
    } 
  }
  async componentDidMount() {
    await wallet.connect();
    await this.load();
  }
  async load() {
    const {address, privateKey} = wallet.account;
    const {endpoint, contractAddress} = wallet.setting;

    if(address && privateKey && endpoint && contractAddress) {
      const name = await wallet.commentStore.callMethod('userName', {address});

      (document.getElementById('userName') as HTMLInputElement).value = name;
      (document.getElementById('privateKey') as HTMLInputElement).value = privateKey;
      (document.getElementById('endpoint') as HTMLInputElement).value = endpoint;
      (document.getElementById('contractAddress') as HTMLInputElement).value = contractAddress;

      this.setState({address});
    }
  }

  async save() {
    const textPrivKey = (document.getElementById('privateKey') as HTMLInputElement).value;
    const endpoint = (document.getElementById('endpoint') as HTMLInputElement).value;
    const contractAddress = (document.getElementById('contractAddress') as HTMLInputElement).value;
    const name = (document.getElementById('userName') as HTMLInputElement).value;
    
    if(textPrivKey && textPrivKey.length > 0) {
      await wallet.connect(false, endpoint, contractAddress, textPrivKey)
    }

    await wallet.commentStore.sendMethod('setUserName', {waitReceipt:true}, {_name: name});

    this.load();

    this.setState({msg: 'Saved setting'});
  }
  render() {
    return (
      <div className="dialogue">
          <button onClick={()=> this.props.onClose()}>Close</button><br/>
          <br/>
          <b>-- account --</b>
          <div>address:{this.state.address}</div>
          <div>privateKey:<input type="text" id="privateKey" style={{width:"400px"}}/></div>
          <br/>
          <b>-- your profile --</b>
          <div>name:<input type="text" id="userName"/></div>
          <br/>
          <b>-- ethereum setting --</b>
          <div>endpoint:<input type="text" id="endpoint" style={{width:"400px"}} /></div>
          <div>contract address:<input type="text" id="contractAddress" style={{width:"400px"}}/></div>
          <br/>
          <button onClick={()=> this.save()}>Save</button>
          <div>{this.state.msg}</div>
      </div>
    )
  } 
}

export default Container;