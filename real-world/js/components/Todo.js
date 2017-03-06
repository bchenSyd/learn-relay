import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import { Link } from 'react-router'

class Todo extends React.Component {
  state = {
    isEditing: false,
  };

// babel stage 2 feature, see: https://babeljs.io/docs/plugins/preset-stage-2/
  //or:
//   plugins: ["transform-class-properties"]
  _handleCompleteChange = (e) => {  //declare instance properties; so that you don't have to call .bind(this) explicitly
    const complete = e.target.checked;
    this.props.relay.commitUpdate(
      new ChangeTodoStatusMutation({
        complete,
        todo: this.props.todo,
        viewer: this.props.viewer,
      })
    );
  };
  _handleDestroyClick = () => {
    this._removeTodo();
  };
  _handleLabelDoubleClick = () => {
    this._setEditMode(true);
  };
  _handleTextInputCancel = () => {
    this._setEditMode(false);
  };
  _handleTextInputDelete = () => {
    this._setEditMode(false);
    this._removeTodo();
  };
  _handleTextInputSave = (text) => {
    this._setEditMode(false);
    this.props.relay.commitUpdate(
      new RenameTodoMutation({ todo: this.props.todo, text })
    );
  };
  _removeTodo() {
    this.props.relay.commitUpdate(
      new RemoveTodoMutation({ todo: this.props.todo, viewer: this.props.viewer })
    );
  }
  _setEditMode = (shouldEdit) => {
    this.setState({ isEditing: shouldEdit });
  };
  renderTextInput() {
    return (
      <TodoTextInput
        className="edit"
        commitOnBlur={true}
        initialValue={this.props.todo.text}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
        />
    );
  }
  render() {
    const {  origId, text} = this.props.todo
    return (
      <li
        className={classnames({
          completed: this.props.todo.complete,
          editing: this.state.isEditing,
        })}>
        <div className="view">
          <input
            checked={this.props.todo.complete}
            className="toggle"
            onChange={this._handleCompleteChange}
            type="checkbox"
            />
            <Link to={`/details/${origId}`} > 
              <label onDoubleClick={this._handleLabelDoubleClick}
                    style={{cursor:'pointer'}}>
                    {text}
              </label>
            </Link>

          <button
            className="destroy"
            onClick={this._handleDestroyClick}
            >remove</button>
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
        origId,
        text,
        ${ChangeTodoStatusMutation.getFragment('todo')},
        ${RemoveTodoMutation.getFragment('todo')},
        ${RenameTodoMutation.getFragment('todo')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        ${ChangeTodoStatusMutation.getFragment('viewer')},
        ${RemoveTodoMutation.getFragment('viewer')},
      }
    `,
  },
});
