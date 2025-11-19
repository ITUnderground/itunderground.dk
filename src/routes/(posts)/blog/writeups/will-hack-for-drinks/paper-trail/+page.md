---
title: 'WHFD 2025 AUT - paper-trail'
shortTitle: 'paper-trail'
date: 2025-11-19
length: 2 min
author: xladn0
headline: Read a solution to paper-trail in Will Hack For Drinks 2025
---

## Objective: <br>
Find and retrieve the admin's confidential document! Hint: Explore all endpoints and chain your findings.

Going through the website its easily noticable that if we input any of the users emails we just fetch their documents. Knowing this we just need to try and find the admins email which is unfortunately not `admin@...`

Looking at your personal page you notice the email is displayed and that the url has a parameter. Notice that the ID is actually a base64 encoded number.
```
(MQ==, Mg==, NQ==, Nw==, MTU=)
```

Then either manually or with a script find the admin page and navigate to `/profile?id={base64_encoded_admin_int}` get the email and paste it in the documents page to get the flag.