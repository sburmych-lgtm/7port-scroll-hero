# 7PORT — Master UI/UX, Visual, Conversion & Accessibility Audit

**URL:** https://7port.ua/  
**Audit date:** 2026-09-17  
**Knowledge base:** WDI_KNOWLEDGE_PACKAGE_V2, edition 2026-09-05  
**Surface:** Homepage / desktop + mobile  
**Artifact status:** REVIEWED_SCOPE  
**Disposition:** **REMEDIATION_REQUIRED**  

> This is a synthesis of three supplied independent audits, two supplied screen recordings, the current live homepage crawl, and a separate WDI V2 critique pass. It is not a declaration of WCAG conformance, legal compliance, release approval, or measured conversion impact.

---

## 1. Executive conclusion

7PORT has a credible B2B foundation: the offer is understandable, the company shows real people, real cases, geographic reach, a service catalogue, FAQ, partners, contact data and a substantial amount of indexable subject-matter content. The site does **not** fail because it lacks substance. It underperforms as a digital sales surface because that substance is not prioritised into one disciplined decision path.

The main homepage currently behaves as several products at once: corporate presentation, service directory, lead-generation landing page and SEO content page. The visual system then amplifies that structural problem: the hero is a primary-content carousel; there are competing contact forms; the desktop uses multiple carousels for trust/proof; the mobile header consumes too much vertical attention; cases are not normalised into fast evidence units; the lower page becomes a long text-heavy SEO surface; and strong authentic assets are diluted by generic hero imagery and older-looking component patterns.

The most important remediation is therefore **not a cosmetic reskin**. It is to rebuild the hierarchy around one main B2B conversion path, while preserving the strong real-world evidence already present.

At the same time, the supplied technical audit reports material accessibility and implementation defects: keyboard-inaccessible dropdowns, missing visible focus, form labelling and error-announcement problems, pinch-to-zoom restriction, multiple contrast issues, a broken Binotel resource and a very heavy image payload. Those findings are high-value, but some of that audit's standards interpretation needs correction before it is treated as a conformance report.

**Recommended direction:** keep the brand identity and real proof, but rebuild the homepage structure, hero, forms, mobile header, trust placement, case presentation and core accessibility implementation. Do not start with a decorative redesign while the conversion and accessibility architecture remains unchanged.

---

## 2. Evidence used

### Supplied evidence

1. `technical-ui-a11y-audit.md` — supplied white-box technical / accessibility audit.
2. `7port-ux-usability-audit.md` — supplied WDI-style UX/usability audit.
3. `7port-ui-ux-audit-report.md` — supplied dual desktop/mobile heuristic/CRO audit.
4. Desktop recording: `...2026-09-17 11-28-24(1).mp4`, 1920×1040, ~60.4 s.
5. Mobile-emulation recording: `...2026-09-17 11-29-39(1).mp4`, 1920×1040 recording canvas, ~31.1 s; the browser emulation shown is iPhone 15 Pro Max 430×932.

### Independently re-observed in this synthesis

- Current live crawl of `https://7port.ua/` on 2026-09-17.
- Visual review of supplied desktop/mobile recordings and extracted contact sheets.
- Exact relevant WDI V2 rows in `07_RULES_CANONICAL.csv`, `08_RULES_OPERATIONAL.csv`, and `10_BLOCKED_AND_GAPS.csv`.

### Not independently re-run in this synthesis

- Lighthouse.
- Playwright/axe.
- Keyboard navigation.
- Screen reader behaviour.
- Actual form submission and success/error states.
- CrUX/RUM field Core Web Vitals.
- Canonical/robots/structured-data verification.
- Binotel, Meta Pixel or third-party request logs.

Where a technical fact comes from the supplied technical audit, it is labelled **SUPPLIED EVIDENCE**, not as a new run.

---

# 3. Audit-of-audits: what each report did well and where it breaks

## Audit A — `7port-ux-usability-audit.md`

### What is strongest

This is the strongest **holistic UI/UX document** of the three. It has the best scope discipline, separates confirmed observations from `NOT_RUN`, uses WDI IDs, and correctly identifies the central product problem: the homepage is trying to be corporate site + landing page + SEO surface simultaneously. It also correctly identifies the hero carousel, duplicated conversion mechanisms, desktop proof carousels, mobile density, case presentation and text-heavy lower section as the main experience issues.

Its best contribution is the structural diagnosis: the site has enough raw trust and content, but lacks a single primary path.

### What must be corrected

