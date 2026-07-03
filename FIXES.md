# FIXES — plan priorisé (ratio impact/effort décroissant)

Réf. détaillée : [AUDIT.md](AUDIT.md). Règles cibles : [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

1. **[Impact: haut] [Effort: 0.5h] [app/pricing/page.tsx:212]**
   Supprimer l'`alert("Connect your Stripe keys…")`. Remplacer le bouton Pro par un état honnête : "Pro arrive bientôt — laisse ton email" branché sur `/api/subscribe` (source `pricing-pro`). Retirer le badge "MOST POPULAR" (un seul plan payant).

2. **[Impact: haut] [Effort: 2h] [app/page.tsx:80-92, 16-19, 277-278 · app/generator/page.tsx:471 · app/pricing/page.tsx:28]**
   Purge copy "IA" : supprimer le comparatif ✕ ChatGPT / ✓ HookViral (invisible en light de toute façon) ; réécrire les 4 titres staccato en phrases pleines (règles DS §7) ; remplacer les DEMO_HOOKS emoji-préfixés + le hook LinkedIn par des hooks TikTok/Reels/Shorts sans emoji ; tuer "Go Pro. Go Viral. 🚀".

3. **[Impact: haut] [Effort: 3-4h] [~20 fichiers, nouveau lib/icons.tsx]**
   Installer `lucide-react`, créer un module d'icônes unique (taille/stroke fixés, DS §5) et remplacer les ~150 emojis-icônes UI : ✦→Sparkles, 🔬→Microscope/Search, ⚡→Zap, 🔒→Lock, ★/☆→Star, 🔥→Flame, ↻→RefreshCw, ✓/✕→Check/X, ⏱→Timer, ☀/🌙→Sun/Moon, ▶→Play, 📋→Clipboard, etc. Les emojis de *data* (`lib/niches.ts`, `lib/sourceBadges.ts`, `take.emoji`) migrent vers des noms d'icônes dans une passe dédiée du même chantier.

4. **[Impact: haut] [Effort: 2h] [nouveau lib/score.ts + components/ui.tsx · page.tsx:9,30 · analyzer:14,82 · generator:12,35 · hooks-for:42]**
   Unifier `scoreColor()` (UN seuil canonique, DS §3) et `patternHref()` dans `lib/score.ts` / `lib/patterns.ts`. Le même score doit avoir la même couleur partout — c'est la promesse du produit.

5. **[Impact: haut] [Effort: 3h] [nouveau components/ui/Button.tsx + CSS · ~30 occurrences]**
   Créer `Button` (variants: primary / secondary / ghost, tailles sm/md) en classes CSS (`.btn`, `.btn-primary`…) avec `:hover` et `:focus-visible` natifs. Remplacer les 30 pills copiées-collées et supprimer les `useState(hov)` associés (HLink, FreeBtn, ProBtn, ActionBtn…).

6. **[Impact: haut] [Effort: 1h] [components/Nav.tsx:36-118]**
   Supprimer entièrement le curseur custom (ring + MutationObserver). Gadget de template, invisible en light mode, coût perf réel. Personne ne le regrettera.

7. **[Impact: haut] [Effort: 2h] [app/globals.css + ~15 fichiers]**
   Réduire la palette à UNE couleur signature + sémantiques (DS §3) : le gradient ne survit que sur le CTA primaire et le logo ; `.gradient-text` limité au H1 de la home, sans animation ; les sub-scores/stats/chips passent en neutre + accent. Supprimer les hex hardcodés hors-thème (#C4B5FD, #9B8CFF, #FF9DB8… → tokens).

8. **[Impact: moyen] [Effort: 1h] [app/layout.tsx:1 + app/globals.css:1]**
   Migrer Syne + DM Sans vers `next/font/google` (subset latin, `display: swap`, variables `--fd`/`--fb`). Supprime le render-blocking et la requête Google Fonts (RGPD).

9. **[Impact: moyen] [Effort: 1h] [app/privacy/page.tsx · app/terms/page.tsx · app/history/ · app/page.tsx:287-291]**
   Metadata propres (title + canonical) sur privacy/terms ; `layout.tsx` noindex pour History (miroir de Saved) ; supprimer la rangée Terms/Privacy dupliquée de la home (le Footer global suffit).

10. **[Impact: moyen] [Effort: 2h] [app/globals.css + toutes pages]**
    Poser les tokens d'échelle (DS §2, §4) : ~8 tailles de texte, ~8 espacements, 3 radius + pill. Passe mécanique de remap des 30+ fontSize et paddings arbitraires vers les tokens. Réduire les micro-kickers uppercase : garder max 1 par section, taille plancher .75rem.

11. **[Impact: moyen] [Effort: 1.5h] [components/Nav.tsx:19-28]**
    Alléger la nav : `Analyze · Generate · Trends · Patterns · Pricing` + CTA. Saved/History regroupés sous une entrée "Library" (ou icône) ; ajouter "Start here" (/why-it-works) au footer et au menu mobile. Ajouter `aria-label`/`aria-expanded` sur hamburger et theme toggle.

12. **[Impact: moyen] [Effort: 1.5h] [app/generator/page.tsx:17 · app/analyzer/page.tsx:19 · app/page.tsx:16-19]**
    Aligner les plateformes sur le positionnement : TikTok / Reels / Shorts uniquement (slugs de `lib/platforms.ts` comme source de vérité). Corrige au passage le prefill cassé `?platform=shorts` (slug vs label) depuis les pages SEO.

13. **[Impact: moyen] [Effort: 1h] [app/pricing/page.tsx:146 · inputs partout]**
    Accessibilité : FAQ pricing en `<button aria-expanded>` ; style `:focus-visible` global (ring 2px accent) dans globals.css ; retirer les `outline:none` sans remplacement sur textarea/input.

14. **[Impact: bas] [Effort: 1h] [app/page.tsx:47-50 · analyzer:259-261 · generator:144-147 · trends:214-216]**
    Supprimer les orbes floutés fixes des 4 pages (ou les réduire à un seul dégradé statique très léger sur la home). Calmer les hovers : `translateY(-2px)` max, pas de glow 40px.

15. **[Impact: bas] [Effort: 0.5h] [app/page.module.css · app/globals.css:190,209,213 · app/tiktok-hook-generator/page.tsx:129]**
    Ménage : supprimer `page.module.css` (starter mort), les keyframes `fadeUp`/`marqueeScroll`/`blink` inutilisées, et remplacer "in 2025" par "in 2026" (ou libellé non daté) dans le contenu SEO.
