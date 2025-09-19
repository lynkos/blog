---
title: 49 Shades of Grey - 125
description: 
date: 2015-12-02 22:13:00 -0400
math: false
categories: [ computer-science ]
tags: [ ctf, technology, digital-forensics, cybersecurity ]
---
> This is an archived blog post I wrote while in high school.
> 
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2015/12/49-shades-of-grey-125.html).
{: .prompt-important }

> We only have 49 shades of gray D:
>
> #000000 to #f5f5f5... there's one shade missing! Find the hex value of the missing shade. Pound sign optional.
>
> [Image](https://imgur.com/moVmzyy)

This is one of my personal favorites from the CTF, and I'm not entirely sure why. Regardless, all it takes is a little coding, pattern-finding, and logic.

The way I approached the problem was to first println every single pixel (in hexadecimal) in the image. After receiving a massive amount of text (I'll spare you the behemoth), I quickly scanned through all the values and noticed that quite a few of them repeated.

I decided that I'd remove any duplicates from the list, thus considerably narrowing down the previous amount of hexadecimals. Here's the list:

|         |         |         |         |         |         |         |
| ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| #dcdcdc | #cdcdcd | #bebebe | #919191 | #4b4b4b | #d2d2d2 | #c3c3c3 |
| #414141 | #191919 | #f5f5f5 | #141414 | #828282 | #646464 | #a5a5a5 |
| #0a0a0a | #6e6e6e | #969696 | #5a5a5a | #696969 | #737373 | #464646 |
| #373737 | #a0a0a0 | #f0f0f0 | #c8c8c8 | #d7d7d7 | #3c3c3c | #ebebeb |
| #7d7d7d | #282828 | #787878 | #aaaaaa | #000000 | #1e1e1e | #8c8c8c |
| #323232 | #232323 | #e6e6e6 | #e1e1e1 | #b9b9b9 | #9b9b9b | #b4b4b4 |
| #5f5f5f | #878787 | #afafaf | #050505 | #2d2d2d | #555555 | #0f0f0f |

Interestingly, the amount of pixels above is equal to 49, just like in the problem title. Also, all those pixels are shades of grey, amounting to 49 shades of grey, implying that we're getting closer to the flag (as 50th shade of grey, aka the missing shade, is the flag).

One of the first things I noticed was the pattern/correlation between each hexadecimal value. It was as though every value had its reverse in its list (with the exception of hexadecimal values made up of one letter/number).

e.g. #414141 and #141414 were on the list, #0a0a0a and #a0a0a0, #696969 and #969696, etc.

I decided to remove any values whose reverse was on that list, along with any values whose hexadecimal value was made up of one letter or number (e.g. #000000, #aaaaaa, etc.).

After doing so, I was left with #050505 and #afafaf

At that point, it was clear to me that their reverse was the missing shade (and so the flag), but only one of the reverse values worked, rather than both.

It seemed strange that I was given two answers, but then I remember back to the question: the color range was from #000000 to #f5f5f5.

The reverse of #afafaf is #fafafa, which is not in the range between #000000 and #f5f5f5, eliminating that as the choice, hence leaving the only choice (and correct answer) to be #505050.

For reference, the code I used to solve the problem is below; it's written in Java.

```java
 import java.io.*;  
 import java.util.*;  
 import javax.imageio.ImageIO;  
 import java.awt.image.BufferedImage;  
   
 public class GetPixelColor {  
      /**@param hex  
       * @return boolean (true or false)  
       *   
       * This method is used to remove any hexadecimals composed of the same letter  
       * e.g. #000000, #aaaaaa, #cccccc, etc. */  
      public static boolean sameLetter(String hex) {  
           String nuHex = hex.replace("#", "");  
           char[] lets = nuHex.toCharArray();  
           if(lets.length == 6) {  
                if((lets[0] == lets[1]) && (lets[1] == lets[2]) && (lets[2] == lets[3]) && (lets[3] == lets[4]) && (lets[4] == lets[5])) {  
                     return true;  
                }  
           }  
           return false;  
      }  
        
      /**@param hex  
       * @return The reversed version of hex  
       *   
       * This method is necessary to determine which hexadecimal values to remove, thus ultimately  
       * narrowing down the answers, as it returns the reversed vesion of the parameter  
       *   
       * e.g. "#ababab" yields "#bababa" */  
      public static String reverseHex(String hex) {  
           String nuHex = hex.replace("#", "");  
           String kek = new StringBuilder(nuHex).reverse().toString();  
           return "#" + kek;  
      }  
        
      public static void main(String args[]) throws IOException {  
           /** Get all the individual pixels in the image and put it into an array */  
           File file = new File(shades.png);  
           BufferedImage image = ImageIO.read(file);  
           int a = 0;  
           String[] allHex = new String[image.getWidth() * image.getHeight()];  
           for(int x = 0; x < image.getWidth(); x++) {  
                for(int y = 0; y < image.getHeight(); y++) {  
                     int clr = image.getRGB(x, y);  
                     int red = (clr & 0x00ff0000) >> 16;  
                     int green = (clr & 0x0000ff00) >> 8;  
                     int blue = (clr & 0x000000ff);  
                     String hex = String.format("#%02x%02x%02x", red, green, blue); // RBG -> Hexadecimal  
                     allHex[a] = hex;  
                     a++;  
                }  
           }  
             
           /** Converted from Set to ArrayList so that I could get rid of any duplicate values */  
           Set<String> mySet = new HashSet<String>(Arrays.asList(allHex));  
           ArrayList<String> hexa = new ArrayList<String>();  
             
           for(String hex : mySet) {  
                hexa.add(hex);  
           }  
                                 
           /** We compare every String in the ArrayList with the reverse of the rest of the Strings.  
            * If the reverse of the String being compared is equal to other String, we replace its  
            * position with a blank character; if we were to merely remove the Strings, it'd  
            * jeopordize the entire loop */  
           for(int j = 0; j < hexa.size(); j++) {  
                for(int k = j + 1; k < hexa.size(); k++) {  
                     if(hexa.get(j).equals(reverseHex(hexa.get(k)))) {  
                          hexa.set(j, "");  
                          hexa.set(k, "");  
                     }  
                }  
           }  
             
           /** Narrowing it down even more, now we're just removing any of the hexadecimals  
            * that are made up of the same letter.  
            *   
            * e.g. #000000, etc.  
            *   
            * The reason why we want to remove those hexs is because they don't fit the general  
            * reverse pattern we've noticed. The reverse of #000000 = #000000, thus eliminating  
            * that as an answer, hence the need to get rid of them */  
           for(int m = 0; m < hexa.size(); m++) {  
                if(sameLetter(hexa.get(m)) == true) {  
                     hexa.set(m, "");  
                }  
           }  
                       
           /** Removes all the (many) blank items from the ArrayList */  
           while(hexa.contains("")) {  
                hexa.remove("");  
           }  
             
           /** The rest is just extra code intended to be for your convenience */  
           String[] rev = new String[hexa.size()];  
           int z = 0;  
             
           for(String sup : hexa) {  
                rev[z] = reverseHex(sup);  
                z++;  
           }  
             
           System.out.println("Original Remaining Hexadecimal(s): " + hexa);  
           System.out.println("Reversed Remaining Hexadecimal(s): " + Arrays.toString(rev));  
      }  
 }
```
{: .nolineno}

Flag: `#505050`