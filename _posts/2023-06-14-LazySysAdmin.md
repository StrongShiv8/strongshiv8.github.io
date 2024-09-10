---
title: LazySysAdmin
categories: [Proving Grounds, Play]
tags: [Password Bruteforce, PrivEsc]
image:
  path: https://www.infosecarticles.com/content/images/2020/09/mondays.png
  alt:  LazySysAdmin Machine 🖥️
---


### Lets check the Victim Machine’s IP address ⤵️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled.png)

```bash
IP : 192.168.249.131
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Lazysysadmin]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 192.168.249.131
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-01 01:57 EDT
Nmap scan report for 192.168.249.131
Host is up (0.0028s latency).
Not shown: 65529 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 b538660fa1eecd41693b82cfada1f713 (DSA)
|   2048 585a6369d0dadd51ccc16e00fd7e61d0 (RSA)
|   256 6130f3551a0ddec86a595bc99cb49204 (ECDSA)
|_  256 1f65c0dd15e6e421f2c19ba3b655a045 (ED25519)
80/tcp   open  http        Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
| http-robots.txt: 4 disallowed entries 
|_/old/ /test/ /TR2/ /Backnode_files/
|_http-title: Backnode
|_http-generator: Silex v2.2.7
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)
3306/tcp open  mysql       MySQL (unauthorized)
6667/tcp open  irc         InspIRCd
| irc-info: 
|   server: Admin.local
|   users: 1
|   servers: 1
|   chans: 0
|   lusers: 1
|   lservers: 0
|   source ident: nmap
|   source host: 192.168.249.128
|_  error: Closing link: (nmap@192.168.249.128) [Client exited]
MAC Address: 00:0C:29:34:9D:0A (VMware)
Service Info: Hosts: LAZYSYSADMIN, Admin.local; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ➡️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled%201.png)

### Directory / Files Bruteforcing ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Lazysysadmin]
└─$ feroxbuster -u http://192.168.249.131:80 -t 100 -k -o ferox_80 --depth 2 -C 403,404 -x php,js,html,txt,zip -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt 

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.9.1
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.249.131:80
 🚀  Threads               │ 100
 📖  Wordlist              │ /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
 💢  Status Code Filters   │ [403, 404]
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.9.1
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 💾  Output File           │ ferox_80
 💲  Extensions            │ [php, js, html, txt, zip]
 🏁  HTTP methods          │ [GET]
 🔓  Insecure              │ true
 🔃  Recursion Depth       │ 2
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
200      GET      911l     1700w    36072c http://192.168.249.131/
200      GET      911l     1700w    36072c http://192.168.249.131/index.html
200      GET      927l     5044w    77179c http://192.168.249.131/info.php
301      GET        9l       28w      321c http://192.168.249.131/wordpress => http://192.168.249.131/wordpress/
301      GET        9l       28w      316c http://192.168.249.131/test => http://192.168.249.131/test/
301      GET        9l       28w      314c http://192.168.249.131/wp => http://192.168.249.131/wp/
301      GET        9l       28w      318c http://192.168.249.131/apache => http://192.168.249.131/apache/
301      GET        9l       28w      315c http://192.168.249.131/old => http://192.168.249.131/old/
301      GET        9l       28w      322c http://192.168.249.131/javascript => http://192.168.249.131/javascript/
200      GET        7l       10w       92c http://192.168.249.131/robots.txt
301      GET        9l       28w      332c http://192.168.249.131/wordpress/wp-content => http://192.168.249.131/wordpress/wp-content/
200      GET      385l     3179w    19935c http://192.168.249.131/wordpress/license.txt
301      GET        9l       28w      333c http://192.168.249.131/wordpress/wp-includes => http://192.168.249.131/wordpress/wp-includes/
200      GET       98l      844w     7413c http://192.168.249.131/wordpress/readme.html
301      GET        9l       28w      330c http://192.168.249.131/wordpress/wp-admin => http://192.168.249.131/wordpress/wp-admin/
301      GET        9l       28w      322c http://192.168.249.131/phpmyadmin => http://192.168.249.131/phpmyadmin/
200      GET       24l      149w    12497c http://192.168.249.131/phpmyadmin/webapp.php
200      GET       25l      318w     8269c http://192.168.249.131/phpmyadmin/navigation.php
200      GET       25l      318w     8266c http://192.168.249.131/phpmyadmin/license.php
200      GET       25l      318w     8265c http://192.168.249.131/phpmyadmin/export.php
401      GET       14l       54w      461c http://192.168.249.131/phpmyadmin/setup
200      GET       25l      318w     8262c http://192.168.249.131/phpmyadmin/sql.php
301      GET        9l       28w      332c http://192.168.249.131/javascript/prototype => http://192.168.249.131/javascript/prototype/
405      GET        1l        6w       42c http://192.168.249.131/wordpress/xmlrpc.php
301      GET        9l       28w      329c http://192.168.249.131/phpmyadmin/locale => http://192.168.249.131/phpmyadmin/locale/
200      GET       25l      318w     8272c http://192.168.249.131/phpmyadmin/server_status.php
[####################] - 11m  11909484/11909484 0s      found:26      errors:851498 
[####################] - 9m   1323276/1323276 2411/s  http://192.168.249.131:80/ 
[####################] - 9m   1323276/1323276 2222/s  http://192.168.249.131/ 
[####################] - 10m  1323276/1323276 2128/s  http://192.168.249.131/wordpress/ 
[####################] - 0s   1323276/1323276 0/s     http://192.168.249.131/test/ => Directory listing (add -e to scan)
[####################] - 0s   1323276/1323276 0/s     http://192.168.249.131/wp/ => Directory listing (add -e to scan)
[####################] - 0s   1323276/1323276 0/s     http://192.168.249.131/apache/ => Directory listing (add -e to scan)
[####################] - 0s   1323276/1323276 0/s     http://192.168.249.131/old/ => Directory listing (add -e to scan)
[####################] - 11m  1323276/1323276 1957/s  http://192.168.249.131/javascript/ 
[####################] - 9m   1323276/1323276 2260/s  http://192.168.249.131/phpmyadmin/
```
{: .nolineno}

Now Lets check the wordpress site now ⤵️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled%202.png)

Now I get a username as `togie` so lets try ssh brute force ➡️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled%203.png)

Let’s SSH now ⤵️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled%204.png)

Now see what this user can do ➡️

![Untitled](/Vulnhub-Files/img/LazySysAdmin/Untitled%205.png)

Proof.txt file ⬇️

```bash
root@LazySysAdmin:/root# cat proof.txt
WX6k7NJtA8gfk*w5J3&T@*Ga6!0o5UP89hMVEQ#PT9851

Well done :)

Hope you lear not a few things along the way.

Regards,

Togie Mcdogie

Enjoy some random strings

WX6k7NJtA8gfk*w5J3&T@*Ga6!0o5UP89hMVEQ#PT9851
2d2v#X6x9%D6!DDf4xC1ds6YdOEjug3otDmc1$#slTET7
pf%&1nRpaj^68ZeV2St9GkdoDkj48Fl$MI97Zt2nebt02
bhO!5Je65B6Z0bhZhQ3W64wL65wonnQ$@yw%Zhy0U19pu
root@LazySysAdmin:/root#
```
{: .nolineno}

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }