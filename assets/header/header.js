/** @jsx dom */

'use strict';

import {dom} from 'deku';
import {shouldUpdate} from '../utils/deku';
import User from './user';
import {navigate} from '../routing/routing';

function render () {
  return <header><a onClick={() => navigate('/')}>Cembro project</a><User/></header>;
}

export default {render, shouldUpdate};