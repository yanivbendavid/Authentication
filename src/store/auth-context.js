import { createContext, useState, useCallback } from "react";
import { useEffect } from "react";

const AuthContext = createContext({
  token: null,
  isLoggedIn: false,
  login(token) {},
  logout: () => {},
});

let logoutTimer;

const calcExpirationDate = (seconds) => {
  const date = new Date();
  return date.setSeconds(date.getSeconds() + seconds);
};

const calcRemainingTime = (time) => {
  const currentDate = new Date();
  const expirationDate = new Date(time);
  return expirationDate.getTime() - currentDate.getTime();
};

const retrievedToken = () => {
  const token = localStorage.getItem("token");
  const remainingTime = parseInt(localStorage.getItem("expirationDate"));
  if (!remainingTime || calcRemainingTime(remainingTime) <= 0) {
    return null;
  }

  return { token, remainingTime: calcRemainingTime(remainingTime) };
};

const ContextProvider = (props) => {
  const tokenData = retrievedToken();
  const initialToken = tokenData === null ? null : tokenData.token;
  const [token, setToken] = useState(initialToken);

  const loginHandler = (token, expiresInSecs) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", calcExpirationDate(expiresInSecs));
    logoutTimer = setTimeout(logoutHandler, expiresInSecs * 1000);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      //remainingTime is date diff in milliseconds
      logoutTimer = setTimeout(logoutHandler, tokenData.remainingTime);
    }
  }, [tokenData, logoutHandler]);

  const context = {
    token,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { ContextProvider };
