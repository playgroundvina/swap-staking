import React from 'react';
import SwapStakingABI from '../contracts/ConvertToken.json';
import ERC20 from '../contracts/ERC20.json';
const SWAPCONTRACT_ADDRESS = '0x161425B9d0b19DA082E392047ED590025a9d0510';

const getSwapStakingContract = (web3) =>
  new web3.eth.Contract(SwapStakingABI, SWAPCONTRACT_ADDRESS);

const getTokenContract = (web3, tokenAddress) =>
  new web3.eth.Contract(ERC20.abi, tokenAddress);

const useWeb3 = (web3, account) => {
  const onApproveHandler = async (tokenAddress) => {
    const tokenContract = getTokenContract(web3, tokenAddress);
    const amount = convertToWeii('1000000000');

    await tokenContract.methods
      .approve(SWAPCONTRACT_ADDRESS, amount) // 1B
      .send({ from: account });
  };

  const onAprroveCheck = async (tokenAddress) => {
    const tokenContract = getTokenContract(web3, tokenAddress);

    const approveRes = await tokenContract.methods
      .allowance(account, SWAPCONTRACT_ADDRESS)
      .call();

    return +approveRes > convertToWeii('1');
  };

  const getBalanceOf = async (tokenAddress) => {
    const tokenContract = getTokenContract(web3, tokenAddress);

    const balanceRes = await tokenContract.methods.balanceOf(account).call();

    return +balanceRes / convertToWeii('1');
  };

  const getSwapRatio = async (token0Address, token1Address) => {
    const swapContract = getSwapStakingContract(web3);

    const ratioRes = await swapContract.methods
      .listOfTokenConvertRatio(token0Address, token1Address)
      .call();

    return +ratioRes / 1000;
  };

  const onSwapHandler = async (token0Address, token1Address, amount, pkgId) => {
    const swapContract = getSwapStakingContract(web3);

    await swapContract.methods
      .swapToken0ToToken1(
        token0Address,
        token1Address,
        convertToWeii(amount),
        pkgId,
      )
      .send({ from: account });
    await getHistoryStake();
  };

  const getHistoryStake = async () => {
    try {
      const contract = getSwapStakingContract(web3);
      const data = await contract.methods.getProfilesByAddress(account).call();
      const history = {};
      data.forEach((item) => {
        const dataA = {
          id: item[0],
          address: item[1],
          amount: +convertToTokens(item[2], web3), // How many tokens the user has provided.
          profitClaimed: +convertToTokens(item[3], web3), // default false
          stakeClaimed: +convertToTokens(item[4], web3), // default false
          vestingStart: item[5],
          vestingEnd: item[6],
          totalProfit: +convertToTokens(item[7], web3),
          packageId: item[8],
          refunded: item[9],
        };
        history[dataA.id] = dataA;
      });

      const response = await getProfitCanClaim(contract, history);

      return Object.keys(history).map((id) => ({
        ...history[id],
        profitCanClaim: response.profit[id] - history[id].profitClaimed,
        stakeUnlocked: response.stakeUnlocked[id] - history[id].stakeClaimed,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getProfitCanClaim = async (contract, historyList) => {
    try {
      const promisesProfit = [];
      const promisesStake = [];

      Object.keys(historyList).forEach((id) => {
        promisesProfit.push(contract.methods.getCurrentProfit(id).call());
        promisesStake.push(contract.methods.getCurrentStakeUnlock(id).call());
      });

      const resultProfit = await Promise.allSettled(promisesProfit);
      const resultStake = await Promise.allSettled(promisesStake);
      const formatDataProfit = {};

      const formatDataStake = {};

      resultProfit.forEach((profit, index) => {
        formatDataProfit[Object.keys(historyList)[index]] = profit.value
          ? +convertToTokens(profit.value)
          : 0;
      });

      resultStake.forEach((stake, index) => {
        formatDataStake[Object.keys(historyList)[index]] = stake.value
          ? +convertToTokens(stake.value)
          : 0;
      });

      return {
        profit: formatDataProfit,
        stakeUnlocked: formatDataStake,
      };
    } catch (error) {}
  };

  const harvestProfit = async (profileId) => {
    try {
      const contract = getSwapStakingContract(web3);
      return await contract.methods
        .claimProfit(profileId)
        .send({ from: account });
    } catch (error) {
      console.log(error);
    }
  };

  const unlockStake = async (profileId) => {
    try {
      const contract = getSwapStakingContract(web3);
      return await contract.methods
        .claimStaking(profileId)
        .send({ from: account });
    } catch (error) {
      console.log(error);
    }
  };

  const convertToWeii = (amount) => web3.utils.toWei(amount);
  const convertToTokens = (amount) => {
    return web3.utils.fromWei(amount, 'ether');
  };
  return {
    onSwapHandler,
    onAprroveCheck,
    getBalanceOf,
    getSwapRatio,
    onApproveHandler,
    getHistoryStake,
    harvestProfit,
    unlockStake
  };
};

export default useWeb3;
