---
categories: [VulnHub]
tags: [PrivEsc]
---
# GoldenEye



## **Description ⤵️**


💡 [GoldenEye](https://vulnhub.com/entry/goldeneye-1,240/) ⤵️

I recently got done creating an OSCP type vulnerable machine that's themed after the great James Bond film (and even better n64 game) GoldenEye. The goal is to get root and capture the secret GoldenEye codes - flag.txt.

I'd rate it as Intermediate, it has a good variety of techniques needed to get root - no exploit development/buffer overflows. After completing the OSCP I think this would be a great one to practice on, plus there's a hint of CTF flavor.

I've created and validated on VMware and VirtualBox. You won't need any extra tools other than what's on Kali by default. Will need to be setup as Host-Only, and on VMware you may need to click "retry" if prompted, upon initially starting it up because of formatting.

## Changelog Beta - 2018-05-02 v1 - 2018-05-04



Let’s find the IP Address first >>

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled.png)

```bash
IP : 10.0.2.20
```

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%201.png)

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%202.png)

```bash
OPEN PORTS >
25     smtp
80     http
55006  pop3
55007  POP3
```

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%203.png)

Lets check the source code →

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%204.png)

After Cracking it I got password for boris →

```bash
boris : InvincibleHack3r
```

After login I got this →

On checking Source code I got this →

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%205.png)

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%206.png)

I have tried pop3 with these credentials but no luck so lets brute fore the password for pop3 login with these users →

`hydra -l boris -P **/**usr**/**share**/**wordlists**/**fasttrack.txt -f 10.0.2.20 -s 55007 pop3`

![Untitled](/Vulnhub-Files/img/GoldenEye/Untitled%207.png)

```bash
boris : secret1!
```

Lets check the pop3 service now and see what we can →

![79-6.png](/Vulnhub-Files/img/GoldenEye/79-6.png)

![79-7.png](/Vulnhub-Files/img/GoldenEye/79-7.png)

![79-8.png](/Vulnhub-Files/img/GoldenEye/79-8.png)

![79-8.png](/Vulnhub-Files/img/GoldenEye/79-8%201.png)

![79-9.png](/Vulnhub-Files/img/GoldenEye/79-9.png)

Now lets check the password for natalya user →

![79-10.png](/Vulnhub-Files/img/GoldenEye/79-10.png)

```bash
natalya : bird
```

Lets try it out →

![79-11.png](/Vulnhub-Files/img/GoldenEye/79-11.png)

![79-12.png](/Vulnhub-Files/img/GoldenEye/79-12.png)

```bash
username: xenia
password: RCP90rulez!
```

→ **severnaya-station.com in `/etc/hosts`.**

![79-13.png](/Vulnhub-Files/img/GoldenEye/79-13.png)

![79-14.png](/Vulnhub-Files/img/GoldenEye/79-14.png)

![79-15.png](/Vulnhub-Files/img/GoldenEye/79-15.png)

Lets see the password for this user like that →

![79-16.png](/Vulnhub-Files/img/GoldenEye/79-16.png)

```bash
doak : goat
```

![79-17.png](/Vulnhub-Files/img/GoldenEye/79-17.png)

```bash
username: dr_doak
password: 4England!
```

After login I got this file →

![79-18.png](/Vulnhub-Files/img/GoldenEye/79-18.png)

![79-19.png](/Vulnhub-Files/img/GoldenEye/79-19.png)

![79-20.png](/Vulnhub-Files/img/GoldenEye/79-20.png)

![79-21.png](/Vulnhub-Files/img/GoldenEye/79-21.png)

```bash
admin : xWinter1995x!
```

![79-22.png](/Vulnhub-Files/img/GoldenEye/79-22.png)

![79-23.png](/Vulnhub-Files/img/GoldenEye/79-23.png)

Now included the python reverse shell →

![79-25.png](/Vulnhub-Files/img/GoldenEye/79-25.png)

Now I get the reverse shell →

As my shell called by the spell checker funciton →

![80-1.png](/Vulnhub-Files/img/GoldenEye/80-1.png)

![80-2.png](/Vulnhub-Files/img/GoldenEye/80-2.png)

Here the OS is very outdated so lets find an exploit for it →

![80-3.png](/Vulnhub-Files/img/GoldenEye/80-3.png)

Since gcc is not present in the victim machine so I replaced it with cc which used to run in the time of UNIX systems.

Now After transfering the exploit to victim machine lets exploit it →

![80-4.png](/Vulnhub-Files/img/GoldenEye/80-4.png)

![80-5.png](/Vulnhub-Files/img/GoldenEye/80-5.png)

![80-6.png](/Vulnhub-Files/img/GoldenEye/80-6.png)

```bash
flag.txt → 568628e0d993b1973adc718237da6e93
```

![80-7.png](/Vulnhub-Files/img/GoldenEye/80-7.png)

---