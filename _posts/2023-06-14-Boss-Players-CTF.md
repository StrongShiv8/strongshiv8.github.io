---
categories: [proving-ground-play]
tags: [proving-ground,walkthrough,pentest]
---

Let’s find the IP Address first >>

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled.png)

```
IP : 10.0.2.38
```

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/bossplayerCTF]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.38 
Starting Nmap 7.93 ( https://nmap.org ) at 2023-04-27 21:06 IST
Nmap scan report for 10.0.2.38
Host is up (0.0017s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10 (protocol 2.0)
| ssh-hostkey: 
|   2048 ac0d1e7140ef6e6591958d1c13138e3e (RSA)
|   256 249e2718dfa4783b0d118a9272bd058d (ECDSA)
|_  256 26328d73890529438ea113ba4f8353f8 (ED25519)
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.38 (Debian)
MAC Address: 08:00:27:E0:9B:01 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⬇️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%201.png)

Source Code ⬇️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%202.png)

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%203.png)

lets load that file ➡️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%204.png)

Now lets try Command Injection ⤵️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%205.png)

Now lets try reverse shell command of python ➡️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%206.png)

Now lets check the SUIDs and GUIDs files for execution ⤵️

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%207.png)

```bash
# cat root.txt
cat root.txt
Y29uZ3JhdHVsYXRpb25zCg==
#
```

![Untitled](/Vulnhub-Files/img/Boss-Players-CTF/Untitled%208.png)