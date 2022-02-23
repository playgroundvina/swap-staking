import React from 'react';
import styled from 'styled-components';
import StakingCard from './StakingCard';

const Wrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
`;

const CardContainer = styled.div``;

const CardWrapper = styled.div`
  
`;
const index = () => {
  return (
    <Wrapper>
      <CardContainer className="row m-auto gy-3">
        <CardWrapper className="col-10 col-md-6 mx-auto">
          <StakingCard />
        </CardWrapper>
        <CardWrapper className="col-10 col-md-6 mx-auto">
          <StakingCard />
        </CardWrapper>
      </CardContainer>
    </Wrapper>
  );
};

export default index;
