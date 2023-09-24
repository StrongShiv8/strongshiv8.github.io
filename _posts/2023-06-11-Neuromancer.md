---
categories: [VulnHub, Walkthrough]
tags: [PrivEsc]
---
# Neuromancer

Lets Network check with Nmap Scan →

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled.png)

Lets scan it with all ports flag `-p-` →

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled%201.png)

**As I know that after solving the straylight I can go for Neuromancer Machine And As I have found this in root section of Straylight :>**

****

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled%202.png)

Now lets navigate to `/struts2_2.3.15.1-showcase` ⤵️

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled%203.png)

I got command injection code for jsp file and Executed it on Web Interface and I got this →

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled%204.png)

Now I know that →

![Untitled](/Vulnhub-Files/img/Neuromancer/Untitled%205.png)

Full Discloser →

[https://jckhmr.net/wintermute-part-2-neuromancer-vulnhub-writeup/](https://jckhmr.net/wintermute-part-2-neuromancer-vulnhub-writeup/)

---

### **Use ➡️**


💡 **chisel tool**

**for piviting between the systems (Neuromance , Straylight , Kali)**

- List