1. The proposed **“5-second test”** must not be treated as a canonical threshold. `GAP-0002` blocks any universal value-proposition comprehension-time threshold because the WDI source corpus contains conflicting 3 s / 5 s claims without a valid basis.
2. `CAN-0080` does **not** ban all carousels. It blocks carousels carrying **primary content on desktop**. Supplementary swipeable mobile galleries are outside the prohibition. Therefore partner/testimonial/case components should be classified by content importance before deletion.
3. The numeric 6.5/10, 4.5/10, 7/10 scores are professional judgement, not calibrated measurements. They should not drive priority.
4. “Put SEO text in an accordion” is an implementation option, not the core solution. The first choice should be content architecture: move intent-specific depth to service pages and keep homepage copy concise and scan-friendly. If accordion content is retained, crawler visibility and accessibility must be verified.

**Use in master audit:** primary structural/UX backbone, with the corrections above.

---

## Audit B — `technical-ui-a11y-audit.md`

### What is strongest

This is the strongest **technical evidence source**. It supplies concrete implementation observations rather than taste-level critique:

- Binotel script 404.
- Meta Pixel permission issue.
- `maximum-scale=1` viewport restriction.
- measured colour pairs and ratios.
- `outline: none` on menu controls.
- hover-only desktop dropdown behaviour.
- no Escape close/focus trap in mobile menu.
- missing skip link.
- form label/ARIA problems.
- `aria-hidden="true"` on validation tips.
- target-size measurements.
- missing intrinsic image dimensions.
- a reported 15.94 MB page payload, including 12.6 MB of PNG case imagery.

These are high-value remediation inputs.

### What must be corrected

1. The report treats **44×44 px as the WCAG minimum**. Under WDI's canonical `CAN-0043`, WCAG 2.2 SC 2.5.8 Level AA floor is **24×24 CSS px**, with criterion exceptions. WDI `CAN-0044` explicitly says the ~44 figure is a usability-oriented platform target in an unresolved unit and must not be presented as a WCAG requirement.
2. Therefore “77 interactive elements under 44×44 = WCAG failures” is **not valid as stated**. The raw measurements are useful, but the SC 2.5.8 assessment must be re-run against 24×24 CSS px and the criterion exceptions.
3. The contrast table often omits the required **text size class**. Under `CAN-0068` / `OPR-0098`, a 4.5:1 threshold applies to normal text and 3:1 to large text; every result must name the class. The 1.40:1 example is clearly below either text threshold; 3.62:1 and 3.03:1 require size/context classification before a precise conformance statement.
4. “15 images have no width/height, therefore they cause CLS” overstates causality. Missing dimensions create a **layout-shift risk**; actual CLS status requires measurement. `CAN-0035` requires field data at p75 over the stated window for the canonical threshold.
5. “Convert PNG to WebP and page becomes ~2 MB” is an estimate unless an actual before/after build was measured. The correct remediation is modern responsive image formats + sizing + remeasurement, not a promised output weight.
6. Lighthouse **SEO 100** is not “SEO is excellent.” It is a limited laboratory checklist. Canonical URL, robots, structured data, search intent coverage, crawl/render behaviour and field outcomes remain separate.
7. The report's “Agentic Browsing 50/100” score has no WDI canonical threshold and should not be used as a release or severity metric. The underlying semantic defects, such as missing `<main>`, remain worth fixing.

**Use in master audit:** use the raw technical observations; discard the incorrect 44 px conformance interpretation and any unverified causal/SEO conclusions.

---

## Audit C — `7port-ui-ux-audit-report.md`

### What is strongest

This report is useful as a **fast CRO / commercial spot-check**. It catches several concrete issues that the more structural audit underplays:

- generic CTA wording (`ДЕТАЛЬНІШЕ`, `НАДІСЛАТИ`);
- form burden;
- the potential contact/claim inconsistency;
- homepage under-signalling service breadth;
- value of real staff photography;
- value of authentic cargo/case photography;
- FAQ as objection handling.

The positive findings are directionally strong: real people and real proof are genuinely the best brand assets on this site.

### What must be corrected

1. Its “empty reviews” finding conflicts with the supplied desktop recording, where multiple testimonial cards are visibly loaded. The current live crawl contains the review heading but not testimonial text. This is therefore **not a confirmed permanently empty section**. It is better classified as an **intermittent/third-party rendering risk requiring verification and fallback**.
2. The report claims a `20 years` metadata statement conflicts with `15 years` on-page. The current crawl reviewed for this synthesis shows `15 years` on-page, but the supplied evidence here does not independently confirm a current `20 years` meta value. Mark this specific discrepancy `NEEDS_VERIFICATION`.
3. The CTA proposal **“Отримати розрахунок вартості за 15 хвилин”** introduces a time promise that is not established by supplied evidence. Do not publish it unless the business can operationally guarantee it.
4. “Expand to 8 service cards” is not necessarily better UX. The current homepage's two large cards represent the two core service families while the navigation contains many subservices. Eight equal cards would risk creating a new choice/density problem. Better: retain the two core categories and expose a compact list of high-intent subservices under them.
5. The report uses custom `Sev 4` / `Sev 3` without mapping to WDI's `CRITICAL / MAJOR / MINOR / NOTE`; the master audit therefore remaps severity based on scenario impact.

**Use in master audit:** keep its concrete CRO observations and positive brand findings; downgrade contradicted/unverified claims and reject invented time promises.

---

# 4. What is already good and should be preserved

## P-01 — Clear B2B domain and service proposition

The live homepage immediately communicates international logistics / customs clearance and explicitly targets ФОП and ТОВ. The current page also states delivery in 100+ countries, customs expertise and documentary support. This is a strong base for task clarity.

**Keep:** explicit B2B language and concrete service categories.

## P-02 — Real people are a strong trust asset

The team section names real staff and shows individual portraits. This gives the company more accountability than a generic logistics landing page.

**Keep, but improve:** retain named people; reduce the height/weight of the cards and connect expertise to service responsibilities or credentials.

## P-03 — Real cargo/case imagery is the strongest visual differentiator

The case set includes specific real shipments (e.g. generators, Toyota Hilux armoured glass, industrial cargo, seasonal trees). This is materially stronger than generic stock logistics photography.

**Keep and elevate:** move real operations photography earlier and make it the core visual language of the brand.

## P-04 — FAQ covers real pre-sale objections

The FAQ addresses complex customs cases, full import/export support, documents, customs timing and brokerage pricing factors. This content is relevant to high-intent prospects.

**Keep:** concise FAQ close to the final decision point.

## P-05 — Search-visible subject-matter content exists

The current crawl exposes significant logistics/customs text, headings and process content. This is a useful search-readiness foundation under `CAN-0032` / `CAN-0057`.

**Keep, but redistribute:** preserve crawlable expertise while moving deep intent-specific content to focused service pages.

---

# 5. Master findings

## F-01 · MAJOR · Hero carries primary content in a carousel

**Address:** homepage hero, desktop; mobile also affected.  
**Observed:** the hero rotates between at least two primary offers: customs clearance and international delivery. Both use the generic CTA `Детальніше`. The recordings show arrows/dots and changing hero content.

**Basis:** `CAN-0080` / `OPR-0112` — primary desktop content should not be carried by a carousel. `CAN-0011` — link/CTA text should describe destination/outcome.  
**Confidence:** confirmed.  

**Impact:** the first screen does not lock one main proposition or one main action. The user has to parse a rotating offer and then encounters a separate “Є запитання?” form immediately below/overlapping the hero boundary.

**Fix:** replace the hero carousel with one static primary proposition. Use one primary CTA with an outcome label, e.g. `Отримати розрахунок` or `Обговорити перевезення`, plus one secondary CTA such as `Переглянути кейси`. Keep service segmentation below the hero.

**Verification:** desktop/mobile visual review; inventory confirms no primary desktop carousel; CTA labels remain understandable out of context.

---

## F-02 · MAJOR · CTA language is low-information and generic

**Address:** hero (`Детальніше`), service cards (`Детальніше`), form (`Надіслати`).  
**Basis:** `CAN-0011`.  
**Confidence:** confirmed from live crawl and recordings.

**Impact:** the button describes interaction mechanics rather than the result. In a B2B logistics decision, the user benefits from knowing whether the click opens service detail, starts a quote, or contacts a specialist.

**Fix:** map labels to outcomes:

- Hero primary: `Отримати розрахунок`.
- Hero secondary: `Переглянути кейси`.
- Customs card: `Митне оформлення` / `Дізнатись про оформлення`.
- Logistics card: `Варіанти перевезення`.
- Form submit: `Надіслати запит на розрахунок`.

Do **not** add an SLA such as “за 15 хвилин” unless it is a true operational commitment.

**Verification:** each label communicates destination/outcome without needing surrounding copy.

---

## F-03 · MAJOR · Conversion architecture is duplicated and overlong

**Address:** mini-form after hero + large `Потрібно розрахунок?` form.  
**Basis:** `CAN-0016`, `OPR-0024`, `OPR-0025`.  
**Confidence:** confirmed.

**Observed:** the page has a lightweight contact form near the hero and a much larger quote form later. The current crawl shows fields for origin, cargo, name, email, destination, weight, phone, messenger selection, username/phone and message.

**Impact:** the page asks for contact intent in more than one way and the long first-contact form increases effort, especially on mobile.

**Fix — PROJECT_DECISION:** make one primary quote flow.

Recommended first step:

1. `Звідки → куди` (combined route field or two fields if operations require it).
2. `Що веземо / оформлюємо`.
3. `Телефон`.
4. `Ім’я`.

Optional/second-step: weight, email, messenger, detailed message, documents. Messenger should not be mandatory when phone is already mandatory unless there is a documented business reason.

Use the short hero-area mechanism as either a CTA that jumps/opens the quote flow or a true 2-field callback request — not as a competing third conversion model.

**Verification:** field-by-field justification against form purpose; mobile completion test; analytics of start/completion/drop-off after release.

---

## F-04 · MAJOR · Mobile header consumes too much of the first viewport

**Address:** mobile top contact/social bar + logo/burger + hero.  
**Basis:** `CAN-0075`, `CAN-0077`, `CAN-0100`, `CAN-0101`; professional judgement for hierarchy.  
**Confidence:** confirmed from supplied mobile recording.

**Observed:** phone, email, working hours and five social icons occupy a separate top region before the brand/navigation row. The hero then contains a multi-line headline, bullets, CTA and carousel dots.

**Impact:** the first mobile viewport spends substantial vertical space on utility/contact clutter before the primary business proposition. The page then becomes a long one-column sequence of large cards.

**Fix:** mobile header should contain logo + menu + one high-value contact action. Move social icons, hours and secondary contact details into the off-canvas menu/footer. Keep one visible call/quote action. Simplify hero copy.

**Verification:** 320–430 CSS px matrix; inspect at continuously varying widths; no content breakage and clear first-screen hierarchy.

---

## F-05 · MAJOR · Desktop keyboard navigation is reported as functionally incomplete

**Address:** header dropdowns, menu controls.  
**Basis:** SUPPLIED EVIDENCE from technical audit; WDI accessibility manual checks in `14_ACCESSIBILITY_PROTOCOL.md`.  
**Confidence:** supplied evidence; not independently re-run here.

**Reported defects:** hover-only dropdowns, `outline: none` on open/close controls, Escape does not close mobile menu, missing focus trap.

**Impact:** keyboard users may be unable to reach subservices or may lose orientation in the menu. This directly affects a core navigation path.

**Fix:** implement focus-visible styles; open submenu on keyboard interaction/focus as appropriate; support Escape; correct focus management and return focus to the trigger; verify no keyboard trap.

**Verification:** manual keyboard pass in open/closed menu states; Playwright + axe as support, not replacement for manual testing.

---

## F-06 · MAJOR · Form accessibility implementation is reported as broken

**Address:** quick form and quote form.  
**Basis:** SUPPLIED EVIDENCE from technical audit; `14_ACCESSIBILITY_PROTOCOL.md`.  
**Confidence:** supplied evidence; not independently re-run here.

**Reported defects:** missing explicit labels in the quick form, problematic `intl-tel-input`/label composition, validation tips hidden from assistive technology via `aria-hidden="true"`, missing skip link, viewport prevents pinch-to-zoom.

**Impact:** users of screen readers, keyboard navigation and zoom may not receive equivalent form semantics or error recovery.

**Fix:** explicit labels with programmatic associations; accessible phone control; error text tied to each invalid field and announced via appropriate live/error semantics; remove zoom-blocking viewport restriction; add bypass/landmark structure; re-test at 200% zoom and 320 CSS px reflow.

**Verification:** manual protocol: SC 1.3.1, 3.3.1, 3.3.2, 2.4.1, 1.4.4, 1.4.10, 4.1.2 as applicable. Final conformance remains a specialist/human determination.

---

## F-07 · MAJOR · Colour contrast has multiple reported failures or high-risk pairs

**Address:** form copy/error text/service CTA.  
**Basis:** SUPPLIED EVIDENCE + `CAN-0068` / `OPR-0098` / `OPR-0099`.  
**Confidence:** partial; raw ratios supplied, but text size class is missing for some results.

**Reported ratios:** 3.62:1, 1.40:1, 3.03:1 on specific pairs.

**Interpretation:**

