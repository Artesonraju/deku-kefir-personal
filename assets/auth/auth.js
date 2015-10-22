'use strict';

import {emitter} from '../utils/kefir';
import {send, setHeader, removeHeader} from '../network/network';
import Immutable from 'immutable';
import {navigate} from '../routing/routing';

let authHeader = 'X-Cembro-Auth';

let credentialEmitter = emitter();
let userEmitter = emitter();
let updateEmitter = emitter();
let logoutEmitter = emitter();

let loginEmitter = credentialEmitter.map(() => true);
let joinEmitter = userEmitter.map(() => true);

function auth(resp){
  let user = resp.body;
  if(user.token){
    setHeader(authHeader, user.token);
    delete user.token;
  }
  navigate('/');
  return user;
}

let authEmitter = credentialEmitter.flatMapLatest(credential => {
  return send('GET', '/api/auth/', JSON.stringify(credential));
}).map(auth);

let createEmitter = userEmitter.flatMapLatest(user => {
  return send('POST', '/api/users', JSON.stringify(user));
}).map(auth);

let createEmitter = userEmitter.flatMapLatest(user => {
  return send('PUT', '/api/users' + user.username, JSON.stringify(user));
}).map(auth);

logoutEmitter.onValue(() => removeHeader(authHeader));

let loginChanges = loginEmitter.awaiting(authEmitter.errorsToValues()).changes();
let joinChanges = joinEmitter.awaiting(createEmitter.errorsToValues()).changes();
let changes =  loginChanges.merge(joinChanges);

function initAuth(app){
  app.set('auth/pending', false);
  app.set('auth/user', null);
  authEmitter.merge(createEmitter).onValue(v => {
    app.set('auth/user', Immutable.fromJS(v));
  });
  logoutEmitter.onValue(() => {
    app.set('auth/user', null);
  });
  changes.onValue(v => {
    app.set('auth/pending', v);
  });
}

function logout(){
  logoutEmitter.emit(true);
}

function login(credential){
  credentialEmitter.emit(credential);
}

function join(user){
  userEmitter.emit(user);
}

function update(user){
  updateEmitter.emit(user);
}

export default {initAuth, login, logout, join, update, loginEmitter, joinEmitter, logoutEmitter, authEmitter, createEmitter};