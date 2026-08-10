/* ============================================================================
   heresy-weapons.js  —  Słownik broni (Armoury, Age of Darkness 2.0)
   Kolekcja: Space Wolves (Daniel).  Ładowany <script>, spina się z heresy-units.js.
   ----------------------------------------------------------------------------
   Zasady:
   • Zakres = TYLKO bronie z profilem Range/S/AP/Type (ranged + melee).
     Pancerz, tarcze, granaty (frag/krak/rad/breacher), jump packi, nuncio-vox,
     augury scanner itp. NIE tu — to wargear/glosariusz (docelowo heresy-rules.js).
   • Bronie SYGNATUROWE (Hearth-splitter, Scornspitter, The Fell-Hand,
     The Axe of Helwinter, The Sword of Balenight, Tooth & Claw, Lordsbane,
     Wrath of the Death Wolf) mają profile w `sig:[]` w heresy-units.js —
     tu ich NIE duplikujemy (żeby nie rozjechać danych).
   • Klucz = dokładna nazwa EN z Armoury. Warianty compound ("Hull (Front)
     twin-linked heavy bolter", "Two Sponson Mounted Gravis lascannon" itd.)
     rozwiązuje resolver heresyWeapon() przez ALIASES + skan podłańcuchowy.
   • Multi-profil (missile launcher, combi-weapon, power weapon, charnabal,
     frost blade): pole `profiles:[{sub, rng, S, AP, type}]`.
   • Graviton: Str = "†" (Graviton Pulse / Collapse — patrz Type).
   ----------------------------------------------------------------------------
   Kategorie (cat): Pistol, Auto, Bolt, Combi, Flame, Graviton, Las, Melta,
     Missile, Phosphex, Plasma, Volkite, Disintegrator, Exotic,
     Chain, Power, Paragon, Frost(SW).
============================================================================ */

