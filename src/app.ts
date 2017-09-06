import './assets/icon.png';
import './manifest.json';

import './style.scss';

import { setHyperscriptFunction } from 'compote';
import * as m from 'mithril';

import { initializeFirebaseApp } from './firebase';
import { Header } from './header';
import { initializeRouter } from './router';

setHyperscriptFunction(m);
initializeApp();

function initializeApp() {
  initializeFirebaseApp();
  registerServiceWorker();
  initializeRouter();
  mountHeader();
}

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  }
}

function mountHeader() {
  const header = document.querySelector('#header');
  m.mount(header, Header);
}
