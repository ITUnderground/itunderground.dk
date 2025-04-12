---
title: 'WHFD 2025 - hexed ice-crea'
shortTitle: 'hexed ice-crea'
date: 2025-04-11
length: 1 min
author: tw0
headline: Read a solution to hexed ice-cream in Will Hack For Drinks 2025
---

>Suggested difficulty: normal
>
>Left earphone: Bad Apple.
>
>Right earphone: view file in notepad

---


Opening the file and running meta data will probably tell you this file is a binary. Its not.

If we open it in a notepad-like app we will see the file as follows:
```
�堌䍉彃剐䙏䱉Eā 䠌楌潮ဂ 湭牴䝒⁂奘⁚츇Ȁऀ؀㄀ 捡灳卍呆... you get the point.
```

Seeing these chars in a file ussualy means theres a encoding mismatch.
So lets run this in a hex editor and see wassup (beijing).
```
FF FE FF D8 FF E2 0C 58 49 43 43 5F 50 52 4F 46 49 4C 45 00 01 01 00 00 0C 48 4C 69 6E 6F 02 10 00 00 6D 6E 74 72 52 47 42 20 58 59 5A 20 07 CE 00 02 00 09 00 06 00 31 00 00 61 63 73 70 4D 53 46 54 00 00 00 00 49 45 43 20 73 52 47 42 00 00
```
```
ÿþÿØÿâXICC_PROFILE���HLino��mntrRGB XYZ Î��	��1��acspMSFT����IEC sRGB��
```

And wow this actually looks familiar now. Its just a JPEG. If we were to load another one to see the difference in the header we would see the `FF FE` just "corrupted" it. 

If we delete it and save as `.jpg` we load the picture and see the flag.