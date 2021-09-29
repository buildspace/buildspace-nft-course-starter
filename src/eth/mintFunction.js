import { ethers } from 'ethers';
import DopeNft from "../utils/dopeNft.json";

export const triggerContractToMint = async () => {
    const CONTRACT_ADDRESS = "0xe70ae93D3E3DA6745343b9486A4576cd88BA3ff9";
    console.log(CONTRACT_ADDRESS);
    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, DopeNft.abi, signer);

            console.log("Going to pop wallet now to pay gas...");
            let nftTranx = await connectedContract.constructDopeNft();

            console.log("Mining...please wait.")
            await nftTranx.wait();
            
            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTranx.hash}`);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
            } catch (error) {
          console.log(error)
        }
    };