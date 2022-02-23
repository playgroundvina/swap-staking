import React, { createContext, useState } from 'react';
import ConvertToken from './contracts/ConvertToken.json';
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

  React.useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = await getWeb3();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);
        const [selectedAccount] = await web3.eth.getAccounts();
        setAccount(web3.utils.toChecksumAddress(selectedAccount));
        window.ethereum.on('accountsChanged', (accounts) => {
          setHasAccountChanged(true);
          if (!accounts[0]) {
            setHasWalletAddress(false);
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
        networkId,
        receiveList,
        swapList,
        tokenReceive,
        tokenSwap,
        onTokenSwapChoose,
        onTokenReceiveChoose,
        web3,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
