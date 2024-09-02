---
title: "Sunset : Midnight"
categories: [Proving Grounds Play, Sunset]
tags: [Password Bruteforce, PrivEsc, SUIDs, mysql, status, Wordpress]
image:
  path: https://www.infosecarticles.com/content/images/2020/09/midnight.png
  alt:  Sunset Midnight Machine 🖥️
---


## **Description ⤵️**

>
💡 [sunset: midnight](https://vulnhub.com/entry/sunset-midnight,517/) ⤵️
<br>
**Difficulty:** Intermediate
<br>
**Important!:** Before auditing this machine make sure you add the host "sunset-midnight" to your /etc/hosts file, otherwise it may not work as expected.
<br>
It is recommended to run this machine in Virtualbox.
<br>
This works better with ViritualBox rather than VMware
{: .prompt-tip }

### Let’s find the IP Address first >>

![153-1.png](/Vulnhub-Files/img/Sunset-midnight/153-1.png)

```bash
IP : 10.0.2.5
```
{: .nolineno}

## Port Scan Results ➡️

![153-2.png](/Vulnhub-Files/img/Sunset-midnight/153-2.png)

```bash
OPEN PORTS >
22   SSH
80   HTTP
3306 mysql
```
{: .nolineno}



## Web Enumeration ⤵️

![153-3.png](/Vulnhub-Files/img/Sunset-midnight/153-3.png)

**After wpscan →**

![153-4.png](/Vulnhub-Files/img/Sunset-midnight/153-4.png)

lets try to brute force the password for sql →

![153-5.png](/Vulnhub-Files/img/Sunset-midnight/153-5.png)

```bash
mysql credentials → 
root : robert
```
{: .nolineno}

from `wordpress_db database` →

![153-6.png](/Vulnhub-Files/img/Sunset-midnight/153-6.png)

```bash
username → admin

password → $P$BaWk4oeAmrdn453hR6O6BvDqoF9yy6/
```
{: .nolineno}

from mysql database →

![153-7.png](/Vulnhub-Files/img/Sunset-midnight/153-7.png)

As I was not able to crack the password so lets change it →

```sql
Command →

update wp_users set user_pass="5f4dcc3b5aa765d61d832
```
{: .nolineno}

![153-8.png](/Vulnhub-Files/img/Sunset-midnight/153-8.png)

Now my password is password , Lets try it out →

![153-9.png](/Vulnhub-Files/img/Sunset-midnight/153-9.png)

Finally after uploading the shell I got reverse shell →

![153-10.png](/Vulnhub-Files/img/Sunset-midnight/153-10.png)

**Credentials Time →**

![153-11.png](/Vulnhub-Files/img/Sunset-midnight/153-11.png)

```sql
jose : 645dc5a8871d2a4269d4cbe23f6ae103
```
{: .nolineno}

![153-12.png](/Vulnhub-Files/img/Sunset-midnight/153-12.png)

![153-13.png](/Vulnhub-Files/img/Sunset-midnight/153-13.png)

```sql
user.txt → 956a9564aa5632edca7b745c696f6575
```
{: .nolineno}

Lets check the SUIDs and GUIDs files →

![153-14.png](/Vulnhub-Files/img/Sunset-midnight/153-14.png)

![153-15.png](/Vulnhub-Files/img/Sunset-midnight/153-15.png)

![153-16.png](/Vulnhub-Files/img/Sunset-midnight/153-16.png)

Now I have to Abuse the SUID commands →

![153-17.png](/Vulnhub-Files/img/Sunset-midnight/153-17.png)

![153-18.png](/Vulnhub-Files/img/Sunset-midnight/153-18.png)

![153-19.png](/Vulnhub-Files/img/Sunset-midnight/153-19.png)

```bash
root.txt → db2def9d4ddcb83902b884de39d426e6
```
{: .nolineno}

---

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }