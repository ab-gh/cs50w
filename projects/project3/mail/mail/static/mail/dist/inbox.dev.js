"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', function () {
    return load_mailbox('inbox');
  });
  document.querySelector('#sent').addEventListener('click', function () {
    return load_mailbox('sent');
  });
  document.querySelector('#archived').addEventListener('click', function () {
    return load_mailbox('archive');
  });
  document.querySelector('#compose').addEventListener('click', compose_email); // By default, load the inbox

  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block'; // Clear out composition fields

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('form > input').addEventListener('click', function () {
    var recipient = document.querySelector('#compose-recipients').value;
    var subject = document.querySelector('#compose-subject').value;
    var body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.error) {
        a = document.createElement('div');
        a.className = "alert alert-danger my-3";
        a.textContent = "Error: ".concat(result.error);
        document.querySelector('#error-box').innerHTML = "";
        document.querySelector('#error-box').prepend(a);
        console.log(result);
      } else if (result.message) {
        a = document.createElement('div');
        a.className = "alert alert-success my-3";
        a.textContent = "".concat(result.message);
        document.querySelector('#error-box').innerHTML = "";
        document.querySelector('#error-box').prepend(a);
        console.log(result);
        load_mailbox('sent');
      }
    });
  });
}

function create_mail_list(subject, timestamp, body, sender) {
  // A
  var a = document.createElement('a');
  a.className = "list-group-item list-group-item-action";
  a.href = "#"; // Div

  var div = document.createElement('div');
  div.className = "d-flex w-100 justify-content-between"; // h5

  var h5 = document.createElement('h5');
  h5.className = "mb-1";
  h5.textContent = subject; // small

  var small = document.createElement('small');
  small.textContent = timestamp; // p

  var p = document.createElement('p');
  p.textContent = body; // small

  var small2 = document.createElement('small');
  small2.textContent = sender;
  div.appendChild(h5);
  div.appendChild(small);
  a.appendChild(div);
  a.appendChild(p);
  a.appendChild(small2);
  return a;
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emails-list').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none'; // Show the mailbox name

  document.querySelector('#mailbox-name').innerHTML = "<h3>".concat(mailbox.charAt(0).toUpperCase() + mailbox.slice(1), "</h3>");
  fetch("/emails/".concat(mailbox)).then(function (response) {
    return response.json();
  }).then(function (emails) {
    // Reset mail list
    document.querySelector('#emails-list').innerHTML = ''; // Loop over each mail and create its element

    for (i = 0; i < emails.length; i++) {
      console.log(emails[i]);
      var li = document.createElement('li'); // li.innerHTML = emails[i]['subject'];

      document.querySelector('#emails-list').append(create_mail_list(emails[i]['subject'], emails[i]['timestamp'], emails[i]['body'], emails[i]['sender']));
    }

    ;
  });
}