import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;
  state = {
    error: null,
    bookmark: []
  };

  componentDidMount() {
      console.log(this.props.match.params.id)
      const bookmarkId = this.props.match.params.id
      fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${config.API_KEY}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(res.status)
          }
          return res.json()
        })
        .then(responseData => {
          this.setState({
            bookmark: responseData
          })
          console.log(this.state.bookmark)
        })
        .catch(error => {
          this.setState({ error })
        })
    }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const bookmarkId = this.props.match.params.id
    const { title, url, description, rating } = e.target
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
    }
    this.setState({ error: null })
    fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        this.context.updateBookmark(data)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error } = this.state
    const { title, url, rating, description} = this.state.bookmark
    return (
      <section className='AddBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder={title}
              //value={title} ==> when I do this I can't change value
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder={url}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              placeholder={description}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              placeholder={rating}
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark