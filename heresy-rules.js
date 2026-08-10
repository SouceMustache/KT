/* ============================================================================
   heresy-rules.js  —  Glosariusz (Age of Darkness 2.0) + Wargear
   Kolekcja: Space Wolves (Daniel).  Ładowany <script>, spina się z
   heresy-units.js (pole rules:[…]) oraz heresy-weapons.js (Type keywords).
   ----------------------------------------------------------------------------
   Zawartość:
   • HERESY_RULES   — keywordy broni, typy broni, USR-y rdzeniowe, reguły
                      Legionu / pojazdów / Warlordów / jednostkowe. Klucz = nazwa
                      bazowa BEZ „(X)". Pole: {cat, text, src?}.
   • HERESY_WARGEAR — pancerze, tarcze, pola, granaty, ekwipunek. {cat, text}.
   • Resolvery: heresyRule(name), heresyWargear(name), heresyGloss(name)
     — zdejmują „(X)" oraz numer typu broni („Heavy 4" → „Heavy").
   ----------------------------------------------------------------------------
   Zasady/źródła:
   • Reguły army-list Legionu i SW-specyficzne: cytowane z plików projektu
     (heresy_Legiones_Astartes_Special_Rules / HQ / Elite / Troop choices).
   • Rdzenne USR-y i keywordy broni: zwięzłe streszczenia AoD 2.0 (glosariusz
     referencyjny — nie egzekwujemy mechaniki, opis dla gracza).
   • Bronie/pancerze SYGNATUROWE (Hearth-splitter, Scornspitter, The Fell-Hand,
     The Axe of Helwinter, The Sword of Balenight, Tooth & Claw, The Armour
     Elavagar) mają profile/tekst w heresy-units.js — tu ich NIE dublujemy.
   • Tekst PL, nazwy reguł/keywordów EN (spójnie z HERESY_PSYCHIC).
   • cat: Weapon | WType | USR | Legion | Vehicle | Warlord | Unit | Psychic
============================================================================ */

