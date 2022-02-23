import React from 'react';
import styled from 'styled-components';

const OverLay = styled.div`
  position: fixed;
  z-index: 100000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
`;

const SpinnerLoader = styled.div`
  margin: auto;
  width: 2rem;
  height: 2rem;
`;
const ScreenBlocking = ({ isLoading }) => {
  return (
    isLoading && (
      <OverLay>
        <SpinnerLoader className="spinner-border" />
      </OverLay>
    )
  );
};

export default ScreenBlocking;
