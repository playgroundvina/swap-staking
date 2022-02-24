import React, { useEffect, useState, useContext } from 'react';
import TokenSwap from './TokenSwap';
import StakingCard from './Staking/StakingCard';
import styled from 'styled-components';
import ArrowDown from './ArrowDown';
import useWeb3 from '../hooks/useWeb3';
import { AppContext } from '../AppContext';

const MainWrapper = styled.div`
  min-height: calc(100vh - 80px);
`;

const Text = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: rgb(17, 153, 250);
`;

const StyledArrow = styled(ArrowDown)`
  stroke: rgb(17, 153, 250);
  transform: rotate(-90deg);
`;
const StakingSwap = ({ account, networkId }) => {
  const { web3 } = useContext(AppContext);
  const { getHistoryStake } = useWeb3(web3, account);

  const [isDetailClick, setDetailClick] = useState(false);
  const [stakingPkg, setStakingPkg] = useState(1);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const getHistory = async () => {
      try {
          const response = await getHistoryStake();
          setHistory(response)
      } catch (error) {
        console.log(error)
      }
    }
    if(account) getHistory();

    
   
  }, [account]);

  const onStakingPkgHandler = (pkg) => {
    setStakingPkg(pkg);
  };
  return (
    <main className="overflow-hidden container">
      <MainWrapper className=" w-100 my-5">
        <div className="row position-relative gy-4 gy-md-0">
          <div className="col col-md-5 mx-auto">
            <TokenSwap
              account={account}
              stakingPkg={stakingPkg}
              onStakingPkgHandler={onStakingPkgHandler}
              networkId={networkId}
              setDetailClick={setDetailClick}
            />
          </div>
          <div className="col col-md-5 mx-auto offset-md-2 ">
            <StakingCard
              stakingPkg={stakingPkg}
              setDetailClick={setDetailClick}
              isDetailClick={isDetailClick}
              history={history}
            />
          </div>
        </div>
      </MainWrapper>
    </main>
  );
};

export default StakingSwap;
