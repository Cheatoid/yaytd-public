# yaytd-public
Welcome to the public version of mine currently private project called *yaytd* (Yet Another YouTube Downloader).  
I decided to implement this one using NodeJS & PowerShell for my own simplicity.

## Enough crap. What is this?
yaytd allows you to run localhost HTTP server that will serve yt-dl API ***and*** lets you cache requests/downloads.

(Primarily, this tool has been designed for use by Garry's Mod community; to make it possible to create fancy ingame music players via ingame scripting...)

## Installation: Full Walkthrough

### Prerequisites
Make sure you have **all** of the following:
1. [NodeJS](https://nodejs.org/en/download/) (v14.17.0 or higher)
2. [PowerShell](https://github.com/PowerShell/PowerShell/releases/latest) / [Win10Store](https://www.microsoft.com/en-us/p/powershell/9mz1snwt0n5d) (v7.1.3 or higher)
2. [Dropbox](https://www.dropbox.com/downloading)
3. [Dropbox account](https://www.dropbox.com/register) (it is free)

If you already had installed NodeJS previously, please make sure to check your installed version by running (in Command Prompt or Terminal):  
> `node --version`


### Setup
To get started, you would need to clone/download this repository to your computer. This should be straightforward, open up Command Prompt or Terminal, and then enter the following:  
    `git clone https://github.com/Cheatoid/yaytd-public`  
Or alternatively, [download the ZIP file](https://github.com/Cheatoid/yaytd-public/archive/refs/heads/dropbox.zip) and extract it on your computer.  
At this point you should have yaytd downloaded on your computer.  


#### Initialization / Cache Subsystem
This is one-time process (you would only need to do this only once):  
- Open Terminal/PowerShell and run `.\!yaytd.ps1 -dropbox "YOUR_DROPBOX_FOLDER"`, but replace `YOUR_DROPBOX_FOLDER` with folder path to your Dropbox folder.  
  For example, the default Dropbox location for Windows OS is inside your user profile folder (`%UserProfile%\Dropbox`).


### Startup
From this point onwards, launching yaytd is as simple as running `.\!yaytd.ps1` PowerShell script (double-click it).  
<details>
<summary>If this is your first time using NodeJS application, click here to see extra step.</summary>

You may receive Windows Firewall popup which looks like this:  
![Windows Firewall](https://user-images.githubusercontent.com/13347909/121682618-98229e00-cabc-11eb-95a7-2ac578da98aa.png)  
Just click `Allow access` button. (It may prompt for UAC, but you would just need to do this only once.)
</details>

If you done everything correctly, local HTTP server should be operating at this point.  
By default configuration, HTTP server will try to use the port number `60999`.  
To quickly test it, click this example GET link in your webbrowser:  
http://localhost:60999/fetch/?url=bM7SZ5SBzyY&download=1  
It will fetch *and* download [this YouTube audio](https://www.youtube.com/watch?v=bM7SZ5SBzyY) into your local cache folder, therefore subsequent HTTP request (for the same YouTube audio) will be much faster.


### Updating YTDL
Occasionally, youtube-dl will become outdated, simply run the `.\!yaytd.ps1 -update` to automatically update it to their latest released version.


### Direct Link
In order to play music ingame (via scripting), you must obtain a direct link to particular audio file, on Windows you can right click on the file in your Dropbox `yaytd-cache` folder and then choose `Copy Dropbox link`.  
Here are some URL examples of what you can expect to work (or not to work):  
❌ `https://www.dropbox.com/s/e9ld2pt8z4wq4va/bM7SZ5SBzyY.webm?dl=0`  
✔️ `https://www.dropbox.com/s/e9ld2pt8z4wq4va/bM7SZ5SBzyY.webm?dl=1`  
✔️ `https://dl.dropboxusercontent.com/s/e9ld2pt8z4wq4va/bM7SZ5SBzyY.webm`  

...

Happy tunes.
