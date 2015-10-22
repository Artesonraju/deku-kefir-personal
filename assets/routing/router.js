/** @jsx dom */

'use strict';

import {dom} from 'deku';

let propTypes = {
  page: { source: 'routing/page'}
};

function render (component) {
  let {props} = component;
  let page = props.page;
  return dom(page.component, page.args, []);
}

export default {propTypes, render};