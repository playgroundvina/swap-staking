import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { Flex, StyledButton } from '../TokenSwap';
import { Text, StyledImage } from './StakingCard';

const DetailWrapper = styled.div`
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgb(223, 223, 223);
  margin-bottom: 2rem;
`;

const variants = {
  show: {
    y: 0,
    opacity: 1,
  },
  hide: {
    y: '-10%',
    opacity: 0,
  },
};

const StakeDetail = ({data}) => {
  console.log(data);
  return (
    <DetailWrapper
      as={motion.div}
      variants={variants}
    >
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
        <Text>{data?.amount}</Text>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Total Earned Value :</Text>
        <Text>{data?.profitCanClaim}</Text>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Stake unlock: </Text>
        <Flex alignItems="center">
          <StyledImage src="/tokens/PST.svg" width="16px" />
          <Text className="ps-2">{data?.stakeUnlocked}</Text>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" className="mb-2">
        <Text>Earned value </Text>
        <Flex alignItems="center">
          <StyledImage src="/tokens/PST.svg" width="16px" />
          <Text className="ps-2">{data?.stakeClaimed}</Text>
        </Flex>
      </Flex>
    </DetailWrapper>
  );
};

export default StakeDetail;
