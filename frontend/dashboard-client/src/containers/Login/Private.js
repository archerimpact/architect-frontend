import React from 'react';

export default class Private extends React.Component {

  static isPrivate = true

  render() {
    return <h1>{' Private '}</h1>;
  }
}