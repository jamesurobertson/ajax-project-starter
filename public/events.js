function updateScore(action) {
  fetch(`/kitten/${action}`, { method: 'PATCH' })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(data => {
      document.querySelector('.score').innerHTML = data.score;
    })
    .catch(error => error.json()
      .then(errJSON => document.querySelector('.error').innerHTML = errJSON.message))
}

function loadImage() {
  document.querySelector('.error').innerHTML = ''
  document.getElementById('upvote').disabled = false;
  document.getElementById('downvote').disabled = false;
  document.getElementById('submitBtn').disabled = false;
  fetch('/kitten/image')
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      document.querySelector('.loader').innerHTML = "Loading...";
      return res.json()
    })
    .then(data => {
      document.querySelector('.score').innerHTML = data.score;
      document.querySelector('.cat-pic').src = data.src;
      document.querySelector('.comments').innerHTML = "";
      document.querySelector('.loader').innerHTML = "";
      document.getElementById('user-comment').value = "";
    })
    .catch(error => error.json()
      .then(errJSON => {
        document.querySelector('.cat-pic').src = "";
        document.querySelector('.comments').innerHTML = "";
        document.getElementById('user-comment').value = "";
        document.querySelector('.score').innerHTML = 0;
        document.querySelector('.error').innerHTML = errJSON.message;
        document.getElementById('upvote').disabled = true;
        document.getElementById('downvote').disabled = true;
        document.getElementById('submitBtn').disabled = true;
      }))
}

window.addEventListener('DOMContentLoaded', event => {
  loadImage();

  document.getElementById('new-pic')
    .addEventListener('click', event => {
      loadImage();
    });

  document.getElementById('upvote')
    .addEventListener('click', event => {
      updateScore('upvote');
    });

  document.getElementById('downvote')
    .addEventListener('click', event => {
      updateScore('downvote');
    });


  document.querySelector('.comment-form')
    .addEventListener('submit', event => {
      event.preventDefault();
      let myForm = document.querySelector('.comment-form');
      const formData = new FormData(myForm);
      fetch('/kitten/comments', { method: 'POST', body: JSON.stringify({ comment: `${formData.get('user-comment')}` }), headers: { 'Content-Type': 'application/json' } })
        .then(res => {
          if (!res.ok) {
            return res;
          }
          return res.json()
        })
        .then(data => {
          let newComment = document.createElement('div');
          let deleteButton = document.createElement('button');
          deleteButton.setAttribute('id', `comment-${data.comments.length - 1}`);
          deleteButton.innerHTML = 'delete';
          newComment.innerHTML = data.comments[data.comments.length - 1] + ' ';
          newComment.appendChild(deleteButton);
          document.querySelector('.comments').appendChild(newComment);
        })
        .catch(error => error.json()
          .then(errJSON => document.querySelector('.error').innerHTML = errJSON.message))
    })

  document.querySelector('.comments')
    .addEventListener('click', event => {
      if (event.target.id.slice(0, 8) === 'comment-') {
        let targetCommentId = event.target.id.slice(8);
        fetch(`/kitten/comments/${targetCommentId}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) {
              return res;
            }
            return res.json()
          })
          .then(data => {
            document.querySelector('.comments').innerHTML = "";
            data.comments.forEach((comment, index) => {
              let newComment = document.createElement('div');
              let deleteButton = document.createElement('button');
              deleteButton.setAttribute('id', `comment-${index}`);
              deleteButton.innerHTML = 'delete';
              newComment.innerHTML = comment + ' ';
              newComment.appendChild(deleteButton);
              document.querySelector('.comments').appendChild(newComment);
            })
          })
          .catch(error => error.json()
            .then(errJSON => document.querySelector('.error').innerHTML = errJSON.message))
      }
    })
})
