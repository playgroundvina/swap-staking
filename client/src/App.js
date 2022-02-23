import React, { Component, useContext, useState, useEffect } from 'react';
import getWeb3 from './getWeb3';
import Admin from './components/Admin';
import {
  RenderConnectButton,
  Flex,
  StyledButton,
} from './components/TokenSwap';
import StakingSwap from './components/StakingSwap';
import './App.css';
import GlobalStyled from './GlobalStyled';
import { Routes, Route, Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import Staking from './components/Staking';
import styled from 'styled-components';
import useMetamask from './hooks/useMetamask';

const Navbar = styled.div`
  height: 80px;
  position: sticky;
  top: 0;
  width: 100%;
  padding: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled(Link)`
  text-transform: uppercase;
`;

const Layout = styled.div`
  background: rgb(247, 248, 250);
`;

const NetWorkButton = styled(StyledButton)`
  background: orange;
  text-transform: uppercase;
  font-size: 12px;
 
`;
function App() {
  const { account, networkId } = useContext(AppContext);
  const { switchNetworkHandler } = useMetamask();

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       // Get network provider and web3 instance.
  //       const web3 = await getWeb3();
  //       //shoudl check wether metamsk is connected to the desired network or not, if not ask the user to sitch networks

  //       // Use web3 to get the user's accounts.
  //       const metaMaskAccounts = await web3.eth.getAccounts();

  //       // Get the contract instance.
  //       const networkId = await web3.eth.net.getId();

  //       const deployedNetworkTokenSwap = TokenSwap.networks[networkId];
  //       const deployedNetworkTokenABC = TokenABC.networks[networkId];
  //       const deployedNetworkTokenXYZ = TokenXYZ.networks[networkId];

  //       const instance = new web3.eth.Contract(
  //         TokenSwap.abi,
  //         deployedNetworkTokenSwap && deployedNetworkTokenSwap.address,
  //       );

  //       const instance2 = new web3.eth.Contract(
  //         TokenABC.abi,
  //         deployedNetworkTokenABC && deployedNetworkTokenABC.address,
  //       );
  //       const instance3 = new web3.eth.Contract(
  //         TokenXYZ.abi,
  //         deployedNetworkTokenXYZ && deployedNetworkTokenXYZ.address,
  //       );

  //       const arr = [instance, instance2, instance3];

  //       // Set web3, accounts, and contract to the state, and then proceed with an
  //       // example of interacting with the contract's methods.

  //       setweb3(web3);
  //       setDeployedNetwork(deployedNetwork);
  //       setaccounts(metaMaskAccounts);
  //       setNetworId(networkId);
  //       setContracts(arr);
  //     } catch (error) {
  //       // Catch any errors for any of the above operations.
  //       alert(
  //         `Failed to load web3, accounts, or contract. Check console for details.`,
  //       );
  //       console.error(error);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const load = async () => {
  //     window.ethereum.on("accountsChanged", async (accounts) => {
  //       console.log("accountsChanges", accounts);
  //       setaccounts(accounts);
  //       window.location.reload();
  //     });
  //   };
  //   if (web3 && accounts) {
  //     load();
  //   }
  // }, [web3, contracts, accounts]);

  // if (!web3) {
  //   return(
  //     <React.Fragment>
  //       <div class="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
  //         <div class="spinner-grow" style={{width: "6rem", height: "6rem"}} role="status">
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   )

  // }

  // if (web3 && accounts && contracts) {
  //   if (accounts[0] === "0x1088725f456fFb14635db800cDc756e0425E638Fa") {
  //     return (
  //       <Admin Web3={web3} Contracts={contracts} Accounts={accounts}></Admin>
  //     );
  //   } else {
  //     console.log("contracts from app");

  //   }
  // }

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <Layout>
      <GlobalStyled />
      <Navbar>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="container h-100"
        >
          <Flex alignItems="center">
            {/* <StyledLink to="/">Swap</StyledLink> */}
            {/* <StyledLink to="/staking" className="ms-3">
              Staking
            </StyledLink> */}
          </Flex>
          <Flex alignItems="center">
            {networkId !== 4 ? (
              <>
                <NetWorkButton onClick={() => switchNetworkHandler(4)}>
                  Wrong network
                </NetWorkButton>
              </>
            ) : (
              RenderConnectButton(account)
            )}
          </Flex>
        </Flex>
      </Navbar>
      <Routes>
        <Route path="/" element={<StakingSwap account={account} />} />
        {/* <Route exace path="/staking" element={<Staking account={account} />} /> */}
      </Routes>
    </Layout>

    // <React.Fragment>

    //   {/* <TokenSwapScreen
    //     Web3={web3}
    //     Contracts={contracts}
    //     Accounts={accounts}
    //   ></TokenSwapScreen> */}
    // </React.Fragment>
  );
}

export default App;
