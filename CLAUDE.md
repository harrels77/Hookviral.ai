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
- **Rate-limiting in-memory = best-effort sur serverless** (mémoire par instance). À migrer vers un store durable (Upstash/Vercel KV) AVANT lancement public payant. Voir commentaire dans `lib/rateLimit.ts`.
- Logique de crédits dupliquée entre `generator/page.tsx` et `lib/credits.ts` (la lib n'est toujours pas utilisée).
- `lib/prompt.ts` non importé (la route API a son propre prompt inline, plus complet).
- Parsing JSON fragile dans les routes API (message d'erreur trompeur "Check your API key").
- Pas de `.env` local : `ANTHROPIC_API_KEY` absente → flux génération non testable end-to-end en local.
