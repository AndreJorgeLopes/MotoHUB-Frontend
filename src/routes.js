import React from "react";
import Home from './Home'
import Header from './Header'
import Footer from './Footer'
import SearchPage from './SearchPage'
import Login from './Login'
import NotFound from './NotFound'
import Register from './Register'
import RegisterPost from './RegisterPost'
import PostPage from './PostPage'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from "./services/auth";
// eslint-disable-next-line
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);


const Routes = () => (
    <div className="app">
      <Router>
        <Header />
        
        <Switch>
          <Route path="/search" component={SearchPage} />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/post" component={PostPage} />
          <Route path="/sell" component={RegisterPost} />
{/*           <PrivateRoute path="/account" component={Account} /> */}
          <Route path="*" component={NotFound} />
        </Switch>
        
        <Footer />
      </ Router>
    </div>
);

export default Routes;