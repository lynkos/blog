---
share: true
title: Technical Guide on Playing Windows Games on macOS
description: Learn how to play Windows games on your Mac for free with Wine + Game Porting Toolkit (GPTk), DXMT, DXVK, MoltenVK, etc.
date: 2025-09-11 14:24:14 -0400
filename: 2025-09-11-playing-windows-games
categories:
  - tutorial
  - guide
  - computer-science
tags:
  - tutorial
  - gaming
  - mac
  - technology
  - windows
  - unix
  - graphics
  - development
---
> **This article/tutorial is still under construction. Feel free to bookmark this post to come back later, as there may be new information by then!**
{: .prompt-important }

With a little bit of tinkering, it's possible to run both macOS (i.e. native) AND Windows games on a MacBook Pro (M3 Max, in my case). Playable Windows games include Skyrim, Mass Effect series, Palworld, Schedule I, and many more!

This entire process can be quite daunting and confusing, and it is assumed that the reader:
- Has good terminal commands skills and is comfortable with using terminal/CLI
- Understands Wine concepts (e.g. `WINEPREFIX`, dll overrides, etc.)
- Knows how to launch Windows executables through Wine from terminal

If you're not tech savvy I don't recommend following this highly technical tutorial. Instead, try GUI wrappers like [Crossover](https://www.codeweavers.com/crossover) (paid), [Sikarugir](https://github.com/Sikarugir-App/Sikarugir), or [Whisky](https://getwhisky.app) (free, but no longer maintained).

## Background
Key concepts that will continue to show up throughout this writeup.

- Wine
- Wine bottles/prefixes
- Wine builds
- Graphics APIs (D3DMetal, DXMT, DXVK, etc.)

Directory structure is as follows:

```plaintext
$HOME/ 
├── ... 
├── Bottles/ 
│   ├── DXMT/
│   ├── DXVK/
│   ├── GPTk/
│   └── CrossOver/
├── ...
└── Wine/
    ├── dxmt/
    ├── dxvk/
    ├── gptk/
    └── crossover/
```
{: file="$HOME" }

### Bottles
I store my Wine prefixes, i.e. bottles, in `$HOME/Bottles`. Each bottle is virtual Windows environment (e.g. Windows 10) with its own C: drive and all its standard folders (e.g. Windows and Program Files), as well as:
- Windows registry
- System settings
- One or more Windows applications/software
- Saved user data
- Fonts
- And more

You can install multiple programs into a bottle, but it's sometimes better to create a new bottle for each application. Keeping applications in separate bottles prevents them from interacting with or damaging one another. For instance, you could test out a new version of a particular program in one bottle while keeping your original one in another. Multiple bottles are also helpful whenever a specific application requires otherwise undesirable settings.

The default Wine bottle, `.wine`, is located in your home directory (i.e. `$HOME/.wine`). However, I never use the default Wine bottle/prefix since I always use a specific Wine prefix (i.e. `$WINEPREFIX`).

### Builds
`wine` command loads and runs the given program, which can be a DOS, Windows 3.x, Win32, or Win64 executable (on 64-bit systems).[^wine]

The program name may be specified in DOS format (e.g. `C:\\WINDOWS\\SOL.EXE`{: .filepath}) or in Unix format (e.g. `/msdos/windows/sol.exe`{: .filepath}). You may pass arguments to the program being executed by adding them to the end of the command line invoking `wine`. E.g.

```sh
wine notepad "C:\\Temp\\README.txt"
wine notepad 'C:\Temp\README.txt'
wine notepad "$HOME/Temp/README.txt"
```
{: .nolineno }

It can also be one of the Windows executables shipped with Wine, in which case specifying the full path is not mandatory, e.g. `wine explorer` or `wine notepad`.

I store all my different versions of Wine (i.e. builds) in `$HOME/Wine`.

> Wine is **not isolated** from your system: if _you_ can access a file or resource with your user account, programs running in Wine _can too_—see [#Running Wine under a separate user account](https://wiki.archlinux.org/title/Wine#Running_Wine_under_a_separate_user_account) for possible precautions
{: .prompt-warning }

> Wine can also run malware—see [Wine FAQ on Malware compatibility](https://gitlab.winehq.org/wine/wine/-/wikis/FAQ#is-wine-malware-compatible)
{: .prompt-warning }

### Files
Basic Wine files[^winefiles]

<ul>
	<li><code>wine</code>: Wine program loader</li>
	<li><code>wineconsole</code>: Wine program loader for CUI (console) applications</li>
	<li><code>wineserver</code>: Wine server</li>
	<li><code>winedbg</code>: Wine debugger</li>
	<li><code>$WINEPREFIX/dosdevices</code>: Directory containing the DOS device mappings. Each file in that directory is a symlink to the Unix device file implementing a given device. For instance, if COM1 is mapped to <code>/dev/ttyS0</code> you'd have a symlink of the form <code>$WINEPREFIX/dosdevices/com1</code> -> <code>/dev/ttyS0</code>.<br>DOS drives are also specified with symlinks; for instance if drive D: corresponds to the CDROM mounted at <code>/mnt/cdrom</code>, you'd have a symlink <code>$WINEPREFIX/dosdevices/d:</code> -> <code>/mnt/cdrom</code>. The Unix device corresponding to a DOS drive can be specified the same way, except with <code>::</code> instead of <code>:</code>. So for the previous example, if the CDROM device is mounted from <code>/dev/hdc</code>, the corresponding symlink would be <code>$WINEPREFIX/dosdevices/d::</code> -> <code>/dev/hdc</code>.</li>
</ul>

## Requirements
- Apple Silicon Mac (i.e. M series)
- macOS 15 Sequoia or higher
- At least 16 GB of RAM or more (recommended since translated games require more resources)
- [Command Line Tools for Xcode 15+](https://developer.apple.com/xcode/resources) ([downloaded via the App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12))
-  [Game Porting Toolkit](https://developer.apple.com/downloads?q=porting%20toolkit) (from [Apple Developers](https://developer.apple.com/games/game-porting-toolkit))
- [Steam (Windows Version)](https://cdn.cloudflare.steamstatic.com/client/installer/SteamSetup.exe)
- **Optional** Game Controller

## Setup
1. Go to <a target="_blank" title="Link to Apple's Game Porting Toolkit site" href="https://developer.apple.com/games/game-porting-toolkit">the official page for Game Porting Toolkit</a>, scroll down to "**Evaluate your Windows executable on Apple silicon**", and click **Download the evaluation environment for Windows games**

![gptk.png](../assets/obsidian/gptk.png)

> You can also download Game Porting Toolkit in its entirety since it includes the evaluation environment, but it'll also include a bunch of stuff that you most likely won't use, such as example code, human interface guidelines, etc.
{: .prompt-info }

2. You'll be prompted to sign into your Apple account and create an Apple Developer account if you don't have one already (don't worry, it's free)

![apple_sign_in.png](../assets/obsidian/apple_sign_in.png)

3. Once redirected to the downloads page, click **Evaluation environment for Windows games 2.1.dmg** to download the evaluation environment

![download_gptk.png](../assets/obsidian/download_gptk.png)


4. Double-click the `.dmg` after it's downloaded to open/mount it

![gptk_downloads.png](../assets/obsidian/gptk_downloads.png)

5. Click <kbd>Agree</kbd> to the license agreement

![license_agreement.png](../assets/obsidian/license_agreement.png)

6. Once mounted, it'll open a window that should look similar to this

![eval_env.png](../assets/obsidian/eval_env.png)

You should also be able to see it in "Finder"

![eval_env2.png](../assets/obsidian/eval_env2.png)

7. Download <a target="_blank" title="Link to Xcode on Apple Developer site" href="https://developer.apple.com/xcode/resources">Command Line Tools for Xcode</a>, which you will need to <a target="_blank" title="Link to Xcode in the App Store" href="https://apps.apple.com/us/app/xcode/id497799835?mt=12">download via the App Store</a>

![app_store.png](../assets/obsidian/app_store.png)

8. Run the `.pkg` file
	- **Manually**: Double-click the `.pkg` file
	- Via command line (where `PKG_PATH` is the path to the `.pkg` file): `installer -pkg PKG_PATH -target <target_path>`

9. Open your terminal, then install Rosetta

![iterm.png](../assets/obsidian/iterm.png)

```sh
softwareupdate --install-rosetta
```
{: .nolineno }

> If you want to automatically agree to license, add `--agree-to-license` to command
> ```sh
> softwareupdate --install-rosetta --agree-to-license
> ```
> {: .nolineno }
{: .prompt-tip }

10. Enter x86_64 shell; all subsequent commands <strong>must</strong> be run in this shell

![x86_iterm.png](../assets/obsidian/x86_iterm.png)

```sh
arch -x86_64 /bin/bash
```
{: .nolineno }

11. Install x86 version of Homebrew

![homebrew_iterm.png](../assets/obsidian/homebrew_iterm.png)

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
{: .nolineno }

12. Set the path, depending on the number of Homebrew versions you have

If you use <strong>both x86 <em>and</em> ARM64</strong> versions of Homebrew, you can add the following to <code>.bashrc</code> (or your preferred shell config file) so it automatically switches based off architecture type

![bashrc1.png](../assets/obsidian/bashrc1.png)
	
```sh
if [ "$(arch)" = "arm64" ]; then
	eval "$(/opt/homebrew/bin/brew shellenv)"
else
	eval "$(/usr/local/bin/brew shellenv)"
	export PATH="/usr/local/bin:${PATH}"
fi
```
{: file="$HOME/.bashrc" }
	
Otherwise, if you **only have x86** version of Homebrew (which was installed in the previous step), execute this command to append the path (`eval "$(/usr/local/bin/brew shellenv)"`) to `.bash_profile`

![eval_iterm.png](../assets/obsidian/eval_iterm.png)

```sh
(echo; echo 'eval "$(/usr/local/bin/brew shellenv)"') >> $HOME/.bash_profile
eval "$(/usr/local/bin/brew shellenv)"
```
{: .nolineno }

13. Since your shell config file has been updated, restart the terminal and return to x86_64 shell

![x86_iterm.png](../assets/obsidian/x86_iterm.png)

```sh
arch -x86_64 /bin/bash
```
{: .nolineno }

14. Confirm path

![which_brew_iterm.png](../assets/obsidian/which_brew_iterm.png)

```sh
which brew
```
{: .nolineno }

> Update `PATH` environment variable (in your shell config file) if the previous command doesn't print `/usr/local/bin/brew`{: .filepath}; alternatively, you can fully specify the path to brew in the subsequent commands
{: .prompt-info }

## Installation
I have different versions of Wine on my system which I use for different purposes.
- **Game Porting Toolkit.app**: I use this if I want to use D3DMetal graphics API. Only downside is that this build uses an old version of Wine (7.7), so there are some bugs (e.g. window sizing, unable to download games, etc.). Don't use it to install Steam games. This is possible thanks to Apple's Game Porting Toolkit (GPTk): A translation layer that combines Wine with D3DMetal (which supports DirectX 11 and 12).
- **Wine Devel.app**: I use this if I want to use DXMT or DXVK graphics API. This build uses a recent version of Wine (10.13).
- **CrossOver.app**: I don't use this, but it contains some useful files that I can use with other Wine builds. See [Install CrossOver](2025-09-11-playing-windows-games.md#install-crossover) for more details.

| Prefix                    | Build Name       | Version     | Graphics API(s)                | Description                   |
| :------------------------ | :--------------- | :---------- | :----------------------------- | :---------------------------- |
| `$HOME/Bottles/GPTk`      | gptk/3.0b2       | Wine 7.7    | D3DMetal                       | Game Porting Toolkit 3 Beta 2 |
| `$HOME/Bottles/DXMT`      | dxmt/10.12       | Wine 10.12  | DXMT                           | DirectX to Metal              |
| `$HOME/Bottles/DXVK`      | dxvk/10.12       | Wine 10.12  | DXVK                           | DirectX to Vulkan             |
| `$HOME/Bottles/CrossOver` | crossover/23.7.1 | Wine 8.0.1  | D3DMetal, DXMT, DXVK, MoltenVK | CrossOver by CodeWeavers      |

Since we'll be working with several different Wine builds, we should create a directory containing each of these Wine builds to keep it organized.

```sh
mkdir -p $HOME/Wine && cd $HOME/Wine
mkdir dxmt dxvk gptk crossover
```
{: .nolineno }

Your `$HOME` directory should now look similar to this (where `...` denotes all other directories and files, which are currently irrelevant for this tutorial)

```plaintext
$HOME/
├── ...
├── Wine/
│   ├── dxmt/
│   ├── dxvk/
│   ├── crossover/
│   └── gptk/
└── ...
```

To set version of Wine depending on type, add to `PATH`. E.g.

```sh
export PATH="$HOME/Wine/DXMT/bin:$PATH"
```
{: .nolineno }

This way, `which wine` outputs `$HOME/Wine/10.12/bin/wine`

1. Create a new Wine prefix called `Games`

```sh
WINEPREFIX=$HOME/Games wine winecfg
```
{: .nolineno }

2. Once a "Wine configuration" shows up, change the version to **Windows 10**, then click **Apply** and **OK** to save and exit

![winecfg.png](../assets/obsidian/winecfg.png)

> If the "Wine configuration" window does not appear and no new icon appears in the Dock, make sure you've correctly installed:
> - `x86_64` version of Homebrew
> - `game-porting-toolkit` formula
{: .prompt-tip }

### Install Game Porting Toolkit
Apple's Game Porting Toolkit (GPTk) is a translation layer that combines Wine with D3DMetal (which supports DirectX 11 and 12).

> Make sure that GPTk's `.dmg` (downloaded from Apple's website) is already mounted; it should be located in `/Volumes` directory
> ![volumes.png](../assets/obsidian/volumes.png)
>
> Ensure you're in an x86_64 shell
> ![x86_iterm.png](../assets/obsidian/x86_iterm.png)
> 
> If not, run the following command:
> ```sh
> arch -x86_64 /bin/bash
> ```
> {: .nolineno }
{: .prompt-info }

**`game-porting-toolkit`**
Wine: `/Applications/Game Porting Toolkit.app/Contents/Resources/wine/bin/wine64`{: .filepath}

Create symlink in Wine dir for GPTk that points to homebrew-installed GPTk cask

```sh
ln -sf "/Applications/Game Porting Toolkit.app/Contents/Resources/wine" "$HOME/Wine/3.0b2-gptk"
```
{: .nolineno }

While the Homebrew-wine and Apple's GPTK lib is in `/Applications/Game\ Porting\ Toolkit.app/Contents/Resources/wine/lib/external/`

#### Version 3.0
1. Install Dean Greer's `game-porting-toolkit` via `x86` version of Homebrew (`/usr/local/bin/brew`{: .filepath})

```sh
brew install --cask --no-quarantine gcenx/wine/game-porting-toolkit
```
{: .nolineno }

**Version 3.0**
> Early in the macOS 16 Tahoe beta period these pre-built tools may still be carrying the prior version of D3DMetal. You can temporarily update these tools to use the latest version as follows.
{: .prompt-info }

2. Enter GPTk's library directory

```sh
cd /Applications/Game\ Porting\ Toolkit.app/Contents/Resources/wine/lib
```
{: .nolineno }

3. Rename current libraries (to keep a copy)

`-v3b2` suffix denotes that the copy's version is from GPTk 3.0

```sh
mv external external-v3
```
{: .nolineno }

3. Move `external` from drive to directory

```sh
mv "/Volumes/Evaluation environment for Windows games 3.0 beta 3/redist/lib/external" "/Applications/Game Porting Toolkit.app/Contents/Resources/wine/lib/external"
```
{: .nolineno }

`nvngx-on-metalfx.so`{: .filepath} alias missing in wine (old); only see `nvngx.so`{: .filepath}

```sh
mv wine wine-old
```
{: .nolineno }

```sh
/bin/ls "/Volumes/Evaluation environment for Windows games 3.0 beta 3/redist/lib/wine/x86_64-unix"
```
{: .nolineno }

```plaintext
atidxx64.so         d3d11.so            dxgi.so             nvngx-on-metalfx.so
d3d10.so            d3d12.so            nvapi64.so
```

```sh
/bin/ls "/Volumes/Evaluation environment for Windows games 3.0 beta 3/redist/lib/wine/x86_64-windows"
```
{: .nolineno }

```plaintext
atidxx64.dll         d3d12.dll            nvngx-on-metalfx.dll
d3d10.dll            dxgi.dll
d3d11.dll            nvapi64.dll
```

4. Update GPTk's library directory with new library from `.dmg` 

```sh
ditto "/Volumes/Evaluation environment for Windows games 3.0 beta 3/redist/lib/" .
```
{: .nolineno }

To enable experimental MetalFX integration, perform the following steps:
- Rename `wine/x86_64-unix/nvngx-on-metalfx.so`{: .filepath} to `wine/x86_64-unix/nvngx.so`{: .filepath} (if this hasn’t already been done) **DONE**
- Rename `wine/x86_64-windows/nvngx-on-metalfx.dll`{: .filepath} to `wine/x86_64-windows/nvngx.dll`{: .filepath} (if this hasn’t already been done) **DONE**
- Copy both `nvngx.dll`{: .filepath} and `nvapi64.dll`{: .filepath} to the `windows\system32` directory your Wine prefix’s virtual C: drive (open `$WINEPREFIX/drive_c/windows/system32`). Rename old versions in `system32` to `nvngx_orig.dll`{: .filepath} and `nvapi64_orig.dll`{: .filepath} **DONE**

#### Version 2.1 (OUTDATED)
1. Download Apple tap

```sh
brew tap apple/apple http://github.com/apple/homebrew-apple
```
{: .nolineno }

2. Install the `game-porting-toolkit` formula

```sh
brew install apple/apple/game-porting-toolkit
```
{: .nolineno }

> If during installation you see an error such as “Error: game-porting-toolkit: unknown or unsupported macOS version: :dunno”, your version of Homebrew doesn’t have macOS Sonoma support. Update to the latest version of Homebrew and try again.
> ```sh
> brew update ; brew install apple/apple/game-porting-toolkit
> ```
> {: .nolineno }
{: .prompt-tip }

3. Copy the Game Porting Toolkit library directory into Wine’s library directory

```sh
ditto /Volumes/Evaluation\ environment\ for\ Windows\ games\ 2.1/redist/lib/ $(brew --prefix game-porting-toolkit)/lib/
```
{: .nolineno }

4. Put the 3 scripts from the Game Porting Toolkit DMG into `/usr/local/bin`

```sh
cp /Volumes/Evaluation\ environment\ for\ Windows\ games\ 2.1/gameportingtoolkit* /usr/local/bin
```
{: .nolineno }

### Install Wine
This version of Wine can be used with DXMT and DXVK.

1. [Download the latest macOS Wine build](https://github.com/Gcenx/macOS_Wine_builds/releases)

2. Extract compressed download (v10.13 is named `wine-devel-10.13-osx64.tar.xz`{: .filepath})

```sh
tar -xvzf $HOME/Downloads/wine-devel-10.13-osx64.tar.xz
```
{: .nolineno }

3. Copy the `wine` directory into DXMT and DXVK

```sh
cp -r "$HOME/Downloads/Wine Devel.app/Contents/Resources/wine" "$HOME/Wine/dxmt"
cp -r "$HOME/Downloads/Wine Devel.app/Contents/Resources/wine" "$HOME/Wine/dxvk"
```
{: .nolineno }

4. Rename `wine` to its version number (aka [release version of macOS Wine builds](https://github.com/Gcenx/macOS_Wine_builds/releases)), which is `10.13` in this case

```sh
mv "$HOME/Wine/dxmt/wine" "$HOME/Wine/dxmt/10.13"
mv "$HOME/Wine/dxvk/wine" "$HOME/Wine/dxvk/10.13"
```
{: .nolineno }

5. Continue to [Install DXMT](2025-09-11-playing-windows-games.md#install-dxmt) and [Install DXVK](2025-09-11-playing-windows-games.md#install-dxvk), since we will need our Wine build(s) for those steps

// TODO: Instead of creating separate Wine copies for each graphics API, why not just use the same Wine build with all graphics API files (dlls, so, etc.), e.g. `winemetal_dxmt.dll`{: .filepath} vs `winemetal_dxvk.dll`{: .filepath}, `winemetal_orig.dll`{: .filepath}, etc. When setting a specific build (e.g. DXMT, DXVK, etc.), the relevant file(s) will be renamed (e.g. current `winemetal.dll`{: .filepath} is renamed to `winemetal_xyz.dll`{: .filepath}, then `winemetal_dxmt.dll`{: .filepath} is renamed to `winemetal.dll`{: .filepath} in order to enable DXMT).

#### Install DXMT
> Make sure to download Wine before continuing; see [Install Wine](2025-09-11-playing-windows-games.md#install-wine) for instructions.
{: .prompt-important }

[DXMT](https://github.com/3Shain/dxmt) is a Metal-based translation layer for Direct3D 11 (`d3d11`) and Direct3D 10 (`d3d10`), which allows running 3D applications on macOS using Wine.

> If you want to build DXMT yourself, skip steps 1 – 4 and refer to the ["Build" section in DXMT repository's `README.md`](https://github.com/3Shain/dxmt?tab=readme-ov-file#build).
> 
> Refer to [DXMT installer](2025-09-11-playing-windows-games.md#dxmt-installer) for a Bash script to automatically install DXMT into your Wine build.
{: .prompt-tip }

1. Go to [DXMT repository's releases](https://github.com/3Shain/dxmt/releases)

2. Find the most recent release (which, as of this writing, is [Version 0.61](https://github.com/3Shain/dxmt/releases/tag/v0.61))

3. Under **Assets**, download the attached GitHub Actions artifact (built with `-Dwine_builtin_dll=true`) named similarly to `dxmt-v0.60-builtin.tar.gz`{: .filepath} (do not download the Source code!)

4. Unzip the downloaded artifact by double-clicking it or running the following command (change path/filename if needed)

```sh
tar -xvzf $HOME/Downloads/dxmt-v0.60-builtin.tar.gz
```
{: .nolineno }

5. You should now have a directory containing `i386-windows`, `x86_64-unix`, and `x86_64-windows` subdirectories, each of which contains various files

6. Before proceeding, make sure you have the right path of the libraries for the version of Wine you're using! We'll set that path to environment variable `WINELIB` to make the following commands easier to follow; be sure to change the actual path if needed. If correctly set, the commands `echo $WINELIB` and `echo $DXMT_PATH` should print their respective specified path.

```sh
export WINEPATH="$HOME/Wine/dxmt/10.13"
export WINELIB="$WINEPATH/lib/wine"
export DXMT_PATH="$HOME/Downloads/v0.61"
export WINEPREFIX="$HOME/Bottles/DXMT"
```
{: .nolineno }

7. Move `$DXMT_PATH/x86_64-unix/winemetal.so`{: .filepath} into `x86_64-unix` directory in your Wine library

```sh
mv -i $DXMT_PATH/x86_64-unix/winemetal.so $WINELIB/x86_64-unix/
```
{: .nolineno }

8. Copy `$DXMT_PATH/x86_64-windows/winemetal.dll`{: .filepath} into `x86_64-windows` directory in your Wine library **AND** `system32` directory in your `WINEPREFIX`

```sh
cp -i $DXMT_PATH/x86_64-windows/winemetal.dll $WINELIB/x86_64-windows/winemetal.dll
mv -i $DXMT_PATH/x86_64-windows/winemetal.dll $WINEPREFIX/drive_c/windows/system32/
```
{: .nolineno }

> Using `cp` (copy) command instead of `mv` (move) since `winemetal.dll`{: .filepath} will be used in 2 separate locations. `mv` requires a destination directory, while `cp` should be destination file.
{: .prompt-info }

9. Move `$DXMT_PATH/x86_64-windows/d3d11.dll`{: .filepath} into `x86_64-windows` directory in your Wine library
```sh
mv -i $DXMT_PATH/x86_64-windows/d3d11.dll $WINELIB/x86_64-windows/
```
{: .nolineno }

10. Move `$DXMT_PATH/x86_64-windows/dxgi.dll`{: .filepath} into `x86_64-windows` directory in your Wine library
```sh
mv -i $DXMT_PATH/x86_64-windows/dxgi.dll $WINELIB/x86_64-windows/
```
{: .nolineno }

11. Optionally move `$DXMT_PATH/x86_64-windows/d3d10core.dll`{: .filepath} into `x86_64-windows` directory in your Wine library
```sh
mv -i $DXMT_PATH/x86_64-windows/d3d10core.dll $WINELIB/x86_64-windows/
```
{: .nolineno }

12. Ensure **NONE** of these dlls are set overrides `native,builtin`

> If you use CrossOver 25+, you can replace the files in `/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib/dxmt/` with files from the Github Actions artifact.
> 
> However, **DO NOT** open a support ticket to CodeWeavers if you have replaced these files.
{: .prompt-tip }

If all steps are successfully completed, you should be able to run your Wine commands as normal, e.g.

```sh
MTL_HUD_ENABLED=1 D3DM_SUPPORT_DXR=1 ROSETTA_ADVERTISE_AVX=1 WINEESYNC=1 WINEDLLOVERRIDES="dinput8=n,b" DXMT_LOG_LEVEL=error DXMT_LOG_PATH=$HOME/Wine/10.1-dxmt/logs WINEPREFIX=$HOME/Bottles/DXMT $HOME/Wine/10.1-dxmt/bin/wine "C:\Program Files (x86)\Steam\Steam.exe"
```
{: .nolineno }

Steam options:
`--no-sandbox --in-process-gpu --disable-gpu`

```sh
steam.exe -noverifyfiles -nobootstrapupdate -skipinitialbootstrap -norepairfiles -overridepackageurl
```
{: .nolineno }

I.e.

```sh
MTL_HUD_ENABLED=0 D3DM_SUPPORT_DXR=1 ROSETTA_ADVERTISE_AVX=1 WINEESYNC=1 WINEDLLOVERRIDES="dinput8=n,b;d3d11,d3d10,d3d12,dxgi=b" WINEPREFIX=$HOME/Games wine "C:\windows\system32\cmd.exe"
cd "Games\drive_c\Program Files (x86)\Steam"
steam.exe -noverifyfiles -nobootstrapupdate -skipinitialbootstrap -norepairfiles -overridepackageurl
```
{: .nolineno }

#### Install DXVK
> Make sure to download Wine before continuing; see [Install Wine](2025-09-11-playing-windows-games.md#install-wine) for instructions.
{: .prompt-important }

DXVK is a Vulkan-based translation layer for Direct3D 8/9/10/11 (Linux) // Direct3D 10/11 (macOS), which allows running 3D applications with Wine.

MoltenVK doesn't provide the required Vulkan extensions to use upstream DXVK so use modified fork [DXVK-macOS](https://github.com/Gcenx/DXVK-macOS).

> DXVK/Vulkan use the following env: `export MVK_CONFIG_RESUME_LOST_DEVICE=1`
> (wine doesn't handle `VK_ERROR_DEVICE_LOST` correctly)
{: .prompt-note }

1. Download and unpack [the latest DXVK package for macOS](https://github.com/Gcenx/DXVK-macOS/releases)
2. Install the downloaded DXVK package into a given wine prefix (i.e. copy or symlink the DLLs into the following directories as follows)

```sh
export WINEPREFIX=$HOME/Bottles/DXVK
cd $HOME/Downloads/dxvk-macOS-async
mv -i x64/*.dll $WINEPREFIX/drive_c/windows/system32
mv -i x32/*.dll $WINEPREFIX/drive_c/windows/syswow64
```
{: .nolineno }

3. Open `winecfg` and manually add DLL overrides for `d3d11` and `d3d10core`

```sh
WINEPREFIX=$HOME/Bottles/DXVK $HOME/Wine/dxvk/10.13/bin/wine winecfg
```
{: .nolineno }

4. Verify that your application uses DXVK instead of wined3d by enabling the HUD

```sh
DXVK_CONFIG_FILE=$HOME/Wine/dxvk/10.13/dxvk.conf DXVK_HUD=full
```
{: .nolineno }

In order to remove DXVK from a prefix, remove the DLLs and DLL overrides, and run `wineboot -u` to restore the original DLL files.

while for `dxvk` , there shouldn't be (i.e. I shouldn't add, b/c it didn't originally come w/) a `winemetal.dll`{: .filepath} in its `$WINEPREFIX`

### Update MoltenVK
1. [Download latest MoltenVK release](https://github.com/KhronosGroup/MoltenVK/releases)

2. Open terminal and set variables

```sh
WINE_LIB="$HOME/Wine/dxmt/10.13/lib"
MVK_DYLIB="$HOME/Downloads/MoltenVK/MoltenVK/dylib/macOS/libMoltenVK.dylib"
```
{: .nolineno }

3. Backup original copy by renaming `libMoltenVK.dylib`{: .filepath} in Wine build's lib to `libMoltenVK_orig.dylib`{: .filepath}

```sh
mv -i "$WINE_LIB/libMoltenVK.dylib" "$WINE_LIB/libMoltenVK_orig.dylib"
```
{: .nolineno }

4. Move new MoltenVK dylib into Wine build's lib

```sh
mv -i "$MVK_DYLIB" "$WINE_LIB"
```
{: .nolineno }

### Install Steam
> Make sure the Windows version of Steam is located in your `Downloads` folder before installing
> 
> Also, make sure that you're in an x86_64 shell
> ![x86_iterm.png](../assets/obsidian/x86_iterm.png)
> 
> If not, run the following command:
> ```sh
> arch -x86_64 /bin/bash
> ```
> {: .nolineno }
{: .prompt-info }

You can use the installer script in [Steam Installer](2025-09-11-playing-windows-games.md#steam-installer), or complete the following steps.

1. Install the Windows version of Steam

```sh
WINEPREFIX="$HOME/Games" wine "$HOME/Downloads/SteamSetup.exe"
```
{: .nolineno }

2. Run the Windows version of Steam to make sure it works

```sh
WINEPREFIX="$HOME/Games" wine "C:\Program Files (x86)\Steam\steam.exe"
```
{: .nolineno }

3. If it works, continue to [Usage](2025-09-11-playing-windows-games.md#usage) section. Otherwise, follow the steps in [[#`steamwebhelper` not responding]] section before moving onto the [Usage](2025-09-11-playing-windows-games.md#usage) section.

### Install CrossOver
Install pre-built version of CrossOver v23.7.1 (Wine 8.0.1) via `x86` version of Homebrew (`/usr/local/bin/brew`{: .filepath})

```sh
brew install --cask --no-quarantine gcenx/wine/wine-crossover
```
{: .nolineno }

Create symlink

```sh
ln -s "/Applications/Wine Crossover.app/Contents/Resources/wine" "$HOME/Wine/23.7.1-crossover"
```
{: .nolineno }

Version: Latest (presumably)

Most compatible; has all graphics APIs

`WINEPREFIX=$HOME/Bottles/Test "/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/CrossOver-Hosted Application/wine" winecfg`

CrossOver's game porting toolkit lib is in `/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib64/apple_gptk/external/`

### Install Winetricks
// TODO

## Configuration
Configuring Wine is typically accomplished using:
- [control](https://gitlab.winehq.org/wine/wine/-/wikis/Commands/control) — Wine's implementation of the [Windows Control Panel](https://en.wikipedia.org/wiki/Control_Panel_\(Windows\) "wikipedia:Control Panel (Windows)"), which can be started by running `wine control`
- [regedit](https://gitlab.winehq.org/wine/wine/-/wikis/Commands/regedit) — Wine's [registry](https://en.wikipedia.org/wiki/Windows_Registry "wikipedia:Windows Registry") editing tool, which can be started by running `regedit`—see also [Useful Registry Keys](https://gitlab.winehq.org/wine/wine/-/wikis/Useful-Registry-Keys)
- [winecfg](https://gitlab.winehq.org/wine/wine/-/wikis/Commands/winecfg) — a [GUI](https://en.wikipedia.org/wiki/Graphical_user_interface "wikipedia:Graphical user interface") configuration tool for Wine, which can be started by running `winecfg`

See [Programs](https://gitlab.winehq.org/wine/wine/-/wikis/Commands#programs) for the full list.

## Usage
> Ensure you're in an x86_64 shell
> ![x86_iterm.png](../assets/obsidian/x86_iterm.png)
> 
> If not, run the following command:
> ```sh
> arch -x86_64 /bin/bash
> ```
> {: .nolineno }
{: .prompt-info }

- **Steam**: `"C:\Program Files (x86)\Steam\steam.exe"`{: .filepath}
- **Game**: `"C:\Program Files (x86)\Steam\steamapps\common\MyGame\MyGame.exe"`{: .filepath}

### Launch Steam
If you want to play the game via Steam. This is the basic command; it runs Steam with Wine. You can add additional environment variables. Refer to [Environment Variables](2025-09-11-playing-windows-games.md#environment-variables) section for a list of compatible environment variables.
```sh
WINEPREFIX=$HOME/Games wine "C:\Program Files (x86)\Steam\steam.exe"
```
{: .nolineno }

![whole_steam.png](../assets/obsidian/whole_steam.png)

![steam_menubar.png](../assets/obsidian/steam_menubar.png)

### Launch Directly
You can launch the game directly to avoid Steam's extra processes. This may improve performance, but you won't be able to use certain Steam features (e.g. Steam Cloud, online, etc.).

```sh
WINEPREFIX=$HOME/Games wine "C:\Program Files (x86)\Steam\steamapps\common\MyGame\MyGame.exe"
```
{: .nolineno }

> Replace `MyGame` with the name of your game; if it isn't in Steam or its path is different, update the command path accordingly.
{: .prompt-info }

For example, if you want to enable e-sync and disable the Metal Performance HUD when running `MyGame.exe`.

```sh
MTL_HUD_ENABLED=0 WINEESYNC=1 WINEPREFIX=$HOME/Games wine "C:\Program Files (x86)\Steam\steamapps\common\MyGame\MyGame.exe"
```
{: .nolineno }

Feel free to add and remove environment variables as you like; you're not constrained to the aforementioned ones. Refer to [Environment Variables](2025-09-11-playing-windows-games.md#environment-variables) section for a list of compatible environment variables.

**GPTk**
D3DMetal is included in Game Porting Toolkit, so you should be able to use it if you have successfully setup and built Game Porting Toolkit. It supports DirectX 11 (`DX11`) and DirectX 12 (`DX12`) programs.

```sh
WINEPREFIX=$HOME/Bottles/GPTk $HOME/Wine/gptk/3.0b3/bin/wine64 winecfg
```
{: .nolineno }

2. Run the Windows version of Steam to make sure it works

// TODO: Use below for `steam-gptk` alias
`MTL_HUD_ENABLED=0 D3DM_SUPPORT_DXR=1 ROSETTA_ADVERTISE_AVX=1 WINEESYNC=1 WINEDLLOVERRIDES="dinput8=n,b;d3d11,d3d10,d3d12,dxgi=b" WINEDEBUG=-all WINEPREFIX=$HOME/Bottles/GPTk $HOME/Wine/gptk/3.0b3/bin/wine64 "C:\Program Files (x86)\Steam\steam.exe"`

### Stop Running Wine
All running `wine` and `wineconsole` processes are stopped at once using the [`wineserver -k`](https://gitlab.winehq.org/wine/wine/-/wikis/Wine-User's-Guide#-k-n) command.

```sh
wineserver -k 15
```
{: .nolineno }

This command is `WINEPREFIX`-dependent, so when using a custom Wine prefix, run i.e.

```sh
WINEPREFIX=$HOME/Games wineserver -k
```
{: .nolineno }

Alternatively, try this command:

```sh
killall -9 wineserver && killall -9 wine64-preloader
```
{: .nolineno }

## Appendix
### Environment Variables
#### Wine
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Options</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
         <tr>
            <td><code>WINE</code></td>
            <td>Specify which version of Wine to use, if you have multiple different versions.</td>
            <td>Wine path (i.e. <code>/path/to/your/wine</code>)</td>
            <td><code>WINE="/usr/local/bin/wine64"</code></td>
        </tr>
        <tr>
            <td><code>WINEPREFIX</code></td>
            <td>Directory where Wine stores its data (default is <code>$HOME/.wine</code>). This directory is also used to identify the socket which is used to communicate with the <strong>wineserver</strong>. All <strong>wine</strong> processes using the same <strong>wineserver</strong> (i.e. same user) share certain things like registry, shared memory, and config file. By setting <code>WINEPREFIX</code> to different values for different <strong>wine</strong> processes, it is possible to run a number of truly independent <strong>wine</strong> processes.</td>
            <td></td>
            <td><code>WINEPREFIX="$HOME/Bottles/DXMT"</code></td>
        </tr>
        <tr>
            <td><code>WINESERVER</code></td>
            <td>Specifies the path and name of the <strong>wineserver</strong> binary. If not set, Wine will look for a file named "wineserver" in the path and in a few other likely locations.</td>
            <td></td>
            <td><code>WINESERVER=$HOME/Wine/dxmt/10.12/bin/wineserver</code></td>
        </tr>
        <tr>
            <td><code>WINEDEBUG</code></td>
            <td>Turns debugging messages on or off; can be used to silence logs, enable detailed logging for components, or filter specific messages. The syntax of the variable is of the form <code>[<em>class</em>][<strong>+</strong>|<strong>-</strong>]<em>channel</em>[,[<em>class2</em>][<strong>+</strong>|<strong>-</strong>]<em>channel2</em>]</code><br><br><em>class</em> is optional and can be one of the following: <strong>err</strong>, <strong>warn</strong>, <strong>fixme</strong>, or <strong>trace</strong>. If <em>class</em> is not specified, all debugging messages for the specified channel are turned on. Each channel will print messages about a particular component of Wine. The following character can be either <strong>+</strong> or <strong>-</strong> to switch the specified channel on or off respectively. If there is no <em>class</em> part before it, a leading <strong>+</strong> can be omitted. Note that spaces are not allowed anywhere in the string.</td>
            <td></td>
            <td>
	            <ul>
		            <li><code>WINEDEBUG=warn+all</code><br>will turn on all warning messages (recommended for debugging).</li>
		            <li><code>WINEDEBUG=warn+dll,+heap</code><br>will turn on DLL warning messages and all heap messages.</li>
		            <li><code>WINEDEBUG=fixme-all,warn+cursor,+relay</code><br>will turn off all FIXME messages, turn on cursor warning messages, and turn on all relay messages (API calls).</li>
		    		<li><code>WINEDEBUG=relay</code><br>will turn on all relay messages. For more control on including or excluding functions and dlls from the relay trace, look into the <code>HKEY_CURRENT_USER\Software\Wine\Debug</code> registry key.</li>
	            </ul>
            </td>
        </tr>
        <tr>
            <td><code>WINEDLLPATH</code></td>
            <td>Specifies the path(s) in which to search for builtin dlls and Winelib applications. This is a list of directories separated by <code>:</code>. In addition to any directory specified in <code>WINEDLLPATH</code>, Wine will also look in the installation directory.</td>
            <td></td>
            <td><code>WINEDLLPATH=</code></td>
        </tr>
        <tr>
            <td><code>WINEDLLOVERRIDES</code></td>
            <td>Defines the override type and load order of dlls used in the loading process for any dll. There are currently two types of libraries that can be loaded into a process address space: native windows dlls (<code>native</code>) and Wine internal dlls (<code>builtin</code>). The type may be abbreviated with the first letter of the type (<code>n</code> or <code>b</code>). The library may also be disabled (<code>''</code>). Each sequence of orders must be separated by commas.<br><br>Each dll may have its own specific load order. The load order determines which version of the dll is attempted to be loaded into the address space. If the first fails, then the next is tried and so on. Multiple libraries with the same load order can be separated with commas. It is also possible to use specify different loadorders for different libraries by separating the entries by <code>;</code>.<br><br>The load order for a 16-bit dll is always defined by the load order of the 32-bit dll that contains it (which can be identified by looking at the symbolic link of the 16-bit <code>.dll.so</code> file). For instance if <code>ole32.dll</code> is configured as <code>builtin</code>, <code>storage.dll</code> will be loaded as <code>builtin</code> too, since the 32-bit <code>ole32.dll</code> contains the 16-bit <code>storage.dll</code>.</td>
            <td></td>
            <td>
            	<ul>
		            <li><code>WINEDLLOVERRIDES="comdlg32,shell32=n,b"</code><br>Try to load <code>comdlg32</code> and <code>shell32</code> as <code>native</code> windows dll first and try the <code>builtin</code> version if the <code>native</code> load fails.</li>
		            <li><code>WINEDLLOVERRIDES="comdlg32,shell32=n;c:\\foo\\bar\\baz=b"</code><br>Try to load the libraries <code>comdlg32</code> and <code>shell32</code> as <code>native</code> windows dlls. Furthermore, if an application request to load <code>c:\foo\bar\baz.dll</code> load the <code>builtin</code> library <code>baz</code>.</li>
		            <li><code>WINEDLLOVERRIDES="comdlg32=b,n;shell32=b;comctl32=n;oleaut32="</code><br>Try to load <code>comdlg32</code> as <code>builtin</code> first and try the <code>native</code> version if the <code>builtin</code> load fails; load <code>shell32</code> always as <code>builtin</code> and <code>comctl32</code> always as <code>native</code>; <code>oleaut32</code> will be disabled.</li>
		            <li><code>WINEDLLOVERRIDES="mscoree=d;mshtml=d"</code><br>Disable dialog prompting you to download Gecko and/or Mono.</li>
	            </ul>
            </td>
        </tr>
        <tr>
            <td><code>WINEPATH</code></td>
            <td>Specifies additional path(s) to be prepended to the default Windows <code>PATH</code> environment variable. This is a list of Windows-style directories separated by <code>;</code>.<br><br>For a permanent alternative, edit (create if needed) the <code>PATH</code> value under the <code>HKEY_CURRENT_USER\Environment</code> registry key.</td>
            <td></td>
            <td><code>WINEPATH=</code></td>
        </tr>
        <tr>
            <td><code>WINEARCH</code></td>
            <td>Specifies the Windows architecture to support. The architecture supported by a given Wine prefix is set at prefix creation time and cannot be changed afterwards. When running with an existing prefix, Wine will refuse to start if <code>WINEARCH</code> doesn't match the prefix architecture. It is possible however to switch freely between <code>win64</code> and <code>wow64</code> with an existing 64-bit prefix.</td>
            <td>
	            <ul>
		            <li><code>win32</code><br>Support only 32-bit applications</li>
		            <li><code>win64</code><br>Support both 64-bit applications and 32-bit ones.</li>
		            <li><code>wow64</code><br>Support 64-bit applications and 32-bit ones, using a 64-bit host process in all cases.</li>
	            </ul>
            </td>
            <td><code>WINEARCH=win64</code></td>
        </tr>
        <tr>
            <td><code>WINE_LARGE_ADDRESS_AWARE</code></td>
            <td>Prevents 32bit games from crashing after reaching 4GB of RAM.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>WINE_LARGE_ADDRESS_AWARE=1</code></td>
        </tr>
        <tr>
            <td><code>WINE_D3D_CONFIG</code></td>
            <td>Specifies Direct3D configuration options. It can be used instead of modifying the <code>HKEY_CURRENT_USER\Software\Wine\Direct3D</code> registry key. The value is a comma- or semicolon-separated list of key-value pairs. If an individual setting is specified in both the environment variable and the registry, the former takes precedence.</td>
            <td></td>
            <td><code>WINE_D3D_CONFIG="renderer=vulkan;VideoPciVendorID=0xc0de"</code></td>
        </tr>
         <tr>
            <td><code>WINEESYNC</code></td>
            <td>Enables <em>Eventfd Synchronization (ESync)</em>, which reduces overhead from thread synchronization by replacing Windows synchronization objects with <code>eventfd</code> objects. Improves multithreaded application and game performance. Available on Linux and macOS.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>WINEESYNC=1</code></td>
        </tr>
        <tr>
            <td><code>WINEMSYNC</code></td>
            <td>Intended for <em>Mac Synchronization (MSync)</em>, adapting synchronization improvements like ESync/FSync for macOS systems using Mach ports. Aims to reduce overhead on macOS similarly to how FSync helps Linux. Experimental, still relatively new, and less mature than ESync/FSync.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>WINEMSYNC=0</code></td>
        </tr>
        <tr>
            <td><code>WINE_FULLSCREEN_FSR</code></td>
            <td>Enables FidelityFX Super Resolution (FSR) upscaling when Wine runs fullscreen apps. Good for boosting low-res games on Mac displays.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>WINE_FULLSCREEN_FSR=1</code></td>
        </tr>
        <tr>
            <td><code>WINE_FULLSCREEN_FSR_STRENGTH</code></td>
            <td>Controls image sharpness when FidelityFX Super Resolution (FSR) upscaling (i.e. <code>WINE_FULLSCREEN_FSR</code>) is enabled. Defaults to <code>5</code>.</td>
            <td>A number from <code>5</code> (minimum) to <code>0</code> (maximum)</td>
            <td><code>WINE_FULLSCREEN_FSR_STRENGTH=3</code></td>
        </tr>
        <tr>
            <td><code>WINE_NO_FULLSCREEN</code></td>
            <td>Forces Wine apps to run in a window even if they want fullscreen. Useful for compatibility.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>WINE_NO_FULLSCREEN=0</code></td>
        </tr>
        export =
        <tr>
            <td><code>VKD3D_FEATURE_LEVEL</code></td>
            <td></td>
            <td><code>12_2</code>, <code>4</code>, etc.</td>
            <td><code>VKD3D_FEATURE_LEVEL=12_2</code></td>
        </tr>
        <tr>
            <td><code>GST_DEBUG</code></td>
            <td>Controls logging level for GStreamer (used by Wine for media playback). Useful if games/apps involve video/audio playback issues.</td>
            <td><code>3</code> (info level), <code>4</code> (debug level)</td>
            <td>Example</td>
        </tr>
        <tr>
            <td><code>LC_ALL</code></td>
            <td>Sets the system-wide locale for Wine and its programs. Important for avoiding weird character encoding issues (especially in older games).</td>
            <td><code>en_US</code> or <code>en_US.UTF-8</code> (forces US English encoding</td>
            <td><code>LC_ALL=en_US.UTF-8</code></td>
        </tr>
        <tr>
            <td><code>DISPLAY</code></td>
            <td>Specifies the X11 display to use.</td>
            <td></td>
            <td><code>DISPLAY=</code></td>
        </tr>
          <tr>
            <td><code>AUDIODEV</code></td>
            <td>Set the device for audio input / output. Default <code>/dev/dsp</code>.</td>
            <td></td>
            <td><code>AUDIODEV=/dev/dsp</code></td>
        </tr>
         <tr>
            <td><code>MIXERDEV</code></td>
            <td>Set the device for mixer controls. Default <code>/dev/mixer</code>.</td>
            <td></td>
            <td><code>MIXERDEV=/dev/mixer</code></td>
        </tr>
        <tr>
            <td><code>MIDIDEV</code></td>
            <td>Set the MIDI (sequencer) device. Default <code>/dev/sequencer</code>.</td>
            <td></td>
            <td><code>MIDIDEV=/dev/sequencer</code></td>
        </tr>
    </tbody>
</table>

#### D3DMetal
Environment variables can be used to control some aspects of translation and emulation in the evaluation environment.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Options</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>D3DM_SUPPORT_DXR</code></td>
            <td>Defaults to <code>0</code> (OFF) on M1 & M2 Macs, and to <code>1</code> (ON) for M3 & later Macs. Setting this environment variable to <code>1</code> (ON) enables DirectX Raytracing (aka DXR) features in D3DMetal’s DirectX 12 translation layer, so games querying for DXR support will find the support level and expected interfaces of DXR.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>D3DM_SUPPORT_DXR=1</code></td>
        </tr>
        <tr>
            <td><code>ROSETTA_ADVERTISE_AVX</code></td>
            <td>Defaults to <code>0</code> (OFF). On macOS 15 Sequoia, setting this environment variable to <code>1</code> (ON) causes the CPU instruction translation layer to publish cpuid information to translated applications when running in the evaluation environment, so games querying instruction set extension capabilities before utilizing them can conditionally control their use of instruction extensions. This setting does not modify the availability of the instruction set in Rosetta; it only controls whether the processor advertises its support for these extensions.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>ROSETTA_ADVERTISE_AVX=1</code></td>
        </tr>
        <tr>
            <td><code>D3DM_ENABLE_METALFX</code></td>
            <td>On macOS 16, setting this environment variable to <code>1</code> (ON) causes DLSS functions to be converted to MetalFX where possible. Setting this environment variable to <code>0</code> (OFF) causes DLSS functions to be not be available.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>D3DM_ENABLE_METALFX=1</code></td>
        </tr>
    </tbody>
</table>

#### DXMT
Rename `winemetal_i386-windows.dll` in `e` to `winemetal.dll` for 32 bit. 64 bit is default; so if switching to 32bit, rename current `winemetal.dll` to `winemetal_x86_64-windows.dll` before renaming the 32bit one.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Options</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>DXMT_ENABLE_NVEXT</code></td>
            <td>Enable [implemented subset of] NVIDIA vendor extensions and load <code>nvapi64.dll</code> and <code>nvngx.dll</code>. It is <strong>NOT</strong> recommended to always enable this extension, because the game may use certain techniques that is only fast on NVIDIA hardware but extremely slow on others. Use it when it's actually beneficial.<br><br>Current implemented features: HDR *, DLSS SuperResolution (translated to MetalFX Temporal Scaler)<br><br>*: NOT ALL GAMES REQUIRE vendor extension to enable HDR, especially if it's released recently and/or targets Windows 11.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>DXMT_ENABLE_NVEXT=1</code></td>
        </tr>
        <tr>
            <td><code>MTL_SHADER_VALIDATION</code></td>
            <td>Enable Metal shader validation layer for DXMT.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>MTL_SHADER_VALIDATION=0</code></td>
        </tr>
        <tr>
            <td><code>MTL_DEBUG_LAYER</code></td>
            <td>Enable Metal API validation layer for DXMT.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>MTL_DEBUG_LAYER=0</code></td>
        </tr>
        <tr>
            <td><code>MTL_CAPTURE_ENABLED</code></td>
            <td>Enable Metal frame capture for DXMT.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>MTL_CAPTURE_ENABLED=0</code></td>
        </tr>
        <tr>
            <td><code>DXMT_LOG_LEVEL</code></td>
            <td>Controls message logging for DXMT.</td>
            <td><code>none</code>, <code>error</code>, <code>warn</code>, <code>info</code>, <code>debug</code></td>
            <td><code>DXMT_LOG_LEVEL=warn</code></td>
        </tr>
        <tr>
            <td><code>DXMT_LOG_PATH</code></td>
            <td>Changes path where DXMT log files are stored. Log files in the given directory will be called <code>app_d3d11.log</code>, <code>app_dxgi.log</code>, etc., where <code>app</code> is the name of the game executable. Set to <code>none</code> to disable log file creation entirely without disabling logging (i.e. log messages will still be printed to <code>stderr</code>).</td>
            <td><code>/some/directory</code>, <code>none</code></td>
            <td><code>DXMT_LOG_PATH=$HOME/dxmt/logs</code></td>
        </tr>
        <tr>
            <td><code>DXMT_CAPTURE_FRAME</code></td>
            <td>Automatically captures n-th frame. Useful for debugging a replay.</td>
            <td><code>n</code> (i.e. any positive integer)</td>
            <td><code>DXMT_CAPTURE_FRAME=3</code></td>
        </tr>
        <tr>
            <td><code>DXMT_CAPTURE_EXECUTABLE</code></td>
            <td>Must be set to enable Metal frame capture. Press <kbd>F10</kbd> to generate a capture. The captured result will be stored in the same directory as the executable.</td>
            <td><code>"executable name without extension"</code></td>
            <td><code>DXMT_CAPTURE_EXECUTABLE="Palworld"</code></td>
        </tr>
        <tr>
            <td><code>DXMT_METALFX_SPATIAL_SWAPCHAIN</code></td>
            <td>Enable MetalFX spatial upscaler on output swapchain. By default it will double the output resolution. Set <code>d3d11.metalSpatialUpscaleFactor</code> to a value between <code>1.0</code> and <code>2.0</code> to change the scale factor.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>DXMT_METALFX_SPATIAL_SWAPCHAIN=1</code></td>
        </tr>
        <tr>
            <td><code>DXMT_CONFIG_FILE</code></td>
            <td>Sets path to the DXMT configuration file. Check <a target="_blank" href="https://github.com/3Shain/dxmt/blob/main/dxmt.conf" title="Example DXMT configuration file"><code>dxmt.conf</code></a> in <a target="_blank" href="https://github.com/3Shain/dxmt" title="Link to DXMT GitHub repository">DXMT GitHub repository</a> for reference.</td>
            <td><code>/path/to/dxmt.conf</code></td>
            <td><code>DXMT_CONFIG_FILE=/Users/lynkos/dxmt/dxmt.conf</code></td>
        </tr>
        <tr>
            <td><code>DXMT_CONFIG</code></td>
            <td>Can be used to set config variables through the environment instead of a configuration file using the same syntax. <code>;</code> is used as a separator. Set <code>d3d11.preferredMaxFrameRate</code> to enforce the application's frame pacing being controlled by Metal. The value must be a factor of your display's refresh rate (e.g. <code>15</code>, <code>30</code>, <code>40</code>, <code>60</code>, <code>120</code> are valid for a 120hz display).</td>
            <td><code>"DXMT config variables separated with ;"</code></td>
            <td><code>DXMT_CONFIG="d3d11.preferredMaxFrameRate=30;d3d11.metalSpatialUpscaleFactor=1.5;"</code></td>
        </tr>
    </tbody>
</table>

#### DXVK
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Options</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
          <tr>
            <td><code>DXVK_ASYNC</code></td>
            <td>Enables async shader compilation in DXVK. Reduces stutter by allowing shaders to compile in the background, but may cause visual glitches. Needs a patched version of DXVK to work.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>DXVK_ASYNC=1</code></td>
        </tr>
        <tr>
            <td><code>DXVK_HUD</code></td>
            <td>Controls a HUD which can display FPS and some stat counters.</td>
            <td>
		        <ul>
			        <li><code>1</code> (has the same effect as <code>devinfo,fps</code>)</li>
			        <li><code>full</code> (enables all available HUD elements)</li>
			        <li><code>devinfo</code> (displays the name of the GPU and the driver version)</li>
			        <li><code>fps</code> (shows the current frame rate)</li>
			        <li><code>frametimes</code> (shows a frame time graph)</li>
			        <li><code>submissions</code> (shows the number of command buffers submitted per frame)</li>
			        <li><code>drawcalls</code> (shows the number of draw calls and render passes per frame)</li>
			        <li><code>pipelines</code> (shows the total number of graphics and compute pipelines)</li>
			        <li><code>memory</code> (shows the amount of device memory allocated and used)</li>
			        <li><code>gpuload</code> (shows estimated GPU load; may be inaccurate)</li>
			        <li><code>version</code> (shows DXVK version)</li>
			        <li><code>api</code> (shows the D3D feature level used by the application)</li>
			        <li><code>compiler</code> (shows shader compiler activity)</li>
			        <li><code>samplers</code> (shows the current number of sampler pairs used; <em>D3D9 Only</em>)</li>
			        <li><code>scale=x</code> (scales the HUD by a factor of <code>x</code>)</li>
		        </ul>
            </td>
            <td><code>DXVK_HUD=1</code></td>
        </tr>
          <tr>
            <td><code>DXVK_FRAME_RATE</code></td>
            <td>Can be used to limit the frame rate. Alternatively, the configuration file can be used.</td>
            <td><code>0</code> uncaps the frame rate, while any positive value will limit rendering to the given number of frames per second</td>
            <td><code>DXVK_FRAME_RATE=15</code></td>
        </tr>
          <tr>
            <td><code>DXVK_FILTER_DEVICE_NAME</code></td>
            <td>Some applications do not provide a method to select a different GPU. In that case, DXVK can be forced to use a given device. Selects devices with a matching Vulkan device name, which can be retrieved with tools such as <code>vulkaninfo</code>. Matches on substrings, so "VEGA" or "AMD RADV VEGA10" is supported if the full device name is "AMD RADV VEGA10 (LLVM 9.0.0)", for example. If the substring matches more than one device, the first device matched will be used. <strong>Note</strong>: If the device filter is configured incorrectly, it may filter out all devices and applications will be unable to create a D3D device.</td>
            <td></td>
            <td><code>DXVK_FILTER_DEVICE_NAME="Device Name"</code></td>
        </tr>
          <tr>
            <td><code>DXVK_STATE_CACHE</code></td>
            <td>Enables state cache in DXVK.</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>DXVK_STATE_CACHE=0</code></td>
        </tr>
        <tr>
            <td><code>DXVK_STATE_CACHE_PATH</code></td>
            <td>Specifies a directory where to put the cache files. Defaults to the current working directory of the application.</td>
            <td></td>
            <td><code>DXVK_STATE_CACHE_PATH=/some/directory</code></td>
        </tr>
    </tbody>
</table>

#### MoltenVK
// TODO

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Options</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
          <tr>
            <td><code>NAME</code></td>
            <td>DESC</td>
            <td><code>0</code> (OFF), <code>1</code> (ON)</td>
            <td><code>EXAMPLE</code></td>
        </tr>
	</tbody>
</table>

### Troubleshooting
#### Game Porting Toolkit
This section is taken directly from different Game Porting Toolkit's `README.md` files, hence the blockquotes.

##### Game won't run and crashes with an invalid instruction or complains about lack of certain instruction extensions
> Invalid instruction crashes are sometimes caused when the Rosetta 2 instruction translation layer is unable to translate CPU instructions. You may be able to recompile a version of your game without certain instructions in order to evaluate its potential on Apple Silicon with the Game Porting Toolkit when you hit this error. You may also be able to use the `ROSETTA_ADVERTISE_AVX` environment variable to ensure your game recognizes available translation instruction extensions. When porting your code natively to Apple Silicon there are a variety or NEON and ARM instructions which offer high-performance replacements for AVX / AVX2, BMI, F16c and other less common instruction set extensions.

##### Game won't run because its anti-cheat or DRM software is incompatible with Wine translation
> You may be able to rebuild a custom version of your game in your Windows development environment with anti-cheat or DRM disabled for your own evaluation purposes. When porting your code natively to Apple Silicon and macOS, contact your anti-cheat or DRM provider—most have native Apple Silicon solutions for your native build, or you may find that existing macOS solutions like Hardened Runtime, Application Sandbox, and Application Attestation prevent forms of cheating or tampering that concern you.

##### Game won’t run because it thinks the version of Windows is too old
> First, make sure you have selected an appropriate Windows version in `winecfg`. This affects the major and minor Windows versions that are reported to your game.
>
> If your game checks for a specific minimum or an exact build version, you can alter this value by changing the `CurrentBuild` and `CurrentBuildNumber` values of the `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT` registry key. You must perform this step _after_ selecting a Windows version in `winecfg`. Run the following commands, replacing `«BUILD_NUMBER»` with the specific build number your game checks for; if you're unsure, build `19042` should work for most games:
>
> ```sh
> WINEPREFIX=$HOME/Games /usr/local/bin/wine64 reg add 'HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion' /v CurrentBuild /t REG_SZ /d «BUILD_NUMBER» /f
> WINEPREFIX=$HOME/Games /usr/local/bin/wine64 reg add 'HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion' /v CurrentBuildNumber /t REG_SZ /d «BUILD_NUMBER» /f
> WINEPREFIX=$HOME/Games /usr/local/bin/wineserver -k
> ```
> {: .nolineno }
>
> The last command will shut down the virtual Windows environment to ensure that all components agree on the Windows version the next time you launch your game.

##### Game won’t run because it requires Mono, .NET, or the MSVCRT runtime
> The evaluation environment for Windows games does not pre-install these runtime support packages. If your game makes use of one of these packages, consider searching for and downloading appropriate installers (`.exe` or `.msi`) and installing them to your evaluation environment. Additional runtime installers can be run on your environment by just launching the installer and following its installation instructions:
>
> ```sh
> WINEPREFIX=$HOME/Games /usr/local/bin/wine64 <some-installer.exe>
> ```
> {: .nolineno }
>
> `.MSI` packages can be installed by launching the Windows uninstaller application and choosing to install a downloaded `.msi` package:
>
> ```sh
> WINEPREFIX=$HOME/Games /usr/local/bin/wine64 uninstaller
> ```
> {: .nolineno }

##### Game won’t boot anymore despite no changes
> If the game stopped booting without being updated (i.e. you didn't make any changes), try clearing the shader cache:
>
> ```sh
> cd $(getconf DARWIN_USER_CACHE_DIR)/d3dm
> cd «GAME_NAME»
> rm -r shaders.cache
> ```
> {: .nolineno }

##### Enable experimental MetalFX integration
> This **ONLY** works for **macOS 16 AND Game Porting Toolkit 3.0**!
> 
> See [Boost performance with MetalFX Upscaling](https://developer.apple.com/videos/play/wwdc2022/10103) video from [Apple Developer](https://developer.apple.com) for more information.
{: .prompt-info }

1. Rename `wine/x86_64-unix/nvngx-on-metalfx.so`{: .filepath} to `wine/x86_64-unix/nvngx.so`{: .filepath} if this hasn’t already been done
2. Rename `wine/x86_64-windows/nvngx-on-metalfx.dll`{: .filepath} to `wine/x86_64-windows/nvngx.dll`{: .filepath} if this hasn’t already been done
3. Copy both `nvngx.dll`{: .filepath} and `nvapi64.dll`{: .filepath} to the `windows\system32` directory in your Wine prefix’s virtual C: drive (open `$HOME/Games/drive_c/windows/system32`)
4. Set `D3DM_ENABLE_METALFX=1` to convert DLSS functions to MetalFX (where possible)

Refer to [MetalFX Integration](2025-09-11-playing-windows-games.md#metalfx-integration) for Bash script.

#### Steam
##### `steamwebhelper` not responding
> If you updated Steam to the latest version and/or get an error along the lines of **steamwebhelper, a critical Steam component, is not responding. The Steam UI will not be usable.** upon relaunch, complete the following steps. This error is common when using an outdated version of Wine with a new version of Steam.
{: .prompt-info }

1. Run `cmd.exe`

```sh
WINEPREFIX=$HOME/Games wine "C:\windows\system32\cmd.exe"
```
{: .nolineno }

2. Enter your Steam directory

```sh
cd "Games\drive_c\Program Files (x86)\Steam"
```
{: .nolineno }

> Try `"Z:\Users\<YOUR_USERNAME>\Games\drive_c\Program Files (x86)\Steam"`{: .filepath} if the previous command doesn't work, where `<YOUR_USERNAME>` is your Mac username
{: .prompt-tip }

3. Downgrade your Steam version

> Running an outdated version of Steam is not recommended by Valve due to possible security risks. Proceed at your own risk.
{: .prompt-warning }

{% tabs downgrade-steam %}
    ---TAB: 3/6/2025
        This will restore an older Steam version from 3/6/2025
        ```sh
        steam.exe -forcesteamupdate -forcepackagedownload -overridepackageurl http://web.archive.org/web/20250306194830if_/media.steampowered.com/client -exitsteam
        ```
        {: .nolineno }
    ---TAB: 1/28/2025
        If that doesn't work, try this Steam version from 1/28/2025
        ```sh
        steam.exe -forcesteamupdate -forcepackagedownload -overridepackageurl http://web.archive.org/web/20250128if_/media.steampowered.com/client -exitsteam
        ```
        {: .nolineno }
    ---TAB: 5/20/2024
        If that doesn't work, try this Steam version from 5/20/2024
        ```sh
        steam.exe -forcesteamupdate -forcepackagedownload -overridepackageurl http://web.archive.org/web/20240520if_/media.steampowered.com/client -exitsteam
        ```
        {: .nolineno }
{% endtabs %}

> The link will not open in a browser, however, it is still active
{: .prompt-info }

4. Exit

```sh
exit
```
{: .nolineno }

5. Create/update `steam.cfg`

```sh
cat <<EOF > $HOME/Games/drive_c/Program\ Files\ \(x86\)/Steam/steam.cfg
```
{: .nolineno }

6. Enter the following (to disable auto-update)

```plaintext
BootStrapperInhibitAll=enable
BootStrapperForceSelfUpdate=disable
EOF
```

7. Restart Steam

```sh
WINEPREFIX=$HOME/Games wine "C:\Program Files (x86)\Steam\steam.exe"
```
{: .nolineno }

Optional args for `steam.exe` (tho including them caused issues):
```sh
-noverifyfiles -nobootstrapupdate -skipinitialbootstrap -norepairfiles -overridepackageurl
```
{: .nolineno }

##### Steam download freezes
This is if you're unable to download a game via Steam (GUI/app). Usually it'll go up to a certain percentage (often 80%) and then immediately drops (i.e. stops downloading, graph goes flat to 0), giving an error like "content servers unreachable", "corrupt download", "content unavailable", etc.

TODO: 
`libraryfolders.vdf`

key: APP_ID
value: value of "SizeOnDisk" specified in the app's appmanifest.vdf

###### Solution 1: Steam Console
Source[^steamconsole]

> Use `~` instead of `$HOME` for any paths!
{: .prompt-warning }

1. Make sure you have the native Steam app for macOS

2. Open your web browser (e.g. Firefox, Chrome, Safari, etc.) and enter [`steam://open/console`](steam://open/console) in the URL bar

3. Once Steam (for macOS) opens, click the <kbd>Console</kbd> tab

4. Enter the following in the bottom prompt to enable downloading Windows games via macOS Steam

```plaintext
@sSteamCmdForcePlatformType windows
```

5. Either through SteamDB.info or via the store page's link, find and copy the app ID (e.g. `3527290`) of the game you want to download

6. Enter the following in the console, where `<APP_ID>` is the app ID (e.g. `3164500`) of the game you want to download

```plaintext
app_install <APP_ID>
```

> If you need a beta access, include the following flag, where `<CHANNEL_NAME>` is the channel name
> ```plaintext
> -beta <CHANNEL_NAME>
> ```
{: .prompt-tip }

7. Once the app is done downloading, which you can see in your Steam's Download Manager, right click it and go to <kbd>Manage</kbd> > <kbd>Browse Local Files</kbd> to open Finder's window with the game files inside; this should be in path  `$HOME/Library/Application Support/Steam/steamapps/common/<YOUR_GAMES_NAME>`, where `<YOUR_GAMES_NAME>` is the name of the game you want to download

8. Move all of the aforementioned game files to the same location (i.e. `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/common/<YOUR_GAMES_NAME>`) inside your Windows Steam installation

9. Two folders up (i.e. path `$HOME/Library/Application Support/Steam/steamapps/`), move the file `appmanifest_<APP_ID>.acf`{: .filepath}, where `<APP_ID>` is your game's Steam app ID, to the same location (i.e. `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/`) inside your Windows Steam installation. E.g. `appmanifest_3164500.acf`{: .filepath}

10. Run your Windows Steam installation as normal and the game should appear as downloaded in your Steam library

###### Solution 2: SteamCMD
> If you already have [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) installed, go straight to Step #3.
{: .prompt-info }

1. Open terminal and create `SteamCMD` directory

```sh
mkdir $HOME/SteamCMD && cd $HOME/SteamCMD
```
{: .nolineno }

2. Download and extract SteamCMD

```sh
curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf -
```
{: .nolineno }

3. Run SteamCMD

```sh
./steamcmd.sh
```
{: .nolineno }

4. Set your app directory, where `<APP_PATH>` is where you want to save the game. In this case, it'll be in your Wine prefix's (`$WINEPREFIX`) `steamapps` directory (i.e. `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/common/`)

```sh
force_install_dir <APP_PATH>
```
{: .nolineno }

> If you are running SteamCMD from your path env or installed it as a package, it will return an error if you try to use `.` as a directory. A workaround for this is to use the absolute path to the current directory.
{: .prompt-warning }

When downloading/downloaded via SteamCMD:
Downloaded `appmanifest` is in `<APP_PATH>/steamapps/` directory.
Downloaded `appmanifest` should be [moved] in `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/` directory.
`<APP_PATH>/steamapps/` can be deleted AFTER its `appmanifest` has been moved to `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/` directory.
`<APP_PATH>/!steamapps/` contains everything [that should be] in the game's source folder (i.e. `$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/common/<GAME_NAME>/`)

5. Login to your Steam account, where `<STEAM_USERNAME>` is your Steam username (or `anonymous` if you don't want to login, though you won't be able to download your purchased games)

```sh
login <STEAM_USERNAME>
```
{: .nolineno }

> Valve recommends setting the install directory **BEFORE** logging in
{: .prompt-tip }

6. Install or update the app using the `app_update` command, where `<APP_ID>` is the app's [Steam Application ID](https://developer.valvesoftware.com/wiki/Steam_Application_IDs "Steam Application IDs"). If you don't know the Steam Application ID for the server, tool, or game you want to download, use [steamdb.info](https://steamdb.info) to locate it.

```sh
app_update <APP_ID> [-beta <BETA_NAME>] [-betapassword <BETA_PASSWORD>] [validate]
```
{: .nolineno }

> - [Dedicated server list](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List "Dedicated Servers List")
> - Use the `-beta <BETA_NAME>` option to download a beta branch
> - For beta branches protected by a password, include the `-betapassword <BETA_PASSWORD>` option to be able to download from them
> - Add `validate` to the command to check all the server files to make sure they match SteamCMD files; this command is useful if you think files may be missing or corrupted. However, this will overwrite any changed files to the server default; any files that aren't part of the default installation will not be affected. Therefore, it is recommended you use this command only on initial installation and if there are server issues.
{: .prompt-tip }

7. Log off Steam servers once finished

```sh
quit
```
{: .nolineno }

If you want to use a script

```plaintext
@ShutdownOnFailedCommand 1
@NoPromptForPassword 1
@sSteamCmdForcePlatformType windows

force_install_dir <APP_PATH>
login <STEAM_USERNAME> <STEAM_PASSWORD>

// Use this instead if you don't want to login
// login anonymous

app_update <APP_ID> validate
quit
```
{: file="install_game.txt" }

Run script with the `+runscript` option, where `<SCRIPT_NAME>` is your script's filename (e.g. `install_game.txt`)

```sh
./steamcmd.sh +runscript <SCRIPT_NAME>
```
{: .nolineno }

> - If you get an error like `Failed to load script file '<SCRIPT_NAME>'`, try providing an absolute path, e.g. `/absolute/path/to/<SCRIPT_NAME>`
> - If you get an error like `Failed to install app '<APP_ID>' (No subscription)`, the game/server you are trying to download either requires a login or that you have purchased the game. You will therefore have to log in with a Steam username and password (i.e. use `login <STEAM_USERNAME> <STEAM_PASSWORD>` instead of `login anonymous`).
{: .prompt-info }

The aforementioned script is functionally the same as:

```sh
./steamcmd.sh +@sSteamCmdForcePlatformType windows +force_install_dir <APP_PATH> +login <STEAM_USERNAME> +app_update <APP_ID> validate +quit
```
{: .nolineno }

For the sake of convenience, I've written a bash function to download a Steam app into a given `WINEPREFIX`'s Steam directory. You can find this function at [Automate Steam Downloads](2025-09-11-playing-windows-games.md#automate-steam-downloads).

#### Game Controller
> Make sure your game controller is compatible with macOS. While Xbox and PlayStation are the most popular game controllers, I think other Bluetooth game controllers are compatible too (so you're not limited to those two).[^controller]
{: .prompt-info }

List of currently supported Xbox[^xbox] and PlayStation[^ps] controllers as of this writing:
- Xbox Wireless Controller with Bluetooth (Model 1708)
- Xbox Wireless Controller Series S
- Xbox Wireless Controller Series X
- Xbox Elite Wireless Controller Series 2
- Xbox Adaptive Controller
- PlayStation DualShock 4 Wireless Controller
- PlayStation 5 DualSense Wireless Controller
- PlayStation 5 DualSense Edge Wireless Controller

##### Prevent "Home" button from opening Launchpad
> This is particularly useful when using Steam's Big Picture mode
{: .prompt-tip }

1. Disable "Home" button

```sh
defaults write com.apple.GameController bluetoothPrefsMenuLongPressAction -integer 0
```
{: .nolineno }

2. Restart the Dock process to apply changes

```sh
killall Dock
```
{: .nolineno }

> Alternatively, you can logout and log back in again (though this is likely more time-consuming than executing the aforementioned command)
{: .prompt-tip }

##### Disable "Share" button
1. Disable "Share" button

```sh
defaults write com.apple.GameController bluetoothPrefsShareLongPressSystemGestureMode -integer -1
```
{: .nolineno }

2. Restart the Dock process to apply changes

```sh
killall Dock
```
{: .nolineno }

> Alternatively, you can logout and log back in again (though this is likely more time-consuming than executing the aforementioned command)
{: .prompt-tip }

#### Memory
##### Dynamically allocate VRAM
Allocate memory for VRAM, where `DESIRED_VRAM_MB` is an integer number of how many MB of VRAM you want to allocate.[^vram]

```sh
sudo sysctl iogpu.wired_limit_mb=DESIRED_VRAM_MB
```
{: .nolineno }

To set it permanently:

```sh
sudo touch /etc/sysctl.conf
sudo chown root:wheel /etc/sysctl.conf
sudo chmod 0644 /etc/sysctl.conf
echo "iogpu.wired_limit_mb=DESIRED_VRAM_MB" >> /etc/sysctl.conf
```

##### Set video memory size
Sometimes Game Porting Toolkit and your game not properly communicating with each other about how much Video RAM your system has (more than likely, GPTk is not getting the correct value from your system).[^vidmem]

You may need this setting if you have the following symptoms:
- Strange rendering
- Crash/Freeze on launch
- A log file that says something like:  
```plaintext
fixme:d3d_texture:texture_init Failed to create surface 0x35c4fc68, hr 0x8876017c
err:d3d:resource_init Out of adapter memory
```

1. Click the Apple icon in the upper-left corner
2. Select <kbd>About This Mac</kbd>

![mbp_ram.png](../assets/obsidian/mbp_ram.png)

3. Note the value next to `Memory` (e.g. `64 GB`)
4. Take that value, multiply it by either `2` or `3`, then divide by either `3`  or `4`()

`64 * 2 / 3 = 128 / 3 ≈ 42`

5. Round the result down if it's not a whole number
6. Your final answer is the approximate amount of VRAM you have. This is an approximation since MacBook Pro M-series uses unified memory (i.e. memory is shared between CPU and GPU), so there's only RAM, not VRAM. Technically the amount of VRAM you have is equal to the amount of RAM, but in practice it's less since some of that RAM is reserved by the system to prevent instability.
7. Switch architecture

```sh
arch -x86_64 /bin/bash
```
{: .nolineno }

8. Open `regedit`

```sh
WINEPREFIX=$HOME/Games wine regedit
```
{: .nolineno }

9. Navigate to `HKEY_LOCAL_MACHINE\Software\Wine`
10. If `Direct3D` isn't already there, right-click `Wine`and navigate to <kbd>New</kbd>
11. Click <kbd>Key</kbd>
12. Input `Direct3D`, then press <kbd>Enter</kbd> to save its name

> To rename a key, right-click it and click <kbd>Rename</kbd>
{: .prompt-tip }

13. Double-click `Direct3D` to open
14. Right-click anywhere that isn't a key (i.e. right-click anywhere in the white space)
15. Navigate to <kbd>New</kbd> and click <kbd>String Value</kbd>
16. Input `VideoMemorySize`, then press <kbd>Enter</kbd> to save its name

> To rename a key, right-click it and click <kbd>Rename</kbd>
{: .prompt-tip }

17. Double-click `VideoMemorySize` to set its value

![regedit_videomemorysize.png](../assets/obsidian/regedit_videomemorysize.png)

18. Under `Value data:`, enter `16384` (i.e. 16.384 GB), then click <kbd>OK</kbd>
19. Close `regedit`

Experiment with the value (in MB) of `VideoMemorySize`. Some users say `4096` is better, etc. Might need to do some trial and error.

##### 32bit games crash after 4GB RAM
```sh
export WINE_LARGE_ADDRESS_AWARE=1
```
{: .nolineno }

#### Wine
`HKEY_CURRENT_USER\Software\Wine\Mac Driver`[^wine2]

##### Disable vertical sync (vsync)
```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'AllowVerticalSync' /t REG_SZ /d 'N' /f
```
{: .nolineno }

##### Prevent Wine from creating filetype associations
This method prevents the creation of filetype associations but retains the creation of XDG .desktop files (that you might see e.g. in menus).

```sh
WINEPREFIX=$HOME/Games wine reg add "HKEY_CURRENT_USER\Software\Wine\FileOpenAssociations" /v 'Enable' /d 'N'
```
{: .nolineno }

#### Pixelated and limited display resolution
Enable Retina aka High Resolution mode

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RetinaMode' /t REG_SZ /d 'Y' /f
```
{: .nolineno }

> Some games will not run with Retina mode enabled; to disable:
> ```sh
> WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RetinaMode' /t REG_SZ /d 'N' /f
> ```
> {: .nolineno }
{: .prompt-tip }

Check setting

```sh
wine reg query 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RetinaMode'
```
{: .nolineno }

#### Audio
##### Some games have messed up audio and/or don't have sound
TODO: REWRITE THIS SECTION.

READ: https://www.reddit.com/r/farcry3/comments/2plbu5/can_someone_help_me_with_this_in_game_no_sound.

**part 1: audio crackling (far cry 3) -- sounds like it's coming out a Geiger counter**
Press CMD+Space to open Spotlight Search and type in „MIDI“, you should see the app Audio MIDI Setup.

In this app you select your speaker on the left and change the Output with a click on the drop down menu at the right side. Change it to 96,000Hz (default should be set to 44,000hz I think)

And remember to change it for every output device. If you do this for the built-in speakers and want to use AirPods later, you have to to the same again, just select the AirPods then. After you have set it for a device it stays that way
https://www.reddit.com/r/macgaming/comments/1jcw1w7/comment/mi81abl

**part 2**
Disclaimer: Do this at your own risk. I am just documenting what worked in my case.

The problem: On my M1 mac mini some games stopped having any sound at some point while others had no issue. Games that I tried that had this problem include Cities Skylines, Starcraft 2 and Heroes of the Storm.

The solution: It seems that the problem was caused from the extra audio drivers installed as plugin by Microsoft Teams. After removing the MSTeams audio driver folder and restarted the problem disappeared.

macOS often restricts Terminal access to certain system-related directories, which can cause the "Operation not permitted" error when trying to delete certain files (like this driver). To grant Terminal full disk access:
    Go to System Preferences > Privacy & Security > Full Disk Access
    Enable iTerm/Terminal (if it's not already listed, click the plus (+) button to add an application and choose Terminal / iTerm).

```sh
sudo rm -rf /Library/Audio/Plug-Ins/HAL/MSTeamsAudioDevice.driver
```
{: .nolineno }

I've seen similar reports for other games that also had sound problems and after users removed any extra audio drivers, sound started working again. Looking into this problem I saw similar reports about Zoom audio drivers as well.

By the way removing the Teams audio drivers does not prevent Teams from working normally, So I have no idea what these drivers do. They are an optional module during Teams setup. 

https://www.reddit.com/r/macgaming/comments/vrzuvl/mac_mini_m1_some_games_dont_have_sound_solved

**part 3**
wine dll override: `export WINEDLLOVERRIDES="xaudio2_7=n,b"`

https://www.reddit.com/r/macgaming/comments/1ltcbcw/far_cry_4_crossover_2501_macbook_pro_m4_pro

#### Fonts
##### Unreadable or missing fonts
You may not have any fonts installed. To easily link all of the system fonts so they are accessible from wine:

```sh
cd "$WINEPREFIX/drive_c/windows/Fonts" && for i in /usr/share/fonts/**/*.{ttf,otf}; do ln -s "$i"; done
```
{: .nolineno }

Wine uses FreeType to render fonts, and FreeType's defaults changed a few releases ago. Try using the following environment variable when running programs in Wine:

```sh
FREETYPE_PROPERTIES="truetype:interpreter-version=35"
```
{: .nolineno }

Another possibility is to [install Microsoft's TrueType fonts](https://wiki.archlinux.org/title/Microsoft_fonts#Installation "Microsoft fonts") into your wine prefix. If this does not help, try running `winetricks corefonts` first, then `winetricks allfonts` as a last resort.

After running such programs, kill all Wine servers and run `winecfg`. Fonts should be legible now.

##### Smeared fonts
If the fonts look somehow smeared, run the following command to change a setting in the Wine registry.

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideWithRender' /t REG_SZ /d 'N'
```
{: .nolineno }

#### Keyboard
##### Fix keyboard shortcuts
Wine by default maps the keys differently than native macOS applications. It's possible to change some of the keyboard mappings.

Map <kbd>Option</kbd> as <kbd>Alt</kbd>:

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'LeftOptionIsAlt' /t REG_SZ /d 'Y'
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RightOptionIsAlt' /t REG_SZ /d 'Y'
```
{: .nolineno }

Map <kbd>Command</kbd> as <kbd>CTRL</kbd>:

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'LeftCommandIsCtrl' /t REG_SZ /d 'Y'
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RightCommandIsCtrl' /t REG_SZ /d 'Y'
```
{: .nolineno }

##### Keyboard input not working
This could be caused by the window manager not switching focus.

###### Solution 1: Winetricks
```sh
winetricks usetakefocus=n
```
{: .nolineno }

###### Solution 2: Regedit
Toggle all the **Window settings**, click **Apply**, then change them back.

If that does not work, go to the **Graphics** tab of `winecfg`, disable the **Allow the window manager...** options, or set windowed mode with **Emulate a virtual desktop**.

If the keyboard still does not work after unfocusing the application, try editing the registry

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /t REG_SZ /v 'UseTakeFocus' /d 'N' /f
```
{: .nolineno }

#### Miscellaneous
##### "Symbol not found" when setting game mode
You may get this error if setting `game-mode` (e.g. `/Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl game-mode set auto`)

```plaintext
dyld[52755]: Symbol not found: _$s2os6LoggerV10GamePolicyE4toolACvau
  Referenced from: <EF9CA6F2-E5BD-35B1-ACC3-E45E7CBB0AD4> /Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl
  Expected in:     <7962FD29-508F-3668-87F7-68AC93844B60> /System/Library/PrivateFrameworks/GamePolicy.framework/Versions/A/GamePolicy
Abort trap: 6
```

This may be due to a version mismatch (especially if you recently updated your OS without updating XCode). To fix, update XCode and then try running `game-mode` again.

> `gamepolicyctl` tool may have been compiled against an older version of `GamePolicy.framework` than the one installed on your system. This often happens when you have mismatched Xcode and macOS versions.

##### DXVK runs out of memory and crashes
With the following repeated in the terminal

```plaintext
[mvk-warn] VK_ERROR_OUT_OF_POOL_MEMORY: VkDescriptorPool exhausted pool of (x) descriptors. Allocating descriptor dynamically.
```

You should allocate enough memory [in the pool] by creating multiple pools.

`VK_ERROR_OUT_OF_POOL_MEMORY`:
- Used to determine when to allocate a new descriptor pool.
- Returned if allocation fails due to no more space in the descriptor pool (and not because of system or device memory exhaustion).

##### Applications fail to start
Some older games and applications assume that the current working directory is the same as that which the executable is in. Launching these executables from other locations will prevent them from starting correctly. Use `cd path_containing_exe` before invoking Wine to rule this possibility out.

### Tips + Tricks
#### Launch games as an app
##### Method 0: App Bundle
TODO: How to make custom Wine as app bundle so that I can set game mode. (since `game-mode` cmd is currently broken so I can't set it that way.) this is bc macbook pro automatically enables game mode if it detects a game running. i think it determines it from `plist` in app bundle or sumn related. since i'm running via wine, i have to make one from scratch so mac recognizes it as a game and auto enables game mode for me. use bookmarked tut.

##### Method 1: Automator
You can use the Automator app to create a new Application that will run Steam when you click on its icon (similar to how Applications work)

![automator.png](../assets/obsidian/automator.png)

1. Open Automator

2. Select  **Application** and click **Choose**

3. In the sidebar on the left, click  **Utilities**, then double-click  **Run Shell Script**

4. Select` /bin/bash` as the shell and pass input **to stdin**, then paste the following in the textbox:

// TEMP: ORIGINAL
```
#!/bin/bash

arch -x86_64 /bin/bash

export PATH="/usr/local/bin:${PATH}"
export WINEDEBUG=-all
export D3DM_SUPPORT_DXR=1
export ROSETTA_ADVERTISE_AVX=1
export WINEESYNC=1
export WINEMSYNC=1
export WINEFSYNC=1
export WINEDLLOVERRIDES="dinput8=n,b;d3d9,d3d10,d3d11,d3d12,dxgi=n"

gameportingtoolkit-no-hud ~/Games 'C:\Program Files (x86)\Steam\steam.exe' > /dev/null 2>&1 &
```


```sh
#!/bin/bash

arch -x86_64 /bin/bash

export PATH="/usr/local/bin:${PATH}"
export D3DM_SUPPORT_DXR=1
export ROSETTA_ADVERTISE_AVX=1
export WINEDLLOVERRIDES="dinput8=n,b;d3d11,d3d10,d3d12,dxgi=b"
export WINEESYNC=1
export WINEDEBUG=-all
export WINEPREFIX="$HOME/Games"

wine "C:\Program Files (x86)\Steam\steam.exe" > /dev/null 2>&1 &
```

5. Once you save this automated application (file format  **Application**, I have it saved as `Steam (Windows)`, though you can name it anything), you'll want to set a custom icon to make it discernable

6. Copy (i.e. right-click, then press **Copy Image**) the image you want to use as your icon (preferably `.icns` file format)

This is the app icon I use for Steam (Windows); click on the image to download it

![steam_icon.webp](../assets/obsidian/steam_icon.webp) ([source](https://www.reddit.com/r/blender/comments/shk9dr/some_app_icons_ive_made_over_the_last_couple_of))

I've also converted it to Apple's `.icns` file format (it isn't displaying due to the file format), so you won't have to manually convert from `.webp` to `.icns`
![steam_icon.icns](../assets/obsidian/steam_icon.icns.md)

7. Find the application you saved earlier, right-click it, then click **Get Info**

8. Click the default icon at the top (it'll be outlined when you do), right above the **Add Tags...** textbox

9. Press <kbd>⌘</kbd> + <kbd>V</kbd> (i.e. <kbd>CMD</kbd> + <kbd>V</kbd>) to paste the image you just copied, and you'll see the icon update accordingly

You can now run the Windows version of Steam anytime you click the app icon! This is much more user-friendly than running commands in the terminal each time.

##### Method 2: Shortcuts
// TODO

##### Method 3: AppleScript
Taken from [David Baumgold's tutorial on installing Wine on Mac](https://www.davidbaumgold.com/tutorials/wine-mac).

Many people want to be able to run Windows programs the same way they run other programs on the Mac: by clicking an icon in the Dock. Wine isn't specifically designed to support this, but with a little trickery, we can make it do what we want.

> Wine prints out error messages in the Terminal when something goes wrong. By launching Windows programs via a Dock icon, you are sidestepping the Terminal, which means that if something _does_ go wrong and Wine has to quit, _it will not be able to tell you what the problem was_. The first step to solving a problem is knowing what it is, so without running Wine from the Terminal, you won't be able to fix it, and neither will anyone else. Running from the Dock is fine as long as your program seems to be working correctly, but if it crashes, the first thing you should try is running it from the Terminal instead: it won't prevent the program from crashing, but it will give you some clues on how to fix the problem.
{: .prompt-info }

In order to launch a Windows program via the Dock, we're going to write an [AppleScript](https://secure.wikimedia.org/wikipedia/en/wiki/AppleScript) that launches the program for us, and then put that AppleScript in the Dock. There is a program on your computer that is designed for helping you write AppleScripts: it's called "Script Editor", and you can find it in the `/Applications/Utilities` directory.

1. Open `Script Editor`

2. You should see a window with a large area you can type in near the top: this is where you write your AppleScript. In that area, type the following text:

```plaintext
tell application "Terminal"
    do script "wine ~/Games/drive_c/Program\\ Files/$PATH_TO_PROGRAM.exe"
end tell
```

Replace `$PATH_TO_PROGRAM` with the path from the Program Files directory to your program executable. You can see that you're simply telling the AppleScript to run a line of code in the Terminal: the same line of code that you could run to start your Windows program.

3. Press **Compile** button at the top of the window. The text should become colored to indicate that Script Editor understands what you wrote. You can also try pressing the Run button to run your script: it should open the Windows program successfully.

4. Save your script; Select **File Format: Application** in the save options, and leave **Startup Screen** unchecked.

5. Open up the Finder, go to where you saved your script, and drag that file to your Dock. It should stay there, just like a real application!

#### Folder shortcut
Continue reading if you want easy, quick, and convenient access to both your Mac **AND** Windows versions of Steam

![steam_folder.png](../assets/obsidian/steam_folder.png)
![steam_folder2.png](../assets/obsidian/steam_folder2.png)

1. Complete all steps in [Method 1 Automator](2025-09-11-playing-windows-games.md#method-1-automator); this is necessary to create a clickable `.app` for the Windows version of Steam (i.e. `Windows (Steam).app`)

2. Change directory to `Applications`

```sh
cd /Applications
```
{: .nolineno }

3. Create a new folder in `Applications` titled `Steam`, either manually (right-click, press **New Folder**, then enter `Steam` as its name) or via terminal

```sh
mkdir -p Steam
```
{: .nolineno }

> Including `-p` flag means that it'll create the new Steam folder **if and only if** it doesn't already exist
> This is to avoid accidentally overwriting it, in case you already have a folder titled `Steam` in that location (i.e. `/Applications/Steam`)
{: .prompt-tip }

4. Move `Steam.app` and `Steam (Windows).app` (or whatever you named it in [Method 1 Automator](2025-09-11-playing-windows-games.md#method-1-automator) section) into your new `Steam` folder (assuming you have both `.app`s in your `/Applications` directory), either manually (drag each `.app` into `Steam` folder) **OR** via terminal
 
```sh
mv -i Steam.app Steam && mv -i "Steam (Windows).app" Steam
```
{: .nolineno }

> Including `-i` (interactive) flag means that you will be asked a confirmation if you already have a file with the same name in the same location
> This is to avoid overwriting in case you already have `Steam.app` and/or `Steam (Windows).app` in that location (i.e. `/Applications/Steam`)
{: .prompt-tip }

5. Find and download a folder icon you like (preferably `.icns` file format)

> This is the folder icon I use
> <a target="_blank" href="https://macosicons.com/#/?icon=1QWV8oirpJ"><img alt="" src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c57cb1eb327518cf548ab8bfde8b821b_1QWV8oirpJ.png"></a>
> 
> Alternatively, you can download it directly here
> ![steam_folder.icns](../assets/obsidian/steam_folder.icns.md)
{: .prompt-tip }

6. Once downloaded, select the folder icon and copy it
	- <kbd>⌘</kbd> + <kbd>C</kbd> (i.e. <kbd>CMD</kbd> + <kbd>C</kbd>)
	- Right-click the icon and click **Copy**

7. Back in `/Applications`, right-click `Steam` folder and click **Get Info**

![steam_get_info.png](../assets/obsidian/steam_get_info.png)

	<p align="center"><img alt="" src="assets/obsidian/gptk/steam_get_info.png"></p>

8. Click on the icon in the upper-left corner (it should be outlined in your system's accent color; in my case it's purple)

![steam_folder_info.png](../assets/obsidian/steam_folder_info.png)

9. Paste the folder icon with <kbd>⌘</kbd> + <kbd>V</kbd> (i.e. <kbd>CMD</kbd> + <kbd>V</kbd>) to update `Steam` folder's icon accordingly

10. Now that you have a custom `Steam` folder with both Mac and Windows versions of Steam (i.e. `Steam.app` and `Steam (Windows).app`), drag the folder into the dock

11. To adjust the appearance, right-click the `Steam` folder icon in the dock (that you just dragged)

12. Make the following selections
	- Under **Display as**, select **Folder**
	- Under **View content as**, select **Grid**

![folder_options.png](../assets/obsidian/folder_options.png)

13. You now have a convenient way to access both versions of Steam via your dock! If you open the `Steam` folder and click on either of the `.app`s, it should launch as expected

> `Steam (Windows).app` takes longer to launch than the native Steam app due to the additional processes it has to run in the background
{: .prompt-info }

#### Set game mode
> **THIS NO LONGER WORKS WITH macOS 16!**
> 
> See ["Symbol not found" when setting game mode](2025-09-11-playing-windows-games.md#symbol-not-found-when-setting-game-mode) for more details.
{: .prompt-important }

This requires XCode, which is one of the [Requirements](2025-09-11-playing-windows-games.md#requirements) (you should already have it by now).

{% tabs game-mode %}
    ---TAB: Enable
        Enable game mode
        ```sh
        /Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl game-mode set on
        ```
        {: .nolineno }
    ---TAB: Disable
        Disable game mode
        ```sh
        /Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl game-mode set off
        ```
        {: .nolineno }
    ---TAB: Auto
        Automatically set game mode
        ```sh
        /Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl game-mode set auto
        ```
        {: .nolineno }
{% endtabs %}

#### Adjust DPI scaling level
Launch Steam with DPI scaling forced to 100%

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'LogPixels' /t REG_DWORD /d 96 /f
```
{: .nolineno }

> 96 DPI = 100% scaling
{: .prompt-info }

#### Check prefix architecture
##### Method 1: Environment Variable
Prints the value of `$WINEARCH`, which should be either `win64` or `win32`

```sh
echo "$WINEARCH"
```
{: .nolineno }

##### Method 2: System Registry
The command below reads the system registry of `$WINEPREFIX` and returns `#arch=win32` or `#arch=win64` depending on the architecture type.

```sh
reg_arch="$(grep '#arch' $WINEPREFIX/system.reg)" && echo "${reg_arch#'#arch='}" || echo "Unknown"
```
{: .nolineno }

Prints value after `#arch=` (i.e. `win32` or `win64`) or "Unknown" if `#arch` is not in `system.reg`

```plaintext
prefix="#arch="
reg_val="#arch=win64"
wine_arch=${reg_val#"$prefix"}
echo "${wine_arch}"
win64
```

#### Enable font smoothing
Font smoothing improves the font's display resolution and font rendering.

##### Method 1: Winetricks
```sh
winetricks fontsmooth=rgb
```
{: .nolineno }

##### Method 2: Regedit
```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideAntiAliasWithCore' /t REG_SZ /d 'Y' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideAntiAliasWithRender' /t REG_SZ /d 'Y' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideWithRender' /t REG_SZ /d 'Y' /f
```
{: .nolineno }

`HKEY_CURRENT_USER\Control Panel\Desktop` keys:

- `FontSmoothing`
	- Value `0`: Disable font smoothing
	- ~~Value `1`: Enable standard font smoothing~~
	- Value `2`: Enable ClearType font smoothing
- `FontSmoothingType`
	- ~~Value `0`: Switch to gray (i.e. basic) font smoothing~~
	- Value `1`: Regular; switch to gray (i.e. basic) font smoothing
	- Value `2`: Subpixel; switch to colored (i.e. ClearType) font smoothing
- `FontSmoothingGamma`
	- Value between `0` (dark/heavier) to `2200` (light/finer) decimal: Intensity of color and darkness of the smoothing.
- `FontSmoothingOrientation`
	- Value `0`: ~~None~~ BGR (?)
	- Value `1`: RGB format (red, green, blue) for LCD, normal
	- ~~Value `2`: BGR format (blue, green, red) for LCD~~

Enable subpixel smoothing/rendering/anti-aliasing (ClearType) RGB[^fontsmooth]:

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothing' /t REG_SZ /d '2' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingOrientation' /t REG_DWORD /d 00000001 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingType' /t REG_DWORD /d 00000002 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingGamma' /t REG_DWORD /d 00000578 /f
```
{: .nolineno }

Enable standard font smoothing[^improvegui]:

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothing' /t REG_SZ /d '2' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingOrientation' /t REG_DWORD /d 00000001 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingType' /t REG_DWORD /d 00000001 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingGamma' /t REG_DWORD /d 00000578 /f
```
{: .nolineno }

Disable subpixel smoothing/rendering/anti-aliasing:

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothing' /t REG_SZ /d '0' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingOrientation' /t REG_DWORD /d 00000001 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingType' /t REG_DWORD /d 00000000 /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'FontSmoothingGamma' /t REG_DWORD /d 00000578 /f
```
{: .nolineno }

#### Disable anti-aliased fonts
Disable anti-aliased fonts[^disableantialias]

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideAntiAliasWithCore' /t REG_SZ /d 'N' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideAntiAliasWithRender' /t REG_SZ /d 'N' /f
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\X11 Driver' /v 'ClientSideWithRender' /t REG_SZ /d 'N' /f
```
{: .nolineno }

#### Set drivers
```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Drivers' /v 'Graphics' /t REG_SZ /d 'mac,x11' /f
```
{: .nolineno }

#### Restore original DLL files
```sh
wineboot -u
```
{: .nolineno }

#### Enable noflicker
```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /t REG_SZ /v 'ForceOpenGLBackingStore' /d 'Y' /f
```
{: .nolineno }

#### Disable window decorations
The heuristics that Wine uses to decide whether or not to trim off the edges of windows and replace them with the platform-native window decorations are imperfect. The Mac driver, like the X11 driver, has a registry setting to turn off window decorations for situations like this.[^disabledecorations]

```sh
WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'Decorated' /t REG_SZ /d 'N' /f
```
{: .nolineno }

> To re-enable window decorations:
> ```sh
> WINEPREFIX=$HOME/Games wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'Decorated' /t REG_SZ /d 'Y' /f
> ```
> {: .nolineno }
{: .prompt-tip }

#### Restrict Wine processes to subset of available cores
Here's a hack that allows you to restrict Wine processes to a subset of the available cores.[^restrictwine]

You can pass a CPU mask through the `WINECPUMASK` environment variable:

`WINECPUMASK=0xff wine ... `

This will tie Wine processes (including `wineserver`) to the first 8 cores. It will also limit the number of reported cores to 8.

To get a performance gain on Ryzen the mask should specify the cores of one core complex (CCX). Here's little bash script that computes the mask for the first CCX:

```bash
#!/usr/bin/env bash
local model_name="$(sysctl -n machdep.cpu.brand_string)"

NUM_CPUS=$(sysctl -n hw.logicalcpu)
echo "$NUM_CPUS-core CPU"

CCX_MASK=$(((1 << $NUM_CPUS / 2) - 1))
echo -n "first CCX mask: "
printf "0x%x\n" $CCX_MASK
```

With this patch The Forest goes from 23 to 40 fps on a 16 core Ryzen CPU. It would be interesting to see if this also makes difference for the games mentioned here and in duplicate reports.

#### Update MoltenVK
> [MoltenVK](https://github.com/KhronosGroup/MoltenVK) is a layered implementation of [Vulkan](https://www.khronos.org/vulkan) graphics and compute functionality, built on Apple's [Metal](https://developer.apple.com/metal) graphics and compute framework...
> 
> Refer to 
[MoltenVK's `README.md`](https://github.com/KhronosGroup/MoltenVK?tab=readme-ov-file#command_line_build) for steps on how to install MoltenVK from source

MoltenVK is a software library which allows Vulkan applications to run on top of Metal on Apple's macOS, iOS, and tvOS operating systems.

Assuming you already have CrossOver, it is possible to add its support for Windows Vulkan games (atop MoltenVK) to GPTk[^gptkvulk]. I also used this method to update MoltenVK for DXVK Wine build.

> `$(brew --prefix game-porting-toolkit)` is equivalent to `/usr/local/opt/game-porting-toolkit`, which redirects to `/usr/local/Cellar/game-porting-toolkit/1.1`
{: .prompt-info }

1. Copy `x86_64-windows/vulkan-1.dll`{: .filepath} to GPTk

```sh
cp -i /Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib/wine/x86_64-windows/vulkan-1.dll $(brew --prefix game-porting-toolkit)/lib/wine/x86_64-windows
```
{: .nolineno }

2. Optionally copy `i386-windows/vulkan-1.dll`{: .filepath} to GPTk for 32-bit support

```sh
cp -i /Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib/wine/i386-windows/vulkan-1.dll $(brew --prefix game-porting-toolkit)/lib/wine/i386-windows
```
{: .nolineno }

3. Copy `libMoltenVK.dylib`{: .filepath} to GPTk

```sh
cp -i /Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib64/libMoltenVK.dylib $(brew --prefix game-porting-toolkit)/lib/external
```
{: .nolineno }

4. Set these environment variables

```sh
CX_APPLEGPTK_LIBD3DSHARED_PATH="$(brew --prefix game-porting-toolkit)/lib/external/libd3dshared.dylib"
WINEDLLPATH_PREPEND="$(brew --prefix game-porting-toolkit)/lib/wine"
WINEDLLOVERRIDES="dxgi,d3d9,d3d10core,d3d11=b;mf,mfplat,mfreadwrite=n"
```
{: .nolineno }

> It should be possible to source these files from other sources of Wine-Crossover, such as those provided by the Heroic Games Launcher (assuming you have not already modified it as described in the previous section. If you have, you should be able to download another version from Heroic.)
{: .prompt-info }

[According to DXVK](https://github.com/doitsujin/dxvk/issues/1788):
- `d3dcompiler_47`{: .filepath} is for DX12
- `d3dcompiler_43`{: .filepath} is for DX11

### Scripts
#### Shell Shortcut

#### Bash Functions for Gaming
Save this script (i.e. `gaming_funcs.sh`), then add to your shell startup file. You can also find [this script in my GitHub Gists](https://gist.github.com/lynkos/fc27a9cf827a4d7adf6c2f3a6b7f0f7a).

> E.g. Here's how I include it in my `.bashrc` file:
> ```bash
> [[ -r "$HOME/Scripts/gaming_funcs.sh" ]] && . "$HOME/Scripts/gaming_funcs.sh"
> ```
> {: .nolineno }
{: .prompt-tip }

```bash
#!/usr/bin/env bash

############################################################################
#                             gaming_funcs.sh                              #
#                                                                          #
#              Bash functions for playing Windows games on Mac             #
# ------------------------------------------------------------------------ #
# Setup:                                                                   #
#    1. Switch architecture                                                #
#       `arch -x86_64 /bin/bash`                                           #
#    2. Set up Wine environment                                            #
#       `set-wine <variant>`                                               #
#                                                                          #
# Usage:                                                                   #
#    *  Download Windows Steam game to Wine prefix via SteamCMD            #
#       `dlg <WINEPREFIX_NAME> <APP_ID>`                                   #
#    *  Move Windows Steam game between Wine prefixes                      #
#       `mvdlg <APP_ID> <SOURCE_WINEPREFIX_NAME> <TARGET_WINEPREFIX_NAME>` #
#    *  Install Windows Steam into specific Wine prefix                    #
#       `instm <WINEPREFIX_NAME>`                                          #
#    *  Quit/stop a specific Wine prefix                                   #
#       `endwine <WINEPREFIX_NAME>`                                        #
#    *  Prints currently active Wine variant + environment info            #
#       `wine-info`                                                        #
#    *  Run Wine with multiple arguments                                   #
#       `run-wine <program> [args...]`                                     #
#    *  Launch Windows version of Steam                                    #
#       `steam`                                                            #
#    *  Enable retina mode for Windows gaming via Wine                     #
#       `retina-on`                                                        #
#    *  Disable retina mode for Windows gaming via Wine                    #
#       `retina-off`                                                       #
#    *  Set macOS Game Mode (Options: on, off, auto)                       #
#       `game-mode <OPTION>`                                               #
#    *  Clear shader cache for Oblivion Remastered                         #
#       `clear-cache`                                                      #
#                                                                          #
# Examples:                                                                #
#    ```                                                                   #
#    arch -x86_64 /bin/bash                                                #
#    set-wine gptk                                                         #
#    instm GPTk                                                            #
#    dlg GPTk 3164500                                                      #
#    run-wine winecfg                                                      #
#    retina-on                                                             #
#    game-mode on                                                          #
#    steam                                                                 #
#    clear-cache                                                           #
#    mvdlg 3164500 GPTk DXMT                                               #
#    set-wine dxmt                                                         #
#    wine-info                                                             #
#    steam                                                                 #
#    endwine DXMT                                                          #
#    ```                                                                   #
# ------------------------------------------------------------------------ #
#                      https://gist.github.com/lynkos                      #
############################################################################

############################## WINE FUNCTIONS ##############################

# Download Windows game to Steam for specific WINEPREFIX via SteamCMD
#
# dlg <WINEPREFIX_NAME> <APP_ID>
#
# E.g. `dlg DXMT 3164500`
dlg() {
   # Path containing all WINEPREFIX's
   local bottles="$HOME/Bottles"

   if [[ $# -eq 2 ]]; then
      # Get current path for later use
      local initdir="$(pwd)"

      # Path of given WINEPREFIX
      local wineprefix="$bottles/$1"
      echo "Given Wine prefix: '$wineprefix'"

      # Create temp directory to store download
      local temp="$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/temp/$2"
      mkdir -p "$temp"
      echo "Temporarily storing download in 'C:\\Program Files (x86)\\Steam\\steamapps\\temp\\$2'"

      # Cleanup logic in case something goes wrong
      trap "echo 'Something went wrong; performing cleanup...'; rm -rf '$temp'; trap - EXIT ERR; echo 'Cleanup complete. Exiting...'; cd '$initdir'" EXIT ERR

      # Enter SteamCMD directory
      cd "$HOME/SteamCMD"

      # Steam username
      local steam_user="REPLACE_THIS_WITH_YOUR_STEAM_USERNAME"

      # Download game
      ./steamcmd.sh +@sSteamCmdForcePlatformType windows +force_install_dir "$temp" +login "$steam_user" +app_update "$2" validate +quit

      # Get directory installation name from its appmanifest
      local dirname="$(sed -n 's/^[[:space:]]*"installdir"[[:space:]]*"\([^"]*\)".*/\1/p' "$temp/steamapps/appmanifest_$2.acf")"
      echo "Directory name of downloaded game is: $dirname"

      # Move and rename downloaded directory into common
      mv "$temp" "$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname"
      echo "Moved and renamed game from 'C:\\Program Files (x86)\\Steam\\steamapps\\temp\\$2' to 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\$dirname'"

      # Go to appmanifest(s) (i.e. .acf file(s))
      cd "$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname/steamapps"

      # Move appmanifest(s) into parent `steamapps` so Steam recognizes game is installed
      mv *.acf ../../../
      echo "Moved downloaded appmanifest(s) from 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\$dirname\\steamapps' to 'C:\\Program Files (x86)\\Steam\\steamapps'"

      # Go back to initial directory
      cd "$initdir"

      # Reset (i.e. re-enable default processing of) signal
      trap - EXIT ERR
      
   else
      echo "ERROR: Invalid number of args. Must include:"
      echo "	* Name of WINEPREFIX (i.e. $(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))"
      printf '	* Steam App ID of game (find at \e]8;;https://steamdb.info\e\\SteamDB.info\e]8;;\e\\)\n'
   fi
}

# Move Steam game from one Wine prefix (e.g. DXMT, DXVK, GPTk, etc.) to another
#
# mvdlg <APP_ID> <SOURCE_WINEPREFIX_NAME> <TARGET_WINEPREFIX_NAME>
# E.g. `mvdlg 2623190 DXMT GPTk`
mvdlg() {
   # Path containing all WINEPREFIXs
   local bottles="$HOME/Bottles"

   if [[ $# -eq 3 ]]; then
      # Path of source WINEPREFIX
      local source="$bottles/$2"
      echo "Source Wine prefix: '$source'"

      # Path of target WINEPREFIX
      local target="$bottles/$3"
      echo "Target Wine prefix: '$target'"
      
      # Get directory installation name from its appmanifest
      local dirname="$(sed -n 's/^[[:space:]]*"installdir"[[:space:]]*"\([^"]*\)".*/\1/p' "$source/drive_c/Program Files (x86)/Steam/steamapps/appmanifest_$1.acf")"
      echo "Directory name of game with App ID '$1' is: '$dirname'"

      # Move game directory from source to target 
      mv "$source/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname" "$target/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname"
      echo "Moved game in 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\$dirname' from '$source' to '$target'"

      # Move app manifest from source to target 
      mv "$source/drive_c/Program Files (x86)/Steam/steamapps/appmanifest_$1.acf" "$target/drive_c/Program Files (x86)/Steam/steamapps/appmanifest_$1.acf"
      echo "Moved 'appmanifest_$1.acf' in 'C:\\Program Files (x86)\\Steam\\steamapps' from '$source' to '$target'"

   else
      echo "ERROR: Invalid number of args. Must include:"
      printf '	* Steam App ID of game (find at \e]8;;https://steamdb.info\e\\SteamDB.info\e]8;;\e\\)\n'
      echo "	* Name of source WINEPREFIX to move downloaded game from (i.e. $(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))"
      echo "	* Name of target WINEPREFIX to move downloaded game to (i.e. $(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))"
   fi
}

# Install Steam for specific Wine prefix
# instm <WINEPREFIX_NAME>
# 
# E.g. `instm DXVK`
instm() {
   # Path containing all WINEPREFIXs
   local bottles="$HOME/Bottles"

   if [[ $# -eq 1 ]]; then
      # Create temporary file for Windows Steam installer
      local temp_file="$(mktemp -t SteamSetup)"
      echo "Created temp file in $temp_file"

      # Cleanup logic in case there's an issue
      trap "echo 'Something went wrong; performing cleanup...'; rm -rf $temp_file; trap - EXIT ERR; echo 'Cleanup complete. Exiting...'" EXIT ERR

      # Download SteamSetup.exe (i.e. Windows Steam installer)
      curl -o "$temp_file" https://cdn.fastly.steamstatic.com/client/installer/SteamSetup.exe

      # Install Windows Steam for WINEPREFIX
      WINEPREFIX="$bottles/$1" "$WINE" "$temp_file"
      echo "Installed Steam in $bottles/$1"

      # Delete temporary Windows Steam installer
      rm -rf "$temp_file"
      echo "Deleted temporary Windows Steam installer in $temp_file"

      # Reset (i.e. re-enable default processing of) signal(s)
      trap - EXIT ERR
      
   else
      echo "ERROR: Invalid number of args. Specify name of ONE (1) bottle to install Steam into ($(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))."
   fi
}

# Quit/stop a specific Wine prefix (e.g. DXMT, DXVK, GPTk, etc.)
#
# endwine <WINEPREFIX_NAME>
# E.g. `endwine DXMT`
endwine() {
   # Path containing all WINEPREFIX's
   local bottles="$HOME/Bottles"

   if [[ $# -eq 1 ]]; then
      WINEPREFIX="$bottles/$1" wineserver -kw
      
   else
      echo "ERROR: Invalid number of args. Specify name of ONE (1) bottle to kill ($(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))."
   fi
}

# Outputs currently active Wine variant + environment status
wine-info() {
    if [[ -z "$WINE" ]]; then
        echo "No Wine environment configured."
        echo "Run 'set-wine <variant>' to set up a Wine environment."
        echo "Available variants: gptk, dxmt, dxvk"

    else
        echo "  Variant: ${WINE_VARIANT:-Unknown}"
        echo "  Prefix: $WINEPREFIX"
        echo "  Executable: $WINE"
        echo "  Version: $($WINE --version 2>/dev/null || echo 'Unknown')"
    fi
}

# Set up Wine environment for a specific variant
# Execute alias `x86` (i.e. `arch -x86_64 /bin/bash`) beforehand
#
# set-wine <variant>
# E.g. `set-wine gptk`
set-wine() {
    local wine_type="$1"

    # Verify Wine variant
    if [[ -z "$wine_type" ]]; then
        echo "Usage: set-wine <variant>" >&2
        echo "Available variants: gptk, dxmt, dxvk" >&2
        return 1
    fi

    # Clear prev set Wine env vars for clean transitions when switching between variants
    unset MTL_HUD_ENABLED DXVK_HUD WINEESYNC DXVK_ASYNC WINEDLLOVERRIDES DXMT_CONFIG_FILE DXMT_LOG_LEVEL DXMT_LOG_PATH DXVK_STATE_CACHE DXVK_CONFIG_FILE DXVK_LOG_LEVEL DXVK_LOG_PATH
    
    # Env vars shared across all Wine variants
    export D3DM_SUPPORT_DXR=1
    export ROSETTA_ADVERTISE_AVX=1
    export D3DM_ENABLE_METALFX=0
    export WINEARCH=win64
    export WINEDEBUG=-all
    
    # Wine variant-specific configs
    case "$wine_type" in
        # Game Porting Toolkit
        "gptk")
            echo "Setting up Game Porting Toolkit environment..."
            local winepath="$HOME/Wine/gptk/3.0b2"
            local wine_executable="wine64"
            local wine_preloader="wine64-preloader"
            local wineprefix="$HOME/Bottles/GPTk"
            export MTL_HUD_ENABLED=1
            export WINEESYNC=1
            export WINE_VARIANT="gptk"
            # export WINEDLLOVERRIDES="dinput8=n,b;d3d12,d3d11,d3d10,dxgi=b"
            ;;

        # DirectX-Metal
        "dxmt")
            echo "Setting up DirectX-Metal translation environment..."
            local winepath="$HOME/Wine/dxmt/10.12"
            local wine_executable="wine"
            local wine_preloader="wine"
            local wineprefix="$HOME/Bottles/DXMT"
            export MTL_HUD_ENABLED=1
            export DXMT_CONFIG_FILE="$winepath/dxmt.conf"
            export DXMT_LOG_LEVEL=none
            export DXMT_LOG_PATH=none
            export WINEESYNC=1
            export WINE_VARIANT="dxmt"
            # export WINEDLLOVERRIDES="dinput8=n,b;d3d12,d3d11,d3d10,dxgi=b"
            ;;

        # DirectX-Vulkan
        "dxvk")
            echo "Setting up DirectX-Vulkan translation environment..."
            local winepath="$HOME/Wine/dxvk/10.12"
            local wine_executable="wine"
            local wine_preloader="wine"
            local wineprefix="$HOME/Bottles/DXVK"
            export DXVK_HUD=full
            export DXVK_ASYNC=1
            export DXVK_STATE_CACHE=1
            export DXVK_CONFIG_FILE="$winepath/dxvk.conf"
            export DXVK_LOG_LEVEL=none
            export DXVK_LOG_PATH=none
            export WINE_VARIANT="dxvk"
            export WINEDLLOVERRIDES="d3d11,d3d10core,dinput8=n,b"
            ;;

        *)
            echo "ERROR: Unknown Wine variant '$wine_type'. Use: 'gptk', 'dxmt', or 'dxvk'" >&2
            return 1
            ;;
    esac
    
    # Set up Wine env paths and executables
    export PATH="$winepath/bin:$PATH"
    export WINELOADER="$winepath/bin/$wine_preloader"
    export WINEDLLPATH="$winepath/lib/wine"
    export WINESERVER="$winepath/bin/wineserver"
    export LD_LIBRARY_PATH="$winepath/lib:$LD_LIBRARY_PATH"
    export DYLD_FALLBACK_LIBRARY_PATH="/usr/lib:$DYLD_FALLBACK_LIBRARY_PATH"
    export WINE="$winepath/bin/$wine_executable"
    export WINEPREFIX="$wineprefix"
    
    echo "Wine environment configured:"
    echo ""
    wine-info
    echo ""
    echo "Usage:"
    echo "  run-wine <program> [args...]"
}

# Run Wine with multiple arguments using Wine env set up with `set-wine`
# Execute alias `x86` (i.e. `arch -x86_64 /bin/bash`) beforehand
#
# I.e.: `x86` --> `set-wine <variant>` --> `run-wine <program> [args...]`
run-wine() {
    # Check if Wine env is configured
    if [[ -z "$WINE" ]]; then
        echo "ERROR: Wine environment not configured. Run 'set-wine <variant>' first." >&2
        echo "Available variants: gptk, dxmt, dxvk" >&2
        return 1
    fi
    
    # Check if any program was given
    if [[ $# -eq 0 ]]; then
        echo "ERROR: No program has been given." >&2
        echo "Usage: run-wine <program> [args...]" >&2
        return 1
    fi
    
    # Execute Windows program using configured Wine env
    "$WINE" "$@"
}

############################## GAMING FUNCTIONS ##############################

# Launch Windows version of Steam
steam() {
    run-wine "C:\Program Files (x86)\Steam\steam.exe"
}

# Enable retina mode for Windows gaming
retina-on() {
   run-wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RetinaMode' /t REG_SZ /d 'Y' /f
    run-wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'LogPixels' /t REG_DWORD /d 192 /f # = (96dpi * 3024 / 1512) = (96dpi * YOUR_MONITOR_WIDTH / 1512). Prev: 216dpi.
}

# Disable retina mode for Windows gaming
retina-off() {
    run-wine reg add 'HKEY_CURRENT_USER\Software\Wine\Mac Driver' /v 'RetinaMode' /t REG_SZ /d 'N' /f
    run-wine reg add 'HKEY_CURRENT_USER\Control Panel\Desktop' /v 'LogPixels' /t REG_DWORD /d 96 /f # 96dpi = 100%
}

# Options: on, off, auto
game-mode() {
    /Applications/Xcode.app/Contents/Developer/usr/bin/gamepolicyctl game-mode set "$1"
}

# Clear shader cache for Oblivion Remastered
clear-cache() {
    rm -r $(getconf DARWIN_USER_CACHE_DIR)/d3dm/OblivionRemastered-Win64-Shipping.exe/shaders.cache || rm -r "$WINEPREFIX/drive_c/Program Files (x86)/Steam/steamapps/shadercache" || rm -r "$HOME/Documents/My Games/Oblivion Remastered"
}
```
{: file="$HOME/Scripts/gaming_funcs.sh" }

#### Steam Installer
This script automatically installs the latest version of Windows Steam into a given Wine prefix.

// TODO Steam installer script for PREFIX, Wine version.

```bash
#!/usr/bin/env bash

# Create temporary file to store download
temp_file="$(mktemp -t SteamSetup)"

# Cleanup logic in case there's an issue
trap "echo 'Something went wrong; performing cleanup...'; rm -rf $temp_file; trap - EXIT ERR; echo 'Cleanup complete. Exiting...'" EXIT ERR

# Download Windows SteamSetup.exe via Steam
curl -o "$temp_file" https://cdn.fastly.steamstatic.com/client/installer/SteamSetup.exe

# Environment variables
export WINEPREFIX="$HOME/Games"
export WINE="wine"

# Install Windows Steam into WINEPREFIX
WINEPREFIX="$WINEPREFIX" "$WINE" "$temp_file"

# Delete temporary Windows Steam installer
rm -rf "$temp_file"

# Reset (i.e. re-enable default processing of) signal(s)
trap - EXIT ERR
```
{: file="$HOME/Scripts/steam_installer.sh" }

#### DXMT Installer
```bash
#!/usr/bin/env bash
# Install DXMT

# Constants
bottle="$HOME/Bottles/DXMT"
winepath="$HOME/Wine/dxmt/10.13"
winelib="$winepath/lib/wine"
winelib_unix="$winelib/x86_64-unix"
winelib_win="$winelib/x86_64-windows"
dxmt_url="https://github.com/3Shain/dxmt/releases/download/v0.60/dxmt-v0.60-builtin.tar.gz"

# Create temporary directory
temp_dir="$(mktemp -d)"
echo "Created temporary directory $temp_dir"

# Cleanup logic in case there's an issue
trap "echo 'Something went wrong; performing cleanup...'; rm -rf $temp_dir; trap - EXIT ERR; echo 'Cleanup complete. Exiting...'" EXIT ERR

# Download and extract DXMT into temporary directory
curl -sqL "$dxmt_url" | tar zxvf - -C "$temp_dir" --strip-components=1
echo "Downloaded DXMT into $temp_dir"

# Move/copy library files into your Wine library
# TODO: If file with same name exists, create backup of original file (aka implement `mv -b` cmd for macOS)
mv -i "$temp_dir/x86_64-unix/winemetal.so" "$winelib_unix"
echo "Moved winemetal.so into $winelib_unix"

cp -i "$temp_dir/x86_64-windows/winemetal.dll" "$winelib_win"
echo "Copied winemetal.dll into $winelib_win"

mv -i "$temp_dir/x86_64-windows/winemetal.dll" "$bottle/drive_c/windows/system32/"
echo "Moved winemetal.dll into $bottle/drive_c/windows/system32/"

mv -i "$temp_dir/x86_64-windows/d3d11.dll" "$winelib_win"
echo "Moved d3d11.dll into $winelib_win"

mv -i "$temp_dir/x86_64-windows/dxgi.dll" "$winelib_win"
echo "Moved dxgi.dll into $winelib_win"

mv -i "$temp_dir/x86_64-windows/d3d10core.dll" "$winelib_win"
echo "Moved d3d10core.dll into $winelib_win"

# Delete temporary directory
rm -rf "$temp_dir"
echo "Deleted temporary directory $temp_dir"

# Reset (i.e. re-enable default processing of) signal(s)
trap - EXIT ERR

echo "DXMT installation complete!"
```
{: file="$HOME/Scripts/dxmt_installer.sh" }

#### Automate Steam Downloads
If you'd prefer to do this manually, refer to [Solution 2 SteamCMD](2025-09-11-playing-windows-games.md#solution-2-steamcmd). Alternatively, check out [Solution 1 Steam Console](2025-09-11-playing-windows-games.md#solution-1-steam-console) for an alternate method.

```bash
#!/usr/bin/env bash

# Download Windows game to Steam for specific WINEPREFIX via SteamCMD
#
# dlg <WINEPREFIX_NAME> <APP_ID>
#
# E.g. `dlg DXMT 3164500`
dlg() {
   # Path containing all WINEPREFIX's
   local bottles="$HOME/Bottles"

   if [[ $# -eq 2 ]]; then
      # Get current path for later use
      local initdir="$(pwd)"

      # Path of given WINEPREFIX
      local wineprefix="$bottles/$1"
      echo "Wine prefix: '$wineprefix'"

      # Create temp directory named <APP_ID> to store download
      local temp="$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/temp/$2"
      mkdir -p "$temp"
      echo "Temporarily storing download in 'C:\\Program Files (x86)\\Steam\\steamapps\\temp\\$2'"

      # Cleanup logic in case there's an issue
      trap "echo 'Something went wrong; performing cleanup...'; rm -rf $temp; trap - EXIT ERR; cd $initdir; echo 'Cleanup complete. Exiting...'" EXIT ERR

      # Enter SteamCMD directory
      cd "$HOME/SteamCMD"

      # Steam username
      local steam_user="YOUR_STEAM_USERNAME"

      # Download game
      ./steamcmd.sh +@sSteamCmdForcePlatformType windows +force_install_dir "$temp" +login "$steam_user" +app_update "$2" validate +quit

      # Get actual directory name from appmanifest
      local dirname="$(sed -n 's/^[[:space:]]*"installdir"[[:space:]]*"\([^"]*\)".*/\1/p' "$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/temp/$2/steamapps/appmanifest_$2.acf")"
      echo "Directory name of downloaded game is: $dirname"

      # Move and rename downloaded directory into common
      mv "$temp" "$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname"
      echo "Moved and renamed game from 'C:\\Program Files (x86)\\Steam\\steamapps\\temp\\$2' to 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\$dirname'"

      # Go to appmanifest(s) (i.e. .acf file(s))
      cd "$wineprefix/drive_c/Program Files (x86)/Steam/steamapps/common/$dirname/steamapps"

      # Move appmanifest(s) so Steam recognizes game is installed
      mv *.acf ../../../
      echo "Moved downloaded appmanifest(s) from 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\$dirname\\steamapps' to 'C:\\Program Files (x86)\\Steam\\steamapps'"
      
      # Go back to initial directory
      cd "$initdir"

      # Reset (i.e. re-enable default processing of) signal(s)
      trap - EXIT ERR

   else
      echo "ERROR: Invalid number of args. Must include:"
      echo "	* Name of WINEPREFIX (i.e. $(/bin/ls --color=always -dm $bottles/*/ | tr -d '\n' | sed "s|$bottles/||g"))"
      printf '	* Steam App ID of game (find at \e]8;;https://steamdb.info\e\\SteamDB.info\e]8;;\e\\)\n'
   fi
}
```
{: file="$HOME/Scripts/gaming_funcs.sh" }

#### MetalFX Integration
Enable:

```sh
#!/usr/bin/env bash

# Old version
version="v3b2" # Game Porting Toolkit 3.0 Beta 2

# Wine prefix path
bottle="$HOME/Games"

# Wine lib path
wine="$HOME/Wine/gptk/3.0b3/wine/lib/wine"

# Enter directory
cd "$wine"

# Backup old versions
mv x86_64-unix/nvngx.so "x86_64-unix/nvngx-$version.so"
mv x86_64-windows/nvngx.dll "x86_64-windows/nvngx-$version.dll"
mv "$bottle/drive_c/windows/system32/nvngx.dll" "$bottle/drive_c/windows/system32/nvngx-$version.dll"
mv "$bottle/drive_c/windows/system32/nvapi64.dll" "$bottle/drive_c/windows/system32/nvapi64-$version.dll"

# Rename nvngx-on-metalfx.so to nvngx.so
mv x86_64-unix/nvngx-on-metalfx.so x86_64-unix/nvngx.so

# Rename nvngx-on-metalfx.dll to nvngx.dll
mv x86_64-windows/nvngx-on-metalfx.dll x86_64-windows/nvngx.dll

# Move new nvngx.dll into Wine prefix system32
cp x86_64-windows/nvngx.dll "$bottle/drive_c/windows/system32"

# Move new nvapi64.dll into Wine prefix system32
cp x86_64-windows/nvapi64.dll "$bottle/drive_c/windows/system32"

export D3DM_ENABLE_METALFX=1

echo "MetalFX Integration: ENABLED"
```
{: file="$HOME/Scripts/enable_metalfx.sh" }

Disable:

```sh
#!/usr/bin/env bash

# Old version
version="v3b2" # Game Porting Toolkit 3.0 Beta 2

# Wine prefix path
bottle="$HOME/Games"

# Wine lib path
wine="$HOME/Wine/gptk/3.0b3/wine/lib/wine"

# Enter directory
cd "$wine"

# Remove new nvngx.dll from Wine prefix system32
rm -rf "$bottle/drive_c/windows/system32/nvngx.dll"

# Remove new nvapi64.dll from Wine prefix system32
rm -rf "$bottle/drive_c/windows/system32/nvapi64.dll"

# Rename backed up files
mv "$bottle/drive_c/windows/system32/nvngx-$version.dll" "$bottle/drive_c/windows/system32/nvngx.dll"
mv "$bottle/drive_c/windows/system32/nvapi64-$version.dll" "$bottle/drive_c/windows/system32/nvapi64.dll"

# Undo backup
# TODO

export D3DM_ENABLE_METALFX=0

echo "MetalFX Integration: DISABLED"
```
{: file="$HOME/Scripts/disable_metalfx.sh" }

#### Game Porting Toolkit 2.1
This script is taken directly from Game Porting Toolkit 2.1. Full credit goes to Apple.
```sh
#!/bin/zsh
# Copyright (c) 2023-2025 Apple Inc. All right reserved.

if [ -z "$1" ];  then
	echo "Usage: $0 <wine-prefix-path> <executable>"
fi

exe_path="cmd.exe"
if [ ! -z "$2" ]; then
	exe_path="$2"
fi

MTL_HUD_ENABLED=1 WINEESYNC=1 WINEPREFIX="$1" `brew --prefix game-porting-toolkit`/bin/wine64 "$exe_path" 2>&1 | grep "D3DM"
```
{: file="/usr/local/bin/gameportingtoolkit" }

### Logging
This subsection is taken directly from Game Porting Toolkit's `README.md` file and has been modified in some parts.

> The provided `bin/ee4wg*` scripts can be copied onto your path to facilitate different forms of logging and launching. You can run these scripts from any shell; you don’t need to switch to the Rosetta environment first.
{: .prompt-tip }

> - Logging output will appear in the Terminal window in which you launch your game as well as the system log, which can be viewed with `/System/Applications/Utilities/Console.app`{: .filepath}
> - Log messages from the evolution environment for Windows games are prefixed with **D3DM** and are logged to the system log using the "D3DMetal" category. By default the `ee4wg*` scripts will filter to just the **D3DM**-prefixed messages.
> - If you are experiencing an issue and want to send logging information through [https://feedbackassistant.apple.com](https://feedbackassistant.apple.com), please attach and send the full logs without filtering to **D3DM**

### Debugging
Using Metal Debugger. This subsection is taken directly from Game Porting Toolkit's `README.md` file and has been modified in some parts.

> You will need to [disable System Integrity Protection (SIP)](https://developer.apple.com/documentation/security/disabling_and_enabling_system_integrity_protection) to debug CrossOver's Wine processes.
> Reenable SIP after you finish debugging.
{: .prompt-info }

1. Compile your shaders with embedded debug information ([https://developer.apple.com/metal/shader-converter/#shader](https://developer.apple.com/metal/shader-converter/#shader)) by passing `-Zi -Qembed_debug` to the DX Compiler.
2. In CrossOver, select a bottle to launch your game from.
3. Enable **D3DMetal** in the **Advanced Settings** for the bottle.
4. Launch your game by clicking **Run Command**, choosing your game executable, and inserting the following environment variables to enable Metal debugging and processing of debug information:
```sh
MTL_CAPTURE_ENABLED=1
D3DM_DXIL_PROCESS_DEBUG_INFORMATION=1
```
{: .nolineno }
5. In Xcode, click **Debug** > **Debug Executable…** from the menubar and select `CrossOver.app` (this is just to get a workspace window open)
6. In the visible Scheme options, click the **Options** tab and change **GPU Frame Capture** from **Automatically** to **Metal**.
7. Close Scheme.
8. Click **Debug** > **Attach to Process** from the menubar and select your launched game process.
9. After the debugger attaches to the process, you can [capture your Metal workload](https://developer.apple.com/documentation/xcode/capturing-a-metal-workload-in-xcode#Capture-your-Metal-workload-while-debugging).

> If `lldb` suspends the process due to handling `SIGUSR1`, you will need to run the following commands to ignore this signal and continue the process:
> ```sh
> process handle -pass false -stop false -notify false
> SIGUSR1
> continue
> ```
> {: .nolineno }
{: .prompt-info }

Clear terminal:
- <kbd>CTRL</kbd> + <kbd>L</kbd>
- `clear`

### Further Reading
- [Game Porting Toolkit](https://www.applegamingwiki.com/wiki/Game_Porting_Toolkit) ([AppleGamingWiki](https://www.applegamingwiki.com))
- [Game Porting Toolkit](https://developer.apple.com/games/game-porting-toolkit) ([Apple Developer](https://developer.apple.com))
- [MacOS FAQ (Wine)](https://gitlab.winehq.org/wine/wine/-/wikis/MacOS-FAQ)
- [Building Wine](https://gitlab.winehq.org/wine/wine/-/wikis/Building-Wine)
- [Wine User's Guide](https://gitlab.winehq.org/wine/wine/-/wikis/Wine-User's-Guide)
- [macOS Building (Wine)](https://gitlab.winehq.org/wine/wine/-/wikis/MacOS-Building)
- [Installation of Wine via sources](https://forum.winehq.org/viewtopic.php?t=36691)
- [Wine (Arch Linux)](https://wiki.archlinux.org/title/Wine)
- [How to Properly Build Wine on macOS](https://www.reddit.com/r/macgaming/comments/1kwmnfw/help_how_to_properly_build_wine_on_macos_apple)
- [The Nightmare that has been Building Wine](https://www.reddit.com/r/wine_gaming/comments/ow5a1n/the_nightmare_that_has_been_building_wine_from)
- [Metal Shader Converter](https://news.ycombinator.com/item?id=36298798)
- [Steam Command Line Options](https://developer.valvesoftware.com/wiki/Command_line_options)
- [Edit binary](https://danluu.com/edit-binary)
- https://forum.winehq.org/viewtopic.php?t=30767
- [macOS dylib injection](https://blog.balliskit.com/macos-dylib-injection-at-scale-designing-a-self-sufficient-loader-da8799a56ada)
- [How to Permanently Disable Steam Client Webhelper](https://www.reddit.com/r/Steam/comments/splcjs/how_to_permanently_disable_steam_client_webhelper)
- [CrossOver Source](https://www.codeweavers.com/crossover/source)
- [macOS Wine Builds (GitHub)](https://github.com/Gcenx/macOS_Wine_builds)
- [DXVK macOS](https://github.com/Gcenx/DXVK-macOS)
- [DXVK](https://github.com/doitsujin/dxvk)
- [CrossOver Source Code](https://media.codeweavers.com/pub/crossover/source)
- [Editing Bottle Registry Keys](https://support.codeweavers.com/editing-bottle-registry-keys)
- [Kegworks Winery](https://j0.lol/blog/kegworks-winery)
- [Steam Console parameters aka command-line options](https://gist.github.com/davispuh/6600880)
- [DXMT Wiki](https://github.com/3Shain/dxmt/wiki)
- [CrossOver User Guide](https://www.codeweavers.com/support/docs/crossover-mac/index)

### References
[^controller]: [Connect a wireless game controller to your Apple device](https://support.apple.com/en-us/111099) ([Apple Support](https://support.apple.com))
[^xbox]: [Connect an Xbox wireless game controller to your Apple device](https://support.apple.com/en-us/111101) ([Apple Support](https://support.apple.com))
[^ps]: [Connect a PlayStation wireless game controller to your Apple device](https://support.apple.com/en-us/111100) ([Apple Support](https://support.apple.com))
[^vidmem]: [Memory Leak When Using the Game Porting Toolkit](https://www.reddit.com/r/macgaming/comments/18dxhu9/memory_leak_when_using_the_game_porting_toolkit) ([/r/MacGaming](https://www.reddit.com/r/macgaming)) and [Setting your Video Memory Size (CrossOver)](https://www.codeweavers.com/compatibility/crossover/tips/star-wars-the-old-republic/not-valid-2021-setting-your-video-memory-size-not-valid)
[^gptkvulk]: [GPTk-Vulkan](https://www.applegamingwiki.com/wiki/Gptk-Vulkan) ([AppleGamingWiki](https://www.applegamingwiki.com))
[^vram]: [Allocate macOS VRAM dynamically](https://www.reddit.com/r/macgaming/comments/1k0onrj/comment/mnfq6ly) ([/r/MacGaming](https://www.reddit.com/r/macgaming)), [Increase VRAM allocation](https://www.reddit.com/r/LocalLLaMA/comments/186phti/m1m2m3_increase_vram_allocation_with_sudo_sysctl) ([/r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA)), [Adjust VRAM/RAM split on Apple Silicon (GitHub)](https://github.com/ggml-org/llama.cpp/discussions/2182#discussioncomment-7698315), and [Optimizing VRAM Settings for Using Local LLM on macOS (Fine-tuning: 1)](https://blog.peddals.com/en/fine-tune-vram-size-of-mac-for-llm)
[^wine]: [Wine](https://gitlab.winehq.org/wine/wine/-/wikis/Man-Pages/wine)
[^winefiles]: [Wine Files](https://gitlab.winehq.org/wine/wine/-/wikis/Man-Pages/wine#files)
[^steamconsole]: [Steam Console](https://www.reddit.com/r/macgaming/comments/1lqee3q/comment/n12hfzp) ([/r/MacGaming](https://www.reddit.com/r/macgaming))
[^wine2]: [Wine (Arch Linux)](https://wiki.archlinux.org/title/Wine)
[^fontsmooth]: [Enable or Disable Font Smoothing in Windows](https://www.elevenforum.com/t/enable-or-disable-font-smoothing-in-windows-11.8476/)
[^improvegui]: [Improve GUI Appearance of Wine Applications](https://askubuntu.com/questions/219791/improve-gui-appearance-of-wine-applications/219795#219795)
[^disableantialias]: [How Can I Turn Off Anti-aliased Fonts](https://support.codeweavers.com/en_US/bottles-associations-fonts/how-can-i-turn-off-anti-aliased-fonts)
[^disabledecorations]: [Disable Window Decorations in the Mac Driver](https://support.codeweavers.com/disable-window-decorations-in-the-mac-driver)
[^restrictwine]: [Wine Bugs](https://bugs.winehq.org/show_bug.cgi?id=43277#c48)