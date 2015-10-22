/** @jsx dom */

'use strict';

import {dom} from 'deku';
import {shouldUpdate} from '../utils/deku';
import Immutable from 'immutable';

import {login} from './auth';

let propTypes = {
  pending: { source: 'auth/pending'},
  user: { source: 'auth/user'}
};

function initialState() {
  return {values: Immutable.fromJS({})};
}

function validate(name, value, component, updateState){
  let {state} = component;
  let updated = state.values.set(name, value);
  updateState({values: updated});
}

function submit(event, component){
  event.preventDefault();
  login(component.state.values.toJS());
}

function render(component, updateState) {
  let {props, state} = component;
  if(props.user){
    return <div>Already logged, log out to access another account</div>;
  }
  if(props.pending){
    return <div>Authentication pending, please wait</div>;
  }
  return <form onSubmit={e => submit(e, component)}>
    <div>
      <div>Username :</div>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={state.values.get('username')}
        onChange={e => validate('username', e.target.value, component, updateState)}
        required
      />
      <strong><abbr title="required">*</abbr></strong>
    </div>
    <div>
      <div>Password :</div>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={state.values.get('password')}
        onChange={e => validate('password', e.target.value, component, updateState)}
        required
      />
      <strong><abbr title="required">*</abbr></strong>
    </div>
    <input type="submit" value="Sign In" />
  </form>;
}

export default {propTypes, initialState, shouldUpdate, render};