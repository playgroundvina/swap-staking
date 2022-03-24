import React from 'react';
import styled from 'styled-components';
import ChevronDown from './Icons/ChevronDown';
import SwapIcon from './Icons/SwapIcon';

const SwapBoard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px 0px #00000040;
  max-width: 450px;
  width: 95%;
  margin: 0 auto;
  padding: 2rem 1rem 1rem;
`;

const BoardWrapper = styled.div`
  margin: auto;
`;

export const Text = styled.p`
  margin-left: 8px;
  color: ${({ color }) => color ?? '#000'};
  font-weight: ${({ fontWeight }) => fontWeight ?? '700'};
  font-size: ${({ fontSize }) => fontSize ?? '34px'};
  ${({ textTransform }) => textTransform && `text-transform:${textTransform};`}
  ${({ fontFamily }) =>
    fontFamily === 'Playfair' && 'font-family: Playfair Display SC;'}
  line-height: ${({ lineHeight }) => lineHeight ?? 1};
  text-align: ${({ textAlign }) => textAlign ?? 'start'};
  ${({ mb }) => mb && `margin-bottom: ${mb};`}
  ${({ truncate }) =>
    truncate &&
    `
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    width:150px;
    `}
    ${({ linear }) =>
    linear &&
    `
    background: linear-gradient(214.02deg, #D71479 6.04%, #F87421 92.95%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    `}
`;

const StyledImg = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

export const StyledButton = styled.div`
  --main-color: linear-gradient(214.02deg, #d71479 6.04%, #f87421 92.95%);
  outline: none;

  background: var(--main-color);
  border-radius: 20px;
  color: #fff;
  text-transform: capitalize;
  font-weight: 600;
  padding: 1rem;
  transition: 0.1s ease-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  font-size: ${({ fontSize }) => fontSize ?? '16px'};
  &.success {
    background: var(--main-color);
    border-radius: 10px;
  }
  ${({ disabled }) =>
    disabled
      ? `opacity:0.6;
  cursor:not-allowed;`
      : ` &:hover {
    color: #fff;
    filter: brightness(1.03);
  }`}
`;

export const OutlineButton = styled(StyledButton)`
  border-radius: 30px;
  background: rgb(247, 248, 250);
  position: relative;
  color: #ed1c51;

  :before {
    border-radius: 30px;
    position: absolute;
    content: '';
    background: linear-gradient(214.02deg, #d71479 6.04%, #f87421 92.95%);
    top: -2px;
    left: -2px;
    bottom: -2px;
    right: -2px;
    position: absolute;
    z-index: -1;
  }
`;

const InputTokenWrapper = styled.div`
  text-align: left;
  padding: 0.75rem;
  border: 1px solid rgba(196, 196, 196, 0.5);
  /* margin-bottom: 1rem; */
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
  min-height: 40px;
  color: #000;
  background: transparent;
  border: 1px solid #000;

  ${({ disabled }) =>
    disabled
      ? `opacity:0.4;`
      : `:hover {
    opacity: 0.7;
    color: #000;
  }`}
  ${({ hide }) => hide && `display:none;`}
`;

const SwapLine = styled(Flex)`
  position: relative;
  :before {
    position: absolute;
    content: '';
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;
    background: #1c1924;
  }
`;

const RenderApproveButton = (
  account,
  handleApprove,
  tokenSwap,
  networkId,
  handleConnect,
  isLoading,
) => {
  if (!account)
    return <StyledButton onClick={handleConnect}>Connect Wallet</StyledButton>;
  return (
    <StyledButton
      disabled={!tokenSwap || networkId !== 4 || isLoading}
      onClick={
        tokenSwap && networkId === 4 && !isLoading ? handleApprove : null
      }
    >
      Approve
    </StyledButton>
  );
};

const RenderSwapButton = (
  account,
  isSwapable,
  handleSwap,
  amount,
  tokenAddress,
  handleConnect,
  isLoading,
) => {
  return !account ? (
    <StyledButton onClick={handleConnect}>Connect Wallet</StyledButton>
  ) : (
    <StyledButton
      disabled={!isSwapable || isLoading}
      onClick={
        isSwapable && !isLoading
          ? () => handleSwap(amount, account, tokenAddress)
          : null
      }
    >
      Swap & Lock
    </StyledButton>
  );
};

const TokenSwap = ({
  account,
  onAmountChangeHandler,
  networkId,
  tokenSwap,
  handleApprove,
  tokenReceive,
  onSwapModalOpen,
  onReceiveModalOpen,
  handleSwap,
  setMaxAmount,
  state,
  handleConnect,
}) => {
  const {
    balanceSwap,
    balanceReceive,
    ratio,
    amount,
    isSwapable,
    isApprove,
    isLoading,
  } = state;

  return (
    <>
      <BoardWrapper>
        <Text
          color="#000"
          fontFamily="Playfair"
          fontWeight="900"
          fontSize="34px"
          textTransform="uppercase"
          textAlign="center"
          lineHeight="40px"
          mb="12px"
        >
          Token Swap{' '}
        </Text>
        <Text
          color="#808080"
          textAlign="center"
          fontSize="20px"
          fontWeight="400"
          mb="34px"
        >
          The best place to swap old token to new token
        </Text>
        <SwapBoard>
          <Flex>
            <Text
              color="#000"
              fontSize="22px"
              style={{ marginBottom: 16 }}
              className="ms-0 mb-4"
            >
              Swap
            </Text>
          </Flex>
          <InputTokenWrapper>
            <Flex justifyContent="space-between" className="pb-3">
              <StyledInputLabel>From</StyledInputLabel>
              <StyledInputLabel
                onClick={setMaxAmount}
                style={{ cursor: 'pointer' }}
              >
                Balance: {balanceSwap?.toFixed(2)}
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
                className="col-5"
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
          <SwapLine justifyContent="center" className="my-2">
            <SwapIcon width="45px" style={{ zIndex: 1 }} />

            {/* Ratio : {ratio} */}
          </SwapLine>
          <InputTokenWrapper>
            <Flex justifyContent="space-between" className="pb-3">
              <StyledInputLabel>To (estimated)</StyledInputLabel>
              <StyledInputLabel>
                {/* Balance: {balanceReceive?.toFixed(2)} */}
              </StyledInputLabel>
            </Flex>
            <Flex>
              <StyledInput
                type="text"
                placeholder="0.00"
                className="col-7"
                readOnly
                value={amount > 0 ? amount * ratio : 0}
              />

              <SelectTokenBox
                className="col-5"
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
          <div className="my-4 mx-3">
            {!isApprove
              ? RenderApproveButton(
                  account,
                  handleApprove,
                  tokenSwap,
                  networkId,
                  handleConnect,
                  isLoading,
                )
              : RenderSwapButton(
                  account,
                  isSwapable,
                  handleSwap,
                  amount,
                  tokenSwap?.address,
                  handleConnect,
                  isLoading,
                )}
          </div>
        </SwapBoard>
      </BoardWrapper>
    </>
  );
};

export default React.memo(TokenSwap);
