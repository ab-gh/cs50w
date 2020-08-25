document.addEventListener('DOMContentLoaded', function() {

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

	// By default, load the inbox
	load_mailbox('inbox');
});

function compose_email() {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'block';

	// Clear out composition fields
	document.querySelector('#compose-recipients').value = '';
  	document.querySelector('#compose-subject').value = '';
	document.querySelector('#compose-body').value = '';
}

function create_mail_list(subject, timestamp, body, sender) {

	// A
	const a = document.createElement('a');
	a.className = "list-group-item list-group-item-action"
	a.href = "#"

	// Div
	const div = document.createElement('div');
	div.className = "d-flex w-100 justify-content-between";

	// h5
	const h5 = document.createElement('h5');
	h5.className = "mb-1";
	h5.textContent = subject;

	// small
	const small = document.createElement('small');
	small.textContent = timestamp;

	// p
	const p = document.createElement('p');
	p.textContent = body;

	// small
	const small2 = document.createElement('small');
	small2.textContent = sender;

	div.appendChild(h5);
	div.appendChild(small);

	a.appendChild(div);
	a.appendChild(p);
	a.appendChild(small2);

	return a
}

function load_mailbox(mailbox) {
  
	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#emails-list').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';

	// Show the mailbox name
	document.querySelector('#mailbox-name').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

	fetch(`/emails/${mailbox}`)
	.then(response => response.json())
	.then(emails => {
    // Print emails
    console.log(emails);

	document.querySelector('#emails-list').innerHTML = '';
	// ... do something else with emails ...
	for (i = 0; i < emails.length; i++) {
		console.log(emails[i]);
		const li = document.createElement('li');
		// li.innerHTML = emails[i]['subject'];
		document.querySelector('#emails-list').append(create_mail_list(emails[i]['subject'], emails[i]['timestamp'], emails[i]['body'], emails[i]['sender']));
	};


    




	});

	
}