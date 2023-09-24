---
categories: [Proving Grounds Play]
tags: [PrivEsc]
---

Lets check the IP address now →

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled.png)

```jsx
IP : 10.0.2.47
```

## Port Scan Results ⤵️

```jsx
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Fowsniff]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.47
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-04 21:51 IST
Nmap scan report for 10.0.2.47
Host is up (0.0013s latency).
Not shown: 65531 closed tcp ports (reset)
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 903566f4c6d295121be8cddeaa4e0323 (RSA)
|   256 539d236734cf0ad55a9a1174bdfdde71 (ECDSA)
|_  256 a28fdbae9e3dc9e6a9ca03b1d71b6683 (ED25519)
80/tcp  open  http    Apache httpd 2.4.18 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_/
|_http-title: Fowsniff Corp - Delivering Solutions
|_http-server-header: Apache/2.4.18 (Ubuntu)
110/tcp open  pop3    Dovecot pop3d
|_pop3-capabilities: SASL(PLAIN) PIPELINING AUTH-RESP-CODE UIDL TOP RESP-CODES USER CAPA
143/tcp open  imap    Dovecot imapd
|_imap-capabilities: Pre-login ENABLE LOGIN-REFERRALS listed have post-login capabilities more OK AUTH=PLAINA0001 ID SASL-IR LITERAL+ IDLE IMAP4rev1
MAC Address: 08:00:27:FE:40:C2 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%201.png)

From directory traversal I got different files / directories —>

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%202.png)

On front page I noticed this text ➡️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%203.png)

So lets check the official Twitter handle of @fowsniffcorp —>

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%204.png)

Lets check the paste bin file —> 

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%205.png)

Now lets follow through to the link for “password dump“ —>

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%206.png)

Lets decode the passwords for pop3 service ➡️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%207.png)

```jsx
mauer@fowsniff:8a28a94a588a95b80163709ab4313aa4		: mailcall
mustikka@fowsniff:ae1644dac5b77c0cf51e0d26ad6d7e56	: bilbo101
tegel@fowsniff:1dc352435fecca338acfd4be10984009		: apples01
baksteen@fowsniff:19f5af754c31f1e2651edde9250d69bb	: skyler22
seina@fowsniff:90dc16d47114aa13671c697fd506cf26		: scoobydoo2
stone@fowsniff:a92b8a29ef1183192e3d35187e0cfabd
mursten@fowsniff:0e9588cb62f4b6f27e33d449e2ba0b3b	: carp4ever
parede@fowsniff:4d6e42f56e127803285a0a7649b5ab11	: orlando12
sciana@fowsniff:f7fd98d380735e859f8b2ffbbede5a7e	: 07011972
```

Now lets create a users.txt and pass.txt file from above credentials ,

so that  I can brute force for pop3 service login credentials ➡️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%208.png)

Lets log into the pop3 mail service ⬇️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%209.png)

Lets retrieve  1 & 2 ➡️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2010.png)

password : S1ck3nBluff+secureshell

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2011.png)

Now lets brute force again for ssh service with that password and with users.txt (users) ➡️

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2012.png)

Now SSH login time, Local Privilege Escalation time ➡️ 

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2013.png)

Now I found many users so far and also a file named as `/opt/cube/cube.sh` —>

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2014.png)

Since this file have a permission to write so I inserted the nc reverse shell command into it.

And I have also noticed that this file is executed In the time of login so Lets login again and capture the response from it.

![Untitled](/Vulnhub-Files/img/Fowsniff-CTF/Untitled%2015.png)

WOW!! I got root not expecting this , but I am happy now ROOT !!

```jsx
# cat flag.txt
   ___                        _        _      _   _             _ 
  / __|___ _ _  __ _ _ _ __ _| |_ _  _| |__ _| |_(_)___ _ _  __| |
 | (__/ _ \ ' \/ _` | '_/ _` |  _| || | / _` |  _| / _ \ ' \(_-<_|
  \___\___/_||_\__, |_| \__,_|\__|\_,_|_\__,_|\__|_\___/_||_/__(_)
               |___/ 

 (_)
  |--------------
  |&&&&&&&&&&&&&&|
  |    R O O T   |
  |    F L A G   |
  |&&&&&&&&&&&&&&|
  |--------------
  |
  |
  |
  |
  |
  |
 ---

Nice work!

This CTF was built with love in every byte by @berzerk0 on Twitter.

Special thanks to psf, @nbulischeck and the whole Fofao Team.

#
```

I have also found these .txt files as hint I guess so , therefore I can access them now as I am ROOT now 😎 —>

```jsx
/home/seina/doubt.txt
/home/stone/early.txt
/home/stone/email_to_all.txt
/home/mustikka/attack.txt
/home/parede/friend.txt
/home/tegel/five.txt
/home/baksteen/term.txt
/home/mursten/percent.txt
/home/sciana/live.txt
/home/mauer/pajamas.txt
/root/flag.txt
```