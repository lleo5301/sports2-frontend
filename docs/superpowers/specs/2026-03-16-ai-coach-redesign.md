# AI Coach — Redesign Spec

**Date:** 2026-03-16
**Status:** Draft
**Scope:** Address four structural design problems in the AI Coach interface identified in the 2026-03-16 design critique: the chat-metaphor UI pattern, missing post-conversation workflow, generic visual language, and developer metadata leaking to coaches.

---

## 1. Problem

The current AI Coach interface is a functional ChatGPT/Claude.ai clone. It works, but it carries all the wrong connotations: it looks like a consumer chatbot, produces no durable work product, surfaces developer metadata to coaches, and uses a visual language indistinguishable from every other AI feature shipped in 2024–2025.

This undermines the core emotional goals of the product — confidence, authority, and trust — precisely where they matter most. A coach opening the AI Coach feature should feel like they're sitting down with a knowledgeable analyst. Currently they feel like they opened Discord.

Four specific problems to solve:

1. **The chat metaphor is the wrong container** for structured coaching analysis. Conversations scroll off, data gets buried, the output format is undifferentiated prose.
2. **There is no post-conversation workflow.** The AI says something important; the coach has nowhere to put it. Insights exist as a separate feature with no connection to chat.
3. **The interface is indistinguishable from a generic AI product.** Bot icons, rounded bubbles, bouncing dots, 2×2 card grids — all recognizable AI slop tells.
4. **Developer metadata (token counts, model names) appears in the coach's workflow,** signaling "infrastructure" instead of "expert tool."

---

## 2. Goals

1. Replace the PromptGallery empty state with a domain-specific entry point that conveys coaching authority and surfaces team-relevant context on first open.
2. Add an inline save-to-insights action on assistant messages — connecting the chat and insights workflows without requiring navigation.
3. Replace the generic chat bubble visual treatment with a response format that privileges structure: a dominant lead finding, supporting stats at secondary weight, prose at tertiary.
4. Remove token counts and model name badges from all coach-facing surfaces.
5. Add a lightweight data confidence/recency signal to assistant responses in place of developer metadata.
6. Remove the "Bot" icon and "AI Coach Assistant" heading from the PromptGallery. Replace with product-branded copy that implies expertise rather than capability.

---

## 3. Non-Goals

- Replacing the chat input/streaming model — the underlying interaction stays the same.
- Rebuilding the conversation sidebar layout (double-sidebar problem is a layout concern; tracked separately as a responsive/adapt task).
- Adding inline data visualizations (hot/cold zones, depth chart renderings) — Phase 2.
- Game prep export / briefing compilation — Phase 2.
- Changing the Insights page structure — only the connection *from* chat *to* insights is in scope.

---

## 4. Design Decisions

### 4.1 PromptGallery — Remove AI Slop Signals

**Current:** `Bot` icon in `bg-primary/10` circle → "AI Coach Assistant" → "Get insights about your team, players, and strategy" → 2×2 card grid with ghost "Use" buttons inside clickable cards.

**Changes:**

- Remove the `Bot` icon circle entirely. Replace with a brief identity mark — the app's logo icon or a diamond/baseball-specific icon — at smaller size and lower visual weight. This is not a hero moment; it's a wayfinding element.
- Change the heading to **"Ask your coaching staff anything"** or similar product-voice copy. No word "AI," no word "Assistant." The feature is branded as a capability of the platform, not as an LLM integration.
- Remove the subtitle — it's filler. The prompt cards explain the feature better than a sentence does.
- Remove the ghost "Use" / "Ask" `<Button>` from inside each prompt card. The card is the affordance. The button creates confusion about whether the two clicks do different things. Delete `CardContent` containing the button from `PromptGallery`.
- Consolidate: whole card is clickable, no nested interactive element. On hover: `bg-accent` background shift + a subtle `→` or send icon appearing at card top-right to confirm the card is the action.

### 4.2 Response Format — Lead Finding Treatment

**Current:** All assistant messages render as `bg-muted rounded-2xl px-4 py-2.5` with prose-sm Markdown inside. User messages render as `bg-primary text-primary-foreground rounded-2xl`. Both use the same container shape and size. There is no visual hierarchy between a one-line answer and a 500-word analysis.

**Problem:** Coaching decisions require fast scanning. The most important finding should be visible at a glance; supporting context should recede. Flat bubbles give everything equal weight.

**Changes:**

Assistant messages should drop the chat-bubble container shape for multi-sentence responses. Specifically:

- Remove `rounded-2xl` and `bg-muted` from the assistant message container.
- Instead: no background on the message container itself. Use left-border treatment (`border-l-2 border-primary/30 pl-4`) to mark AI responses without boxing them.
- Keep `rounded-2xl bg-primary text-primary-foreground` for user messages — the asymmetry now reads as "you asked / here is the analysis" rather than "two people chatting."
- The Markdown renderer already handles `##` and `**bold**` — instruct the AI system prompt (backend concern) to lead with a bolded key finding. The frontend should apply `prose-sm` with `[&>p:first-child]:text-base [&>p:first-child]:font-medium` to give the first paragraph slightly more weight than body copy.

This is a small CSS change with significant perceptual impact. The response area stops feeling like a chat bubble and starts feeling like a document.

### 4.3 Inline Save-to-Insights Action

**Current:** No connection between a chat message and the Insights feature. A coach must navigate to `/ai-coach/insights`, click "Generate Insight," pick a category, and write a prompt — a 4-step detour.

**Change:** Add a save action to assistant messages in `MessageBubble`.

**Implementation:**

In `MessageBubble`, for `role === 'assistant'` messages (not `tool_call`/`tool_result`), add a hover-revealed action bar below the message content:

