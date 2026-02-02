---
title: Grep is Still Your Friend  - 40
description: 
date: 2014-11-09 16:41:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, digital-forensics, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/grep-is-still-your-friend-40.html).
{: .prompt-important }

> The police need help decrypting one of your father's files. Fortunately you know where he wrote down all his backup decryption keys as a backup (probably not the best security practice). You are looking for the key corresponding to `daedaluscorp.txt.enc`. The file is stored on the shell server at `/problems/grepfriend/keys`.

Basic knowledge of grep commands is required. Login to your shell on picoCTF, and when that's done, simply type in the following command:

```sh
 grep "daedaluscorp" /problems/grepfriend/keys  
```
{: .nolineno }

Press '<kbd>Enter</kbd>', and the shell should look something like this

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpGEmyacYjEoYQx7NSNJecdjTLIr92btbf0mi9tr_oMGlNu8JmM_GKlhr5Viqsn204J0iSh8lL3Xq3SkM4GVhxtWzrDj-Mvodndsewx8wOuVArJk0zcSb8FH2ec7VbD03Mg9ROXcZBq5g/s1600/imageedit_1_7585783250.png)

The highlighted text (`b2bee8664b754d0c85c4c0303134bca6`) is the flag.