### Fluxion instructions

#### Error codes
Fluxion exit with **1**:
**Reason: **Aborted, please execute the script as root.
**Solution:** `sudo ./fluxion`

Fluxion exit with **2**:
**Reason: **Aborted, X (graphical) session unavailable.
**Solution:** Run fluxion in a grafical session

Fluxion exit with **3**:
**Reason: **Aborted, xdpyinfo is unavailable.
**Solution:** Depend on your package manager
```
apt-get install xdpyinfo # for debian and kali
pacman -S xdpyinfo # for arch
yum install xdpyinfo # for gentoo
```

Fluxion exit with **4**:
**Reason: **Aborted, xterm test session failed.
**Solution:**  Run fluxion in a grafical session

Fluxion exit with **5**:
**Reason: **Aborted, enhanced getopt isn't available.
**Solution:**  Depend on your package manager

Fluxion exit with **6**:
**Reason: **Aborted, can't generate a workspace directory.
**Solution:**  Make sure you have some diskspace left