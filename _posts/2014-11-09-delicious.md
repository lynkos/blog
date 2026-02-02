---
title: Delicious! - 60
description: 
date: 2014-11-09 21:41:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, web-exploitation, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/delicious-60.html).
{: .prompt-important }

> You have found the administrative control panel for the Daedalus Coperation Website: [`https://web2014.picoctf.com/delicious-5850932/login.php`](https://web2014.picoctf.com/delicious-5850932/login.php). Unfortunately, it requires that you be logged in. Can you find a way to convince the web site that you are, in fact, logged in? 

This problem requires a cookie editor extension, and the best browser to solve this problem with would be Chrome, since it has good cookie editing extensions. I installed two cookie editing extensions for Chrome: (1) [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en) and (2) [Cookie Inspector](https://chrome.google.com/webstore/detail/cookie-inspector/jgbbilmfbammlbbhmmgaagdkbkepnijn?hl=en).

You don't have to install both extensions, or even those extensions in specific, but I still did because of reasons.

After installing the extensions, open the administrative control panel link. It says that I'm not logged in because there are too many people that are logged in.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj0goGIklax2szKs3aPmahL9jHhLAZGmEJe-ED1ocn5fFB0g2MAbZ38LlG6SiVG6p2_qV1o2ZfZH5x2ycAXrJx9wwJx0n6k5s-HSoix1kzs1OC2QtDMQs1vvIrFEER6znHofygZFMa7k6M/s1600/Screen+Shot+2014-11-09+at+9.35.06+PM.png)

Now's the part where the cookie editors come in. Right-click and press 'Inspect Element'. Click on the 'EditThisCookie' pane. There should be 9 columns, and under the 'Value' column it should have the number 67.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9h8pyQ4dO4Do5wwVZWVTj2FjG6lOUyK1ewl33mmpbq3gKT_NjtxH4yMzliRwPALQmnUI1UepzvJIf2DMZRHOoMU5VIcSSN9YPcGm2U1foEsFniBFV4xeMgP7TEAs38wDxfCBT7kCpkF4/s1600/Screen+Shot+2014-11-09+at+9.37.49+PM.png)

Click on it and enter any number. When you're finished, refresh the page and keep entering different numbers until you reach this page:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhurmncJZXcr9zh3wgqoar6vDrV-JxgH9A6sEHCog93nSu2366eYaRsJNRMtkVfWuTjdDE0Zpv07NW6BIKfA37xx82GKQ32nTQGttvPq0jNAwscAKUKsLXJRJdrFG6TYnelvuCTRrEsUOM/s1600/Screen+Shot+2014-11-09+at+9.39.56+PM.png)

The number I put in was '21'. The flag is `session_cookies_are_the_most_delicious`