---
categories: [Proving Grounds Play]
tags: [PrivEsc]
---

## **Description [⤵️](https://www.vulnhub.com/entry/funbox-easyenum,565/)**

>
💡 Boot2root in 6 steps for script-kiddies.

Timeframe to root this box: 20 mins to never ever. It's on you.

# **HINTS:**

Enum without sense, costs you too many time:

1. Use "Daisys best friend" for information gathering.
2. Visit "Karla at home".
3. John and Hydra loves only rockyou.txt
4. Enum/reduce the users to brute force with or brute force the rest of your life.

This works better with VirtualBox rather than VMware

{: .prompt-info }

Let’s find the IP Address first >>

![165-1.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-1.png)

```bash
IP : 10.0.2.18
```

## Port Scan Results ➡️

![165-2.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-2.png)

```bash
OPEN PORTS >
22  SSH
80  HTTP
```

---

## Web Enumeration ⤵️

![165-3.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-3.png)

![165-4.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-4.png)

![165-5.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-5.png)

Lets look into directory traversal files / folders →

![165-6.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-6.png)

![165-7.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-7.png)

I uploaded the php_reverse_shell code →

![165-8.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-8.png)

---

## SHELL ➡️

Now lets check `/etc/passwd` →

![165-9.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-9.png)

Now I have to crack the password → so lets use hashcat →

```bash
command → 
hashcat -m 500 pass.hash /usr/share/wordlists/rockyou.txt
```

![165-10.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-10.png)

```bash
oracle : hiphop
```

Lets recon more on web →

![165-11.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-11.png)

Lets check →

![165-12.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-12.png)

```bash
phpmyadmin : tgbzhnujm!
```

![165-13.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-13.png)

Now I tried this password for karla →

![165-14.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-14.png)

And I got in →

![165-15.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-15.png)

It time for root !!

![165-16.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-16.png)

![165-17.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-17.png)

I got one more user credentials →

![165-18.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-18.png)

---

## **Another Way to root →**

Now lets brute force the password for user **goat** which contains the **shadow.bak** file →

I got result after 15-20 min →

![165-19.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-19.png)

```bash
goat : thebest
```

![165-20.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-20.png)

![165-21.png](/Vulnhub-Files/img/Funbox-Easy-Enum/165-21.png)

---