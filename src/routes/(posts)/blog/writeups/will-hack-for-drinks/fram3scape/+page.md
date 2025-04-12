---
title: 'WHFD 2025 - fram3scape'
shortTitle: 'fram3scape'
date: 2025-04-11
length: 2 min
author: xladn0
headline: Read a solution to fram3scape in Will Hack For Drinks 2025
---

> Welcome to the begginer friendly python jailbreak challenge.
>
> Inspect the frame of this python web-app, collect all parts of the flag
> clearly marked `PART # n: {10 char string}` then submit then in the format:
> `itu{combined_flag}`.
>
> To see an abstract map of the program and the location of the flags go to
> `/map`.
>
> You can always follow [this](https://docs.python.org/3/library/inspect.html)
> cheatsheet.

---

### 1

```python
locals()
```

```python
sys._getframe().f_locals
```

```python
sys._getframe().f_locals['flag1']
```

### 2

```python
sys._getframe().f_back.f_locals['hidden_function'].__code__.co_consts[1]
```

### 3

`globals()` for recon

```python
globals()['secret_keeper'].__code__.co_consts[1]
```

### 4

Get fourth from module

```python
aaxsxsadx.__code__.co_consts[2]
```

`itu{b98vbif9ds0i09bvsdfbisd4sd0ck2o00921304v}`

- PART # 1: `b98vbif9ds`
- PART # 2: `0i09bvsdfb`
- PART # 3: `isd4sd0ck2`
- PART # 4: `o00921304v`
