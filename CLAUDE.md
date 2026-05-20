@AGENTS.md

# HookViral — Vision produit & roadmap

## Positionnement
HookViral n'est PAS un simple générateur de hooks. C'est une **suite d'optimisation de la rétention pour créateurs de short-form** (TikTok / Reels / Shorts).
On ne vend pas une feature ("génère des hooks"), on vend un résultat : **"répare les 3 premières secondes de tes vidéos"**.
Le générateur gratuit est la **porte d'entrée d'acquisition**, pas le produit final.

## Principes directeurs
- **Pas d'auth prématurée.** Le localStorage couvre historique/favoris. Comptes + DB seulement quand il y a un tier payant à protéger. Le "no login" est un avantage compétitif — le garder le plus longtemps possible.
- **Rate-limiting serveur AVANT tout lancement public.** Les crédits localStorage ne protègent pas la clé API. Pas de tier payant tant que le quota n'est pas appliqué côté serveur.
- **Le moat = SEO programmatique + rubric de scoring de référence**, pas une base de hooks curée à la main.
- **Niche modes = presets de prompt** qui alimentent aussi les pages SEO. Une construction, deux bénéfices.
- Modèle Anthropic Claude (pas OpenAI/Gemini). Utiliser le modèle Claude le plus récent disponible.

## Roadmap
**Phase 0 — Fondations (bloquant)**
- Afficher les hooks générés dans `app/generator/page.tsx` (le `HookCard` existe mais n'est jamais rendu — bug critique).
- Corriger la fuite de crédits : sur erreur API, restaurer localStorage, pas seulement le state React.
- Rate-limiting serveur par IP sur `/api/generate` et `/api/script`.

**Phase 1 — Repositionnement**
- Messaging homepage orienté rétention / "3 premières secondes".
- **Hook Analyzer autonome** : l'utilisateur colle SON hook → score + analyse. Réutiliser le modèle `HookAnalysis { why, curiosity, emotion, clarity }` déjà présent.

**Phase 2 — Croissance (toujours sans auth)**
- Niche modes (Football, Faceless, Fitness, Finance, AI Content…) = variantes de prompt.
- Pages SEO programmatiques `/hooks-for-[niche]` via `generateStaticParams` (exemples + CTA + génération + analyse par page).
- **Section Trends.** Source réelle gratuite = **API YouTube Data v3** (`videos.list?chart=mostPopular`, clé en env serveur uniquement). Pas Google Trends (pas d'API officielle, fragile). Route `/api/trends` avec cache 6-12h pour protéger le quota. Claude re-classe/filtre les titres tendance selon niche + topic (catégories YouTube trop grossières pour mapper 1:1). UX : l'utilisateur choisit un sujet tendance → pré-remplit le topic du générateur → flux existant (hook + script). Pages SEO `/trends/[niche]` rendues serveur. Google Trends = enrichissement secondaire éventuel plus tard.

**Phase 3 — Monétisation**
- Rewrite engine ("rends ce hook plus émotionnel / cinématique / contrarian").
- Stripe + tier payant illimité, gating appliqué côté serveur.

**Phase 4 — Si traction prouvée**
- Comptes utilisateurs, workspace persistant, analytics, prédiction de performance.

## Beachhead & moat (décision 2026-05-18)
- **Marché-beachhead = chaînes faceless / automation** (gros volume, mindset outil/ROI, rétention = revenu direct, peu servi par vidIQ). Scoper le nouveau travail vers ce marché en priorité.
- **Anti-clone = pas les features** (l'Analyzer est copiable) mais (1) appropriation de la niche faceless, (2) **corpus de patterns curé qui se compose avec l'usage**.
- **Contrainte honnête** : les vraies données de rétention/performance par vidéo ne sont PAS accessibles en API gratuite. Ne jamais sous-entendre que le produit a mesuré de la rétention réelle. Le moat = savoir-pattern curé → compose avec l'usage + SEO niche, PAS du big-data.
- ⏸️ **Data loop compounding reporté** : capturer les hooks analysés/générés dans le corpus nécessite un store persistant (même bucket infra que Phase 4). v1 = corpus statique curé.

## Couche Patterns (en cours le 2026-05-18)
- 🔜 `lib/patterns.ts` (corpus curé), `/api/analyze` mappe le hook au vocabulaire de patterns du corpus (taxonomie possédée, pas inventée), UI Analyzer montre patterns présents/manquants, page `/patterns` (SEO + apprentissage = rétention).

## Home : mini-Analyzer inline (fait le 2026-05-19)
Décision user : "qu'est-ce qu'on peut faire de plus sur la home" → reco "mini-Analyzer inline" (le plus gros levier de conversion non saisi) → "vas-y".
- ✅ **`HomeAnalyzeWidget`** sur la home, entre la section How-it-works (avec son "real run" 12→84) et le Typing demo. Textarea + bouton "✦ Score this hook" + prefill "Try: 'My morning routine'". POST `/api/analyze` (la VRAIE route, même prompt, même score que la page Analyzer complète — zéro fake).
- Résultat affiché en place : score géant coloré par tier, barre, "why" complet, **MISSING — biggest levers** en chips linkées vers `/patterns#<id>`. CTA principal "See the full analysis & 1-click rewrite →" vers `/analyzer?hook=...` (depth après la confiance), bouton "Try another" pour reset.
- **Pourquoi c'est le plus gros levier** : avant, le visiteur curieux devait cliquer "Analyze My Hook" → naviguer → coller → attendre → voir = 4 étapes mentales avant la magie. Maintenant : tape sur la home → voit le score en place. Le aha moment vit sur la home elle-même. Testé live : "My morning routine" → 12/100, missing Open Loop/Specificity/Implied Big Payoff (cohérent avec la canonical du "real run" callout juste au-dessus — confirme que c'est le vrai même backend).

## Squelette serré : prefs cross-page + vocabulaire visible partout + NextStep partout (fait le 2026-05-19)
Décision user après audit honnête : "les features doivent être inter-connectées ET fonctionner en indépendant en premium++". Audit identifie 6 trous, on attaque les 3 plus hauts leverage.
- ✅ **Persistance niche + geo cross-page** : `lib/prefs.ts` (helpers localStorage `hv_niche` / `hv_geo`). Trends + Analyzer hydratent depuis les prefs au mount (lazy initializer côté client) et persistent à chaque changement via `useEffect`. Pick "Finance" en Trends → Analyzer le retrouve. Pick "FR" geo → Trends s'en souvient. Petit, mais c'est le détail qui fait passer "outil" à "produit". (Generator a sa propre liste niche legacy non-NICHE_MODES — laissé tel quel pour ne pas refactoriser maintenant ; URL params `?niche=` continuent de fonctionner pour les deep-links.)
- ✅ **Vocabulaire de patterns visible end-to-end** (avant : sens unique Analyzer→Patterns ; maintenant : visible dans toutes les sorties).
  - `/api/generate` : prompt étendu avec PATTERN_VOCAB injecté, JSON inclut `patternsUsed` par hook, whitelist serveur contre `HOOK_PATTERNS` names (max 3). Tokens 1200 → 1500.
  - `decodeTrend` (`/api/trend-angle`) : même chose pour chaque angle décodé.
  - `Hook` interface (Generator) + `TrendAngle` interface (lib + Trends UI) ajoutent `patternsUsed?: string[]`.
  - UI : chips compactes (neon, fontSize .62rem) sous le formula tag dans HookCard et sous le hook+score dans AngleCard. Chaque chip → Link `/patterns#<id>` (deep-link vers la fiche pattern). **La même langue partout, visiblement.**
- ✅ **NextStep partout** (plus de dead-end sur les portes d'entrée) : composant étendu pour accepter `current?` optionnel. Sans prop → mode "outside-loop" : stepper inerte (tous muted) + push vers Trends comme entrée naturelle. Branché sur `/hooks-for/[niche]`, `/trends/[niche]`, `/why-it-works`, `/history`. Pricing volontairement non touché (page de facturation, NextStep serait pushy).
- ⏭️ **Trous restants honnêtes** (non faits) : #3 History capture seulement Generator pas Analyzer/Rewrite (besoin d'un store), #5 Generator UX density (Vague 2), #6 signaux Free/Pro unifiés (Vague 3). Squelette passé de ~70% à ~90% de cohérence selon le critère user "interconnecté + indépendant premium++".

## Article méthodologie `/why-it-works` (fait le 2026-05-19)
Décision user : "ce n'est pas juste 'mets ton hook et je note' — écris un article qui explique POURQUOI le produit marche, rassure l'utilisateur, mets du contexte."
- ✅ **Nouvelle page `/why-it-works`** (Server Component, metadata + canonical + OG + Article JSON-LD pour SEO). ~7 sections rédigées :
  1. **"Why 'paste a hook, get a number' isn't enough"** — pose le problème : un score sans rationale n'enseigne rien.
  2. **"What the score is actually built on"** — sous-scores (Curiosity/Emotion/Clarity), les 9 attention patterns, ancrage en psychologie du viewer (open loops = cognitive itch, loss/danger processed faster, concrete numbers, pattern interrupts), barème calibré non gonflé.
  3. **"Why the first 3 seconds matter (the math)"** — mécanique algorithmique platform : early retention drive reach.
  4. **"Why this isn't just generic AI"** — vocabulaire **possédé** (9 patterns), whitelist serveur (le modèle ne peut pas inventer de pattern hors taxonomie), même langue end-to-end (Analyzer → Rewrite → Patterns → Generator). "Difference between a chatbot that opines and a system that compounds."
  5. **"A concrete walkthrough — 12 to 84 in one click"** — la démo réelle avec score card structurée (12/100, sub-scores, missing patterns chips clickables vers `/patterns#<id>`) → résultat 84 (+72 ▲). Same topic, same AI, structure changed.
  6. **"What we don't claim"** — section honnêteté (cohérent avec principe CLAUDE.md "ne jamais sous-entendre qu'on mesure la rétention réelle") : 1) on ne mesure PAS la rétention vidéo réelle, c'est un outil de craft pas d'analytics ; 2) on ne prédit PAS la viralité, ~50 variables hors hook ; 3) même IA sur Free et Pro, Pro = volume + workflow, jamais qualité.
  7. **"Where to start"** — entrées Analyzer ou Trends, liens vers /patterns.
- ✅ **Liens entrants** depuis les pages où la question "comment ça marche" se pose le plus :
  - **Home** : sous le bloc "A real run, in 30 seconds" → "Why this works — the methodology behind the score →"
  - **Analyzer** : à côté du "Retention score" header → petit "How? →" qui pointe sur l'article
  - **Patterns** : sous l'intro → "Why these specific patterns? — the methodology →"
- C'est la couche de **confiance/contexte** qui transforme le score "AI black box" en explication défendable. Article + 3 liens entrants = découvrable depuis tous les points où le créateur pourrait douter.

## Nav à plat + Home explicite "comment obtenir un résultat" (fait le 2026-05-19)
Décision user : "Home dans le header en premier, History aussi, plus de More. Sur la home explique exactement comment fonctionne le site pour obtenir des résultats."
- ✅ **Nav à plat, 7 items** : `Home · Trends · Generate · Analyze · Patterns · Pricing · History`. Dropdown "More" entièrement supprimé (state `moreOpen`, render, drawer mobile divider — tout retiré). Home en premier comme demandé.
- ✅ **"Start Free →" pointe vers `/generator`** (desktop nav + drawer mobile) au lieu de `/pricing` — cohérent avec la sémantique : "start free" = commencer à utiliser le produit, pas voir les prix (Pricing est déjà dans la nav).
- ✅ **Section "How it works" sur la home réécrite pour expliquer comment obtenir un résultat** :
  - Titre changé : "From idea to a scroll-stopping hook. Step by step."
  - Chaque carte (Trends / Generator / Analyzer / Patterns) restructurée en **"YOU DO" + "YOU GET"** — action concrète + ce que le créateur reçoit en retour. Plus de description abstraite.
  - **Nouveau "A real run, in 30 seconds"** sous les cartes : déroulé concret avec vrais chiffres du produit ("My morning routine" → score 12 → clic ＋Open Loop → "⏰ I changed one thing in my morning…" → score 84, +72 ▲). Same idea, same AI, different hook — because now it has a pattern. C'est la démonstration la plus claire possible de "comment obtenir un résultat".
  - CTA final de section : "Try it now — free →" vers `/generator`.
- ✅ **Grille 4 cartes sur une ligne** (minmax 205px) — avant un wrap 3+1 cassait la cohérence visuelle des flèches entre étapes.