const HERESY_WEAPONS = {

  /* ── RANGED ─────────────────────────────────────────────────────────── */

  // Pistols / archaeotech
  'Archaeotech pistol':   { cat:'Pistol', rng:'12"', S:'6', AP:'4', type:'Pistol 1, Rending (3+), Master-crafted' },

  // Auto weapons
  'Astartes shotgun':     { cat:'Auto', rng:'12"', S:'4', AP:'-', type:'Assault 2, Concussive (1)' },
  'Rotor cannon':         { cat:'Auto', rng:'30"', S:'3', AP:'-', type:'Assault 4, Pinning, Shell Shock (1)' },
  'Reaper autocannon':    { cat:'Auto', rng:'36"', S:'7', AP:'4', type:'Heavy 2, Rending (6+), Twin-linked' },
  'Kheres assault cannon':{ cat:'Auto', rng:'24"', S:'6', AP:'4', type:'Heavy 6, Rending (6+)' },
  'Gravis autocannon':    { cat:'Auto', rng:'48"', S:'7', AP:'4', type:'Heavy 3, Rending (6+), Twin-linked' },
  'Leviathan storm cannon':{cat:'Auto', rng:'24"', S:'7', AP:'4', type:'Heavy 6, Rending (5+), Sunder' },

  // Bolt weapons
  'Bolt pistol':          { cat:'Bolt', rng:'12"', S:'4', AP:'5', type:'Pistol 1' },
  'Bolter':               { cat:'Bolt', rng:'24"', S:'4', AP:'5', type:'Rapid Fire' },
  'Combi-bolter':         { cat:'Bolt', rng:'24"', S:'4', AP:'5', type:'Rapid Fire, Twin-linked' },
  'Heavy bolter':         { cat:'Bolt', rng:'36"', S:'5', AP:'4', type:'Heavy 4' },
  'Gravis bolt cannon':   { cat:'Bolt', rng:'48"', S:'5', AP:'4', type:'Heavy 6, Twin-linked' },
  'Nemesis bolter':       { cat:'Bolt', rng:'72"', S:'5', AP:'5', type:'Heavy 1, Rending (5+), Sniper, Pinning' },

  // Combi-weapons (bolter primary + wybierany secondary)
  'Magna combi-weapon':   { cat:'Combi', note:'Bolter (primary) + secondary: meltagun / plasma gun / disintegrator*.', profiles:[
      { sub:'Bolter (primary)',   rng:'24"', S:'4', AP:'5', type:'Rapid Fire' },
      { sub:'Meltagun (sec.)',    rng:'12"', S:'8', AP:'1', type:'Assault 1, Armourbane (Melta), One Shot' },
      { sub:'Plasma gun (sec.)',  rng:'24"', S:'7', AP:'4', type:'Rapid Fire, Breaching (4+), Gets Hot, One Shot' },
      { sub:'Disintegrator (sec.)',rng:'24"', S:'5', AP:'2', type:'Rapid Fire, Instant Death, Gets Hot, One Shot' },
    ]},
  'Minor combi-weapon':   { cat:'Combi', note:'Bolter (primary) + secondary: flamer / volkite charger / grenade launcher.', profiles:[
      { sub:'Bolter (primary)',        rng:'24"',  S:'4', AP:'5', type:'Rapid Fire' },
      { sub:'Flamer (sec.)',           rng:'Template', S:'4', AP:'5', type:'Assault 1' },
      { sub:'Volkite charger (sec.)',  rng:'15"',  S:'5', AP:'5', type:'Assault 2, Deflagrate' },
      { sub:'Grenade launcher – Frag', rng:'24"',  S:'3', AP:'6', type:'Assault 1, Blast (3"), Pinning' },
      { sub:'Grenade launcher – Krak', rng:'24"',  S:'5', AP:'4', type:'Assault 1' },
    ]},

  // Flame weapons
  'Hand flamer':          { cat:'Flame', rng:'Template', S:'3', AP:'-', type:'Pistol 1' },
  'Flamer':               { cat:'Flame', rng:'Template', S:'4', AP:'5', type:'Assault 1' },
  'Heavy flamer':         { cat:'Flame', rng:'Template', S:'5', AP:'4', type:'Assault 1' },

  // Graviton weapons  (Str = † : patrz Graviton Pulse / Collapse)
  'Graviton gun':         { cat:'Graviton', rng:'18"', S:'†', AP:'4', type:'Heavy 1, Blast (3"), Concussive (1), †Graviton Pulse, Haywire' },
  'Grav-flux bombard':    { cat:'Graviton', rng:'18"', S:'†', AP:'4', type:'Heavy 1, Large Blast (5"), †Graviton Collapse, Torsion Crusher, Ignores Cover, Concussive (1)' },

  // Las weapons
  'Lascannon':            { cat:'Las', rng:'48"', S:'9', AP:'2', type:'Heavy 1, Sunder' },
  'Gravis lascannon':     { cat:'Las', rng:'48"', S:'9', AP:'2', type:'Heavy 2, Sunder' },

  // Melta weapons
  'Meltagun':             { cat:'Melta', rng:'12"', S:'8', AP:'1', type:'Assault 1, Armourbane (Melta)' },
  'Multi-melta':          { cat:'Melta', rng:'24"', S:'8', AP:'1', type:'Heavy 1, Armourbane (Melta), Twin-linked' },
  'Gravis melta cannon':  { cat:'Melta', rng:'24"', S:'8', AP:'1', type:'Heavy 2, Armourbane (Melta), Twin-linked' },
  'Cyclonic melta lance': { cat:'Melta', rng:'18"', S:'8', AP:'1', type:'Heavy 4, Armourbane (Melta)' },

  // Missile weapons
  'Missile launcher':     { cat:'Missile', profiles:[
      { sub:'Frag', rng:'48"', S:'4', AP:'6', type:'Heavy 1, Blast (3"), Pinning' },
      { sub:'Krak', rng:'48"', S:'8', AP:'3', type:'Heavy 1' },
      { sub:'Flak', rng:'48"', S:'7', AP:'3', type:'Heavy 1, Skyfire' },
    ]},
  'Havoc launcher':       { cat:'Missile', rng:'48"', S:'5', AP:'5', type:'Heavy 1, Blast (3"), Twin-linked' },
  'Hunter-killer missile':{ cat:'Missile', rng:'48"', S:'8', AP:'3', type:'Heavy 1, One Shot' },

  // Phosphex
  'Phosphex discharger':  { cat:'Phosphex', rng:'18"', S:'5', AP:'2', type:'Heavy 1, Barrage, Blast (3"), Poisoned (3+), Crawling Fire, Lingering Death' },

  // Plasma weapons
  'Plasma pistol':        { cat:'Plasma', rng:'12"', S:'7', AP:'4', type:'Pistol 1, Breaching (4+), Gets Hot' },
  'Plasma gun':           { cat:'Plasma', rng:'24"', S:'7', AP:'4', type:'Rapid Fire, Breaching (4+), Gets Hot' },
  'Plasma cannon':        { cat:'Plasma', rng:'36"', S:'7', AP:'4', type:'Heavy 1, Blast (3"), Breaching (4+), Gets Hot' },
  'Gravis plasma cannon': { cat:'Plasma', rng:'36"', S:'7', AP:'4', type:'Heavy 1, Large Blast (5"), Breaching (4+), Gets Hot' },
  'Plasma blaster':       { cat:'Plasma', rng:'18"', S:'7', AP:'4', type:'Assault 2, Breaching (4+), Gets Hot' },

  // Volkite weapons
  'Volkite serpenta':     { cat:'Volkite', rng:'10"', S:'5', AP:'5', type:'Pistol 2, Deflagrate' },
  'Volkite charger':      { cat:'Volkite', rng:'15"', S:'5', AP:'5', type:'Assault 2, Deflagrate' },
  'Volkite caliver':      { cat:'Volkite', rng:'30"', S:'6', AP:'5', type:'Heavy 3, Deflagrate' },
  'Volkite culverin':     { cat:'Volkite', rng:'45"', S:'6', AP:'5', type:'Heavy 5, Deflagrate' },
  'Volkite dual-culverin':{ cat:'Volkite', rng:'45"', S:'6', AP:'5', type:'Heavy 6, Deflagrate, Twin-linked' },

  // Disintegrator
  'Disintegrator pistol': { cat:'Disintegrator', rng:'12"', S:'5', AP:'2', type:'Pistol 1, Instant Death, Gets Hot' },

  // Exotic ranged
  'Lascutter (Ranged)':   { cat:'Exotic', rng:'8"', S:'10', AP:'1', type:'Assault 1, Armourbane (Ranged)' },

  /* ── MELEE ──────────────────────────────────────────────────────────── */

  // Chain weapons
  'Chainsword':           { cat:'Chain', rng:'-', S:'User', AP:'-', type:'Melee, Shred' },
  'Heavy chainsword':     { cat:'Chain', rng:'-', S:'+2',   AP:'-', type:'Melee, Shred, Two-handed' },
  'Chainaxe':             { cat:'Chain', rng:'-', S:'+1',   AP:'-', type:'Melee, Shred' },
  'Chainfist':            { cat:'Chain', rng:'-', S:'x2',   AP:'2', type:'Melee, Armourbane (Melee), Unwieldy' },
  'Chain bayonet':        { cat:'Chain', rng:'-', S:'+1',   AP:'-', type:'Melee, Two-handed, Shred' },

  // Charnabal (opcja "Charnabal weapon" = dowolny z profilu)
  'Charnabal weapon':     { cat:'Charnabal', note:'Wybierz dowolny z profilu.', profiles:[
      { sub:'Sabre',  rng:'-', S:'User', AP:'-', type:"Melee, Breaching (5+), Duellist's Edge (1)" },
      { sub:'Tabar',  rng:'-', S:'+2',   AP:'-', type:"Melee, Breaching (6+), Duellist's Edge (1)" },
      { sub:'Glaive', rng:'-', S:'+1',   AP:'-', type:"Melee, Breaching (5+), Duellist's Edge (2), Two-handed" },
    ]},

  // Power weapons (opcja "Power weapon" = dowolny z profilu)
  'Power weapon':         { cat:'Power', note:'Wybierz dowolny z profilu.', profiles:[
      { sub:'Sword', rng:'-', S:'User', AP:'3', type:'Melee, Rending (6+)' },
      { sub:'Axe',   rng:'-', S:'+1',   AP:'2', type:'Melee, Unwieldy' },
      { sub:'Maul',  rng:'-', S:'+2',   AP:'3', type:'Melee' },
      { sub:'Lance', rng:'-', S:'+1',   AP:'3', type:'Melee, Reach (1)' },
    ]},
  'Power axe':            { cat:'Power', rng:'-', S:'+1',  AP:'2', type:'Melee, Unwieldy' },
  'Power fist':           { cat:'Power', rng:'-', S:'x2',  AP:'2', type:'Melee, Unwieldy, Specialist Weapon' },
  'Gravis power fist':    { cat:'Power', rng:'-', S:'9',   AP:'2', type:'Melee, Brutal (3)' },
  'Thunder hammer':       { cat:'Power', rng:'-', S:'x2',  AP:'2', type:'Melee, Unwieldy, Brutal (2), Specialist Weapon' },
  'Lightning claw':       { cat:'Power', rng:'-', S:'User',AP:'3', type:'Melee, Shred, Rending (6+), Specialist Weapon',
                            note:'Dwa lightning claws: +2 Ataki zamiast +1 za drugą broń.' },

  // Paragon
  'Paragon blade':        { cat:'Paragon', rng:'-', S:'+1', AP:'2', type:'Melee, Murderous Strike (6+), Specialist Weapon' },

  // Exotic melee
  'Lascutter (Melee)':    { cat:'Exotic', rng:'-', S:'7',  AP:'1', type:'Melee, Unwieldy, Cumbersome' },
  'Melta bombs':          { cat:'Exotic', rng:'-', S:'8',  AP:'1', type:'Melee, Detonation, Unwieldy, Armourbane (Melee), Instant Death' },
  'Leviathan siege claw': { cat:'Exotic', rng:'-', S:'10', AP:'2', type:'Melee, Brutal (3)' },
  'Leviathan siege drill':{ cat:'Exotic', rng:'-', S:'12', AP:'2', type:'Melee, Armourbane (Melee)' },
  'Bayonet':              { cat:'Exotic', rng:'-', S:'+1', AP:'-', type:'Melee, Two-handed' },

  // Frost blades (Space Wolves armoury) — indywidualne + zbiorczy "Frost blade"
  'Frost sword':          { cat:'Frost', rng:'-', S:'+1',  AP:'3', type:'Melee, Specialist Weapon, Reaping Blow (1)' },
  'Frost axe':            { cat:'Frost', rng:'-', S:'+1',  AP:'2', type:'Melee, Specialist Weapon, Unwieldy, Reaping Blow (1)' },
  'Frost claw':           { cat:'Frost', rng:'-', S:'User',AP:'3', type:'Melee, Specialist Weapon, Shred, Reaping Blow (1)' },
  'Great frost blade':    { cat:'Frost', rng:'-', S:'+2',  AP:'2', type:'Melee, Reaping Blow (1), Two-handed' },
  'Fenrisian axe':        { cat:'Frost', rng:'-', S:'+1',  AP:'-', type:'Melee, Reaping Blow (1)' },
  'Frost blade':          { cat:'Frost', note:'Wybierz sword / axe / claw.', profiles:[
      { sub:'Sword', rng:'-', S:'+1',  AP:'3', type:'Melee, Specialist Weapon, Reaping Blow (1)' },
      { sub:'Axe',   rng:'-', S:'+1',  AP:'2', type:'Melee, Specialist Weapon, Unwieldy, Reaping Blow (1)' },
      { sub:'Claw',  rng:'-', S:'User',AP:'3', type:'Melee, Specialist Weapon, Shred, Reaping Blow (1)' },
    ]},
};

