import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledImage } from '../Staking/StakingCard';
import { StyledButton, Text } from '../TokenSwap';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  min-height: calc(100vh - 100px);
  display: flex;
`;

const LeftContent = styled.div`
  max-width: 400px;
`;

const RightContent = styled.div``;

const variants = {
  hide: {
    x: '-20%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
};

const Home = () => {
  return (
    <Wrapper
      as={motion.div}
      className="container my-5 my-md-0"
      variants={variants}
      initial="hide"
      animate="visible"
      exit="hide"
    >
      <div className="my-auto d-flex justify-content-between w-100 flex-column-reverse flex-md-row align-items-center">
        <LeftContent>
          <Text
            fontFamily="Playfair"
            textTransform="uppercase"
            color="#000"
            mb="12px"
          >
            Swap Tokens Easily and Securely
          </Text>
          <Text
            color="#808080"
            lineHeight="32px"
            fontWeight="400"
            fontSize="20px"
            mb="2rem"
          >
            Snail House Token Swap making easy to swap old tokens to new tokens.
            Stargram token (ERC20) and GSMT (ERC20) can be exchanged for Snail
            House tokens.
          </Text>
          <StyledButton
            as={Link}
            to="/swap"
            style={{ textDecoration: 'unset' }}
          >
            Swap now
          </StyledButton>
        </LeftContent>
        <RightContent className="mb-5 mb-md-0">
          <StyledImage src="/images/home-image.png" alt="home-art" />
        </RightContent>
      </div>
    </Wrapper>
  );
};

export default Home;
