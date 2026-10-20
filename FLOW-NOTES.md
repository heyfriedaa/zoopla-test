# Buildwell Plus — new-introduction flow notes

## Flow structure (`deck-flow/index.html`)

Horizontal left→right flow, Klaviyo-style minimal nodes (title only, no icons).
Three swimlanes, all light grey:

1. **Homeowner** — context only: Buildwell listing page → Browse firms → Firm profile → Sends enquiry
2. **Firm (persona TBD)** — split into three sub-rows:
   - *Buildwell (web app)*: New query received → Homepage → (Homepage tile + badge / Notification bell) → Lands on Introductions tab → Change status → Contacted
   - *Mobile app (TBC — no app today)*: App notification
   - *Outside Buildwell*: Email to registered address\* → Opens email → CTA "View introduction"\* → (back into web app) / Calls the customer
3. **Back-end & metrics** — no connecting arrows; hovering a metric highlights its whole column:
   - `query received` → enquiry + new query
   - `query opened` → email, app notif, homepage, tile, bell, open, CTA
   - `query responded` → change status + contacted + calls customer

## Top journey labels

Three pills spanning all lanes: **Initial query** · **Alert** · **Respond**.

## Visual language

- **Solid arrow** = user interaction · **dashed arrow** = system push (query → homepage / app notification / email)
- **Magenta outline** = new element: Homepage tile + badge, Notification bell, Change status, Email\*, CTA\*
- `*` = assumed not built for firms yet (footnote in hover detail)
- **Amber dashed** = TBC / to validate (App notification)
- **Dashed group outline** around Change status + Calls the customer = "query responded" hypothesis — firms may triage/prioritise the call here; out of scope for this ask
- **Change status ⇄ Calls the customer** is a straight, two-way arrow — ordering unknown
- **Email CTA** deep-links straight to the Introductions tab (row highlighted), not the homepage
- **Hover** a node → everything else dims; footer panel shows a screen-preview placeholder + link to the prototype screen (only for nodes with a linked screen)

## Decisions still open

- Who in the firm handles intros (shared login — whoever sees it first)
- Whether "marked Contacted" = response (assumption being validated)
- Whether a mobile app / push channel is wanted (panel question)
