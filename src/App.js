import { Switch, Route, Redirect } from "react-router-dom";
import AuthContext from "./store/auth-context";
import Layout from "./components/Layout/Layout";
import { useContext } from "react";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const context = useContext(AuthContext);
  
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!context.isLoggedIn && (
          <Route path="/auth">
            {context.isLoggedIn ? <Redirect to="/" /> : <AuthPage />}
          </Route>
        )}
        <Route path="/profile">
          {context.isLoggedIn ? <UserProfile /> : <Redirect to="/auth" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
