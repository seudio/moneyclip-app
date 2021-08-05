import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { magic } from "../magic";
import { ethers } from 'ethers';
import Loading from "./Loading";

export default function Profile() {
  const [userMetadata, setUserMetadata] = useState();
  const [walletData, setWalletData] = useState();
  const history = useHistory();

  const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.

    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(data => {
          console.log(data);
          setUserMetadata(data);

          
        });
      } else {
        // If no user is logged in, redirect to `/login`
        history.push("/login");
      }
    });
    
  }, []);

  const handleMint = async () => {
    const signer = provider.getSigner();
    const abi = JSON.parse(`[{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"receiver","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"inputs":[{"name":"_baseTokenURI","type":"string"}],"outputs":[],"stateMutability":"nonpayable","type":"constructor"},{"gas":1203,"inputs":[{"name":"_interfaceID","type":"bytes32"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"gas":1430,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"gas":1375,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"gas":2302,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"gas":1638,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"gas":316828,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"gas":40809,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"gas":38122,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"gas":76362,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"gas":87658,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"gas":6872,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"name":"","type":"string"}],"stateMutability":"view","type":"function"},{"gas":177632,"inputs":[{"name":"_baseTokenURI","type":"string"}],"name":"setBaseTokenURI","outputs":[],"stateMutability":"nonpayable","type":"function"}]`);

    console.log('mint');
    const contract = new ethers.Contract('0xd23e9319447b04ad8a00c39bfd10513302264a35', abi, signer);

    let tx = await contract.mint(signer.getAddress(), 2);
    console.log(tx);
    const receipt = await tx.wait();

    console.log(receipt);
  };

  const getBalance = async () => {
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = ethers.utils.formatEther(await provider.getBalance(userAddress));
    
    const data = {
      network: network.name,
      balance: balance
    };
    setWalletData(data);
    
    console.log(magic);

    return balance;
  };

  useEffect(() => {
    if (userMetadata) {
      
      const balance = getBalance();

    }
  }, [userMetadata]);

  /**
   * Perform logout action via Magic.
   */
  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      history.push("/login");
    })
  }, [history]);

  return userMetadata ? <div className="container">
    <h1>Current user: {userMetadata.email}</h1>
    <h2>Wallet address: {userMetadata.publicAddress}</h2>
    {walletData && <h2>Network: {walletData.network}</h2>}
    {walletData && <h2>Balance: {walletData.balance} ETH</h2>}
    <button onClick={handleMint}>Mint!</button>
    <button onClick={logout}>Logout</button>
  </div>: <Loading />;
}

