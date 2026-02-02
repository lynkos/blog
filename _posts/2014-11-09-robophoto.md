---
title: RoboPhoto - 30
description: 
date: 2014-11-09 16:11:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/robophoto-30.html).
{: .prompt-important }

Another question that requires no language in programming, the question is

> Your father has been known to use the titles of his favorite books as passwords. While you don't remember any of the names of the books, your father keeps a [_poster_](https://picoctf.com/problem-static/misc/robo-photo/robophoto.jpg) for one of them on his wall. Can you figure out the name of the book and unlock the CD?

Copy the image URL (`https://picoctf.com/problem-static/misc/robo-photo/robophoto.jpg`), and go to [Google Images](http://images.google.com). Click on the camera icon:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXFJn2UBfqMZ4ZAON8x0t0xODP9m5g2KR7c1qQBY6_UHhPacU1VWX9OXdjz_xd2PmWVEDmFJnrMpXQHmJf-RLeREE5cIut2c8gEpZFf6P6V17YqnpmxsUJjwrv2aHRBzq0SXUAmY65hQY/s1600/Screen+Shot+2014-11-09+at+4.04.19+PM.png)

Paste the URL into the box, then press 'Search by Image'.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgeDimc5fySUVSUChzM34pLk2riDPJUz2qCI-WgMOX2J1aC5i2ivxwrMXo43clhxUQFNrSXWI47lNtrVk3HRTZb71MyLZVPzI14jWvO00uZzXPjwEt6OXavxI-L0wsE5xNy8VTT3NudljQ/s1600/Screen+Shot+2014-11-09+at+4.05.32+PM.png)

Going through the page, there doesn't appear to be any book title names anywhere, so just click 'Visually similar images', since it looks as though the image is just a section of an entire book cover and there should be a match to that image somewhere.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyrglEvzafDLcS9KfIhBWS523HsT0A1XiVj1EL-dV8sHlyo_ZxkS494Be16an3PE91Kuv8O_RqJmgdUi_RP97hejSXQfLF1A_tK8351zLd3Ty5omn4xsbK_e08XkDK1DWNV865WmdgAZ4/s1600/Screen+Shot+2014-11-09+at+4.07.07+PM.png)

Clicking on the first image that shows up, the entire cover of the book is shown (along with the title and author).

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj7aMekY3_mjJ4nwqBcn_UxJqDgaxet5uh6MhUprVFzTVJJSI0HWxFGdhFQMnHH0KJt76vuEE5TZ7QbDMMwBYMgkopIDYl-MUMvWvcx9Vf3cM-wgJ7Kn-SUxyB5qbsC4yQyN-eiHVPsOk/s1600/Screen+Shot+2014-11-09+at+4.09.11+PM.png)

The flag, also known as the title of the book, is `The Positronic Man`.