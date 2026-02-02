---
title: This is the Endian - 40
description: 
date: 2014-11-10 21:22:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, binary-exploitation, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/this-is-endian-40.html).
{: .prompt-important }

> This is the end! Solving this challenge will help you defeat Daedalus's cyborg. You can find more information about endianness and the problem [`here`](https://picoctf.com/problem-static/binary/this-is-the-endian/endian.html). The flag is the smallest possible program input that causes the program to print "`Access Granted`".

When I opened the page, I read over the problem and information. The input was supposed to be entered as a little-endian, meaning that the order of the addresses are reversed (e.g. "`12345678`" becomes "`78563412`").

The question wants `answer[0]` to be equal to `0x52657663` and `answer[1]` to be equal to `0x30646521`. Both have to be equal to those values respectively, else it won't work.

The first thing to be noted is that the '`0x`' in front of the address should be removed when writing it in the input, so it should be `52657663` and `30646521` instead.

Now, back onto the topic of little-endians and reversed order, when you put in the correct input, the Data Preview box should look like this:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUpBG1KXanui4zWQ_mKimV0fc5dmjo3IVIa7-WnhMVSlIfowpBgjf-DPP2JsdIuVxiyOdWwoWlFx5thfeejlDd1VBptsPkGKEVorSgVHdURhHfP3u0kuZ_FmZZ2So_Jw2jG9C68xpSw0A/s1600/Screen+Shot+2014-11-10+at+9.06.09+PM.png)

The thing is that if you try input the exact hex values for both answers, it won't even fit. That's because you're not supposed to input the hex value, you're supposed to input an ASCII character.

Let me try to simplify this... I'll start with `answer[0]`'s value... it's supposed to equal `52657663`. I'm going to split the numbers in that value into groups of twos, so it'll now look like this: `52 65 76 63`

Because it's a little-endian program, you'd have to enter the ASCII equivalent of `63 76 65 52`. Fortunately, rather than Google 'hex to ascii' for a converter, you can simply write `\x` followed by the two-digit number, and it'll convert it to ASCII for you.

So `\x63` would yield `c`, `\x76` would yield `v`, and so on.

So `answer[0]`'s input value would be `cveR`

...But I still needed to input `answer[1]` as well.

Using the same method, I divided `30646521` into parts: `30 64 65 21`. Then I reversed those parts: `21 65 64 30`.

I entered `\x21 \x65 \x64 \x30`, which displayed `!ed0`

So, in sum, I basically just inputted `\x63 \x76 \x65 \x52 \x21 \x65 \x64 \x30` and it was written as `cveR!ed0`

When I pressed 'Input' and ran the program, it displayed 'Input Granted!', meaning that the input was correct. Because it was correct, `cveR!ed0` is the flag.

Edit: This problem inspired me to write a Java program that converts hexadecimal/byte to Little-Endian and Big-Endian. You can see it on [my GitHub here](https://github.com/lynkos/Endians/blob/master/src/EndianConvert.java), if you'd like, especially if you're having trouble inputting the address as a Little-Endian, or perhaps for future reference.