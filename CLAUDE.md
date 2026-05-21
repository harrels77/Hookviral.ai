@AGENTS.md

# HookViral — Vision produit & roadmap

## Positionnement
HookViral n'est PAS un simple générateur de hooks. C'est une **suite d'optimisation de la rétention pour créateurs de short-form** (TikTok / Reels / Shorts).
On ne vend pas une feature ("génère des hooks"), on vend un résultat : **"répare les 3 premières secondes de tes vidéos"**.
Le générateur gratuit est la **porte d'entrée d'acquisition**, pas le produit final.

## Principes directeurs
- **Pas d'auth prématurée.** localStorage couvre historique/favoris. Comptes + DB seulement quand il y a un tier payant à protéger. Le "no login" est un avantage compétitif — le garder le plus longtemps possible.
- **Rate-limiting serveur AVANT tout lancement public payant.** Les crédits localStorage ne protègent pas la clé API.
- **Le moat = SEO programmatique + corpus de patterns possédé**, pas une base de hooks curée à la main.
- **Niche modes = presets de prompt** qui alimentent aussi les pages SEO. Une construction, deux bénéfices.
- **Honnêteté** : ne jamais sous-entendre qu'on mesure la rétention vidéo réelle. Aucune fausse stat, aucun faux témoignage.
- **Soustraction > addition** : chaque ajout doit justifier sa charge cognitive. Defaults > knobs.
- Modèle Anthropic Claude (pas OpenAI/Gemini). Modèle le plus récent disponible (`claude-sonnet-4-6` actuellement).

## Roadmap

| Phase | Focus | Statut |
|---|---|---|
| **0** | Générateur qui marche, rate-limit IP, fuite crédits corrigée | ✅ done |
| **1** | Repositionnement rétention, Hook Analyzer autonome | ✅ done |
| **2** | Niche modes, pages SEO programmatiques, Trends (Google + YouTube) | ✅ done |
| **3** | Rewrite engine, monétisation Stripe | ⏸️ Rewrite ✅ / Stripe **reporté** (décision user 2026-05-18) |
| **4** | Comptes utilisateurs, workspace persistant, analytics | Non démarré |

**Stripe / monétisation : REPORTÉ jusqu'à Phase 4.** Pré-requis : comptes users → rate-limiting durable (Upstash en place) → entitlement serveur → Stripe (compte + clés + priceId fournis par user). Tant que Stripe n'existe pas, `isPro()` retourne `true` pour tout le monde (cf. État actuel).

## Beachhead & moat
- **Marché-beachhead = chaînes faceless / automation** (gros volume, mindset outil/ROI, rétention = revenu direct, peu servi par vidIQ).
- **Anti-clone** : pas les features (Analyzer copiable) mais (1) appropriation niche faceless, (2) corpus de patterns curé qui se compose avec l'usage, (3) SEO programmatique niche.
- **Contrainte honnête** : pas d'accès gratuit aux vraies données de rétention/performance par vidéo. Le score reflète la *vraisemblance structurelle* d'arrêter le scroll, pas une mesure de tes vidéos passées.

---

## État actuel (2026-05-21)

### La boucle visible
Le produit est **un système, pas un tas**. Quatre surfaces dans l'ordre : **Trends (Discover) → Generator (Create) → Analyzer (Diagnose & fix) → Patterns (Learn)** → retour Generator. Le composant `components/NextStep.tsx` rend cette boucle visible en bas de chaque page de la boucle + en mode "outside-loop" sur les pages d'entrée (SEO niches, History, why-it-works) pour éviter les dead-ends.

### Vocabulaire commun : 9 attention patterns
`lib/patterns.ts` — taxonomie possédée. Chaque hook (generated, decoded, analyzed) est tagué avec ses `patternsUsed` (whitelist serveur contre `HOOK_PATTERNS`). Les chips de patterns sont visibles sur les cartes du Generator et les angles du Decode Trends, et linkent `/patterns#<id>`. **Même langue end-to-end.**

