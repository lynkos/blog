---
title: Potentially Hidden Password - 100
description: 
date: 2014-11-13 22:07:00 -0400
math: false
categories: [ computer-science ]
tags: [ ctf, technology, web-exploitation, cybersecurity ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/potentially-hidden-password-100.html).
{: .prompt-important }

> This [Daedalus Corp. website](http://web2014.picoctf.com/potentially-hidden-password-3878213) loads images in a rather odd way... [[Source Code]](https://picoctf.com/problem-static/web/potentially-hidden-password/index.phps)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhN2iCGq9v8h6aDK8hHyVGSI6a34gqRHszgRcaaqMV5g_qQSMFQYV_a084_vgk4fTLviJPnXSD728vtSXkHNh77PyJLYP1ByNB4FywCn_71zp2y1vFFR3pMliM7hPTSeUvV-qCi8Rv_Yzg/s1600/Screen+Shot+2014-11-13+at+9.37.44+PM.png)

It seems like a normal page, and there appears to be nothing special within its source code. I decided to view one of the images (individually) in general in hopes of finding something there.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFO55kbJl9EeZ8pr1SsZDeKvK_ysNGgOPZvhXo49lIP3gRMJaHAf8PrvVeBLrsu9j4y_TPOy4IJlbdy06XQaguEANYfkJ28QCZKcn2sadVxXhGG992TfA8cBdFNKUsKP7i-rXx5UYo87Y/s1600/Screen+Shot+2014-11-13+at+9.39.44+PM.png)

There's nothing special about the image itself, but the URL seemed to stick out to me the most.

`http://web2014.picoctf.com/potentially-hidden-password-3878213/file_loader.php?file=zone1.jpg`

Specifically that last part (`/file_loader.php?file=zone1.jpg`).

I decided to do a test to confirm my suspicions. I replaced '`zone1`' in the link with '`zone2`'. Sure enough, as soon as I hit '<kbd>Enter</kbd>', the second image popped up. Now I knew that this file loader was getting the images from a directory somewhere... perhaps where the flag is too?

I downloaded the Source Code given at the beginning of the problem and read through it.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIvqFiLPP0RDHIWZH7bNI2roy_dMpDkG_LoiK3tfwuGgU6ixFbHQiQKIqjJAtR5QMox4KCAlk4T1IIc1X9BtiQ6Q-G0LdRiiiUVl-HDIhufamYTkxBbPam3xTzPylw9RUSO4PdK1DJn74/s1600/Screen+Shot+2014-11-13+at+9.43.57+PM.png)

Seemed like simple HTML and CSS, along with a little PHP. The part that I focused on the most was the PHP code, since it contained the flag file.

Here is the PHP implemented in the source code:

```php
       <?php  
         $config_file = fopen("/resources/config/admin_mode.config", "r");  
         if (fgets($config_file) === "true") {  
          $flag_file = fopen("/resources/secrets/flag", "r");  
          echo fgets($flag_file);  
          flose($flag_file);  
         }  
         fclose($config_file);  
            ?>  
```

Based off what I could tell, the flag file was located within `/resources/secrets/flag`

So naturally, I pasted that text into the original link, so that it looked something akin to `http://web2014.picoctf.com/potentially-hidden-password-3878213/file_loader.php?file=resources/secrets/flag`

That only led me to this page, but that doesn't mean that my efforts were unfruitful.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6bU5HOylC00ZJ6i53IA8W4s4_dN_HLlT9LS2guUvR8ib0-kugBJAES5wjw-bV7eSwdzwgBccUVHMNCkG05J3OEjgKpxCkjhebq_4U_zFDarhB93E5czgifrR1kibCI4g-PFphI8KFc_A/s1600/Screen+Shot+2014-11-13+at+9.51.37+PM.png)
 
I've found the directory that the flag should be in! It should be located within `/resources/`. Since the file only looks within `/resources/files`, would there be a way to go up to `/resources/` and into other folders rather than only look within the `files` folder? Yep, there is.

To account for that, I should now add `../` (a directory traversal) before what I am about to type, since it, "tells the browser to move one level back toward the root directory before looking for the path to the file," ([RootsWeb]()). Basically, it means to go up a path/folder.

I have to add `../` since the flag is within `/resources/`, but it isn't within `/resources/files/`. It's within `/resources/secrets/flag`.

So now that we're within the `/resources/` folder, we'll have to enter the `/secrets/` folder and then from there get the flag from `/flag`. This part is relatively simple.

Adding `secrets/flag` after the `../` should do the trick since we'll be entering the `/resources/secrets/flag` folder (which is clearly where the flag file is located, according to the PHP).

The full link should look like: `http://web2014.picoctf.com/potentially-hidden-password-3878213/file_loader.php?file=../secrets/flag`

As expected, going to that link should get you to this page:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhxzM8ma_dMSe_0068SBRQCuQtf6gsvk1DLTD1STI2P92LiaW4cwkC8_-goAEWXHImYchhNHGMbwZQL7bJwvs3JW93CGnEveM6ugpTeI70ykrMFtE0MM_pTH9cwhz0Ow-uIfICKQSY3X5A/s1600/Screen+Shot+2014-11-13+at+10.05.07+PM.png)
 
The only sentence (and flag) in the page is: `i_like_being_included`

\* Unrelated note: <b><u>P</u></b>otentially <b><u>H</u></b>idden <b><u>P</u></b>assword... I bet that stands for PHP, doesn't it?