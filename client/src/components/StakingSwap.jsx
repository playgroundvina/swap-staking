import React from 'react';
import TokenSwap from './TokenSwap';
import StakingCard from './Staking/StakingCard';
import styled from 'styled-components';

const MainWrapper = styled.div`
  min-height: calc(100vh - 80px);

  display: flex;
  align-items: center;
  justify-content: center;
`;
const StakingSwap = ({ account }) => {
  return (
    <main className='overflow-hidden'>
      <MainWrapper>
        <div className="row">
          <div className="col-10  mx-auto col-md-6">
            <TokenSwap account={account} />
          </div>
          <div className="col-10 mx-auto  col-md-6">
            <StakingCard />
          </div>
        </div>
      </MainWrapper>
    </main>
  );
};

export default StakingSwap;
