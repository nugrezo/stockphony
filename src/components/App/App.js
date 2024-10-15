import React, { useState, Fragment } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import AuthenticatedRoute from "../AuthenticatedRoute/AuthenticatedRoute";
import AutoDismissAlert from "../AutoDismissAlert/AutoDismissAlert";
import Header from "../Header/Header";
import ChangePassword from "../AuthComponents/ChangePassword/ChangePassword";
import SignUp from "../AuthComponents/SignUp/SignUp";
import SignOut from "../AuthComponents/SignOut/SignOut";
import SignIn from "../AuthComponents/SignIn/SignIn";
import AboutApp from "../AboutApp/AboutApp";
import Footer from "../Footer/Footer";
import LandingPage from "../LandingPage/LandingPage";
import AdminSignUp from "../AuthComponents/AdminSignUp/AdminSignUp";
import AdminSignIn from "../AuthComponents/AdminSingIn/AdminSignIn";
import StockWatch from "../AppComponents/MarketWatch/StockWatch";

function App() {
  const [user, setUser] = useState(null);
  const [msgAlerts, setMsgAlerts] = useState([]);

  const clearUser = () => setUser(null);

  const msgAlert = ({ heading, message, variant }) => {
    setMsgAlerts([...msgAlerts, { heading, message, variant }]);
  };

  return (
    <Fragment>
      <div className="App">
        <Header user={user} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <div className="content">
          <HashRouter>
            <Routes>
              {/* <Route path="/" element={<Example to="/" />} /> */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about-app" element={<AboutApp />} />
              <Route
                path="/sign-up"
                element={<SignUp msgAlert={msgAlert} setUser={setUser} />}
              />
              <Route
                path="/sign-in"
                element={<SignIn msgAlert={msgAlert} setUser={setUser} />}
              />

              <Route
                path="/admin-sign-up"
                element={<AdminSignUp msgAlert={msgAlert} setUser={setUser} />}
              />
              <Route
                path="/admin-sign-in"
                element={<AdminSignIn msgAlert={msgAlert} setUser={setUser} />}
              />
              {user && (
                <Route
                  path="/sign-out"
                  element={
                    <SignOut
                      msgAlert={msgAlert}
                      clearUser={clearUser}
                      user={user}
                    />
                  }
                />
              )}
              {user && (
                <Route
                  path="/change-password"
                  element={<ChangePassword msgAlert={msgAlert} user={null} />}
                />
              )}
              {/* <Route path="/home" element={<Icon />} /> */}
              {user && (
                <Route
                  path="/stock-watch"
                  element={<StockWatch msgAlert={msgAlert} user={user} />}
                />
              )}
              <Route
                path="/post"
                // element={<CreateExample msgAlert={msgAlert} user={user} />}
              />
              <Route
                path="/userexamples"
                // element={<ShowUserExample msgAlert={msgAlert} user={user} />}
              />
              <Route
                path="/userinfo"
                // element={<UserInfo msgAlert={msgAlert} user={user} />}
              />
            </Routes>
          </HashRouter>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default App;
