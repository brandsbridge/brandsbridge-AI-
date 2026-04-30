import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

// Optional fields on Inquiry docs (buyerCompany, supplierUid, etc.)
// arrive as undefined when callers don't provide them. Without this
// setting, firebase-admin throws on undefined values.
getFirestore().settings({ ignoreUndefinedProperties: true });

setGlobalOptions({
  region: "us-central1",
  maxInstances: 10,
});

export { generateInquiryDraft } from "./functions/generateInquiryDraft";
export { sendInquiry } from "./functions/sendInquiry";

// Stage 7 will add:
// export { markInquiryReplied } from "./functions/markInquiryReplied";
