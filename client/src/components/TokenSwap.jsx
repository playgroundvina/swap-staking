import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Coin from './Coin';
import ArrowDown from './ArrowDown';
import ChevronDown from './ChevronDown';
import ModalSwap from './Modal';
import ModalReceive from './Modal';
import useMetamask from '../hooks/useMetamask';
import { AppContext } from '../AppContext';
import ERC20 from '../contracts/ERC20.json';
import ConvertToken from '../contracts/ConvertToken.json';

const Navbar = styled.div`
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const MainWrapper = styled.div`
  min-height: 100vh;
  background: rgb(247, 248, 250);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SwapBoard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 10px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem 1rem;
  width: clamp(50%, 500px, 95%);
  height: 400px;
  border: 1px solid #e6e6e6;
`;

const BoardWrapper = styled.div`
  text-align: center;
`;

const Text = styled.p`
  margin-left: 8px;
  color: rgba(120, 0, 44);
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

const StyledButton = styled.div`
  background: rgb(136, 204, 253);
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  font-weight: 600;
  padding: 1rem;
  transition: filter 0.2s ease-out;
  cursor: pointer;

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

const RenderConnectButton = (account) => {
  const { handleConnect } = useMetamask();
  if (!account)
    return (
      <StyledButton className="success" onClick={handleConnect}>
        Connect Wallet
      </StyledButton>
    );
  return (
    <Text fontSize="16px">
      {account.slice(0, 5)}...{account.slice(-5)}
    </Text>
  );
};

const RenderApproveButton = (account, handleApprove) => {
  const { handleConnect } = useMetamask();
  if (!account)
    return (
      <StyledButton className="success" onClick={handleConnect}>
        Connect Wallet
      </StyledButton>
    );
  return (
    <StyledButton className="success" onClick={() => handleApprove()}>
      Approve
    </StyledButton>
  );
};

const RenderSwapButton = (account, isSwapable, handleSwap, amount) => {
  return (
    <StyledButton
      className="success"
      disabled={!isSwapable}
      onClick={isSwapable ? () => handleSwap(amount) : null}
    >
      Swap
    </StyledButton>
  );
};

const TokenSwap = () => {

  const {
    account,
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
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);

  useEffect(() => {
    if (tokenSwap) checkApproveToTransfer();
  }, [tokenSwap, tokenReceive]);

  const checkApproveToTransfer = async () => {
    try {
      const contract = new web3.eth.Contract(ERC20.abi, tokenSwap.address);
      const [balanceRes, approveRes] = await Promise.allSettled([
        contract.methods.balanceOf(account).call(),
        contract.methods
          .allowance(account, '0x7684C9287f32041F1f53E757EC2988E9461c9380')
          .call(),
      ]);
      setBalance(balanceRes.value / 10 ** 18);
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
    approveContract.methods
      .approve('0x7684C9287f32041F1f53E757EC2988E9461c9380', amountToWei)
      .send({ from: account })
      .then(() => {
        setApprove(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onAmountChangeHandler = (e) => {
    const amountValue = e.target.value;
    if (amountValue > 0 && amountValue <= balance) setSwapable(true);
    else setSwapable(false);
    setAmount(amountValue);
  };

  const setMaxBalance = () => {
    setAmount(balance);
  };
  
  const handleSwap = async (amount) => {
    if (amount > 0) {
      try {
        const convertContract = new web3.eth.Contract(
          ConvertToken,
          '0x7684C9287f32041F1f53E757EC2988E9461c9380',
        );
        const amountToWei = web3.utils.toWei(amount);
        const response = await convertContract.methods
          .swapToken0ToToken1(
            tokenSwap.address,
            tokenReceive.address,
            amountToWei,
          )
          .send({ from: account });
        console.log('response:', response);
      } catch (error) {
        console.log(error);
      }
    } else alert('');
  };

  const onSwapModalOpen = () => setSwapModal(true);
  const onReceiveModalOpen = () => setReceiveModal(true);
  const handleSwapModalClose = () => setSwapModal(false);
  const handleReceiveModalClose = () => setReceiveModal(false);

  return (
    <main>
      <Navbar>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="container"
        >
          <Flex alignItems="center">
            {/* <Coin width="60px" />
            <Text> | Token Swap</Text> */}
          </Flex>
          <Flex>{RenderConnectButton(account)}</Flex>
        </Flex>
      </Navbar>
      <MainWrapper>
        <BoardWrapper>
          <TitleText>Tokens Swap</TitleText>
          <SubtitleText>
            The Best Place to Swap Old Tokens To New Tokens
          </SubtitleText>
          <SwapBoard>
            <InputTokenWrapper>
              <Flex justifyContent="space-between" className="pb-3">
                <StyledInputLabel>From</StyledInputLabel>
                <StyledInputLabel
                  onClick={setMaxBalance}
                  style={{ cursor: 'pointer' }}
                >
                  Balance: {balance}
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
                  onClick={onSwapModalOpen}
                >
                  {!tokenSwap ? (
                    <>
                      Token Swap
                      <ChevronDown width="12px" className="ms-1" />
                    </>
                  ) : (
                    <span>{tokenSwap.name}</span>
                  )}
                </SelectTokenBox>
              </Flex>
            </InputTokenWrapper>
            <ArrowDown width="16px" className="mb-3" />
            <InputTokenWrapper>
              <Flex justifyContent="space-between" className="pb-3">
                <StyledInputLabel>To (estimated)</StyledInputLabel>
                <StyledInputLabel>Balance: 0</StyledInputLabel>
              </Flex>
              <Flex>
                <StyledInput
                  type="text"
                  placeholder="0.00"
                  className="col-7"
                  readOnly
                />
                {tokenReceive && (
                  <SelectTokenBox
                    className="col-5 success"
                    onClick={onReceiveModalOpen}
                  >
                    {tokenReceive.name}{' '}
                    {/* <ChevronDown width="12px" className="ms-1" /> */}
                  </SelectTokenBox>
                )}
              </Flex>
            </InputTokenWrapper>{' '}
            {!isApprove
              ? RenderApproveButton(account, handleApprove)
              : RenderSwapButton(account, isSwapable, handleSwap, amount)}
          </SwapBoard>
        </BoardWrapper>
      </MainWrapper>
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
    </main>
  );
};

export default TokenSwap;
