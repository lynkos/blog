# Chirpy

[![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)][gem]&nbsp;
[![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)][mit]

## Tech Stack
* [Jekyll](https://jekyllrb.com)
* [Ruby](https://www.ruby-lang.org/en)
* [Obsidian](https://obsidian.md)
* [Enveloppe](https://enveloppe.ovh)
* [Giscus](https://giscus.app)

## Usage
Run dev environment
```sh
sh tools/run.sh
```

## Miscellaneous
When installing the [**Chirpy**][chirpy] theme through [RubyGems.org][gem], Jekyll can only read files in the folders `_data`, `_layouts`, `_includes`, `_sass` and `assets`, as well as a small part of options of the `_config.yml` file from the theme's gem. If you have ever installed this theme gem, you can use the command `bundle info --path jekyll-theme-chirpy` to locate these files.

To fully use all the features of **Chirpy**, you need to copy the other critical files from the theme's gem to your Jekyll site. The following is a list of targets:

```shell
.
├── _config.yml
├── _plugins
├── _tabs
└── index.html
```

To save you time, and also in case you lose some files while copying, we extract those files/configurations of the latest version of the **Chirpy** theme and the [CD][CD] workflow to here, so that you can start writing in minutes.

Check out the [theme's docs](https://github.com/cotes2020/jekyll-theme-chirpy/wiki) for more information.

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[chirpy]: https://github.com/cotes2020/jekyll-theme-chirpy/
[CD]: https://en.wikipedia.org/wiki/Continuous_deployment
[mit]: https://github.com/cotes2020/chirpy-starter/blob/master/LICENSE
