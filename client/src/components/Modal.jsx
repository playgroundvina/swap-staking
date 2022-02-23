import React, { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from './CloseIcon';
import TokenList from './TokenList';

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  transition: 0.2s ease-in;
  ${({ isActive }) =>
    isActive ? 'opacity:1;z-index: 100;' : 'opacity:0;z-index:-1;'}
`;

const ModalWrapper = styled.div`
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem 0;
  border-radius: 20px;
  width: 500px;
`;

const Text = styled.p`
  font-size: ${({ fontSize }) => fontSize ?? '16px'};
  ${({ color }) => color && `color:${color};`}
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`}
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: #606060;
  align-items: center;
  padding: 0 2rem;
`;

const Box = styled.div`
  ${({ margin }) => margin && `margin: ${margin};`}
  ${({ padding }) => padding && `padding: ${padding};`}
`;

const ModalInputSearch = styled.input`
  width: 100%;
  border: 1px solid #e6e6e6;
  outline: none;
  padding: 1rem;
  border-radius: 15px;
  &::placeholder {
    color: #cacaca;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const LineBreak = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid #f3f2f2;
`;

const Modal = ({ isActive, handleClose, tokenList, onTokenChoose, title }) => {
  const [searchInput, setSearchInput] = useState('');
  return (
    <Overlay isActive={isActive}>
      <ModalWrapper>
        <ModalHeader className="mb-3">
          <Text fontSize="16px" fontWeight={500}>
            {title}
          </Text>
          <StyledCloseIcon width="24px" onClick={handleClose} />
        </ModalHeader>
        <Box padding="0 2rem">
          <ModalInputSearch
            className="mb-4"
            placeholder="Search name or paste address"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </Box>
        <Box padding="0 2rem">
          <Text
            fontSize="16px"
            color="#606060"
            className="mb-3"
            fontWeight={500}
          >
            Token name
          </Text>
        </Box>
        <LineBreak />
        <TokenList
          searchInput={searchInput}
          handleClose={handleClose}
          tokenList={tokenList}
          onTokenChoose={onTokenChoose}
        />
        <LineBreak />
      </ModalWrapper>
    </Overlay>
  );
};

export default Modal;
