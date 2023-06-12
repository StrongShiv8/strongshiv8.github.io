---
categories: [vulnhub]
tags: [vulnhub,walkthrough,pentest]
---
# TommyBoy1dot0



![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled.png)

## **DESCRIPTION ⤵️**

**=================**

**HOLY SCHNIKES! Tommy Boy needs your help!**

**The Callahan Auto company has finally entered the world of modern technology and stood up a Web server for their customers to use for ordering brake pads.**

**Unfortunately, the site just went down and the only person with admin credentials is Tom Callahan Sr. - who just passed away! And to make matters worse, the only other guy with knowledge of the server just quit!**

**You'll need to help Tom Jr., Richard and Michelle get the Web page restored again. Otherwise Callahan Auto will most certainly go out of business :-(**

### **OBJECTIVE ⤵️**

**=================**

**The primary objective is to restore a backup copy of the homepage to Callahan Auto's server. However, to consider the box fully pwned, you'll need to collect 5 flags strewn about the system, and use the data inside them to unlock one final message.**

### **OTHER INFO ⤵️**

**=================**

- Size: 1.3GB
- Hypervisor: Created with VMWare Fusion 8.1.1.
- Difficulty: ?

### **SPECIAL THANKS TO ⤵️**

**=================**

◇ Rand0mbytez for testing about 10 versions of this frickin' thing to get the bugs worked out.

◇ RobertWinkel for additional detailed testing and suggestions for tweaking the VM for a better overall experience.

Let’s find the IP Address first →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%201.png)

```bash
IP : 10.0.2.16
```

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%202.png)

Nmap Scan →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%203.png)

```bash
OPEN PORTS ->
22    SSH  
80    HTTP (robot.txt found)
8008  HTTP (Recon more require !)
```

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%204.png)

robots.txt ➡️

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%205.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%206.png)

```bash
Flag 1 → B34rcl4ws
```

This is the source code of main page →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%207.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%208.png)

With wpscan I found this →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%209.png)

```bash
users ->
	tommy
	richard
	tom
	michelle
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2010.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2011.png)

lets see what inside of this image →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2012.png)

Lets decode this one →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2013.png)

```bash
spanky
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2014.png)

```bash
Flag #2: thisisthesecondflagyayyou.txt
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2015.png)

```bash
Z4l1nsky
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2016.png)

Now after scaning all the ports I got this -→

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2017.png)

`port 65534 OPEN FTP` →

let's access it with nickburns username and password both. →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2018.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2019.png)

Lets use this password →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2020.png)

Now with steve jobs as a hint I changed the user agent to an iphone and I got this →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2021.png)

Now let's use the user-agent of iphone and brute-force the directory →

```bash
command → 

feroxbuster -a "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e 
Safari/8536.25" --url http://10.0.2.16:8008/NickIzL33t -w /usr/share/wordlists/rockyou.txt -t 100 -k
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2022.png)

Now I found this file `fallon1.html` →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2023.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2024.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2025.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2026.png)

I have got the conditions so lets generate the password with `crunch tool` →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2027.png)

Now lets crack the password with `fcrackzip Tool` →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2028.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2029.png)

Callahan Auto Server ➡️

```bash
Username: bigtommysenior
Password: fatguyinalittlecoat
```

Lets try wpscan for Tom now lets see if I can find password of his account →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2030.png)

```bash
Username → tom
Password  → tomtom1
```

After loging in I got this →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2031.png)

Callahan Auto Server ➡️

---

```bash
Username: bigtommysenior
Password: fatguyinalittlecoat1938!!
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2032.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2033.png)

```bash
EditButton
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2034.png)

```bash
My SQL Credentials ->
user : wordpressuser
pass : CaptainLimpWrist!!!
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2035.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2036.png)

changed the file name as stated earliar after transfering it Now let's access it →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2037.png)

For → # world-writeable & executable folders

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2038.png)

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2039.png)

Now at this path I have created a shell file of 1 liner →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2040.png)

With iphone user-agent I got this →

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2041.png)

Now lets combine all the flags →

```bash
Flag 5 → Buttcrack
LOOT.ZIP (password)→ B34rcl4wsZ4l1nskyTinyHeadEditButtonButtcrack
```

![Untitled](/Vulnhub-Files/img/TommyBoy1dot0/Untitled%2042.png)

THE END !!

---

# **Summery Notes→**

- Got to learn so many things like cracking zip file was first time .
- Then user-agent configeration was new .
- Find FTP was very tricky part.
- New part was password generation with crunch with that combinations.
- Very Best machine lets you suffer very much , I did too , but enjoyed it.