import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import Reservations from './pages/Reservations';
import Inventory from './pages/Inventory';

function AppRouter(): JSX.Element {
    return (
        <Router>
            <Switch>
                <Route path="/reservations">
                    <Reservations />
                </Route>
                <Route path="/inventory">
                    <Inventory />
                </Route>
                <Route path="/">
                    <Redirect to="/reservations" />
                </Route>
            </Switch>
        </Router>
    )
}

export default AppRouter