/* ── ALIASY: compound-wargeary / warianty nazw → klucz w słowniku ───────── */
const HERESY_WEAPON_ALIASES = {
  'Combi-bolter (Chosen only)':                 'Combi-bolter',
  'Bolter (Chosen only)':                       'Bolter',
  'Hull (Front) twin-linked heavy bolter':      'Heavy bolter',
  'Pintle Mounted twin-linked bolter':          'Combi-bolter',
  'Pintle twin-linked bolter':                  'Combi-bolter',
  'Two Sponson Mounted Gravis lascannon':       'Gravis lascannon',
  'Legion Scimitar jetbike (heavy bolter)':     'Heavy bolter',
  'Gravis power fist with in-built combi-bolter':'Gravis power fist',
  'Two Leviathan siege claws with in-built meltagun':'Leviathan siege claw',
  'Two heavy flamers':                          'Heavy flamer',
  'Frost blade (axe / sword / claw)':           'Frost blade',
  'Frost blade (sword/axe/claw)':               'Frost blade',
  'Second frost blade (axe/claw/sword)':        'Frost blade',
  'Missile launcher (frag/krak/flak)':          'Missile launcher',
  'Melta bomb':                                 'Melta bombs',
  'Two lightning claws':                        'Lightning claw',
};

/* ── RESOLVER: nazwa wargearu → profil broni (albo null) ────────────────── */
(function () {
  const norm = (s) => String(s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')      // usuń nawiasy
    .replace(/[^a-z0-9]+/g, ' ')     // tylko litery/cyfry
    .trim();

  // klucze posortowane malejąco po długości znormalizowanej — najdłuższy trafia pierwszy
  const KEYS = Object.keys(HERESY_WEAPONS)
    .map((k) => ({ k, n: norm(k) }))
    .filter((x) => x.n)
    .sort((a, b) => b.n.length - a.n.length);

  function heresyWeapon(name) {
    if (!name) return null;
    if (HERESY_WEAPONS[name]) return { key: name, ...HERESY_WEAPONS[name] };
    if (HERESY_WEAPON_ALIASES[name]) {
      const k = HERESY_WEAPON_ALIASES[name];
      return HERESY_WEAPONS[k] ? { key: k, ...HERESY_WEAPONS[k] } : null;
    }
    const n = norm(name);
    if (!n) return null;
    for (const { k, n: kn } of KEYS) {
      // dopasowanie po całych słowach (granice), nie wewnątrz innego słowa
      if ((' ' + n + ' ').includes(' ' + kn + ' ') || n === kn || n.endsWith(' ' + kn) || n.startsWith(kn + ' ')) {
        return { key: k, ...HERESY_WEAPONS[k] };
      }
    }
    return null;
  }

  if (typeof window !== 'undefined') {
    window.HERESY_WEAPONS = HERESY_WEAPONS;
    window.HERESY_WEAPON_ALIASES = HERESY_WEAPON_ALIASES;
    window.heresyWeapon = heresyWeapon;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HERESY_WEAPONS, HERESY_WEAPON_ALIASES, heresyWeapon };
  }
})();
