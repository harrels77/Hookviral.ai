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
`lib/patterns.ts` — taxonomie possédée. Chaque hook (generated, researched, analyzed) est tagué avec ses `patternsUsed` (whitelist serveur contre `HOOK_PATTERNS`). Les chips de patterns sont visibles sur les cartes du Generator et les angles du Trends research, et linkent `/patterns#<id>`. **Même langue end-to-end.**

### Surfaces
- **Home** (`app/page.tsx`) — 5 sections : Hero · How-it-works (4 cartes YOU DO/YOU GET) · `HomeAnalyzeWidget` (paste→score réel inline via `/api/analyze`) · Email capture · Final CTA. Pas de FAQ, pas de typing demo, pas de Features grid, pas de testimonials.
- **Generator** (`app/generator/page.tsx`) — Topic + Generate visibles. Platform/Tone/Niche/Goal sous `<details>More options ▾</details>`. Crédit bar `hv_credits` (10/j localStorage). 8 hooks scorés avec `patternsUsed` chips + bouton "Deep retention analysis →" → `/analyzer?hook=`. Le bouton Script ▶ génère vraiment (gating Pro inactif).
- **Analyzer** (`app/analyzer/page.tsx`) — Hook + Analyze visibles. Platform/Niche sous `<details>More options ▾</details>`. Test 3s live sous l'input (heuristique 3.3 mots/s). **Dual-mode auto-détecté via `looksLikeTopic(input)`** : (1) **Score mode** (hook fini) → Score 0-100 + sub-scores + why + weak points + patterns used/missing (chips → `/patterns#<id>`) + rewrite engine (5 styles + "Or fix a missing pattern", 12→84 vérifié, Before/After delta par variante) + callout **🔬 Research the topic** (CTA gradient vers `/trends/research?q=<subject>` quand `/api/analyze` extrait un subject). (2) **🎯 Strategic Takes mode** (input ressemble à un sujet) → branche vers `/api/strategic-takes` au lieu du scoring : Claude + `web_search_20250305` (max 3 searches) produit 2-3 **positions opposées** (emoji + name + stance + reasoning + 3-5 arguments concrets + 2-3 hooks scorés avec patterns chips) + `sources[]`. Bordure gauche colorée par take (rouge/électrique/or) pour distinguer les camps visuellement. Override "Score as a hook anyway →" pour les false positives du detector. SessionStorage cache `hv:takes:<subject>::<niche>` + Upstash 6h. Prefill via `?hook=&platform=&niche=` + auto-run.
- **Trends** (`app/trends/page.tsx`) — Liste + keyword filter + refresh visibles. **3 sources** (🔎 Google · ▶ YouTube · 🟠 Reddit) + Geo (🌍 Global / US / FR / UK / CA / ES / DE) + Niche sous `<details>Filters ▾ (état affiché dans summary)</details>`. **Google = ~10 items par geo** (RSS, seul endpoint encore vivant en 2026), **Global = fan-out 6 geos en parallèle + dedupe = ~30 items uniques**. **YouTube = jusqu'à 50** via API officielle. **Reddit /r/popular = jusqu'à 50 posts** (no key, JSON public, NSFW/stickied filtrés, geo ignoré côté Reddit — buttons grisés quand source=reddit). YouTube + Global → auto-reset à US. Velocity badges (🔥 Rising / ⚡ Steady / 📉 Cooling / 🆕 New) + sparkline d'historique de rang quand Upstash configuré et ≥3 snapshots. Compteur "N trends" toujours visible à droite de la barre de filtre. Carte trend simplifiée : CTA gradient **🔬 Research & angles** (Pro visuel) en premier → navigue vers `/trends/research?q=&niche=` ; en dessous, deux raccourcis discrets ⚡ Quick hooks (Generator) + ✦ Score it (Analyzer).
- **Trends Research** (`app/trends/research/page.tsx`) — Page dédiée, layout 2 colonnes desktop (Context sticky 42% / Angles 58%) + stack mobile. Claude + `web_search_20250305` tool (max 3 searches/call) → `context {who/what/whyTrending/stakes/timeline}` à gauche + 3-5 angles scorés à droite (chacun avec `reasoning` + chips patterns + 4 boutons : Copy hook / ⚡ More hooks / ✦ Analyze / 📋 Faceless brief) + bandeau `sources[]` URLs cliquables. **3 niveaux de cache** : Upstash 6h (`tr:research:<niche>:<trend>` partagé serveur) + mémoire process + **sessionStorage tab-scoped** (`hv:research:<q>::<niche>`) pour restauration instantanée au retour en navigation (zéro loading flash quand tu reviens depuis Analyzer). Bouton "← Back to trends" = `<Link href="/trends">` fixe, prévisible. Loading state explicite ("Searching the web for X… ~10s") + retry sur erreur. Accédée depuis Trends *et* depuis le résultat Analyzer (via subject extrait).
- **Patterns** (`app/patterns/page.tsx`) — Hub : chaque pattern a "✦ Analyze a hook for this" + "⚡ Generate hooks like this". Anchors `#<id>` ciblées par les chips Analyzer.
- **Start here** (`app/why-it-works/page.tsx`) — Guide plain-language : 4 outils × (What does it / When to use / Why it works) en 1 ligne chacun. Remplace l'ancien article méthodologie scientifique. URL conservée pour les liens entrants existants.
- **Pages SEO** : `/hooks-for/[niche]` (exemples evergreen) + `/trends/[niche]` (live + JSON-LD FAQPage/ItemList + contenu evergreen). Cross-linkées. Toutes deux ont NextStep en outside-loop.
- **History** (`app/history/page.tsx`) — Sessions Generator sauvegardées localStorage. Chaque hook a "✦ Improve →" vers Analyzer prefill. Empty state → Trends.
- **Pricing** — 5 puces Free / 5 puces Pro. Trust note : "Same AI on both plans. Pro = unlimited."

