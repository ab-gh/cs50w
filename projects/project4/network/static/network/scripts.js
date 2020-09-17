// View toggles
document.querySelector('#all-posts-button').addEventListener('click', () => view_all());

const profileBtn = document.querySelector('#profile-button');
if (profileBtn) profileBtn.addEventListener('click', () => view_profile(profileBtn.dataset.id));

const followingBtn = document.querySelector('#following-button');
if (followingBtn) followingBtn.addEventListener('click', () => view_following());

const postBtn = document.querySelector('#new_post');
if (postBtn) postBtn.addEventListener('click', () => new_post());

// Load all by default

function view_find(name, profile) {
    if (name === "all") {
        view_all();
    } else if (name === "following") {
        view_following();
    } else if (name === "profile") {
        view_profile(profile);
    }
}

function new_post() {
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#new-post').style.display = 'block';

    ReactDOM.render(<New />, document.querySelector('#new-post'));
}

function view_profile(user_id) {
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';
    document.querySelector('#new-post').style.display = 'none';

    ReactDOM.render(<Profile profile={user_id} view="profile" user={document.querySelector('#profile-page').dataset.user} />, document.querySelector('#profile-page'))
}

function view_all() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#new-post').style.display = 'none';

    console.log("startview")
    ReactDOM.render(<PostsLoader view="all" user={document.querySelector('#profile-page').dataset.user}/>, document.querySelector('#all-posts > #post-feed'));
}

function view_following() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#new-post').style.display = 'none';
}


class New extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            char: 0,
            error: ""
        };
    }

    render() {
        return this.newPost();
    }

    newPost() {
        return (
            <div>
                <h1 className="py-3">New Post</h1>
                <Error error={this.state.error}/>
                <form>
                    <textarea onChange={this.updateResponse} name="content" form="new_post" rows="4" cols="50" defaultValue=""></textarea>
                    <br />
                    <small style={{color: this.state.char>280 ? "red" : "black"}} id="charcount">{this.state.char}</small><small>/280</small>
                    <br />
                    <input onClick={this.inputKeyPress} type="submit" className="btn btn-primary"></input>
                </form>
            </div>
        )
    }

    inputKeyPress = (event) => {
        event.preventDefault();
        if (this.state.char <= 280) {
            fetch('/post', {
                method: 'POST',
                body: JSON.stringify({
                    content: this.state.content
                })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                console.log(result);
                view_all();
            });
        } else {
            this.setState({
                error: "Your post must be 280 characters or shorter."
            })
            return false;
        }
    }

    updateResponse = (event) => {
        this.setState({
            content: event.target.value,
            char: event.target.value.length
        });
        
    }
    
}

class Error extends React.Component {
    render() {
        if (this.props.error) {
            return(
                <div class="alert alert-danger" role="alert">
                    {this.props.error}
                </div>
            )
        } else {
            return(
                <div></div>
            )
        }
    }
}

class Profile extends React.Component {
    constructor(props) {
        console.log("loader constructor");
        super(props);
        this.state = {
            pageNumber: 1,
            postsList: [{}],
            username: "",
            user_id: this.props.profile,
            followers_count: 0,
            following_count: 0,
            following: false,
            has_next: true,
            has_prev: true
        }
        this.fetchPage(this.state.pageNumber);
    };
    fetchPage(page_id) {
        console.log("loader pageFetch");
        fetch(`user/${this.props.profile}/page/${page_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            console.log("loader result");
            console.log(result);
            this.setState({
                postsList: result.posts,
                pageNumber: page_id,
                username: result.username,
                user_id: result.user_id,
                followers_count: result.followers_count,
                following_count: result.following_count,
                following: result.following,
                has_next: result.has_next,
                has_prev: result.has_prev   
            })
        })
    };
    nextPage = () => {
        let num = parseInt(this.state.pageNumber);
        this.fetchPage(++num);
    };
    prevPage = () => {
        let num = parseInt(this.state.pageNumber);
        this.fetchPage(--num);
    };
    follow = (event) => {
        event.stopPropagation();
        fetch(`/user/${this.props.profile}/follow`, {
            method: 'POST',
            body: JSON.stringify({
				follow: true
			})
		})
		.then(response => {
			this.setState({
                following: true,
                followers_count: ++this.state.followers_count
            })
		})
    };
    unfollow = (event) => {
        event.stopPropagation();
        fetch(`/user/${this.props.profile}/follow`, {
            method: 'POST',
            body: JSON.stringify({
                follow: false
			})
		})
		.then(response => {
			this.setState({
                following: false,
                followers_count: --this.state.followers_count   
            })
		})
    };
    render() {
        return(
            <div>
                <h1 className="pt-3">@{this.state.username}</h1>

                <Follow follow={this.follow} unfollow={this.unfollow} following={this.state.following} view={this.props.view} profile={this.state.user_id} profile_username={this.state.username} user={this.props.user} />

                <div className="align-items-center">
                    <h5>Following <span className="badge badge-primary badge-pill">{this.state.following_count}</span> • Followers <span className="badge badge-primary badge-pill">{this.state.followers_count}</span></h5>
                </div>

                <h2 className="py-3">Posts</h2>

                <ul className="list-group pb-5" id="post-feed">
                    <Posts prevPage={this.prevPage} nextPage={this.nextPage} page={this.state.pageNumber} posts={this.state.postsList} view="profile" />
                </ul>

            </div>
        )
    }
}

class Follow extends React.Component {
    render() {
        console.log(this.props.user);
        if (this.props.profile_username == this.props.user) {
            return(
                <div></div>
            )
        } else if (this.props.following) {
            return(
                <div className="pt-2 pb-3">
                    <button onClick={this.props.unfollow} type="button" className="btn btn-outline-danger">Unfollow @{this.props.profile_username}</button>
                </div>   
            )
        } else {
            return(
                <div className="pt-2 pb-3">
                    <button onClick={this.props.follow} type="button" className="btn btn-outline-primary">Follow @{this.props.profile_username}</button>
                </div>   
            )
        }
    }
}

class PostsLoader extends React.Component {
    constructor(props) {
        console.log("loader constructor");
        super(props);
        this.state = {
            pageNumber: 1,
            postsList: [{}]
        }
        this.fetchPage(this.state.pageNumber);
    };
    fetchPage(page_id) {
        console.log("loader pageFetch");
        fetch(`post/page/${page_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            console.log("loader result");
            this.setState({
                postsList: result.posts,
                pageNumber: page_id
            })
        })
    };
    nextPage = () => {
        let num = parseInt(this.state.pageNumber);
        this.fetchPage(++num);
    };
    prevPage = () => {
        let num = parseInt(this.state.pageNumber);
        this.fetchPage(--num);
    };
    render() {
        console.log("loader renderer");
        console.log(this.state.pageNumber)
        return(
            <div className="pb-5">
                <Posts prevPage={this.prevPage} nextPage={this.nextPage} posts={this.state.postsList} page={this.state.pageNumber} user={this.props.user} view={this.props.view}/>
            </div>
        )
    }
}


class Posts extends React.Component {
    render() {
        let feed = [];
        for (let i = 0; i < this.props.posts.length; i++) {
            feed.push(<Post key={i} post={this.props.posts[i]} user={this.props.user} view={this.props.view}/>)
        }
        return(
            <div>
                <button onClick={this.props.prevPage} type="button" className="mr-3 my-4 btn btn-primary">
                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg> Previous Page</button>
                <button onClick={this.props.nextPage} type="button" className="mx-3 my-4 btn btn-primary">
                    Next Page 
                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg></button>
                <div>{feed}</div>
            </div>
        )
    }
}

class Like extends React.Component {
    like = (event) => {
        event.stopPropagation();
        fetch(`/post/${this.props.post.id}/likes`, {
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
        fetch(`/${this.props.post.id}/likes`, {
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
            <p className="my-1 text-wrap">{this.props.post.content}</p>
            <div>
                <small className="text-muted px-2">{this.props.post.likes}</small>
                <Like post={this.props.post} view={this.props.view}/>
                <small className="text-muted px-2">•</small>
                <small className="text-muted">{this.props.post.timestamp}</small>
                <EditButton post={this.props.post} user={this.props.user}/>
            </div>
        </a>
        )
    }
}

class EditButton extends React.Component {
    render() {
        if (this.props.post.user === this.props.user) {
            return(
                <div id="edit-button">
                    <small className="text-muted px-2">•</small>
                    <span onClick={() => {edit_post(this.props.post.id)}} style={{cursor: 'pointer'}} className="badge badge-primary badge-pill">
                        <small className="mb-1">Edit</small>
                    </span>
                </div>
            )
        } else {
            return(
                <div></div>
            )
        }
    }
}

function edit_post(post_id) {
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#new-post').style.display = 'block';

    fetch(`/post/${post_id}`, {
        method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
            ReactDOM.render(<EditPost post={result} />, document.querySelector('#new-post'));
            return false;
        });


}

class EditPost extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.post.content,
            char: this.props.post.content.length,
            error: ""
        };
    }

    render() {
        return this.editPost();
    }

    editPost() {
        return (
            <div>
                <h1 className="py-3">Edit Post</h1>
                <Error error={this.state.error}/>
                <form>
                    <textarea onChange={this.updateField} name="content" form="new_post" rows="4" cols="50" defaultValue={this.props.post.content}></textarea>
                    <br />
                    <small style={{color: this.state.char>280 ? "red" : "black"}} id="charcount">{this.state.char}</small><small>/280</small>
                    <br />
                    <input onClick={this.KeyPress} type="submit" className="btn btn-primary" value="Save"></input>
                </form>
            </div>
        )
    }

    KeyPress = (event) => {
        event.preventDefault();
        if (this.state.char <= 280) {
            fetch(`/post/${this.props.post.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    content: this.state.content
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                view_all();
            });
        } else {
            this.setState({
                error: "Your post must be 280 characters or shorter."
            })
            return false;
        }
    }

    updateField = (event) => {
        this.setState({
            content: event.target.value,
            char: event.target.value.length
        });
    }
    
}



view_all();
