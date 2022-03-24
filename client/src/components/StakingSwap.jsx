import React, { useEffect, useReducer, useContext, useState } from 'react';
import TokenSwap from './TokenSwap';
import ModalSwap from './Modal';
import ModalReceive from './Modal';
import styled from 'styled-components';
import useWeb3 from '../hooks/useWeb3';
import { AppContext } from '../AppContext';
import initialState from './reducers/initalState';
import stakeSwapReducer from './reducers/stakeSwapReducer';
import { motion } from 'framer-motion';
import {
  SET_AMOUNT,
  SET_APPROVE,
  SET_SWAPABLE,
  SET_BALANCE,
  SET_LOADING,
  SET_RATIO
} from './reducers/type';
import { ToastContainer, toast } from 'react-toastify';
import ScreenBlocking from './ScreenBlocking';
import 'react-toastify/dist/ReactToastify.css';

const MainWrapper = styled.div`
  min-height: calc(100vh - 100px);
`;

const Text = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: rgb(17, 153, 250);
`;

const variants = {
  hidden: {
    x: '20%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    x: '0',
    opacity: 1,
  },
};

const StakingSwap = ({ account, networkId }) => {
  const {
    web3,
    tokenReceive,
    tokenSwap,
    swapList,
    receiveList,
    onTokenSwapChoose,
    onTokenReceiveChoose,
    handleConnect,
    hasAccountChanged,
  } = useContext(AppContext);
  const { getBalanceOf, onAprroveCheck, onApproveHandler } = useWeb3(
    web3,
    account,
  );

  const [state, dispatch] = useReducer(stakeSwapReducer, initialState);

  const { amount, balanceSwap, isLoading } = state;

  const [swapModal, setSwapModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);

  const onSwapModalOpen = () => setSwapModal(true);
  const onReceiveModalOpen = () => setReceiveModal(true);
  const handleSwapModalClose = () => setSwapModal(false);
  const handleReceiveModalClose = () => setReceiveModal(false);

  useEffect(() => {
    isLoading
      ? (document.getElementsByTagName('html')[0].style.overflow = 'hidden')
      : (document.getElementsByTagName('html')[0].style.overflow = 'auto');
  }, [isLoading]);

  useEffect(() => {
    const swapRatioInit = (tokenSwap) => {
      // const payload = tokenSwap.name === 'STG' ? 0.5 : 0.02;
      const payload = 1;
      dispatch({ type: SET_RATIO, payload });
    };
    const getTokensBalance = async (tokenSwap, tokenReceive) => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const [balanceSwapRes, balanceReceiveRes, approve] =
          await Promise.allSettled([
            getBalanceOf(tokenSwap.address),
            getBalanceOf(tokenReceive.address),
            onAprroveCheck(tokenSwap.address),
          ]);

        dispatch({ type: SET_APPROVE, payload: approve.value });
        dispatch({
          type: SET_BALANCE,
          key: 'balanceSwap',
          payload: balanceSwapRes.value ?? 0,
        });
        dispatch({
          type: SET_BALANCE,
          key: 'balanceReceive',
          payload: balanceReceiveRes.value ?? 0,
        });
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: SET_LOADING, payload: false });
    };

    if (tokenSwap && tokenReceive) {
      swapRatioInit(tokenSwap);
      getTokensBalance(tokenSwap, tokenReceive);
      dispatch({ type: SET_AMOUNT, payload: '' });
    }
  }, [tokenSwap, tokenReceive]);

  useEffect(() => {
    if (!account || hasAccountChanged) {
      dispatch({
        type: SET_BALANCE,
        key: 'balanceSwap',
        payload: 0,
      });
      dispatch({
        type: SET_BALANCE,
        key: 'balanceReceive',
        payload: 0,
      });
      dispatch({ type: SET_AMOUNT, payload: '' });
    }
  }, [account, hasAccountChanged]);

  useEffect(() => {
    checkSwapAmount();
  }, [amount, balanceSwap]);

  const onAmountChangeHandler = (e) => {
    const newAmount = e.target.value;
    if (newAmount > balanceSwap) {
      return;
    }
    dispatch({ type: SET_AMOUNT, payload: e.target.value });
  };

  const setMaxAmount = () =>
    dispatch({ type: SET_AMOUNT, payload: balanceSwap });

  const checkSwapAmount = () => {
    if (amount > 0 && amount <= balanceSwap) {
      dispatch({ type: SET_SWAPABLE, payload: true });
      return;
    }
    dispatch({ type: SET_SWAPABLE, payload: false });
  };

  const handleApprove = async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await onApproveHandler(tokenSwap.address);
      dispatch({ type: SET_APPROVE, payload: true });
    } catch (error) {
      console.log(error);
      dispatch({ type: SET_APPROVE, payload: false });
    }
    dispatch({ type: SET_LOADING, payload: false });
  };

  const handleSwap = async (amount, holderAddress, tokenAddress) => {
    if (amount > 0) {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        // const data = {
        //   holderAddress,
        //   amount: +amount,
        //   tokenAddress,
        // };
      
        // console.log(await web3.eth.personal.unlockAccount(account, null));
        // const txSign = await 
        // web3.eth.accounts.signTransaction(response, account,null).then((response) => console.log(response))
        // // console.log('txSign:', txSign)

        const txResponse = await (
          await fetch('http://192.168.0.239:5001/api/swap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: account,
              token0: tokenSwap.address,
              token1: tokenReceive.address,
              amount: +amount,
            }),
          })
        ).json();

        console.log('txResponse:', txResponse);
        toast.success('Transaction Successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      } catch (error) {
        console.log(error);
        toast.error('Transaction Error!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  return (
    <>
      <motion.main
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="my-md-0 my-3"
      >
        <MainWrapper className="d-flex">
          <div className="w-100 m-auto">
            <TokenSwap
              account={account}
              onAmountChangeHandler={onAmountChangeHandler}
              networkId={networkId}
              tokenReceive={tokenReceive}
              tokenSwap={tokenSwap}
              handleSwap={handleSwap}
              handleApprove={handleApprove}
              onSwapModalOpen={onSwapModalOpen}
              onReceiveModalOpen={onReceiveModalOpen}
              setMaxAmount={setMaxAmount}
              state={state}
              handleConnect={handleConnect}
            />
          </div>
        </MainWrapper>
        <ToastContainer />
      </motion.main>
      <ModalSwap
        title="Select a token to swap"
        isActive={swapModal}
        handleClose={handleSwapModalClose}
        tokenList={swapList}
        onTokenChoose={onTokenSwapChoose}
      />

      {tokenReceive && (
        <ModalReceive
          title="Select a token to receive"
          isActive={receiveModal}
          handleClose={handleReceiveModalClose}
          tokenList={receiveList}
          onTokenChoose={onTokenReceiveChoose}
        />
      )}
      <ScreenBlocking isLoading={isLoading} />
    </>
  );
};

export default StakingSwap;
