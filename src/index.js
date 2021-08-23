import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LandingPage from "./LandingPage";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage} />

                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </BrowserRouter>
    </React.StrictMode >,
    document.getElementById("root")
);
