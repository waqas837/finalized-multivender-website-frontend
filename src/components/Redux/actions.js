import { UserLoginDetailsType, UserSignupDetailType } from "./constants";

// Action creators
export const UserSignupDetails = (data) => {
  return {
    type: UserSignupDetailType,
    payload: data,
  };
};

export const UserLoginDetails = (data) => {
  return {
    type: UserLoginDetailsType,
    payload: data,
  };
};
