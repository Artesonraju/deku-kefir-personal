'use strict';

function shallowEqual(objA, objB){
  for(let key in objA){
    if(key !== 'children' && (!(key in objB) || objA[key] !== objB[key])){
      return false;
    }
  }
  for(let key in objB){
    if(key !== 'children' && !(key in objA)){
      return false;
    }
  }
  return true;
}

function shouldUpdate(component, nextProps, nextState) {
  let {props, state} = component;
  return !shallowEqual(props, nextProps) || !shallowEqual(state,nextState);
}

export default {shouldUpdate};