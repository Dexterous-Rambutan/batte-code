var React = require('react');
var io = require('socket.io-client');
var socket = require('../sockets/socket-helper');
var _ = require('lodash');
var ErrorList = require('./ErrorList');

var selfEditorOptions = {
  theme: "ace/theme/solarized_light",
  mode: "ace/mode/javascript",
  blockScrolling: Infinity,
  useSoftTabs: true,
  tabSize: 2,
  wrap: true
};
var challengerEditorOptions = _.create(selfEditorOptions, {
  theme: "ace/theme/solarized_dark",
  readOnly: true,
  highlightActiveLine: false,
  highlightGutterLine: false
});

var ChallengeArena = React.createClass({
  componentDidMount: function() {
    //setting up solo (player) editor
    var editor = ace.edit('editor');
    editor.setOptions(selfEditorOptions);
    this.props.arenaActions.storeEditor(editor);

    //setting up opponnent editor
    var editor2 = ace.edit('editor2');
    editor2.setOptions(challengerEditorOptions);
    this.props.arenaActions.storeEditorOpponent(editor2);

    this.props.arena.socket.on('won', function(data){
      this.props.arenaActions.lostChallenge();
    }.bind(this))

    this.props.arena.socket.on('playerLeave', function(data){
      this.props.arenaActions.playerLeave();
    }.bind(this))

    this.props.arena.socket.on('keypress', function(data){
      var array = data.split('');
      var obf = [];
      for(var i =0; i<array.length;i++){
        if (array[i] === ' ' || array[i] === '\n' || array[i] === ')' || array[i] === '(' || array[i] === '{' || array[i] === '}') {
          obf.push(array[i])
        } else {
          obf.push(String.fromCharCode(Math.floor(Math.random() * 52) + 65 ))
        }
      }
      this.props.arena.editorOpponent.setValue(obf.join(''))
    }.bind(this))


  },
  emitSocket: function () {

    if(this.props.arena.editorSolo.getSession().getValue()){
      this.props.arena.socket.emit('update', this.props.arena.editorSolo.getSession().getValue())
    }
  },
  submitProblem: function(){
      var errors = this.props.arena.editorSolo.getSession().getAnnotations();
      var content = this.props.arena.editorSolo.getSession().getValue();
      this.props.arenaActions.submitProblem(errors, content, this.props.arena.socket.id, this.props.arena.problem_id, this.props.user.github_handle, 'battle');
  },
  render: function() {

    return (
      <div>
        <div id="editor" onKeyPress={this.emitSocket} className='player'>
        </div>
        <div id="editor2" className='opponent'>
        </div>
        {this.props.user.isLoggedIn && this.props.view !== 'CHALLENGE_ARENA' ? <li><a href='/logout'>Logout</a></li> : null}
        {this.props.arena.content ? <button onClick={this.submitProblem}>Submit Solution</button>: null}
        <ul>
          <li>SYNTAX ERRORS: {this.props.arena.content ? <ErrorList syntaxMessage={this.props.arena.syntaxMessage} errors={this.props.arena.errors}/> : 'none'}</li>
          <li>SUBMISSION RESPONSE: {this.props.arena.content ? <div>{this.props.arena.submissionMessage}</div> : 'N/A'}</li>
          <li>{this.props.arena.opponentStatus}</li>
          <li>{this.props.arena.status}</li>
        </ul>
        <div>Console: </div><div>{this.props.arena.stdout}</div>

      </div>
    )
  },

  componentDidUpdate: function(){
    this.props.arena.editorSolo.setValue(this.props.arena.content,1);
  }
});

module.exports = ChallengeArena;
