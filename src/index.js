import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import LandingPage from "./LandingPage";
import UpdateProfile from "./UpdateProfile";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/login" component={Login} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route path="/pods" component={() => {
                        window.location.href = 'https://admin478456.wixsite.com/pods';
                        return null;
                    }} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/update-profile" component={UpdateProfile} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode >,
    document.getElementById("root")
);
