# netlify-plugin-mastodon-alias

Use your website hosted on Netlify as an alias for your Mastodon username.

Inspired by [Maarten Balliauw's blog post](https://blog.maartenballiauw.be/post/2022/11/05/mastodon-own-donain-without-hosting-server.html) and [Phil Nash's Jekyll plugin](https://github.com/philnash/jekyll-mastodon_webfinger)

## Requirements

1. You'll need your existing Mastodon username and instance. This project does not actually deploy a Mastodon instance.
2. A working Netlify website wired up to your domain.

## Installation

```bash
npm install netlify-plugin-mastodon-alias
```

## Configuration

To your `netlify.toml` file add the following:

```toml
[[plugins]]
  package = "netlify-plugin-mastodon-alias"

  [plugins.inputs]
    username = "YOUR_MASTODON_USERNAME"
    instance = "YOUR_MASTODON_INSTANCE"
```

By default this will redirect any username on your domain to this username. For example both @hello@example.com and @bye@example.com would work. If you want to only match for one username then you can add the following configuration:

```diff
[[plugins]]
  package = "netlify-plugin-mastodon-alias"

  [plugins.inputs]
    username = "YOUR_MASTODON_USERNAME"
    instance = "YOUR_MASTODON_INSTANCE"
+    strictUsername = "hello"
```

In this case only @hello@example.com will continue to work but not @bye@example.com.

## License

MIT
