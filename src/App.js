import React, { Component } from 'react';
import './App.css';

// 用户输入框
class CommentInput extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      content: ''
    }
  }
  handleUsernameChange (event) {
    this.setState({
      username: event.target.value
    })
    console.log('用户名:'+event.target.value)
  }
  handleContentChange (event) {
    this.setState({
      content: event.target.value
    })
    console.log('评论内容:'+event.target.value)
  }
  handleSubmit (){
    if(this.props.onSubmit){
      const { username, content } = this.state
      this.props.onSubmit({username,content})
    }
    this.setState({content:''})
    console.log('点击发布:')
  }
  render (){
    return (
      <div className='comment-input'>
      <div className='comment-field'>
        <span className='comment-field-name'>用户名：</span>
        <div className='comment-field-input'>
          <input value={this.state.username}  onChange={this.handleUsernameChange.bind(this)}/>
        </div>
      </div>
      <div className='comment-field'>
        <span className='comment-field-name'>评论内容：</span>
        <div className='comment-field-input'>
          <textarea value={this.state.content} onChange={this.handleContentChange.bind(this)} />
        </div>
      </div>
      <div className='comment-field-button'>
        <button onClick={this.handleSubmit.bind(this)}>
          发布
        </button>
      </div>
    </div>
    )
  }
}



class CommentList extends Component {
  static defaultProps = {
    comments: []
  }
  render(){
    const comments = [
      {username: 'Jerry', content: 'Hello'},
      {username: 'Tomy', content: 'World'},
      {username: 'Lucy', content: 'Good'}
    ]
    return (
      <div>
        {comments.map((comment,i) => <Comment comment={comment} key={i} />)}
      </div>
    )
  }
}

class Comment extends Component {
  render () {
    return (
      <div className='comment'>
        <div className='comment-user'>
          <span>{this.props.comment.username} </span>：
        </div>
        <p>{this.props.comment.content}</p>
      </div>
    )
  }
}

class App extends Component {
  constructor () {
    super()
    this.state = {
      comments: []
    }
  }

  handleSubmitComment (comment){
    this.state.comments.push(comment)
    this.setState({
      comments: this.state.comments
    })
    console.log('提交参数:'+JSON.stringify(comment))
  }
  render(){
    return (
      <div className="wrapper">
        <CommentInput onSubmit={this.handleSubmitComment.bind(this)} /> 
        <CommentList comments={this.state.comments} />
      </div>
    )
  }
}

export default App;
