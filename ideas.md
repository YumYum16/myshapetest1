# MyShape — Brainstorm Design

## Contexte
Application web premium d'optique IA : détection de morphologie faciale + recommandations de lunettes AR.
Public cible : adultes 25-45 ans, sensibles au style, cherchant des lunettes en ligne.
Objectif : conversion maximale → essai caméra → clic affilié.

---

<response>
<probability>0.07</probability>
<idea>

## Approche 1 : Atelier d'Optique Japonais (Wabi-Sabi Moderniste)

**Design Movement:** Wabi-Sabi minimalisme japonais rencontrant le design éditorial suisse

**Core Principles:**
1. Espace négatif comme élément de design actif — chaque pixel vide est intentionnel
2. Asymétrie structurée : les grilles se brisent délibérément pour créer de la tension visuelle
3. Typographie comme architecture — les titres sont des sculptures, pas des étiquettes
4. Texture subtile : grain de papier japonais, pas de surfaces plastiques

**Color Philosophy:**
- Fond : #F7F4EE (crème chaud, évoque le papier washi)
- Texte : #1A1714 (presque noir, encre de Chine)
- Accent : #8B6914 (or brûlé, comme les montures en écaille)
- Secondaire : #4A5E52 (vert sauge, nature et sérénité)
- Émotion : luxe artisanal, confiance, authenticité

**Layout Paradigm:**
- Navigation en barre latérale gauche fixe sur desktop, hamburger sur mobile
- Hero en pleine hauteur avec titre en diagonale (transform: rotate(-2deg))
- Sections alternant pleine largeur et colonnes décalées (offset grid)
- Pas de centrage systématique — les éléments "respirent" asymétriquement

**Signature Elements:**
1. Lignes fines horizontales (1px, couleur or) séparant les sections comme des règles typographiques
2. Numéros de section en grand format transparent en arrière-plan (01, 02, 03...)
3. Montures de lunettes dessinées en SVG ligne fine flottant en décoration

**Interaction Philosophy:**
- Hover sur les cartes : légère élévation + rotation 1deg (effet objet physique)
- Curseur personnalisé : cercle vide qui se remplit au survol des CTA
- Scroll : parallaxe subtil sur les éléments décoratifs SVG

**Animation:**
- Entrée de page : fade-in de 0.6s avec légère translation Y (20px → 0)
- Stagger des cartes : délai de 0.1s entre chaque
- CTA button : border qui se trace au hover (stroke-dashoffset animation)
- Aucune animation flash ou bounce — tout est lent, délibéré, organique

**Typography System:**
- Display : DM Serif Display (italic pour les titres héros)
- Body : Figtree 400/500 (lisibilité maximale)
- Accent : DM Serif Display regular pour les sous-titres
- Hiérarchie : 72px / 48px / 32px / 18px / 14px

</idea>
</response>

<response>
<probability>0.08</probability>
<idea>

## Approche 2 : Laboratoire d'Optique Futuriste (Tech-Luxe Émeraude)

**Design Movement:** Bauhaus fonctionnel rencontrant l'esthétique des marques de lunettes premium (Lindberg, Mykita)

