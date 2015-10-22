/** @jsx dom */

'use strict';

import {dom} from 'deku';
import {shouldUpdate} from '../utils/deku';
import {navigate} from '../routing/routing';
import {logout} from '../auth/auth';

let propTypes = {
  user: { source: 'auth/user'}
};

function render (component) {
  let {props} = component;
  let inner;
  if(!props.user) {
    inner = <div><button onClick={() => navigate('/login')}>Sign In</button>
      <button onClick={() => navigate('/join')}>Sign up</button></div>;
  } else {
    inner = <div><a onClick={() => navigate('/update')}>{props.user.get('username')}</a>
      <button onClick={() => logout()}>Log out</button></div>;
  }
  return <div class = "header-auth">{inner}</div>;
}

export default {propTypes, render, shouldUpdate};