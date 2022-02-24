import React from 'react';
import styled from 'styled-components';

const OverLay = styled.div`
  position: fixed;
  z-index: 100000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
`;

const SpinnerWrapper = styled.div`
  margin: auto;
  text-align:center;
`;

const SpinnerLoader = styled.div`
  width: 2rem;
  height: 2rem;

`;
const ScreenBlocking = ({ isLoading }) => {
  return (
    isLoading && (
      <OverLay>
        <SpinnerWrapper>
          <SpinnerLoader className="spinner-border text-primary" />
          <p className='text-center mt-2'>Loading transaction....</p>
        </SpinnerWrapper>
      </OverLay>
    )
  );
};

export default ScreenBlocking;