- 1.40:1 is below AA text thresholds regardless of normal vs large classification.
- 3.62:1 may fail normal text but can meet the large-text 3:1 threshold; size class must be recorded.
- 3.03:1 is insufficient for normal text and only barely over the large-text/UI 3:1 floor if the element falls in that category; precise class/scope is required.

**Fix:** rebuild semantic colour roles for on-dark text, muted text, error and CTA states; target comfortable margin over the applicable threshold rather than edge values.

**Verification:** record every colour pair, text size class and WCAG 2.x ratio; do not substitute APCA for conformance reporting.

---

## F-08 · MAJOR · Review/social-proof state is inconsistent across evidence

**Address:** `Відгуки наших задоволених Клієнтів`.  
**Basis:** desktop recording + live crawl + Audit C.  
**Confidence:** confirmed discrepancy; root cause needs verification.

**Observed conflict:** Audit C reports a completely empty review container. The supplied desktop recording clearly shows several testimonial cards. The current text crawl exposes the review section heading but not the testimonial text.

**Interpretation:** this is not enough to claim “reviews are always empty.” It suggests one of: asynchronous/third-party rendering, intermittent failure, crawl invisibility, or different captured states.

**Impact:** social proof is trust-critical. If the widget fails, the page can show a large empty region at exactly the point intended to build confidence.

**Fix:** provide a stable first-party fallback (2–3 short attributed testimonials) or server-rendered testimonial content, and use third-party reviews as enhancement. Do not make the only trust proof depend on one external widget.

**Related rule:** `CAN-0019` / `OPR-0029` is a **WEAK design heuristic**: where social proof is used, placing it adjacent to a primary CTA is reasonable, but no conversion magnitude may be claimed.

**Verification:** test loaded, blocked-third-party and slow-network states; confirm the section never becomes an unexplained empty block.

---

## F-09 · MAJOR · Case studies are valuable but poorly normalised for scanning

**Address:** `Наш досвід` section.  
**Basis:** live crawl + desktop/mobile recordings; `CAN-0013`, `CAN-0077`, `CAN-0080` where the desktop carousel carries proof content.  
**Confidence:** confirmed.

**Observed:** many strong case titles exist, but the homepage packages them as carousel cards and the outcome structure is inconsistent.

**Impact:** users must read multiple long titles rather than instantly compare competence, route, complexity and result.

**Fix — PROJECT_DECISION:** show 3 top static case cards on desktop with a fixed schema:

- `Вантаж`.
- `Маршрут`.
- `Задача / складність`.
- `Результат`.

Use genuine figures only where documented. Send the full archive to `Наші проекти`.

**Verification:** case grid remains understandable without carousel interaction; outcomes are factually sourced.

---

## F-10 · MAJOR · Homepage has role conflict and a second “SEO page” after the main landing flow

**Address:** overall IA, especially content after FAQ.  
**Basis:** live crawl; `CAN-0013`; professional judgement for page-role conflict.  
**Confidence:** confirmed.

**Observed:** after the primary sections, the page continues with long sections covering company description, service categories, target clients, process, geography and reasons to choose 7PORT.

**Impact:** the homepage repeats concepts already communicated earlier and becomes visually/semantically long. On mobile this compounds the one-column scroll burden.

**Fix:** keep concise summaries on home and move intent depth to service/case pages. Preserve server-rendered/crawler-visible copy where search discovery matters (`CAN-0032`). Use informative headings, short paragraphs and front-loaded claims (`CAN-0013`).

**Do not:** treat “SEO” as a reason to keep redundant paragraphs, or assume hiding everything in accordions is the only solution.

**Verification:** content inventory maps every substantive paragraph to a user intent and route; no duplicated intent blocks without purpose.

---

## F-11 · MINOR · Homepage under-signals the breadth of subservices, but “8 equal cards” is not the right fix

**Address:** `Наші послуги`.  
**Basis:** current page shows two top-level cards while navigation lists international auto/air/sea/multimodal/rail, customs subservices, warehousing, consolidation, insurance, T1, guarantees, etc.  
**Confidence:** confirmed.

**Interpretation:** two core categories are not inherently wrong; they can be better than eight equally weighted cards. The issue is that users who do not open the complex menu may not see the breadth quickly.

**Fix — PROJECT_DECISION:** retain two dominant service families, but add 3–5 high-intent sublinks or compact chips inside/below each category. Link to full service indexes.

**Verification:** a user can discover the relevant service family without navigating a deep hover menu.

---

## F-12 · MINOR/CRAFT · Brand imagery is split between authentic proof and generic hero media

