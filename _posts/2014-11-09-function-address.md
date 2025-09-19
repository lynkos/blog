---
title: Function Address - 60
description: 
date: 2014-11-09 19:34:00 -0400
math: false
categories: [ computer-science ]
tags: [ ctf, technology, reverse-engineering, cybersecurity ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/function-address-60.html).
{: .prompt-important }

> We found [`this program file`](https://picoctf.com/problem-static/reversing/function-address/problem) on some systems. But we need the address of the 'find_string' function to do anything useful! Can you find it for us?

Since the program file is a binary file, we'd need a disassembler to view its contents. There are various ways to disassemble a binary file, but I decided to use [Online Disassembler](http://www.onlinedisassembler.com/odaweb) since I can view the File Info, Hex Dump, and I can view the Disassembly along with Sections of the code.

To upload the program file (which should be downloaded on your computer by now), I clicked on 'File', then 'Upload File...'

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjCtBfWS1SWRhWkAsL4f1KCSuMzmQhKmrL8YVogVi-AGjgnhpHeP5ROz97wnyKNUWLR-_dVDY40nlrtPunOmauKozr4woic2T00iYvWyYiu8P36EmpPYw0j5e6u7uikK13ruHbFme75s8Q/s1600/Screen+Shot+2014-11-09+at+7.23.40+PM.png)

I named the project `Function Address` (since you have to give it a name, else it won't disassemble) after the problem itself, and then I uploaded the file before pressing 'Upload'

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyaDmaL95KXajFYeCptOr70PP_KzC2nqB4dqfLU5UmDpaFMEVsllHZOcSove7W5Efk_RGc8f9a2G0r5tzmR32jASIlj-Sw4AQVgtfc1M1GixEMiUuHFavPOzUe7YVNv1iRPp_Z0DZFV2o/s1600/Screen+Shot+2014-11-09+at+7.25.27+PM.png)

Platform Options were displayed, and after reading them I pressed 'Ok'

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiAdKlv8wr0l2sGScMDCGJM-dWFI2mfwREp6FzeF_TvehO64cf96STEZpk7xYCpuYOgFvjYG2PUmlC0zasHOZcvhOdLMIB26_37cdVRlOt-gaMGhhvOoCGBa5bOGB7FMTDueyPlrE-COM0/s1600/Screen+Shot+2014-11-09+at+7.27.05+PM.png)

After waiting a few seconds, for everything to load, everything was disassembled and, conveniently, there is a column to the left where each function is listed along with its Memory Address (which is what we're trying to find for `find_string`)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBocNxVezufP7xu0C19W5mrBCAddN7HgMByQucxwqIDB7FenZ3-utq4DugHX-YGIbdtneNm3mu-JRSAfTLzOSsQ1KeTeoHVd2-bkGtG2b0SHmFi_cVpNNicv6Q8yzoCMQOysvmXNEyeAI/s1600/Screen+Shot+2014-11-09+at+7.31.21+PM.png)

I highlighted the `find_string` function along with its Memory Address for visibility.

Its Memory Address (and the flag) is `0x08048444`