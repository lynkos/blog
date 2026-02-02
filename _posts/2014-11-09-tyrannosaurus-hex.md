---
title: Tyrannosaurus Hex - 10
description: 
date: 2014-11-09 11:04:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/tyrannosaurus-hex-10.html).
{: .prompt-important }

I feel as though I shouldn't even be writing about this question, because if one is incapable of answering even this question, I think they should maybe, perhaps gain a _little_ more experience before competing in CTFs (sorry if that came out rude)...

> The contents of the flash drive appear to be password protected. On the back of the flash drive, you see the hexadecimal number 0x1c9b2c5a scribbled in ink. The password prompt, however, only accepts decimal numbers. What number should you enter?

You are given a hexadecimal number, `0x1c9b2c5a`, while it's asking for a decimal number. The only thing you have to do is convert the hexadecimal number into a decimal number.

To do that, go to any hexadecimal to decimal converter website (just type "hexadecimal to decimal converter" in Google and a bunch of websites will pop up):

<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBrg1tWbgtvcid1Z3wBu9Ck84yecq2nQYNH5CzWlxmsXpbFW10bXMmSH5_BIuoPyMWJg6w2nq9A5s_a78pusnN0LoYdI_D4nYRZsvshvD2e5Rz7zO3akZb4Jbcblbep8Kj05IB2y1MMA8/s1600/Screen+Shot+2014-11-09+at+11.43.12+AM.png" alt="Hexadecimal to Decimal Converter">

I am going to be using [binaryhexconverter](http://www.binaryhexconverter.com/hex-to-decimal-converter) for this. Enter the hexadecimal number without the '`0x`', so it looks like `1c9b2c5a`, then press 'Convert'.

<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDduRBWgp8NmEn5b-2ckzimzWPfDNn7LT2yQMKX_gXqUXPf8_qJDvc32hxROOBCXATdJ6iHgK9vHeVs1-sNMlHqgUpJt6S3XhVHWRxSZGzeupb2ZI2t_wJZw1aGAJ00Gg0AQlDEUY2Lcg/s1600/Screen+Shot+2014-11-09+at+11.45.29+AM.png" alt="Hexadecimal to Decimal Converter Result">

Copy the decimal number (`479931482`) and paste into the answer box and voila! 10 points for your team.