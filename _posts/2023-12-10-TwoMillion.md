---
title: TwoMillion
categories: [HackTheBox]
tags: [Command Injection, Public Exploit, Obfuscation, PrivEsc]
media_subpath: /Vulnhub-Files/img/
image:
  path: TwoMillion/Untitled.png
  alt: 2Million Machine 💵
---

> HackTheBox Easy Machine [TwoMillion](https://app.hackthebox.com/machines/TwoMillion)
{: .prompt-tip }

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/TwoMillion]
└─$ nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.11.221
Warning: 10.10.11.221 giving up on port because retransmission cap hit (6).
Nmap scan report for 10.10.11.221
Host is up (0.17s latency).
Not shown: 65509 closed tcp ports (reset)
PORT      STATE    SERVICE VERSION
22/tcp    open     ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp    open     http    nginx
|_http-title: Did not follow redirect to http://2million.htb/
3994/tcp  filtered unknown
7316/tcp  filtered swx
7546/tcp  filtered cfs
7659/tcp  filtered unknown
17495/tcp filtered unknown
18374/tcp filtered unknown
21128/tcp filtered unknown
22425/tcp filtered unknown
25486/tcp filtered unknown
27136/tcp filtered unknown
28073/tcp filtered unknown
30826/tcp filtered unknown
31592/tcp filtered unknown
32621/tcp filtered unknown
34500/tcp filtered unknown
36968/tcp filtered unknown
38126/tcp filtered unknown
41223/tcp filtered unknown
42028/tcp filtered unknown
45085/tcp filtered unknown
47945/tcp filtered unknown
48801/tcp filtered unknown
50885/tcp filtered unknown
52750/tcp filtered unknown
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
{: file='Nmap_Result.txt'}

## Web Enumeartion ⤵️

I checked port 80 and redirected to `2million.htb` site , therefore I set the `/etc/hosts` file as the domain name that I got and loaded the site and this site is about Hackthebox looks interesing →

![Untitled](TwoMillion/Untitled%201.png)

Lets check the `invite` page and I have to find out how the invite code is working or generated →

![Untitled](TwoMillion/Untitled%202.png)

I checked its source code and I also got another source code in it as `/js/inviteapi.min.js` file →

![Untitled](TwoMillion/Untitled%203.png)

I checked the other .js file and this file is obfuscated so I used the deobfuscated online site to make it readable →

```URL
http://2million.htb/js/inviteapi.min.js
```
{: .nolineno}

![Untitled](TwoMillion/Untitled%204.png)

After deobfuscation of this code from [de4js](https://lelinhtinh.github.io/de4js/) Tool with eval option , I got this result →

```jsx
function verifyInviteCode(code) {
    var formData = {
        "code": code
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        data: formData,
        url: '/api/v1/invite/verify',
        success: function (response) {
            console.log(response)
        },
        error: function (response) {
            console.log(response)
        }
    })
}

function makeInviteCode() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/api/v1/invite/how/to/generate',
        success: function (response) {
            console.log(response)
        },
        error: function (response) {
            console.log(response)
        }
    })
}
```
{: .nolineno}
{: file='/js/inviteapi.min.js'}

In this code I clearly see how code is generated so lets try it out →

![Untitled](TwoMillion/Untitled%205.png)

I decoded this in `ROT13` and as a result I got this →

![Untitled](TwoMillion/Untitled%206.png)

Lets go to `/api/v1/invite/generate` url →

![Untitled](TwoMillion/Untitled%207.png)

I got the invite code encoded as base64 →

```
{: .nolineno}
31JEX-R97V8-RATI1-XIE4K
```
{: .nolineno}

Let’s use this invite code to register a user →

![Untitled](TwoMillion/Untitled%208.png)

Now lets login into `shiva` account →

![Untitled](TwoMillion/Untitled%209.png)

I got in as user `shiv` here with similar proccess into the dashboard →

![Untitled](TwoMillion/Untitled%2010.png)

I enumerated further tabs in this site but noluck so , I started working on URL access to get more data about the site →

![Untitled](TwoMillion/Untitled%2011.png)

Now lets move on to `v1` directory →

![Untitled](TwoMillion/Untitled%2012.png)

lets check the admin urls this look interesting →

I got one hit from PUT request on this site `/api/v1/admin/settings/update` →

![Untitled](TwoMillion/Untitled%2013.png)

Lets move forword to provide what it wants →

![Untitled](TwoMillion/Untitled%2014.png)

Now lets set the is_admin as True or False or 1 or 0 as boolian value →

![Untitled](TwoMillion/Untitled%2015.png)

I think I got the admin access →

![Untitled](TwoMillion/Untitled%2016.png)

so lets check again the authentication as admin check →

![Untitled](TwoMillion/Untitled%2017.png)

so I am admin as a user `shiv` , so lets generate the vpn file as admin →

```
{: .nolineno}
/api/v1/admin/vpn/generate
```
{: .nolineno}

![Untitled](TwoMillion/Untitled%2018.png)

Lets give what the response is asking for →

![Untitled](TwoMillion/Untitled%2019.png)

I can generate the VPN file with any username so it seams vulnerable to me so I tried different command injections and I got this →

![Untitled](TwoMillion/Untitled%2020.png)

I got it know command Injection Jai Ho !! , so lets have a reverse shell now →

![Untitled](TwoMillion/Untitled%2021.png)

Lets dig deeper to get to root user →

After getting admin shell I checked the capability of commands that are set diffrently that can leads me to root and I got a hit on one →

```bash
admin@2million:/$ getcap -r / 2>/dev/null
/snap/core20/1891/usr/bin/ping cap_net_raw=ep
/tmp/ovlcap/upper/magic =ep 41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63+ep
/usr/bin/mtr-packet cap_net_raw=ep
/usr/bin/ping cap_net_raw=ep
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper cap_net_bind_service,cap_net_admin=ep
admin@2million:/$ which gcc
/usr/bin/gcc
admin@2million:/$
```
{: .nolineno}

I searched on web related to `/tmp/ovlcap/upper/magic` exploit or any payload and I got one that is [OverlayFS Local Privesc](https://github.com/briskets/CVE-2021-3493/tree/main) which is based on **CVE-2021-3493** but it did’t work so moved on to different exploit and also in a while I got some more info about the exploit from machine only through `/var/mail/admin` →

```bash
admin@2million:/var/mail$ cat admin
From: ch4p <ch4p@2million.htb>
To: admin <admin@2million.htb>
Cc: g0blin <g0blin@2million.htb>
Subject: Urgent: Patch System OS
Date: Tue, 1 June 2023 10:45:22 -0700
Message-ID: <9876543210@2million.htb>
X-Mailer: ThunderMail Pro 5.2

Hey admin,

I am know you are working as fast as you can to do the DB migration. While we are partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can not get popped by that.

HTB Godfather
admin@2million:/var/mail$
```
{: .nolineno}

> So I looked for CVEs from this year and I got one **[CVE-2023-0386](https://github.com/sxlmnwb/CVE-2023-0386)** and its exploit also so lets use it I downloaded the zip file in attackers machine and transfered that zip file into the victim machine through wget command and python web server and then I unziped it and used as instructed in the exploit README.md file .
{: .prompt-tip }

![Untitled](TwoMillion/Untitled%2022.png)

I am root now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }