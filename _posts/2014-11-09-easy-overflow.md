---
title: Easy Overflow - 40
description: 
date: 2014-11-09 18:25:00 -0400
math: true
categories: [ computer-science ]
tags: [ ctf, technology, binary-exploitation, cybersecurity ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/easy-overflow-40.html).
{: .prompt-important }

> Is the sum of two positive integers always positive?<br>
> `nc vuln2014.picoctf.com 50000`<br>
> 'nc' is the Linux netcat command. Try running it in the [shell](https://picoctf.com/shell).

The rhetorical question in the beginning is actually a good hint by implying that, sometimes in Java, adding a number to another number will make it negative. Basic arithmetic and understanding of ints in Java are helpful in solving this problem.

Rather than running it in the shell, I decided to run it in the 'Terminal' (Mac). By opening 'Terminal' and typing in `nc vuln2014.picoctf.com 50000`, I was able to run the program. It looked  like this:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigXCz0uDCONeASb6UBB-VcNhGL6e3tYQ8KvA5-LDwIpY3raTz8r-23njrHeu5Iw35AQI0m7eX09sDa6xxoGEntRE2QgUhaO1obmTlvimLNHFKXcaVWQ7TevkArLDQO2ZtZ5vXImgIoXeE/s1600/imageedit_2_7943420406.png)

The number I was given was `2884043` (note that a different number is generated each time), and it is asking for a positive number that, when added, will make it negative.

I needed to know what the maximum Integer value was for Java, because if a number is added to it, it immediately becomes negative. I typed '`max int java`' in Google:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4umNt8gTrUvVeRjI5IfPYs7Xx5kZLQnmeSr9j_ps1ImjO8DRAoEDjMVme-2ZJYPY7aQFLw4eRhHT6jhr6rEViu3wBu0LKkuMnMSptgF1Wek6SnweHWPcsfA3oX_bgUnbcvilQNguFlXE/s1600/Screen+Shot+2014-11-09+at+5.16.49+PM.png)

I discovered that the maximum Integer value in Java is $2^{31} - 1$, or $2147483647$ when expanded.

One would assume that we'd subtract the given number from the maximum Integer value, but that is not the case because we'd yield a non-negative int. So instead, we'd have to subtract the given number from maximum Integer value plus one, a.k.a. $2^{31} - 1$, or $2147483648$ when expanded.

So, $2147483648 - 2884043$ gave me $2144599605$, which I entered into the Terminal.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR4ay2BDFo2OIybkDJgH8X4k6hyphenhyphencYBy6Z4H2DiHrUQHbA3eVNiZ4FCnUwr_RgRa2QIaOM-rIxLmUAsOXoAU3O_cS8uAcpp25mgj7Q_8uvSnQySEfWExnpioG2yykHCFS1_V-6ELLAasxM/s1600/imageedit_3_9950646236.png)

The flag, which I highlighted, is `That_was_easssy`!