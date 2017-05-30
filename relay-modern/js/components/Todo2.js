// @flow
import React from 'react';
import {
    createFragmentContainer,
    graphql
} from 'react-relay'

const Todo2 = ({todo}) => {
    const {additional} = todo
    return (
        <div>
            <h2>{additional}</h2>
        </div>
    );
};


export default createFragmentContainer(Todo2,
    graphql`fragment Todo2_todo on Todo{
    id
    additional
}`);