### Nav
`Home · Trends · Analyze · Generate · Patterns · Pricing · History` — flat. Analyze avant Generate parce que le workflow naturel commence par "j'ai un hook → score-le" plutôt que "page blanche → génère". CTA "Score my hook →" pointe vers `/analyzer` (positionnement Analyzer-first, c'est notre flagship vs ChatGPT).

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
- Parsing JSON fragile dans les routes API restantes (generate/analyze/rewrite/script utilisent encore `JSON.parse(raw.replace(/```json/, ""))`). `lib/parseJson.ts` `extractJson` existe maintenant, à propager si l'une d'elles 500 sur un cas similaire à decode.
- `ANTHROPIC_API_KEY` requis en `.env.local` pour tester end-to-end localement.

## Action user en attente
- Ajouter `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` dans `.env.local` (Redis gratuit sur upstash.com) pour activer le rate-limiting durable, la vélocité des trends et la capture email. Sans ça : fallback in-memory + form email = 503.
- `YOUTUBE_API_KEY` (optionnel, Google Cloud gratuit) pour activer la source YouTube filtrable par niche dans Trends. Google fonctionne sans rien.

---

## Journal des changements
Tous les changements et améliorations significatifs, du plus récent au plus ancien. Une ligne par commit. Le détail vit dans `git show <sha>`.

**2026-05-22**
- `02dcf5f` — **Analyzer-first repositioning (3 sharpening moves)** : suite à une critique externe Gemini Pro (dont 4/5 points décrivaient des features déjà implémentées). Les 3 ajustements valides extraits : (1) nav order swap `Generate ↔ Analyze` — workflow naturel = "j'ai un hook → score-le" avant "page blanche → génère". (2) "Start Free →" CTA renommé "Score my hook →" et pointe vers `/analyzer` (était `/generator`) — mobile drawer + desktop nav, alignement avec l'Analyzer comme flagship. (3) Hero copy : "Creators lose viewers in the first 3 seconds. Fix yours." → "Score your hook in **5 seconds**. Fix it in one click." Subtitle remise pour matcher : "Paste your opening line. The Analyzer scores retention, names the attention patterns it's missing, and rewrites it stronger — without prompting." Pas de refonte produit, juste de l'alignement de positionnement.
- `346902d` — **Strategic Takes + Trends Research page + Reddit/Global sources** (gros commit, 5 moves connectés autour du flow trend → research → hook) :
- **🎯 Strategic Takes dans l'Analyzer** : le différenciant catégoriel le plus difficile à copier. Quand l'utilisateur paste un **sujet** (`looksLikeTopic` retourne true), au lieu du score 12/100 inutile l'Analyzer branche vers `/api/strategic-takes` : Claude + `web_search_20250305` (max 3 searches, max_tokens 3000) produit 2-3 **positions opposées défendables** (emoji + name "The takedown" / "The defense" / "The data view" + stance + reasoning + 3-5 arguments concrets avec stats/noms/citations + 2-3 hooks scorés chacun avec patterns chips) + sources URLs. Reasoning par take : pourquoi cette position win attention. Border-left colorée par take (rouge/électrique/or) pour distinguer les camps visuellement. Override "Score as a hook anyway →" pour les false positives du detector (ex: "this changes everything" passe à travers la garde). Loading state distinct ("Researching positions… ~10s"). SessionStorage `hv:takes:<subject>::<niche>` pour back-nav instantané + Upstash 6h pour partage cross-users. C'est la feature qui repositionne le produit : pas "AI hook generator" mais "tool qui te dit comment penser un sujet pour qu'il performe".

**2026-05-21**
- **Reddit source + Global geo (multi-source breadth)** : suite à la découverte que **Google a décommissionné ses APIs JSON (dailytrends + realtimetrends = 404 testés live)** et que le RSS Google ne renvoie plus que **10 items par geo, point**, on étend la breadth par deux moves : (1) pseudo-geo "🌍 Global" qui fan-out 6 geos en parallèle (US/GB/CA/AU/DE/FR) avec dedupe par title lowercased → ~30 items Google uniques au lieu de 10. (2) Nouvelle source **🟠 Reddit /r/popular** (JSON public, no key, NSFW/stickied filtrés, sub = "r/community · 12.3k upvotes") → 30-50 posts trending toutes communautés avec un signal vraiment différent (cultural buzz vs search queries). UI : Reddit ajouté au source row, Global ajouté en tête du geo row, geo désactivé visuellement quand source=reddit (Reddit ignore le geo_filter depuis une IP serveur — testé). YouTube + Global = auto-reset US (YouTube API ne supporte pas notre pseudo-geo).
- **Trends caps unlock** : feedback user "10 trends ne suffisent pas, il faut toucher un maximum de sujet". Tout était coupé à 12 alors que les sources nous donnent plus. `googleTrends` 12 → 30 (cap safety, source réelle = 10). `youtubeTrends` `maxResults` 20 → **50** (cap API officiel), slice 20 → 50. `rerankForNiche` slice 12 → 40 + max_tokens 700 → 1200 (sinon le JSON tronquait sur larger reranks et tout retombait au feed brut, silencieusement). `/api/trends` retire son re-cap à 12 sur le path YouTube. UI : compteur "N trends" toujours visible à droite de la barre de filtre (était caché tant qu'aucune query).
- **Research depuis l'Analyzer + sessionStorage hydration** : ferme la boucle hook → research. `/api/analyze` retourne maintenant un `subject` (2-6 mots searchables, vide si pas extractible). Le résultat Analyzer affiche un callout gradient "🔬 Push it further — Deep research on 'Mbappé refusal PSG 2017'" linkant vers `/trends/research?q=<subject>` (même page que depuis Trends). Plus : `/trends/research` hydrate désormais depuis `sessionStorage.getItem("hv:research:<q>::<niche>")` à l'initial render → restauration instantanée zero-flash quand tu reviens depuis Analyzer/Generator. Cache écrit après chaque fetch réussi. Bouton "← Back to trends" passé de `router.back()` à `<Link href="/trends">` fixe (prévisible peu importe d'où tu viens). `/api/analyze` migre aussi vers `extractJson` (le parsing fragile était partout).
- **Trends Research → page dédiée** : feedback user "le visuel en dépliant dans une carte de 320px sur PC n'est pas encourageant à lire". Nouvelle route `app/trends/research/page.tsx` plein écran, layout 2 colonnes (Context sticky 42% / Angles 58% desktop, stack mobile). La carte trend perd toute la logique d'expansion in-card (state machine, AngleCard inline, sources inline, ProNote, decode credits) — `app/trends/page.tsx` -185 lignes. Le bouton 🔬 Research devient un `<Link>` simple gradient promu en CTA principal de la carte ; ⚡ Quick hooks (Generator) + ✦ Score it (Analyzer) sous-titres discrets. Loading state explicite avec nom du trend + `router.back()` pour retour grille (préserve scroll).
- `d9a22ef` — **Trends Research (web_search) + Decode 500 fix + Analyzer topic detector** (1 commit, 3 changements liés au flow trend→contenu cassé) :
  - **Trends Research** : remplace "Decode into content angles" par "🔬 Research & angles" — Claude + `web_search_20250305` tool (max 3 searches/call). Au lieu de deviner les angles depuis le nom du trend, Claude fait des recherches web réelles puis synthétise. Output : `context {who/what/whyTrending/stakes/timeline}` + 3-5 angles scorés avec `reasoning` chacun + `sources[]` URLs cliquables. Pro visuelle (badge sur bouton, ouvert tant qu'`isPro()=true`). Cache 6h Upstash + mémoire par (niche, trend) → 1 appel web_search partagé entre tous les users sur le même bucket.
  - **Fix Decode 500** : 2 causes — max_tokens 700 trop court (output tronqué mid-JSON sur 3 angles + arrays) + parsing fragile `JSON.parse(raw.replace(/```json/, ""))` qui explosait dès que Claude ajoutait une intro. `lib/parseJson.ts` `extractJson<T>` extrait le premier bloc `{…}` ou `[…]` équilibré (gère fences, intro, escapes). max_tokens 700 → 3000 (research = tool use coûte des tokens internes).
  - **Topic detector sur Analyzer** : heuristique `looksLikeTopic()` (≤6 mots, pas de ponctuation, pas de pronom personnel ni verbe impératif) → quand score <40 ET input ressemble à un topic, callout doré "💡 reads like a topic, not a hook — Generate 8 hooks for this →". Empêche les users de rester bloqués face à un 12/100 sans path de sortie (cas signalé : "meghan markle england visit" collé dans Analyzer).
- Ajout de la section "Journal des changements" dans CLAUDE.md (CHANGELOG.md séparé envisagé puis abandonné — préférence user : tout reste dans un seul doc).
- `88171b6` — Refactor CLAUDE.md : structure durable + une seule section "État actuel". 200 → 90 lignes. Le journal repart d'ici (cette section) au cas où.

**2026-05-20**
- `cb08ee9` — **Simplification radicale (4 moves)** : Pro plumbing caché (`isPro()` = true en attendant Stripe) · Home trimée 10 → 5 sections (cut Typing demo, Examples, Features, Trends teaser, FAQ, real-run callout) · Defaults > knobs sur Generator/Analyzer/Trends (chips sous `<details>More options ▾</details>`) · `/why-it-works` réécrit en guide "Start here" plain language (4 outils × What/When/Why). Net : +208/−682 lignes.
- `7abede7` — **Squelette + boucle + connexion** (30 fichiers, +2110/−378) : nav flat (Home·Trends·Generate·Analyze·Patterns·Pricing·History), `NextStep` partout (+ mode outside-loop), Patterns hub, **Trends v2** (decode → angles + velocity + sparklines + faceless brief + niche re-rank + geo selector), **Analyzer** (targeted rewrite par pattern manquant — 12→84, niche-aware, 3s check, deep-links /patterns#id, Before/After), **Generator** patterns visibles + deep analyze, `/why-it-works` article, `/api/subscribe` Upstash email capture, `ProLock` unifié, `HomeAnalyzeWidget` inline, prefs cross-page (`lib/prefs.ts`).

**2026-05-18** — Sprint Phases 0 → 3
- `72bd1da` — Logo HV monogram (gradient brand).
- `1fdbf34` — Homepage : live Trends + FAQ, nav dropdown "More".
- `af6d79d` — Couche Patterns : taxonomie possédée 9 attention patterns (moat v1).
- `6384da8` — Décision : Stripe reporté jusqu'à Phase 4 (post-auth + rétention prouvée).
- `b13c68b` — Roadmap : statut Phase 3 (Rewrite ✅ / Stripe bloqué).
- `75a63d6` — Phase 3 : Rewrite engine (`/api/rewrite`, 5 styles, 3 variantes).
- `3c04eb7` — Phase 2 complete : niche re-ranking Claude + pages SEO `/trends/[niche]`.
- `eed1c91` — Trends : source Google RSS gratuite (zéro clé).
- `063dcc2` — Phase 2 : niche modes, pages SEO `/hooks-for/[niche]`, section Trends double-source.
- `15328cc` — Phase 1 : Hook Analyzer autonome, repositionnement rétention, `claude-sonnet-4-6` sur generate/script/analyze.
- `ea3c393` — Phase 0 : rendu des hooks dans Generator, fuite de crédits corrigée, rate-limiting serveur par IP.

**2026-03 → 2026-04** — Build initial (avant Phase 0)
- Bootstrap Next.js, routes API `generate` + `script`, pages Generator / History / Pricing / Privacy / Terms, composant `Nav`, `lib/credits.ts`, premiers essais SEO TikTok.

### Convention pour la suite
Chaque commit significatif sur `main` reçoit une ligne ici, le jour du commit, en haut de la section date courante. Une ligne suffit — le détail vit dans le message de commit. Refactors cosmétiques / typo fixes peuvent être omis.
