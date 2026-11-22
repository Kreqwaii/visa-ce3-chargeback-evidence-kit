# Visa CE 3.0 & Chargeback Evidence Kit

Open-source technical reference, JSON reason-code schemas, a zero-dependency Node.js Visa Compelling Evidence 3.0 (CE 3.0) eligibility validator, and bank-ready Markdown rebuttal templates for Stripe, Shopify Payments, and direct card network disputes.

If you want to assemble a compliant, compressed evidence PDF directly in your browser without uploading cardholder data to a third-party server, use the [DisputePack Evidence Builder](https://disputepack.pages.dev/builder).

## Contents

- [reason-codes.json](./reason-codes.json) - Machine-readable specification of 9 major Visa, Mastercard, and American Express dispute reason codes, required fields, response windows, and Stripe evidence mappings.
- [ce3_validator.mjs](./ce3_validator.mjs) - Zero-dependency Node.js CLI script that validates whether historical transactions qualify for Visa CE 3.0 liability shift under Reason Code 10.4.
- [templates/visa_10_4_ce3_rebuttal.md](./templates/visa_10_4_ce3_rebuttal.md) - Structured rebuttal template formatted for 90-second issuer analyst review under Visa 10.4 (CE 3.0).
- [templates/visa_13_1_not_received.md](./templates/visa_13_1_not_received.md) - Structured rebuttal template for Visa 13.1 (Merchandise or Services Not Received).

Additional web references:
- Full reason code lookup: https://disputepack.pages.dev/reason-codes
- Browser PDF builder: https://disputepack.pages.dev/builder
- Flat-rate vs contingency pricing comparison: https://disputepack.pages.dev/chargeflow-alternative

---

## Visa Compelling Evidence 3.0 (Reason Code 10.4) Rules

Visa Compelling Evidence 3.0 applies to Visa Reason Code **10.4 (Other Fraud - Card-Absent Environment)** disputes. When all conditions are met, liability shifts back to the issuing bank (or prevents the dispute pre-dispute via Visa Order Insight / Verifi).

To qualify for CE 3.0, the merchant must provide **at least two (2) prior undisputed transactions** on the same payment credential that meet all of the following criteria:

1. **Time Window (120 to 365 Calendar Days):** Each historical transaction must have settled at least **120 calendar days** and no more than **365 calendar days** prior to the disputed transaction date.
2. **Undisputed Status:** Neither historical transaction can have a prior fraud report or chargeback filed against it.
3. **Core Data Element Matching (>=2 of 4):** Across the disputed transaction and both qualifying historical transactions, at least **two (2)** of the following four core elements must match identically:
   - **Customer Account ID / Login ID**
   - **IP Address**
   - **Device ID / Device Fingerprint**
   - **Shipping Address**
4. **Mandatory Technical Anchor:** At least **one (1)** of the two matching core elements must be either **IP Address** or **Device ID / Device Fingerprint**. Matching only Account ID and Shipping Address does not qualify.

Note: Meeting CE 3.0 criteria establishes a strong technical basis for liability shift under Visa rules, but final adjudication always depends on the issuing bank verifying the submitted records and matching them against the cardholder credential. No tool or template can guarantee a 100% win rate.

---

## Processor Evidence Limits (Stripe & Shopify)

Issuing banks and payment processors enforce strict technical limits on uploaded evidence files. Submissions that exceed size or page caps are rejected or truncated before an analyst reviews them.

| Processor | Max File Size | Max Page Count | Accepted Formats | Key Technical Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Stripe** | **4.5 MB** combined across all files | **49 pages** total | PDF, JPEG, PNG | No embedded audio/video, no password-protected PDFs, minimum 12pt readable font recommended, single consolidated PDF preferred per evidence slot. |
| **Shopify Payments** | **4.0 MB** per submission | ~45 pages practical limit | PDF, JPEG, PNG | Avoid external links (analysts do not click URLs); embed screenshots directly into the PDF with timestamps visible. |
| **PayPal / Braintree** | 5.0 MB to 10.0 MB depending on integration | Varies by issuer | PDF, JPG, PNG | Tracking numbers must show carrier name, delivery date, and destination city/postal code matching the order. |

### 90-Second Analyst Review Checklist

Issuing bank dispute analysts typically spend 60 to 90 seconds per case file. Structure your PDF so the decision criteria appear on Page 1:

1. **Page 1 Executive Summary:** Dispute ID, Reason Code, Transaction Amount, Transaction Date, and a 3-bullet summary of the decisive proof.
2. **Data Match Table (for 10.4 CE 3.0):** Side-by-side table showing Disputed Tx vs Historical Tx #1 vs Historical Tx #2 with exact day-delta counts (e.g., 142 days, 218 days) and highlighted matching IP / Device ID / Account ID.
3. **Fulfillment / Access Logs:** Raw timestamps in UTC, carrier POD or SaaS login logs showing continued usage after purchase.
4. **Policy & Terms:** Screenshot of checkout consent checkbox and refund/cancellation policy visible at the time of purchase.
5. **Compression Check:** Verify final PDF size is under **4.5 MB** (Stripe) or **4.0 MB** (Shopify) and under **49 pages**.

---

## Running the Visa CE 3.0 Validator CLI

Requires Node.js 18+ (zero external dependencies).

Run the built-in sample validation:

```bash
node ce3_validator.mjs --sample
```

Validate your own dispute JSON payload:

```bash
node ce3_validator.mjs ./dispute_case.json
```

JSON output mode for CI or webhook pipelines:

```bash
node ce3_validator.mjs ./dispute_case.json --json
```

### Input JSON Format

```json
{
  "disputed": {
    "transaction_id": "ch_3Qx901",
    "date": "2026-04-15",
    "ip_address": "198.51.100.42",
    "device_id": "dev_fp_88412a",
    "account_id": "usr_77219",
    "shipping_address": "742 Evergreen Terrace, Springfield, IL 62704"
  },
  "historical": [
    {
      "transaction_id": "ch_3Mo112",
      "date": "2025-11-10",
      "disputed": false,
      "ip_address": "198.51.100.42",
      "device_id": "dev_fp_88412a",
      "account_id": "usr_77219",
      "shipping_address": "742 Evergreen Terrace, Springfield, IL 62704"
    },
    {
      "transaction_id": "ch_3Jk004",
      "date": "2025-08-22",
      "disputed": false,
      "ip_address": "198.51.100.42",
      "device_id": "dev_fp_99001b",
      "account_id": "usr_77219",
      "shipping_address": "742 Evergreen Terrace, Springfield, IL 62704"
    }
  ]
}
```

---

## Cost Comparison: 25% Contingency Fee vs Flat-Rate Tooling

Many automated chargeback platforms (such as Chargeflow) charge a **25% success fee** on every recovered dispute. For low-to-mid volume SaaS and e-commerce merchants, percentage fees scale linearly with recovered revenue, while evidence generation cost stays flat.

Example math assuming **$120 average order value (AOV)** and a conservative **50% recovery rate**:

| Monthly Disputes | Recovered Cases (50%) | Recovered Volume | 25% Contingency Fee (e.g. Chargeflow) | Flat-Rate Builder (DisputePack) | Monthly Cost Difference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 5 | 2.5 | $300 | $75 / mo | $15 / mo | $60 / mo ($720 / yr) |
| 15 | 7.5 | $900 | $225 / mo | $15 / mo | $210 / mo ($2,520 / yr) |
| 30 | 15 | $1,800 | $450 / mo | $15 / mo | $435 / mo ($5,220 / yr) |
| 50 | 25 | $3,000 | $750 / mo | $15 / mo | $735 / mo ($8,820 / yr) |

When a contingency service makes sense: high-volume merchants (200+ disputes/month) who want fully hands-off API submission and prefer paying a percentage rather than staffing internal dispute ops.

When a flat-rate evidence builder makes sense: merchants handling 2 to 60 disputes/month who already have Stripe/Shopify logs and want structured, compressed, bank-ready PDFs in under 5 minutes for a fixed $15/mo fee.

See the full breakdown at [disputepack.pages.dev/chargeflow-alternative](https://disputepack.pages.dev/chargeflow-alternative) or build a packet directly at [disputepack.pages.dev/builder](https://disputepack.pages.dev/builder).

---

## License

MIT License. See [LICENSE](./LICENSE).
