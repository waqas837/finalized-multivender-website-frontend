// Define initial state
const initialState = {
  info: null,
};

// Reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UserSignupDetailType":
      return {
        ...state,
        userdata: action.payload,
      };
    case "UserLoginDetailsType":
      return {
        ...state,
        userdata: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
