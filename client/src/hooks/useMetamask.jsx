import React from 'react';

const useMetamask = () => {

  const handleConnect = () => {
    window.ethereum.enable();
  };
  const switchNetworkHandler = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      });
    } catch (error) {
      // if (error.code === 4902) {
      //   try {
      //     await web3.currentProvider.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [
      //         {
      //           chainId: `0x${Number(chainId).toString(16)}`,
      //           chainName: 'Rinkeby',
      //           rpcUrls: ['https://rpc-mumbai.matic.today'],
      //           nativeCurrency: {
      //             name: 'Matic',
      //             symbol: 'Matic',
      //             decimals: 18,
      //           },
      //           blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
      //         },
      //       ],
      //     });
      //   } catch (error) {
      //     alert(error.message);
      //   }
    }
  };

  return { handleConnect,switchNetworkHandler };
};

export default useMetamask;
