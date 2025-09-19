---
title: Internet Inspection - 20
description: 
date: 2014-11-09 14:08:00 -0400
math: false
categories: [ computer-science ]
tags: [ ctf, technology, web-exploitation, cybersecurity ]
---
> This is an archived blog post I wrote while in high school.
>
> It's specifically about a question from a Capture the Flag (CTF) cybersecurity competition I competed in at the time. I originally [posted it on Blogger](https://lynkos420.blogspot.com/2014/11/internet-inspection-30.html).
{: .prompt-important }

This is where the questions actually require a little bit of CSS and HTML knowledge. You should be able to read CSS and HTML and understand the syntax. The question asks

> On his computer, your father left open a browser with the Thyrin Lab Website. Can you find the hidden access code?

When one clicks on the link, a page with a checkered rectangle appears.

![Checkered Box](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl9N0xu1nfNFApXq92lCBAr88O2G1celDRQ1FVYwIrW5oeWgdZYA0CXlRbcOJzssX1nEJJt26VZgwxAO_NxSEWx7XxtAP8kH-IIab-9IqW1JDwQ_IE9O4vULW8io-bR2PR7aIhrkp2ZEM/s1600/Screen+Shot+2014-11-09+at+1.49.01+PM.png)

It seems as though the flag is behind the checkered box... how would one be able to remove the checkers on the image and edit the webpage? 'Inspect Element' is the answer!

Hover the mouse over the box, right-click, then select 'Inspect Element'. It should now look something like this, depending on your browser:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtRf4E4smnSy5b2CpQDz6F95OVFDadAvgwgTDHlhuDkFcKlBL-5BKCh2KQIqht6D__xqk1Pop5wZ_Zakb35ruuCrYjvfrw_gcfkmJ4SKe3zJifPBEcCLhkoalYQoIE4sLawfIRoNy3cv8/s1600/Screen+Shot+2014-11-09+at+1.51.31+PM.png)

When I'm looking through the code, I see a div id named "checkers". Perhaps that's what's blocking the table. I double click on it, and see that its style attribute contains a background image property, along with width, height, overflow, etc. properties as well.

That background image must be the checkers causing the table to be blocked, so I highlight `url("/problem-static/web/internet-inspection/checkers.png")` and replace it with none.

Immediately, the checkers disappear and the page now looks like this

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTzpf91mBoGgHL8rNuWbat6narhp99njhpRDBs8E2f9p2QouobrA6QmDE7fH1AgbXD0KPjoFKhIADOP1a0siwqMazgsWMSuldyIj8AVYo9-DdB568657u5bBjrgGj3V8K2hBWBMdINk1A/s1600/Screen+Shot+2014-11-09+at+1.57.47+PM.png)

The flag is `flag_307ba6279287ba746b5a3a964a712f9343a27eb6`

An alternate way to find the flag would be to 'Inspect Element', and browse through the divs to find where the flag lies, and copy it (<kbd>CTRL</kbd> + <kbd>C</kbd> or <kbd>⌘</kbd> + <kbd>C</kbd>). Its path would be:

`html → body → div.row → table#content-table.rounded → tbody → tr#contents → td`