```tsx
// Below the prose content, inside the message container
<div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
  <button
    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    onClick={() => onSaveInsight(message)}
  >
    <Pin className="size-3" />
    Save as insight
  </button>
</div>
```

The parent `div` in `MessageBubble` gains `group` class. The `onSaveInsight` prop is optional — when absent (e.g. during streaming), the action bar doesn't render.

**Save behavior:** Clicking "Save as insight" opens an inline popover (not a full dialog) with:
- Pre-filled title from the first line of the message content (truncated to 60 chars)
- Category select (same 7 options as `InsightsPanel`)
- A "Save" button that calls `POST /api/ai/insights` with the message content as `content`

The popover dismisses on save. A brief `✓ Saved to Insights` toast confirms the action.

**`ChatPanel` change:** Pass `onSaveInsight` down to `MessageBubble`. The hook logic (calling `aiApi.createInsight`) lives in `useInsights` and is already implemented — just need to call it from chat context.

### 4.4 Remove Developer Metadata

**Token count badge** (`message-bubble.tsx:68-74`):

```tsx
// DELETE THIS BLOCK ENTIRELY
{message.role === 'assistant' && message.tokens_used && (
  <div className='mt-1.5 flex justify-end'>
    <Badge variant='secondary' className='text-[10px]'>
      {message.tokens_used.toLocaleString()} tokens
    </Badge>
  </div>
)}
```

Token data is retained in the message object (it may be used for admin/usage analytics elsewhere) — just remove the render.

**Model name badge in ConversationList** (`conversation-list.tsx:128-134`):

```tsx
// DELETE THIS BLOCK ENTIRELY
<Badge variant='secondary' className='px-1 py-0 text-[10px]'>
  {convo.model.replace('claude-', '').split('-')[0]}
</Badge>
```

The secondary line in each conversation item then shows only the time-ago timestamp — cleaner and coach-relevant.

### 4.5 Data Confidence Signal (replaces token badge)

Token counts answered "how much computation happened." What a coach actually needs to know: "how good is this answer?"

Add a lightweight recency/confidence indicator to assistant messages. This does not require a new API field — it can be derived from tool call metadata already present in the message thread.

**Signal logic (frontend-derivable):**

After a response, look at the preceding `tool_call`/`tool_result` messages in the thread:
- If tool calls include `get_game_boxscore` or `get_play_by_play` → response is grounded in game data.
- If tool calls include `search_players` or `get_player_stats` → grounded in current roster data.
- If no tool calls preceded the response → response is from model knowledge only (no live data).

**Render:** In place of the token badge, show a single small indicator:

```tsx
// Data grounded in live team data
<span className="text-[10px] text-muted-foreground flex items-center gap-1">
  <Database className="size-2.5" />
  Live data
</span>

// No tools called (model knowledge only)
<span className="text-[10px] text-muted-foreground flex items-center gap-1">
  <Info className="size-2.5" />
  General knowledge
</span>
```

This replaces "14,203 tokens" (means nothing to a coach) with "Live data" (means everything). Implementation requires `ChatPanel` to pass tool context down to `MessageBubble`, or derive it inside the component from surrounding messages.

---

## 5. Navigation Fix — Tabs on All AI Coach Pages

**Current:** Tab navigation (Chat / Insights / Settings) only appears on the Insights and Settings pages. The main Chat view (`index.tsx`) has no tab bar — a coach who lands on `/ai-coach` directly has no indication that Insights or Settings exist.

**Fix:** Extract the tab bar from `insights-page.tsx` into a shared `AiCoachTabs` component and render it in `index.tsx` as well. The tabs sit at the top of the `<Main>` wrapper, above the chat layout.

Since `index.tsx` uses `<Main fixed fluid className='p-0'>` (full-height, no padding), the tab bar needs to be inserted inside `<Main>` before the flex layout div:

```tsx
// index.tsx — add above the flex layout
<div className="border-b px-4 pt-3 pb-0">
  <AiCoachTabs />
</div>
<div className='flex h-[calc(100vh-theme(spacing.16)-41px)]'>
  ...
</div>
```

The height calculation adjusts for the tab bar height (~41px).

---

## 6. File Changelist

| File | Change |
|------|--------|
| `components/chat-panel.tsx` | Pass `onSaveInsight` to `MessageBubble`; adjust streaming container to remove `rounded-2xl bg-muted` |
| `components/message-bubble.tsx` | Remove token badge; remove `rounded-2xl bg-muted` from assistant container; add `group` class + hover save action; add data confidence signal |
| `components/conversation-list.tsx` | Remove model name `Badge` from conversation items |
| `components/prompt-gallery.tsx` | Remove `Bot` icon circle hero; update heading copy; remove inner `<Button>` from cards; add `→` hover affordance to cards |
| `components/insights-panel.tsx` | No changes (Insights page unchanged) |
| `index.tsx` | Add `AiCoachTabs` component above chat layout; adjust height calc |
| `insights-page.tsx` | Extract tab bar to shared `AiCoachTabs` component |
| `settings-page.tsx` | Use shared `AiCoachTabs` component |
| `components/ai-coach-tabs.tsx` | **New file** — shared tab navigation component |

---

## 7. Out of Scope for Now — Phase 2

These came up in the critique but are too large for this pass:

- **Briefing model** — replacing the scrolling thread with a document-style response layout. This requires backend changes (structured response format) alongside frontend.
- **Game prep export** — "compile to brief" action on a conversation. Needs a design pass on the output format.
- **Inline data visualizations** — rendering depth charts, split breakdowns, or schedule tables inline in responses. Requires component integration with streaming.
- **Double-sidebar layout** — collapsing `ConversationList` into a drawer/sheet pattern. Tracked as an `/adapt` task separate from this spec.
- **Decision log** — connecting AI reasoning to roster/lineup decisions as a durable record.
