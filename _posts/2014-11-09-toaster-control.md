---
title: Toaster Control - 50
description: 
date: 2014-11-09 19:04:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, web-exploitation, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/toaster-control-50.html).
{: .prompt-important }

> Daedalus Corp. uses a [_web interface_](http://web2014.picoctf.com/toaster-control-1040194) to control some of their toaster bots. It looks like they removed the command '_Shutdown & Turn Off_' from the control panel. Maybe the functionality is still there... 

When opening the link and clicking on one of the buttons, I noticed how the page's URL looked like.

For example, clicking on 'Blink Lights', the URL would be `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=Blink Lights`

When clicking on 'Patrol Mode', the URL would be `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=Patrol Mode`

When clicking on 'Make Toast', the URL would be `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=Make Toast`

There is a pattern in that each of the URLs start with `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=`, and would end with the name of the button you were clicking.

So, since I wanted to activate the 'Shutdown & Turn Off' Command, you'd assume that the link would be `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=Shutdown & Turn Off`

But that would only bring me to this page:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNldCB0RB0PtfOzqZS0Omg0PgYUWwgo9EplhLvD1cMco6tdUxTthOA6EmNUA2HXFRXhwBLhgPqdz5IGXv7Dq3-Wl5Oz4IgdVGmn4eUYhyIgjPBsD_8_gFLVe5e87peQ0V7B5MRXMTnZyU/s1600/Screen+Shot+2014-11-09+at+6.53.26+PM.png)

But then how would I be able to go to the page? URL encoding, that's how. The problem actually lies in the ampersand ('&'), since it's not a URL-safe character. So by converting `Shutdown & Turn Off` to a URL-safe string, I'd be able to view the page.

I Google'd 'text to url' and found several text to URL converters. I used [QuickEncoder](http://quick-encoder.com/url), and pasted `Shutdown & Turn Off` into the box, then pressed 'Encode'

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgp9rGjX3FRdDHSvZqQIHLJ3g76b3Te-prVesPGkIofNkylTAxc-WnvqbCdXh-h0M_RKlqSqpW4sXWW-cYFvAsCWZudw9BNU-5y_EoM_Fq26KMtqB-LjT8lIOiopKvU9_ka3GZzdNxDICY/s1600/Screen+Shot+2014-11-09+at+7.00.27+PM.png)

I copied the URL-safe string (`Shutdown+%26+Turn+Off`) and pasted it into the base URL (`http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=`) so that it looked like `http://web2014.picoctf.com/toaster-control-1040194/handler.php?action=Shutdown+%26+Turn+Off`

I pressed '<kbd>Enter</kbd>' and the following page appeared:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiM8KoBL6jDDgfvkOyehz5MOqP0MxL_pXL4g8Ye2SrK_rxgChiLpGZU4ViyJj58374NdGNusoioIyQ1yNBma5MzYpRYyW9Z0FARt3ZF7aHJqZ9-RUrPQyhxfLE_SbtkaY8Fim5NAGztP9U/s1600/Screen+Shot+2014-11-09+at+7.02.55+PM.png)

The shutdown code, and flag, is blatantly displayed as `flag_c49bdkeekr5zqgvc20vc`