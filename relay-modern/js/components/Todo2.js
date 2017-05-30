// @flow
import React from 'react';
import {
    createFragmentContainer,
    graphql
} from 'react-relay'

const Todo2 = () => {
    return (
        <div>

        </div>
    );
};


export default createFragmentContainer(Todo2,
    graphql`fragment Todo2_todo on Todo{
    id
    additional
}`);