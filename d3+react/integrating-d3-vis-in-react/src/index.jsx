// unfinished/src/index.jsx
import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

const mountingPoint = document.createElement('div');
mountingPoint.className = 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(<App/>, mountingPoint);
