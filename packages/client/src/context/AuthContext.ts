import React from "react";
import createDataContext from "./createDataContext";

interface Action {
  type: string;
  payload: string;
}

interface State {
  name: string;
  firstName: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "change_name":
      return { ...state, name: action.payload };
    case "change_firstname":
      return { ...state, firstName: action.payload };
    case "change_country":
      return { ...state, country: action.payload };
    case "change_email":
      return { ...state, email: action.payload };
    case "change_password":
      return { ...state, password: action.payload };
    case "change_password_confirm":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
};

const changeName = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_name", payload: e });
};
const changeFirstName = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_firstname", payload: e });
};
const changeCountry = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_country", payload: e });
};
const changeEmail = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_email", payload: e });
};
const changePassword = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_password", payload: e });
};
const changePasswordConfirm = (dispatch: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_password_confirm", payload: e });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    changeName,
    changeFirstName,
    changeCountry,
    changeEmail,
    changePassword,
    changePasswordConfirm,
  },
  { name: "", firstName: "", country: "", email: "", password: "", confirmPassword: "" }
);
