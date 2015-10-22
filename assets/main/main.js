/** @jsx dom */

'use strict';

import {tree, render, dom} from 'deku';
import {initRouting} from '../routing/routing';
import {initAuth} from '../auth/auth';
import Header from '../header/header';
import Footer from '../footer/footer';
import Router from '../routing/router';
import NotFound from './notFound';
import Login from '../auth/login';
import Join from '../auth/join';
import Home from './home';

let app = tree(<div><Header /><Router /><Footer /></div>);

let routingConfig = {
  home: {
    path: '/',
    method: 'get',
    apply: (route, callback) => {
      callback(null, {component: Home, args: null});
    }
  },
  login: {
    path: '/login',
    method: 'get',
    apply: (route, callback) => {
      callback(null, {component: Login, args: null});
    }
  },
  join: {
    path: '/join',
    method: 'get',
    apply: (route, callback) => {
      callback(null, {component: Join, args: null});
    }
  },
  notFound: {
    path: '*',
    method: 'get',
    apply: (route, callback) => {
      callback(null, {component: NotFound, args: null});
    }
  }
};

app.use(app => initRouting(app, routingConfig));
app.use(initAuth);
render(app, document.getElementById('app'));