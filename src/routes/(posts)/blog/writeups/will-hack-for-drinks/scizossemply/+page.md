---
title: 'WHFD 2025 - scizossembly'
shortTitle: 'scizossembly'
date: 2025-04-11
length: 2 min
author: $gamer
headline: Read a solution to scizossembly in Will Hack For Drinks 2025
---

> The voices... I need them silenced. Use these runes to turn their screams into
> meaningless mumbles.
>
> flag format: `itu{$program_output}`

---

rewrite thingy in c

run program get output

paste in flag

```c
int main() {
    char str[] = "intheendiwastheonlyoneleftstandinginthefieldaloneandpowerlessbutasiassembledmylastwordsicarriedintothefiremylastpunchfilledwithsoul";
    
    for (int i = 3; str[i] != '\0'; i += 4) {
        putchar(str[i]);
    }

    putchar('\n');
    return 0;
}
```
