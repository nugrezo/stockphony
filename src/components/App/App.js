import React, { useState, Fragment } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { StockProvider } from "../AppComponents/AdminOperations/StockContext"; // Import StockProvider
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
import StockDetail from "../AppComponents/StockDetail/StockDetail";
import AdminSignOut from "../AuthComponents/AdminSignOut/AdminSignOut";
import AdminOperations from "../AppComponents/AdminOperations/AdminOperations";
import SetMarketSchedule from "../AppComponents/AdminOperations/SetMarketSchedule";
import AddStock from "../AppComponents/AdminOperations/AddStock";
import TransferFunds from "../AppComponents/TransferFunds/TransferFunds";
import AccountInfo from "../AppComponents/AccountInfo/AccountInfo";
import BankInfoForm from "../AppComponents/AccountInfo/BankInfoForm";
import Investments from "../AppComponents/Investments/Investments";
import BuyPage from "../AppComponents/BuyPage/BuyPage";
import SellPage from "../AppComponents/SellPage/SellPage";
// import BuyPage from "../AppComponents/BuyPage/BuyPage";
// import SellPage from "../AppComponents/SellPage/SellPage";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [msgAlerts, setMsgAlerts] = useState([]);

  const clearUser = () => setUser(null);
  const clearAdmin = () => setAdmin(null);

  const msgAlert = ({ heading, message, variant }) => {
    setMsgAlerts([...msgAlerts, { heading, message, variant }]);
  };

  return (
    <Fragment>
      <div className="App">
        <Header user={user} admin={admin} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <div className="content">
          <StockProvider user={user}>
            {" "}
            {/* Wrap routes with StockProvider */}
            <HashRouter>
              <Routes>
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
                  element={
                    <AdminSignUp msgAlert={msgAlert} setAdmin={setAdmin} />
                  }
                />
                <Route
                  path="/admin-sign-in"
                  element={
                    <AdminSignIn msgAlert={msgAlert} setAdmin={setAdmin} />
                  }
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
                {admin && (
                  <Route
                    path="/admin-sign-out"
                    element={
                      <AdminSignOut
                        msgAlert={msgAlert}
                        clearAdmin={clearAdmin}
                        admin={admin}
                      />
                    }
                  />
                )}
                <Route
                  path="/admin-operations"
                  element={<AdminOperations admin={admin} />}
                />
                <Route
                  path="/set-market-schedule"
                  element={<SetMarketSchedule admin={admin} />}
                />

                {user && (
                  <Route
                    path="/change-password"
                    element={<ChangePassword msgAlert={msgAlert} user={user} />}
                  />
                )}
                {user && (
                  <Route
                    path="/stock-watch"
                    element={<StockWatch msgAlert={msgAlert} />}
                  />
                )}
                <Route
                  path="/buy/:stockTicker"
                  element={<BuyPage msgAlert={msgAlert} />}
                />
                <Route
                  path="/sell/:stockTicker"
                  element={<SellPage msgAlert={msgAlert} />}
                />
                {user && (
                  <Route
                    path="/transfer-funds"
                    element={<TransferFunds msgAlert={msgAlert} />}
                  />
                )}
                {user && (
                  <Route
                    path="/account-info"
                    element={<AccountInfo user={user} msgAlert={msgAlert} />}
                  />
                )}
                {user && (
                  <Route
                    path="/bank-info"
                    element={<BankInfoForm user={user} msgAlert={msgAlert} />}
                  />
                )}
                {user && (
                  <Route
                    path="/investments"
                    element={<Investments user={user} msgAlert={msgAlert} />}
                  />
                )}

                <Route path="/stocks/:symbol" element={<StockDetail />} />
                <Route path="/add-stock" element={<AddStock admin={admin} />} />
              </Routes>
            </HashRouter>
          </StockProvider>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default App;
