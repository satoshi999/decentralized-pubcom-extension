# decentralized-pubcom-extension
decentralized-pubcom-extension

<img width="1120" alt="スクリーンショット 2021-08-12 15 14 17" src="https://user-images.githubusercontent.com/18362018/129147578-10982384-b93e-4637-ae8e-6c9671ff4282.png">

## 概要
IPFS,Ethereumを利用した、非中央集権なWebサイトのコメントアプリケーションです。  
Ethereumのアドレスを持っていれば、誰でも中央管理される事のないメッセージを残す事が出来ます。  
現在ブラウジングしているサイトアドレスに紐づいてメッセージは管理される為、Webサイトに対するコメントとして残す事が出来ます。  
コメントは第三者が削除する事は出来ず、編集も出来ません

## インストール
chrome-extensionの拡張機能読み込みを使って、buildフォルダを読み込んでください  
<img width="348" alt="スクリーンショット 2021-08-12 15 19 15" src="https://user-images.githubusercontent.com/18362018/129147533-3e041a42-a414-4981-ab98-ef8d5e2f8952.png">

## セットアップ
データの一部はEthereumのRinkebyネットに保存されます。RinkebyのEthを保有したaddressが必要です。  
privateKey=addressのprivate key  
endpoint=Ethereum nodeのendpointを指定  
contract address=アプリケーション用に用意されたcontract address(最新のアドレスは0x5914c64cF2B048739728826D29aA8bf07BD1bB36)
<img width="634" alt="スクリーンショット 2021-08-12 15 15 04" src="https://user-images.githubusercontent.com/18362018/129147882-fabe56a7-020d-4aba-9c9c-a150c2b02f1d.png">


#### ** 現在一部のコードはオミットされています。ソースコードからbuildする事はできません **