const HERESY_RULES = {

  /* ── KEYWORDY BRONI (special rules na profilu) ──────────────────────── */
  'Armourbane':      { cat:'Weapon', text:'Przeciw celom z Armour Value rzut na penetrację 2D6 zamiast 1D6. Wariant (Melta) działa tak tylko w połowie zasięgu; (Melee) w zwarciu; (Ranged) przy strzale.' },
  'Master-crafted':  { cat:'Weapon', text:'Raz na atak można przerzucić jeden nieudany rzut To Hit tą bronią.' },
  'Rending':         { cat:'Weapon', text:'To Wound równe/wyższe niż wartość w nawiasie: rana ma AP2 i Armour/Cover Save nie działa (w zwarciu podobnie vs Armour Value — automatyczny Penetrating Hit).' },
  'Sunder':          { cat:'Weapon', text:'Przy rzucie na penetrację Pancerza tą bronią można przerzucić kości Armour Penetration.' },
  'Twin-linked':     { cat:'Weapon', text:'Można przerzucić nieudane rzuty To Hit (lub rzut rozrzutu dla broni Blast/Barrage).' },
  'Shred':           { cat:'Weapon', text:'Można przerzucić nieudane rzuty To Wound tą bronią.' },
  'Breaching':       { cat:'Weapon', text:'Każdy rzut To Wound ≥ wartości w nawiasie rozstrzyga ranę z AP2 (bez efektu na modele bez Wounds, np. Vehicle).' },
  'Brutal':          { cat:'Weapon', text:'Każda przydzielona rana zadaje X ran (nadmiar ponad Wounds modelu przepada; nie działa na modele bez Toughness).' },
  'Murderous Strike':{ cat:'Weapon', text:'To Wound równe/wyższe niż wartość w nawiasie zadaje ranę z Instant Death.' },
  'Reaping Blow':    { cat:'Weapon', text:'Jeśli model jest w kontakcie z więcej niż jednym wrogiem w swoim kroku Inicjatywy, zyskuje +X Ataków (X=1, jeśli nie podano).' },
  "Duellist's Edge": { cat:'Weapon', text:'Model dodaje +X do Inicjatywy w Wyzwaniu (Challenge).' },
  'Reach':           { cat:'Weapon', text:'Model atakujący tą bronią w Assaultcie dodaje +X do Inicjatywy (nie sumuje się z innych broni Reach).' },
  'Deflagrate':      { cat:'Weapon', text:'Po zadaniu ran rzuć tyle dodatkowych kości, ile nieuratowanych ran; każdy wynik 4+ to dodatkowe automatyczne trafienie tą bronią.' },
  'Poisoned':        { cat:'Weapon', text:'Rani na stałej wartości równej liczbie w nawiasie niezależnie od Toughness; jeśli S ≥ T, można przerzucić nieudane To Wound.' },
  'Fleshbane':       { cat:'Weapon', text:'Zawsze rani na 2+ niezależnie od Toughness celu (bez efektu na modele bez Toughness).' },
  'Concussive':      { cat:'Weapon', text:'Model, któremu zadano nieuratowaną ranę, ma Inicjatywę obniżoną do 1 do końca następnej fazy Assault.' },
  'Pinning':         { cat:'Weapon', text:'Jednostka, która oberwała od tej broni (choćby bez strat), musi zdać test Pinning albo zostaje Pinned.' },
  'Sniper':          { cat:'Weapon', text:'Trafienia 6 To Hit to Precision Shots (wybór trafionego modelu); broń zyskuje Rending i Pinning.' },
  'Skyfire':         { cat:'Weapon', text:'Może strzelać do celów Flyer/Flying MC/Skimmer z pełnym BS; do celów naziemnych snap shot (BS1), chyba że Interceptor.' },
  'Ignores Cover':   { cat:'Weapon', text:'Cel nie może skorzystać z Cover Save przeciw tej broni.' },
  'Gets Hot':        { cat:'Weapon', text:'Rzut To Hit „1" zadaje strzelcowi jedną ranę z AP broni (bez zwykłego Sv, ale FNP/Invuln działa).' },
  'One Shot':        { cat:'Weapon', text:'Broń może być użyta tylko raz w całej bitwie.' },
  'Instant Death':   { cat:'Weapon', text:'Nieuratowana rana natychmiast usuwa model z gry niezależnie od pozostałych Wounds.' },
  'Detonation':      { cat:'Weapon', text:'Można atakować tylko Vehicle/Dreadnought/Automata, modele M0/„-", Budynki i Fortyfikacje; w zwarciu tylko 1 atak.' },
  'Unwieldy':        { cat:'Weapon', text:'Model atakujący tą bronią w zwarciu uderza w Inicjatywie 1.' },
  'Cumbersome':      { cat:'Weapon', text:'Broń ociężała — jej użycie ogranicza inne działania modelu w danej fazie (patrz profil/rulebook).' },
  'Specialist Weapon':{cat:'Weapon', text:'Bonus +1 Atak za drugą broń przysługuje tylko, gdy obie bronie mają Specialist Weapon (lub dwie identyczne).' },
  'Two-handed':      { cat:'Weapon', text:'Broń oburęczna — nie daje bonusu +1 Atak za posiadanie drugiej broni.' },
  'Shell Shock':     { cat:'Weapon', text:'Test Pinning wywołany tą bronią wykonywany jest z karą -X do Leadership.' },
  'Crawling Fire':   { cat:'Weapon', text:'Phosphex — po ataku znacznik płomienia pozostaje na stole i zadaje trafienia w kolejnych turach (patrz zasady Phosphex).' },
  'Lingering Death': { cat:'Weapon', text:'Phosphex — obszar ataku pozostaje niebezpieczny; modele wchodzące/kończące ruch w nim obrywają.' },
  'Haywire':         { cat:'Weapon', text:'Przeciw Vehicle: 1 = brak efektu, 2–5 = Glancing Hit, 6 = Penetrating Hit (niezależnie od Str/AV).' },
  'Torsion Crusher': { cat:'Weapon', text:'Trafienie w cel z Armour Value zadaje podwojoną utratę Hull Points.' },
  'Graviton Pulse':  { cat:'Weapon', text:'Str „†" — trafiony model testuje Str (2D6 ≤ Str) albo obrywa ranę; vs Armour Value penetracja 3D6 (por. Graviton Collapse).' },
  'Graviton Collapse':{cat:'Weapon', text:'Zamiast zwykłego To Wound: 2D6 ≤ Strength celu albo rana; vs Armour Value penetracja 4D6.' },
  'Barrage':         { cat:'Weapon', text:'Ostrzał pośredni (nie wymaga LoS); rana liczona od najsłabszego pancerza, rozrzut jak dla Blast; zadaje Pinning.' },
  'Deathstorm':      { cat:'Weapon', text:'Atakuje do 4 wrogich jednostek w zasięgu i LoS, każdą pełną liczbą strzałów z profilu.' },
  'Rocket Barrage':  { cat:'Weapon', text:'Jeśli model nie ruszał się w tej turze, broń zyskuje Rending (4+) i Pinning do początku następnej tury.' },
  'Heavy Beam':      { cat:'Weapon', text:'Rysuje wiązkę 1" na długość zasięgu; wszystkie modele na linii obrywają (blokowana przez pojazdy/6+ W).' },
  'Limited Ammunition':{cat:'Weapon',text:'Po ostrzale rzuć D6 (+1 jeśli już strzelała): 6+ = broń nieużywalna do końca bitwy.' },

  /* ── TYPY BRONI ─────────────────────────────────────────────────────── */
  'Pistol':          { cat:'WType', text:'X strzałów, zasięg zwykle 12"; liczy się jak broń do walki wręcz w Assaultcie; można strzelać po ruchu.' },
  'Rapid Fire':      { cat:'WType', text:'2 strzały do połowy zasięgu (gdy model nie ruszał się lub ma Relentless), 1 strzał na pełny zasięg po ruchu.' },
  'Assault':         { cat:'WType', text:'X strzałów; model może strzelać po ruchu/Run i deklarować szarżę w tej samej turze.' },
  'Heavy':           { cat:'WType', text:'X strzałów; strzał z pełnym BS wymaga nieruszania się (lub Relentless); po ruchu snap shot.' },
  'Ordnance':        { cat:'WType', text:'Ciężka artyleria; pojazd nie może ruszać się i strzelać z pełnym efektem; zwykle Blast/Barrage.' },
  'Blast':           { cat:'WType', text:'Szablon okrągły o średnicy w nawiasie; trafia modele pod szablonem; nie można używać w zwarciu.' },
  'Large Blast':     { cat:'WType', text:'Większy szablon (5") — jak Blast.' },
  'Massive Blast':   { cat:'WType', text:'Bardzo duży szablon (7") — jak Blast.' },
  'Melee':           { cat:'WType', text:'Broń do walki wręcz — używana w fazie Assault.' },

  /* ── USR-y RDZENIOWE (Age of Darkness) ──────────────────────────────── */
  'Relentless':      { cat:'USR', text:'Może strzelać z broni Heavy / Ordnance / Rapid Fire tak, jakby był nieruchomy, i szarżować w turze, w której z takiej broni strzelał.' },
  'Bulky':           { cat:'USR', text:'Model zajmuje X miejsc Transport Capacity (liczy się jako X modeli przy wsiadaniu do transportu).' },
  'Fearless':        { cat:'USR', text:'Automatycznie zdaje testy Morale i Pinning, nie może zostać Pinned ani uciekać; nie korzysta z Sweeping Advance obrony.' },
  'Feel No Pain':    { cat:'USR', text:'Przy nieuratowanej ranie rzuć D6: wynik ≥ X anuluje ranę (nie działa vs Instant Death ani ataki, które i tak omijają Sv w określony sposób).' },
  'Deep Strike':     { cat:'USR', text:'Może być wystawiony z Rezerw jako Deep Strike Assault (rozstawienie ze scatterem w dowolnym miejscu).' },
  'Counter-attack':  { cat:'USR', text:'Gdy jednostka zostaje zaszarżowana, może zdać test Ld — sukces daje modelom +X Ataków w tej fazie Assault.' },
  'Hammer of Wrath': { cat:'USR', text:'Po udanej szarży model zadaje X automatycznych trafień Str User, AP - w Inicjatywie 10.' },
  'Hit & Run':       { cat:'USR', text:'W fazie Assault może wyjść ze zwarcia: zdaj test Inicjatywy i wykonaj ruch 3D6", oddzielając się od wroga.' },
  'Infiltrate':      { cat:'USR', text:'Rozstawia się po rozstawieniu reszty armii, ≥12" od wroga (≥18" w LoS), lub wchodzi z flanki (Outflank).' },
  'Move Through Cover':{cat:'USR', text:'Rzuca dodatkową kość przy ruchu/szarży przez Difficult Terrain (bierze najlepszy wynik) i auto-zdaje testy Dangerous Terrain.' },
  'Rampage':         { cat:'USR', text:'Jeśli w Assaultcie Twoja jednostka ma nie więcej modeli niż wrogów w kontakcie, modele z tą regułą zyskują +D3 Ataków (maks. X).' },
  'Scout':           { cat:'USR', text:'Po rozstawieniu, przed 1. turą, jednostka może wykonać ruch redeploy (do 6"/12") lub Outflank.' },
  'Stubborn':        { cat:'USR', text:'Ignoruje modyfikatory Leadership przy testach Morale i Pinning.' },
  'Independent Character':{cat:'USR', text:'Samodzielny bohater — może dołączać do i opuszczać jednostki; poza jednostką jest osobnym celem.' },
  'Fear':            { cat:'USR', text:'Wrogowie walczący w zwarciu z modelem z tą regułą testują Ld (z karą wg X); porażka = -5 do WS w tej fazie.' },
  'Firing Protocols':{ cat:'USR', text:'Model może w fazie strzelania strzelać z X broni zamiast jednej.' },
  'Preferred Enemy': { cat:'USR', text:'Przeciw wskazanemu wrogowi (X): przerzut To Hit „1" oraz To Wound „1".' },
  'Fury of the Legion':{cat:'Legion', text:'Jeśli model nie ruszał się/Run, dodaje +1 strzał przy ostrzale z boltera (nie combi-boltera, bolt pistol ani innych broni bolt).' },
  'Loyalist':        { cat:'USR', text:'Model może być włączony tylko do armii o Allegiance Loyalist.' },
  'Traitor':         { cat:'USR', text:'Model może być włączony tylko do armii o Allegiance Traitor.' },

  /* ── REGUŁY LEGIONU / ARMY-LIST ─────────────────────────────────────── */
  'Legiones Astartes':{cat:'Legion', text:'Reguła frakcyjna Legionu (tu: Space Wolves) — wiąże modele w tę samą frakcję i odblokowuje cechy oraz Reakcje Legionu (wg zasad Age of Darkness / Liber danego Legionu).' },
  'Chosen Warriors': { cat:'Legion', text:'Modele z tą regułą liczą się jak Character Sub-type dla Wyzwań (Challenges) i nie mogą być „wybrane pojedynczo" przez ostrzał kosztem reszty jednostki.' },
  'Inexorable':      { cat:'Legion', text:'Jednostka złożona wyłącznie z modeli z tą regułą ignoruje modyfikatory Ld do Morale/Pinning (poza Fear i Sub-typami Corrupted/Anathema). Z Fearless używa się Fearless.' },
  'Legiones Consularis':{cat:'Legion', text:'Legion Centurion / Cataphractii / Tartaros Centurion może wziąć jeden upgrade Consul (max jeden; część niedostępna w Terminator armour).' },
  'Master of the Legion':{cat:'Legion', text:'Daje: Rites of War (Detachment może wybrać 1 Rite), The Few and the Proud (max 1 model/1000 pkt armii) oraz Retinue (Command Squad w tym samym slocie FOC).' },
  'Retinue':         { cat:'Legion', text:'Command Squad (Legion / Cataphractii / Tartaros) można wziąć tylko z modelem Master of the Legion jako Liderem; nie zajmuje slotu FOC i tworzy z nim jedną jednostkę.' },
  'Heart of the Legion':{cat:'Legion', text:'Gdy ≥ połowa modeli jednostki jest w 6" od Objective, cała jednostka zyskuje Feel No Pain (6+) i Stubborn (albo +1 do istniejącego FNP).' },
  'Support Squad':   { cat:'Legion', text:'Jednostka wsparcia — nie może wypełniać obowiązkowych wyborów Troops i podlega limitom wg listy armii.' },

  /* ── REGUŁY POJAZDÓW ────────────────────────────────────────────────── */
  'Power of the Machine Spirit':{cat:'Vehicle', text:'Pojazd może wystrzelić z jednej dodatkowej broni ponad limit wynikający z ruchu i częściowo ignoruje skutki obrażeń załogi.' },
  'Assault Vehicle': { cat:'Vehicle', text:'Modele mogą deklarować szarżę w turze, w której wysiadły (Disembark) z tego pojazdu.' },
  'Orbital Assault Vehicle':{cat:'Vehicle', text:'Musi wejść przez Deep Strike Assault i nie może się poruszać — w razie wymuszenia zostaje zniszczony (Wreck), a pasażerowie robią Emergency Disembarkation.' },
  'Dreadnought Talon':{cat:'Vehicle', text:'Modele wystawia się w spójności jednostki, ale potem działają samodzielnie (nie są traktowane jak jedna jednostka).' },
  'Dreadnought Transport':{cat:'Vehicle', text:'Może przewieźć jeden model Dreadnought (≤8 W) zamiast innych modeli; wtedy nikt inny nie może wsiąść.' },
  'Infantry Transport':{cat:'Vehicle', text:'Żaden model z Bulky (X) nie może wsiąść do tego transportu.' },
  'Inertial Guidance System':{cat:'Vehicle', text:'Scatter przy Deep Strike zmniejszony o połowę; przy wpadnięciu w Impassable/poza stół model jest przesuwany minimalnie, by tego uniknąć.' },
  'Impact-reactive Doors':{cat:'Vehicle', text:'Po wystawieniu drzwi otwierają się na stałe: pasażerowie natychmiast wysiadają, nikt później nie wsiądzie, a wysadzeni nie mogą szarżować w tej turze.' },
  'Repair':          { cat:'Vehicle', text:'Zamiast strzelać, rzuć D6: 4+ usuwa wynik Immobilised (nie odzyskuje Hull Points).' },
  'Assault Ramp':    { cat:'Vehicle', text:'Modele mogą szarżować w turze wysiadki z tego pojazdu (por. Assault Vehicle).' },

  /* ── REGUŁY JEDNOSTKOWE / WARLORD (Space Wolves) ────────────────────── */
  'Cult of Morkai':  { cat:'Unit', text:'Deathsworn Pack: może być dołączony tylko przez Speaker of the Dead / Caster of Runes i może zostać Retinue Squad Detachmentu z takim Consulem (zamiast wyboru Elites).' },
  'The Dreams of the Death Wolf':{cat:'Unit', text:'Deathsworn: model, który straci ostatnią Wound w Assaultcie przed swoim atakiem, odkłada się na bok i w Inicjatywie 1 wykonuje jeszcze jeden atak, po czym jest usuwany.' },
  'Howl of the Death Wolf':{cat:'Unit', text:'Leman Russ, raz na bitwę: w tej turze wszyscy przyjaźni Space Wolves +1 M, a wrogie jednostki ze Space Wolves testują Pinning.' },
  'Battle Cunning':  { cat:'Unit', text:'Do trzech jednostek Infantry w Detachmentcie z Hvarlem Red-Blade może otrzymać regułę Scout.' },
  'Lordsbane':       { cat:'Unit', text:'Model może wystawiać i przyjmować Wyzwania jak Character; jeśli w Wyzwaniu usunie przeciwnika, dodaje +1 do wygranych ran przy rozstrzyganiu combatu.' },
  'Wolf-kin of Russ':{ cat:'Unit', text:'Reguła-tożsamość jednostki Wolf-kin (Freki & Geri): nadaje im zestaw reguł — Fearless, Fear (1), Rampage (2), Hammer of Wrath (1), Feel No Pain (5+), Bulky (4).' },
  'Warlord: Sire of the Space Wolves':{cat:'Warlord', text:'Leman Russ jako Warlord: wszyscy Space Wolves w armii +1 S w turze udanej szarży; armia może wykonać dodatkową Reakcję w fazie Assault przeciwnika.' },
  'Warlord: Crown Breaker':{cat:'Warlord', text:'Geigor Fell-Hand jako Warlord: on i jego jednostka mają Preferred Enemy (Independent Characters) oraz Feel No Pain (5+) w zwarciu z IC; dodatkowa Reakcja w fazie Ruchu przeciwnika.' },
  'Warlord: Head-taker':{cat:'Warlord', text:'Hvarl Red-Blade jako Warlord: on i jego jednostka mają Preferred Enemy (Infantry); dodatkowa Reakcja w fazie Assault przeciwnika.' },

  /* ── PSYCHIC ────────────────────────────────────────────────────────── */
  'Force':           { cat:'Psychic', text:'Przed atakiem bronią/zdolnością z tą regułą psyker może zdać Psychic check: sukces podwaja Strength ataków; porażka = Perils of the Warp (patrz dyscyplina w heresy-units.js).' },
};

