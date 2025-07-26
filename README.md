<div align="center">
  <h1>Chirpy</h1>
  <img alt="pages-deploy.yml" src="https://img.shields.io/github/actions/workflow/status/lynkos/blog/pages-deploy.yml?logo=github">
  <img alt="Gem Version" src="https://img.shields.io/gem/v/jekyll-theme-chirpy?&logo=RubyGems&logoColor=white&label=gem&color=orange">
  <a target="_blank" href="https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE" title="Link to License"><img alt="License" src="https://img.shields.io/github/license/cotes2020/jekyll-theme-chirpy?color=goldenrod&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0ibTIzLjkgOS43LTMuNTQtNy44OS0uMDA1LS4wMWEuNTQyLjU0MiAwIDAgMC0uMDQxLS4wNzZsLS4wMTQtLjAxOGEuNTMzLjUzMyAwIDAgMC0uMTIyLS4xMjJsLS4wMTUtLjAxMWEuNTI4LjUyOCAwIDAgMC0uMDgtLjA0NGwtLjAyNC0uMDA5YS41MjcuNTI3IDAgMCAwLS4wNjctLjAybC0uMDI4LS4wMDdhLjUyNC41MjQgMCAwIDAtLjA5Ni0uMDFoLTYuODVjLTEuMDItMS41Mi0xLjAyLTEuNTQtMiAwaC02Ljg2YS41NDMuNTQzIDAgMCAwLS4wOTYuMDFsLS4wMjguMDA3YS41MTYuNTE2IDAgMCAwLS4wNjcuMDJsLS4wMjQuMDFhLjUzNy41MzcgMCAwIDAtLjA4LjA0M2wtLjAxNS4wMTFhLjUxLjUxIDAgMCAwLS4wNTcuMDQ3bC0uMDIuMDJhLjU0My41NDMgMCAwIDAtLjA0NS4wNTVsLS4wMTQuMDE4YS41MjIuNTIyIDAgMCAwLS4wNDEuMDc1bC0uMDA1LjAxdi4wMDFMLjExNiA5LjcyYS41MzEuNTMxIDAgMCAwLS4wOTYuMzA0YzAgMi4yOCAxLjg2IDQuMTQgNC4xNCA0LjE0czQuMTQtMS44NiA0LjE0LTQuMTRhLjUzLjUzIDAgMCAwLS4wOTYtLjMwNGwtMy4yNS02LjM3IDYuMDctLjAyM3YxOC4yYy0yLjU1LjI5NC03LjAxLjM4MS03IDIuNWgxNmMwLTIuMDMtNC40OC0yLjI3LTctMi41di0xOC4xbDUuNjktLjAyLTIuOTIgNi40OWMwIC4wMDIgMCAuMDAzLS4wMDIuMDA1bC0uMDA2LjAxOGEuNTQ1LjU0NSAwIDAgMC0uMDIzLjA3NWwtLjAwNS4wMmEuNTI0LjUyNCAwIDAgMC0uMDEuMDkydi4wMDhjMCAyLjI4IDEuODYgNC4xNCA0LjE0IDQuMTQgMi4yOCAwIDQuMTQtMS44NiA0LjE0LTQuMTRhLjUyOC41MjggMCAwIDAtLjEyLS4zMzJ6IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+"></a>
  <a target="_blank" href="https://deepwiki.com/lynkos/blog" title="DeepWiki for lynkos/blog repository"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a><br><br>
  
  This is a fork of <a target="_blank" href="https://github.com/cotes2020/jekyll-theme-chirpy" title="Link to jekyll-theme-chirpy GitHub repository"><code>jekyll-theme-chirpy</code></a> that has been modified to include a custom tabbed container plugin, "Important" prompt, and more.
</div>

