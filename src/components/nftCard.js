import React from 'react';
import '../styles/App.css';
import opensealogo from '../assets/opensea.svg'
const NftCard = ({opensea}) => {

    return(
    <div>
      <p><a href={opensea} className="collection-link"><img height="20px" alt="opensea-logo" src={opensealogo}/> View Collection </a></p>
      <p className="sub-text-body">You can buy the first<a className="header-small gradient-text-count">&nbsp;#000</a> minted Alien here 👇 </p>
        <nft-card
          contractAddress="0xce15bbc069b34815163cc217ba0c32a1802e36f9"
          tokenId="3"
          network="rinkeby"
        ></nft-card>
      </div>
    )
};


export default NftCard;