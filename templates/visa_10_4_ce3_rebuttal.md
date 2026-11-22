# Chargeback Rebuttal: Visa Reason Code 10.4 (Compelling Evidence 3.0)

> Format target: Single consolidated PDF under 4.5 MB (Stripe) or 4.0 MB (Shopify), under 49 pages. Keep Page 1 scannable for a 90-second issuing bank analyst review.
> Browser PDF builder: https://disputepack.pages.dev/builder

---

## 1. Executive Summary (Page 1)

| Field | Value |
| :--- | :--- |
| **Dispute / Case ID** | `[dp_xxxxxxxxxxxx]` |
| **Network & Reason Code** | Visa 10.4 (Other Fraud - Card-Absent Environment) |
| **Compelling Evidence Basis** | Visa Compelling Evidence 3.0 (CE 3.0) |
| **Disputed Transaction ID** | `[ch_xxxxxxxxxxxx]` |
| **Disputed Date (UTC)** | `[YYYY-MM-DD]` |
| **Disputed Amount** | `[$0.00 USD]` |
| **Merchant Name / Descriptor** | `[Your Company LLC / DESCRIPTOR]` |

**Key Evidence Summary:**
1. The cardholder completed **two (2) prior undisputed transactions** on the same payment credential between **120 and 365 calendar days** prior to the disputed charge (`[X]` days prior and `[Y]` days prior).
2. Both historical transactions and the disputed transaction match identically on **[2 / 3 / 4] of 4 Visa CE 3.0 core data elements**, including the mandatory technical anchor (**[IP Address / Device ID]**).
3. Delivery and/or digital access logs confirm the disputed order was fulfilled to the same verified account and destination.

---

## 2. Visa CE 3.0 Core Element Match Matrix

| Core Data Element | Disputed Transaction (`[ch_disputed]`) | Historical Undisputed #1 (`[ch_hist_1]`) | Historical Undisputed #2 (`[ch_hist_2]`) | Match Status |
| :--- | :--- | :--- | :--- | :--- |
| **Transaction Date (UTC)** | `[YYYY-MM-DD]` | `[YYYY-MM-DD]` (`[120-365]` days prior) | `[YYYY-MM-DD]` (`[120-365]` days prior) | Within 120-365d |
| **Prior Dispute / Fraud Report** | Disputed | None (Undisputed) | None (Undisputed) | Verified |
| **IP Address** *(Anchor)* | `[203.0.113.10]` | `[203.0.113.10]` | `[203.0.113.10]` | **EXACT MATCH** |
| **Device ID / Fingerprint** *(Anchor)* | `[dev_fp_xxxx]` | `[dev_fp_xxxx]` | `[dev_fp_xxxx]` | **EXACT MATCH** |
| **Customer Account / Login ID** | `[usr_xxxx / email]` | `[usr_xxxx / email]` | `[usr_xxxx / email]` | **EXACT MATCH** |
| **Shipping Address** | `[123 Main St, City, ST, ZIP]` | `[123 Main St, City, ST, ZIP]` | `[123 Main St, City, ST, ZIP]` | **EXACT MATCH** |

---

## 3. Disputed Transaction Authorization & Fulfillment Details

- **Card Last 4 / Brand:** Visa ending in `[4242]`
- **AVS Result:** `[Y - Street and Postal Code Match]`
- **CVV Result:** `[M - Match]`
- **Order Number:** `[#10482]`
- **Product / Service Description:** `[Concise description of item or subscription tier]`
- **Fulfillment Proof:**
  - *Physical goods:* Carrier `[UPS/FedEx/USPS]`, Tracking `[1Z...]`, Delivered `[YYYY-MM-DD HH:MM UTC]` to `[City, State, ZIP]`.
  - *Digital / SaaS:* Account `[usr_xxxx]` logged in `[N]` times between `[YYYY-MM-DD]` and `[YYYY-MM-DD]` from IP `[203.0.113.10]`.

---

## 4. Historical Transaction Verification

### Historical Transaction #1
- **Transaction ID:** `[ch_hist_1]`
- **Settlement Date:** `[YYYY-MM-DD]` (`[XXX]` calendar days before disputed transaction)
- **Amount:** `[$0.00 USD]`
- **Status:** Settled, Undisputed, Not Refunded for Fraud

### Historical Transaction #2
- **Transaction ID:** `[ch_hist_2]`
- **Settlement Date:** `[YYYY-MM-DD]` (`[XXX]` calendar days before disputed transaction)
- **Amount:** `[$0.00 USD]`
- **Status:** Settled, Undisputed, Not Refunded for Fraud

---

## 5. Supporting Exhibits (Attach as Pages 2+)

- **Exhibit A:** Processor payment logs showing IP address, Device ID, AVS/CVV, and settlement dates for all 3 transactions.
- **Exhibit B:** Carrier proof of delivery (POD) or server access activity log (UTC timestamps).
- **Exhibit C:** Order confirmation email and checkout terms acceptance log.
- **Exhibit D:** Any customer support correspondence from the registered email address.

---

## 6. Request for Liability Shift

Based on the two qualifying prior undisputed transactions within the 120 to 365 day window and exact matching across at least two core data elements (including IP Address and/or Device ID), this submission satisfies Visa Compelling Evidence 3.0 requirements for Reason Code 10.4. We respectfully request that the dispute be resolved in the merchant's favor.