/* ── WARGEAR (pancerze / tarcze / pola / granaty / ekwipunek) ─────────── */
const HERESY_WARGEAR = {
  // Pancerze
  'Power armour':                        { cat:'Armour', text:'Zapewnia Armour Save 3+.' },
  'Artificer armour':                    { cat:'Armour', text:'Zapewnia Armour Save 2+.' },
  'Scout armour':                        { cat:'Armour', text:'Zapewnia Armour Save 4+.' },
  'Legion Cataphractii Terminator armour':{ cat:'Armour', text:'Sv 2+ oraz Invuln 4+; jednostka z tym pancerzem nie może wykonywać Sweeping Advance.' },
  'Legion Tartaros Terminator armour':   { cat:'Armour', text:'Sv 2+ oraz Invuln 5+.' },
  // Pola / tarcze / deflektory
  'Refractor field':                     { cat:'Field', text:'Invulnerable Save 5+ (nie kumuluje się z innym Invuln).' },
  'Iron halo':                           { cat:'Field', text:'Invulnerable Save 4+ (nie kumuluje się z innym Invuln).' },
  'Atomantic deflector':                 { cat:'Field', text:'Invuln 5+; rany z Instant Death odejmują D3 W zamiast usuwać model; po utracie ostatniej W/HP wybuch: wszyscy w D6" obrywają Str 8, AP -.' },
  'Combat shield':                       { cat:'Shield', text:'Invulnerable Save 6+.' },
  'Boarding shield':                     { cat:'Shield', text:'Invuln 5+, ale model nie zyskuje bonusu za drugą broń w zwarciu ani nie atakuje bronią Two-handed.' },
  // Granaty (Wargear o efekcie — nie broń strzelecka)
  'Frag grenades':                       { cat:'Grenade', text:'Po szarży przez Difficult/Dangerous Terrain jednostka atakuje w swojej normalnej Inicjatywie (nie w Inicjatywie 1).' },
  'Krak grenades':                       { cat:'Grenade', text:'W zwarciu, zamiast normalnego ataku, jeden automatyczny Str 6 AP 3 na Budynek/Fortyfikację lub model Vehicle/Dreadnought/Automata (Inicjatywa 1).' },
  'Rad grenades':                        { cat:'Grenade', text:'W turze udanej szarży (własnej lub wroga) wszystkie modele wrogiej jednostki mają -1 Toughness (min. 1) do końca Fight sub-phase.' },
  'Breacher charges':                    { cat:'Grenade', text:'W zwarciu z Budynkiem/Fortyfikacją: jeden automatyczny Str 10 AP 2 w Inicjatywie 1 zamiast normalnego ataku.' },
  'Melta bombs':                         { cat:'Grenade', text:'Bomba przeciwpancerna do walki wręcz — profil w heresy-weapons.js (S8 AP1, Melee, Armourbane, Instant Death).' },
  'Ymira class stasis bombs':            { cat:'Grenade', text:'Szarża na jednostkę z tymi bombami jest Disordered; po aktywacji modele dodają Fleshbane i Gets Hot do ataków w zwarciu.' },
  // Ekwipunek
  'Grenade harness':                     { cat:'Equipment', text:'Jednostka atakuje w normalnej Inicjatywie po szarży przez Difficult/Dangerous Terrain (jak frag grenades).' },
  'Nuncio-vox':                          { cat:'Equipment', text:'Pozwala przerzucać rzuty Scatter (gdy model ma LoS do celu) i ignoruje karę -1 Ld z Night Fighting.' },
  'Augury scanner':                      { cat:'Equipment', text:'Blokuje Infiltrate wroga w 18"; ignoruje limit 24" LoS w Night Fighting; darmowy Interceptor przy wejściu wroga z Rezerw.' },
  'Dozer blade':                         { cat:'Equipment', text:'Model może przerzucać nieudane testy Dangerous Terrain.' },
  'Smoke launchers':                     { cat:'Equipment', text:'Po ruchu (nie szybciej niż Combat Speed) model liczy się jako zasłonięty >25% i ma Cover 6+ do początku następnej tury; wtedy nie strzela. Raz na bitwę.' },
  'Shroud bombs':                        { cat:'Equipment', text:'Dystans ostrzału do jednostki z tym ekwipunkiem liczy się jako o 6" większy (poza Night Vision/Primarch); vs Barrage jednostka zawsze poza LoS przy scatterze.' },
  'Searchlights':                        { cat:'Equipment', text:'Ignoruje limit 24" LoS z Night Fighting przy strzelaniu, ale wróg też ignoruje ten limit celując w ten model.' },
  'Helical targeting array':             { cat:'Equipment', text:'Aktywacja: model nie rusza się i może użyć Skyfire; zyskuje darmowy Interceptor i inne bonusy do początku następnej tury.' },
  // Napędy / pojazdy osobiste
  'Legion Warhawk jump pack':            { cat:'Mount', text:'Po aktywacji M12, ignoruje teren przy ruchu/szarży; nadaje Bulky (2→3), Hammer of Wrath (1) i Deep Strike.' },
  'Legion Scimitar jetbike':             { cat:'Mount', text:'Ma heavy bolter; Run → Shrouded (5+). Zmienia typ na Cavalry (Antigrav), M16, dodaje Firing Protocols (2), Hammer of Wrath (1), Deep Strike.' },
  'Legion Spatha combat bike':           { cat:'Mount', text:'Ma twin-linked bolter; Run → Shrouded (5+). Zmienia typ na Cavalry, M14, dodaje Firing Protocols (2), Hammer of Wrath (1).' },
  // Sztandary
  'Legion standard':                     { cat:'Equipment', text:'Przyjazne jednostki Legionu w 6" liczą Ld jako 10 do Morale/Pinning (nie Psychic); jednostka ze sztandarem zyskuje Sub-type Line.' },
  'Legion vexilla':                      { cat:'Equipment', text:'Jednostka z vexillą +1 do wygranych ran w combacie; może cofać się (Fall Back) tylko D6" zamiast 2D6".' },
};

