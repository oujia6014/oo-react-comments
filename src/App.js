import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types'
// 用户输入框
class CommentInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  }
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
    if (this.props.onSubmit) {
      this.props.onSubmit({
        username: this.state.username,
        content: this.state.content,
        createdTime: +new Date()
      })
    }
    this.setState({content:''})
    console.log('点击发布:')
  }
  componentWillMount () {
    this._loadUsername()
  }
  _loadUsername () {
    const username = localStorage.getItem('username')
    console.log('获取用户名:'+username)
    if (username) {
      this.setState({ username })
    }
  }
  _saveUsername (username) {
    localStorage.setItem('username', username)
  }

  handleUsernameBlur (event) {
    this._saveUsername(event.target.value)
  }
  render (){
    return (
      <div className='comment-input'>
      <div className='comment-field'>
        <span className='comment-field-name'>用户名：</span>
        <div className='comment-field-input'>
          <input value={this.state.username}  onChange={this.handleUsernameChange.bind(this)} onBlur={this.handleUsernameBlur.bind(this)} />
        </div>
      </div>
      <div className='comment-field'>
        <span className='comment-field-name'>评论内容：</span>
        <div className='comment-field-input'>
          <textarea value={this.state.content} onChange={this.handleContentChange.bind(this)}  />
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
  static propTypes = {
    comments: PropTypes.array,
    onDeleteComment: PropTypes.func
  }
  static defaultProps = {
    comments: []
  }
  handleDeleteComment (index) {
    if (this.props.onDeleteComment) {
      this.props.onDeleteComment(index)
    }
  }
  render(){
    return (
      <div>
        {this.props.comments.map((comment,i) => 
          <Comment comment={comment} key={i} index={i} onDeleteComment={this.handleDeleteComment.bind(this)} />
        )}
      </div>
    )
  }
}




class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    onDeleteComment: PropTypes.func,
    index: PropTypes.number
  }
  constructor () {
    super()
    this.state = { timeString: '' }
  }
  componentWillMount () {
    this._updateTimeString()
    this._timer = setInterval(
      this._updateTimeString.bind(this),
      5000
    )
  }
  componentWillUnmount () {
    clearInterval(this._timer)
  }

  _updateTimeString () {
    const comment = this.props.comment
    const duration = (+Date.now() - comment.createdTime) / 1000
    this.setState({
      timeString: duration > 60
        ? `${Math.round(duration / 60)} 分钟前`
        : `${Math.round(Math.max(duration, 1))} 秒前`
    })
  }
  handleDeleteComment () {
    if (this.props.onDeleteComment) {
      this.props.onDeleteComment(this.props.index)
    }
  }
  _getProcessedContent(content){
    return content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
  }
  render () {
    const { comment } = this.props
    return (
      <div className='comment'>
        <div className='comment-user'>
          <span>{comment.username} </span>：
        </div>
        <p dangerouslySetInnerHTML={{
            __html: this._getProcessedContent(comment.content)
          }} />
        <span className='comment-createdtime'>
          {this.state.timeString}
        </span>
        <span className='comment-delete' onClick={this.handleDeleteComment.bind(this)}>
          删除
        </span>
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
  componentWillMount () {
    this._loadComments()
  }
  _loadComments () {
    let comments = localStorage.getItem('comments')
    console.log('获取评论列表:'+comments)
    if (comments) {
      comments = JSON.parse(comments)
      this.setState({ comments })
    }
  }
  handleDeleteComment (index) {
    const comments = this.state.comments
    comments.splice(index, 1)
    this.setState({ comments })
    this._saveComments(comments)
  }
  handleSubmitComment (comment){
    if (!comment) return
    if (!comment.username) return alert('请输入用户名')
    if (!comment.content) return alert('请输入评论内容')
    console.log('提交参数:'+JSON.stringify(comment))
    const comments = this.state.comments
    comments.push(comment)
    this.setState({ comments })
    this._saveComments(comments)
  }
  _saveComments (comments) {
    localStorage.setItem('comments', JSON.stringify(comments))
  }
  render(){
    return (
      <div className="wrapper">
        <CommentInput onSubmit={this.handleSubmitComment.bind(this)} /> 
        <CommentList comments={this.state.comments} onDeleteComment={this.handleDeleteComment.bind(this)} />
      </div>
    )
  }
}

export default App;
