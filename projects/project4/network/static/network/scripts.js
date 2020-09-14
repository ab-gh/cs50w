// View toggles
document.querySelector('#all-posts-button').addEventListener('click', () => view_all());

const profileBtn = document.querySelector('#profile-button')
if (profileBtn) profileBtn.addEventListener('click', () => view_profile(profileBtn.dataset.id));

const followingBtn = document.querySelector('#following-button')
if (followingBtn) followingBtn.addEventListener('click', () => view_following());

// Load all by default

view_all();

function view_find(name) {
    if (name === "all") {
        view_all();
    } else if (name === "following") {
        view_following();
    } else if (name === "profile") {
        view_profile();
    }
}

function view_profile(user_id) {
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';

    
    fetch(`/user/${user_id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        ReactDOM.render(<Profile profile={result} view="profile" />, document.querySelector('#profile-page'))
    })
}

function view_all() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';

    fetch('/post', {
        method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
            ReactDOM.render(<Posts posts={result} view="all"/>, document.querySelector('#all-posts > #post-feed'));
            return false;
        });
    return false;
}

function view_following() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
}

class Profile extends React.Component {
    render() {
        return(
            <div>
                <h1 className="pt-3">@{this.props.profile.username}</h1>
                <div className="align-items-center">
                    <h5>Following <span className="badge badge-primary badge-pill">{this.props.profile.following}</span> • Followers <span className="badge badge-primary badge-pill">{this.props.profile.followers}</span></h5>
                </div>

                <h2 className="py-3">Posts</h2>

                <ul class="list-group" id="post-feed">
                    <Posts posts={this.props.profile.posts} view="profile" />
                </ul>

            </div>
        )
    }
}

class Posts extends React.Component {
    render() {
        var feed = [];
        for (let i = 0; i < this.props.posts.length; i++){
            feed.push(<Post key={i} post={this.props.posts[i]} view={this.props.view}/>)
        }
        return <div>{feed}</div>
    }
}

class Like extends React.Component {
    like = (event) => {
        event.stopPropagation();
        fetch(`/likes/${this.props.post.id}`, {
            method: 'POST',
            body: JSON.stringify({
				like: true
			})
		})
		.then(response => {
			view_find(this.props.view);
		})
    };
    unlike = (event) => {
        event.stopPropagation();
        fetch(`/likes/${this.props.post.id}`, {
            method: 'POST',
            body: JSON.stringify({
				like: false
			})
		})
		.then(response => {
			view_find(this.props.view);
		})
    };
    render() {
        if (this.props.post.liked) {
            return(
                <small style={{cursor: 'pointer'}} className="text-muted" onClick={this.unlike}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart" fill="DeepPink" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                </small>
            )
        } else {
            return(
                <small style={{cursor: 'pointer'}} className="text-muted" onClick={this.like}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg>
                </small>
            )
        }
    }
}

class Post extends React.Component {
    render() {
        return(
        <a className="list-group-item list-group-item-action">
            <div className="d-flex w-100">
                <span style={{cursor: 'pointer'}} className="badge badge-secondary badge-pill">
                    <h6 onClick={() => {view_profile(this.props.post.user_id)}} className="mb-1">@{this.props.post.user}</h6>
                </span>
            </div>
            <p className="my-1">{this.props.post.content}</p>
            <div>
                <small className="text-muted px-2">{this.props.post.likes}</small>
                <Like post={this.props.post} view={this.props.view}/>
                <small className="text-muted px-2">•</small>
                <small className="text-muted">{this.props.post.timestamp}</small>
            </div>
        </a>
        )
    }
}