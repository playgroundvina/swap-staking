import React from 'react';

const useMetamask = () => {
  const handleConnect = () => {
    window.ethereum.enable();
  };
  return { handleConnect };
};

export default useMetamask;
