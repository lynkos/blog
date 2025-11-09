---
share: true
title: My Blogging Setup
date: 2025-03-31 14:43:26 -0400
filename: 2025-03-31-blogging-setup
description: My blogging setup, aka how to create a blog with Obsidian and Chirpy (Jekyll theme)
categories:
  - tutorial
  - guide
  - computer-science
tags:
  - tutorial
  - technology
  - development
---
Though I use [Jekyll](https://jekyllrb.com), this should technically work with any blogging framework. This tutorial assumes that you are familiar with Jekyll, GitHub Pages, etc.

## Requirements
- [x] [Jekyll](https://jekyllrb.com) repository on [GitHub](https://github.com) (e.g. [my blog's repository](https://github.com/lynkos/blog), which is a modified fork of Jekyll theme [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy))
- [x] [Obsidian](https://obsidian.md)
- [x] [Enveloppe plugin](https://enveloppe.ovh)  ([GitHub repository](https://github.com/Enveloppe/obsidian-enveloppe))
- [x] (**OPTIONAL**) Obsidian app ([iPhone](https://apps.apple.com/us/app/obsidian-connected-notes/id1557175442) **OR** [Android](https://play.google.com/store/apps/details?id=md.obsidian))

## Default Template
```plaintext
---
share: false
title: {{title}}
date: {{date}} {{time}}
filename: "{{date}}-{{title}}"
description: >-
  
math: false
pin: false
toc: true
comments: true
categories:
tags:
---
```
{: file="default.txt" }

|      Key      | Description                                    |
| :------------ | :--------------------------------------------- |
| `share`       | When `true`, it will push to Github            |
| `title`       | Post title                                     |
| `date`        | Date and time created                          |
| `filename`    | Where your file will be saved in Github        |
| `description` | Post description; will appear below post title |
| `math`        | Enable MathJax for LaTeX processing            |
| `pin`         | When `true`, it will pin this post on website  |
| `toc`         | When `false`, the table of contents is hidden  |
| `comments`    | When `false`, the comments section is hidden   |
| `categories`  | Categories                                     |
| `tags`        | Tags                                           |

## Install Enveloppe
### Setup Plugin
1. Launch **Obsidian**
2. Open **Settings** (<kbd>⌘</kbd> + <kbd>,</kbd> )
3. Go to **Community plugins** tab
4. Turn off **Restricted mode** to enable community plugins
5. Click **Browse**, which is next to **Community plugins**
6. Enter `Enveloppe` in the searchbar
7. Click on [Enveloppe](obsidian://show-plugin?id=obsidian-mkdocs-publisher), then click **Install**
8. Once Enveloppe's installed, go to its Settings
9. Copy my Enveloppe settings

	```json
	{
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
	}
	```
	{: file="enveloppe.json" }

10. Click **Import settings** and paste the copied `enveloppe.json` (from the previous step) where it says `Paste configuration here...`, then click **Save**
11. Under **GitHub config**, enter your **GitHub username**, **Repository name**, and — if your main branch is not named `main` — **Main branch** name
12. Generate a fine-grained personal access token for your GitHub repository in order to give Enveloppe necessary permissions to work by going to your [GitHub settings](https://github.com/settings)
13. Scroll down and click [**Developer settings**](https://github.com/settings/apps)
14. Click **Personal access tokens**, click [**Fine-grained tokens**](https://github.com/settings/personal-access-tokens), then click [**Generate new token**](https://github.com/settings/personal-access-tokens/new)
15. Enter a descriptive **Token name** (e.g. `Enveloppe (Obsidian)`) and **Description** (e.g. `Enveloppe (Obsidian Vault → GitHub Repo)`)
16. Choose your GitHub account as **Resource owner**
17. Select **No expiration** for **Expiration**
18. Under **Repository access**, click **Only select repositories** then click **Select repositories** and select the GitHub repository for your Jekyll blog (e.g. `lynkos/blog`)
19. Click **Repository permissions** under **Permissions**
20. Always choose the minimal permissions necessary, so all options should be set to **Access: No access**, with the exception of the following:

	| Permission      | Access         | Reason                          |
	| :-------------- | :------------- | :------------------------------ |
	| Contents        | Read and write | Create branch                   |
	| Metadata        | Read-only      | Mandatory                       |
	| Pull requests   | Read and write | Create and merge pull requests  |
	| Workflows       | Read and write | Create/update file              |

21. Click **Generate token**
22. Copy the generated GitHub personal access token; it should start with `github_` followed by a long, random string of alphanumeric characters and underscores
23. Back in Enveloppe settings, paste it in the **GitHub token** area

#### Create Hotkeys
1. Go to **Hotkeys** tab
2. Scroll to **Enveloppe: Upload single current active note**
3. Click the **+** icon (says **Customize this command** when you hover over it)
4. Press <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>P</kbd> (aka <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>), or your preferred hotkey
5. Scroll to **Templates: Insert template**
6. Click the **+** icon (says **Customize this command** when you hover over it)
7. Press <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>T</kbd> (aka <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd>), or your preferred hotkey

Now we can automatically apply the template to any new post and auto-publish your Obsidian post to your blog!

> Make sure `share: true` in the frontmatter, otherwise it won't post
{: .prompt-important }

### Setup Mobile App
I use [Obsidian's iPhone app](https://apps.apple.com/us/app/obsidian-connected-notes/id1557175442) with iCloud, which I'll walk through in this section, though Obsidian also offers Obsidian Sync as an alternative. If you don't have an Apple device, iCloud isn't applicable.

#### iCloud
1. Once the Obsidian app is downloaded, check your iCloud Drive: There should be an `Obsidian` folder; if not, make one

2. Move all your vaults (i.e. directories) to `Obsidian` folder. E.g. my vault is named `Writing`, with path of `iCloud Drive/Obsidian/Writing/` (which, in my case, points to `$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Writing/`)

#### Obsidian Sync
// TODO

## Theme
I've always been a fan of dark mode color scheme, especially solarized dark. I also prefer to avoid cluttered UI, which is why I use the [**Minimal Theme Settings**](https://github.com/kepano/obsidian-minimal-settings) plugin.

1. Open **Settings** (<kbd>⌘</kbd> + <kbd>,</kbd> ) in **Obsidian**
2. Go to **Community plugins** tab
3. If it isn't already, turn off **Restricted mode** to enable community plugins
4. Click **Browse**, which is next to **Community plugins**
5. Enter `Minimal Theme Settings` in the searchbar
6. Click on [Minimal Theme Settings](obsidian://show-plugin?id=obsidian-minimal-settings), then click **Install**
7. Once it's installed, go to **Appearance** tab
8. Next to **Themes**, select **Minimal** to apply the theme
9. Go to **Minimal Theme Settings** tab
10. Modify the settings to your liking
	> Here are mine, for reference
	{: .prompt-tip }
	![color_scheme.png](assetsobsidiancolorscheme.png)
	![features.png](assetsobsidianfeatures.png)
	![layout_typography.png](assetsobsidianlayouttypography.png)

## Resources
This tutorial is inspired by [Alex Oliveira](https://alexoliveira.cc)'s blog post [Jekyll Blogging with Obsidian](https://alexoliveira.cc/guide/jekyll-with-obsidian).