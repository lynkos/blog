<div align="center">
  <h1>Chirpy</h1>
  <img alt="pages-deploy.yml" src="https://img.shields.io/github/actions/workflow/status/lynkos/blog/pages-deploy.yml?logo=github">
  <img alt="Gem Version" src="https://img.shields.io/gem/v/jekyll-theme-chirpy?&logo=RubyGems&logoColor=white&label=gem&color=orange">
  <a target="_blank" href="https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE" title="Link to License"><img alt="License" src="https://img.shields.io/github/license/cotes2020/jekyll-theme-chirpy?color=goldenrod&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0ibTIzLjkgOS43LTMuNTQtNy44OS0uMDA1LS4wMWEuNTQyLjU0MiAwIDAgMC0uMDQxLS4wNzZsLS4wMTQtLjAxOGEuNTMzLjUzMyAwIDAgMC0uMTIyLS4xMjJsLS4wMTUtLjAxMWEuNTI4LjUyOCAwIDAgMC0uMDgtLjA0NGwtLjAyNC0uMDA5YS41MjcuNTI3IDAgMCAwLS4wNjctLjAybC0uMDI4LS4wMDdhLjUyNC41MjQgMCAwIDAtLjA5Ni0uMDFoLTYuODVjLTEuMDItMS41Mi0xLjAyLTEuNTQtMiAwaC02Ljg2YS41NDMuNTQzIDAgMCAwLS4wOTYuMDFsLS4wMjguMDA3YS41MTYuNTE2IDAgMCAwLS4wNjcuMDJsLS4wMjQuMDFhLjUzNy41MzcgMCAwIDAtLjA4LjA0M2wtLjAxNS4wMTFhLjUxLjUxIDAgMCAwLS4wNTcuMDQ3bC0uMDIuMDJhLjU0My41NDMgMCAwIDAtLjA0NS4wNTVsLS4wMTQuMDE4YS41MjIuNTIyIDAgMCAwLS4wNDEuMDc1bC0uMDA1LjAxdi4wMDFMLjExNiA5LjcyYS41MzEuNTMxIDAgMCAwLS4wOTYuMzA0YzAgMi4yOCAxLjg2IDQuMTQgNC4xNCA0LjE0czQuMTQtMS44NiA0LjE0LTQuMTRhLjUzLjUzIDAgMCAwLS4wOTYtLjMwNGwtMy4yNS02LjM3IDYuMDctLjAyM3YxOC4yYy0yLjU1LjI5NC03LjAxLjM4MS03IDIuNWgxNmMwLTIuMDMtNC40OC0yLjI3LTctMi41di0xOC4xbDUuNjktLjAyLTIuOTIgNi40OWMwIC4wMDIgMCAuMDAzLS4wMDIuMDA1bC0uMDA2LjAxOGEuNTQ1LjU0NSAwIDAgMC0uMDIzLjA3NWwtLjAwNS4wMmEuNTI0LjUyNCAwIDAgMC0uMDEuMDkydi4wMDhjMCAyLjI4IDEuODYgNC4xNCA0LjE0IDQuMTQgMi4yOCAwIDQuMTQtMS44NiA0LjE0LTQuMTRhLjUyOC41MjggMCAwIDAtLjEyLS4zMzJ6IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+"></a>
  <a target="_blank" href="https://deepwiki.com/lynkos/blog" title="DeepWiki for lynkos/blog repository"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</div>

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

```sh
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

## Credit
This repository is a modified fork of <a target="_blank" href="https://github.com/cotes2020/jekyll-theme-chirpy" title="Link to jekyll-theme-chirpy GitHub repository"><code>jekyll-theme-chirpy</code></a> by <a target="_blank" href="https://github.com/cotes2020" title="Link to cotes2020 profile on GitHub"><code>cotes2020</code></a>.
