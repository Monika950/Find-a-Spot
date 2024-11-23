import * as SMS from "expo-sms";

export async function SendSMS(text: string, phoneNumber: string, callback: (status: String) => void) {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
            [phoneNumber],
            text
        );
        if (result === "cancelled") {
            return false;
        }
        callback(result);
        return true;
    }
}

export default SendSMS;