**Address:** hero versus team/case imagery.  
**Basis:** recordings; `CAN-0078` (WEAK design heuristic).  
**Confidence:** confirmed visual observation.

**Observed:** hero uses generic customs/logistics imagery while the strongest later content uses real team and real shipment photography.

**Impact:** the first screen looks more interchangeable than the actual company is.

**Fix:** art-direct real operations photography for the hero: real cargo, loading, customs/document workflow, warehouse or team-in-action imagery with consistent crop/treatment. Keep stock only where a real equivalent does not exist.

**Verification:** image set has a stated subject/crop/treatment logic and consistent brand purpose. No conversion effect should be claimed from the image change without measurement.

---

## F-13 · MAJOR · Supplied evidence indicates a very heavy image payload

**Address:** homepage performance.  
**Basis:** SUPPLIED EVIDENCE from technical audit; `15_PERFORMANCE_PROTOCOL.md`, `CAN-0034…0036`, `CAN-0040`.  
**Confidence:** supplied measurement; not independently re-run.

**Reported:** ~15.94 MB total uncompressed resources, ~12.6 MB PNG case imagery. Fifteen images are reported without explicit width/height attributes.

**Impact:** this is substantial performance debt and can harm loading experience, especially on mobile. However, it does **not** by itself prove a field CWV fail.

**Fix:** responsive source sizes, modern formats, explicit dimensions/aspect-ratio, lazy-load below-the-fold media, prioritise the true LCP image, remove duplicate/unused variants, compress case assets. Use actual before/after traces.

**Do not:** promise a specific post-conversion page weight or infer field LCP/CLS from file weight alone.

**Verification:** identical-condition Lighthouse before/after for diagnosis + CrUX/RUM p75 field data after release, mobile and desktop separately.

---

## F-14 · MINOR · Analytics/marketing instrumentation has a reported broken state

**Address:** Meta Pixel.  
**Basis:** SUPPLIED EVIDENCE from technical audit.  
**Confidence:** supplied evidence only.

**Reported:** Meta Pixel blocked by Traffic Permissions.

**Impact:** does not directly break usability, but can damage campaign attribution and prevent reliable measurement of remediation impact.

**Fix:** verify domain/traffic permissions and event delivery in the actual analytics stack. Do not prioritise this above broken user-facing conversion/accessibility paths.

**Verification:** event debugger/network confirmation in a controlled test session.

---

## F-15 · MAJOR / NEEDS_VERIFICATION · Contact/claim consistency has state drift

**Address:** header, forms, metadata/claims.  
**Basis:** supplied recording + live crawl + Audit C.  
**Confidence:** discrepancy confirmed, current root state not confirmed.

**Observed:** supplied desktop recording shows header phone `+38 067 643 1907`. The current live crawl during this synthesis exposes `+38 097 270 5050` at the top and again near the quick form/footer. Audit C reports a similar discrepancy but cites a different `067...` ending, so its exact number should not be trusted without recheck.

The current live copy states `15` years of customs experience. Audit C's specific `20 years in metadata` claim was not independently confirmed in this synthesis.

**Impact:** if multiple numbers or conflicting experience claims coexist in the production state, this weakens trust and can route leads incorrectly.

**Fix:** choose one canonical public phone per intended role, define whether alternate numbers are department-specific, label them explicitly, and synchronise structured/meta/on-page claims.

**Verification:** crawl + browser + structured-data/meta review in the same deployment version.

---

## F-16 · NOTE · Search foundation is better than “SEO score” suggests, but technical search verification is incomplete

**Address:** homepage search-readiness.  
**Basis:** current crawl + supplied technical audit + `CAN-0032`, `CAN-0057`.  
**Confidence:** partial.

**Positive:** substantial topic-specific content is present in the crawl, with headings, services, FAQ and process material.

**Limit:** the supplied `SEO 100/100` Lighthouse score is not a full SEO audit. Canonical URLs, robots, structured data, duplicates, indexation and rich-result eligibility were not independently verified in this synthesis.

**Fix:** preserve crawlable content while reducing homepage redundancy; create focused service pages and case pages; then run a separate technical search review.

---

# 6. Accessibility correction: how to reinterpret the “77 small targets” finding

The technical audit's raw element sizes are useful, but its threshold is not.

Under WDI `CAN-0043` / `OPR-0063`, WCAG 2.2 SC 2.5.8 Level AA floor is **24×24 CSS px**, with criterion-defined exceptions. WDI `CAN-0044` says the source's ~44 figure is a usability target in an unresolved unit and is not a WCAG requirement.

