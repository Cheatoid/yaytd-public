# yaytd-public
Welcome to the public version of mine currently private project called *yaytd* (Yet Another YouTube Downloader).  
I decided to implement this one using NodeJS & Batch for my own simplicity.

## Enough crap. What is this?
yaytd allows you to run localhost HTTP server that will serve yt-dl API ***and*** lets you cache downloads via git/repository subsystem.

(Primarily, this tool has been designed for use by Garry's Mod community; to make it possible to create fancy ingame music players via ingame scripting...)

## Installation: Full Walkthrough

### Prerequisites
Make sure you have **all** of the following (items marked with `*` are optional):
1. Windows OS (Linux is unsupported until our Batch scripts are ported to PowerShell/Bash)
2. [NodeJS](https://nodejs.org/en/download/) (v14.17.0 or higher)
3. [git](https://git-scm.com/download/win) (v2.32.0 or higher)
4. ~~GitHub CLI~~ (v1.11.0 or higher) `*`
5. [GitHub account](https://github.com/join) (it is free)

To enjoy the full power of yaytd, I would suggest to get optional stuff as well.

If you had already installed some of the software listed above, please make sure to check your installed version by running (in Command Prompt or Terminal):  
- For Node: `node --version`  
- For git: `git --version`  
- For GitHub CLI: `gh --version`  


### Setup
To get started, you would need to clone/download this repository to your computer. This should be straightforward, open up Command Prompt or Terminal, and then enter the following:  
    `git clone https://github.com/Cheatoid/yaytd-public`  
**Warning**: Using "ZIP download" approach WILL NOT work; you have to use git clone approach instead.   
At this point you should have yaytd downloaded on your computer.  

#### Initialization / Cache Subsystem
This is one-time process (you would only need to do this only once):  
1. Run the `!AUTH` batch script (double-click it). GitHub CLI will guide you through GitHub authentication, just follow the instructions on the screen.
2. After you have completed GitHub authentication, you would run the `!INIT` batch script to initialize and create your own cache repository, simply double-click it. (Disregard GraphQL error messages, if you get any.)

### Startup
From this point onwards, launching yaytd is as simple as running `!START` batch script (double-click it).  
If you done everything correctly, local HTTP server should be operating at this point.  
By default configuration, HTTP server will try to use the port number `60999`.  
To quickly test it, click this example GET link in your webbrowser:  
http://localhost:60999/fetch/?url=bM7SZ5SBzyY&download=1  
It will fetch *and* download [this YouTube audio](https://www.youtube.com/watch?v=bM7SZ5SBzyY) into your local cache folder, therefore subsequent HTTP request (for the same YouTube audio) will be much faster.

If you wish to upload/sync your cache, simply run the `!PUSH` batch script (double-click it). (The predicted URL will be printed into console. But, this step is required in order to actually obtain githubusercontent link, which you can then use to play it ingame via E2/SF/etc scripting.)

### Bonus Stuff
Occasionally, youtube-dl will become outdated, simply run the `!UPDATE-YTDL` batch script to automatically update it to their latest released version.

If something goes wrong with your local cache, simply run the `!RESET` batch script (double-click it).

...

Happy tunes.
