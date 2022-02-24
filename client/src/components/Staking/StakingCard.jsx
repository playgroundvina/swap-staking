import React, { useState } from 'react';
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
  min-height: 470px;
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
const cardVariants = {
  show: {
    opacity: 1,
    x: 0,
  },
  hide: {
    opacity: 0,
    x: 20,
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

const StakingCard = ({
  stakingPkg,
  isDetailClick,
  setDetailClick,
  history,
}) => {
  const onDetailClickHandler = () => {
    setDetailClick((prev) => !prev);
  };
 
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
                PST/PST package: {stakingPkg}
              </Text>
            </div>

            <Flex justifyContent="space-between" style={{ width: 200 }}>
              <Text textTransform="capitalize" fontWeight={600}>
                current APR:
              </Text>
              <Text textTransform="capitalize" textAlign="end" fontWeight={600}>
                99%
              </Text>
            </Flex>
          </StakingHeader>
          {/* <StakingInfor className="mb-3 row">
            <div className="col-6">
              <Text fontWeight={500} className="mb-3">
                My Stake
              </Text>
              <Text fontWeight={500} className="mb-3">
                My Pending Rewards
              </Text>
              <Text fontWeight={500} className="mb-3">
                Total Stake
              </Text>
              <Text fontWeight={500} className="mb-3">
                Wallet Balance
              </Text>
            </div>
            <div className="col-2">
              <Text color="#b1b1b1" className="mb-3">
                0
              </Text>
              <Text color="#b1b1b1" className="mb-3">
                0.00
              </Text>
              <Text color="#b1b1b1" className="mb-3">
                $0.000
              </Text>
              <Text color="#b1b1b1" className="mb-3">
                0
              </Text>
            </div>
            <div className="col-4">
              <Text fontWeight={500} textAlign="end" className="mb-3">
                PST/PST
              </Text>
              <Text fontWeight={500} textAlign="end" className="mb-3">
                PST
              </Text>
              <div></div>
              <Text fontWeight={500} textAlign="end" className="mb-3">
                0
              </Text>
              <Text fontWeight={500} textAlign="end" className="mb-3">
                PST/PST
              </Text>
            </div>
          </StakingInfor> */}
          <Spacer />
          <StyledButton className="success mb-4">Unlock</StyledButton>
          <Flex alignItems="center" justifyContent="center" className="w-100">
            {history && (
              <DetailButton onClick={onDetailClickHandler}>
                <span>Detail</span>
                <StyledArrowIcon
                  className="ms-1"
                  width="12px"
                  $isShow={isDetailClick}
                />
              </DetailButton>
            )}
          </Flex>
        </ContentWrapper>
        <AnimatePresence>
          {isDetailClick && (
            <DetailWrapper
              as={motion.div}
              variants={detailVariants}
              initial="hide"
              animate="show"
              exit="hide"
              transition={{ type: 'spring', duration: 0.1 }}
            >
              {history.map((infor) => (
                <StakeDetail key={infor.id}  data={infor}/>
              ))}

              {/* <StakeDetail />
              <StakeDetail />
              <StakeDetail />
              <StakeDetail /> */}
            </DetailWrapper>
          )}
        </AnimatePresence>
      </CardWrapper>
    </AnimatePresence>
  );
};

export default StakingCard;
