# Ember Disqus

`ember-disqus` provides an easy way to integrate [Disqus](//disqus.com) with your Ember CLI app. This Ember addon also lazy-loads the Disqus API to improve performance of your app.

If you do not already have a free Disqus account, you will need to [create one](//disqus.com) to use this addon.

If you don't know what Disqus is, it's a widely used, free, cloud-hosted commenting system that makes it very easy to add commenting and conversation to your blog or website. This addon makes it even easier to add to Ember CLI apps.

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Displaying comments](#displaying-comments)
  - [Displaying comment counts](#displaying-comment-counts)
- [Lazy loading](#lazy-loading)
- [Development](#development)
- [Issues and questions](#issues-and-questions)
- [Features in the works](#features-in-the-works)


## Installation

Install via NPM

```sh
npm install --save ember-disqus
```

Then add your Disqus forum's shortname to your `config/environment.js` file:

```js
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

**Make sure you have added your Disqus shortname as above**

- [Displaying comments](#displaying-comments)
- [Displaying comment counts](#displaying-comment-counts)

### Displaying Comments

Disqus' main functionality is to display comments relating to a particular page - that being a 'thread' of comments. Disqus highly reccomends each thread be identified using a unique identifer instead of other means like the URL incase your URLs should change or you want to show the same thread on multiple routes.

Thus, this addon maintains those standards and **requires a unique thread identifier to be passed to the comment component**. For example:

```hbs
{{disqus-comments identifier=post.title}}
```

It's as simple as that!

For advanced functionality, you can also pass a `title` argument, which makes working with threads on Disqus.com a bit easier. By default Disqus will use the identifier or the page URL for the thread title. However, you can override this functionality using the `title` argument. For example:

```hbs
{{disqus-comments identifier=post.id title=post.title}}
```

Please note, the use of `title` is optional and not necessary if your `identifier` is something human-friendly like a title.

The third and final argument you can pass to the `{{disqus-comments}}` component is `categoryId`. This is used by Disqus to assign specific threads to categories. It is also optional. Please note, Disqus only supports the use of categories once you have manually added them in your [Disqus options](//octosmashed.disqus.com/admin/settings/advanced/).

```hbs
{{disqus-comments identifier=postId categoryId=category.id}}
```

This addon merely mirrors the capabilities of the DISQUS plugin. For more information on the [individual configuration variables please see here](//help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables).

### Displaying comment counts

This addon provides two easy ways to make use of Disqus' ability to show comment counts for specific threads:
1. As a link to the post
2. As a non-linking element

To turn any link in your Ember application into a comment count, simply pass a `disqusIdentifier` argument to the `{{link-to}}` helper. This identifier should be the same identifier used to display the comment thread you are referencing. For example:

```hbs
// templates/application.hbs
{{#link-to 'post' post disqusIdentifier='thread1'}}Click me!{{/link-to}}

// templates/post.hbs
{{disqus-comments identifier='thread1'}}
```

*or*

```hbs
// templates/application.hbs
{{#link-to 'post' post disqusIdentifier=post.title}}Click me!{{/link-to}}

// templates/post.hbs
{{disqus-comments identifier=title}}
```

Disqus will replace the contents of the `{{link-to}}` with the comment count.

If you do not wish to use a `{{link-to}}` or want to put the comment count in another link or styled element then the `{{disqus-comment-count}}` is the right option for you.

Like all of the other Disqus implementations in this plugin, the `{{disqus-comment-count}}` requires an `identifier` argument. For example:

```hbs
{{disqus-comment-count identifier=post.title}}
```

This will render the comment count for the specified comment thread in a lowly `<span>`. Simple!

## Lazy Loading

This addon also tries to improve page performance by waiting to request Diqsus assets until they are needed and the current document has finished loading. The reasoning behind this is that comments are usually complementary to the main content of a page and, thus, should not be loaded until after the main content has loaded.

In addition, this addon only loads the parts of the Disqus API that you need. If you don't use the comment count features then you won't load the comment count features!

You can disable all lazyloading functionality by passing an additional option in your `config/environment.js` file:

```js
module.exports = function(environment) {
  var ENV = {

    /* Stuff

    APP: {
      disqus: {
        lazyLoad: false,
        shortname: 'your-shortname-here'
      }
    },
  }
}
```

## Development

Should you wish to work on this project, it is easy to get acquainted with the source. There are only three files you need to look at:

- `addon/components/disqus-comment-count` - The comment count component that renders as a `<span>`
- `addon/components/disqus-comments` - The comment component that displays specific comment threads
- `addon/initializers/comment-count` - The initializer that extends the `{{link-to}}` view to allow any link to display a comment count. It also registers the function used to load the Disqus APIs and keep track of what APIs still need loading.

You can start the live-reloading server using:

```sh
// localhost:4200
ember s
```

Tests can be ran using:

```sh
ember test
```

## Issues and Questions

If you have an issue or question, please [open an issue](//github.com/sir-dunxalot/ember-disqus/issues/new). I'm happy to answer any questions no matter how simple!

For more information on using ember-cli, visit [http://www.ember-cli.com/](//www.ember-cli.com/).

### Features in the Works

- Better (aka existent) test suite
