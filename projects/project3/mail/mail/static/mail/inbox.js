// Use buttons to toggle between views
document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
document.querySelector('#compose').addEventListener('click', compose_email);

// By default, load the inbox
load_mailbox('inbox');

function view_email(id) {

	// Hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'none';
	document.querySelector('#mail-view').style.display = 'block';

	fetch(`emails/${id}`)
	.then(response => response.json())
	.then(email => {
		ReactDOM.render(<Email email={email} />, document.querySelector("#mail-view"));

	})

}


function compose_email() {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'block';
	document.querySelector('#mail-view').style.display = 'none';

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
	document.querySelector('#mail-view').style.display = 'none';

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
		ReactDOM.render(<Mailbox emails={emails} archiveCol={archiveCol} archiveShow={archiveShow} mailbox={mailbox} />, document.querySelector("#emails-list"));

		// const mailBtn = document.querySelectorAll('.list-group-item')
		// mailBtn.forEach(function(currentBtn){
		// 	currentBtn.addEventListener('click', function(event) {
		// 		event.stopPropagation();
		// 		fetch(`/emails/${this.dataset.id}`, {
		// 			method: 'PUT',
		// 			body: JSON.stringify({
		// 				read: true
		// 			})
		// 		})
		// 		.then(response => {
		// 			view_email(this.dataset.id);
		// 		})
		// 	})
		// })

	});
}

class Archive extends React.Component {
	unarchive = (event) => {
		// TODO
		// REMOVE THIS
		event.nativeEvent.stopImmediatePropagation();
		event.stopPropagation();
		fetch(`/emails/${this.props.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				archived: false
			})
		})
		.then(response => {
			load_mailbox(this.props.mailbox);
		})
	};

	archive = (event) => {
		// TODO
		// REMOVE THIS
		event.nativeEvent.stopImmediatePropagation();
		event.stopPropagation();
		fetch(`/emails/${this.props.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				archived: true
			})
		})
		.then(response => {
			load_mailbox(this.props.mailbox);
		})
	};

	render() {
		if (this.props.state == true) {
			return(
				<div onClick={this.unarchive} className="unarchive-btn">
					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="mb-1 bi bi-inbox" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
					</svg>
				</div>
			)
		} else {
			return(
				<div onClick={this.archive} className="archive-btn">
					<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="mb-1 bi bi-archive" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
					</svg>
				</div>
			)
		}
	}
}

class Read extends React.Component {
	read = (event) => {
		event.stopPropagation();
		fetch(`/emails/${this.props.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				read: true
			})
		})
		.then(response => {
			load_mailbox(this.props.mailbox);
		})
	};

	unread = (event) => {
		event.stopPropagation();
		fetch(`/emails/${this.props.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				read: false
			})
		})
		.then(response => {
			load_mailbox(this.props.mailbox);
		})
	};

	render() {
		if (this.props.state == true) {
			return(
				<div onClick={this.unread} className="unread-btn">
					<svg  width="1.5em" height="1.5em" viewBox="0 0 16 16" className="mb-1 bi bi-envelope" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
					</svg>
				</div>
			)
		} else {
			return(
				<div onClick={this.read} className="read-btn">
				<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="mb-1 bi bi-envelope-open" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  					<path fillRule="evenodd" d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.818l5.724 3.465L8 8.917l1.276.766L15 6.218V5.4a1 1 0 0 0-.53-.882l-6-3.2zM15 7.388l-4.754 2.877L15 13.117v-5.73zm-.035 6.874L8 10.083l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738zM1 13.117l4.754-2.852L1 7.387v5.73zM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2z"/>
				</svg>
				</div>
			)
		}
		
	}
}

class Email extends React.Component {
	render() {
		return(
			<div className="card">
            <h5 className="card-header">From: {this.props.email.sender}</h5>
            <div className="card-header text-muted">
                To: {this.props.email.recipients}
              </div>
            <div className="card-body">
                <h5 className="card-title">{this.props.email.subject}</h5>
                <p className="card-text">{this.props.email.body}</p>
                <footer className="blockquote-footer mt-3">Sent {this.props.email.timestamp}</footer>
            </div>
        </div>
		)
	}
}


class Mailbox extends React.Component {
  
	render() {
		// let content = [];
		// for (let i = 0; i < this.props.emails.length; i++) {
		// 	const item = this.props.emails[i];
		// 	const col = this.props.archiveCol;
		// 	const show = this.props.archiveShow;
		// 	const read = item.read ? "list-group-item-secondary" : "";
		// 	content.push(
		// 		<a onClick={this.view} key={item.id} id={item.id} className={`list-group-item list-group-item-action ${ read }`}>

		// 			<div className="d-flex w-100 justify-content-between">
		// 				<h5 className="mb-1">{item.subject}</h5>
		// 				<small className="text-muted">{item.timestamp}</small>
		// 			</div>
		// 			<div className="d-flex w-100 justify-content-between">
		// 				<div>
		// 					<p className="mb-1">{item.body}.</p>
		// 				</div>
		// 				<div>
		// 					<Read state={item.read} id={item.id} mailbox={this.props.mailbox} />
		// 					<br />
		// 					<Archive state={item.archived} id={item.id} mailbox={this.props.mailbox} />
		// 				</div>
		// 			</div>
		// 			<small className="text-muted">{item.sender}</small>
					
		// 		</a>
		// 	)
		// }
		console.log(this.props.emails)
		var items = [];
		for (let i = 0; i < this.props.emails.length; i++) {
			items.push(<MailItem key={i} email={this.props.emails[i]} mailbox={this.props.mailbox}/>);
		}
		return(
			<div>{items}</div>
		)
	}
}

class MailItem extends React.Component {
	view = (event) => {
		fetch(`/emails/${this.props.email.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				read: true
			})
		})
		.then(() => {
			view_email(this.props.email.id)
		})
	};

	render() {
		console.log(this.props.email);
		const read = this.props.email.read ? "list-group-item-secondary" : "";
		return(
			<a onClick={this.view} key={this.props.email.id} id={this.props.email.id} className={`list-group-item list-group-item-action ${ read }`}>

				<div className="d-flex w-100 justify-content-between">
					<h5 className="mb-1">{this.props.email.subject}</h5>
					<small className="text-muted">{this.props.email.timestamp}</small>
				</div>
				<div className="d-flex w-100 justify-content-between">
					<div>
						<p className="mb-1">{this.props.email.body}.</p>
					</div>
					<div>
						<Read state={this.props.email.read} id={this.props.email.id} mailbox={this.props.mailbox} />
						<br />
						<Archive state={this.props.email.archived} id={this.props.email.id} mailbox={this.props.mailbox} />
					</div>
				</div>
				<small className="text-muted">{this.props.email.sender}</small>
			</a>
		)
	}

}