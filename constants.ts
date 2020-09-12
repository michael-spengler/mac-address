// osx start line 'en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500'
// linux start line 'eth0      Link encap:Ethernet  HWaddr 00:16:3E:00:0A:29  '
export const MAC_OSX_START_LINE = /^(\w+)\:\s+flags=/
export const MAC_LINUX_START_LINE = /^(\w+)\s{2,}link encap:\w+/i

// ether 78:ca:39:b0:e6:7d
// HWaddr 00:16:3E:00:0A:29
export const MAC_RE = /(?:ether|HWaddr)\s+((?:[a-z0-9]{2}\:){5}[a-z0-9]{2})/i

// osx: inet 192.168.2.104 netmask 0xffffff00 broadcast 192.168.2.255
// linux: inet addr:10.125.5.202  Bcast:10.125.15.255  Mask:255.255.240.0
export const MAC_IP_RE = /inet\s(?:addr\:)?(\d+\.\d+\.\d+\.\d+)/

// Physical Address......... : 00:B0-D0-12-34-56
export const WIN_MAC_RE = /\.+\s\:\s((?:[a-z0-9]{2}\-){5}[a-z0-9]{2})$/i

// IP Address............... : 192.168.0.141
// IPv4 Address | IPv6 Address
export const WIN_IP_RE = /IP(?:v4|v6)?\s.*\.+\s\:\s([a-z0-9\.\:]+)/i