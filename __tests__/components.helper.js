import React from 'react';
import { BrowserRouter as ReactRouter } from 'react-router-dom';

/**
 * @export
 * @param Component
 * @return {function(*): *}
 * @constructor
 */
export const Router = (Component) => (props) => <ReactRouter><Component {...props}/></ReactRouter>;
