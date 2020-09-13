// View toggles
document.querySelector('#all-posts-button').addEventListener('click', () => view_all());

const profileBtn = document.querySelector('#profile-button')
if (profileBtn) profileBtn.addEventListener('click', () => view_profile());

const followingBtn = document.querySelector('#following-button')
if (followingBtn) followingBtn.addEventListener('click', () => view_following());

// Load all by default

view_all();

function view_all() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#following-posts').style.display = 'none';

    fetch('/post', {
        method: 'GET'
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          ReactDOM.render(<Posts posts={result} />, document.querySelector('#all-posts > #post-feed'))
      });
}

function view_following() {
    // Show view_all and hide the rest
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#following-posts').style.display = 'block';
}

class Posts extends React.Component {
    render() {
        var feed = [];
        for (let i = 0; i < this.props.posts.length; i++){
            feed.push(<Post key={i} post={this.props.posts[i]}/>)
        }
        return <div>{feed}</div>
    }
}

class Post extends React.Component {
    render() {
        return(
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100">
                <h5 class="mb-1">@{this.props.post.user}</h5>
            </div>
            <p class="mb-1">{this.props.post.content}</p>
            <div>
                <small class="text-muted">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg>
                </small>
                <small class="text-muted px-2">•</small>
                <small class="text-muted">{this.props.post.timestamp}</small>
            </div>
        </a>
        )
    }
}