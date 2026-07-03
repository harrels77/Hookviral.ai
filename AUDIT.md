# AUDIT — HookViral.ai
*Directeur artistique senior + lead front-end. Audit du 2026-07-03. Aucun fichier modifié.*

## Correction préalable du brief

Deux hypothèses du brief sont fausses, autant le dire tout de suite :
- **Il n'y a pas de Tailwind.** Pas de `tailwind.config`, pas de classe `slate-*`. Le site est stylé à ~95% en **inline styles React** + CSS variables dans `globals.css`. C'est pire que du Tailwind défaut : c'est un système de design non-extractible, dupliqué dans chaque JSX.
- **"Simple. Honest. No surprises." n'existe pas** dans le code. Mais le tic staccato existe bel et bien ailleurs (voir §2).

Le reste du diagnostic du brief est confirmé et en dessous de la réalité.

---

## Structure réelle du site

**Pages** (App Router) :
- `/` — home 6 sections (hero split + PersonaCards, ScoreDemo, PhoneShowcase + how-it-works, widget analyze, email capture, CTA final)
- `/analyzer` (790 lignes), `/generator` (477), `/trends` (478), `/trends/research` (445) — les 4 outils, tous `"use client"` avec layout serveur pour la metadata
- `/patterns` + `/patterns/[id]` (9 SSG), `/why-it-works` — contenu/learn
- `/hooks-for/[niche]`, `/trends/[niche]`, `/tiktok-hook-generator`, `/youtube-hook-generator`, `/instagram-hook-generator` — SEO programmatique
- `/pricing`, `/history`, `/saved`, `/privacy`, `/terms`

**Composants partagés** : `Nav` (+ curseur custom), `Footer`, `Logo`, `NextStep`, `ScoreDemo`, `PhoneFrame`/`PhoneShowcase`, `ProLock`, `Themeprovider`.

