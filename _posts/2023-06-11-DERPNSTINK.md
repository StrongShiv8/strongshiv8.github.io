---
title: DERPNSTINK 1
categories: [VulnHub]
tags: [Wordpress, OSINT, mysql, Wireshark, PrivEsc]
image:
  path: /Vulnhub-Files/img/DERPNSTINK/Untitled%203.png
  alt: Derpnstink 1 Machine 🖥️
---

## **Description ⤵️**


💡 **DIFFICULTY →** [DerpNStink](https://www.vulnhub.com/entry/derpnstink-1,221/)

Beginner

DESCRIPTION →

Mr. Derp and Uncle Stinky are two system administrators who are starting their own company, DerpNStink. Instead of hiring qualified professionals to build up their IT landscape, they decided to hack together their own system which is almost ready to go live...

INSTRUCTIONS →

This is a boot2root Ubuntu based virtual machine. It was tested on VMware Fusion and VMware Workstation12 using DHCP settings for its network interface. It was designed to model some of the earlier machines I encountered during my OSCP labs also with a few minor curve-balls but nothing too fancy. Stick to your classic hacking methodology and enumerate all the things!

Your goal is to remotely attack the VM and

find all 4 flags eventually leading you to full root access.

Do not forget to #tryharder

Example: flag1(AB0BFD73DAAEC7912DCDCA1BA0BA3D05). Do not waste time decrypting the hash in the flag as it has no value in the challenge other than an identifier.

CONTACT →

Hit me up if you enjoy this VM! Twitter: @securekomodo Email: hackerbryan@protonmail.com


#### **Let’s find the IP Address first >>**

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled.png)

```bash
IP : 10.0.2.14
```
{: .nolineno}

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%201.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%202.png)

```bash
OPEN PORTS >
21   FTP (Check for Anonymous Login)
22   SSH (Not seams vulnerable)
80   HTTP (Time to dig into this !)
```
{: .nolineno}

---

## Web Enumeration ⤵️

I checked the port 80 :

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%203.png)

set the `/etc/hosts` as 10.0.2.14 [derpnstink.local](http://derpnstink.local/) →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%204.png)

Lets use wpscan results →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%205.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%206.png)

Then lets find the username and password →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%207.png)

Now lets login and upload the image which consist of a payload →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%208.png)

Through enumeration I got this →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%209.png)

```bash
Flag 1 →  flag1(52E37291AEDF6A46D7D0BB8A6312F4F9F1AA4975C248C3F0E008CBA09D6E9166)
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2010.png)

It time to upload our payload →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2011.png)

Finally got the reverse shell → 

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2012.png)

As I got a Local Privilege Escalation →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2013.png)

lets see this one →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2014.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2015.png)

Lets check the database now →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2016.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2017.png)

```bash
unclestinky
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2018.png)

Lets identify the hash →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2019.png)

This result is from [hashes.com](http://hashes.com/)  →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2020.png)

```bash
unclestinky → wedgie57
```
{: .nolineno}

Now lets try su stinky again →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2021.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2022.png)

```bash
Flag 3 → flag3(07f62b021771d3cf67e2e1faf18769cc5e5c119ad7d4d1847a11e11d6d5a7ecb)
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2023.png)

Let is import this pcap file to attackers machine →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2024.png)

```bash
mrderp → derpderpderpderpderpderpderp
```
{: .nolineno}

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2025.png)

Now I have created a file name derpy.sh →

**`echo** "**/**bin**/bash"** > derpy.sh`

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2026.png)

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2027.png)

```bash
Flag 4 → flag4(49dca65f362fee401292ed7ada96f96295eab1e589c52e4e66bf4aedda715fdd)
```
{: .nolineno}

After login in wordpress with unclestinky credentials I able to got this at last →

![Untitled](/Vulnhub-Files/img/DERPNSTINK/Untitled%2028.png)

```bash
Flag 2 → flag2(a7d355b26bda6bf1196ccffead0b2cf2b81f0a9de5b4876b44407f1dc07e51e6)
```
{: .nolineno}

<hr>
<br>
# **Summery Notes →**

>
> - This machine was very good , I enjoed the password extraction part from mysql server and decrypting the hash of it and getting the password of stinky was Awesome.
> - Then Extracting another password from pcap file of user mrderpy like old sake . But it was lengthy through.
> - Then lastly got the root and all the flags too.
> - Very Good machine (Teaches you many things)
{: .prompt-tip }

<hr>

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }