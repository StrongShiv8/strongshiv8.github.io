---
title: ElMariachi-PC
categories: [PwnTillDawn]
tags: [Public Exploit, PrivEsc]
image:
  path: /Vulnhub-Files/img/ElMariachi-PC/Untitled.png
  alt: ElMariachi PC -> https://www.wizlynxgroup.com/ , https://online.pwntilldawn.com/
---


## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/10.150.150.69]
└─$ sudo nmap -sV -sC -p- -A -T4 -oN Nmap_results.txt 10.150.150.69
Nmap scan report for 10.150.150.69
Host is up (0.17s latency).
Not shown: 65521 closed tcp ports (reset)
PORT      STATE SERVICE       VERSION
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: ELMARIACHI-PC
|   NetBIOS_Domain_Name: ELMARIACHI-PC
|   NetBIOS_Computer_Name: ELMARIACHI-PC
|   DNS_Domain_Name: ElMariachi-PC
|   DNS_Computer_Name: ElMariachi-PC
|   Product_Version: 10.0.17763
|_  System_Time: 2023-08-09T17:48:28+00:00
| ssl-cert: Subject: commonName=ElMariachi-PC
| Not valid before: 2023-08-08T14:37:18
|_Not valid after:  2024-02-07T14:37:18
|_ssl-date: 2023-08-09T17:48:58+00:00; +35m42s from scanner time.
5040/tcp  open  unknown
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  msrpc         Microsoft Windows RPC
50417/tcp open  msrpc         Microsoft Windows RPC
60000/tcp open  unknown
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.1 404 Not Found
|     Content-Type: text/html
|     Content-Length: 177
|     Connection: Keep-Alive
|     <HTML><HEAD><TITLE>404 Not Found</TITLE></HEAD><BODY><H1>404 Not Found</H1>The requested URL nice%20ports%2C/Tri%6Eity.txt%2ebak was not found on this server.<P></BODY></HTML>
|   GetRequest: 
|     HTTP/1.1 401 Access Denied
|     Content-Type: text/html
|     Content-Length: 144
|     Connection: Keep-Alive
|     WWW-Authenticate: Digest realm="ThinVNC", qop="auth", nonce="gJ6QWW4L5kBI2UcCbgvmQA==", opaque="dQwMTtxk2a2YM2Qf4DoI35O5R0L08eFaCP"
|_    <HTML><HEAD><TITLE>401 Access Denied</TITLE></HEAD><BODY><H1>401 Access Denied</H1>The requested URL requires authorization.<P></BODY></HTML>
1 service unrecognized despite returning data. If you know the service/version
```
{: .nolineno}
{: .nolineno}

## Web Enumeration ⤵️

Now lets check port 60000 for HTTP access →

It asking for username  and password so when I observed the nmap scan I got ThinVNC , Lets find an exploit related to it →

I got this exploit → [https://www.exploit-db.com/exploits/47519](https://www.exploit-db.com/exploits/47519)

Since It throws an error so I implemented on Burpsuite Directly →

![Untitled](/Vulnhub-Files/img/ElMariachi-PC/Untitled%201.png)

![Untitled](/Vulnhub-Files/img/ElMariachi-PC/Untitled%202.png)

I got some credentails →

```bash
User=desperado
Password=TooComplicatedToGuessMeAhahahahahahahh
```
{: .nolineno}
{: .nolineno}

No lets use this password as a login into the web →

![Untitled](/Vulnhub-Files/img/ElMariachi-PC/Untitled%203.png)

Now When I entered ‘Windows’ in the Text Box and the Web OS open up and there I found the FLAG →

![Untitled](/Vulnhub-Files/img/ElMariachi-PC/Untitled%204.png)

```bash
2971f3459fe55db1237aad5e0f0a259a41633962
```
{: .nolineno}
{: .nolineno}

Hence the machine is in Attackers control can have a reverse shell though execution of revrese shell code through web OS to Attcker’s machine but no need .

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }