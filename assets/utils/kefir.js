'use strict';

import {stream} from 'kefir';

function emitter(){
  let e;
  let s = stream(function(_e) {
    e = _e;
    return function() {
      e = null;
    };
  });

  s.emit = function(x) {
    if(e) {
      e.emit(x);
    }
  };
  
  s.error = function(x) {
    if(e) {
      e.error(x);
    }
  };
  
  s.end = function() {
    if(e) {
      e.end();
    }
  };
  
  return s;
}

export default {emitter};