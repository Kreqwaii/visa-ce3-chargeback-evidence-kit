# Chargeback Rebuttal: Visa Reason Code 13.1 (Merchandise / Services Not Received)

> Format target: Single consolidated PDF under 4.5 MB (Stripe) or 4.0 MB (Shopify), under 49 pages.
> Browser PDF builder: https://disputepack.pages.dev/builder

---

## 1. Executive Summary (Page 1)

| Field | Value |
| :--- | :--- |
| **Dispute / Case ID** | `[dp_xxxxxxxxxxxx]` |
| **Network & Reason Code** | Visa 13.1 (Merchandise / Services Not Received) |
| **Disputed Transaction ID** | `[ch_xxxxxxxxxxxx]` |
| **Order Date (UTC)** | `[YYYY-MM-DD]` |
| **Delivery / Access Date (UTC)** | `[YYYY-MM-DD]` |
| **Disputed Amount** | `[$0.00 USD]` |
| **Merchant Name / Descriptor** | `[Your Company LLC / DESCRIPTOR]` |

**Key Evidence Summary:**
1. The order was fulfilled in full on `[YYYY-MM-DD]` to the exact `[shipping address / registered customer account]` provided by the cardholder at checkout.
2. Independent proof of delivery (`[Carrier + Tracking #]` / `[Server Access Logs]`) confirms receipt on `[YYYY-MM-DD]`.
3. `[Optional: The customer did not contact merchant support regarding non-receipt prior to filing this dispute / Support correspondence is attached in Exhibit C.]`

---

## 2. Order & Customer Verification

| Detail | Record |
| :--- | :--- |
| **Customer Name** | `[Full Name]` |
| **Customer Email** | `[customer@example.com]` |
| **Billing Address** | `[Street, City, State, Postal Code, Country]` |
| **Shipping Address** | `[Street, City, State, Postal Code, Country]` |
| **Itemized Goods / Services** | `[SKU / Plan Name - Qty - Price]` |
| **AVS / CVV Check** | `[AVS: Y / CVV: M]` |

---

## 3. Proof of Delivery (Complete Applicable Section)

### Option A: Physical Merchandise
- **Carrier:** `[UPS / FedEx / USPS / DHL]`
- **Tracking Number:** `[Tracking #]`
- **Shipped Date:** `[YYYY-MM-DD]`
- **Delivered Date & Time:** `[YYYY-MM-DD HH:MM UTC]`
- **Delivery Destination:** `[City, State, Postal Code]` (matches checkout shipping address)
- **Confirmation Method:** `[Signature on file / Carrier GPS photo / Left at front door]`

### Option B: Digital Goods or SaaS Service
- **Account ID / Email:** `[usr_xxxx / customer@example.com]`
- **Provisioning Timestamp:** `[YYYY-MM-DD HH:MM UTC]`
- **Access Log Summary:**

| Timestamp (UTC) | IP Address | Action / Event | Device / User-Agent |
| :--- | :--- | :--- | :--- |
| `[YYYY-MM-DD HH:MM]` | `[203.0.113.10]` | Account login | `[Chrome / macOS]` |
| `[YYYY-MM-DD HH:MM]` | `[203.0.113.10]` | Downloaded asset / Accessed workspace | `[Chrome / macOS]` |
| `[YYYY-MM-DD HH:MM]` | `[203.0.113.10]` | Exported report / Completed action | `[Chrome / macOS]` |

---

## 4. Customer Communication Timeline

- `[YYYY-MM-DD]`: Order confirmation email sent to `[customer@example.com]` (delivered).
- `[YYYY-MM-DD]`: Shipping notification / onboarding email sent with tracking / login link.
- `[YYYY-MM-DD]`: `[Note any support ticket or confirm zero contact received prior to dispute.]`

---

## 5. Supporting Exhibits (Attach as Pages 2+)

- **Exhibit A:** Itemized invoice and checkout confirmation showing billing/shipping addresses.
- **Exhibit B:** Full carrier tracking screenshot showing "Delivered" status, date, and destination (or full server access logs for digital services).
- **Exhibit C:** Customer email/support communication logs.
- **Exhibit D:** Shipping and delivery policy displayed at checkout.
