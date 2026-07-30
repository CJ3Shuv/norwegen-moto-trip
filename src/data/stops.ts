export interface StopImage {
  url: string
  author: string
  license: string
  sourceUrl: string
}

export type StopTag = 'ferry' | 'bridge' | 'border' | 'city' | 'landmark'

export interface Stop {
  id: string
  name: string
  country: 'DK' | 'NO' | 'SE'
  lat: number
  lng: number
  tag: StopTag
  fact: string
  description: string
  image: StopImage | null
}

export const STOPS: Record<string, Stop> = {
  'skagen-grenen': {
    id: 'skagen-grenen',
    name: 'Skagen · Grenen',
    country: 'DK',
    lat: 57.7508,
    lng: 10.6355,
    tag: 'landmark',
    fact: 'Hier krachen zwei Meere aufeinander – steh mit einem Fuß in der Nordsee, mit dem anderen in der Ostsee!',
    description:
      'An der Sandspitze Grenen treffen Nordsee und Kattegat sichtbar aufeinander – ein spektakulärer Startpunkt, bevor es Richtung Norwegen geht.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Grenen_Denmark_Panorama_Skagerrak_and_Kattegat_strait_North_Sea_and_Baltic_Sea_-_Foto_2018_Wolfgang_Pehlemann_DSC01703.jpg?width=1200',
      author: 'Wolfgang Pehlemann',
      license: 'CC BY-SA 3.0 DE',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Grenen_Denmark_Panorama_Skagerrak_and_Kattegat_strait_North_Sea_and_Baltic_Sea_-_Foto_2018_Wolfgang_Pehlemann_DSC01703.jpg',
    },
  },
  'hirtshals-ferry': {
    id: 'hirtshals-ferry',
    name: 'Fähre Hirtshals → Kristiansand',
    country: 'DK',
    lat: 57.5892,
    lng: 9.9647,
    tag: 'ferry',
    fact: 'Bike auf die Fähre, Helm ab, Salzluft rein – in wenigen Stunden liegt Norwegen vor dir!',
    description:
      'Die Fähre bringt Motorrad und Fahrer in gut drei Stunden über das Skagerrak direkt nach Kristiansand – spart den Umweg über Schweden.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fjordline_express_ferry,_Hirtshals.jpg?width=1200',
      author: 'Fanny Schertzer',
      license: 'CC BY-SA 3.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Fjordline_express_ferry,_Hirtshals.jpg',
    },
  },
  lysebotn: {
    id: 'lysebotn',
    name: 'Lysevegen · Lysebotn',
    country: 'NO',
    lat: 59.03,
    lng: 6.63,
    tag: 'landmark',
    fact: '27 Haarnadelkurven und ein Tunnel durch den Berg – die wildeste Abfahrt deines Lebens wartet in Lysebotn!',
    description:
      'Die Lysevegen schraubt sich in engen Serpentinen vom Fjordgrund hoch zum Plateau – einer der spektakulärsten Straßenabschnitte Norwegens.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lysefjorden_-_road_to_Lysebotn.JPG?width=1200',
      author: 'Mercy',
      license: 'CC BY-SA 3.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lysefjorden_-_road_to_Lysebotn.JPG',
    },
  },
  preikestolen: {
    id: 'preikestolen',
    name: 'Preikestolen',
    country: 'NO',
    lat: 58.9866,
    lng: 6.19,
    tag: 'landmark',
    fact: '604 Meter senkrecht über dem Lysefjord – der Preikestolen ist Norwegens spektakulärste Aussichtskanzel!',
    description:
      'Die berühmte Felskanzel hängt 604 Meter senkrecht über dem Lysefjord. Der Parkplatz ist der Ausgangspunkt für die Wanderung zum Gipfel.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Preikestolen_Norge.jpg?width=1200',
      author: 'Stefan Krause, Germany',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Preikestolen_Norge.jpg',
    },
  },
  trolltunga: {
    id: 'trolltunga',
    name: 'Trolltunga',
    country: 'NO',
    lat: 60.1242,
    lng: 6.74,
    tag: 'landmark',
    fact: 'Die Trollzunge streckt sich 700 Meter über den Ringedalsvatnet – Nervenkitzel garantiert!',
    description:
      'Die weit auskragende Felszunge über dem See Ringedalsvatnet ist eines der meistfotografierten Motive Norwegens – die Wanderung dorthin dauert einen ganzen Tag.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trolltunga_2.jpg?width=1200',
      author: 'Steinar Talmoen (Calxibe)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trolltunga_2.jpg',
    },
  },
  voringsfossen: {
    id: 'voringsfossen',
    name: 'Hardangervidda · Vøringsfossen',
    country: 'NO',
    lat: 60.4142,
    lng: 7.2764,
    tag: 'landmark',
    fact: '182 Meter tosendes Wasser stürzen von der Hardangervidda – Naturgewalt pur direkt neben der Straße!',
    description:
      'Der Vøringsfossen stürzt rund 180 Meter in die Schlucht am Rand der Hardangervidda, Norwegens größtem Hochplateau – karge, weite Bergwelt.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/V%C3%B8ringfossen.jpg?width=1200',
      author: 'Kenny Louie',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:V%C3%B8ringfossen.jpg',
    },
  },
  bergen: {
    id: 'bergen',
    name: 'Bergen',
    country: 'NO',
    lat: 60.3913,
    lng: 5.3221,
    tag: 'city',
    fact: 'Bunte Hanseholzhäuser, Fischgeruch und Kopfsteinpflaster – Bryggen ist Bergens quirlige Seele!',
    description:
      'Die Hafenstadt zwischen sieben Bergen mit dem UNESCO-Welterbe Bryggen ist der klassische Ausgangspunkt für die Fjordregion.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bryggen_Bergen.jpg?width=1200',
      author: 'Nina Aldin Thune',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bryggen_Bergen.jpg',
    },
  },
  naeroyfjord: {
    id: 'naeroyfjord',
    name: 'Nærøyfjord',
    country: 'NO',
    lat: 60.9667,
    lng: 6.9,
    tag: 'ferry',
    fact: 'Steilwände, die kaum Platz für Licht lassen – der Nærøyfjord ist Norwegens schmalste UNESCO-Sensation!',
    description:
      'Nur 250 Meter breit an seiner engsten Stelle, steile Felswände auf beiden Seiten – UNESCO-Welterbe und einer der eindrücklichsten Fjorde überhaupt.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/N%C3%A6r%C3%B8yfjorden.jpg?width=1200',
      author: 'Fylkesarkivet i Sogn og Fjordane',
      license: 'Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:N%C3%A6r%C3%B8yfjorden.jpg',
    },
  },
  flam: {
    id: 'flam',
    name: 'Flåm · Aurlandsfjellet',
    country: 'NO',
    lat: 60.8642,
    lng: 7.1146,
    tag: 'landmark',
    fact: 'Schwebe 650 Meter über dem Aurlandsfjord auf einer Plattform, die scheinbar ins Nichts ragt!',
    description:
      'Von Flåm windet sich die Aurlandsfjellet-Passstraße hinauf zum Stegastein-Aussichtspunkt – freischwebend über dem Aurlandsfjord.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stegastein_viewpoint_-_panoramio_(1).jpg?width=1200',
      author: 'TomasEE',
      license: 'CC BY 3.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Stegastein_viewpoint_-_panoramio_(1).jpg',
    },
  },
  sognefjellsvegen: {
    id: 'sognefjellsvegen',
    name: 'Sognefjellsvegen',
    country: 'NO',
    lat: 61.5333,
    lng: 8.2667,
    tag: 'landmark',
    fact: 'Norwegens höchste Passstraße, mitten im Juli noch Schnee am Straßenrand – Gänsehaut-Kurven im Hochgebirge!',
    description:
      'Die höchste durchgehend geöffnete Gebirgsstraße Nordeuropas führt auf über 1400 Metern zwischen Gletschern und Schneefeldern hindurch.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sognefjellsvegen.jpg?width=1200',
      author: 'Arno van den Tillaart',
      license: 'CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sognefjellsvegen.jpg',
    },
  },
  geirangerfjord: {
    id: 'geirangerfjord',
    name: 'Geirangerfjord · Ørnevegen',
    country: 'NO',
    lat: 62.1049,
    lng: 7.2062,
    tag: 'ferry',
    fact: 'Von der Adlerstraße blickst du auf den Geirangerfjord und die Sieben Schwestern – Postkartenmotiv live erlebt!',
    description:
      'Der Ørnevegen ("Adlerstraße") schraubt sich in elf Kehren aus dem Geirangerfjord empor – Blick auf Wasserfälle wie die "Sieben Schwestern".',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C3%98rnesvingen.JPG?width=1200',
      author: 'Ximonic (Simo Räsänen)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:%C3%98rnesvingen.JPG',
    },
  },
  trollstigen: {
    id: 'trollstigen',
    name: 'Trollstigen',
    country: 'NO',
    lat: 62.4499,
    lng: 7.6849,
    tag: 'landmark',
    fact: 'Elf Haarnadelkurven, ein tosender Wasserfall – Trollstigen ist die Königsdisziplin für jeden Motorradfahrer!',
    description:
      'Elf enge Serpentinen erklimmen 850 Höhenmeter, vorbei am Stigfossen-Wasserfall – eine der bekanntesten Passstraßen Norwegens.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trollstigen_Norway_2004.jpg?width=1200',
      author: 'Paweł Kuźniar (Jojo)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trollstigen_Norway_2004.jpg',
    },
  },
  atlanterhavsveien: {
    id: 'atlanterhavsveien',
    name: 'Atlanterhavsveien',
    country: 'NO',
    lat: 63.0167,
    lng: 7.4667,
    tag: 'landmark',
    fact: 'Brücken, die aussehen, als würden sie ins Meer stürzen – die Atlantikstraße ist Achterbahn und Ozean zugleich!',
    description:
      'Die Atlantikstraße hüpft über acht Brücken von Insel zu Insel, direkt über den offenen Atlantik – bei Sturm spritzt die Gischt über die Fahrbahn.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Storseisundet_03.jpg?width=1200',
      author: 'edward stojakovic',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Storseisundet_03.jpg',
    },
  },
  lofoten: {
    id: 'lofoten',
    name: 'Lofoten',
    country: 'NO',
    lat: 67.93,
    lng: 13.09,
    tag: 'landmark',
    fact: 'Rote Fischerhütten vor zackigen Gipfeln – Reine ist das schönste Dorf der Lofoten, vielleicht der Welt!',
    description:
      'Steile Granitgipfel stürzen direkt ins Meer, dazwischen rote Fischerhütten (Rorbuer) – nördlich des Polarkreises, im Sommer mit Mitternachtssonne.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Reine_Lofoten.jpg?width=1200',
      author: 'Clemensfranz',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Reine_Lofoten.jpg',
    },
  },
  oslo: {
    id: 'oslo',
    name: 'Oslo',
    country: 'NO',
    lat: 59.9139,
    lng: 10.7522,
    tag: 'city',
    fact: 'Die Oper thront wie ein Eisberg am Fjord – Oslos Skyline empfängt dich nach tausend Kilometern Asphalt!',
    description:
      'Norwegens Hauptstadt am Oslofjord markiert auf dem Rückweg den Übergang zurück Richtung Schweden und Dänemark.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Oslo_Opera_House_01.JPG?width=1200',
      author: 'Oikema 0',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oslo_Opera_House_01.JPG',
    },
  },
  'oresund-bridge': {
    id: 'oresund-bridge',
    name: 'Öresundbrücke',
    country: 'DK',
    lat: 55.5763,
    lng: 12.8496,
    tag: 'bridge',
    fact: 'Acht Kilometer über dem Meer – die Öresundbrücke verbindet Dänemark und Schweden in spektakulärem Stahl!',
    description:
      'Die Öresundbrücke verbindet Schweden und Dänemark über eine Kombination aus Brücke, künstlicher Insel und Tunnel unter der Schifffahrtsrinne.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C3%98resund_Bridge_from_the_air_in_September_2015.jpg?width=1200',
      author: 'Nick-D',
      license: 'CC BY-SA 4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:%C3%98resund_Bridge_from_the_air_in_September_2015.jpg',
    },
  },
  copenhagen: {
    id: 'copenhagen',
    name: 'Kopenhagen',
    country: 'DK',
    lat: 55.6761,
    lng: 12.5683,
    tag: 'city',
    fact: 'Bunte Fassaden, Segelboote, Craft Beer am Kai – Nyhavn ist Kopenhagens fotogenste Ecke!',
    description:
      'Die dänische Hauptstadt mit dem berühmten Nyhavn-Kanal ist ein entspannter Zwischenstopp auf dem Rückweg Richtung Deutschland.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nyhavn_Copenhagen_2.jpg?width=1200',
      author: 'Kallerna',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nyhavn_Copenhagen_2.jpg',
    },
  },
  'mons-klint': {
    id: 'mons-klint',
    name: 'Møns Klint',
    country: 'DK',
    lat: 54.95,
    lng: 12.5333,
    tag: 'landmark',
    fact: '120 Meter weiße Kreidefelsen stürzen ins türkisblaue Meer – Dänemarks spektakulärste Steilküste!',
    description:
      'Bis zu 128 Meter hohe, strahlend weiße Kreidefelsen fallen zur Ostsee ab – einer der ungewöhnlichsten Küstenabschnitte Dänemarks.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%B8ns_Klint.1.JPG?width=1200',
      author: 'Erik Christensen',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M%C3%B8ns_Klint.1.JPG',
    },
  },
  gothenburg: {
    id: 'gothenburg',
    name: 'Göteborg',
    country: 'SE',
    lat: 57.7089,
    lng: 11.9746,
    tag: 'city',
    fact: 'Kanäle, Kopfsteinpflaster und Hafenflair – Göteborg ist Schwedens lässigste Stadt auf deiner Heimreise!',
    description:
      'Schwedens zweitgrößte Stadt mit Kanälen und Hafenflair ist auf der Landroute ein entspannter Zwischenstopp vor der norwegischen Grenze.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gothenburg_skyline_(3883926931).jpg?width=1200',
      author: 'Allen Watkin',
      license: 'CC BY-SA 2.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Gothenburg_skyline_(3883926931).jpg',
    },
  },
  'svinesund-bridge': {
    id: 'svinesund-bridge',
    name: 'Svinesundbrücke',
    country: 'SE',
    lat: 59.1167,
    lng: 11.2667,
    tag: 'border',
    fact: 'Ein letzter Schwung über die stählerne Bogenbrücke – hier verabschiedet sich Norwegen und Schweden beginnt!',
    description:
      'Die markante Bogenbrücke über den Svinesund markiert die Landgrenze zwischen Schweden und Norwegen – rein über Asphalt, keine Fähre nötig.',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Svinesundbrua.JPG?width=1200',
      author: 'Vetle Houg',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Svinesundbrua.JPG',
    },
  },
  'return-home': {
    id: 'return-home',
    name: 'Rückweg: Jütland · Flensburg → Hannover',
    country: 'DK',
    lat: 54.7937,
    lng: 9.437,
    tag: 'border',
    fact: 'Letzte Tankfüllung, letzter Grenzübertritt – dann ist das Abenteuer geschafft.',
    description:
      'Über die dänische Halbinsel Jütland und die Grenze bei Flensburg geht es zurück nach Hannover – der letzte Tag der großen Runde.',
    image: null,
  },
}

export const HERO_IMAGE: StopImage = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trollstigen_panorama.jpg?width=1600',
  author: 'TomasEE',
  license: 'CC BY 3.0',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trollstigen_panorama.jpg',
}
