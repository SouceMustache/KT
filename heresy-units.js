/* ============================================================================
   heresy-units.js  —  DataBase jednostek (Space Wolves, kolekcja Daniela)
   Pełna dokumentacja schematu: patrz heresy-units.schema.js
   ----------------------------------------------------------------------------
   Zasady stałe:
   • Nic nie blokujemy na twardo — composer liczy, UI sygnalizuje kolorem.
   • Stały wargear WPISANY w profil (invuln z Refractor field / Terminator armour).
   • Nazwy broni/wargearu EN (spinają się ze słownikiem i glosariuszem).
   • Consul zawężony do kolekcji: Herald, Primus Medicae, Caster of Runes,
     Speaker of the Dead (Caster/Speaker = warianty Space Wolves).
   ----------------------------------------------------------------------------
   STAN: Etap 1 — HQ (13) + Elite (6) + FA (1) + HS (1) + Transport (4). BRAKUJE: Troops (7)!
============================================================================ */

/* ── wspólny blok Consul (identyczny na wszystkich Centurionach) ──────────── */
const CONSUL_SW = {
  id:'consul', label:'Legiones Consularis — Consul upgrade (jeden na model):',
  mode:'consul', scope:'model',
  choices:[
    {id:'herald', name:'Herald', cost:20, costMode:'flat',
      addsRules:['Fearless','Fear (1)'], grantsWargear:['Legion standard'],
      note:'Wymienia bolt pistol/bolter/combi-bolter na Legion standard (za darmo).'},
    {id:'primus_medicae', name:'Primus Medicae', cost:45, costMode:'flat',
      addsRules:['Sacred Trust'], grantsWargear:['Narthecium'],
      note:'Może wymienić bolt pistol/combi-bolter na needle pistol (+5). Bez dwóch lightning claws / boarding shield.'},
    {id:'caster_of_runes', name:'Caster of Runes', cost:45, costMode:'flat',
      addsRules:['Psyker','Adamantium Will (4+)'], discipline:'winds_of_fenris',
      note:'Dyscyplina: Winds of Fenris / Divination / Telekinesis / Biomancy. Force weapon swap za darmo; psychic hood +15.'},
    {id:'speaker_of_the_dead', name:'Speaker of the Dead', cost:65, costMode:'flat',
      addsRules:['Stubborn','Hatred (Everything)'], grantsWargear:['Narthecium','Master-crafted power maul'],
      note:'Ld→10. Bez dwóch lightning claws / boarding shield.'},
  ]
};

/* ── wspólny blok opcji broni Centuriona terminatorskiego (Cata/Tartaros) ─── */
const TERM_CENTURION_OPTS = [
  { id:'combi_swap', label:'May exchange combi-bolter for one of:',
    mode:'pick-one', scope:'model',
    choices:[
      {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'flat'},
      {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'flat'},
      {id:'volkite_charger', name:'Volkite charger', cost:2,  costMode:'flat'},
    ]},
  { id:'power_swap', label:'May exchange power weapon for one of:',
    mode:'pick-one', scope:'model',
    choices:[
      {id:'power_fist',     name:'Power fist',     cost:10, costMode:'flat'},
      {id:'lightning_claw', name:'Lightning claw', cost:0,  costMode:'flat', free:true},
      {id:'chainfist',      name:'Chainfist',      cost:15, costMode:'flat'},
      {id:'thunder_hammer', name:'Thunder hammer', cost:15, costMode:'flat'},
    ]},
  { id:'dual_claws', label:'May exchange combi-bolter AND power weapon for:',
    mode:'toggle', scope:'model',
    choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:15, costMode:'flat'} ]},
  { id:'grenade_harness', label:'May take:',
    mode:'toggle', scope:'model',
    choices:[ {id:'grenade_harness', name:'Grenade harness', cost:5, costMode:'flat'} ]},
];

/* ── wspólna reguła Master of the Legion (Praetorzy) ─────────────────────── */
const MASTER_OF_LEGION = { name:'Master of the Legion', parts:[
  {label:'Rites of War', text:'Detachment z co najmniej jednym modelem z tą regułą może wybrać jeden Rite of War.'},
  {label:'The Few and the Proud', text:'Max 1 model z tą regułą na każde 1000 pkt armii (łącznie we wszystkich Detachmentach).'},
  {label:'Retinue', text:'Taki model może włączyć Legion / Cataphractii / Tartaros Command Squad do tego samego slotu FOC.'},
] };

/* ── wspólne opcje Praetora terminatorskiego (Cataphractii/Tartaros) ─────── */
const TERM_PRAETOR_OPTS = [
  { id:'combi_swap', label:'May exchange combi-bolter for one of:', mode:'pick-one', scope:'model',
    choices:[
      {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'flat'},
      {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'flat'},
      {id:'volkite_charger', name:'Volkite charger', cost:2,  costMode:'flat'},
    ]},
  { id:'power_swap', label:'May exchange power weapon for one of:', mode:'pick-one', scope:'model',
    choices:[
      {id:'power_fist',     name:'Power fist',     cost:10, costMode:'flat'},
      {id:'lightning_claw', name:'Lightning claw', cost:0,  costMode:'flat', free:true},
      {id:'chainfist',      name:'Chainfist',      cost:15, costMode:'flat'},
      {id:'thunder_hammer', name:'Thunder hammer', cost:15, costMode:'flat'},
      {id:'paragon_blade',  name:'Paragon blade',  cost:15, costMode:'flat'},
    ]},
  { id:'dual_claws', label:'May exchange combi-bolter AND power weapon for:', mode:'toggle', scope:'model',
    choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:10, costMode:'flat'} ]},
  { id:'grenade_harness', label:'May take:', mode:'toggle', scope:'model',
    choices:[ {id:'grenade_harness', name:'Grenade harness', cost:5, costMode:'flat'} ]},
];

/* ── fabryka terminatorskiego Command Squad (Cataphractii/Tartaros) ──────── */
function termCmdSquad(o){
  return {
    id:o.id, name:o.name, slot:'HQ', baseCost:o.baseCost,
    profileType:'model', composition:{start:3, min:3, max:5},
    profiles:[
      {name:o.chosen, M:o.M, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:o.inv, base:'40mm'},
      {name:o.bearer, M:o.M, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:o.inv, base:'40mm'},
    ],
    wargear:['Legion standard (Standard Bearer only)','Combi-bolter (Chosen only)','Power weapon', o.armour],
    unitType:o.unitType,
    rules:['Legiones Astartes (Space Wolves)','Chosen Warriors','Relentless','Inexorable','Retinue','Bulky (2)'],
    rulesText:[],
    transportNote:'Legion Land Raider Proteus Carrier jako Dedicated Transport (nie zużywa slotu FOC; koszt płatny).',
    options:[
      { id:'extra', label:'May include up to 2 additional Chosen:', mode:'add-models', scope:'unit', min:0, max:2,
        choices:[ {id:'chosen', name:o.chosen, cost:o.addCost, costMode:'per-model'} ]},
      { id:'chosen_combi', label:'Any Chosen may exchange combi-bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'Dotyczy Chosen.',
        choices:[
          {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'per-each'},
          {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'per-each'},
          {id:'volkite_charger', name:'Volkite charger', cost:2,  costMode:'per-each'},
        ]},
      { id:'bearer_ranged', label:'Standard Bearer may exchange power weapon for one of:', mode:'pick-one', scope:'standard',
        choices:[
          {id:'combi_bolter', name:'Combi-bolter', cost:0, costMode:'flat', free:true},
          {id:'magna_combi',  name:'Magna combi-weapon', cost:10, costMode:'flat'},
          {id:'minor_combi',  name:'Minor combi-weapon', cost:5,  costMode:'flat'},
          {id:'volkite_charger', name:'Volkite charger', cost:2,  costMode:'flat'},
        ]},
      { id:'power_swap', label:'Any model may exchange power weapon for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'power_fist',     name:'Power fist',     cost:10, costMode:'per-each'},
          {id:'lightning_claw', name:'Lightning claw', cost:5,  costMode:'per-each'},
          {id:'chainfist',      name:'Chainfist',      cost:15, costMode:'per-each'},
          {id:'thunder_hammer', name:'Thunder hammer', cost:15, costMode:'per-each'},
        ]},
      { id:'dual_claws', label:'Any Chosen may exchange combi-bolter AND power weapon for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'Dotyczy Chosen.',
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:10, costMode:'per-each'} ]},
      { id:'grenade_harness', label:'Standard Bearer may take:', mode:'toggle', scope:'standard',
        choices:[ {id:'grenade_harness', name:'Grenade harness', cost:5, costMode:'flat'} ]},
    ],
  };
}