Therefore:

- Header phone `114×16`: height is below 24 → candidate SC 2.5.8 issue, subject to criterion exception analysis.
- Header email `89×16`: same.
- Social icons `34×34`: above 24 floor; they may still be ergonomically small, but are not automatically SC 2.5.8 failures.
- Burger `40×35`: above 24 floor.
- Close `40×40`: above 24 floor.
- Search `22×33`: width below 24 → candidate issue.
- Slider bullets `10×10`: target-size/spacing exception must be evaluated; cannot be declared a fail solely from visible dot dimensions.

**Required re-test:** measure the actual clickable target box in CSS px, not only the icon glyph, and check SC 2.5.8 exceptions. Treat larger 44-ish targets as a usability project target only if the project adopts that target explicitly.

---

# 7. Visual-system critique

## Hierarchy

The site has strong section separation, but too many components compete as “important”: hero copy, carousel controls, mini-form, large blue service panel, team cards, testimonials, partners, cases, large quote form and SEO copy. Relative importance is not consistently reflected through hierarchy.

**Action:** establish one page-level hierarchy: proposition → proof → service fit → process → case evidence → objection handling → conversion.

## Typography

The overall typographic language is legible at a glance, but much of the interface relies on bold white text over blue/dark photography, while navigation and utility text are small. Mobile long-form sections create visually dense reading.

**Action:** define a small, explicit type scale and use bold weight for hierarchy rather than making many unrelated blocks equally heavy. Treat `CAN-0069`/`CAN-0070` as readability preferences, not standards.

## Colour

The blue/white palette is coherent with the current brand and should be retained. The problem is not the brand hue; it is role inconsistency and some reported contrast failures.

**Action:** define semantic roles (`surface`, `surface-brand`, `on-surface`, `on-brand`, `primary`, `focus`, `error`, `muted`) and validate each state.

## Grid and spacing

Desktop sections alternate between dense blue blocks and large white gaps. Partner content has relatively low information density, while mobile cards create long vertical runs.

**Action:** one spacing scale, fixed container width behaviour, consistent section padding, and fewer “full-width coloured slab” sections.

## Components

Current buttons/cards do not read as one refined system. The visual treatment mixes gradients, dark cards, white cards, circular portraits and slider frames.

**Action:** one primary button family, one secondary/ghost family, one content-card shell with variants, one focus system, one border/radius strategy.

## Differentiation

The interface itself is visually generic corporate logistics, but the **content assets are not generic**. The design should derive differentiation from real cargo, actual people, actual routes and real problem-solving evidence rather than from additional decorative effects.

---

# 8. Recommended homepage architecture

**Status:** PROJECT_DECISION / proposed redesign direction.

## 1. Header

Desktop: logo, 4–5 top-level destinations, primary CTA `Отримати розрахунок`, phone as secondary utility.  
Mobile: logo, one contact/quote action, burger. Social, hours and secondary contacts inside menu/footer.

## 2. Static hero

**H1 concept:** `Міжнародні перевезення та митне оформлення для бізнесу`  
Supporting line: full shipment + customs/document support through one accountable team.  
Primary CTA: `Отримати розрахунок`  
Secondary CTA: `Переглянути кейси`

Trust strip: only verified claims such as `15+ років`, `100+ країн`, insured responsibility, named geographic coverage.

Use authentic 7PORT operations imagery.

## 3. “Яку задачу закриваємо”

Two dominant tracks:

- International delivery.
- Customs clearance.

Under each, compact high-intent links: auto / sea / air / multimodal; import / export / T1 / warehousing etc. Avoid eight equal cards.

## 4. Why 7PORT / proof

4 concise, verifiable statements. Avoid generic “quality/reliability” unless backed by concrete operational content.

## 5. Process

Turn the existing lower-page process copy into 4 visual steps. Use only true SLA/timing claims.

## 6. Cases

3 static outcome-led cards + `Усі проєкти`.

## 7. Team / accountability

Compact team module: key people + role + responsibility, not a long gallery of tall cards.

## 8. Social proof + partners

2–3 stable attributed testimonials and selected partner logos. Place part of this proof near the quote CTA. Third-party widget is enhancement, not the only content source.

## 9. FAQ

Keep 5–7 high-intent questions.

## 10. Final quote form

Short step-one form. Progressive disclosure for operational detail.

## 11. Footer

Canonical contacts, address, hours, service navigation, legal/privacy links, social links.

---

# 9. Remediation plan

## P0 — Fix immediately

