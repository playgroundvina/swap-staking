import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { Flex, OutlineButton, Text } from '../TokenSwap';

const NavWrapper = styled.div`
  height: 100px;
  position: sticky;
  top: 0;
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #c4c4c4;
  background: #fff;
  z-index: 100;
`;

const StyledLogoIcon = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
  margin-right: 8px;
`;

const StyledAddress = styled(OutlineButton)`
  padding: 8px 1rem;
`;

const Navbar = ({ account, networkId }) => {
  const { handleConnect, handleLogout, switchNetworkHandler } =
    useContext(AppContext);

  const RenderConnectButton = (account) => {
    if (!account)
      return (
        <OutlineButton onClick={handleConnect}>Connect Wallet</OutlineButton>
      );
    return (
      <StyledAddress onClick={handleLogout}>
        {account.slice(0, 5)}...{account.slice(-5)}
      </StyledAddress>
    );
  };

  return (
    <NavWrapper>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        className="container h-100"
      >
        <Flex
          alignItems="center"
          as={Link}
          to="/"
          style={{ textDecoration: 'unset' }}
        >
          <StyledLogoIcon src="/tokens/SHT.svg" width="60px" />
          <Text
            color="#000"
            textTransform="uppercase"
            fontFamily="Playfair"
            className="d-none d-md-block"
            fontSize="24px"
          >
            Token swap
          </Text>
        </Flex>
        <Flex alignItems="center">
          {networkId !== 4 && account ? (
            <>
              <OutlineButton onClick={() => switchNetworkHandler(4)}>
                Wrong network
              </OutlineButton>
            </>
          ) : (
            RenderConnectButton(account)
          )}
        </Flex>
      </Flex>
    </NavWrapper>
  );
};

export default Navbar;
