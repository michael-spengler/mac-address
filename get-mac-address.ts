import { exec } from 'https://deno.land/x/exec@0.0.5/mod.ts'
import { MAC_OSX_START_LINE, MAC_LINUX_START_LINE, MAC_RE, MAC_IP_RE, WIN_MAC_RE, WIN_IP_RE } from './constants.ts'

export async function getMac(interfaceName?: string) {
	const isWin = Deno.build.os === 'windows'

	try {
		const output = await exec(isWin ? 'ipconfig /all' : 'ifconfig')

		if (output) {
			return formatMac(isWin ? getMacByIpconfig(output) : getMacByIfconfig(output, interfaceName || getInterfaceName() || ''))
		}
	}
	catch (e) {
		console.warn(e)
	}

	return null
}

function getInterfaceName() {
	switch (Deno.build.os) {
		case 'darwin':
			return 'en'

		case 'windows':
			return null

		default:
			return 'eth'
	}
}

function getMacByIfconfig(content: string, interfaceName: string) {
	const lines = content.split('\n')
	const macList: string[] = []

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trimRight()
		const m = MAC_OSX_START_LINE.exec(line) || MAC_LINUX_START_LINE.exec(line)

		if (!m) {
			continue
		}

		// check interface name
		const name = m[1]

		if (name.indexOf(interfaceName) !== 0) {
			continue
		}

		let ip = null
		let mac = null
		let match = MAC_RE.exec(line)

		if (match) {
			mac = match[1]
		}

		i++
		while (true) {
			line = lines[i]

			if (!line || MAC_OSX_START_LINE.exec(line) || MAC_LINUX_START_LINE.exec(line)) {
				i--
				break // hit next interface, handle next interface
			}

			if (!mac) {
				match = MAC_RE.exec(line)
				if (match) {
					mac = match[1]
				}
			}

			if (!ip) {
				match = MAC_IP_RE.exec(line)
				if (match) {
					ip = match[1]
				}
			}

			i++
		}

		if (ip && mac) {
			return mac
		}
		else if (mac) {
			macList.push(mac)
		}
	}

	return macList[0]
}

function getMacByIpconfig(content: string) {
	const lines = content.split('\n')
	const macList: string[] = []
	let lastInterface: any = {}

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trimRight()
		const isHeadingLine = !/^\s+/.test(line)

		if (lastInterface.ip && lastInterface.mac) {
			return lastInterface.mac
		}

		if (isHeadingLine) {
			lastInterface = {}
		}
		else {
			const matchIp = WIN_IP_RE.exec(line)
			const matchMac = !matchIp && WIN_MAC_RE.exec(line)

			if (matchIp) {
				lastInterface.ip = matchIp[1]
			}
			else if (matchMac) {
				const mac = matchMac[1]

				if (lastInterface.ip) {
					return mac
				}

				lastInterface.mac = mac
				macList.push(mac)
			}
		}
	}

	return macList[0]
}

function formatMac(mac: string) {
	return mac ? mac.toLowerCase().replace(/-/g, ':') : null
}

