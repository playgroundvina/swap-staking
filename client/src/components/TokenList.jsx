import React, { useEffect } from 'react';
import styled from 'styled-components';
import TokenInfor from './TokenInfor';
import _ from 'lodash';

const Wrapper = styled.div`
  /* overflow: scroll; */
`;

const TokenList = ({ searchInput, handleClose, tokenList, onTokenChoose }) => {
  const [tokensArr, setTokensArr] = React.useState(tokenList);

  useEffect(() => {
    if (searchInput) {
      setTokensArr(
        tokenList.filter((element) => element.name.toLowerCase().includes(searchInput.toLowerCase()) || element.address === searchInput),
      );
    } else setTokensArr(tokenList);
  }, [searchInput]);
  return (
    <Wrapper>
      {tokensArr.map((token) => (
        <TokenInfor
          key={token.name}
          data={token}
          onTokenChoose={onTokenChoose}
          handleClose={handleClose}
          onTokenChoose={onTokenChoose}
        />
      ))}
    </Wrapper>
  );
};

export default TokenList;