## Simplification — Vague 1 (fait le 2026-05-19)
Décision user : "tout ça est beaucoup trop compliqué, simplifier". On soustrait, on n'ajoute plus.
- ✅ **Home trimée** : suppression de la section **Reviews** (témoignages fabriqués — red flag de crédibilité déjà flaggé), de la section **Stats animée** (doublonnait avec les mini-stats du hero), de la section **Before/After** (l'Analyzer fait ça pour de vrai maintenant, c'était une démo factice). 11 sections → 9. Plus les orphelins : `BEFORE_AFTER`, état `baIdx`/`statsVisible`, ref `statsRef`, IntersectionObserver effect, composant `RCard`, import `useRef`. Bonus crédibilité : plus de faux témoignages.
- ✅ **Pricing trimé** à **5 puces Free / 5 puces Pro** (symétrique), liste verrouillée du Free supprimée (redondante avec la colonne Pro à côté). Trust note resserrée : "**Same AI on both plans. Pro = unlimited.**" → lisible en 5 secondes.
- ✅ **Verrous Pro unifiés** : nouveau `components/ProLock.tsx` exposant `<ProNote title detail />` — même look (carte dashed), même destination (`/pricing`), même formulation ("🔒 … See Pro →"). Branché à 3 endroits qui avaient chacun leur style : teaser rewrite (Analyzer), panneau "3 free decodes used" (Trends), panneau "faceless brief Pro" (Trends AngleCard). **Un concept, un composant.**
- ⏭️ **Vague 2 (pas faite)** : densité par page (Generator → Topic+Platform en avant, Tone+Goal+Niche en "Advanced ▾" ; Analyzer rewrite → virer les chips de styles verrouillés et la note free inline, garder uniquement le teaser locked du bas). À faire quand le user décide.
- ⏭️ **Vague 3 (pas faite)** : unifier les compteurs (`hv_credits` du Generator → `lib/plan.ts`).

## Cohérence : squelette de la boucle rendu visible (fait le 2026-05-19)
Décision user : trop de features empilées, rendre le tout cohérent comme un système, pas un tas.
- **Thèse produit explicite** : pas un générateur de hooks, **un système pour les 3 premières secondes**. La boucle : Discover (Trends) → Create (Generator) → Diagnose (Analyzer) → Learn (Patterns) → revient au Generate. Vocabulaire commun = les 9 patterns possédés, parlé par toutes les surfaces.
- ✅ **Nav réordonnée sur la boucle** : `Trends · Generate · Analyze · Patterns · Pricing` en primary ; Home + History dans More. L'ordre = le workflow.
- ✅ **`components/NextStep.tsx`** : composant cohérent en bas de chaque page de la boucle. Affiche le stepper 4 étapes (étape courante en gradient, autres en muted, toutes cliquables) + une ligne "Next: …" + CTA gradient vers l'étape suivante. Chaque ligne du `LOOP` décrit ELLE-MÊME (verb=CTA pour y atterrir, blurb=ce qu'elle fait). Mapping `nextId` pédagogique : trends→generate, generate→analyze, analyze→patterns, **patterns→generate** (apply it). Branché sur `/trends`, `/generator`, `/analyzer`, `/patterns`.
- ✅ **Patterns devient le hub** : chaque carte pattern a deux actions ("✦ Analyze a hook for this →", "⚡ Generate hooks like this →"). Plus de page-définition cul-de-sac. **Deep-links de l'Analyzer** : chips de patterns utilisés/manquants pointent vers `/patterns#<id>` (l'id existait déjà comme anchor).
- ✅ **Section "How it works" sur la home** : juste après le hero, avant le typing demo. Titre "Not a hook generator. A system for the first 3 seconds." + 4 cartes-étapes connectées par flèches (Discover/Trends, Create/Generator, Diagnose & fix/Analyzer, Learn/Patterns) chacune avec une description et un deep link, finissant par "Start the loop — find a trend →". Teach le système et les outils en un coup d'œil. Média-query `.hiw-arrow` cache les flèches en stack mobile.
- ✅ **Cross-link SEO** : `/hooks-for/[niche]` ajoute un CTA "Trending {label} Topics →" vers `/trends/[niche]` (le retour existait déjà). Les deux systèmes SEO se nourrissent maintenant et funnel vers la boucle.
- ✅ **History a un job** : chaque hook sauvegardé a "✦ Improve →" qui deep-link vers `/analyzer?hook=…&platform=…` (re-diagnose/améliore). Empty state pointe vers `/trends` ("Find a trend to post →") au lieu d'une simple phrase morte. History n'est plus une archive orpheline, c'est un point de retour dans la boucle.
- ⚠️ **Note dev local** : Turbopack a un cache de chunks parfois collant ; après changement de `NextStep.tsx` le chunk `/patterns` peut servir l'ancien texte jusqu'à un `npm run dev` clean. `/trends` rend bien le nouveau contenu (vérifié curl). Aucun impact prod.

