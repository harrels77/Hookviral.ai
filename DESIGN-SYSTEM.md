# DESIGN-SYSTEM — HookViral
*Référence permanente. Toute modification UI future doit se conformer à ce document. En cas de conflit avec du code existant, ce document gagne.*

## 0. Principe directeur

**Un outil de mesure, pas un poster néon.** HookViral vend un score et un diagnostic ; l'interface doit avoir l'autorité calme d'un instrument (Linear, Stripe, Vercel) — pas l'énergie d'une landing page qui crie. La couleur signale, elle ne décore pas. Une seule chose brille par écran : le résultat.

---

## 1. Typographie

**Titres : Syne** (700–800). Conservée : elle est déjà la voix de la marque (wordmark) et elle a du caractère. Le problème n'était pas la police mais son usage en micro-étiquettes de 9px.
**Corps : DM Sans** (400, 500). Le poids 300 est **supprimé** — trop fragile sur fond clair.

Chargement : `next/font/google` exclusivement (subset latin, `display: swap`), exposées en `--fd` / `--fb`. Jamais d'`@import` CSS.

Règles d'usage :
- Syne uniquement à partir de `--text-lg` (1.25rem). En dessous → DM Sans.
- Letter-spacing : `-0.02em` sur les titres ≥ 2rem, `0` partout ailleurs. Les valeurs à -3px / +3px sont interdites.
- Uppercase + letter-spacing (kicker) : autorisé **une fois par section maximum**, taille plancher `--text-xs`, en DM Sans 600 — jamais en Syne.
- Corps de texte : DM Sans 400, `--text-base`, line-height 1.6, couleur `--text-soft`.

