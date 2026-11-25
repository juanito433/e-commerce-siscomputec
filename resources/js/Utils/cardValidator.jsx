const BIN_BANKS = [
    { prefixes: ["415231", "4555", "4916", "5212"], bank: "BBVA México" },
    { prefixes: ["4213", "4540", "5170", "5300"], bank: "Santander México" },
    { prefixes: ["4027", "4931", "5204", "5475"], bank: "Banorte" },
    { prefixes: ["4098", "4766", "5491"], bank: "HSBC México" },
    { prefixes: ["4716", "5268", "5412"], bank: "Citibanamex" },
    { prefixes: ["5579", "5101", "5314"], bank: "Nu México" },
    { prefixes: ["5394", "5182", "4010"], bank: "Mercado Pago" },
];

export function isValidLuhn(rawNumber = "") {
    const digits = String(rawNumber).replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (shouldDouble) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

export function detectCardBrand(rawNumber = "") {
    const digits = String(rawNumber).replace(/\D/g, "");
    if (/^4/.test(digits)) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
    if (/^3[47]/.test(digits)) return "amex";
    return "card";
}

export function detectBankName(rawNumber = "") {
    const digits = String(rawNumber).replace(/\D/g, "");
    if (digits.length < 4) return "Banco por detectar";

    for (const entry of BIN_BANKS) {
        if (entry.prefixes.some((p) => digits.startsWith(p))) {
            return entry.bank;
        }
    }

    const brand = detectCardBrand(digits);
    if (brand === "visa") return "Emisor Visa (Banco regional/digital)";
    if (brand === "mastercard") return "Emisor Mastercard (Banco regional/digital)";
    if (brand === "amex") return "American Express";
    return "Tarjeta bancaria";
}

export function formatCardNumber(rawNumber = "") {
    const digits = String(rawNumber).replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
}
