import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, StyledButton } from '../TokenSwap';
import ChevronDown from '../ChevronDown';
import StakeDetail from './StakeDetail';

const CardWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(136, 204, 253, 0.6);
  box-shadow: 0 5px 8px 1px rgba(0, 0, 0, 0.1);

  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 2rem 1.5rem;
`;

const StakingHeader = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`;

export const StyledImage = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

export const Text = styled.div`
  font-weight: ${({ fontWeight }) => fontWeight ?? '400'};
  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  color: ${({ color }) => color ?? 'inherit'};
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ textAlign }) => textAlign && `text-align:${textAlign};`}
`;

const StakingInfor = styled.div``;

const DetailButton = styled.div`
  transition: 0.2s ease-out;
  cursor: pointer;
  font-weight: 500;
  :hover {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const StyledArrowIcon = styled(ChevronDown)`
  transform: ${({ isShow }) => (isShow ? 'rotate(180deg)' : 'rotate(0)')};
`;

const StakingCard = () => {
  const [isShow, setShow] = useState(false);
  const onDetailShow = () => {
    setShow((prev) => !prev);
  };
  return (
    <CardWrapper>
      <ContentWrapper>
        <StakingHeader className="mb-5">
          <div className="pe-4">
            <StyledImage src="/tokens/BNB_LBNB.png" width="50px" />
            <Text fontSize="20px" fontWeight={600} textTransform="uppercase">
              PST/PST
            </Text>
          </div>

          <Flex justifyContent="space-between" style={{ width: 200 }}>
            <Text textTransform="capitalize" fontWeight={600}>
              current APY:
            </Text>
            <Text textTransform="capitalize" textAlign="end" fontWeight={600}>
              99%
            </Text>
          </Flex>
        </StakingHeader>
        <StakingInfor className="mb-3 row">
          <div className="col-6">
            <Text fontWeight={500} className="mb-3">
              My Stake
            </Text>
            <Text fontWeight={500} className="mb-3">
              My Pending Rewards
            </Text>
            <Text fontWeight={500} className="mb-3">
              Total Stake
            </Text>
            <Text fontWeight={500} className="mb-3">
              Wallet Balance
            </Text>
          </div>
          <div className="col-2">
            <Text color="#b1b1b1" className="mb-3">
              0
            </Text>
            <Text color="#b1b1b1" className="mb-3">
              0.00
            </Text>
            <Text color="#b1b1b1" className="mb-3">
              $0.000
            </Text>
            <Text color="#b1b1b1" className="mb-3">
              0
            </Text>
          </div>
          <div className="col-4">
            <Text fontWeight={500} textAlign="end" className="mb-3">
              PST/PST
            </Text>
            <Text fontWeight={500} textAlign="end" className="mb-3">
              PST
            </Text>
            <div></div>
            <Text fontWeight={500} textAlign="end" className="mb-3">
              0
            </Text>
            <Text fontWeight={500} textAlign="end" className="mb-3">
              PST/PST
            </Text>
          </div>
        </StakingInfor>
        <StyledButton className="success mb-4">Unlock</StyledButton>
        <Flex alignItems="center" justifyContent="center" className="w-100">
          <DetailButton onClick={onDetailShow}>
            <span>Detail</span>
            <StyledArrowIcon className="ms-1" width="12px" isShow={isShow} />
          </DetailButton>
        </Flex>
      </ContentWrapper>

      <StakeDetail isShow={isShow} />
      <StakeDetail isShow={isShow} />
      <StakeDetail isShow={isShow} />
      <StakeDetail isShow={isShow} />
      <StakeDetail isShow={isShow} />
    </CardWrapper>
  );
};

export default StakingCard;
