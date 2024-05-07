import { CHANGE_RESOURCE } from './actions';

const initialState = {
  data: null,
};

const dataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_RESOURCE:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
