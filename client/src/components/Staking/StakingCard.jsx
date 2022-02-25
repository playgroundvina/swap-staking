import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Flex, StyledButton } from '../TokenSwap';
import ChevronDown from '../ChevronDown';
import StakeDetail from './StakeDetail';
import { AnimatePresence, motion } from 'framer-motion';

const CardWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(136, 204, 253, 0.6);
  box-shadow: 0 5px 8px 1px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: relative;
  min-height: 485px;
`;

const Spacer = styled.div`
  height: 190px;
`;

const ContentWrapper = styled.div`
  padding: 2rem 1.5rem;
`;

const StakingHeader = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`;

export const StyledImage = styled.img`
  width: ${({ width }) => width ?? '100%'};
  height: auto;
`;

export const Text = styled.div`
  font-weight: ${({ fontWeight }) => fontWeight ?? '400'};
  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  color: ${({ color }) => color ?? 'inherit'};
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ textAlign }) => textAlign && `text-align:${textAlign};`}
`;

const StakingInfor = styled.div``;

const DetailButton = styled.div`
  transition: 0.2s ease-out;
  cursor: pointer;
  font-weight: 500;
  :hover {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const StyledArrowIcon = styled(ChevronDown)`
  transform: ${({ $isShow }) => ($isShow ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DetailWrapper = styled.div`
  overflow: auto;
  --thumbColor: rgba(136, 204, 253, 0.5);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TextRule = styled(Text)`
  line-height: 1.5;
`

const cardVariants = {
  show: {
    opacity: 1,
    x: 0,
  },
  hide: {
    opacity: 0,
    x: 20,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

const detailVariants = {
  show: {
    maxHeight: 600,
    transition: {
      staggerChildren: 0.15,
    },
  },
  hide: {
    maxHeight: 0,
    transition: {
      duration: 0.2,
      when: 'afterChildren',
    },
  },
};

const STAKING_PACKAGES = {
  1: '6',
  2: '24',
  3: '60',
};

const PACKAGE_PROFIT = {
  1: {
    earningRate: 6,
    apr: 24,
    timeLock: 9,
    title: '3 Months'
  },
  2: {
    earningRate: 24,
    apr: 48,
    timeLock: 6,
    title: '6 Months'
  },
  3: {
    earningRate: 60,
    apr: 60,
    timeLock: 12,
    title: '12 Months'

  },
};


const StakingCard = ({
  stakingPkg,
  isDetailShow,
  onDetailShowHandler,
  historyStake,
  onHarvestProfit,
  onUnlockStake
}) => {
  const [historyStakeFilter, setHistoryStakeFilter] = useState([]);

  useEffect(() => {
    if (historyStake) {
      const filterHistory = historyStake.filter(
        (element) => +element.packageId === stakingPkg,
      );
      setHistoryStakeFilter(filterHistory);
    }
  }, [historyStake, stakingPkg]);
  return (
    <AnimatePresence initial={false}>
      <CardWrapper
        as={motion.div}
        variants={cardVariants}
        animate="show"
        initial="hide"

        transition={{ duration: 0.4 }}
        key={stakingPkg}
      >
        <ContentWrapper>
          <StakingHeader className="mb-5">
            <div className="pe-4">
              <StyledImage src="/tokens/BNB_LBNB.png" width="50px" />
              <Text fontSize="20px" fontWeight={600} textTransform="uppercase">
                CHTS/CHTS
              </Text>
            </div>

            <Flex justifyContent="space-between" style={{ width: 200 }}>
              <Text textTransform="capitalize" fontWeight={600}>
                Package APY:
              </Text>
              <Text textTransform="capitalize" textAlign="end" fontWeight={600}>
              {`${PACKAGE_PROFIT[stakingPkg].apr}%`}
              </Text>
            </Flex>
          </StakingHeader>
          <Text textTransform="capitalize" fontWeight={600} fontSize={'25px'} textAlign="center" className="my-5">
                STAKE CHTS TO EARN CHTS
              </Text>
          <StakingInfor className="mb-3 row">

            <div className="col-6">
              <Text fontWeight={500} className="mb-3">
                Package
              </Text>
              <Text fontWeight={500} className="mb-3">
                Earning Rate
              </Text>
              <Text fontWeight={500} className="mb-3">
                *Rule
              </Text>
            </div>
            <div className="col-6">
              <Text fontWeight={800} color="red" fontSize="16px" textAlign="end" className="mb-3">
                {PACKAGE_PROFIT[stakingPkg].title}
              </Text>
              <Text fontWeight={500} textAlign="end" className="mb-3">
              {`${PACKAGE_PROFIT[stakingPkg].earningRate}%`}
              </Text>
              <TextRule fontWeight={500} textAlign="end" className="mb-3">
                {`Cancel The Lockup After ${PACKAGE_PROFIT[stakingPkg].title} Of Staking (Principal After For ${PACKAGE_PROFIT[stakingPkg].timeLock} Month)`}
              </TextRule>
            </div>
          </StakingInfor>
          <Flex alignItems="center" justifyContent="center" className="w-100">
            {historyStakeFilter.length > 0 && (
              <DetailButton onClick={onDetailShowHandler}>
                <span>Detail</span>
                <StyledArrowIcon
                  className="ms-1"
                  width="12px"
                  $isShow={isDetailShow}
                />
              </DetailButton>
            )}
          </Flex>
        </ContentWrapper>
        <AnimatePresence>
          {isDetailShow && (
            <DetailWrapper
              as={motion.div}
              variants={detailVariants}
              initial="hide"
              animate="show"
              exit="hide"
              transition={{ type: 'spring', duration: 0.1 }}
            >
              {historyStakeFilter.map((infor, index) => (
                <StakeDetail
                  key={infor.id}
                  data={infor}
                  onHarvestProfit={onHarvestProfit}
                  onUnlockStake={onUnlockStake}
                  isLast={index == historyStakeFilter.length - 1}
                />
              ))}
            </DetailWrapper>
          )}
        </AnimatePresence>
      </CardWrapper>
    </AnimatePresence>
  );
};

export default React.memo(StakingCard);
