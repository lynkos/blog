---
share: true
title: Custom Storage
date: 2026-01-20 20:15:03 -0400
filename: 2025-01-20-custom-storage
description: DIY guide on building your own storage solution with a WD_BLACK SN850X NVMe SSD (or any NVMe M.2 SSDs with 2280 / 2242 / 2230 form factor) and an OWC Express 1M2 Enclosure.
categories:
  - tutorial
  - guide
tags:
  - tutorial
  - computer-science
  - technology
  - gaming
  - mac
  - unix
---
> **Note**: I started writing this before SSD prices skyrocketed, so I'm aware that some of the following (namely SSDs being an affordable option to adding additional storage to your Mac) may no longer be applicable...
{: .prompt-important }

Buying storage for your new MacBook is expensive and can be inconvenient. Customers can't modify internal storage later, so what you buy is what you get. But what if you wanted an additional, customizable, and portable 4 TB SSD storage? That's what this guide seeks to address.

## Background
This except from [TonyMacx86](https://www.tonymacx86.com/threads/choosing-a-compatible-nvme-ssd-for-your-macos-boot-drive.323479)[^nvme-mac] should provide some context:
> An SSD controller, also referred to as a processor, includes the electronics that bridge the NAND Flash memory components to the SSD input/output interfaces. The controller is an embedded processor that executes firmware-level software. The SSD firmware is device specific, and in most cases can be updated.
> 
> ![ssd.png](../assets/obsidian/ssd.png)
> 
>  Since November 2020, Apple has placed their SSD (NAND flash) Controller on the SoC and kept the NAND Flash separate for security reasons. This makes it nearly impossible to remove the SSD from a stolen M1/M2 Mac and view the data on another Mac. Even if you have the exact same model of Apple Silicon Mac to install it in. The Secure Enclave (also on the SoC) is isolated from the main processor to provide an extra layer of security and is designed to keep sensitive user data secure even when the Application Processor kernel becomes compromised.
>  
>  ![ssd_chart.jpg](../assets/obsidian/ssd_chart.jpg)

There's a bunch of SSDs and enclosures to choose from. How did I narrow it down, and why did I choose the WD_BLACK SN850X and the OWC Express 1M2 Enclosure?

Well, first, I wanted to make sure it was compatible with Mac (since I use a MacBook Pro). It needs to be customizable, so buying a pre-made external drive was out of the question. Since I'd be using it for game storage, it also had to be powerful and made with that purpose in mind. Of course, I also want to use it for backups and other stuff (i.e. not just gaming). I own _a lot_ of games (mostly on Steam), so I decided to play it safe and went with 4 TB storage size.

I was torn between the Samsung 990 PRO and WD_BLACK SN850X, but chose the latter after reading about a weird bug with Samsung 990 PRO that only affects Macs[^nvme-mac].

> Prior to macOS Monterey, Samsung drives worked seemingly without issue. We don't know what changed in macOS 12 but we do know that Samsung's proprietary NVMe SSD controllers do not work well with macOS Monterey or Ventura. It doesn't look like a firmware fix from Samsung is ever going to be released. Here's a few examples of their drives that will potentially lead to ultra long macOS boot times. Some have reported six to seven minutes.
> 
> ![ssd_csv.png](../assets/obsidian/ssd_csv.png)
> 
> This is TRIM and APFS related. Disabling TRIM is not recommended... Acasis, who makes Mac compatible NVMe enclosures, warns their customers about using Samsung 970 EVO (Plus) drives with their product. Note that the WD SN570, SN770 and SN850(X) perform the very best of any drives
> 
> ![ssd_compat.jpg](../assets/obsidian/ssd_compat.jpg)

This has been documented several times, such as with [Acidanthera's research on the Samsung "TRIM Bug"](https://github.com/dortania/bugtracker/issues/192) and [this thread on tonymacx86.com that shows how write speeds are reduced to extremely slow levels when using a Samsung NVMe with an APFS formatted drive](https://www.tonymacx86.com/threads/slow-random-writes-on-nvme-ssd.327436).

Although I'm currently using macOS Tahoe, like I said, I chose to avoid the Samsung 990 PRO just in case. The fact that Apple sources their SSDs from Western Digital (aka SanDisk) also helped me feel sure of my choice.

The OWC Express 1M2 Enclosure was an easy choice since they are known to support both Mac AND Windows, and (to my knowledge) have a reputation for quality.

## Requirements
- [x] [WD_BLACK SN850X without Heatsink](https://shop.sandisk.com/products/ssd/internal-ssd/wd-black-sn850x-nvme-ssd?sku=WDS400T2X0E-00BCA0) **OR** any NVMe M.2 SSDs with 2280 / 2242 / 2230 form factor
- [x] [OWC Express 1M2 Enclosure](https://www.owc.com/solutions/express-1m2) (**0TB**, i.e. just the enclosure **ONLY**)
- [x] macOS 10.13 or later
- [x] [Pelican 1040 Micro Case](https://www.pelican.com/us/en/product/cases/micro/1040?sku=1040-025-100) (**OPTIONAL**)
- [x] [USB-C Dust Plug](https://a.co/d/emuCPyw) (**OPTIONAL**)

## Initial Setup
### Device Assembly
1. Place OWC Express 1M2 upside down on a flat static free surface
2. Remove the screws by using the included screwdriver
   ![Unscrewed OWC Express 1M2](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-07_Lid_Slid_Off_bkxlr9)
3. Slide back then lift away the bottom tray
   ![Opening OWC Express 1M2](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-08_Lid_Lift_igs5bn)
4. Once the enclosure is open, take your NVMe M.2 SSD and carefully slide it inside
   ![Sliding SSD into OWC Express 1M2](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-14_Notch_Glow_csugmw)
   ![Full view of sliding SSD into OWC Express 1M2](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-16_SSD_In_y1kevt)
   > If your SSD has a 2242 **OR** 2230 form factor, you will need a 5mm hex socket to loosen the drive post, then move it to the desired form factor position
   > ![Loosening drive post in enclosure](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-24_2242_Post_Move_xyvd8q)
   {: .prompt-info }
5. Screw the SSD into the enclosure so it's secured
   ![Securing SSD into enclosure](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-17_SSD_Screw_Down_yxkgjm)
   ![Secured SSD inside enclosure](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-18_SSD_Down_dit7no)
6. Align the enclosure's previously removed bottom tray with the top cover so the thermal pad (i.e. yellow and purple strip inside the enclosure) is atop the SSD, slide the pieces together, then gently press down the top cover to ensure they stick
   ![Closing SSD](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-08_Lid_Lift_igs5bn)
7. To make sure it's properly shut, screw the previously removed screws back inside the enclosure with the screwdriver
   ![Screwing enclosure shut](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-27_Case_Screws_In_xnuvwy)
8. Peel open one of the included rubber foots and press it into the crevice containing the screws
   ![Placing sticker on enclosure](https://media.owcnow.com/image/upload/e_trim,bo_4px_solid_black/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp1M2-Man-28_Pads_On_w9thz4)
9. Using the included 0.3M (12") USB4 cable, connect it into the OWC Express 1M2 USB4 port and your Mac
   ![USB4 port on the enclosure's side](https://media.owcnow.com/image/upload/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp_1M2_Back_a6m1pj)
   > If successfully connected, the LED indicator should light up
   > ![LED indicator on the enclosure's side](https://media.owcnow.com/image/upload/w_800,c_scale,f_auto,q_auto,dpr_2.0/Exp_1M2_Front_v1_ccjxv4)
   {: .prompt-info }

### Format SSD
> Make sure to complete **ALL** the steps in [Device Assembly](2025-01-20-custom-storage.md#device-assembly) before proceeding
{: .prompt-important }

1. Open **Disk Utility**
   ![Disk Utility app](https://help.apple.com/assets/63FD50B6B945CD5D3F3A2AD3/63FD50B7B945CD5D3F3A2ADA/en_US/f606b0483c6a446b0ea4554b02fca0cc.png)
2. Click on <kbd>View</kbd>, then <kbd>Show All Devices</kbd>
   ![disk_utility_view.png](../assets/obsidian/disk_utility_view.png)
3. In the sidebar, select your SSD under **External**; in this example, it's named "WD_BLACK SN850X 4000GB Media"
   ![disk_utility_ssd.png](../assets/obsidian/disk_utility_ssd.png)
4. Click the <kbd>Erase</kbd> button
   ![disk_utility_erase.png](../assets/obsidian/disk_utility_erase.png)
5. Click the <kbd>Scheme</kbd> pop-up menu, then choose <kbd>GUID Partition Map</kbd>
6. Click the <kbd>Format</kbd> pop-up menu, then choose the <kbd>Apple File System (APFS)</kbd> format
7. Enter a name
8. Click <kbd>Erase</kbd>, then click <kbd>Done</kbd>

### Create Volumes
> Make sure to complete **ALL** the steps in [Format SSD](2025-01-20-custom-storage.md#format-ssd) before proceeding
{: .prompt-important }

1. Click on your SSD in **Disk Utility**
2. Click on the <kbd>+</kbd> symbol above **Volume** to add a volume
	![disk_utility_volume.png](../assets/obsidian/disk_utility_volume.png)
3. Enter a name for the volume, then click <kbd>Size Options...</kbd> button
	![disk_utility_add_apfs.png](../assets/obsidian/disk_utility_add_apfs.png)
4. If you plan on having more than 1 volume on your SSD, enter your **Reserve Size** and/or **Quota Size** (both values are optional)
	![disk_utility_size_options.png](../assets/obsidian/disk_utility_size_options.png)
	- **Reserve Size**: Ensures that the amount of storage remains available for this volume
	- **Quota Size**: Limits how much storage the volume can allocate
5. Click <kbd>Add</kbd>, then <kbd>Done</kbd>
6. Repeat Steps 1 – 5 for each volume you want to create; in my case, I created 2 volumes: 1 for **Backups** and 1 for **Games**
7. To view your newly created volumes, click on <kbd>View</kbd>, then <kbd>Show Only Volumes</kbd>

![Games volume setup](../assets/obsidian/disk_utility_games.png)
_**Games** volume setup in **Disk Utility**_

![Backups volume setup](../assets/obsidian/disk_utility_backups.png)
_**Backups** volume setup in **Disk Utility**_

### Setup Volumes
> Make sure to complete **ALL** the steps in [Create Volumes](2025-01-20-custom-storage.md#create-volumes) before proceeding
{: .prompt-important }

#### Backups: Time Machine
1. Open **System Settings**
2. Click <kbd>General</kbd>, then <kbd>Time Machine</kbd>
   ![settings_general_time_machine.png](../assets/obsidian/settings_general_time_machine.png)
3. Click the <kbd>+</kbd> symbol
   ![settings_add_backup.png](../assets/obsidian/settings_add_backup.png)
4. Select the volume you want to use as your backup device, then click <kbd>Set Up Disk...</kbd>
   ![settings_select_backup.png](../assets/obsidian/settings_select_backup.png)
5. Customize it to your liking, then click <kbd>Done</kbd>
   ![settings_setup_disk.png](../assets/obsidian/settings_setup_disk.png)
6. It should now appear as one of the listed backup devices
7. Click <kbd>Options...</kbd> for further customization, then click <kbd>Done</kbd>
   ![settings_time_machine_options.png](../assets/obsidian/settings_time_machine_options.png)

Now that it's setup, you can use your device as backup. If you're still in the **Time Machine** settings and want to immediately backup: right-click your backup device, then click <kbd>Back Up to "&lt;YOUR_DEVICE_NAME&gt;" Now</kbd>

Anytime you want to create a backup, click the **Time Machine** icon in your menubar, then click <kbd>Back Up Now</kbd> in the dropdown
![time_machine_menubar.png](../assets/obsidian/time_machine_menubar.png)

#### Games: Steam
> If you're like me and want to save both Windows (played via WINE) **AND** Mac games to the SSD, you'll want to create 2 separate folders in your volume. This is to avoid [installation conflicts and other issues](https://steamcommunity.com/discussions/forum/2/4202490864584630436).
> 
> If this doesn't apply to you, there's no need to create 2 separate folders or follow the steps in this section. All you'd need to do is:
> 1. Open **Steam**
> 2. Navigate to <kbd>Preferences</kbd> (or <kbd>Settings</kbd>) > <kbd>Storage</kbd>
> 3. Click <kbd>+ Add Drive</kbd>
> 4. Select your drive from the dropdown
> 
> If you're interested in reading more about my WINE setup, check out [How to Run Windows Games and Programs on Mac](2025-03-19-play-windows-games.md).
{: .prompt-info }

1. Open **Finder**
2. Click on the volume you want to save your games to, then create 2 folders: `WindowsGames` and `MacGames`
   ![finder_games.png](../assets/obsidian/finder_games.png)
3. Open the Mac **Steam** client, then open **Settings** (either with <kbd>⌘</kbd> + <kbd>,</kbd> or by clicking <kbd>Steam</kbd> > <kbd>Preferences</kbd> in the menubar)
4. Click <kbd>Storage</kbd>
   ![steam_storage.png](../assets/obsidian/steam_storage.png)
5. Navigate to your backup
   ![steam_storage_games.png](../assets/obsidian/steam_storage_games.png)
6. Click the <kbd>...</kbd> icon, then click <kbd>Remove Library</kbd>
   ![steam_storage_remove.png](../assets/obsidian/steam_storage_remove.png)
7. Quit Steam (either with <kbd>⌘</kbd> + <kbd>Q</kbd>, by clicking <kbd>Steam</kbd> > <kbd>Quit Steam</kbd> in the menubar, or right-click the Steam icon in the dock and click <kbd>Quit</kbd>)
8. Reopen **Finder** and navigate to your drive
9. Create a new `steamapps` folder inside **BOTH** `MacGames` **AND** `WindowsGames`
   ```plaintext
	.
	├── MacGames/
	│   └── steamapps
	└── WindowsGames/
	    └── steamapps
   ```
   {: file="/Volumes/<YOUR_DEVICE_NAME>" }
10. Relaunch the Mac **Steam** client, open **Settings** (either with <kbd>⌘</kbd> + <kbd>,</kbd> or by clicking <kbd>Steam</kbd> > <kbd>Preferences</kbd> in the menubar), then click <kbd>Storage</kbd>
11. Click <kbd>+ Add Drive</kbd>
    ![steam_add_drive.png](../assets/obsidian/steam_add_drive.png)
12. Select <kbd>Let me choose another location</kbd> from the dropdown, then click <kbd>Add</kbd>
13. Navigate to your drive, select `MacGames`, then click <kbd>Open</kbd>
    ![steam_add_drive_select.png](../assets/obsidian/steam_add_drive_select.png)
14. Quit Steam (either with <kbd>⌘</kbd> + <kbd>Q</kbd>, by clicking <kbd>Steam</kbd> > <kbd>Quit Steam</kbd> in the menubar, or right-click the Steam icon in the dock and click <kbd>Quit</kbd>)
15. Open your Windows **Steam** client (e.g. via CrossOver, your own WINE setup, etc.)
16. Click <kbd>Steam</kbd> > <kbd>Settings</kbd>
    ![win_steam_settings.png](../assets/obsidian/win_steam_settings.png)
17. Navigate to <kbd>Storage</kbd>, then click <kbd>+ Add Drive</kbd>
18. Select <kbd>Let me choose another location</kbd> from the dropdown, then click <kbd>Add</kbd>
19. Navigate to your drive, select `WindowsGames`, then click <kbd>Open</kbd>
    ![win_steam_select_drive.png](../assets/obsidian/win_steam_select_drive.png)

If everything's setup properly, you should be able to install games into their respective drives!

## Performance
### WD_BLACK SN850X
![Disk speed test](../assets/obsidian/disk_speed_test.png)
_Speed test performed with [Blackmagic Disk Speed Test](https://apps.apple.com/us/app/blackmagic-disk-speed-test/id425264550?mt=12)_

### OWC Express 1M2
For your convenience, OWC has tested how the OWC Express 1M2 Enclosure performs on Apple Silicon devices.[^owc-perf] Although they only tested it on iPad Pros, this should still give you a rough idea of its performance.

| **Tested Host**        | **Transfer Direction** | **Performance** |
|------------------------|------------------------|-----------------|
| iPad Pro 12.9" 5th gen | Express → iPad         | 588 MB/s        |
| iPad Pro 12.9" 5th gen | iPad → Express         | 1,970 MB/s      |
| iPad Pro 12.9" 4th gen | Express → iPad         | 221 MB/s        |
| iPad Pro 12.9" 4th gen | iPad → Express         | 600 MB/s        |
| iPad Pro 11" 4th gen   | Express → iPad         | 319 MB/s        |
| iPad Pro 11" 4th gen   | iPad → Express         | 1,618 MB/s      |
| iPad Pro 11" 3rd gen   | Express → iPad         | 553 MB/s        |
| iPad Pro 11" 3rd gen   | iPad → Express         | 1,671 MB/s      |
| 2023 Mac Pro           | Express → Mac Pro      | 3,122 MB/s      |
| 2023 Mac Pro           | Mac Pro → Express      | 3,250 MB/s      |

Here are the takeaways[^owc-perf]:

> - Transferring files from the OWC Express 1M2 to the Apple Silicon iPad Pro experienced the limitation of up to 600MB/s.
> - Transferring from the Apple Silicon iPad Pro to the OWC Express 1M2 experienced the limitation of up to 1,970MB/s.
> - The OWC Express 1M2 can produce better performance and experiences 3,200MB/s when connected with a 2023 Mac Pro. 

## References
[^nvme-mac]: [Choosing a Compatible NVMe SSD for your macOS Boot Drive](https://www.tonymacx86.com/threads/choosing-a-compatible-nvme-ssd-for-your-macos-boot-drive.323479)
[^owc-perf]: [Apple Silicon iPad Pro (Thunderbolt Enabled): External Drive Performance](https://eshop.macsales.com/manuals/apple-silicon-ipad-pro-external-drive-performance-support-article)