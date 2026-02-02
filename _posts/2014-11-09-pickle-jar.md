---
title: Pickle Jar - 30
description: 
date: 2014-11-09 16:00:00 -0400
math: false
categories: [ write-up, ctf ]
tags: [ ctf, technology, digital-forensics, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/pickle-jar-30.html).
{: .prompt-important }

This question seems difficult, but it's actually quite simple. It asks:

> The police station offers free pickles to police officers. However, someone stole the pickles from the pickle jar! You find a [_clue_](https://picoctf.com/problem-static/forensics/pickle-jar/pickle.jar) on a USB drive left at the scene of the crime.

When you click on the 'clue', a .jar file is immediately downloaded onto your computer. In order to solve this question, you should first have a basic understanding of .jar files. A .jar (Java Archive) file is "a package file format typically used to aggregate many Java class files and associated metadata and resources (text, images, etc.) into one file to distribute application software or libraries on the Java platform," as stated by [Wikipedia](http://en.wikipedia.org/wiki/JAR_%28file_format%29). Basically, it's a .zip file containing compiled Java code and/or sourcecode, etc.

Since .jar files are compiled, you'd need to decompile it to view its contents. There are many ways of doing that, such as installing decompiler plugins for Eclipse (an IDE), installing decompiling software (e.g. JavaDecompiler), etc.

However, I chose to simply use an online decompiler, specifically one at [jd.benow.ca](http://jd.benow.ca) (which I found by going on Google and typing 'java decompiler').

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEielXUrDAmSVYSO3ycji_Tf7ss3uvbLei_XmI1ybQXjAoNxWx_fgbrx4Tv9C7ntl42LGuwhcVU5L2zHvpQknEX28Mn2Ku6T7c2O67msrThgbbdsCsrEpGJkBFUHUeNLhyphenhyphenRelEBjFn05e2w/s1600/Screen+Shot+2014-11-09+at+3.46.27+PM.png)

When you scroll all the way to the bottom of the page, there is a 'Live Demo' option. Simply drag and drop the .jar file into the striped area (under 'Input Files')

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3VcAoB04QVh9Mi7FfGO9MBgHR3KTBcBQbJ4p8EBlCZUj7HkFra0vLgNL4G1s6RfyOMIuzhTNLPG2emUsbIAF3MZnb3K0z91zw0-Tehl8qFbxT2a2KebVkIEeVlbV8uWuetAyZPBl0EVw/s1600/rsz_screen_shot_2014-11-09_at_34819_pm.png)

Let go of the .jar file, and wait for it do decompile (which shouldn't take that long). When it's done, look at the 'Output Java Code' section. Explore each of the packages (which should only include `META-INF` and `com.picoctf`).

Within `META-INF` is `MANIFEST.MF`, which only says this:

```
 Manifest-Version: 1.0
 Class-Path: .
 Main-Class: com.picoctf.Jar
```
{: .nolineno }

Within `Jar.class`, which only says this:
```
 package com.picoctf;
 import java.io.PrintStream;
 public class Jar {
   public static void main(String[] args) {
    System.out.println("Who stole the pickles from the pickle jar?");
   }
 }
```
{: .nolineno }

Of course, that isn't much of a flag. This is simply a basic Java program.

But that doesn't mean that there's nothing else in there. `pickle.p` still hasn't been opened. Upon clicking it to open, it says:

```
 S'YOUSTOLETHEPICKLES'
 p0
 .
```
{: .nolineno }

Even though it doesn't literally say 'flag' anywhere, it's become obvious what the flag is. Typing `YOUSTOLETHEPICKLES` into the submit box will get you the 30 points.
