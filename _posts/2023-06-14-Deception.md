---
categories: [Proving Grounds Play, Walkthrough]
tags: [PrivEsc]
---

Lets check the Victim Machines IP address ⤵️

![Untitled](/Vulnhub-Files/img/Deception/Untitled.png)

```bash
IP : 10.0.2.40
```

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%201.png)

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Deception]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.40
Starting Nmap 7.93 ( https://nmap.org ) at 2023-04-28 13:32 IST
Nmap scan report for 10.0.2.40
Host is up (0.00088s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 9dd098da0d323d0b3f424dd7934ffd60 (RSA)
|   256 4cf42e2482cf9c8de20c524b2ea512d9 (ECDSA)
|_  256 a9fbe3f4bad61e72e7972582876eea01 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.29 (Ubuntu)
MAC Address: 08:00:27:86:C5:24 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ➡️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%202.png)

Now with directory traversal I got wordpress ➡️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%203.png)

![Untitled](/Vulnhub-Files/img/Deception/Untitled%204.png)

Now with wpscan results I got 2 users ⬇️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%205.png)

Now after directory listing in `wordpress` I got many things like ⬇️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%206.png)

`robots.html` >>

![Untitled](/Vulnhub-Files/img/Deception/Untitled%207.png)

`admindelete.html` >>

![Untitled](/Vulnhub-Files/img/Deception/Untitled%208.png)

Now let ‘s find api tokens ➡️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%209.png)

```bash
API old0 : 5F4DCC3B5AA
API old1 : 765D61D8
API old2 : 327DEB
API new : 882CF99

API token : 5F4DCC3B5AA765D61D8327DEB882CF99
```

After decoding this md5 hash , I got this >>

![Untitled](/Vulnhub-Files/img/Deception/Untitled%2010.png)

Now lets load this with wordpress url ⤵️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%2011.png)

```bash
Credentials for SSH >>
username : you know it >> yash
password : password    >> 5F4DCC3B5AA765D61D8327DEB882CF99
```

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Deception]
└─$ sudo ssh yash@10.0.2.40    
[sudo] password for kali: 
The authenticity of host '10.0.2.40 (10.0.2.40)' can't be established.
ED25519 key fingerprint is SHA256:akKQEcWIOuFc7fx+2sf5jLIEVND/B8BYsa+iUz05NCA.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.0.2.40' (ED25519) to the list of known hosts.
yash@10.0.2.40's password: 
Permission denied, please try again.
yash@10.0.2.40's password: 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 5.0.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

 * Canonical Livepatch is available for installation.
   - Reduce system reboots and improve kernel security. Activate at:
     https://ubuntu.com/livepatch

219 packages can be updated.
128 updates are security updates.

New release '20.04.6 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Last login: Sat Feb 15 19:58:38 2020

opeartion going on=====================> Copy password to /haclabs
System compromised!!!ALERT
Copy operation aborted
yash@haclabs:~$
yash@haclabs:~$ cat flag1.txt
JUST BELIEVE IN YOU!!

71C480DF93D6AE2F1EFAD1447C66C9525E316218CF51FC8D9ED832F2DAF18B73
```

Now lets check the SUIDs files ➡️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%2012.png)

Lets exploit with python2.7 ⤵️

![Untitled](/Vulnhub-Files/img/Deception/Untitled%2013.png)

![Untitled](/Vulnhub-Files/img/Deception/Untitled%2014.png)

I found the 2nd flag inside the haclabs directory >>

```bash
# cat flag2.txt
c2Vjb25kIGZsYWcgOiBGQkM5NDQ2MDExQ0Y1QjE5OEVEOTU5NkNFRkJDNzlCQgpCdXQgc3RpbGwgaXQgaXMgbm9vT0JCIQo=
#

Attckers Machine >>

┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Deception]
└─$ echo "c2Vjb25kIGZsYWcgOiBGQkM5NDQ2MDExQ0Y1QjE5OEVEOTU5NkNFRkJDNzlCQgpCdXQgc3RpbGwgaXQgaXMgbm9vT0JCIQo=" | base64 -d
second flag : FBC9446011CF5B198ED9596CEFBC79BB
But still it is nooOBB!
```