import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import ArrowDown from './ArrowDown';
import ChevronDown from './ChevronDown';
import ModalSwap from './Modal';
import ModalReceive from './Modal';
import useMetamask from '../hooks/useMetamask';
import { AppContext } from '../AppContext';
import ERC20 from '../contracts/ERC20.json';
import ConvertToken from '../contracts/ConvertToken.json';
import ScreenBlocking from './ScreenBlocking';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SWAPCONTRACT_ADDRESS = '0x8f2d176E8d232DE9a1CF70a0bC4c38b30E2E442B';

const SwapBoard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 10px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem 1rem;
  height: 400px;
  border: 1px solid rgba(136, 204, 253, 0.5);
`;

const BoardWrapper = styled.div`
 margin:auto;
`;

const Text = styled.p`
  margin-left: 8px;
  color: ${({ color }) => color ?? 'rgb(136,204,253)'};
  font-weight: 700;
  font-size: ${({ fontSize }) => fontSize ?? '32px'};
  ${({ truncate }) =>
    truncate &&
    `
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    width:150px;
    `}
`;

const TitleText = styled.h3`
  font-weight: 700;
  font-size: 26px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  letter-spacing: 3px;
`;

const SubtitleText = styled.p`
  font-weight: 700;
  color: #606060;
  text-transform: capitalize;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const StyledImg = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

export const StyledButton = styled.div`
  background: rgb(136, 204, 253);
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  font-weight: 600;
  padding: 1rem;
  transition: filter 0.2s ease-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize ?? '16px'};
  &.success {
    background: rgb(17, 153, 250);
    border-radius: 10px;
  }
  ${({ disabled }) =>
    disabled
      ? `background:rgb(136,204,253) !important;
  cursor:not-allowed;`
      : ` &:hover {
    color: #fff;
    filter: brightness(1.03);
  }`}
`;

const InputTokenWrapper = styled.div`
  text-align: left;
  border-radius: 20px;
  padding: 0.75rem;
  border: 1px solid #e6e6e6;
  margin-bottom: 1rem;
`;

export const Flex = styled.div`
  display: flex;
  ${({ alignItems }) => alignItems && `align-items:${alignItems};`}
  ${({ justifyContent }) =>
    justifyContent && `justify-content:${justifyContent};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap:${flexWrap};`}
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  color: #b1b1b1;
  font-size: 20px;
  &::placeholder {
    color: #e6e6e6;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const StyledInputLabel = styled.p`
  font-weight: 400;
`;

const SelectTokenBox = styled(StyledButton)`
  padding: 0.5rem;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RenderConnectButton = (account) => {
  const { handleConnect } = useMetamask();
  if (!account)
    return (
      <StyledButton className="success" onClick={handleConnect}>
        Connect Wallet
      </StyledButton>
    );
  return (
    <Text fontSize="16px" color="#333">
      {account.slice(0, 5)}...{account.slice(-5)}
    </Text>
  );
};

const RenderApproveButton = (account, handleApprove, tokenSwap) => {
  const { handleConnect } = useMetamask();
  if (!account)
    return (
      <StyledButton className="success" onClick={handleConnect}>
        Connect Wallet
      </StyledButton>
    );
  return (
    <StyledButton
      className="success"
      disabled={!tokenSwap}
      onClick={tokenSwap ? handleApprove : null}
    >
      Approve
    </StyledButton>
  );
};

const RenderSwapButton = (account, isSwapable, handleSwap, amount) => {
  const { handleConnect } = useMetamask();
  return !account ? (
    <StyledButton className="success" onClick={handleConnect}>
      Connect Wallet
    </StyledButton>
  ) : (
    <StyledButton
      className="success"
      disabled={!isSwapable}
      onClick={isSwapable ? () => handleSwap(amount) : null}
    >
      Swap
    </StyledButton>
  );
};

const TokenSwap = ({ account }) => {
  const {
    web3,
    tokenReceive,
    tokenSwap,
    swapList,
    receiveList,
    onTokenSwapChoose,
    onTokenReceiveChoose,
  } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const [isSwapable, setSwapable] = useState(false);
  const [isApprove, setApprove] = useState(false);
  const [balanceSwap, setBalanceSwap] = useState(0);
  const [balanceReceive, setBalanceReceive] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    if (tokenSwap) {
      checkApproveToTransfer();
    }
  }, [tokenSwap, tokenReceive]);

  useEffect(() => {
    checkSwapAmount();
  }, [amount]);

  const checkSwapAmount = () => {
    if (amount > 0 && amount <= balanceSwap) {
      setSwapable(true);
      return;
    }
    setSwapable(false);
  };

  const checkApproveToTransfer = async () => {
    try {
      const contract = new web3.eth.Contract(ERC20.abi, tokenSwap.address);
      const receiveContract = new web3.eth.Contract(
        ERC20.abi,
        tokenReceive.address,
      );
      const convertContract = new web3.eth.Contract(
        ConvertToken,
        SWAPCONTRACT_ADDRESS,
      );
      setLoading(true);
      const [balanceSwapRes, balanceReceiveRes, approveRes, ratioRes] =
        await Promise.allSettled([
          contract.methods.balanceOf(account).call(),
          receiveContract.methods.balanceOf(account).call(),
          contract.methods.allowance(account, SWAPCONTRACT_ADDRESS).call(),
          convertContract.methods
            .listOfTokenConvertRatio(tokenSwap.address, tokenReceive.address)
            .call(),
        ]);
      setRatio(ratioRes.value / 1000);
      setBalanceSwap(balanceSwapRes.value / 10 ** 18);
      setBalanceReceive(balanceReceiveRes.value / 10 ** 18);
      setLoading(false);

      if (approveRes.value > 10 ** 18) {
        setApprove(true);
        return;
      }
      setApprove(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = () => {
    const approveContract = new web3.eth.Contract(ERC20.abi, tokenSwap.address);
    const amountToWei = web3.utils.toWei('1000000000');

    setLoading(true);
    approveContract.methods
      .approve(SWAPCONTRACT_ADDRESS, amountToWei)
      .send({ from: account })
      .then(() => {
        setApprove(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const onAmountChangeHandler = (e) => {
    setAmount(e.target.value);
  };

  const setMaxBalance = () => {
    setAmount(balanceSwap);
  };

  const handleSwap = async (amount) => {
    if (amount > 0) {
      try {
        setLoading(true);
        const convertContract = new web3.eth.Contract(
          ConvertToken,
          SWAPCONTRACT_ADDRESS,
        );
        const amountToWei = web3.utils.toWei(amount);
        const response = await convertContract.methods
          .swapToken0ToToken1(
            tokenSwap.address,
            tokenReceive.address,
            amountToWei,
          )
          .send({ from: account });
        await checkApproveToTransfer();
        toast('Transaction successfull!', {
          position: 'top-center',
          hideProgressBar: true,
          autoClose: 3000,
          type: 'success',
        });
        setAmount('');
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else alert('');
  };

  const onSwapModalOpen = () => setSwapModal(true);
  const onReceiveModalOpen = () => setReceiveModal(true);
  const handleSwapModalClose = () => setSwapModal(false);
  const handleReceiveModalClose = () => setReceiveModal(false);

  return (
    <>
      <BoardWrapper>
        <SwapBoard>
          <InputTokenWrapper>
            <Flex justifyContent="space-between" className="pb-3">
              <StyledInputLabel>From</StyledInputLabel>
              <StyledInputLabel
                onClick={setMaxBalance}
                style={{ cursor: 'pointer' }}
              >
                Balance: {balanceSwap.toFixed(2)}
              </StyledInputLabel>
            </Flex>
            <Flex>
              <StyledInput
                type="number"
                className="col-7"
                placeholder="0.00"
                onChange={onAmountChangeHandler}
                value={amount}
                step="1"
              />
              <SelectTokenBox
                className="col-5 success"
                onClick={account ? onSwapModalOpen : null}
                disabled={!account}
              >
                {!tokenSwap ? (
                  <>Token Swap</>
                ) : (
                  <>
                    <StyledImg
                      src={`/tokens/${tokenSwap.name}.svg`}
                      width="24px"
                      className="me-1"
                    />
                    <span>{tokenSwap.name}</span>
                  </>
                )}

                <ChevronDown width="12px" className="ms-1" />
              </SelectTokenBox>
            </Flex>
          </InputTokenWrapper>
          <Flex justifyContent="center " className="mb-4">
            <ArrowDown width="16px" className="me-1" />
            Ratio : {ratio}
          </Flex>
          <InputTokenWrapper>
            <Flex justifyContent="space-between" className="pb-3">
              <StyledInputLabel>To (estimated)</StyledInputLabel>
              <StyledInputLabel>
                Balance: {balanceReceive.toFixed(2)}
              </StyledInputLabel>
            </Flex>
            <Flex>
              <StyledInput
                type="text"
                placeholder="0.00"
                className="col-7"
                readOnly
                value={amount * ratio}
              />
              {tokenReceive && (
                <SelectTokenBox
                  className="col-5 success"
                  onClick={onReceiveModalOpen}
                >
                  <StyledImg
                    src={`/tokens/${tokenReceive.name}.svg`}
                    width="24px"
                    className="me-1"
                  />
                  {tokenReceive.name}{' '}
                  <ChevronDown width="12px" className="ms-2" />
                </SelectTokenBox>
              )}
            </Flex>
          </InputTokenWrapper>{' '}
          <div className="mt-5">
            {!isApprove
              ? RenderApproveButton(account, handleApprove, tokenSwap)
              : RenderSwapButton(account, isSwapable, handleSwap, amount)}
          </div>
        </SwapBoard>
      </BoardWrapper>

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
      <ToastContainer />
    </>
  );
};

export default TokenSwap;