1. Repair/remove broken Binotel integration.
2. Fix keyboard access, focus-visible, Escape and menu focus management.
3. Fix form labels, validation announcements, phone control semantics and zoom restriction.
4. Re-test contrast with text-size class recorded.
5. Re-run target-size assessment against 24×24 CSS px SC 2.5.8 floor + exceptions, not 44×44.
6. Verify and unify production phone numbers and experience claims.

## P1 — Conversion / page architecture

7. Replace hero carousel with static hero.
8. Replace generic CTA labels with outcome labels.
9. Consolidate conversion into one quote flow.
10. Simplify mobile header.
11. Rebuild cases as static proof cards.
12. Stabilise testimonial rendering/fallback.
13. Move proof closer to decision points.

## P2 — Visual system

14. Establish semantic colour roles and consistent component states.
15. Establish type/spacing/card/button systems.
16. Use authentic operations imagery in hero and high-value sections.
17. Reduce the number of full-width blue slabs and carousel frames.

## P3 — Performance/search/measurement

18. Optimise responsive images and dimensions; remeasure actual lab output.
19. Add field CWV plan (CrUX/RUM, p75, mobile/desktop separately).
20. Verify canonical/robots/structured data/indexation in a separate technical search pass.
21. Repair analytics attribution and define events: hero CTA, quote start, field-error, form complete, phone click, messenger click, case click.

---

# 10. Verification matrix

| Area | Current status | Required verification |
|---|---|---|
| Hero/IA visual critique | REVIEWED | After redesign, desktop/mobile visual checkpoint |
| Form field necessity | REVIEWED / remediation required | Field-by-field justification vs lead purpose |
| Keyboard navigation | SUPPLIED FAIL evidence | Manual keyboard re-run |
| Form screen-reader semantics | SUPPLIED FAIL evidence | Screen reader + axe/manual re-run |
| Contrast | SUPPLIED PARTIAL FAIL evidence | WCAG ratio + text size class per pair |
| Target size | SUPPLIED MEASUREMENTS / interpretation invalid | Re-run SC 2.5.8 at 24×24 CSS px + exceptions |
| Motion/reduced motion | NOT_RUN | Verify carousel/autoplay and `prefers-reduced-motion`; SC 2.2.2 where applicable |
| Performance lab | SUPPLIED summary only | Repeat Lighthouse under recorded conditions |
| Field CWV | NOT_RUN | CrUX/RUM p75, 28-day, mobile/desktop separately |
| Form submission | NOT_RUN | Error/success/retry states |
| Reviews failure state | INCONSISTENT EVIDENCE | Test normal, slow, blocked-third-party states |
| SEO technical | INCOMPLETE | canonical/robots/schema/indexation check |
| Analytics | SUPPLIED ISSUE | Verify Meta events in production test |

---

# 11. Final disposition

**REMEDIATION_REQUIRED** for the homepage scope.

The reasons are not aesthetic preference. Open `MAJOR` issues affect primary proposition clarity, lead capture, keyboard/form accessibility, mobile first-screen hierarchy, trust reliability and performance debt.

The site does **not** need to be thrown away. The strongest existing assets — brand recognition, real team, real cases, FAQ, service expertise, B2B positioning and search-visible content — should be preserved. The correct project is a **structured redesign/refactor**, not a decorative replacement.

No `ACCEPT_CANDIDATE` status is appropriate until the major interaction/accessibility issues are remediated and the relevant checks are re-run.

---

## Basis

**Basis:** `00_NAVIGATOR_AND_OPERATING_RULES.md`; `13_UIUX_CRITIQUE_PROTOCOL.md`; relevant sections of `04_KB_VISUAL.md`, `06_KB_CROSS_DOMAIN.md`; exact rows in `07_RULES_CANONICAL.csv` and `08_RULES_OPERATIONAL.csv`; `10_BLOCKED_AND_GAPS.csv`; `14_ACCESSIBILITY_PROTOCOL.md`; `15_PERFORMANCE_PROTOCOL.md`; `16_SEO_AI_READINESS.md`; supplied audits and recordings.  
**Verified in this synthesis:** current crawl structure/content, desktop/mobile recorded visual hierarchy, hero/carousel presence, dual form architecture, mobile header density, testimonial cards visible in supplied desktop recording, current crawl phone/content state, relevant WDI rules/gaps.  
**Not verified in this synthesis:** new browser accessibility run, actual form submission, field CWV, current Binotel/Meta network status, structured data/canonical/robots, current metadata `20 years` claim.