## Découpage Free/Pro défini + soft-gating (fait le 2026-05-19)
Décision user : définir ce qui est premium, puis gater le free / mettre à jour pricing.
- **Principe figé** : on gate le VOLUME et le WORKFLOW, jamais le "aha moment" (analyze→why→rewrite→score monte) ni le SEO (pages indexables, Patterns, Trends list). Qualité IA identique sur les 2 plans (jamais un levier).
- **Free** : 10 générations/j (8 hooks), Analyzer complet (score + why + patterns), 1 rewrite/hook (1 style), 3 décodages trend/j, Trends+vélocité+niche, Patterns, history local, hashtags/export.
- **Pro** : générations illimitées (levier #1), rewrite 5 styles × 3 variantes, décodages illimités (levier #2 — outil de calendrier éditorial, cher en Claude, pile la cible faceless), Script generator, history sync (futur), export Notion.
- ✅ `lib/plan.ts` : `isPro()` (lit `localStorage.hv_plan` — **toujours false en pratique**, c'est l'unique switch à flipper post-comptes) + compteurs free quotidiens (`freeRemaining`/`consumeFree`, reset minuit, clé `hv_free_<k>`). `FREE_LIMITS.decode = 3`.
- ✅ Gates branchés : Script generator → `UpgradeModal` si `!isPro()` (generator) ; Rewrite → styles 2-5 verrouillés 🔒 + 1 seul résultat visible + teaser "N more variants — Pro" (analyzer) ; Decode → `consumeFree("decode")`, panneau "locked" après 3/j, bouton affiche "· N left" (trends). Pricing page : listes Free/Pro réécrites selon ce découpage.
- ⚠️ **C'est du SIGNAL/incitation côté client, PAS de la sécurité.** Conforme à la décision Stripe-reporté : l'enforcement serveur réel = comptes (Phase 4) + entitlement + Stripe. Personne n'est Pro aujourd'hui → les features Pro sont "définies + verrouillées en attente d'achat" (état pré-monétisation voulu). Ungate trivial : flipper `isPro()`.

## Trends v2 — Decode + re-rank niche (fait le 2026-05-19)
Décision user : pousser Trends plus loin (#1 Trend→Angle + #3 re-rank niche Google).
- ✅ **Trend → Angle decoder** (la feature qui transforme Trends d'une liste curieuse en outil quotidien) : `decodeTrend()` dans `lib/trends.ts` + route `/api/trend-angle` (POST, rate-limit 30/h, cache in-memory 6h par `niche:trend`). Claude renvoie `{why, angles:[{angle, hook, score}]}` (3 angles). UI : bouton "🧠 Decode into content angles" sur chaque carte → expansion inline (why + 3 cartes angle avec hook scoré + Copy + "⚡ More hooks" vers `/generator?topic=<angle>`). Comble le gap "terme brut → contenu publiable".
- ✅ **Re-rank niche pour Google** : `rerankForNiche()` généralisé (param `source`, cache key `${source}:${slug}`). `/api/trends` applique le re-rank Claude aux trends Google quand `?niche=` présent (Google n'est pas filtrable par catégorie nativement). Filtre niche affiché pour **les deux sources** maintenant, copy adaptée.
- Nouvelle accroche page : "Don't just see a trend — decode it into content angles you can post today."
## Analyzer v2 — #1 test 3s + #2 niche-aware (fait le 2026-05-19)
- ✅ **#1 Test "3 secondes"** : `threeSecondCheck()` (heuristique honnête narration short-form ≈ 3.3 mots/s) → bandeau live sous le textarea : "Lands in 3s / Tight / Too long" + nb mots + ~Xs + barre. Zéro coût API, instantané, pile le positionnement. Vérifié (19 mots → "Too long for 3s ~5.8s").
- ✅ **#2 Analyzer niche-aware** : sélecteur niche optionnel (NICHE_MODES) sur `/analyzer` ; `/api/analyze` accepte `niche`, injecte `n.guidance` dans le message user → scoring/why adaptés à l'audience. Aligne beachhead, réutilise l'infra.
- ✅ **#3 Rewrite ciblé par pattern manquant** : `/api/rewrite` accepte `pattern` (prioritaire sur `style`) → prompt ancré sur la taxonomie possédée (`HOOK_PATTERNS` : name + oneLiner + fix). UI Analyzer : section "Or fix a missing pattern — 1 click" listant `result.patternsMissing` ; clic = rewrite ciblé, header "rewritten to add <pattern>", gating free/Pro inchangé. Boucle core Analyzer→Patterns→action. Vérifié live : "My morning routine" (12) → +Open Loop → score 84 (+72). C'est le différenciant le plus fort de l'Analyzer.
- ⏭️ Restant proposé Analyzer (non fait) : #4 surlignage du segment faible, #5 mode comparaison A/B.

### Suite (fait le 2026-05-19) — A géo + B brief faceless
- ✅ **A — Sélecteur géo** : `youtubeTrends(niche, geo)` (regionCode) + `googleTrends(geo)` déjà OK ; `/api/trends` lit `geo` (clamp 2 lettres) et le passe aux 2 sources + `computeVelocity`. UI `/trends` : toggle 🇺🇸/🇫🇷/🇬🇧/🇨🇦/🇪🇸/🇩🇪. Vérifié live : FR renvoie bien des trends FR. (Pages SEO `/trends/[niche]` restent geo par défaut — éviter d'exploser `generateStaticParams`.)
- ✅ **B — Brief production faceless** (levier Pro, cohérent avec Script=Pro) : `/api/trend-brief` (rate-limit 20/h) → Claude renvoie `{voiceover[], broll[], onScreenText[], cta}` alignés beat par beat. UI : composant `AngleCard` extrait, bouton "📋 Faceless brief · Pro" par angle ; `!isPro()` → nudge verrouillé "See Pro →". C'est le livrable que la cible faceless paie (hook → vidéo produisible sans visage). Inexploitable tant que personne n'est Pro = état pré-monétisation voulu (idem Script).
- **TikTok** : confirmé — aucune source officielle gratuite fiable (Research API gated, Creative Center = site sans API, scraping = violation ToS refusée). Approche honnête retenue : Google/YouTube comme proxys + l'utilisateur peut coller un trend TikTok repéré → Decode.

### Suite (fait le 2026-05-19) — #5 SEO pages + #6 sparklines
- ✅ **#5 `/trends/[niche]` enrichi en vrai asset SEO** : la page existait déjà (ISR 6h, generateStaticParams, generateMetadata canonical) mais était une liste mince. Ajouté du contenu evergreen unique par niche (intro retention, section "Proven [niche] hooks" depuis `n.exampleHooks` — zéro coût Claude, déjà curé, contenu stable indexable, "How to ride a trend" 3 étapes, FAQ 4 Q/R) + **JSON-LD** (`FAQPage` + `ItemList`) → éligible rich results Google. Keywords meta + liens internes (autres niches + `/patterns`). Transforme une doorway page mince en page de ranking substantielle.
- ✅ **#6 Sparkline d'historique de rang** : `computeVelocity()` maintient en plus un historique glissant par terme (`tvh:<source>:<geo>`, 1 point/bucket 6h, cap 8) et renvoie `{velocity, history}`. `/api/trends` attache `history` aux trends. Composant `Sparkline` SVG inline dans `TrendCard` (inverse le rang : grimper vers #1 = ligne qui monte). **Honnête** : rendu seulement avec ≥3 vrais points ; pas d'Upstash/pas d'historique → pas de courbe. Donc invisible en local tant qu'Upstash absent + 3 cycles accumulés — normal.

### Suite (fait le 2026-05-19) — vélocité + news/evergreen + rename
- ✅ **Niche `football` → `sports`** (slug/label/emoji 🏆/guidance/exemples élargis multi-sports). `NICHE_CATEGORY` maj (`sports: "17"`). ⚠️ `/hooks-for/football` devient 404 → `/hooks-for/sports` (pas déployé donc OK ; à noter si redirections SEO un jour).
- ✅ **#2 Vélocité de recherche** : `computeVelocity()` dans `lib/trends.ts` — snapshots par bucket 6h dans Upstash (`tv:<source>:<geo>:<bucket>`, TTL 3 buckets), compare le rang vs bucket précédent → `rising | steady | cooling | new`. `/api/trends` (google) la calcule sur l'ordre de recherche brut **avant** rerank niche, puis ré-attache par titre. Badge coloré dans `TrendCard`. **Honnête** : mesure le mouvement du *rang de recherche*, PAS de la rétention vidéo (commentaire explicite dans le code). Pas d'Upstash ou pas de snapshot précédent → **pas de badge** (aucune direction fabriquée). Donc invisible en local tant qu'Upstash absent — normal.
- ✅ **#4 News vs Evergreen** : `decodeTrend()` renvoie aussi `kind: "news" | "evergreen"`. Badge dans le panneau decode ("🗞️ News spike — post today" / "🌱 Evergreen — build a series") → guide l'urgence de publication (pertinent beachhead faceless/automation).
- ⏭️ **Restant proposé (non fait)** : #5 SEO programmatique `/trends/[niche]` ISR (gros chantier séparé, déjà dans roadmap Phase 2 reporté), #6 sparklines (nécessite historique de rangs ; devient faisable maintenant que `tv:` stocke les snapshots — petit ajout possible plus tard).

## Itération produit & infra durable (fait le 2026-05-19)
Suite à une revue produit (décision user : faire toutes les améliorations + refonte Trends).
- ✅ **Connexion Generator → Analyzer** : bouton "✦ Deep retention analysis →" sur chaque `HookCard` → route vers `/analyzer?hook=&platform=`. L'Analyzer lit ces params, pré-remplit et auto-run (wrappé `<Suspense>` pour Next 16). C'est le flux core qui manquait (générer → analyser sans copier-coller).
- ✅ **Infra durable via Upstash REST** (choix user : Upstash, pas Resend/ConvertKit) :
  - `lib/upstash.ts` — client REST fetch, **zéro dépendance npm**. S'active si `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` présents.
  - `lib/rateLimit.ts` — `rateLimit()` est **async** maintenant (sliding-window sorted-set Redis), **fallback in-memory** si Upstash absent ou en erreur. Les 5 routes API (`generate/script/rewrite/trends/analyze`) ont été passées en `await rateLimit(...)`.
- ✅ **Capture email** : `/api/subscribe` (rate-limit 10/h) → `SADD hv:subscribers` + `HSET hv:subscriber_meta` (timestamp+source). Renvoie un **503 honnête** si Upstash non configuré (pas de faux succès). Composant `EmailCapture` + section "Weekly hook teardown" sur la homepage.
- ✅ **Crédibilité** : fausses stats homepage (`2.4M+`, `48K+`, `94`, `3s`) remplacées par des faits produit vérifiables (`8` hooks/gen, `0–100` score, `9` patterns, `Free`).
- ✅ **Score Before/After** : `/api/rewrite` renvoie désormais `{text, score}` par variante (prompt mis à jour, même échelle de rétention). L'Analyzer affiche le score de chaque réécriture + delta coloré vs le hook original.
- ✅ **Refonte page Trends** : grille de cartes (rang/🔥), filtre par mot-clé client, bouton refresh, skeleton de chargement, double CTA "⚡ Get hooks" / "✦ Analyze" par trend. Logique de chargement (source google/youtube + niche) inchangée.
- ⚠️ **Action user requise** : ajouter `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` dans `.env.local` (Redis gratuit sur upstash.com) pour activer rate-limiting durable + capture email. Sans ça : fallback in-memory + form email affiche "non configuré". `.env.local` est gitignored.
- ⏭️ **À traiter plus tard** : les témoignages homepage (Sofia L. / Marc K. / Aïcha R.) sont **fabriqués** — même risque de crédibilité que les fausses stats. À remplacer par de vrais avis ou supprimer (signalé au user, non touché car peut-être de vrais avis à venir).

## État Phase 3 (en cours le 2026-05-18)
- ✅ Rewrite engine : `/api/rewrite` (5 styles, 3 variantes, rate-limit 30/h) intégré dans l'Analyzer → funnel Analyze → Rewrite.
- ⏸️ **Stripe / tier payant : REPORTÉ (décision user 2026-05-18).** On ne monétise qu'après Phase 4 (auth/comptes) + rétention prouvée. Ne PAS coder de paiement maintenant. Quand on y reviendra, pré-requis : comptes users d'abord, rate-limiting durable (Upstash/Vercel KV), enforcement entitlement serveur, puis Stripe (compte + clés + priceId fournis par le user).

## État Phase 2 (fait le 2026-05-18)
- ✅ Niche modes : `lib/niches.ts` (8 niches, guidance + topics + exemples) ; guidance injectée dans le prompt `/api/generate`.
- ✅ Pages SEO statiques `/hooks-for/[niche]` : `generateStaticParams` + `generateMetadata` (title/desc/canonical/OG par niche), 404 si niche inconnue. Server Components.
- ✅ Prefill du générateur via `?topic=` / `?niche=` (wrappé en `<Suspense>` pour `useSearchParams`).
- ✅ Section Trends **double source** : `/api/trends?source=google|youtube` (cache fetch 6h, rate-limit 60/h) + page `/trends` (toggle source) + lien Nav.
  - **google** (défaut) : flux RSS officiel "Trending Now" (`trends.google.com/trending/rss?geo=`). **Gratuit, sans clé, marche déjà.** Termes de recherche tendance généraux (pas filtrables par niche). Endpoint non documenté mais stable — parsing regex sans dépendance, dégradation propre si ça casse.
  - **youtube** : YouTube Data v3, filtrable par niche (catégories). Nécessite `YOUTUBE_API_KEY` ; sans clé renvoie `{configured:false}` et la page propose Google à la place.
- ⏳ **Reporté** : pages SEO `/trends/[niche]` rendues serveur + re-ranking Claude des trends par niche (design ISR ; étape dédiée).
- ⚠️ **Optionnel** : `YOUTUBE_API_KEY` dans `.env.local` (gratuite, Google Cloud) pour activer la source YouTube filtrable par niche. Google fonctionne sans rien.

## État Phase 1 (fait le 2026-05-18)
- ✅ Modèle Claude `claude-sonnet-4-6` sur generate + script + analyze.
- ✅ **Hook Analyzer autonome** : route `/api/analyze` (rate-limit 30/h) + page `/analyzer` + lien Nav. L'utilisateur colle son hook → score rétention, formule détectée, why, curiosity/emotion/clarity, points à corriger.
- ✅ Homepage repositionnée sur la rétention (angle perte/3 secondes) ; hero + CTA final mènent vers l'Analyzer.

## État Phase 0 (fait le 2026-05-18)
- ✅ Hooks rendus dans `generator/page.tsx` (HookCard câblé), erreur API affichée, stub `setCopiedTag` corrigé, code mort supprimé (`useBtnHover`/`genBtn`/`SmBtn`).
- ✅ Fuite de crédits corrigée : `refundCredit()` restaure localStorage + state sur erreur.
- ✅ Rate-limiting serveur par IP sur `/api/generate` (20/h) et `/api/script` (40/h) via `lib/rateLimit.ts`.

## Dette technique restante
- ~~Rate-limiting in-memory~~ → **résolu conditionnellement (2026-05-19)** : path durable Upstash REST en place dans `lib/rateLimit.ts`, **mais inactif tant que les clés Upstash ne sont pas dans `.env.local`** (fallback in-memory en attendant). Action user pour activer.
- Logique de crédits dupliquée entre `generator/page.tsx` et `lib/credits.ts` (la lib n'est toujours pas utilisée).
- `lib/prompt.ts` non importé (la route API a son propre prompt inline, plus complet).
- Parsing JSON fragile dans les routes API (message d'erreur trompeur "Check your API key").
- Pas de `.env` local : `ANTHROPIC_API_KEY` absente → flux génération non testable end-to-end en local.
