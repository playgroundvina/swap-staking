import React, { createContext, useState, useEffect } from 'react';
import getWeb3 from './getWeb3';
import tokenList from './config/tokens.json';

const TokenToSwap = Object.keys(tokenList).map((key) => ({
  name: tokenList[key].name,
  address: key,
}));

const TokenToReceive = (address) =>
  tokenList[address].listSwap.map((token) => token);

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [swapList, setSwapList] = useState(TokenToSwap);
  const [receiveList, setReceiveList] = useState(null);
  const [tokenSwap, setTokenSwap] = useState(null);
  const [tokenReceive, setTokenReceive] = useState(null);
  const [accountBalance, setBalance] = useState(0);
  const [hasWalletAddress, setHasWalletAddress] = useState(false);
  const [hasAccountChanged, setHasAccountChanged] = useState(false);
  const [history, setHistory] = useState(null);

  const onTokenSwapChoose = (address) => {
    const newTokenSwap = swapList.find(
      (element) => element.address === address,
    );
    const newReceiveList = TokenToReceive(address);
    setReceiveList(newReceiveList);
    setTokenSwap(newTokenSwap);
    setTokenReceive(newReceiveList[0]);
  };

  const onTokenReceiveChoose = (address) => {
    const newToken = receiveList.find((element) => element.address === address);
    setTokenReceive(newToken);
  };

  const handleConnect = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      return;
    }
    window.ethereum.enable();
  };

  const handleLogout = () => {
    setAccount(null);
    setTokenSwap(null);
    setTokenReceive(null);
    setReceiveList(null);
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
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = await getWeb3();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();
        if (accounts) {
          setAccount(accounts[0]);
        }
        setNetworkId(networkId);
        window.ethereum.on('accountsChanged', (accounts) => {
          setHasAccountChanged(true);
          if (!accounts[0]) {
            setHasWalletAddress(false);
            setAccount(null);
            setTokenSwap(null);
            setTokenReceive(null);
            setReceiveList(null);
          } else {
            setHasWalletAddress(true);

            setAccount(accounts[0]);
          }
        });
        window.ethereum.on('chainChanged', (_chainId) =>
          window.location.reload(),
        );
      }
    };

    init();
  }, []);

  return (
    <AppContext.Provider
      value={{
        account,
        handleConnect,
        handleLogout,
        switchNetworkHandler,
        networkId,
        receiveList,
        swapList,
        tokenReceive,
        tokenSwap,
        onTokenSwapChoose,
        onTokenReceiveChoose,
        web3,
        hasAccountChanged
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
