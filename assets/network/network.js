'use strict';

import {mock} from '../global/global';
import xhr from 'xhr';
import {fromNodeCallback} from 'kefir';

let headers = {
  "Content-Type": "application/json"
};

function setHeader(header, value){
  headers[header] = value;
}

function removeHeader(header){
  delete headers[header];
}

function send(method, url, json){
  if(!mock){
    return fromNodeCallback(callback => {
      xhr({
        body: json,
        url: url,
        method: method,
        headers: headers
      }, function (err, resp, body) {
        if(err){
          return callback(err);
        }
        if(resp.statusCode < 200 && resp.statusCode > 202){
          return callback(resp.body);
        }
        callback(body);
      });
    });
  }
  return fromNodeCallback(fn => setTimeout(() => fn(null, {
    body: {
      name: "Etienne"
    }
  }), 1000));
}

export default {send, setHeader, removeHeader};