/* ── RESOLVERY ──────────────────────────────────────────────────────────── */
(function () {
  // zdejmij „(X)" oraz numer typu broni („Heavy 4" → „Heavy")
  const baseName = (s) => String(s || '')
    .replace(/\s*\([^)]*\)\s*$/, '')   // (5+), (Space Wolves), (Melta) …
    .replace(/\s+\d+$/, '')            // Heavy 4, Assault 2, Pistol 1 …
    .trim();

  function heresyRule(name) {
    if (!name) return null;
    if (HERESY_RULES[name]) return { key: name, ...HERESY_RULES[name] };
    const b = baseName(name);
    if (HERESY_RULES[b]) return { key: b, ...HERESY_RULES[b] };
    return null;
  }
  function heresyWargear(name) {
    if (!name) return null;
    if (HERESY_WARGEAR[name]) return { key: name, ...HERESY_WARGEAR[name] };
    const b = baseName(name);
    if (HERESY_WARGEAR[b]) return { key: b, ...HERESY_WARGEAR[b] };
    return null;
  }
  // wygodny wspólny lookup: reguła → wargear (kolejność świadoma)
  function heresyGloss(name) {
    return heresyRule(name) || heresyWargear(name) || null;
  }

  if (typeof window !== 'undefined') {
    window.HERESY_RULES = HERESY_RULES;
    window.HERESY_WARGEAR = HERESY_WARGEAR;
    window.heresyRule = heresyRule;
    window.heresyWargear = heresyWargear;
    window.heresyGloss = heresyGloss;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HERESY_RULES, HERESY_WARGEAR, heresyRule, heresyWargear, heresyGloss };
  }
})();