*(Si un jour la marque veut repartir de zéro : Bricolage Grotesque titres / Inter… non — DM Sans corps. Mais ce n'est pas le chantier actuel.)*

## 2. Échelle typographique (8 crans, aucune autre valeur)

| Token | Valeur | Usage |
|---|---|---|
| `--text-xs` | 0.75rem | légendes, badges, meta |
| `--text-sm` | 0.875rem | texte secondaire, chips, boutons sm |
| `--text-base` | 1rem | corps, inputs, boutons |
| `--text-lg` | 1.25rem | titres de carte (Syne 700) |
| `--text-xl` | 1.5rem | H3 / titres de panneau |
| `--text-2xl` | 2rem | H2 de section |
| `--text-3xl` | 2.75rem | H1 de page |
| `--text-4xl` | clamp(2.75rem, 5vw, 3.75rem) | H1 home uniquement |

Interdit : toute `fontSize` littérale dans le JSX. Les `.54rem`–`.72rem` actuels remontent tous à `--text-xs`.

## 3. Couleur (tokens complets)

**Une seule couleur signature : `--accent` (framboise).** L'électrique violet est rétrogradé : il ne survit que dans le dégradé du logo et du CTA primaire. Vert/or/rouge deviennent des couleurs *sémantiques* réservées au sens (score, états), jamais décoratives.

```css
:root { /* LIGHT (défaut) */
  --bg:          #FAFAFC;   /* fond page — moins lavande que l'actuel */
  --surface:     #FFFFFF;   /* cartes */
  --surface-2:   #F2F2F7;   /* panneaux imbriqués, inputs */
  --border:      #E3E3EC;
  --border-strong:#C9C9DA;

  --text:        #101019;   /* titres, chiffres */
  --text-soft:   #454458;   /* corps */
  --text-muted:  #6B6A83;   /* meta — AA sur --surface */

  --accent:      #C9134B;   /* signature. CTA, liens, actif */
  --accent-hover:#A80F3E;
  --accent-soft: #FDEEF3;   /* fonds de chips/badges accent */
  --on-accent:   #FFFFFF;

  /* Sémantique — réservée au SENS (scores, états), jamais au décor */
  --success:     #0A7D5C;  --success-soft: #E7F6F0;   /* score fort, confirmations */
  --warning:     #8A6100;  --warning-soft: #FBF3E0;   /* score moyen, patterns manquants */
  --danger:      #B42318;  --danger-soft:  #FDEBE9;   /* score faible, erreurs */

  --focus:       #2E5AAC;  /* ring :focus-visible, jamais autre chose */
}
[data-theme="dark"] {
  --bg: #0B0B10; --surface: #131320; --surface-2: #1A1A2A;
  --border: #23233560; --border-strong: #32324A;
  --text: #F2F1F8; --text-soft: #B7B5C9; --text-muted: #8E8CA6;
  --accent: #FF3D71; --accent-hover: #FF6390; --accent-soft: #2A1220; --on-accent: #14060C;
  --success: #34D399; --success-soft: #0C2A1F;
  --warning: #FBBF24; --warning-soft: #2A2208;
  --danger:  #F87171; --danger-soft:  #2C1210;
  --focus:   #7AA2E8;
}
```

Règles :
- **Interdit** : hex ou rgba littéral dans le JSX. Tout passe par un token (les alphas via `color-mix(in srgb, var(--accent) 12%, transparent)`).
- Le dégradé `accent → violet` n'existe qu'à **2 endroits** : wordmark et bouton primaire. Nulle part ailleurs (pas de titres, pas de barres, pas de numéros).
- `gradient-text` : H1 de la home uniquement, statique (pas d'animation infinie).
- Score : un seul barème global (`lib/score.ts`) — `≥ 85 = --success`, `60–84 = --warning`, `< 60 = --danger`. Les chiffres de score sont la SEULE grosse couleur d'un écran de résultat.
- Toute couleur sur du texte < 1.5rem doit passer AA 4.5:1 dans les deux thèmes.

## 4. Espacement, rayons, élévation

**Échelle 4px** : `--sp-1: 4px · 2: 8px · 3: 12px · 4: 16px · 5: 24px · 6: 32px · 7: 48px · 8: 64px · 9: 96px`. Aucun padding/margin hors échelle.
- Padding de carte : `--sp-5`. Gap de grille : `--sp-3`. Rythme entre sections : `--sp-9` (desktop) / `--sp-7` (mobile).

**Rayons — 3 valeurs + pill** : `--r-sm: 8px` (chips, inputs), `--r-md: 14px` (cartes), `--r-lg: 20px` (modales, panneaux hero), `--r-pill: 999px` (**boutons et badges uniquement** — pas les inputs, pas les banners, pas les cartes).

**Élévation** : `--shadow-1: 0 1px 2px rgb(16 16 25 / .06)` (repos), `--shadow-2: 0 8px 24px rgb(16 16 25 / .10)` (hover, modales). Pas de glows colorés de 40px.

**Mouvement** : transitions 150–250ms `ease-out`. Hover carte : `translateY(-2px)` max + `--shadow-2`. Une seule animation d'entrée par vue. Pas d'animation infinie hors spinner. `prefers-reduced-motion` respecté partout (déjà acquis — le garder).

## 5. Icônes

- **Lucide uniquement** (`lucide-react`). Aucun emoji dans l'UI, aucun caractère unicode décoratif (→ ▲ ✓ ★ ✕ inclus — Lucide a `ArrowRight`, `TrendingUp`, `Check`, `Star`, `X`).
- **Exception unique : les marques tierces** (TikTok, Instagram, YouTube, Google, Reddit, Bluesky, HN, Wikipedia, X) sont désignées par leur logo officiel monochrome via `components/BrandIcon.tsx` (`simple-icons`, teinté `currentColor`, couleur = `SOURCE_BADGES.color`). Jamais d'emoji, jamais de logo couleur multi-teintes, jamais Lucide pour une marque.
- Tailles : **16px** dans le texte/boutons, **20px** autonome. Rien d'autre.
- `strokeWidth: 1.75` partout, couleur `currentColor` (jamais de couleur propre).
- Une icône accompagne, elle ne remplace pas un mot (exception : actions universelles Copy/Close/Star avec `aria-label`).
- Mapping canonique dans `lib/icons.tsx` — un import unique, personne n'importe Lucide directement dans une page.
- Les emojis restent tolérés **uniquement** comme *donnée* affichée si elle vient du contenu (ex : un titre de trend Bluesky qui en contient). Jamais comme chrome d'interface, y compris `lib/niches.ts` et `lib/sourceBadges.ts` (à migrer vers des icônes/lettres).

## 6. Composants (source unique)

- `Button` : variants `primary` (fond accent — le dégradé logo→CTA est le seul dégradé autorisé), `secondary` (border), `ghost`. Tailles `sm`/`md`. États hover/active/disabled/focus-visible en **CSS**, pas en `useState`.
- `Chip` (filtre/toggle) : un seul composant, état actif = `--accent-soft` + texte `--accent`. Fini les 4 palettes par type.
- `ScoreBadge` : chiffre + /100, couleur via `lib/score.ts`. Seul affichage autorisé d'un score.
- `SectionHeading` : kicker optionnel + H2 + lede. Remplace SLabel et ses variantes.
- `Card` : surface + border + radius `--r-md` + padding `--sp-5`.
- Interdiction de redéfinir localement un de ces composants dans une page.

## 7. Rédaction des titres (règles dures)

1. **Interdit : le staccato en fragments.** Jamais deux/trois fragments de ≤ 3 mots terminés par un point ("One plan. Everything unlocked.", "Go Pro. Go Viral."). Un titre = une phrase ou un syntagme complet.
2. Interdit : le point final sur un titre.
3. Interdit : l'emoji dans un titre, un bouton ou un label.
4. Interdit : le pattern "phrase — mot en dégradé — point".
5. Un titre dit ce que la section **fait pour l'utilisateur**, avec un verbe si possible : "Vois ton hook réécrit et re-scoré" plutôt que "Watch the fix happen".
6. Superlatifs internes interdits ("MOST POPULAR" sur un plan unique, "viral" en épithète réflexe). Les chiffres autorisés sont ceux du produit (8 hooks, 0–100, 9 patterns).
7. Micro-labels : des mots pleins ("Platform", "Missing patterns"), pas des exclamations ni de la ponctuation décorative (＋, ▾ remplacé par `ChevronDown`).
8. Une idée par phrase ; pas plus d'un tiret cadratin par paragraphe.

## 8. Patterns INTERDITS (liste noire)

1. Emoji comme icône d'interface (voir §5).
2. Tableau/chips comparatifs "✕ Concurrent / ✓ Nous".
3. `.gradient-text` animé ; dégradé sur autre chose que logo + CTA primaire.
4. Orbes flottants floutés en arrière-plan.
5. Curseur custom / cursor-follower.
6. Plus d'une couleur d'accent décorative par écran (la sémantique de score ne compte pas).
7. `fontSize`, couleur, padding, radius littéraux dans le JSX — tokens obligatoires.
8. Hover géré par `useState` + inline style ; `outline: none` sans `:focus-visible` de remplacement.
9. Micro-texte < 0.75rem ; uppercase-tracking plus d'une fois par section.
10. Badge "PRO" / cadenas sur une feature actuellement gratuite (tant que `isPro()` = true, l'UI ne vend pas de lock).
11. `alert()` / `confirm()` natifs face au visiteur.
12. Titres staccato multi-fragments (§7.1) et titres à point final.
13. Pill radius sur les cartes, inputs ou banners (boutons/badges seulement).
14. Nouvelle animation infinie ; toute animation sans variante `prefers-reduced-motion`.
15. Dupliquer un utilitaire existant (`scoreColor`, `patternHref`, spinner, bouton) au lieu de l'importer.

## 9. Rappels de fond (inchangés)

Honnêteté : pas de fausses stats, pas de faux témoignages, pas de compteurs inventés — le design system ne doit jamais servir à faire croire à une traction qui n'existe pas. Defaults > knobs. Soustraction > addition : chaque élément visuel doit justifier sa charge cognitive, sinon il saute.
