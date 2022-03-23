# mico-duci
This project started as a simple backend for the LED lights, hence the name mico-duci, but after realizing we have a javascript backend here with full dns resolution, this will be the place for web projects and requests. We already have user auth, twitch oauth, endpoints, etc. It would be dumb not to go off of this. The next iteration on this code base will be for the picking of powerpoint topics and assigning them to users.

#### Setup

```bash
npm install

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
```

Start the database
```bash
brew services start mongodb-community
```

#### for Development

Install reqs (I had to use force, thanks mongoose)
``npm install --force``

Start the client
```bash
npm run dev
```

Start the server
```bash
npm start
```

#### for Production

```bash
npm run build
npm start
```

#### Other Commands

```bash
npm test
npm run lint
npm run lint:fix
npm run test:verbose
npm run test:watch-client
npm run test:watch-server
```

## Features

* Webpack conveniently bundles your code for you.
* Babel lets you use ES6/7 features.
* CSS pre-processor setup for LESS and SASS lets you keep your styles clean and organized.
* ESLint helps you maintain a high level of code quality.
* Jest gives you a robust testing framework to make sure your code works.

## Code Structure

```
- client
  - api
  - assets
    - images
    - icons
  - components
    - atoms
    - molecules
    - organisms
    - templates
    - pages
    - environment
  - hooks
  - store
    - actions
    - reducers
    - thunks
    - tests
  - styles
  - utils
- server
  - config
  - database
  - routes
- scripts
```

Component Heirarchy:

Environment > Pages > Templates > Organisms > Molecules > Atoms

This is based on atomic design. Learn more about [atomic design](http://bradfrost.com/blog/post/atomic-web-design/).

## Technologies

[React](https://facebook.github.io/react/) - View Library

[Redux](http://redux.js.org/) - State Manager

[Webpack](https://webpack.github.io/) - Module Bundler

[Express](http://expressjs.com/) - Node Application Framework

[MongoDB](https://www.mongodb.com/) - Document Database

[Mongoose](http://mongoosejs.com/) - MongoDB Framework

[Passport](http://www.passportjs.org/) - Authentication Framework

[React Notifications Component](https://teodosii.github.io/react-notifications-component/) - Notification System

[Bulma](http://bulma.io/) - CSS Framework

[React Bulma Companion](https://github.com/djizco/react-bulma-companion) - Bulma Component Library

[FontAwesome](http://fontawesome.io/) - Icons

[Ramda](http://ramdajs.com/) - Functional Library

[date-fns](https://date-fns.org/) - Date Functions Library

[SuperAgent](https://github.com/visionmedia/superagent) - HTTP Request Library

[ESLint](http://eslint.org/) - Code Linter

[Jest](https://jestjs.io/) - Testing Framework
