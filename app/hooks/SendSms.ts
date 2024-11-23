import * as SMS from "expo-sms";

export async function SendSMS() {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
            ["+359988707079"],
            "Hello, I am in need of assistance. Please help me."
        );
        if (result === "cancelled") {
            return false;
        }
        return true;
    }
}

export default SendSMS;
