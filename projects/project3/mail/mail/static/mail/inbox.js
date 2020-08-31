// Use buttons to toggle between views
document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
document.querySelector('#compose').addEventListener('click', compose_email);

// By default, load the inbox
load_mailbox('inbox');


function compose_email() {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'block';

	// Clear out composition fields
	document.querySelector('#compose-recipients').value = '';
  	document.querySelector('#compose-subject').value = '';
	document.querySelector('#compose-body').value = '';

	document.querySelector('form > input').addEventListener('click', function() {
		const recipient =  document.querySelector('#compose-recipients').value;
		const subject =  document.querySelector('#compose-subject').value;
		const body = document.querySelector('#compose-body').value;

		fetch('/emails', {
			method: 'POST',
			body: JSON.stringify({
				recipients: recipient,
				subject: subject,
				body: body
			})
		  })
		  .then(response => response.json())
		  .then(result => {
				if (result.error) {
					a = document.createElement('div');
					a.className = "alert alert-danger my-3";
					a.textContent = `Error: ${result.error}`;
					document.querySelector('#error-box').innerHTML = "";
					document.querySelector('#error-box').prepend(a);
					console.log(result);
				} else if (result.message) {
					a = document.createElement('div');
					a.className = "alert alert-success my-3";
					a.textContent = `${result.message}`;
					document.querySelector('#error-box').innerHTML = "";
					document.querySelector('#error-box').prepend(a);
					console.log(result);
					load_mailbox('sent');
				}
			  	
		  });
	});


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

		// Reset mail list
		// document.querySelector('#emails-list').innerHTML = '';

		// Loop over each mail and create its element
		let archiveCol = mailbox === "inbox" ? "red" : "green";
		let archiveShow = mailbox === "sent" ? "none" : "block";
		ReactDOM.render(<Mail emails={emails} archiveCol={archiveCol} archiveShow={archiveShow} />, document.querySelector("#emails-list"));

		const archiveBtn = document.querySelectorAll('.archive-btn')
		archiveBtn.forEach(function(currentBtn){
  			currentBtn.addEventListener('click', function() {
				fetch(`/emails/${this.dataset.id}`, {
					method: 'PUT',
					body: JSON.stringify({
						archived: !!!parseInt(this.dataset.archived)
					})
				})
				.then(response => {
					load_mailbox(mailbox);
				})
			})
		})






	});

	
}


class Mail extends React.Component {
  
	render() {
		let content = [];
		for (let i = 0; i < this.props.emails.length; i++) {
			const item = this.props.emails[i];
			const col = this.props.archiveCol;
			const show = this.props.archiveShow;
			content.push(
				<a key={item.id} href="#" className="list-group-item list-group-item-action">
					<div className="d-flex w-100 justify-content-between">
						<h5 className="mb-1">{item.subject}</h5>
						<small className="text-muted">{item.timestamp}</small>
					</div>
					<div className="d-flex w-100 justify-content-between">
						<p className="mb-1">{item.body}.</p>
						<a data-archived={+item.archived} data-id={item.id} className="archive-btn" style={{display: show}}>
							<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-archive" fill={col} xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
							</svg>
						</a>
					</div>
					<small className="text-muted">{item.sender}</small>
				</a>
			)
		}
		return (
			<div>{content}</div>
		);
	}
}