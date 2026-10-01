import Razorpay from "razorpay";

// checks that a required environment variable exists and returns its value.
function checkEnv(name) {
    const extractValue = process.env[name];

    if (!extractValue) {
        throw new Error(`Missing env: ${name}`);
    }

    return extractValue;
}

// creates one Razorpay client using the credentials stored in the server's environment variables.
export const razorpay = new Razorpay({
    key_id: checkEnv("RAZORPAY_KEY_ID"),
    key_secret: checkEnv("RAZORPAY_KEY_SECRET"),
});


// converts an amount from rupees to paise, because Razorpay expects payment amounts in the smallest currency unit.
export function toSubUnits(amount) {
    return Math.round(amount * 100);
}