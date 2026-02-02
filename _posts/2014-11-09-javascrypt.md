---
title: Javascrypt - 40
description: 
date: 2014-11-09 17:03:00 -0400
math: false
categories: [ write-up ]
tags: [ ctf, technology, web-exploitation, cybersecurity, computer-science ]
---
> This is an archived blog post I wrote while in high school.
>
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/javascrypt-40.html).
{: .prompt-important }

> Tyrin Robotics Lab uses a [special web site](https://picoctf.com/api/autogen/serve/index.html?static=false&pid=b1d725db54a1fb027ea6bbd78f9a7d0b) to encode their secret messages. Can you determine the value of the secret key?

This question is simple; basic knowledge of Javascript is required. Upon clicking the link, the site you are brought has an 'Input Message' and 'Output Message' box, along with an 'Encode' button. An example of the encryption done with the site is as follows:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigZJm9M_MKxZ42VGmUZaJi5zllxZdkQ9EICHcNfzUU_qN1oUWKx8pv6WDQyBLruEs2o09cE2jw19glk2LccWWpddm3hF2tARmAwbn0O8PTClLk_jjrqmZqKsUDczcO2ghzk6Wa0QTUn-g/s1600/Screen+Shot+2014-11-09+at+4.48.00+PM.png)

Once again, 'View Source' is necessary. Right-click and press 'View Page Source' to, well, view the page's source. Immediately, at the bottom, is the Javascript for generating the key used to encode the message.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2JoTwCl-R_VNQ_ylnU7ZiNCd1-KBkU13Xr_UUEflX0aAEoisz6gG46F5ohK6k2aIz8WoNFhI-_DtfFxLTRKoPF8URrjjSKNTE11sWmqG1fcrzKg5VM1nZrapGp9A20zjW7IJJ8dkW3QE/s1600/Screen+Shot+2014-11-09+at+4.49.22+PM.png)

It should look something this:
```java
       var key; // Global variable.
       // Since the key is generated when the page
       // is loaded, no one will be able to steal it
       // by looking at the source! This must be secure!
       function generateKey() {
         var i = 1;
         var x = 295;
         var n = 5493;
         while (i <= 25) {
           x = (x * i) % n;
           i++;
         }
         key = "flag_" + Math.abs(x);
       }
       generateKey();
       // Encode the message using the 'key'
       function encode() {
         var input = $("#inputmessage").val();
         var output = CryptoJS.AES.encrypt(input, key);
         $("#outputmessage").val(output);
       }
```
{: .nolineno }

It is now clear that the key is the flag, and they're Strings starting with "flag_" and ending with the absolute value of one of the vars, x.

To find the flag, I converted the code to Java (since I am most comfortable with Java):

```java
 public class Javascrypt {  
      public static void main(String[] args) {  
       int i = 1;  
       int x = 295;  
       int n = 5493;  
       while (i <= 25) {  
         x = (x * i) % n;  
         i++;  
       }  
       System.out.println("flag_" + Math.abs(x));  
      }  
 }  
```

I then ran it using Eclipse:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjr5nDEUhCTTr0f95RS7OYnHRUC0EQOANQlfqw5SupfXpnyb2g46GI30VBOcaIXaVs9rU_hZu8u5wKaCHDAu9gFZ5G8VbPhlrHU6aOAgqJBE5QroATGq-KR2_W1YfhtuvUKNm9RY2wldbA/s1600/Screen+Shot+2014-11-09+at+5.01.39+PM.png)

The flag is outputted as `flag_3003`