"use strict";

if (!localStorage.getItem('counter')) {
  localStorage.setItem('counter', 0);
}

function count() {
  var counter = localStorage.getItem('counter');
  counter++;
  document.querySelector('h1').innerHTML = "counter: ".concat(counter);
  localStorage.setItem('counter', counter);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('h1').innerHTML = "counter: ".concat(localStorage.getItem('counter'));
  document.querySelector('button').onclick = count;
});