/* ── fabryka oddziału Terminatorów (Cataphractii/Tartaros) ───────────────── */
function termSquad(o){
  return {
    id:o.id, name:o.name, slot:'EL', baseCost:o.baseCost,
    profileType:'model', composition:{start:5, min:5, max:10},
    profiles:[
      {name:o.trooper,  M:o.M, WS:4, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:7, Sv:'2+', Inv:o.inv, base:'40mm'},
      {name:o.sergeant, M:o.M, WS:4, BS:4, S:4, T:4, W:2, I:4, A:3, Ld:8, Sv:'2+', Inv:o.inv, base:'40mm'},
    ],
    wargear:['Combi-bolter','Power weapon', o.armour],
    unitType:o.unitType,
    rules:['Legiones Astartes (Space Wolves)','Relentless','Inexorable','Bulky (2)'],
    rulesText:[],
    transportNote:'≤5 modeli: Land Raider Proteus / Dreadclaw Drop Pod; 5+ modeli: Land Raider Spartan. Dedicated Transport nie zużywa slotu FOC; koszt płatny.',
    options:[
      { id:'extra', label:'May include up to 5 additional models:', mode:'add-models', scope:'unit', min:0, max:5,
        choices:[ {id:'trooper', name:o.trooper, cost:o.addCost, costMode:'per-model'} ]},
      { id:'vexilla', label:'One model may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'legion_vexilla', name:'Legion vexilla', cost:10, costMode:'flat'} ]},
      { id:'augury', label:'One model may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'augury_scanner', name:'Augury scanner', cost:10, costMode:'flat'} ]},
      { id:'nuncio', label:'One model may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'nuncio_vox', name:'Nuncio-vox', cost:10, costMode:'flat'} ]},
      { id:'special', label:'For every five models, one may exchange combi-bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:5,count:1},
        choices:[
          {id:'heavy_flamer',    name:'Heavy flamer',      cost:5,  costMode:'per-each'},
          {id:'reaper_autocannon',name:'Reaper autocannon',cost:15, costMode:'per-each'},
          {id:'plasma_blaster',  name:'Plasma blaster',    cost:10, costMode:'per-each'},
        ]},
      { id:'combi_swap', label:'Any model may exchange combi-bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'per-each'},
          {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'per-each'},
          {id:'volkite_charger', name:'Volkite charger', cost:2,  costMode:'per-each'},
        ]},
      { id:'power_swap', label:'Any model may exchange power weapon for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'power_fist',     name:'Power fist',     cost:10, costMode:'per-each'},
          {id:'lightning_claw', name:'Lightning claw', cost:5,  costMode:'per-each'},
          {id:'chainfist',      name:'Chainfist',      cost:15, costMode:'per-each'},
          {id:'thunder_hammer', name:'Thunder hammer', cost:15, costMode:'per-each'},
        ]},
      { id:'dual_claws', label:'Any model may exchange combi-bolter AND power weapon for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:10, costMode:'per-each'} ]},
      { id:'sgt_grenade', label:'The Sergeant may take:', mode:'toggle', scope:'sergeant',
        choices:[ {id:'grenade_harness', name:'Grenade harness', cost:5, costMode:'flat'} ]},
    ],
  };
}

const HERESY_UNITS = [

  /* ── HQ · Legion Centurion (power armour) ────────────────────────────────── */
  {
    id:'legion_centurion', name:'Legion Centurion', slot:'HQ', baseCost:60,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Inv 5++ z Refractor field (stały wargear)
      {name:'Legion Centurion', M:7, WS:5, BS:5, S:4, T:4, W:2, I:5, A:3, Ld:9, Sv:'2+', Inv:'5++', base:'32mm'}
    ],
    wargear:['Bolt pistol','Chainsword','Artificer armour','Refractor field','Frag grenades','Krak grenades'],
    unitType:['Infantry (Character)'],
    rules:['Legiones Astartes (Space Wolves)','Independent Character','Legiones Consularis','Relentless'],
    rulesText:[],
    options:[
      { id:'ranged', label:'May take one of the following (ranged):', mode:'pick-one', scope:'model',
        choices:[
          {id:'bolter',           name:'Bolter',             cost:2,  costMode:'flat'},
          {id:'magna_combi',      name:'Magna combi-weapon', cost:10, costMode:'flat'},
          {id:'minor_combi',      name:'Minor combi-weapon', cost:5,  costMode:'flat'},
          {id:'volkite_charger',  name:'Volkite charger',    cost:2,  costMode:'flat'},
          {id:'astartes_shotgun', name:'Astartes shotgun',   cost:2,  costMode:'flat'},
          {id:'nemesis_bolter',   name:'Nemesis bolter',     cost:10, costMode:'flat'},
        ]},
      { id:'melee_swap', label:'May exchange bolt pistol and/or chainsword for one of:', mode:'pick-one', scope:'model',
        note:'Boarding shield: +Heavy Sub-type; niedostępny z jump pack / bike / jetbike.',
        choices:[
          {id:'volkite_serpenta', name:'Volkite serpenta', cost:2,  costMode:'flat'},
          {id:'hand_flamer',      name:'Hand flamer',      cost:2,  costMode:'flat'},
          {id:'plasma_pistol',    name:'Plasma pistol',    cost:10, costMode:'flat'},
          {id:'chainaxe',         name:'Chainaxe',         cost:5,  costMode:'flat'},
          {id:'charnabal',        name:'Charnabal weapon', cost:10, costMode:'flat'},
          {id:'power_weapon',     name:'Power weapon',     cost:15, costMode:'flat'},
          {id:'power_fist',       name:'Power fist',       cost:25, costMode:'flat'},
          {id:'lightning_claw',   name:'Lightning claw',   cost:15, costMode:'flat'},
          {id:'thunder_hammer',   name:'Thunder hammer',   cost:30, costMode:'flat'},
          {id:'boarding_shield',  name:'Boarding shield',  cost:0,  costMode:'flat', free:true, note:'+Heavy'},
        ]},
      { id:'dual_claws', label:'May exchange bolt pistol AND chainsword for:', mode:'toggle', scope:'model',
        note:'Niedostępne z Spatha combat bike / Scimitar jetbike.',
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:15, costMode:'flat'} ]},
      { id:'shield_or_bombs', label:'May take one of the following:', mode:'pick-one', scope:'model',
        choices:[
          {id:'combat_shield', name:'Combat shield', cost:0,  costMode:'flat', free:true, statMods:{Inv:'6++'}},
          {id:'melta_bombs',   name:'Melta bombs',   cost:10, costMode:'flat'},
        ]},
      { id:'mount', label:'May take one of the following (mount):', mode:'pick-one', scope:'model',
        choices:[
          {id:'jump_pack',    name:'Legion Warhawk jump pack',  cost:20, costMode:'flat'},
          {id:'spatha_bike',  name:'Legion Spatha combat bike', cost:20, costMode:'flat'},
          {id:'scimitar_jet', name:'Legion Scimitar jetbike',   cost:30, costMode:'flat'},
        ]},
      CONSUL_SW,
    ],
  },

  /* ── HQ · Legion Cataphractii Centurion ──────────────────────────────────── */
  {
    id:'legion_cataphractii_centurion', name:'Legion Cataphractii Centurion', slot:'HQ', baseCost:85,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Cataphractii Terminator armour: Sv 2+, Inv 4++
      {name:'Legion Cataphractii Centurion', M:6, WS:5, BS:5, S:4, T:4, W:3, I:5, A:3, Ld:9, Sv:'2+', Inv:'4++', base:'40mm'}
    ],
    wargear:['Combi-bolter','Power weapon','Legion Cataphractii Terminator armour'],
    unitType:['Infantry (Heavy, Character)'],
    rules:['Legiones Astartes (Space Wolves)','Independent Character','Legiones Consularis','Relentless','Inexorable','Bulky (2)'],
    rulesText:[],
    options:[ ...TERM_CENTURION_OPTS, CONSUL_SW ],
  },

  /* ── HQ · Legion Tartaros Centurion ──────────────────────────────────────── */
  {
    id:'legion_tartaros_centurion', name:'Legion Tartaros Centurion', slot:'HQ', baseCost:75,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Tartaros Terminator armour: Sv 2+, Inv 5++
      {name:'Legion Tartaros Centurion', M:7, WS:5, BS:5, S:4, T:4, W:3, I:5, A:3, Ld:9, Sv:'2+', Inv:'5++', base:'40mm'}
    ],
    wargear:['Combi-bolter','Power weapon','Legion Tartaros Terminator armour'],
    unitType:['Infantry (Character)'],
    rules:['Legiones Astartes (Space Wolves)','Independent Character','Legiones Consularis','Relentless','Inexorable','Bulky (2)'],
    rulesText:[],
    options:[ ...TERM_CENTURION_OPTS, CONSUL_SW ],
  },

  /* ── HQ · Legion Praetor (power armour) ──────────────────────────────────── */
  {
    id:'legion_praetor', name:'Legion Praetor', slot:'HQ', baseCost:120,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Inv 4++ z Iron halo (stały wargear)
      {name:'Legion Praetor', M:7, WS:6, BS:5, S:4, T:4, W:3, I:5, A:4, Ld:10, Sv:'2+', Inv:'4++', base:'32mm'}
    ],
    wargear:['Bolt pistol','Chainsword','Artificer armour','Iron halo','Frag grenades','Krak grenades'],
    unitType:['Infantry (Character)'],
    rules:['Legiones Astartes (Space Wolves)','Master of the Legion','Independent Character','Relentless'],
    rulesText:[ MASTER_OF_LEGION ],
    options:[
      { id:'ranged', label:'May take one of the following (ranged):', mode:'pick-one', scope:'model',
        choices:[
          {id:'bolter',           name:'Bolter',             cost:2,  costMode:'flat'},
          {id:'magna_combi',      name:'Magna combi-weapon', cost:10, costMode:'flat'},
          {id:'minor_combi',      name:'Minor combi-weapon', cost:5,  costMode:'flat'},
          {id:'volkite_charger',  name:'Volkite charger',    cost:2,  costMode:'flat'},
          {id:'astartes_shotgun', name:'Astartes shotgun',   cost:2,  costMode:'flat'},
          {id:'nemesis_bolter',   name:'Nemesis bolter',     cost:10, costMode:'flat'},
        ]},
      { id:'melee_swap', label:'May exchange bolt pistol and/or chainsword for one of:', mode:'pick-one', scope:'model',
        note:'Boarding shield: +Heavy Sub-type; niedostępny z jump pack / bike / jetbike.',
        choices:[
          {id:'volkite_serpenta',    name:'Volkite serpenta',    cost:2,  costMode:'flat'},
          {id:'hand_flamer',         name:'Hand flamer',         cost:2,  costMode:'flat'},
          {id:'plasma_pistol',       name:'Plasma pistol',       cost:10, costMode:'flat'},
          {id:'archaeotech_pistol',  name:'Archaeotech pistol',  cost:15, costMode:'flat'},
          {id:'disintegrator_pistol',name:'Disintegrator pistol',cost:20, costMode:'flat'},
          {id:'chainaxe',            name:'Chainaxe',            cost:5,  costMode:'flat'},
          {id:'charnabal',           name:'Charnabal weapon',    cost:10, costMode:'flat'},
          {id:'power_weapon',        name:'Power weapon',        cost:15, costMode:'flat'},
          {id:'power_fist',          name:'Power fist',          cost:25, costMode:'flat'},
          {id:'lightning_claw',      name:'Lightning claw',      cost:10, costMode:'flat'},
          {id:'thunder_hammer',      name:'Thunder hammer',      cost:30, costMode:'flat'},
          {id:'paragon_blade',       name:'Paragon blade',       cost:30, costMode:'flat'},
          {id:'boarding_shield',     name:'Boarding shield',     cost:0,  costMode:'flat', free:true, note:'+Heavy'},
        ]},
      { id:'dual_claws', label:'May exchange bolt pistol AND chainsword for:', mode:'toggle', scope:'model',
        note:'Niedostępne z Spatha combat bike / Scimitar jetbike.',
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:20, costMode:'flat'} ]},
      { id:'shield_or_bombs', label:'May take one of the following:', mode:'pick-one', scope:'model',
        choices:[
          {id:'combat_shield', name:'Combat shield', cost:0,  costMode:'flat', free:true, statMods:{Inv:'6++'}},
          {id:'melta_bombs',   name:'Melta bombs',   cost:10, costMode:'flat'},
        ]},
      { id:'master_crafted', label:'May upgrade any one weapon to Master-crafted:', mode:'toggle', scope:'model',
        choices:[ {id:'master_crafted', name:'Master-crafted (one weapon)', cost:10, costMode:'flat'} ]},
      { id:'mount', label:'May take one of the following (mount):', mode:'pick-one', scope:'model',
        choices:[
          {id:'jump_pack',    name:'Legion Warhawk jump pack',  cost:20, costMode:'flat'},
          {id:'spatha_bike',  name:'Legion Spatha combat bike', cost:20, costMode:'flat'},
          {id:'scimitar_jet', name:'Legion Scimitar jetbike',   cost:30, costMode:'flat'},
        ]},
    ],
  },

  /* ── HQ · Legion Cataphractii Praetor ────────────────────────────────────── */
  {
    id:'legion_cataphractii_praetor', name:'Legion Cataphractii Praetor', slot:'HQ', baseCost:135,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      {name:'Legion Cataphractii Praetor', M:6, WS:6, BS:5, S:4, T:4, W:4, I:5, A:4, Ld:10, Sv:'2+', Inv:'4++', base:'40mm'}
    ],
    wargear:['Combi-bolter','Power weapon','Legion Cataphractii Terminator armour'],
    unitType:['Infantry (Heavy, Character)'],
    rules:['Legiones Astartes (Space Wolves)','Master of the Legion','Independent Character','Relentless','Inexorable','Bulky (2)'],
    rulesText:[ MASTER_OF_LEGION ],
    options:[ ...TERM_PRAETOR_OPTS ],
  },

  /* ── HQ · Legion Tartaros Praetor ────────────────────────────────────────── */
  {
    id:'legion_tartaros_praetor', name:'Legion Tartaros Praetor', slot:'HQ', baseCost:110,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      {name:'Legion Tartaros Praetor', M:7, WS:6, BS:5, S:4, T:4, W:4, I:5, A:4, Ld:10, Sv:'2+', Inv:'5++', base:'40mm'}
    ],
    wargear:['Combi-bolter','Power weapon','Legion Tartaros Terminator armour'],
    unitType:['Infantry (Character)'],
    rules:['Legiones Astartes (Space Wolves)','Master of the Legion','Independent Character','Relentless','Inexorable','Bulky (2)'],
    rulesText:[ MASTER_OF_LEGION ],
    options:[ ...TERM_PRAETOR_OPTS ],
  },

  /* ── HQ · Legion Command Squad (power armour) ────────────────────────────── */
  {
    id:'legion_command_squad', name:'Legion Command Squad', slot:'HQ', baseCost:85,
    profileType:'model', composition:{start:3, min:3, max:9},
    profiles:[
      {name:'Legion Chosen',          M:7, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:'—', base:'32mm'},
      {name:'Legion Standard Bearer', M:7, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:'—', base:'32mm'},
    ],
    wargear:['Bolter (Chosen only)','Legion standard (Standard Bearer only)','Bolt pistol','Chainsword','Artificer armour','Frag grenades','Krak grenades'],
    unitType:['Infantry'],
    rules:['Legiones Astartes (Space Wolves)','Chosen Warriors','Relentless','Retinue'],
    rulesText:[],
    transportNote:'Rhino / Land Raider Proteus jako Dedicated Transport (≤5 modeli: zamiast tego Damocles Command Rhino). Nie zużywa slotu FOC; koszt płatny.',
    options:[
      { id:'extra', label:'May include up to 6 additional Legion Chosen:', mode:'add-models', scope:'unit', min:0, max:6,
        choices:[ {id:'chosen', name:'Legion Chosen', cost:18, costMode:'per-model'} ]},
      { id:'bayonet', label:'Any model with a bolter may take one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'bayonet',       name:'Bayonet',       cost:1, costMode:'per-each'},
          {id:'chain_bayonet', name:'Chain bayonet', cost:2, costMode:'per-each'},
        ]},
      { id:'bolter_swap', label:'Any model may exchange bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'combi_bolter', name:'Combi-bolter', cost:5,  costMode:'per-each'},
          {id:'volkite_charger', name:'Volkite charger', cost:2, costMode:'per-each'},
          {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'per-each'},
          {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'per-each'},
        ]},
      { id:'melee_swap', label:'Any model may exchange chainsword and/or bolt pistol for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'Boarding shield: +Heavy; niedostępny z jump pack / bike / jetbike.',
        choices:[
          {id:'charnabal',       name:'Charnabal weapon', cost:5,  costMode:'per-each'},
          {id:'power_weapon',    name:'Power weapon',     cost:5,  costMode:'per-each'},
          {id:'power_fist',      name:'Power fist',       cost:15, costMode:'per-each'},
          {id:'lightning_claw',  name:'Lightning claw',   cost:5,  costMode:'per-each'},
          {id:'plasma_pistol',   name:'Plasma pistol',    cost:10, costMode:'per-each'},
          {id:'boarding_shield', name:'Boarding shield',  cost:5,  costMode:'per-each', note:'+Heavy'},
        ]},
      { id:'dual_claws', label:'Any Legion Chosen may exchange bolt pistol AND chainsword for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'Dotyczy Chosen; nie z bike/jetbike.',
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:10, costMode:'per-each'} ]},
      { id:'nuncio', label:'Any model may select:', mode:'toggle', scope:'each-model',
        choices:[ {id:'nuncio_vox', name:'Nuncio-vox', cost:5, costMode:'per-each'} ]},
      { id:'combat_shield', label:'Any model may select:', mode:'toggle', scope:'each-model',
        choices:[ {id:'combat_shield', name:'Combat shield', cost:2, costMode:'per-each', statMods:{Inv:'6++'}} ]},
      { id:'retinue_mount', label:'Musi dopasować mount do przyłączonego bohatera (Retinue):', mode:'pick-one', scope:'each-model',
        note:'Tylko jeśli przyłączony model ma jump pack / bike / jetbike — squad bierze to samo.',
        choices:[
          {id:'jump_pack',    name:'Legion Warhawk jump pack',  cost:10, costMode:'per-each'},
          {id:'spatha_bike',  name:'Legion Spatha combat bike', cost:10, costMode:'per-each'},
          {id:'scimitar_jet', name:'Legion Scimitar jetbike',   cost:30, costMode:'per-each'},
        ]},
    ],
  },

  termCmdSquad({ id:'legion_cataphractii_command_squad', name:'Legion Cataphractii Command Squad', baseCost:125,
    M:6, inv:'4++', addCost:35, armour:'Legion Cataphractii Terminator armour', unitType:['Infantry (Heavy)'],
    chosen:'Legion Cataphractii Chosen', bearer:'Legion Cataphractii Standard Bearer' }),

  termCmdSquad({ id:'legion_tartaros_command_squad', name:'Legion Tartaros Command Squad', baseCost:110,
    M:7, inv:'5++', addCost:30, armour:'Legion Tartaros Terminator armour', unitType:['Infantry'],
    chosen:'Legion Tartaros Chosen', bearer:'Legion Tartaros Standard Bearer' }),

  /* ── HQ · Geigor Fell-hand (named, unique) ───────────────────────────────── */
  {
    id:'geigor_fell_hand', name:'Geigor Fell-hand', slot:'HQ', baseCost:135,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Refractor field → Inv 5++
      {name:'Geigor Fell-Hand', M:7, WS:5, BS:5, S:4, T:4, W:3, I:5, A:3, Ld:9, Sv:'2+', Inv:'5++', base:'32mm'}
    ],
    wargear:['Bolt pistol','Bolter','The Fell-Hand','Refractor field','Artificer armour','Frag grenades','Krak grenades'],
    weaponProfiles:[
      {name:'The Fell-Hand', profile:'S+1 AP3 — Melee, Master-crafted, Rending (5+), Shred, Reaping Blow (1)'}
    ],
    unitType:['Infantry (Character, Skirmish, Unique)'],
    rules:['Legiones Astartes (Space Wolves)','Independent Character','Relentless','Counter-attack (1)','Master of the Legion','Warlord: Crown Breaker'],
    rulesText:[
      MASTER_OF_LEGION,
      {name:'Warlord: Crown Breaker', text:'Jeśli wybrany na Warlorda, Geigor automatycznie ma Crown Breaker (nie może wybrać innego). Crown Breaker: Geigor i modele w przyłączonym oddziale zyskują Preferred Enemy (Independent Characters) oraz Feel No Pain (5+) w walce z wrogiem z Independent Character. Dodatkowo armia z Geigorem jako Warlordem może wykonać dodatkową Reaction w fazie ruchu przeciwnika, dopóki Geigor żyje.'},
    ],
    options:[],
  },

  /* ── HQ · Hvarl Red-Blade (named, unique) ────────────────────────────────── */
  {
    id:'hvarl_red_blade', name:'Hvarl Red-Blade', slot:'HQ', baseCost:210,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // Iron halo → Inv 4++ (lepsze niż 5++ z Tartaros armour)
      {name:'Hvarl Red-Blade', M:7, WS:6, BS:5, S:4, T:4, W:4, I:5, A:4, Ld:10, Sv:'2+', Inv:'4++', base:'40mm'}
    ],
    wargear:['Hearth-splitter','Heavy bolter','Grenade harness','Iron halo','Legion Tartaros Terminator armour'],
    weaponProfiles:[
      {name:'Hearth-splitter', profile:'S+2 AP2 — Melee, Armourbane (Melee)', note:'Liczony jako broń „Power" dla reguł zależnych od tego typu.'}
    ],
    unitType:['Infantry (Character, Unique)'],
    rules:['Legiones Astartes (Space Wolves)','Independent Character','Battle Cunning','Master of the Legion','Relentless','Inexorable','Counter-attack (1)','Fear (1)','Bulky (2)','Warlord: Head-taker'],
    rulesText:[
      MASTER_OF_LEGION,
      {name:'Battle Cunning', text:'Do trzech oddziałów złożonych wyłącznie z modeli typu Infantry w tym samym Detachmencie co Hvarl może otrzymać Scout.'},
      {name:'Warlord: Head-taker', text:'Jeśli wybrany na Warlorda, Hvarl automatycznie ma Head-taker (nie może wybrać innego). Head-taker: Hvarl i modele w przyłączonym oddziale zyskują Preferred Enemy (Infantry). Dodatkowo armia z Hvarlem jako Warlordem może wykonać dodatkową Reaction w fazie szturmu przeciwnika, dopóki Hvarl żyje.'},
    ],
    options:[],
  },

  /* ── HQ · The Wolf-kin of Russ (named, unique, 2 modele) ─────────────────── */
  {
    id:'wolf_kin_of_russ', name:'The Wolf-kin of Russ', slot:'HQ', baseCost:100,
    profileType:'model', composition:{start:2, min:2, max:2},
    profiles:[
      {name:'Freki', M:10, WS:5, BS:'-', S:5, T:5, W:4, I:5, A:4, Ld:8, Sv:'5+', Inv:'—', base:'90 x 52mm'},
      {name:'Geri',  M:10, WS:7, BS:'-', S:5, T:5, W:4, I:5, A:3, Ld:8, Sv:'5+', Inv:'—', base:'90 x 52mm'},
    ],
    wargear:['Tooth & Claw'],
    weaponProfiles:[
      {name:'Tooth & Claw', profile:'S(User) AP4 — Melee, Breaching (6+)'}
    ],
    unitType:['Infantry (Skirmish, Light, Unique)'],
    rules:['Wolf-kin of Russ','Fearless','Fear (1)','Rampage (2)','Hammer of Wrath (1)','Feel No Pain (5+)','Bulky (4)'],
    rulesText:[
      {name:'Wolf-kin of Russ', text:'Można wziąć tylko jeśli w tym samym Detachmencie jest Leman Russ. Traktowani jak wybór HQ dla reguł/misji/celów, ale nie zajmują slotu na Force Organisation chart. Nie mogą być przyłączeni przez żaden model poza Lemanem Russem.'},
    ],
    options:[],
  },

  /* ── PR · Leman Russ (Primarch) ──────────────────────────────────────────── */
  {
    id:'leman_russ', name:'Leman Russ', slot:'PR', baseCost:450,
    profileType:'model', composition:{start:1, min:1, max:1},
    profiles:[
      // The Armour Elavagar → Inv 4++ (3++ vs Flame/Melta/Plasma)
      {name:'Leman Russ', M:8, WS:8, BS:6, S:7, T:6, W:6, I:7, A:7, Ld:10, Sv:'2+', Inv:'4++', base:'40mm'}
    ],
    wargear:['The Armour Elavagar','The Axe of Helwinter','The Sword of Balenight','Scornspitter','Frag grenades'],
    weaponProfiles:[
      {name:'The Axe of Helwinter',  profile:'S+2 AP2 — Melee, Sunder, Reaping Blow (1), Master-crafted'},
      {name:'The Sword of Balenight',profile:'S+1 AP2 — Melee, Murderous Strike (4+), Brutal (2), Fearsome Ruin, Master-crafted',
        note:'Fearsome Ruin: oddział, który poniósł choć jedną stratę od tej broni i zdaje Morale check w fazie szturmu, rzuca dodatkową D6 i bierze dwie najwyższe.'},
      {name:'Scornspitter', profile:'12" S4 AP3 — Assault 3, Rending (6+)', note:'Liczony jako broń „Bolt" dla reguł zależnych od tego typu.'},
    ],
    unitType:['Primarch (Unique, Skirmish)'],
    rules:['Legiones Astartes (Space Wolves)','Master of the Legion','Howl of the Death Wolf','Counter-attack (2)','Loyalist','Warlord: Sire of the Space Wolves'],
    rulesText:[
      MASTER_OF_LEGION,
      {name:'The Armour Elavagar', text:'2+ Armour Save i 4+ Invulnerable Save (podniesiony do 3+ przeciw broniom typu Flame, Melta i Plasma). Dodatkowo wrogie modele w kontakcie bazowym z Lemanem mają −1 To Hit w walce (max do 6+) w turze, w której Leman wykonał udany Charge.'},
      {name:'Howl of the Death Wolf', text:'Raz na bitwę, na początku swojej tury: przez całą tę turę wszystkie przyjazne modele z Legiones Astartes (Space Wolves) mają +1 M, a wrogie oddziały zawierające taki model muszą natychmiast zdać Pinning test.'},
      {name:'Warlord: Sire of the Space Wolves', text:'Jeśli wybrany na Warlorda, Leman automatycznie ma ten trait (nie może wybrać innego). Sire: wszystkie modele z Legiones Astartes (Space Wolves) w armii Lemana mają +1 S w turze, w której taki oddział skutecznie szarżuje. Dodatkowo armia z Lemanem jako Warlordem może wykonać dodatkową Reaction w fazie szturmu przeciwnika, dopóki Leman żyje.'},
    ],
    options:[],
  },

  /* ── EL · Legion Contemptor Dreadnought Talon ────────────────────────────── */
  {
    id:'legion_contemptor_talon', name:'Legion Contemptor Dreadnought Talon', slot:'EL', baseCost:175,
    profileType:'model', composition:{start:1, min:1, max:3},
    profiles:[
      // Inv 5++ z Atomantic deflector (stały wargear)
      {name:'Contemptor Dreadnought', M:8, WS:5, BS:5, S:7, T:7, W:6, I:4, A:3, Ld:9, Sv:'2+', Inv:'5++', base:'60mm'}
    ],
    wargear:['Gravis bolt cannon','Gravis power fist with in-built combi-bolter','Atomantic deflector'],
    unitType:['Dreadnought'],
    rules:['Legiones Astartes (Space Wolves)','Dreadnought Talon'],
    rulesText:[],
    transportNote:'Talon ≤1 modelu: Legion Dreadnought Drop Pod jako Dedicated Transport (nie zużywa slotu FOC; koszt płatny).',
    options:[
      { id:'extra', label:'May include up to 2 additional Contemptor Dreadnoughts:', mode:'add-models', scope:'unit', min:0, max:2,
        choices:[ {id:'contemptor', name:'Contemptor Dreadnought', cost:175, costMode:'per-model'} ]},
      { id:'main_weapon', label:'Any Contemptor may replace Gravis bolt cannon and/or fist w/ combi-bolter with one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'2× fist / 2× chainfist / fist+chainfist → +1 Attack.',
        choices:[
          {id:'gravis_bolt_cannon',  name:'Gravis bolt cannon',    cost:0,  costMode:'per-each', free:true},
          {id:'gravis_melta_cannon', name:'Gravis melta cannon',   cost:5,  costMode:'per-each'},
          {id:'gravis_autocannon',   name:'Gravis autocannon',     cost:10, costMode:'per-each'},
          {id:'gravis_plasma_cannon',name:'Gravis plasma cannon',  cost:10, costMode:'per-each'},
          {id:'conversion_beam',     name:'Conversion beam cannon',cost:20, costMode:'per-each'},
          {id:'volkite_culverin',    name:'Volkite dual-culverin', cost:15, costMode:'per-each'},
          {id:'kheres',              name:'Kheres assault cannon', cost:15, costMode:'per-each'},
          {id:'gravis_lascannon',    name:'Gravis lascannon',      cost:20, costMode:'per-each'},
          {id:'gravis_fist',         name:'Gravis power fist w/ combi-bolter', cost:0,  costMode:'per-each', free:true, note:'*+1A combo'},
          {id:'gravis_chainfist',    name:'Gravis chainfist w/ combi-bolter',  cost:10, costMode:'per-each', note:'*+1A combo'},
        ]},
      { id:'inbuilt', label:'May replace in-built combi-bolter (on fist/chainfist) with one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'heavy_flamer',   name:'In-built heavy flamer',   cost:5,  costMode:'per-each'},
          {id:'plasma_blaster', name:'In-built plasma blaster', cost:10, costMode:'per-each'},
          {id:'graviton_gun',   name:'In-built graviton gun',   cost:15, costMode:'per-each'},
          {id:'meltagun',       name:'In-built meltagun',       cost:15, costMode:'per-each'},
        ]},
      { id:'havoc', label:'Any Contemptor may take one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'havoc_launcher',  name:'Havoc launcher',         cost:10, costMode:'per-each'},
          {id:'helical_array',   name:'Helical targeting array', cost:10, costMode:'per-each'},
        ]},
    ],
  },

  termSquad({ id:'legion_terminator_cataphractii_squad', name:'Legion Terminator Cataphractii Squad', baseCost:175,
    M:6, inv:'4++', addCost:30, armour:'Legion Cataphractii Terminator armour',
    unitType:['Legion Cataphractii: Infantry (Heavy)','Sergeant: Infantry (Heavy, Character)'],
    trooper:'Legion Cataphractii', sergeant:'Legion Cataphractii Sergeant' }),

  termSquad({ id:'legion_terminator_tartaros_squad', name:'Legion Terminator Tartaros Squad', baseCost:150,
    M:7, inv:'5++', addCost:25, armour:'Legion Tartaros Terminator armour',
    unitType:['Legion Tartaros: Infantry','Sergeant: Infantry (Character)'],
    trooper:'Legion Tartaros', sergeant:'Legion Tartaros Sergeant' }),

  /* ── EL · Legion Veteran Squad ───────────────────────────────────────────── */
  {
    id:'legion_veteran_squad', name:'Legion Veteran Squad', slot:'EL', baseCost:115,
    profileType:'model', composition:{start:5, min:5, max:10},
    profiles:[
      {name:'Legion Veteran',          M:7, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'3+', Inv:'—', base:'32mm'},
      {name:'Legion Veteran Sergeant', M:7, WS:5, BS:4, S:4, T:4, W:2, I:4, A:3, Ld:8, Sv:'3+', Inv:'—', base:'32mm'},
    ],
    wargear:['Bolter','Bolt pistol','Power armour','Frag grenades','Krak grenades'],
    unitType:['Legion Veteran: Infantry','Sergeant: Infantry (Character)'],
    rules:['Legiones Astartes (Space Wolves)','Relentless','Chosen Warriors'],
    rulesText:[],
    transportNote:'Rhino / Drop Pod / Termite Assault Drill jako Dedicated Transport (nie zużywa slotu FOC; koszt płatny).',
    options:[
      { id:'extra', label:'May include up to 5 additional Legion Veterans:', mode:'add-models', scope:'unit', min:0, max:5,
        choices:[ {id:'veteran', name:'Legion Veteran', cost:18, costMode:'per-model'} ]},
      { id:'nuncio', label:'One Veteran may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'nuncio_vox', name:'Nuncio-vox', cost:10, costMode:'flat'} ]},
      { id:'vexilla', label:'One Veteran may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'legion_vexilla', name:'Legion vexilla', cost:10, costMode:'flat'} ]},
      { id:'augury', label:'One Veteran may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'augury_scanner', name:'Augury scanner', cost:10, costMode:'flat'} ]},
      { id:'bayonet', label:'Any model with a bolter may take one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'bayonet',       name:'Bayonet',       cost:1, costMode:'per-each'},
          {id:'chain_bayonet', name:'Chain bayonet', cost:2, costMode:'per-each'},
        ]},
      { id:'bolter_swap', label:'Any model may exchange bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'magna_combi', name:'Magna combi-weapon', cost:10, costMode:'per-each'},
          {id:'minor_combi', name:'Minor combi-weapon', cost:5,  costMode:'per-each'},
          {id:'astartes_shotgun', name:'Astartes shotgun', cost:2, costMode:'per-each'},
          {id:'nemesis_bolter', name:'Nemesis bolter', cost:10, costMode:'per-each'},
        ]},
      { id:'extra_melee', label:'Any model may take one of (extra melee):', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'chainsword',      name:'Chainsword',       cost:2, costMode:'per-each'},
          {id:'heavy_chainsword',name:'Heavy chainsword', cost:5, costMode:'per-each'},
          {id:'charnabal',       name:'Charnabal weapon',  cost:5, costMode:'per-each'},
          {id:'lightning_claw',  name:'Lightning claw',    cost:5, costMode:'per-each'},
          {id:'power_weapon',    name:'Power weapon',      cost:5, costMode:'per-each'},
        ]},
      { id:'pistol_swap', label:'Any model may exchange bolt pistol for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'volkite_serpenta', name:'Volkite serpenta', cost:5, costMode:'per-each'},
          {id:'hand_flamer',      name:'Hand flamer',      cost:2, costMode:'per-each'},
        ]},
      { id:'dual_claws', label:'Any model may exchange bolter AND bolt pistol for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[ {id:'two_lightning_claws', name:'Two lightning claws', cost:10, costMode:'per-each'} ]},
      { id:'special', label:'For every five models, one may exchange bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:5,count:1},
        choices:[
          {id:'flamer',        name:'Flamer',        cost:2,  costMode:'per-each'},
          {id:'meltagun',      name:'Meltagun',      cost:15, costMode:'per-each'},
          {id:'plasma_gun',    name:'Plasma gun',    cost:10, costMode:'per-each'},
          {id:'graviton_gun',  name:'Graviton gun',  cost:15, costMode:'per-each'},
          {id:'heavy_flamer',  name:'Heavy flamer',  cost:10, costMode:'per-each'},
          {id:'heavy_bolter',  name:'Heavy bolter',  cost:15, costMode:'per-each'},
          {id:'missile_launcher', name:'Missile launcher (frag/krak/flak)', cost:15, costMode:'per-each'},
        ]},
      { id:'sgt_heavy', label:'The Sergeant may take one of:', mode:'pick-one', scope:'sergeant',
        choices:[
          {id:'power_fist',     name:'Power fist',     cost:20, costMode:'flat'},
          {id:'thunder_hammer', name:'Thunder hammer', cost:25, costMode:'flat'},
        ]},
      { id:'sgt_pistol', label:'The Sergeant may exchange bolt pistol for:', mode:'single-swap', scope:'sergeant',
        choices:[ {id:'plasma_pistol', name:'Plasma pistol', cost:10, costMode:'flat'} ]},
      { id:'sgt_bombs', label:'The Sergeant may take:', mode:'toggle', scope:'sergeant',
        choices:[ {id:'melta_bombs', name:'Melta bombs', cost:10, costMode:'flat'} ]},
      { id:'sgt_armour', label:'The Sergeant may exchange power armour for:', mode:'single-swap', scope:'sergeant',
        choices:[ {id:'artificer_armour', name:'Artificer armour', cost:10, costMode:'flat', statMods:{Sv:'2+'}} ]},
    ],
  },

  /* ── EL · Deathsworn Pack ────────────────────────────────────────────────── */
  {
    id:'deathsworn_pack', name:'Deathsworn Pack', slot:'EL', baseCost:175,
    profileType:'model', composition:{start:5, min:5, max:10},
    profiles:[
      {name:'Deathsworn', M:7, WS:4, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:'—', base:'32mm'}
    ],
    wargear:['Bolt pistol','Power axe','Ymira class stasis bombs','Artificer armour','Frag grenades','Krak grenades'],
    unitType:['Infantry (Heavy)'],
    rules:['Legiones Astartes (Space Wolves)','Cult of Morkai','The Dreams of the Death Wolf','Counter-attack (1)','Stubborn'],
    rulesText:[
      {name:'Cult of Morkai', text:'Nie może być przyłączony przez modele z Independent Character poza tymi z upgrade Consula Speaker of the Dead lub Caster of Runes. Może być wybrany jako Retinue Squad (zamiast Elites) w Detachmencie z co najmniej jednym takim modelem — wtedy nie zużywa slotu FOC i jest częścią tej samej jednostki co wybrany Leader.'},
      {name:'The Dreams of the Death Wolf', text:'Jeśli model Deathsworn traci ostatnią Wound w fazie szturmu zanim wykonał ataki, odłóż go obok zamiast usuwać. W Initiative Step 1 wszystkie tak odłożone modele mogą wykonać po jednym ataku, po czym są usuwane (nadal liczą się do rozstrzygnięcia walki).'},
      {name:'Ymira class stasis bombs', text:'Wróg szarżujący na jednostkę z tym wargearem wykonuje Disordered Charge. Kontroler może aktywować bomby przy deklaracji własnej szarży (przed rzutem na dystans) — do początku następnej tury wszystkie modele z bombami dodają Fleshbane i Gets Hot do ataków w Fight sub-phase; rany od Gets Hot rozliczane są AP używanej broni.'},
    ],
    transportNote:'Rhino / Land Raider Proteus jako Dedicated Transport (nie zużywa slotu FOC; koszt płatny).',
    options:[
      { id:'extra', label:'May include up to 5 additional Deathsworn:', mode:'add-models', scope:'unit', min:0, max:5,
        choices:[ {id:'deathsworn', name:'Deathsworn', cost:30, costMode:'per-model'} ]},
      { id:'fist_swap', label:'Any model may exchange power axe for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[ {id:'power_fist', name:'Power fist', cost:15, costMode:'per-each'} ]},
      { id:'special', label:'For every five models, one may exchange power axe for one of:', mode:'ratio-swap', scope:'model', ratio:{per:5,count:1},
        choices:[
          {id:'great_frost_blade', name:'Great frost blade', cost:10, costMode:'per-each'},
          {id:'thunder_hammer',    name:'Thunder hammer',    cost:20, costMode:'per-each'},
        ]},
      { id:'unit_grenades', label:'The entire unit may take one of:', mode:'pick-one', scope:'unit',
        choices:[
          {id:'melta_bombs', name:'Melta bombs', cost:20, costMode:'flat', note:'per unit'},
          {id:'rad_grenades', name:'Rad grenades', cost:20, costMode:'flat', note:'per unit'},
        ]},
    ],
  },

  /* ── EL · Varagyr Wolf Guard Terminator Squad ────────────────────────────── */
  {
    id:'varagyr_squad', name:'Varagyr Wolf Guard Terminator Squad', slot:'EL', baseCost:250,
    profileType:'model', composition:{start:5, min:5, max:10},
    profiles:[
      {name:'Varagyr', M:6, WS:5, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'2+', Inv:'4++', base:'40mm'},
      {name:'Thegn',   M:6, WS:5, BS:4, S:4, T:4, W:2, I:4, A:3, Ld:9, Sv:'2+', Inv:'4++', base:'40mm'},
    ],
    wargear:['Frost blade (axe / sword / claw)','Combi-bolter','Legion Cataphractii Terminator armour'],
    unitType:['Varagyr: Infantry (Heavy)','Thegn: Infantry (Heavy, Character)'],
    rules:['Legiones Astartes (Space Wolves)','Fear (1)','Relentless','Counter-attack (1)','Stubborn','Hammer of Wrath (2)','Lordsbane','Bulky (2)'],
    rulesText:[
      {name:'Lordsbane', text:'Model może rzucać i przyjmować Challenge jak gdyby miał Sub-type Character. Dodatkowo w Challenge, jeśli wrogi challenger zostanie usunięty jako strata, dodaje +1 do liczby zadanych Wounds na potrzeby rozstrzygnięcia, kto wygrał walkę.'},
    ],
    transportNote:'≤5 modeli: Land Raider Proteus; dowolny rozmiar: Land Raider Spartan. Dedicated Transport nie zużywa slotu FOC; koszt płatny.',
    options:[
      { id:'frost_choice', label:'Each model: choose frost blade (base, free):', mode:'pick-one', scope:'each-model',
        choices:[
          {id:'frost_axe',   name:'Frost axe',   cost:0, costMode:'flat', free:true},
          {id:'frost_sword', name:'Frost sword', cost:0, costMode:'flat', free:true},
          {id:'frost_claw',  name:'Frost claw',  cost:0, costMode:'flat', free:true},
        ]},
      { id:'extra', label:'May include up to 5 additional Varagyr:', mode:'add-models', scope:'unit', min:0, max:5,
        choices:[ {id:'varagyr', name:'Varagyr', cost:45, costMode:'per-model'} ]},
      { id:'blade_swap', label:'Any model may exchange frost blade for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'power_fist',     name:'Power fist',     cost:10, costMode:'per-each'},
          {id:'chainfist',      name:'Chainfist',      cost:15, costMode:'per-each'},
          {id:'thunder_hammer', name:'Thunder hammer', cost:15, costMode:'per-each'},
        ]},
      { id:'vexilla', label:'One Varagyr may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'legion_vexilla', name:'Legion vexilla', cost:10, costMode:'flat'} ]},
      { id:'combi_swap', label:'Any model may exchange combi-bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'magna_combi',       name:'Magna combi-weapon', cost:10, costMode:'per-each'},
          {id:'minor_combi',       name:'Minor combi-weapon', cost:5,  costMode:'per-each'},
          {id:'second_frost_blade',name:'Second frost blade (axe/claw/sword)', cost:5, costMode:'per-each'},
          {id:'heavy_flamer',      name:'Heavy flamer',       cost:5,  costMode:'per-each'},
          {id:'reaper_autocannon', name:'Reaper autocannon',  cost:15, costMode:'per-each'},
        ]},
      { id:'thegn_blade', label:'The Thegn may exchange frost blade for:', mode:'single-swap', scope:'sergeant',
        choices:[ {id:'great_frost_blade', name:'Great frost blade', cost:10, costMode:'flat'} ]},
      { id:'thegn_grenade', label:'The Thegn may take:', mode:'toggle', scope:'sergeant',
        choices:[ {id:'grenade_harness', name:'Grenade harness', cost:10, costMode:'flat'} ]},
    ],
  },

  /* ── FA · Legion Sky-hunter Squadron ─────────────────────────────────────── */
  {
    id:'legion_skyhunter_squadron', name:'Legion Sky-hunter Squadron', slot:'FA', baseCost:105,
    profileType:'model', composition:{start:3, min:3, max:10},
    profiles:[
      {name:'Legion Sky-hunter',          M:16, WS:4, BS:4, S:4, T:4, W:2, I:4, A:1, Ld:7, Sv:'3+', Inv:'—', base:'60mm flying'},
      {name:'Legion Sky-hunter Sergeant', M:16, WS:4, BS:4, S:4, T:4, W:2, I:4, A:2, Ld:8, Sv:'3+', Inv:'—', base:'60mm flying'},
    ],
    wargear:['Bolt pistol','Chainsword','Power armour','Legion Scimitar jetbike (heavy bolter)'],
    unitType:['Sky-hunter: Cavalry (Antigrav)','Sergeant: Cavalry (Antigrav, Character)'],
    rules:['Legiones Astartes (Space Wolves)','Relentless','Firing Protocols (2)','Hammer of Wrath (1)','Hit & Run','Deep Strike'],
    rulesText:[],
    options:[
      { id:'extra', label:'May include up to 7 additional Legion Sky-hunters:', mode:'add-models', scope:'unit', min:0, max:7,
        choices:[ {id:'skyhunter', name:'Legion Sky-hunter', cost:30, costMode:'per-model'} ]},
      { id:'vexilla', label:'One Sky-hunter may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'legion_vexilla', name:'Legion vexilla', cost:10, costMode:'flat'} ]},
      { id:'nuncio', label:'One Sky-hunter may take:', mode:'toggle', scope:'unit',
        choices:[ {id:'nuncio_vox', name:'Nuncio-vox', cost:10, costMode:'flat'} ]},
      { id:'bike_weapon', label:'Any model may replace jetbike heavy bolter with one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'volkite_culverin', name:'Volkite culverin', cost:5,  costMode:'per-each'},
          {id:'multi_melta',      name:'Multi-melta',      cost:15, costMode:'per-each'},
          {id:'plasma_cannon',    name:'Plasma cannon',    cost:10, costMode:'per-each'},
        ]},
      { id:'pistol_swap', label:'Any model may exchange bolt pistol for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'hand_flamer',      name:'Hand flamer',      cost:2, costMode:'per-each'},
          {id:'volkite_serpenta', name:'Volkite serpenta', cost:5, costMode:'per-each'},
        ]},
      { id:'sgt_melee', label:'The Sergeant may exchange chainsword for one of:', mode:'pick-one', scope:'sergeant',
        choices:[
          {id:'power_weapon',   name:'Power weapon',   cost:10, costMode:'flat'},
          {id:'power_fist',     name:'Power fist',     cost:20, costMode:'flat'},
          {id:'lightning_claw', name:'Lightning claw', cost:10, costMode:'flat'},
        ]},
      { id:'sgt_armour', label:'The Sergeant may exchange power armour for:', mode:'single-swap', scope:'sergeant',
        choices:[ {id:'artificer_armour', name:'Artificer armour', cost:10, costMode:'flat', statMods:{Sv:'2+'}} ]},
    ],
  },

  /* ── HS · Legion Leviathan Dreadnought Talon ─────────────────────────────── */
  {
    id:'legion_leviathan_talon', name:'Legion Leviathan Dreadnought Talon', slot:'HS', baseCost:270,
    profileType:'model', composition:{start:1, min:1, max:3},
    profiles:[
      // Inv 5++ z Atomantic deflector
      {name:'Leviathan Dreadnought', M:6, WS:5, BS:5, S:8, T:8, W:7, I:4, A:5, Ld:9, Sv:'2+', Inv:'5++', base:'80mm'}
    ],
    wargear:['Two Leviathan siege claws with in-built meltagun','Two heavy flamers','Atomantic deflector'],
    unitType:['Dreadnought (Heavy)'],
    rules:['Legiones Astartes (Space Wolves)','Dreadnought Talon','Hammer of Wrath (3)','Move Through Cover'],
    rulesText:[],
    transportNote:'Talon ≤1 modelu: Legion Dreadnought Drop Pod / Kharybdis Assault Claw jako Dedicated Transport (nie zużywa slotu FOC; koszt płatny).',
    options:[
      { id:'extra', label:'May include up to 2 additional Leviathan Dreadnoughts:', mode:'add-models', scope:'unit', min:0, max:2,
        choices:[ {id:'leviathan', name:'Leviathan Dreadnought', cost:270, costMode:'per-model'} ]},
      { id:'claw_swap', label:'May replace either siege claw + in-built meltagun with one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        note:'Storm cannon / cyclonic melta lance / grav-flux bombard → Attacks spada do 4 (raz, niezależnie od liczby wymian).',
        choices:[
          {id:'siege_drill',       name:'Leviathan siege drill w/ meltagun', cost:5,  costMode:'per-each'},
          {id:'storm_cannon',      name:'Leviathan storm cannon',  cost:10, costMode:'per-each', note:'*A→4'},
          {id:'cyclonic_lance',    name:'Cyclonic melta lance',    cost:20, costMode:'per-each', note:'*A→4'},
          {id:'grav_flux',         name:'Grav-flux bombard',       cost:5,  costMode:'per-each', note:'*A→4'},
        ]},
      { id:'phosphex', label:'May take one:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[ {id:'phosphex_discharger', name:'Phosphex discharger', cost:20, costMode:'per-each'} ]},
      { id:'flamer_swap', label:'May exchange both heavy flamers for:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[ {id:'volkite_calivers', name:'Two twin-linked volkite calivers', cost:15, costMode:'per-each'} ]},
    ],
  },

  /* ── DT · Legion Rhino Transport ─────────────────────────────────────────── */
  {
    id:'legion_rhino', name:'Legion Rhino Transport', slot:'DT', baseCost:35,
    profileType:'vehicle', composition:{start:1, min:1, max:1},
    profiles:[
      {name:'Legion Rhino', M:14, BS:4, front:11, side:11, rear:10, hp:3, capacity:12, base:'Use model'}
    ],
    wargear:['Pintle Mounted twin-linked bolter','Smoke launchers'],
    unitType:['Vehicle (Transport)'],
    rules:['Legiones Astartes (Space Wolves)','Repair','Infantry Transport'],
    rulesText:[],
    transportNote:'Tylko jako Dedicated Transport. Access Point na każdym boku kadłuba i z tyłu.',
    options:[
      { id:'extras', label:'May take any of the following:', mode:'toggle', scope:'unit',
        choices:[
          {id:'hunter_killer', name:'Hull hunter-killer missile', cost:5, costMode:'flat'},
          {id:'searchlights',  name:'Searchlights',               cost:5, costMode:'flat'},
          {id:'dozer_blade',   name:'Dozer blade',                cost:5, costMode:'flat'},
        ]},
      { id:'pintle', label:'May take one of the following (pintle):', mode:'pick-one', scope:'unit',
        choices:[
          {id:'tl_bolter',   name:'Pintle twin-linked bolter',   cost:5,  costMode:'flat'},
          {id:'combi',       name:'Pintle combi-weapon (any)',   cost:10, costMode:'flat'},
          {id:'havoc',       name:'Pintle havoc launcher',       cost:15, costMode:'flat'},
          {id:'heavy_bolter',name:'Pintle heavy bolter',         cost:10, costMode:'flat'},
          {id:'heavy_flamer',name:'Pintle heavy flamer',         cost:5,  costMode:'flat'},
          {id:'multi_melta', name:'Pintle multi-melta',          cost:30, costMode:'flat'},
        ]},
    ],
  },

  /* ── DT · Legion Drop Pod ────────────────────────────────────────────────── */
  {
    id:'legion_drop_pod', name:'Legion Drop Pod', slot:'DT', baseCost:35,
    profileType:'vehicle', composition:{start:1, min:1, max:1},
    profiles:[
      {name:'Legion Drop Pod', M:'-', BS:2, front:12, side:12, rear:12, hp:3, capacity:10, base:'Use model'}
    ],
    wargear:['Pintle Mounted twin-linked bolter'],
    unitType:['Vehicle (Transport)'],
    rules:['Legiones Astartes (Space Wolves)','Inertial Guidance System','Impact-reactive Doors','Orbital Assault Vehicle','Deep Strike','Infantry Transport'],
    rulesText:[],
    transportNote:'Tylko jako Dedicated Transport. Access Point na każdym boku.',
    options:[],
  },

  /* ── DT · Legion Dreadnought Drop Pod ────────────────────────────────────── */
  {
    id:'legion_dreadnought_drop_pod', name:'Legion Dreadnought Drop Pod', slot:'DT', baseCost:100,
    profileType:'vehicle', composition:{start:1, min:1, max:1},
    profiles:[
      {name:'Legion Dreadnought Drop Pod', M:'-', BS:2, front:12, side:12, rear:12, hp:3, capacity:'*', base:'Use model'}
    ],
    wargear:['Impact-reactive Doors'],
    unitType:['Vehicle (Transport*)'],
    rules:['Legiones Astartes (Space Wolves)','Inertial Guidance System','Orbital Assault Vehicle','Impact-reactive Doors','Deep Strike','Dreadnought Transport'],
    rulesText:[
      {name:'Transport Capacity', text:'Brak zwykłej pojemności (*): może przewieźć jednego Dreadnoughta dzięki regule Dreadnought Transport.'},
    ],
    transportNote:'Tylko jako Dedicated Transport (dla Dreadnoughta). Access Point na każdym boku.',
    options:[],
  },

  /* ── DT · Legion Land Raider Proteus Carrier Squadron ────────────────────── */
  {
    id:'legion_land_raider_proteus', name:'Legion Land Raider Proteus Carrier Squadron', slot:'DT', baseCost:220,
    profileType:'vehicle', composition:{start:1, min:1, max:3},
    profiles:[
      {name:'Legion Land Raider Proteus Carrier', M:12, BS:4, front:14, side:14, rear:14, hp:5, capacity:12, base:'Use model'}
    ],
    wargear:['Two Sponson Mounted Gravis lascannon','Hull (Front) twin-linked heavy bolter','Smoke launchers'],
    unitType:['Vehicle (Transport, Reinforced)'],
    rules:['Legiones Astartes (Space Wolves)','Power of the Machine Spirit','Assault Vehicle'],
    rulesText:[],
    transportNote:'Access Point na każdym boku kadłuba i z przodu. Może być brany jako Dedicated Transport lub jako samodzielny squadron.',
    options:[
      { id:'extra', label:'May include up to 2 additional Proteus Carriers:', mode:'add-models', scope:'unit', min:0, max:2,
        choices:[ {id:'proteus', name:'Legion Land Raider Proteus Carrier', cost:205, costMode:'per-model'} ]},
      { id:'hull_swap', label:'Any Carrier may exchange hull twin-linked heavy bolter for one of:', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'tl_heavy_flamer', name:'Hull twin-linked heavy flamer', cost:0,  costMode:'per-each', free:true},
          {id:'tl_lascannon',    name:'Hull twin-linked lascannon',    cost:15, costMode:'per-each'},
        ]},
      { id:'pintle', label:'Any Carrier may take one of the following (pintle):', mode:'ratio-swap', scope:'model', ratio:{per:1,count:1},
        choices:[
          {id:'tl_bolter',   name:'Pintle twin-linked bolter', cost:5,  costMode:'per-each'},
          {id:'combi',       name:'Pintle combi-weapon (any)', cost:10, costMode:'per-each'},
          {id:'heavy_bolter',name:'Pintle heavy bolter',       cost:10, costMode:'per-each'},
          {id:'heavy_flamer',name:'Pintle heavy flamer',       cost:5,  costMode:'per-each'},
          {id:'multi_melta', name:'Pintle multi-melta',        cost:20, costMode:'per-each'},
          {id:'havoc',       name:'Pintle havoc launcher',     cost:15, costMode:'per-each'},
        ]},
      { id:'extras', label:'Any Carrier may take any of the following:', mode:'toggle', scope:'each-model',
        choices:[
          {id:'hunter_killer', name:'Hull hunter-killer missile', cost:5, costMode:'per-each'},
          {id:'searchlights',  name:'Searchlights',               cost:5, costMode:'per-each'},
        ]},
    ],
  },

];

