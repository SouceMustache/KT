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
   STAN: Etap 1 — HQ: 3 Centuriony + 3 Praetorzy + 3 Command Squady. Dalej: named characters (Leman Russ, Geigor, Hvarl, Wolf-kin).
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
