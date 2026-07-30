export interface RouteDef {
  id: 'route1' | 'route2'
  title: string
  subtitle: string
  ferryBadge: string
  stopIds: string[]
}

export const ROUTES: RouteDef[] = [
  {
    id: 'route1',
    title: 'Route 1 · Mit Fähre',
    subtitle: 'Hirtshals → Kristiansand',
    ferryBadge: '⛴️ Fähre Dänemark → Norwegen',
    stopIds: [
      'skagen-grenen',
      'hirtshals-ferry',
      'lysebotn',
      'preikestolen',
      'trolltunga',
      'voringsfossen',
      'bergen',
      'naeroyfjord',
      'flam',
      'sognefjellsvegen',
      'geirangerfjord',
      'trollstigen',
      'atlanterhavsveien',
      'lofoten',
      'oslo',
      'oresund-bridge',
      'copenhagen',
      'mons-klint',
      'return-home',
    ],
  },
  {
    id: 'route2',
    title: 'Route 2 · Landweg',
    subtitle: 'Über Schweden, nur kleine Fjord-Fähren',
    ferryBadge: '🌉 Nur Brücken, keine internationale Fähre',
    stopIds: [
      'copenhagen',
      'mons-klint',
      'skagen-grenen',
      'gothenburg',
      'svinesund-bridge',
      'lysebotn',
      'preikestolen',
      'trolltunga',
      'voringsfossen',
      'bergen',
      'naeroyfjord',
      'flam',
      'sognefjellsvegen',
      'geirangerfjord',
      'trollstigen',
      'atlanterhavsveien',
      'lofoten',
      'oslo',
      'return-home',
    ],
  },
]

export const ROUTE_COMPARISON =
  'Route 1 spart durch die Fähre rund 500 km Umweg über Schweden, dafür bist du an feste Abfahrtszeiten gebunden. ' +
  'Route 2 ist flexibler und zeigt mehr von Schweden nebenbei, dafür ein paar hundert Kilometer mehr auf dem Tacho.'