## Tech Stack
* [Jekyll](https://jekyllrb.com)
* [Ruby](https://www.ruby-lang.org/en)
* [Obsidian](https://obsidian.md)
* [Enveloppe](https://enveloppe.ovh)
* [Giscus](https://giscus.app)

## Initial Setup
### Sync Fork with Upstream
To keep your fork up-to-date with the original repository (i.e. Chirpy)

1. Link the upstream (i.e. original) repository to fork
```sh
git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
```

> [!TIP]
> Use this command if you've already linked the upstream repository and want to re-link it
> ```sh
> git remote set-url upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
> ```

2. Confirm the remote URL

```sh
git remote -v
```

Output should look similar to:

```plaintext
origin  https://github.com/lynkos/blog.git (fetch)
origin  https://github.com/lynkos/blog.git (push)
upstream        https://github.com/cotes2020/jekyll-theme-chirpy.git (fetch)
upstream        https://github.com/cotes2020/jekyll-theme-chirpy.git (push)
```

```sh
git remote show
```

Output should look similar to:

```plaintext
origin
upstream
```

3. Fetch latest changes from upstream repository

```sh
git fetch upstream master
```

4. Switch to `master` branch (so it's recognized)

```sh
git checkout master
```

5. Switch to the branch you want to sync

```sh
git checkout main
```

6. Merge changes from upstream into local branch

```sh
git merge upstream/main
```

7. Push changes to your fork

```sh
git push origin main
```

### Setup Enveloppe
1. Open **Settings** (<kbd>⌘</kbd> + <kbd>,</kbd>)
2. Go to **Community plugins** tab
3. Turn off **Restricted mode** to enable community plugins
4. Click <kbd>Browse</kbd>, which is next to **Community plugins**
5. Enter `Enveloppe` in the searchbar
6. Click on [Enveloppe](obsidian://show-plugin?id=obsidian-mkdocs-publisher), then click <kbd>Install</kbd>
7. Once Enveloppe's installed, go to its Settings
8. Copy my Enveloppe settings
 <details open>
  <summary><strong>Enveloppe Settings</strong></summary>
  <pre>{
  "github": {
    "branch": "main",
    "automaticallyMergePR": true,
    "dryRun": {
      "enable": false,
      "folderName": "enveloppe"
    },
    "api": {
      "tiersForApi": "Github Free/Pro/Team (default)",
      "hostname": ""
    },
    "workflow": {
      "commitMessage": "[OBSIDIAN] Merge",
      "name": ""
    },
    "verifiedRepo": true
  },
  "upload": {
    "behavior": "fixed",
    "defaultName": "_posts",
    "rootFolder": "",
    "yamlFolderKey": "",
    "frontmatterTitle": {
      "enable": true,
      "key": "filename"
    },
    "replaceTitle": [
      {
        "regex": "/\\s+/",
        "replacement": "-",
        "type": "title"
      }
    ],
    "replacePath": [],
    "autoclean": {
      "includeAttachments": true,
      "enable": false,
      "excluded": []
    },
    "folderNote": {
      "enable": false,
      "rename": "index.md",
      "addTitle": {
        "enable": false,
        "key": "title"
      }
    },
    "metadataExtractorPath": ""
  },
  "conversion": {
    "hardbreak": false,
    "dataview": true,
    "censorText": [],
    "tags": {
      "inline": false,
      "exclude": [],
      "fields": []
    },
    "links": {
      "internal": true,
      "unshared": true,
      "wiki": true,
      "slugify": "strict",
      "unlink": true,
      "relativePath": true,
      "textPrefix": "/"
    }
  },
  "embed": {
    "attachments": true,
    "overrideAttachments": [],
    "keySendFile": [],
    "notes": false,
    "folder": "assets/obsidian",
    "convertEmbedToLinks": "keep",
    "charConvert": "->",
    "unHandledObsidianExt": [],
    "sendSimpleLinks": true,
    "forcePush": true,
    "useObsidianFolder": false
  },
  "plugin": {
    "shareKey": "share",
    "excludedFolder": [
      "templates"
    ],
    "copyLink": {
      "enable": false,
      "links": "",
      "removePart": [],
      "addCmd": false,
      "transform": {
        "toUri": true,
        "slugify": "lower",
        "applyRegex": []
      }
    },
    "setFrontmatterKey": "Set"
  }
}</pre>
</details> 

9. Click <kbd>Import settings</kbd> and paste the copied `enveloppe.json` (from the previous step) where it says `Paste configuration here...`, then click <kbd>Save</kbd>
10.  Under **GitHub config**, enter your **GitHub username**, **Repository name**, and — if your main branch is not named `main` — **Main branch** name
11.  Generate a fine-grained personal access token for your GitHub repository in order to give Enveloppe necessary permissions to work by going to your [GitHub settings](https://github.com/settings)
12.  Scroll down and click [**Developer settings**](https://github.com/settings/apps)
13.  Click **Personal access tokens**, click [**Fine-grained tokens**](https://github.com/settings/personal-access-tokens), then click [**Generate new token**](https://github.com/settings/personal-access-tokens/new)
14.  Enter a descriptive **Token name** (e.g. `Enveloppe (Obsidian)`) and **Description** (e.g. `Enveloppe (Obsidian Vault → GitHub Repo)`)
15.  Choose your GitHub account as **Resource owner**
16.  Select <kbd>No expiration</kbd> for **Expiration**
17.  Under **Repository access**, click <kbd>Only select repositories</kbd> then click <kbd>Select repositories</kbd> and select the GitHub repository for your Jekyll blog (e.g. `lynkos/blog`)
18. Click <kbd>Repository permissions</kbd> under **Permissions**
19. Always choose the minimal permissions necessary, so all options should be set to **Access: No access**, with the exception of the following:

| Permission    | Access         | Reason                         |
| :------------ | :------------- | :----------------------------- |
| Contents      | Read and write | Create branch                  |
| Metadata      | Read-only      | Mandatory                      |
| Pull requests | Read and write | Create and merge pull requests |
| Workflows     | Read and write | Create/update file             |

20. Click <kbd>Generate token</kbd>
21. Copy the generated GitHub personal access token; it should start with `github_` followed by a long, random string of alphanumeric characters and underscores
22. Back in Enveloppe settings, paste it in the **GitHub token** area

### Setup Giscus
Make sure that:
* Repository is [public](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/setting-repository-visibility#making-a-repository-public)
* [Giscus app](https://github.com/apps/giscus) is installed
* Discussions feature is [enabled for repository](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository)

Install by going to [Giscus](https://giscus.app) and filling out the form. Example code:

```html
<script src="https://giscus.app/client.js"
        data-repo="<GITHUB_USERNAME>/<REPO>"
        data-repo-id="<REPO_ID>"
        data-category="Announcements"
        data-category-id="<CATEGORY_ID>"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
```

## Usage
```sh
sh tools/run.sh
```

> [!TIP]
> Use this command if the previous one doesn't work
> ```sh
> bundle exec jekyll serve --incremental
> ```

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
Full credit for <a target="_blank" href="https://github.com/cotes2020/jekyll-theme-chirpy" title="Link to jekyll-theme-chirpy GitHub repository"><code>jekyll-theme-chirpy</code></a> goes to <a target="_blank" href="https://github.com/cotes2020" title="Link to cotes2020 profile on GitHub"><code>cotes2020</code></a>.
