'use strict';

import {emitter} from '../utils/kefir';
import {fromNodeCallback} from 'kefir';
import Routr from 'routr';

let router; 

let routeEmitter = emitter();

function initRouting(app, config){
  router = new Routr(config);
  routeEmitter
    .flatMapLatest(route => 
      fromNodeCallback(callback => route.config.apply(route, callback)))
    .onValue(page =>
      app.set('routing/page', page));
  window.onpopstate = function() {
    navigate(window.location.pathname, false);
  };
  navigate(window.location.pathname, false);
}

function navigate(path, pushState = true){
  let route = router.getRoute(path);
  if(route) {
    routeEmitter.emit(route);
    if(pushState){
      history.pushState({}, "", path);
    }
  }
}

export default {initRouting, routeEmitter, navigate};