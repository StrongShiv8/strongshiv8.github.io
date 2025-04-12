<<<<<<< HEAD
# Blog
Check it out at [strongshiv8.github.io](https://strongshiv8.github.io)

# Rules
- Image format is `.webp`
- Cover image size `1200 x 630` with aspect ratio of `1.91 : 1`

# Development
## Commands
- Restore
```bash
$ bundle
```

- Build
```bash
$ bundle exec jekyll
```

- Include drafts into build
```bash
$ bundle exec jekyll --drafts
```

- Build and watch
```bash
$ bundle exec jekyll s
```

- Build like in production
```bash
$ JEKYLL_ENV=production bundle exec jekyll s
```

## Upgrade
1. Update version number
```diff
- gem "jekyll-theme-chirpy", "= 7.5.1"
+ gem "jekyll-theme-chirpy", "= 7.5.1"
```

2. Run `bundle`

## Copy assets

```bash
$ docker cp cover.webp kungfux.github.io:/workspaces/kungfux.github.io/assets/media/2024
```

## Customizations

- Wrap text in code blocks
  - `assets/css/jekyll-theme-chirpy.scss`
- Adjust styles for schemas and code blocks
  - `assets/css/jekyll-theme-chirpy.scss`
- Align lists by center
  - `assets/css/jekyll-theme-chirpy.scss`
- Single line post titles
  - `assets/css/jekyll-theme-chirpy.scss`
- Meta `author` tag
  - `_includes/head.html`
=======
# Chirpy Starter

[![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)][gem]&nbsp;
[![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)][mit]

When installing the [**Chirpy**][chirpy] theme through [RubyGems.org][gem], Jekyll can only read files in the folders
`_data`, `_layouts`, `_includes`, `_sass` and `assets`, as well as a small part of options of the `_config.yml` file
from the theme's gem. If you have ever installed this theme gem, you can use the command
`bundle info --path jekyll-theme-chirpy` to locate these files.

The Jekyll team claims that this is to leave the ball in the user’s court, but this also results in users not being
able to enjoy the out-of-the-box experience when using feature-rich themes.

To fully use all the features of **Chirpy**, you need to copy the other critical files from the theme's gem to your
Jekyll site. The following is a list of targets:

```shell
.
├── _config.yml
├── _plugins
├── _tabs
└── index.html
```

To save you time, and also in case you lose some files while copying, we extract those files/configurations of the
latest version of the **Chirpy** theme and the [CD][CD] workflow to here, so that you can start writing in minutes.

## Usage

Check out the [theme's docs](https://github.com/cotes2020/jekyll-theme-chirpy/wiki).

## Contributing

This repository is automatically updated with new releases from the theme repository. If you encounter any issues or want to contribute to its improvement, please visit the [theme repository][chirpy] to provide feedback.

## License

This work is published under [MIT][mit] License.

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[chirpy]: https://github.com/cotes2020/jekyll-theme-chirpy/
[CD]: https://en.wikipedia.org/wiki/Continuous_deployment
[mit]: https://github.com/cotes2020/chirpy-starter/blob/master/LICENSE
>>>>>>> v7.2.4
