import { fail } from "https://deno.land/std/testing/asserts.ts";
import { getMac } from 'https://deno.land/x/macaddress@v1.0.1/get-mac-address.ts'

Deno.test("get mac address", async (): Promise<void> => {

    const actualMacAddress = await getMac()

    if (actualMacAddress === null || actualMacAddress === undefined || actualMacAddress.length > 17) {
        fail(`I got an unexpected Mac Address: ${actualMacAddress}`)
    }

    await Deno.close(4)
    await Deno.close(5)
});