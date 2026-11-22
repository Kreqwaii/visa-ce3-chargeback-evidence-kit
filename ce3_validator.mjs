import fs from "node:fs";

const CORE_ELEMENTS = [
  "ip_address",
  "device_id",
  "account_id",
  "shipping_address"
];

const ANCHOR_ELEMENTS = new Set(["ip_address", "device_id"]);
const MIN_DAYS = 120;
const MAX_DAYS = 365;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalizeValue(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : null;
}

function parseIsoDateUtc(dateStr) {
  if (typeof dateStr !== "string") {
    return null;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (match === null) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const ms = Date.UTC(year, month, day);
  return Number.isNaN(ms) ? null : ms;
}

function getMatchedElements(disputed, historical) {
  const matched = [];
  for (const field of CORE_ELEMENTS) {
    const a = normalizeValue(disputed[field]);
    const b = normalizeValue(historical[field]);
    if (a !== null && b !== null && a === b) {
      matched.push(field);
    }
  }
  return matched;
}

export function evaluateCe3(payload) {
  const errors = [];
  if (payload === null || typeof payload !== "object") {
    return { eligible: false, errors: ["Input must be a JSON object."] };
  }

  const disputed = payload.disputed;
  const historicalList = payload.historical;

  if (disputed === null || typeof disputed !== "object") {
    errors.push("Missing 'disputed' transaction object.");
  }
  if (Array.isArray(historicalList) === false) {
    errors.push("Missing 'historical' array of prior transactions.");
  }
  if (errors.length > 0) {
    return { eligible: false, errors };
  }

  const disputedMs = parseIsoDateUtc(disputed.date);
  if (disputedMs === null) {
    return {
      eligible: false,
      errors: ["Invalid 'disputed.date'. Expected YYYY-MM-DD format."]
    };
  }

  const evaluations = [];
  const validCandidates = [];

  for (const tx of historicalList) {
    const txId = tx && tx.transaction_id ? String(tx.transaction_id) : "unknown";
    const txMs = parseIsoDateUtc(tx ? tx.date : null);
    const reasons = [];

    if (tx && tx.disputed === true) {
      reasons.push("Historical transaction was previously disputed.");
    }

    let daysPrior = null;
    if (txMs === null) {
      reasons.push("Invalid transaction date (expected YYYY-MM-DD).");
    } else {
      daysPrior = Math.floor((disputedMs - txMs) / MS_PER_DAY);
      if (daysPrior < MIN_DAYS) {
        reasons.push(`Too recent (${daysPrior} days prior; minimum is ${MIN_DAYS} days).`);
      } else if (daysPrior > MAX_DAYS) {
        reasons.push(`Too old (${daysPrior} days prior; maximum is ${MAX_DAYS} days).`);
      }
    }

    const matchedElements = tx ? getMatchedElements(disputed, tx) : [];
    const hasAnchor = matchedElements.some((el) => ANCHOR_ELEMENTS.has(el));

    if (matchedElements.length < 2) {
      reasons.push(
        `Only ${matchedElements.length} core element(s) matched (need >= 2 of IP, Device ID, Account ID, Shipping Address).`
      );
    }
    if (hasAnchor === false) {
      reasons.push("Missing mandatory anchor match (must match IP Address or Device ID).");
    }

    const candidateOk = reasons.length === 0;
    const record = {
      transaction_id: txId,
      date: tx ? tx.date : null,
      days_prior: daysPrior,
      matched_elements: matchedElements,
      candidate_valid: candidateOk,
      rejection_reasons: reasons
    };

    evaluations.push(record);
    if (candidateOk) {
      validCandidates.push(record);
    }
  }

  // Visa CE 3.0 requires at least 2 historical transactions sharing the SAME >=2 elements (including IP or Device ID)
  let qualifyingPair = null;
  let sharedElements = [];

  for (let i = 0; i < validCandidates.length; i += 1) {
    for (let j = i + 1; j < validCandidates.length; j += 1) {
      const a = validCandidates[i];
      const b = validCandidates[j];
      const intersection = a.matched_elements.filter((el) =>
        b.matched_elements.includes(el)
      );
      const hasSharedAnchor = intersection.some((el) => ANCHOR_ELEMENTS.has(el));
      if (intersection.length >= 2 && hasSharedAnchor) {
        if (intersection.length > sharedElements.length) {
          sharedElements = intersection;
          qualifyingPair = [a.transaction_id, b.transaction_id];
        }
      }
    }
  }

  const eligible = qualifyingPair !== null;
  const summaryReasons = [];
  if (eligible === false) {
    if (validCandidates.length < 2) {
      summaryReasons.push(
        `Found ${validCandidates.length} individually valid historical transaction(s); Visa CE 3.0 requires at least 2.`
      );
    } else {
      summaryReasons.push(
        "Valid historical transactions do not share the same >=2 matching elements (including IP or Device ID) across a pair."
      );
    }
  }

  return {
    eligible,
    disputed_transaction_id: disputed.transaction_id || "unknown",
    disputed_date: disputed.date,
    qualifying_pair: qualifyingPair,
    shared_elements: sharedElements,
    summary_reasons: summaryReasons,
    historical_evaluations: evaluations
  };
}

const SAMPLE_PAYLOAD = {
  disputed: {
    transaction_id: "ch_3Qx901",
    date: "2026-04-15",
    ip_address: "198.51.100.42",
    device_id: "dev_fp_88412a",
    account_id: "usr_77219",
    shipping_address: "742 Evergreen Terrace, Springfield, IL 62704"
  },
  historical: [
    {
      transaction_id: "ch_3Mo112",
      date: "2025-11-10",
      disputed: false,
      ip_address: "198.51.100.42",
      device_id: "dev_fp_88412a",
      account_id: "usr_77219",
      shipping_address: "742 Evergreen Terrace, Springfield, IL 62704"
    },
    {
      transaction_id: "ch_3Jk004",
      date: "2025-08-22",
      disputed: false,
      ip_address: "198.51.100.42",
      device_id: "dev_fp_99001b",
      account_id: "usr_77219",
      shipping_address: "742 Evergreen Terrace, Springfield, IL 62704"
    },
    {
      transaction_id: "ch_3Rp881",
      date: "2026-02-01",
      disputed: false,
      ip_address: "198.51.100.42",
      device_id: "dev_fp_88412a",
      account_id: "usr_77219",
      shipping_address: "742 Evergreen Terrace, Springfield, IL 62704"
    }
  ]
};

function printHumanReport(result) {
  console.log("Visa CE 3.0 (Reason Code 10.4) Eligibility Report");
  console.log("------------------------------------------------");
  console.log(`Disputed Transaction : ${result.disputed_transaction_id} (${result.disputed_date})`);
  console.log(`CE 3.0 Eligible      : ${result.eligible ? "YES" : "NO"}`);

  if (result.eligible) {
    console.log(`Qualifying Pair      : ${result.qualifying_pair.join(", ")}`);
    console.log(`Shared Core Elements : ${result.shared_elements.join(", ")}`);
  } else {
    for (const reason of result.summary_reasons || result.errors || []) {
      console.log(`Reason               : ${reason}`);
    }
  }

  console.log("\nHistorical Transaction Breakdown:");
  for (const item of result.historical_evaluations || []) {
    const status = item.candidate_valid ? "PASS" : "FAIL";
    console.log(
      `- [${status}] ${item.transaction_id} | Date: ${item.date} | Days prior: ${item.days_prior} | Matches: ${item.matched_elements.join(", ") || "none"}`
    );
    for (const r of item.rejection_reasons) {
      console.log(`    -> ${r}`);
    }
  }
  console.log("\nBuild a compressed Stripe/Shopify PDF packet: https://disputepack.pages.dev/builder");
}

function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes("--json");
  const useSample = args.includes("--sample");
  const fileArg = args.find((a) => a.startsWith("--") === false);

  if (useSample === false && fileArg === undefined) {
    console.log("Usage:");
    console.log("  node ce3_validator.mjs --sample [--json]");
    console.log("  node ce3_validator.mjs <path-to-dispute.json> [--json]");
    process.exit(0);
  }

  let payload;
  if (useSample) {
    payload = SAMPLE_PAYLOAD;
  } else {
    const raw = fs.readFileSync(fileArg, "utf8");
    payload = JSON.parse(raw);
  }

  const result = evaluateCe3(payload);
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printHumanReport(result);
  }

  process.exit(result.eligible ? 0 : 1);
}

main();
