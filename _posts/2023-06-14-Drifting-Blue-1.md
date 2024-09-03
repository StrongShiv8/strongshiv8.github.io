---
title: Drifting Blue 1
categories: [Proving Grounds, Play]
tags: [DirtyCow, Password Bruteforce, PrivEsc, fcrackzip, File Upload]
image:
  path: /Vulnhub-Files/img/Drifting-Blue-1/166-3.png
  alt:  Drifting Blue 1 Machine 🖥️
---


## **Description ⤵️**

>
💡 [DriftingBlues: 1](https://www.vulnhub.com/entry/driftingblues-1,625/)
<br>
get flags
<br>
**difficulty:** easy
<br>
**about vm:** tested and exported from virtualbox. dhcp and nested vtx/amdv enabled. you can contact me by email (it should be on my profile) for troubleshooting or questions.
{: .prompt-info }

### Let’s find the IP Address first >>

![166-1.png](/Vulnhub-Files/img/Drifting-Blue-1/166-1.png)

```bash
IP : 10.0.2.19
```
{: .nolineno}
{: .nolineno}

## Port Scan Results ➡️

![166-2.png](/Vulnhub-Files/img/Drifting-Blue-1/166-2.png)

```bash
OPEN PORT >
80   HTTP
```
{: .nolineno}
{: .nolineno}

---

## Web Enumeration ⤵️

![166-3.png](/Vulnhub-Files/img/Drifting-Blue-1/166-3.png)

While checking the source code of this site page I got this →

![166-4.png](/Vulnhub-Files/img/Drifting-Blue-1/166-4.png)

![166-5.png](/Vulnhub-Files/img/Drifting-Blue-1/166-5.png)

![166-6.png](/Vulnhub-Files/img/Drifting-Blue-1/166-6.png)

![166-7.png](/Vulnhub-Files/img/Drifting-Blue-1/166-7.png)

Now I have to crack the password for the sapmmer.zip file →

![166-8.png](/Vulnhub-Files/img/Drifting-Blue-1/166-8.png)

```bash
myspace4
```
{: .nolineno}
{: .nolineno}

![166-9.png](/Vulnhub-Files/img/Drifting-Blue-1/166-9.png)

![166-10.png](/Vulnhub-Files/img/Drifting-Blue-1/166-10.png)

```bash
mayer : lionheart
```
{: .nolineno}
{: .nolineno}

![166-11.png](/Vulnhub-Files/img/Drifting-Blue-1/166-11.png)

Now I got in lets try for reverse shell →

![166-12.png](/Vulnhub-Files/img/Drifting-Blue-1/166-12.png)

Now Only I have to load this url → **[http://10.0.2.19/textpattern/files/shell.php](http://10.0.2.19/textpattern/files/shell.php)**

![166-13.png](/Vulnhub-Files/img/Drifting-Blue-1/166-13.png)

---

## SHELL ➡️

`config.php` file for credentials →

![166-14.png](/Vulnhub-Files/img/Drifting-Blue-1/166-14.png)

 

```bash
drifter : imjustdrifting31
```
{: .nolineno}
{: .nolineno}

![166-15.png](/Vulnhub-Files/img/Drifting-Blue-1/166-15.png)

Now I checked SUIDs and GUIDs files →

![166-16.png](/Vulnhub-Files/img/Drifting-Blue-1/166-16.png)

![166-17.png](/Vulnhub-Files/img/Drifting-Blue-1/166-17.png)

I am not able to run any exploit of exim so let is check the kernel version and exploit it accordingly →

![166-18.png](/Vulnhub-Files/img/Drifting-Blue-1/166-18.png)

Now lets try it out →

![166-19.png](/Vulnhub-Files/img/Drifting-Blue-1/166-19.png)

![166-20.png](/Vulnhub-Files/img/Drifting-Blue-1/166-20.png)

Now lets run **su firefart** →

![166-21.png](/Vulnhub-Files/img/Drifting-Blue-1/166-21.png)

---

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }