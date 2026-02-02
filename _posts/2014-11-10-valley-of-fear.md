---
title: The Valley of Fear - 20
description: 
date: 2014-11-10 20:51:00 -0400
math: false
categories: [ write-up, ctf ]
tags: [ ctf, technology, cryptography, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/the-valley-of-fear-20.html).
{: .prompt-important }

> The hard drive may be corrupted, but you were able to recover [`a small chunk of text`](). Scribbled on the back of the hard drive is a set of mysterious numbers. Can you discover the meaning behind these numbers? `(1, 9, 4) (4, 2, 8) (4, 8, 3) (7, 1, 5) (8, 10, 1)`

I'll admit, I was a bit confused at first too, but I realised that the numbers did have to do with the text.

Each set of numbers, written as `(x, y, z)` represented something in the text file.

`x` = The paragraph number
`y` = The sentence/line number
`z` = The word number (in the sentence)

And don't worry, you don't have to worry about OBOB-ing (a.k.a. starting with 0 rather than 1).

... Alright, so I know that explanation might not have made a lot of sense, but I'll elaborate by giving an example...

For the first set `(1, 9, 4)` I'm going to go open the text file. I located the first paragraph (`1`), which I've highlighted:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0TOz19AmR6re_QwPLbPycpKgA5qjoYm7C9vw3LqVwlAM-27jiF4Wko13pBltEJSxs7-5b4BIn3WsrYZW2hkK2uI5p271in6GjUrHtkwESSy6Nc85BBirlz2TozROInFJryG_xU9kfIx0/s1600/imageedit__4483272451.png)

Then I located the ninth sentence (`9`):

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgympVI2QDefliJr_10Qgk-R4L1ho3DqwVOoML8kcKzlTRLVvJgKlaA__DNmO5ekcIT7u9Lat3fEyKu5DUMcDueUgCFfI5-mi2w-0TcKgIikmjP8zftX6KdKPK3F1F7jAp2XQbLtfvQ9fs/s1600/imageedit__3440345622.png)

And, finally, the fourth word (`4`) of that particular sentence:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh804yFLGH9RwidEZ8rQQiWxeh_kJ1k_u1aPfDjANoolhPrYo_fBDooI2HC2a3Qv92_hfoN6E5JTKsxB8_i1GRClqRu0sxHj5-avCGmBe-2yox0cdJ1tmpTflsON0APM90nQJd80dgYT1A/s1600/imageedit__2464429732.png)

So the first word out of the five-word clue is '`the`'. It might not have seemed like it initially, but after the second word was discovered, it became apparent that it would lead to the flag.

When continuing on with this method, the following sentence was spelled out: `the flag is Ceremonial plates`

The flag is, therefore, `Ceremonial plates` 