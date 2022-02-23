import React from 'react';
import styled from 'styled-components';
import { Flex,StyledButton } from '../TokenSwap';
import { Text,StyledImage } from './StakingCard';

const DetailWrapper = styled.div`
  display: ${({ isShow }) => (isShow ? 'block' : 'none')};
  padding: 0 1.5rem 2rem;
  border-bottom:1px solid rgb(223, 223, 223);
  margin-bottom:2rem;
`;

const StakeDetail = ({isShow}) => {
  return (
    <DetailWrapper className="" isShow={isShow}>
      <Flex justifyContent="center" className="mb-4">
        <StyledButton className="success" fontSize="14px">
          {' '}
          Harvest{' '}
        </StyledButton>
        <StyledButton className="success ms-3" fontSize="14px">
          {' '}
          Unlock Stake{' '}
        </StyledButton>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Total Staked Value :</Text>
        <Text>100</Text>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Total Earned Value :</Text>
        <Text>100</Text>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Stake unlock </Text>
        <Flex alignItems="center">
          <StyledImage src="/tokens/PST.svg" width="16px" />
          <Text className="ps-2">500</Text>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Earned value </Text>
        <Flex alignItems="center">
          <StyledImage src="/tokens/PST.svg" width="16px" />
          <Text className="ps-2">50</Text>
        </Flex>
      </Flex>
    </DetailWrapper>
  );
};

export default StakeDetail;
