import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import ArrowDown from './ArrowDown';
import ChevronDown from './ChevronDown';
import ModalSwap from './Modal';
import ModalReceive from './Modal';
import useMetamask from '../hooks/useMetamask';
import ScreenBlocking from './ScreenBlocking';

const SwapBoard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 10px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem 1rem;
  border: 1px solid rgba(136, 204, 253, 0.5);
`;

const BoardWrapper = styled.div`
  margin: auto;
`;

const Text = styled.p`
  margin-left: 8px;
  color: ${({ color }) => color ?? 'rgb(136,204,253)'};
  font-weight: ${({ fontWeight }) => fontWeight ?? '700'};
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

const StyledImg = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

export const StyledButton = styled.div`
  --main-color: rgb(17, 153, 250);
  background: rgb(136, 204, 253);
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  font-weight: 600;
  padding: 1rem;
  transition: 0.2s ease-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: ${({ fontSize }) => fontSize ?? '16px'};
  &.success {
    background: var(--main-color);
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
  ${({ outline }) =>
    outline &&
    css`
      background: transparent !important;
      border: 1px solid var(--main-color);
      color: var(--main-color);
      border-radius: 10px;

      :hover {
        background: var(--main-color) !important ;
      }
      &.active {
        background: var(--main-color) !important;
        color: #fff;
      }
    `}
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
  :read-only {
    cursor: not-allowed;
  }
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
  min-height:40px;
  ${({ hide }) => hide && `opacity:0;cursor:default;z-index-1;`}
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

const RenderApproveButton = (account, handleApprove, tokenSwap, networkId) => {
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
      disabled={!tokenSwap || networkId !== 4}
      onClick={tokenSwap && networkId === 4 ? handleApprove : null}
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
      Swap & Staking
    </StyledButton>
  );
};

const StakingPackages = [1, 2, 3];

const TokenSwap = ({
  account,
  onStakingPkgHandler,
  onAmountChangeHandler,
  networkId,
  tokenSwap,
  tokenReceive,
  swapList,
  receiveList,
  onTokenSwapChoose,
  onTokenReceiveChoose,
  handleApprove,
  handleSwap,
  setMaxAmount,
  state,
}) => {
  const [swapModal, setSwapModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);

  const {
    balanceSwap,
    balanceReceive,
    ratio,
    amount,
    stakingPkg,
    isApprove,
    isSwapable,
    isLoading,
  } = state;

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
                onClick={setMaxAmount}
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
                readOnly={balanceSwap === 0}
              />
              <SelectTokenBox
                className="col-5 success"
                onClick={account && networkId === 4 ? onSwapModalOpen : null}
                disabled={!account || networkId !== 4}
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
              {/* {tokenReceive && ( */}
                <SelectTokenBox
                  className="col-5 success"
                  onClick={tokenReceive ? onReceiveModalOpen : null}
                  hide={!tokenReceive}
                >
                  <StyledImg
                    src={`/tokens/${tokenReceive?.name}.svg`}
                    width="24px"
                    className="me-1"
                  />
                  {tokenReceive?.name}{' '}
                  <ChevronDown width="12px" className="ms-2" />
                </SelectTokenBox>
             
            </Flex>
          </InputTokenWrapper>{' '}
          <div className="row mt-5 mb-3">
            {StakingPackages.map((pkg) => (
              <div key={pkg} className="col">
                <StyledButton
                  outline
                  className={stakingPkg === pkg ? 'btn active' : 'btn '}
                  fontSize="14px"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Tooltip on top"
                  onClick={() => {
                    onStakingPkgHandler(pkg);
                  }}
                >
                  Package {pkg}
                </StyledButton>
              </div>
            ))}
          </div>
          <div className="mb-3">
            {!isApprove
              ? RenderApproveButton(
                  account,
                  handleApprove,
                  tokenSwap,
                  networkId,
                )
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
    </>
  );
};

export default React.memo(TokenSwap);
