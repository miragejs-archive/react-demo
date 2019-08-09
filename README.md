# Mirage React demo

[![Build Status](https://travis-ci.org/miragejs/react-demo.svg?branch=master)](https://travis-ci.org/miragejs/react-demo)

To see the demo,

1. Clone this repo
1. `yarn install`
1. `yarn start`

## Usage in your own React app

Install Mirage:

```sh
yarn add -D @miragejs/server

# Or use npm
npm install -D @miragejs/server
```

Import and use Mirage!

```js
// App.js
import React, { Component } from "react";
import { Server } from "@miragejs/server";

let server = new Server();
server.get("/users", () => ({
  data: [
    { id: "1", name: "Sally" },
    { id: "2", name: "John" },
    { id: "3", name: "Susan" }
  ]
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    fetch("/api/users")
      .then(response => response.json())
      .then(json => this.setState({ users: json.data }));
  }

  render() {
    return (
      <ul>
        {this.state.users.map(user => (
          <li key={user.id}>{user.attributes.name}</li>
        ))}
      </ul>
    );
  }
}

export default App;
```
