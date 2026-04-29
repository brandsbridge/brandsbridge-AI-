═══════════════════════════════════════
TODO — Phase 2 (Backend Migration)
═══════════════════════════════════════

Trust Engine — Notes for Real Data:

1. Tier C tuning
   Current Tier C uses 4-9 months tenure,
   5-10 deals, and 3-4 docs to keep
   scores in the 65-72% range. When real
   signups arrive, brand-new companies
   (1-3 months tenure, 0-2 deals, 1-2
   docs) will compute to ~50-58%.

   Decision needed before Firestore
   migration:
   - Option A: Add "Provisional" badge
     for scores below 65%
   - Option B: Hide score until KYB
     verified (show "Pending Verification")
   - Option C: Require minimum onboarding
     completion before listing publicly

2. Pre-existing Company fields to remove
   - rating?: number  (deprecated by engine)
   - reviewCount?: number  (deprecated by engine)
   These will be removed in Step 4 when
   wiring BridgeCard and CompanyProfilePage
   to the engine.

═══════════════════════════════════════
