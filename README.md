# Ember Disqus

`ember-disqus` provides an easy way to integrate [Disqus](//disqus.com) with your Ember CLI app. This Ember addon also lazy-loads the Disqus API to improve performance of your app.

If you do not already have a free Disqus account, you will need to [create one](//disqus.com) to use this addon.

## Installation

Install via NPM

```
npm install --save ember-disqus
```

Then add your Disqus forum's shortname to your `config/environment.js` file:

```
module.exports = function(environment) {
  var ENV = {

    /* Stuff

    APP: {
      disqus: {
        shortname: 'your-shortname-here'
      }
    },
  }
}
```


## Usage

- [Displaying comments](#displaying-comments)
- [Displaying comment counts](#displaying-comment-counts)

### Displaying Comments

Disqus

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).


TODO

- New component for comment count
- Tests
- Move debounce period to options