**Styles** : `globals.css` (219 lignes : tokens light/dark, keyframes, patches mobile) + `page.module.css` (**mort** — starter Next.js jamais importé, référence `--font-geist-sans` qui n'existe pas) + des blocs `<style>{...}` injectés en string dans `page.tsx:296-307` et `Nav.tsx:194-200`.

**Fonts** : Syne (display) + DM Sans (body) via `@import` Google Fonts ([globals.css:1](app/globals.css:1)) — pas `next/font`.

---

## 1. Direction artistique — défaut vs décision

### Ce qui est une vraie décision (à garder)
- **Syne + DM Sans** : c'est un choix, pas Inter. Syne 800 en display a du caractère. Problème : elle est utilisée à contre-emploi (voir plus bas).
- Le **wordmark typographique** (Logo.tsx) est propre.
- Les **tokens de thème** light/dark avec ratios WCAG documentés ([globals.css:31-80](app/globals.css:31)) : travail sérieux… sur les variables uniquement.
- Le light par défaut : décision argumentée, OK.

### Ce qui est du défaut déguisé en décision

**Couleur : 4 accents néon = zéro accent.** `--hot` (rose), `--electric` (violet), `--neon` (vert), `--gold` (jaune) sont utilisés *simultanément partout* : les 3 sub-scores de l'Analyzer ont chacun leur couleur, les 4 STATS de la home ont chacune leur couleur ([page.tsx:23-28](app/page.tsx:23)), les chips du Generator ont 4 palettes ([generator/page.tsx:450-455](app/generator/page.tsx:450)), les TakeCards tournent rouge/violet/or. Quand tout est accentué, rien ne l'est. C'est LA signature visuelle du site généré : l'arc-en-ciel fonctionnel.

**Le gradient `hot→electric` est mis sur tout ce qui bouge** : logo, chaque CTA, les numéros d'étapes, le badge MOST POPULAR, les points actifs de la nav, les score bars (`electric→neon` cette fois), et `.gradient-text` **animé en boucle infinie** ([globals.css:97-104](app/globals.css:97)) est appliqué à un mot de quasi chaque H1/H2 du site (home ×5, analyzer, generator, trends, patterns, why-it-works, hooks-for, pricing). Un gradient animé sur chaque titre = template Framer 2024.

**Typographie sans échelle.** Relevé des `fontSize` réels : `.54rem, .56rem, .58rem, .6rem, .62rem, .64rem, .65rem, .66rem, .68rem, .7rem, .72rem, .73rem, .74rem, .75rem, .78rem, .8rem, .82rem, .83rem, .85rem, .88rem, .9rem, .92rem, .95rem, 1rem, 1.05rem, 1.1rem, 1.15rem, 1.2rem, 1.4rem…` — **plus de 30 tailles distinctes**, aucune n'étant un token. Idem letter-spacing (-3px, -2px, -1.5px, -1.2px, -1px, -.5px, -.3px, 0, .5px, 1px, 1.5px, 2px, 3px). Le corps de texte est en poids 300 sur du .85-.95rem — fragile en light mode.

**Le tic "micro-kicker uppercase"** : `fontSize:".6-.7rem" + textTransform:"uppercase" + letterSpacing:"1-3px" + fontFamily:var(--fd)` apparaît **~40 fois**. Chaque carte, chaque section, chaque panneau a son étiquette criée en 9px. C'est le pattern n°1 des UI générées par LLM.

**Espacement sans échelle** : paddings relevés `1.1rem 1.3rem`, `1.5rem 1.6rem`, `.85rem 1.1rem`, `1.25rem 1.5rem .5rem`, `9px 18px`, `6px 14px`, `13px 26px`, `15px 28px`… Aucun rythme vertical. Les sections font toutes `5rem 1.5rem` (monotonie inverse).

**Radius : 12 valeurs.** Les tokens `--r/--r2/--r3` existent ([globals.css:26-28](app/globals.css:26)) mais le code utilise aussi en dur 6, 8, 10, 11, 12, 14, 16, 20, 24, 28, 36 et **100px partout**. La pill `borderRadius:"100px"` est appliquée aux boutons, chips, badges, inputs, banners, source-toggles — le site n'a qu'une seule forme.

**Iconographie : 100% emoji.** Aucune icône vectorielle dans tout le produit (le seul SVG est le favicon et les rings du ScoreDemo). Détail au §2. Rendu différent par OS, poids visuel incontrôlable, couleur non thémable : c'est le marqueur "IA" le plus visible du site.

**Ornements d'époque** : orbes flottants floutés en fond de *chaque* page ([page.tsx:47-50](app/page.tsx:47), [analyzer:259-261](app/analyzer/page.tsx:259), [generator:144-147](app/generator/page.tsx:144), [trends:214-216](app/trends/page.tsx:214)), curseur custom "ring" qui suit la souris ([Nav.tsx:36-118](components/Nav.tsx:36)), hover `translateY(-3px) + glow` sur littéralement toutes les cartes et boutons, `backdropFilter: blur(24px) saturate(180%)` sur la nav. Le combo complet du template SaaS dark-neon 2024 — conservé tel quel en passant au thème light.

---

## 2. Marqueurs "site IA" — liste exhaustive

### 2a. Emojis utilisés comme icônes (par fichier, lignes exactes)

| Fichier | Lignes | Occurrences |
|---|---|---|
| [app/page.tsx](app/page.tsx) | 16-19 (🔥⚠️🤯❌ dans les hooks de démo), 87 (✓/✕ comparatif), 105/114/123 (✦💡🔬 PersonaCards), 229 (flèche →), 361 (★), 535 (✦ bouton Score), 625 (✓) | ~25 |
| [app/analyzer/page.tsx](app/analyzer/page.tsx) | 291 (⏱), 326 (emoji niches), 353 (✦ Analyze), 380/386 (💡🎯), 487 (🔒 styles lockés), 512 (＋), 526 (✦ Rewrite), 552 (▲▼), 556 (✓ Copied), 581 (🔬 Push it further), 592 (badge PRO), 633 (🎯 Strategic Takes), 679 (↗), 708 (`take.emoji` généré par le LLM), 718 (💭), 743 (🪝 Ready hooks), 774 (✓), 780 (✦) | ~25 |
| [app/trends/page.tsx](app/trends/page.tsx) | 34-36 (🌍 + drapeaux), 97-100 (🔥🆕⚡📉 velocity), 243-250 (🔎📚🟧🦋▶🟠🎵📸 toggles sources), 261 (✓), 278 (🔥 All), 291 (↻ refresh), 304 (🔎 dans l'input), 422 (★☆ save), 427 (🔥 rank), 458 (🔬 CTA), 467/473 (⚡✦) | ~21 |
| [app/generator/page.tsx](app/generator/page.tsx) | 201 (✏ Other), 233 (⚡ Generate), 274 (✕ close), 283 (🎬🔗📣 sections script), 288 (✓ Copied), 329-330 (★ ▶ actions), 377/397 (▲▼), 421 (✦), 424 (COPIED ✓), 470 (✕), 471 (🚀) | ~18 |
| [components/PhoneShowcase.tsx](components/PhoneShowcase.tsx) | 18-21 (🦋🔎▶🟧 + 🔥⚡🆕), 37 (🔬), 100-104 (✓ + ✦) | 12 |
| [components/Nav.tsx](components/Nav.tsx) | 171/183 (☀/🌙 theme toggle) | 2 + hamburger fait main |
| [components/NextStep.tsx](components/NextStep.tsx) | 51/65 (→ en texte) | 6 |
| [app/pricing/page.tsx](app/pricing/page.tsx) | 71/122 (✓ features), 151 (+ rotaté en ✕) | 6 |
| [components/ScoreDemo.tsx](components/ScoreDemo.tsx) | 117 (✓/✗ chips), 170-171 (🔧 + ▲) | 5 |
| [components/ProLock.tsx](components/ProLock.tsx) | 21 (🔒) | 2 |
| [app/trends/research/page.tsx](app/trends/research/page.tsx) | 130 (🔬), 400/406/413 (⚡✦📋) | ~19 |
| [app/tiktok-hook-generator/page.tsx](app/tiktok-hook-generator/page.tsx) | 20-23 — **les exemples de hooks eux-mêmes commencent par 🔥⚠️🤯💸❌🧠⚡🚀💡** | ~12 |
| [app/saved/page.tsx](app/saved/page.tsx) / [app/history/page.tsx](app/history/page.tsx) | badges + empty states | 6 / 8 |
| [lib/niches.ts](lib/niches.ts) / [lib/sourceBadges.ts](lib/sourceBadges.ts) | `emoji:` champ structurel de la data — l'emoji est institutionnalisé dans le modèle de données | — |

Total produit : **150+ emojis-icônes**. Aucune bibliothèque d'icônes installée.

### 2b. Titres staccato / copy LLM

- [pricing/page.tsx:28-29](app/pricing/page.tsx:28) — "**One plan.** / **Everything unlocked.**"
- [page.tsx:277-278](app/page.tsx:277) — "**Stop losing viewers.** / **Start keeping them.**"
- [page.tsx:71-73](app/page.tsx:71) — "Score your hook in **5 seconds.** Fix it in one click." (structure X. Y. Z.)
- [page.tsx:263](app/page.tsx:263) — "One viral hook, broken down. / Every week."
- [generator/page.tsx:471](app/generator/page.tsx:471) — "**Go Pro. Go Viral. 🚀**" (le pire du site)
- [page.tsx:159](app/page.tsx:159) / [177](app/page.tsx:177) — "The same idea, ~rewritten to score~." / "From idea to a ~scroll-stopping hook~. Step by step." — le pattern "phrase, gradient sur 2 mots, point"
- [tiktok-hook-generator:129](app/tiktok-hook-generator/page.tsx:129) — "How to Write Viral TikTok Hooks **in 2025**" — on est en 2026, contenu SEO daté visible.
- Placeholders "e.g. …" verbeux ([analyzer:280](app/analyzer/page.tsx:280), [generator:184](app/generator/page.tsx:184)).

### 2c. Le tableau comparatif ✕/✓

[page.tsx:80-92](app/page.tsx:80) — chips "✕ ChatGPT — Generic text, no platform logic" / "✓ HookViral — 8 viral formulas + virality score". En plus d'être un marqueur IA, il contient `background: rgba(255,255,255,.04)` (ligne 86) — un blanc translucide **sur fond blanc** : le chip ChatGPT est invisible en light mode (thème par défaut). Il annonce aussi "8 viral formulas" alors que le vocabulaire produit officiel est "9 attention patterns" ([page.tsx:26](app/page.tsx:26) dit 9 trois écrans plus bas).

### 2d. Rythme de sections identique

Chaque section de la home = `SLabel` (kicker uppercase avec tirets décoratifs, [page.tsx:385-393](app/page.tsx:385)) + H2 avec un mot en gradient + paragraphe centré gris 300 + grid de cartes. Les pages SEO plateforme répètent : hero centré + badge pill + grid de cartes + FAQ + CTA final en carte. `NextStep` ferme chaque page avec le même stepper. Aucune section ne casse la grille (pas de pleine largeur, pas d'asymétrie, pas d'image, pas de vraie typographie éditoriale).

### 2e. Autres tics
- Curseur custom qui grossit au hover ([Nav.tsx:36-118](components/Nav.tsx:36)) — gadget de template, cassé en light (ring `rgba(255,255,255,.12)` invisible sur blanc, [Nav.tsx:109](components/Nav.tsx:109)).
- Orbes `blur(100-130px)` en `position:fixed` sur 4 pages (réfs §1).
- `MOST POPULAR` sur l'unique plan payant ([pricing:90](app/pricing/page.tsx:90)) — populaire par rapport à quoi ? Marqueur "pricing page générée".
- Micro-animations partout : `pulseGlow` sur le badge hero, float des phones, `cardIn` stagger, compteurs rAF — chacune est bien faite, leur *accumulation* est le tic.

---

## 3. UX / Conversion

**Hero surchargé — 6 messages en compétition.** Badge pill + H1 + sous-titre + comparatif ChatGPT + 3 PersonaCards (avec 3 CTA) + ligne de réassurance + 4 mini-stats + phone mockup animé. Plus le CTA nav "Score my hook →". Un visiteur a **5 boutons** au-dessus de la ligne de flottaison. Les PersonaCards sont une bonne idée de fond (mapping état mental → outil), mais posées *en plus* de tout le reste au lieu d'*être* le hero.

**Nav à 8 entrées plates** ([Nav.tsx:19-28](components/Nav.tsx:19)) : Home · Analyze · Trends · Saved · Generate · Patterns · Pricing · History + CTA. "Saved" et "History" (pages localStorage perso, vides pour un nouveau visiteur) pèsent autant que les outils. À 8 items + toggle + CTA, plus rien n'est prioritaire. `/why-it-works` ("Start here" — la page d'orientation !) n'est **pas dans la nav**.

**Pricing : le bouton payant fait `alert("Connect your Stripe keys to activate!")`** ([pricing/page.tsx:212](app/pricing/page.tsx:212)). En production. Un visiteur qui clique "Get Pro" voit un message développeur dans une alerte native. C'est le problème de conversion n°1 du site — pire que n'importe quel souci esthétique.

**Incohérence Pro généralisée.** `isPro()` retourne `true` (voulu, pré-Stripe), mais l'UI vend quand même du lock : badges "PRO" sur les CTA Research ([trends:459](app/trends/page.tsx:459), [analyzer:592](app/analyzer/page.tsx:592)), "PRO FEATURE" sur le script ([generator:272](app/generator/page.tsx:272)), pricing qui liste des restrictions Free ("1 rewrite style") qui ne sont pas appliquées. Le visiteur voit des cadenas ouverts et une page pricing qui décrit un autre produit.

**Positionnement plateforme contredit dans le produit.** Le hero promet "Built for TikTok, Reels & YouTube Shorts" ([page.tsx:77](app/page.tsx:77)) mais : le phone mockup de démo cycle un hook **LinkedIn** ([page.tsx:18](app/page.tsx:18)) ; Generator et Analyzer proposent **LinkedIn et X/Twitter** comme plateformes ([generator:17](app/generator/page.tsx:17), [analyzer:19](app/analyzer/page.tsx:19)) alors que `lib/platforms.ts` ne définit la psychologie que pour tiktok/reels/shorts. Note : les pages SEO plateforme linkent `?platform=tiktok|shorts|reels` (slugs) tandis que le Generator attend `"TikTok"` (labels) — le prefill `?platform=shorts` ne matche aucun bouton.

**Double footer sur la home** : la section CTA finale a sa propre rangée Terms/Privacy/TikTok Hooks ([page.tsx:287-291](app/page.tsx:287)) immédiatement suivie du `Footer` global (Terms • Privacy • ©) rendu par le layout. Deux rangées de liens légaux qui se suivent.

**Credit bar trop bavarde** ([generator:160-179](app/generator/page.tsx:160)) : compteur + "X left today" + lien Pro + barre de progression + ligne "Free: X remaining / Pro: ∞ unlimited" = 4 rappels de la limite avant même de générer.

**Bons points à préserver** : le pattern `<details>More options ▾` (defaults > knobs), le NextStep anti-dead-end, le widget analyze sur la home (aha en 1 étape), le 3-second check live de l'Analyzer, l'état de chargement skeleton des Trends.

---

## 4. Cohérence / dette CSS

**Aucun composant Button.** Le style "pill gradient hot→electric, padding ~13px 26px, radius 100px" est copié-collé **~30 fois** (page.tsx ×8, Nav ×2, NextStep, analyzer ×6, generator ×4, trends ×2, pricing ×2, pages SEO ×6…). Chaque bouton secondaire (border border2 + soft) est aussi réécrit à la main. Toute évolution du CTA = 30 fichiers-endroits.

**`scoreColor()` définie 4 fois avec des seuils divergents** : [page.tsx:30](app/page.tsx:30) et [generator:35](app/generator/page.tsx:35) → `93/88`, [analyzer:82](app/analyzer/page.tsx:82) → `93/80`, [hooks-for:42](app/hooks-for/[niche]/page.tsx:42) → `93/88`, widget home ([page.tsx:508](app/page.tsx:508)) → `90/78`. **Le même score 85 est vert-or sur une page et rouge sur une autre.** Pour un produit dont la promesse EST le score, c'est un bug de crédibilité.

**`patternHref()` dupliquée 3×** ([page.tsx:9](app/page.tsx:9), [analyzer:14](app/analyzer/page.tsx:14), [generator:12](app/generator/page.tsx:12)). Spinner inline dupliqué 6×. `EmailCapture`/`HomeAnalyzeWidget` enfermés dans page.tsx. Deux bezels de téléphone différents (`PhoneMockup` inline [page.tsx:315-382](app/page.tsx:315) vs `PhoneFrame` partagé).

**Couleurs hardcodées hors thème** : `#9B8CFF`, `#C4B5FD`, `#FF9DB8`, `#FF7DA0`, `#7EB6E8`… (~20 hex inline). Ce sont des pastels calibrés pour fond sombre, servis aujourd'hui sur fond blanc : les chips plateforme du Generator ([generator:451](app/generator/page.tsx:451)) et les liens "✦ Analyze" ([analyzer:778](app/analyzer/page.tsx:778)) sont en `#C4B5FD` sur blanc ≈ ratio 1.6:1 — illisibles et non conformes WCAG alors que les tokens du thème, eux, ont été soigneusement audités. Idem `rgba(255,255,255,.04)` (comparatif ChatGPT) et le curseur ring.

**Hover en JS** : `useState(hov)` + `onMouseEnter/Leave` répété dans ~15 composants (PersonaCard, HLink, PCard, FreeBtn, ProBtn, Chip, ActionBtn, HookCard, TrendCard…) parce que les inline styles ne peuvent pas exprimer `:hover`. Re-render React à chaque survol, zéro `:focus-visible`, et 3× plus de code que nécessaire.

**Morts / vestiges** : [page.module.css](app/page.module.css) entier (starter Next.js), keyframes `fadeUp`, `marqueeScroll`, `blink` ([globals.css:190, 213, 209](app/globals.css:190)) non référencées, `lib/credits.ts` et `lib/prompt.ts` non importés (déjà documenté CLAUDE.md), deux taxonomies de niches (NICHES legacy vs NICHE_MODES).

---

## 5. Technique rapide

**SEO**
- ✅ Sitemap, robots, JSON-LD, metadata racine riche, layouts serveur par page client : solide.
- ❌ [privacy](app/privacy/page.tsx) et [terms](app/terms/page.tsx) n'exportent aucune `metadata` → ils **héritent `canonical: "/"`** du layout racine ([layout.tsx:54](app/layout.tsx:54)) : deux pages déclarent être la home. [history](app/history/page.tsx) est `"use client"` sans layout → même problème + indexable alors que c'est une page localStorage perso (Saved a son layout noindex, History non).
- ❌ Fonts en `@import` CSS ([globals.css:1](app/globals.css:1)) : render-blocking, pas de subsetting, requête tierce Google (RGPD). `next/font` existe pour ça.
- ⚠️ "2025" dans le contenu SEO TikTok ([tiktok-hook-generator:23, 129](app/tiktok-hook-generator/page.tsx:129)).

**Accessibilité**
- FAQ pricing : `div onClick` sans `<button>`, sans `aria-expanded`, inaccessible clavier ([pricing:146](app/pricing/page.tsx:146)).
- Hamburger et theme toggle sans `aria-label` ([Nav.tsx:185](components/Nav.tsx:185), [166](components/Nav.tsx:166)).
- `outline: none` sur les textareas/inputs sans style de focus de remplacement ([analyzer:282](app/analyzer/page.tsx:282), [generator:185](app/generator/page.tsx:185), [page.tsx:518, 639](app/page.tsx:518)) — navigation clavier aveugle.
- Aucun `:focus-visible` nulle part (conséquence des inline styles).
- Hex hardcodés sous 4.5:1 en light (§4) — le 100 Lighthouse a été obtenu sur les pages/états audités, pas sur ces états-là.

**Perf / bugs**
- Le curseur custom ([Nav.tsx:82-90](components/Nav.tsx:82)) : `MutationObserver` qui, à **chaque mutation du DOM**, re-parcourt tous les `button,a,input,textarea,select` de la page et ré-attache des listeners (jamais retirés des nœuds). Sur les pages à résultats dynamiques (8 hook cards, 100 trend cards), c'est du travail quadratique pour un gadget invisible en light mode.
- `alert()` Stripe ([pricing:212](app/pricing/page.tsx:212)) — bug de prod côté visiteur.
- Prefill plateforme cassé entre pages SEO et Generator (slug vs label, §3).
- Pas de nav dupliquée constatée (l'exemple du brief) ; le doublon réel est le footer de la home (§3).

---

## Verdict

Le fond du produit est bon : la boucle Trends→Generate→Analyze→Patterns est intelligente, le copy long est honnête, l'infra SEO est sérieuse. Mais la peau du site est un template SaaS néon 2024 passé au thème light sans être re-designé : 4 couleurs d'accent simultanées, un gradient animé sur chaque titre, 150 emojis en guise d'icônes, 30 tailles de police, zéro composant partagé, et un bouton d'achat qui ouvre une `alert()`. Rien de tout ça n'est structurel — c'est une couche de refactoring visuel, pas une refonte. Voir [FIXES.md](FIXES.md) et [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).
