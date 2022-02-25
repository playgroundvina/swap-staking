import React, { useEffect, useReducer, useContext } from 'react';
import TokenSwap from './TokenSwap';
import StakingCard from './Staking/StakingCard';
import styled from 'styled-components';
import ArrowDown from './ArrowDown';
import useWeb3 from '../hooks/useWeb3';
import { AppContext } from '../AppContext';
import initialState from './reducers/initalState';
import stakeSwapReducer from './reducers/stakeSwapReducer';
import {
  SET_AMOUNT,
  SET_APPROVE,
  SET_SWAPABLE,
  SET_BALANCE,
  SET_LOADING,
  SET_RATIO,
  SET_PKG,
  SET_HISTORY,
  SET_DETAIL_SHOW,
} from './reducers/type';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainWrapper = styled.div`
  min-height: calc(100vh - 80px);
`;

const Text = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: rgb(17, 153, 250);
`;

const StyledArrow = styled(ArrowDown)`
  stroke: rgb(17, 153, 250);
  transform: rotate(-90deg);
`;

const StakingSwap = ({ account, networkId }) => {
  const {
    web3,
    tokenReceive,
    tokenSwap,
    swapList,
    receiveList,
    onTokenSwapChoose,
    onTokenReceiveChoose,
  } = useContext(AppContext);
  const {
    onSwapHandler,
    onAprroveCheck,
    getBalanceOf,
    getSwapRatio,
    onApproveHandler,
    getHistoryStake,
    harvestProfit,
  } = useWeb3(web3, account);

  const [state, dispatch] = useReducer(stakeSwapReducer, initialState);

  const { amount, balanceSwap, historyStake, stakingPkg, isDetailShow } = state;

  useEffect(() => {
    const InitFetch = async () => {
      try {
        dispatch({ type: SET_LOADING, payload: true });
        const [historyRes] = await Promise.allSettled([
          getHistoryStake(),
          checkApproveToTransfer(),
          fetchSwapRatio(),
          getTokensBalance(),
        ]);
        dispatch({ type: SET_HISTORY, payload: historyRes.value });
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: SET_LOADING, payload: false });
    };
    if (tokenSwap && tokenReceive) {
      InitFetch();
    }
  }, [tokenSwap, tokenReceive]);

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

  const onStakingPkgHandler = (pkg) => {
    dispatch({ type: SET_PKG, payload: pkg });
    dispatch({ type: SET_DETAIL_SHOW, payload: false });
  };

  const onDetailShowHandler = () =>
    dispatch({ type: SET_DETAIL_SHOW, payload: !isDetailShow });

  const checkApproveToTransfer = async () => {
    try {
      const approveRes = await onAprroveCheck(tokenSwap.address);
      dispatch({ type: SET_APPROVE, payload: approveRes });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSwapRatio = async () => {
    try {
      const ratioRes = await getSwapRatio(
        tokenSwap.address,
        tokenReceive.address,
      );
      dispatch({ type: SET_RATIO, payload: ratioRes });
    } catch (error) {
      console.log(error);
    }
  };

  const getTokensBalance = async () => {
    try {
      const [balanceSwapRes, balanceReceiveRes] = await Promise.allSettled([
        getBalanceOf(tokenSwap.address),
        getBalanceOf(tokenReceive.address),
      ]);
      dispatch({
        type: SET_BALANCE,
        key: 'balanceSwap',
        payload: balanceSwapRes.value,
      });
      dispatch({
        type: SET_BALANCE,
        key: 'balanceReceive',
        payload: balanceReceiveRes.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async () => {
    dispatch({ type: SET_LOADING, payload: true });

    try {
      await onApproveHandler(tokenSwap.address);
      dispatch({ type: SET_APPROVE, payload: true });
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: SET_LOADING, payload: false });
  };

  const handleSwap = async (amount) => {
    if (amount > 0) {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        await onSwapHandler(
          tokenSwap.address,
          tokenReceive.address,
          amount,
          stakingPkg,
        );
        await checkApproveToTransfer();
        const historyRes = await getHistoryStake();
        toast('Transaction successfull!', {
          position: 'top-right',
          hideProgressBar: true,
          autoClose: 3000,
          type: 'success',
        });
        dispatch({ type: SET_AMOUNT, payload: '' });
        dispatch({ type: SET_HISTORY, payload: historyRes });
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const onHarvestProfit = async (profileId) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const harvestRes = await harvestProfit(profileId);
      console.log('harvestRes:', harvestRes);
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: SET_LOADING, payload: false });
  };

  return (
    <main className="overflow-hidden container">
      <MainWrapper className="d-flex my-5">
        <div className="row w-100 position-relative gy-4 gy-md-0 m-auto">
          <div className="col col-md-5 mx-auto">
            <TokenSwap
              account={account}
              onStakingPkgHandler={onStakingPkgHandler}
              onAmountChangeHandler={onAmountChangeHandler}
              networkId={networkId}
              tokenReceive={tokenReceive}
              tokenSwap={tokenSwap}
              handleApprove={handleApprove}
              handleSwap={handleSwap}
              swapList={swapList}
              receiveList={receiveList}
              onTokenSwapChoose={onTokenSwapChoose}
              onTokenReceiveChoose={onTokenReceiveChoose}
              setMaxAmount={setMaxAmount}
              state={state}
            />
          </div>
          <div className="col col-md-5 mx-auto offset-md-2 ">
            <StakingCard
              stakingPkg={stakingPkg}
              onDetailShowHandler={onDetailShowHandler}
              isDetailShow={isDetailShow}
              historyStake={historyStake}
              onHarvestProfit={onHarvestProfit}
            />
          </div>
        </div>
      </MainWrapper>
      <ToastContainer />
    </main>
  );
};

export default StakingSwap;
