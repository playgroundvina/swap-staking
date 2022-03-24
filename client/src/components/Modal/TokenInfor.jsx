import React from 'react';
import styled from 'styled-components';
import { Flex } from '../TokenSwap';

const TokenImg = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

const TokenName = styled.p`
  text-transform: uppercase;
  color: #606060;
`;

const Wrapper = styled.div`
  padding: 1rem;
  cursor: pointer;
  &:hover {
    background: rgb(247, 248, 250);
  }
`;
const TokenInfor = ({ data, onTokenChoose,handleClose }) => {
  return (
    <Wrapper onClick={() => {
      onTokenChoose(data?.address)
      handleClose(false);
      }}>
      <Flex alignItems="center">
        <TokenImg src={ `/tokens/${data?.name}.svg`} width="24px" />
        <TokenName className="ms-2">{data?.name}</TokenName>
      </Flex>
    </Wrapper>
  );
};

export default TokenInfor;