/* ── dyscypliny psychiczne (docelowo heresy-psychic.js) ──────────────────── */
const HERESY_PSYCHIC = {
  winds_of_fenris:{
    name:'Winds of Fenris',
    note:'Psyker z tą dyscypliną otrzymuje wszystkie poniższe: bronie, moce i reguły.',
    weapons:[ {name:'Wrath of the Death Wolf', kind:'Psychic Weapon', profile:'Template S5 AP4 — Assault 1, Deflagrate, Force'} ],
    powers:[ {name:'Stormwrought', kind:'Psychic Power',
      text:'Zamiast strzału: wybierz przyjazny oddział (Infantry/Cavalry/Dreadnought) z modelem w 6". Zyskuje Shrouded (5+) do początku Twojej następnej fazy strzelania. Możesz zdać Psychic check — sukces: Shrouded (3+); porażka: Shrouded (5+) i Perils of the Warp.'} ],
    rules:[ {name:'Force',
      text:'Przed atakiem bronią/zdolnością z tą regułą psyker może zdać Psychic check. Sukces: podwaja Strength ataków. Porażka: Perils of the Warp na jednostkę psykera; jeśli przeżyje — atakuje normalnie.'} ],
  },
};

if (typeof window !== 'undefined') { window.HERESY_UNITS = HERESY_UNITS; window.HERESY_PSYCHIC = HERESY_PSYCHIC; }