### Surfaces
- **Home** (`app/page.tsx`) — 5 sections : Hero · How-it-works (4 cartes YOU DO/YOU GET) · `HomeAnalyzeWidget` (paste→score réel inline via `/api/analyze`) · Email capture · Final CTA. Pas de FAQ, pas de typing demo, pas de Features grid, pas de testimonials.
- **Generator** (`app/generator/page.tsx`) — Topic + Generate visibles. Platform/Tone/Niche/Goal sous `<details>More options ▾</details>`. Crédit bar `hv_credits` (10/j localStorage). 8 hooks scorés avec `patternsUsed` chips + bouton "Deep retention analysis →" → `/analyzer?hook=`. Le bouton Script ▶ génère vraiment (gating Pro inactif).
- **Analyzer** (`app/analyzer/page.tsx`) — Hook + Analyze visibles. Platform/Niche sous `<details>More options ▾</details>`. Test 3s live sous l'input (heuristique 3.3 mots/s). Score + sub-scores + why + weak points + patterns used/missing (chips → `/patterns#<id>`). Rewrite engine : 5 styles + "Or fix a missing pattern" (rewrite ciblé par pattern manquant — le différenciant le plus fort, 12→84 vérifié). Before/After score + delta par variante. Prefill via `?hook=&platform=&niche=` + auto-run.
- **Trends** (`app/trends/page.tsx`) — Liste + keyword filter + refresh visibles. Source (Google/YouTube) + Geo (US/FR/UK/CA/ES/DE) + Niche sous `<details>Filters ▾ (état affiché dans summary)</details>`. Velocity badges (🔥 Rising / ⚡ Steady / 📉 Cooling / 🆕 New) + sparkline d'historique de rang quand Upstash configuré et ≥3 snapshots. Decode → angles (why + 3 angles niche scorés + chips patterns + news/evergreen badge) + faceless brief par angle.
- **Patterns** (`app/patterns/page.tsx`) — Hub : chaque pattern a "✦ Analyze a hook for this" + "⚡ Generate hooks like this". Anchors `#<id>` ciblées par les chips Analyzer.
- **Start here** (`app/why-it-works/page.tsx`) — Guide plain-language : 4 outils × (What does it / When to use / Why it works) en 1 ligne chacun. Remplace l'ancien article méthodologie scientifique. URL conservée pour les liens entrants existants.
- **Pages SEO** : `/hooks-for/[niche]` (exemples evergreen) + `/trends/[niche]` (live + JSON-LD FAQPage/ItemList + contenu evergreen). Cross-linkées. Toutes deux ont NextStep en outside-loop.
- **History** (`app/history/page.tsx`) — Sessions Generator sauvegardées localStorage. Chaque hook a "✦ Improve →" vers Analyzer prefill. Empty state → Trends.
- **Pricing** — 5 puces Free / 5 puces Pro. Trust note : "Same AI on both plans. Pro = unlimited."

### Nav
`Home · Trends · Generate · Analyze · Patterns · Pricing · History` — flat, ordre du workflow. "Start Free →" CTA → `/generator`.

### État Pro (pré-monétisation)
`lib/plan.ts` : **`isPro()` retourne actuellement `true`** (commentaire explicatif dans le fichier). Conséquence : Script generator, rewrite 5 styles × 3 variantes, decode illimité, faceless brief — tout débloqué. Tous les locks/badges/teasers Pro ne rendent jamais via les conditionnels `!isPro()`. Le code de gating est intact ; ungate-by-default = une seule ligne à reflipper quand Stripe arrive (`localStorage.getItem("hv_plan") === "pro"`).

### Préférences cross-page
`lib/prefs.ts` (localStorage `hv_niche` / `hv_geo`) — Trends + Analyzer hydratent et persistent. Generator a sa propre liste niche legacy non-NICHE_MODES, non refactorisée (deep-links `?niche=` continuent de fonctionner).

### Infra durable
`lib/upstash.ts` (REST fetch, zéro dépendance npm) + `lib/rateLimit.ts` async sliding-window. **Inactif tant que `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` absents de `.env.local`** → fallback in-memory. Active automatiquement quand les clés sont présentes. Mêmes clés alimentent `/api/subscribe` (capture email → `SADD hv:subscribers` + `HSET hv:subscriber_meta`, 503 honnête si non configuré) et `computeVelocity` (snapshots de rang trends).

### Branding
HV monogram (geometric H + V dans le gradient brand) — `components/Logo.tsx` + `app/icon.svg`.

---

## Trous restants honnêtes (forward-looking)
- **Generator niche-aware** : liste niche legacy à migrer vers `NICHE_MODES` pour partager les prefs avec Trends/Analyzer. Non urgent.
- **History incomplète** : capture seulement les sessions Generator, pas les Analyzer + Rewrite (résultats 84/+72 perdus). Nécessite store persistant (Phase 4).
- **Enforcement Pro serveur** : aujourd'hui c'est soft-gating client uniquement. Quand Stripe arrive (Phase 4) → entitlement check sur chaque route Pro avant Claude call.
- **Témoignages** : aucun (les faux ont été retirés). À remplacer par de vrais quand ils arrivent.
- **TikTok trending** : aucune source officielle gratuite fiable. Approche honnête retenue : Google/YouTube comme proxys + l'utilisateur peut coller un trend TikTok repéré dans Decode.

## Dette technique
- `hv_credits` (Generator) pas migré vers `lib/plan.ts` — deux compteurs quotidiens coexistent (`hv_credits` + `hv_free_decode`). Pas bloquant.
- Logique de crédits dupliquée entre `generator/page.tsx` et `lib/credits.ts` (la lib n'est pas utilisée).
- `lib/prompt.ts` non importé (les routes API ont leurs propres prompts inline, plus complets).
- Parsing JSON fragile dans les routes API (message d'erreur trompeur "Check your API key" possible).
- `ANTHROPIC_API_KEY` requis en `.env.local` pour tester end-to-end localement.

## Action user en attente
- Ajouter `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` dans `.env.local` (Redis gratuit sur upstash.com) pour activer le rate-limiting durable, la vélocité des trends et la capture email. Sans ça : fallback in-memory + form email = 503.
- `YOUTUBE_API_KEY` (optionnel, Google Cloud gratuit) pour activer la source YouTube filtrable par niche dans Trends. Google fonctionne sans rien.
