// @flow
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

const Todo2 = ({ todo }) => {
  const { text, additional } = todo;
  return (
    <div>
      <span>{text + '--' + additional}</span>
      <span><button>view comments</button></span>
    </div>
  );
};


export default createFragmentContainer(Todo2,
  graphql`fragment Todo2_todo on Todo{
    id
    text
    additional
}`);