import React, { useReducer } from "react";

export default (reducer: any, actions: any, defaultValue: any) => {
  const Context = React.createContext<any>(null);

  function Provider({ children }: any) {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: any = {};

    Object.keys(actions).forEach((key) => {
      boundActions[key] = actions[key](dispatch);
    });

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    return <Context.Provider value={{ state, ...boundActions }}>{children}</Context.Provider>;
  }

  return { Context, Provider };
};
