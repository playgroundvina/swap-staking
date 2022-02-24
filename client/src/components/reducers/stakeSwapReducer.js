import {
  SET_AMOUNT,
  SET_APPROVE,
  SET_SWAPABLE,
  SET_BALANCE,
  SET_LOADING,
  SET_RATIO,
  SET_PKG,
  SET_HISTORY,
  SET_DETAIL_SHOW,
} from './type';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_AMOUNT:
      return {
        ...state,
        amount: action.payload,
      };
    case SET_SWAPABLE:
      return {
        ...state,
        isSwapable: action.payload,
      };
    case SET_APPROVE:
      return {
        ...state,
        isApprove: action.payload,
      };
    case SET_BALANCE:
      return {
        ...state,
        [action.key]: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_RATIO:
      return {
        ...state,
        ratio: action.payload,
      };
    case SET_HISTORY:
      return {
        ...state,
        historyStake: action.payload,
      };
    case SET_PKG:
      return {
        ...state,
        stakingPkg: action.payload,
      };
    case SET_DETAIL_SHOW:
      return {
        ...state,
        isDetailShow: action.payload,
      };

    default:
      break;
  }
};

export default reducer;