**Core Principles:**
1. Fonctionnalité visible : l'interface montre comment elle fonctionne (landmarks, grilles de mesure)
2. Contraste fort entre zones sombres (caméra/tech) et zones claires (contenu/shopping)
3. Précision chirurgicale : chaque espacement est un multiple de 8px, aucun arrondi excessif
4. La couleur émeraude (#0D6E4F) comme signal de confiance et de technologie médicale

**Color Philosophy:**
- Fond principal : #FAFAF8 (blanc cassé optique)
- Zones tech/dark : #0F1A17 (vert très sombre, presque noir)
- Accent primaire : #0D6E4F (émeraude profond)
- Accent secondaire : #E8F5F0 (émeraude très clair pour les badges)
- Texte : #1C2B26 (vert très sombre)
- Émotion : confiance médicale, précision, innovation verte

**Layout Paradigm:**
- Navigation top fixe avec fond transparent → opaque au scroll
- Hero en deux colonnes : texte à gauche (60%), démo caméra à droite (40%)
- Sections en bandes alternées : fond blanc / fond émeraude très clair
- Catalogue en grille masonry (pas de grille uniforme)

**Signature Elements:**
1. Grille de points (dot grid) en arrière-plan des sections tech, comme du papier millimétré
2. Tags/badges en forme de pilule avec bordure émeraude
3. Indicateurs de progression circulaires pour les étapes "Comment ça marche"

**Interaction Philosophy:**
- Hover sur les montures : zoom léger + apparition d'un badge "Essayer en live"
- Boutons CTA : fond émeraude avec shimmer animation au hover
- Cards : ombre portée qui s'intensifie au hover (box-shadow transition)

**Animation:**
- Scroll reveal : éléments qui montent de 30px avec opacity 0→1
- Hero : texte qui apparaît mot par mot (stagger 0.05s par mot)
- Caméra loading : animation de scan avec lignes vertes
- Transitions de page : slide horizontal

**Typography System:**
- Display : Playfair Display Bold (titres héros, impact visuel)
- Body : DM Sans 400/500 (clarté technique)
- Mono : pour les données de landmarks (font-mono)
- Hiérarchie : 64px / 44px / 28px / 16px / 13px

</idea>
</response>

<response>
<probability>0.06</probability>
<idea>

## Approche 3 : Maison de Couture Optique (Editorial Luxe Ambré)

**Design Movement:** Éditorial de mode haute couture rencontrant le minimalisme Scandinavian

**Core Principles:**
1. Typographie expressive : les titres occupent 70% de l'espace visuel, comme les couvertures de Vogue
2. Photographie/illustration en pleine page, texte superposé avec contraste maîtrisé
3. Palette restreinte : 3 couleurs maximum, utilisées avec intention
4. Rythme éditorial : sections courtes et percutantes, jamais de blocs de texte denses

**Color Philosophy:**
- Fond : #FAFAF8 (blanc optique)
- Accent chaud : #C8860A (ambre riche, or des montures premium)
- Texte : #1A1A1A (noir profond)
- Neutre : #F0EDE8 (sable clair pour les fonds de section)
- Émotion : luxe accessible, style parisien, confiance éditoriale

**Layout Paradigm:**
- Navigation ultra-minimaliste : logo à gauche, 3 liens + CTA à droite, fond transparent
- Hero pleine hauteur avec titre en très grand (clamp 80px-120px), centré mais avec décalage vertical
- Sections en "magazine layout" : alternance image gauche/texte droite et inverse
- Footer minimaliste sur fond noir

**Signature Elements:**
1. Lignes verticales fines (1px ambre) comme séparateurs de colonnes dans les sections
2. Numérotation romaine (I, II, III) pour les étapes
3. Montures présentées sur fond neutre avec ombre douce, comme dans un catalogue de luxe

**Interaction Philosophy:**
- Hover sur les CTA : fond ambre qui se remplit de droite à gauche (clip-path animation)
- Images de montures : zoom très lent au hover (scale 1.02, 0.8s ease)
- Navigation : underline qui glisse sous le lien actif

**Animation:**
- Page load : logo qui apparaît en premier, puis le reste en cascade
- Scroll : sections qui révèlent leur contenu avec un masque qui glisse (clip-path reveal)
- Bouton CTA principal : pulsation très subtile (scale 1→1.02→1, 3s loop)

**Typography System:**
- Display : Cormorant Garamond 700 Italic (titres héros, élégance absolue)
- Sub-display : Cormorant Garamond 400 (sous-titres)
- Body : Figtree 400 (lisibilité, modernité)
- Hiérarchie : 96px / 52px / 32px / 17px / 13px

</idea>
</response>

---

## Choix Final : Approche 2 — Laboratoire d'Optique Futuriste (Tech-Luxe Émeraude)

**Justification :** L'émeraude profond (#0D6E4F) crée une identité forte et différenciante dans l'espace optique en ligne. Le contraste entre les zones claires (shopping) et sombres (tech/caméra) guide naturellement l'utilisateur vers la conversion. La précision visuelle renforce la confiance dans la technologie IA. Playfair Display + DM Sans = luxe accessible.
