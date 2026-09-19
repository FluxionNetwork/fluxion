# Problematic wireless adapters

A running list of wireless adapters that misbehave with Fluxion, what the
symptom looks like, and what (if anything) can be done about it. Most entries
here are **not** Fluxion bugs — they are driver/firmware limitations that show
up as confusing Fluxion behavior (empty client lists, no handshake, etc.).

If you hit a similar problem, check here first. To add an adapter, copy the
template at the bottom and fill it in with what you observed.

---

## Fenvi AX1800 (USB) — MediaTek MT7921AU / `mt7921u`

- **Chipset:** MediaTek MT7921AU (USB ID `0e8d:7961`)
- **Driver:** `mt7921u` (mt76)
- **Roles affected:** client scanning and handshake capture (anything that
  relies on `airodump-ng` listing associated stations). Transmit roles
  (deauth jammer) are **not** affected.

### Symptom

In monitor mode the adapter sees access points fine (beacons show up in
`airodump-ng`), but the **STATION** list stays empty — even when clients are
associated and actively passing traffic. In Fluxion this surfaces as the
Captive Portal / Handshake Snooper client scanner reporting *no associated
clients* on a target that clearly has them.

### Root cause

In monitor mode the MT7921U firmware only delivers **management** and
**group-addressed (broadcast/multicast)** frames to the host. It drops **all
unicast data frames and all control frames (ACK / Block-ACK)**. `airodump-ng`
identifies a station from unicast/uplink frames and correctly refuses to
attribute a group-addressed frame to a specific client, so no station is ever
recorded. The real client MACs are only present as the *source* field
(`addr3`) of relayed broadcast frames, which is not a valid association
signal.

### Ruled out (so you don't repeat the dig)

All of the following were tested and are **not** the cause:

- **airodump-ng version** — reproduced on the packaged 1.7 *and* on a
  from-source build of git master (`aircrack-ng` rev `2f393ae`).
- **Channel hopping** — interface was locked to the target BSSID/channel.
- **The `-a` "filter unassociated clients" flag** — empty with and without it.
- **Channel width** — identical result at HT20 and at matching HT40.
- **Idle clients** — clients were actively passing traffic (verified with a
  second host hammering the target's Wi-Fi IP).
- **A wedged firmware state** — a full USB detach/replug and fresh firmware
  re-init behaved identically.

Confirmation: instrumenting `airodump-ng`'s `dump_add_packet()` showed every
data frame arriving `FromDS` with a broadcast/multicast destination. A raw
15 s `tcpdump` across all nearby APs captured **0 control frames and 0 unicast
data frames** — physically impossible on a live band unless the adapter is
filtering them below userspace.

### Notes

- Also observed on this hardware: a `mac80211` `WARNING` in
  `ieee80211_recalc_offload` firing on interface bring-up (kernel
  `7.1.5+kali`). Likely a separate driver/mac80211 issue; not the direct cause
  of the missing stations.

### Workaround

Use a different adapter for the **scanning / capture** role — one whose
mac80211 monitor mode passes unicast and control frames, e.g. Realtek
RTL8821AU, Atheros `ath9k` / `ath9k_htc`, or MediaTek `mt76x2u` (MT7612U).
The MT7921U can stay in the deauth-jammer role, since transmit works fine.
This pairs naturally with `--jammer-interface` / `--ap-interface` for
multi-adapter setups.

---

## Template for new entries

```markdown
## <Adapter name> — <Chipset> / `<driver>`

- **Chipset:** <chipset> (USB/PCI ID `xxxx:yyyy`)
- **Driver:** `<driver>`
- **Roles affected:** <scan / capture / AP / deauth>

### Symptom
<what the user sees in Fluxion / airodump>

### Root cause
<driver/firmware behavior, if known>

### Ruled out
<things tested that are NOT the cause>

### Workaround
<how to work around it, e.g. use another adapter for a given role>
```
