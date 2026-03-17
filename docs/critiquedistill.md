Priority Issues

  1. Dashboard stat cards are textbook AI slop

  What: Six identical cards — uppercase label, big number, right-aligned icon — repeated in a uniform row. Below them, four identical Quick Action cards. This is the #1
   pattern flagged in the anti-patterns guide.

  Why it matters: The dashboard is the most important screen. Coaches open this under time pressure to understand team status. But nothing is prioritized — "Players:
  25" gets the same visual weight as "Record: 14-12," even though the record is far more time-sensitive and actionable. The coach's eye has nowhere to land first.

  Fix: Break the grid. Make Record the hero element (larger, bolder, with win streak context). Demote static counts (Players, Charts) to inline text. Kill the Quick
  Actions section entirely — those are sidebar links repackaged as cards. Use the recovered space for something useful: next game countdown, recent performance trend,
  or a roster alert.

  Command: /impeccable:distill to strip the dashboard to essentials, then /impeccable:bolder to give the surviving elements real hierarchy.

  ---
  2. Zero visual rhythm — everything has the same spacing

  What: Every gap is gap-4 or gap-6. Every card has the same padding. Every section has the same margin. The eye slides across the page without anchoring anywhere.

  Why it matters: Without rhythm — tight groupings contrasted with generous separations — there's no visual breathing. The interface feels monotonous. Related items
  don't feel grouped, and distinct sections don't feel separated. It reads like a spreadsheet, not a designed experience.

  Fix: Tighten spacing within related groups (e.g., game list items should be closer together). Add more generous separation between sections (the jump from stat cards
  to game lists needs a stronger break). Use varied padding — the game list cards can be tighter than the stat overview area.

  Command: /impeccable:polish for systematic spacing pass.

  ---
  3. Inter is the wrong font for "Modern, Sharp, Elite"

  What: Inter is the primary font. It's functional, legible, and completely unremarkable. The anti-patterns guide explicitly calls it out as overused. Manrope is
  available as a secondary font but doesn't appear to be used anywhere visible.

  Why it matters: Typography is the single largest contributor to perceived design quality. Inter says "we didn't choose a font" — it's the default of defaults. For a
  brand that wants to feel elite and sharp, this is a missed opportunity. You wouldn't see Linear or Notion using Inter for their primary UI font. (Linear uses their
  own Inter fork with tighter metrics; Notion uses a custom typeface.)

  Fix: Either switch the primary body font to Manrope (which is already loaded and has more personality — geometric with distinctive round terminals), or consider a
  font with more character for headings while keeping Inter for data-dense tables. At minimum, introduce more weight variation — the current UI barely distinguishes h1
  from body text.

  Command: /impeccable:normalize to audit and standardize the type scale.

  ---
  4. Games page is a raw data dump

  What: The Games page is two unstyled tables (Upcoming, Previous) with raw columns: ID, Opponent, Date & Time, Venue, Score, Result. No visual hierarchy. The ID column
   wastes space. Win/Loss results are tiny text badges lost in the table.

  Why it matters: This is the operational heart of the app — coaches plan around the game schedule. But the "next game" (Santa Fe, Mar 19) gets no more emphasis than a
  game 6 weeks away. There's no sense of urgency, no countdown, no opponent context. The Previous table shows 28 games in a flat list with no summarization.

  Fix: The next 1-2 games should be a highlighted hero card above the table with opponent details, countdown, and venue. Hide the ID column (it's internal data, not
  user-facing). Add color-coded result indicators that are visible at scan-speed (background tint on rows, not just a tiny badge). Consider a win/loss streak indicator.

  Command: /impeccable:colorize for the results table, /impeccable:bolder for the next-game treatment.

  ---
  5. Player detail stat grid repeats the hero metric anti-pattern

  What: The "This Season" section in the player detail shows 7 bordered boxes (GP, AVG, AB, H, HR, RBI, OBP) each with a small label and big number. Same pattern as the
   dashboard stat cards.

  Why it matters: These stats are not equally important. A coach scanning a player's season cares about AVG, OBP, and HR — not AB (which is contextual). Giving them
  equal weight forces the coach to read all 7 to find what they care about. Also, the bordered boxes create visual noise — cards-inside-cards.

  Fix: Drop the borders. Make AVG the dominant number (largest, boldest). Show supporting stats (HR, RBI, OBP) at normal text size on one line. Move raw counts (GP, AB,
   H) to the Stats tab below. The summary should be a summary, not a miniature stat table.

  Command: /impeccable:distill to reduce the stat summary to essentials.

  ---
  Minor Observations

  - "Welcome back, System" — the greeting uses the admin role name, not a person's name. "Welcome back" is also generic filler. Consider dropping the greeting entirely
  and leading with the team name + record.
  - Opponent logos are inconsistent — some game rows show team logos, others show blank space. The missing-logo fallback should be a neutral placeholder, not empty.
  - The "Conf" badge on upcoming games is cryptic — first-time users won't know it means conference game. Consider spelling it out or using a tooltip.
  - B/T column shows "—" for every player — if no data is populated, consider hiding the column entirely rather than showing 25 dashes.
  - Light mode background is distinctive (the warm Alabaster with subtle blue radial gradients) — this is actually more visually interesting than the dark mode and
  could be the default.
  - AI Coach empty state is decent but the robot icon is generic. A coaching-specific illustration or just the brand mark would be more aligned.

  ---
  Questions to Consider

  - "What if the dashboard were just 3 things?" Record + next game + a single insight (e.g., "3-game win streak" or "pitching staff ERA trending down"). What would you
  cut?
  - "Does this need to feel this uniform?" Every page follows the exact same layout: heading + subtitle, then content. What if the dashboard broke the mold — no
  heading, just the data?
  - "What would a confident version of this look like?" Right now it hedges — everything gets equal space, equal weight, equal treatment. A confident design says
  "Record: 14-12 matters more than Charts: 2" and shows it.
  - "Is dark mode earning its keep?" The light mode actually feels more distinctive. Dark mode is the safe choice for dev tools, but this is a sports app used by
  coaches — would bold type on a light field feel more energetic?

  ---
  ★ Insight ─────────────────────────────────────
  The most common design mistake in data-heavy apps isn't ugliness — it's equal weighting. When everything is the same size, the same color, the same spacing, the user
  has to do all the cognitive work of deciding what matters. Great data design is opinionated: it says "here's what changed" and "here's what needs your attention"
  through visual hierarchy, not through labeling everything the same way. The dashboard's 6 identical stat cards are the clearest example — they treat a static player
  count the same as a dynamic season record.
  ─────────────────────────────────────────────────
