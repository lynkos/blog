---
title: No Comment - 20
description: 
date: 2014-11-09 11:42:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, web-exploitation, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/no-comment-20.html).
{: .prompt-important }

This is yet another simple question that requires little to no knowledge in Programming... the question is:

> The CD you find has a copy of your father's website: homepage.html. Maybe something is hidden in the site...

When you open the webpage, you are greeted with this:

<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_2OKFddG7_Gcg_q2Y9aTBbjKgk7W_qzAWZsuqK1hMUDP8trpqJcv2nlBGjblsgVGPK8mCdGOSe-kvtC0W_9ZvxiUcUP2bvaQkGn3avTRgAhlWiJe7R0N4D3yLhVWT-QHruKKiKPybmrw/s1600/Screen+Shot+2014-11-09+at+11.37.02+AM.png" alt="">

It seems like a normal page, and there doesn't seem to be any flag hidden on the website that you can see, but one of the basic, first rules of CTFs are to always check the page source, since the HTML, CSS, Javascript, etc. codes are always there, and there might be other clues hidden around there, too.

To view the page source, simply Right-Click your mouse and select 'View Page Source' (or something akin to that depending on your Browser)

When I viewed the page source, everything seemed normal until...

<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhEHFoxwyxm775p6GvcJhsUOLw1vgfSeVDczVvHXhXk-hn2Zih5ZpOfcrI8CZGsx0Sf0C4aDvDthQdFDesoSxybbvk_tZQof2TxVhj1jIsVP7b1kJa3wmxVM42uqQ4qQp6dn34BQhDjrac/s1600/Screen+Shot+2014-11-09+at+11.40.25+AM.png" alt="">

That green text. It's not visible on the web page because it is an HTML comment. Anyway, the flag is blatantly given (`flag_3072fa4381f859636409532fdd70eaace3078420`). Just copy it, paste it into the answers box, and there's another 20 points!