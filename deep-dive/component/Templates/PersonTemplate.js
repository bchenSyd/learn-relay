import React, { Component } from 'react'
import Relay, { createContainer } from 'react-relay/classic'

const PersonTemplate = props => {
    const { person: { name, age, status, countryCode } } = props
    return (
        <div>
            <div id='search_result'>
                <div style={{ marginTop: 10 }}>
                    <span>name  --  </span>
                    <span>{name}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>age  --  </span>
                    <span>{age}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>status  --  </span>
                    <span>{status}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>countrycode (redux) --  </span>
                    <span>{countryCode}</span>
                </div>
            </div>
        </div>
    )
}

export default PersonTemplate;
