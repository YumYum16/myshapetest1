// MyShape — Données des montures de lunettes
// 12 montures MVP avec informations complètes

export type FaceShape = 'Ovale' | 'Carré' | 'Rond' | 'Triangulaire' | 'Diamant';
export type FrameStyle = 'classique' | 'tendance' | 'sport';

export interface Frame {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  affiliate: string;
  affiliateUrl: string;
  compatibleShapes: FaceShape[];
  style: FrameStyle;
  shape: 'round' | 'rectangular' | 'cat-eye' | 'aviator' | 'clubmaster' | 'square' | 'oval';
  description: string;
  material: string;
  color: string;
}

export const frames: Frame[] = [
  {
    id: 'ray-ban-clubmaster',
    name: 'Clubmaster RB3016',
    brand: 'Ray-Ban',
    price: 149,
    currency: '€',
    affiliate: 'Optical Center',
    affiliateUrl: 'https://www.opticalcenter.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=ray-ban-clubmaster',
    compatibleShapes: ['Ovale', 'Carré'],
    style: 'classique',
    shape: 'clubmaster',
    description: 'L\'icône intemporelle. Monture browline semi-cerclée qui allie style vintage et modernité.',
    material: 'Acétate & métal',
    color: 'Noir & or',
  },
  {
    id: 'tom-ford-ft5304',
    name: 'FT5304',
    brand: 'Tom Ford',
    price: 285,
    currency: '€',
    affiliate: 'Sensee',
    affiliateUrl: 'https://www.sensee.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=tom-ford-ft5304',
    compatibleShapes: ['Ovale', 'Diamant'],
    style: 'tendance',
    shape: 'rectangular',
    description: 'Élégance italienne. Monture rectangulaire au design épuré avec logo TF signature.',
    material: 'Acétate premium',
    color: 'Écaille de tortue',
  },
  {
    id: 'persol-po3007v',
    name: 'PO3007V',
    brand: 'Persol',
    price: 195,
    currency: '€',
    affiliate: 'EasyVerres',
    affiliateUrl: 'https://www.easyverres.com/?utm_source=myshape&utm_medium=catalogue&utm_campaign=persol-po3007v',
    compatibleShapes: ['Rond', 'Ovale'],
    style: 'classique',
    shape: 'round',
    description: 'Artisanat italien depuis 1917. Monture ronde avec la charnière Meflecto brevetée.',
    material: 'Acétate artisanal',
    color: 'Havane',
  },
  {
    id: 'oakley-holbrook',
    name: 'Holbrook OX8156',
    brand: 'Oakley',
    price: 129,
    currency: '€',
    affiliate: 'Optical Center',
    affiliateUrl: 'https://www.opticalcenter.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=oakley-holbrook',
    compatibleShapes: ['Carré', 'Triangulaire'],
    style: 'sport',
    shape: 'rectangular',
    description: 'Performance et style. Design inspiré des années 40 avec technologie Oakley moderne.',
    material: 'O-Matter™',
    color: 'Noir mat',
  },
  {
    id: 'lindberg-air-titanium',
    name: 'Air Titanium',
    brand: 'Lindberg',
    price: 420,
    currency: '€',
    affiliate: 'Sensee',
    affiliateUrl: 'https://www.sensee.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=lindberg-air-titanium',
    compatibleShapes: ['Ovale'],
    style: 'tendance',
    shape: 'oval',
    description: 'L\'ultra-légèreté danoise. Moins de 2 grammes, sans vis ni soudures. Confort absolu.',
    material: 'Titane pur',
    color: 'Argent brossé',
  },
  {
    id: 'garrett-leight',
    name: 'Wilson M',
    brand: 'Garrett Leight',
    price: 310,
    currency: '€',
    affiliate: 'EasyVerres',
    affiliateUrl: 'https://www.easyverres.com/?utm_source=myshape&utm_medium=catalogue&utm_campaign=garrett-leight',
    compatibleShapes: ['Diamant', 'Ovale'],
    style: 'tendance',
    shape: 'round',
    description: 'L\'esprit Venice Beach. Monture ronde artisanale fabriquée à Los Angeles.',
    material: 'Acétate Zyl',
    color: 'Cristal fumé',
  },
  {
    id: 'warby-parker-beckett',
    name: 'Beckett',
    brand: 'Warby Parker',
    price: 95,
    currency: '€',
    affiliate: 'Optical Center',
    affiliateUrl: 'https://www.opticalcenter.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=warby-parker-beckett',
    compatibleShapes: ['Rond', 'Carré'],
    style: 'classique',
    shape: 'rectangular',
    description: 'Accessibilité sans compromis. Design intemporel à prix démocratique.',
    material: 'Acétate recyclé',
    color: 'Bleu marine',
  },
  {
    id: 'celine-cl50008i',
    name: 'CL50008I',
    brand: 'Céline',
    price: 265,
    currency: '€',
    affiliate: 'Sensee',
    affiliateUrl: 'https://www.sensee.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=celine-cl50008i',
    compatibleShapes: ['Triangulaire', 'Ovale'],
    style: 'tendance',
    shape: 'cat-eye',
    description: 'Féminité parisienne. Monture cat-eye iconique de la maison Céline.',
    material: 'Acétate & métal',
    color: 'Noir brillant',
  },
  {
    id: 'mykita-mylon',
    name: 'Mylon Quill',
    brand: 'Mykita',
    price: 380,
    currency: '€',
    affiliate: 'EasyVerres',
    affiliateUrl: 'https://www.easyverres.com/?utm_source=myshape&utm_medium=catalogue&utm_campaign=mykita-mylon',
    compatibleShapes: ['Carré'],
    style: 'tendance',
    shape: 'square',
    description: 'Innovation berlinoise. Fabriquée par impression 3D en nylon, légère et résistante.',
    material: 'Nylon SLS',
    color: 'Gris anthracite',
  },
  {
    id: 'oliver-peoples-ov5183',
    name: 'OV5183 Gregory Peck',
    brand: 'Oliver Peoples',
    price: 340,
    currency: '€',
    affiliate: 'Optical Center',
    affiliateUrl: 'https://www.opticalcenter.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=oliver-peoples-ov5183',
    compatibleShapes: ['Ovale', 'Rond'],
    style: 'classique',
    shape: 'round',
    description: 'Hollywood vintage. Inspirée des lunettes portées par Gregory Peck dans les années 60.',
    material: 'Acétate japonais',
    color: 'Écaille dorée',
  },
  {
    id: 'prada-pr17wv',
    name: 'PR 17WV',
    brand: 'Prada',
    price: 295,
    currency: '€',
    affiliate: 'Sensee',
    affiliateUrl: 'https://www.sensee.fr/?utm_source=myshape&utm_medium=catalogue&utm_campaign=prada-pr17wv',
    compatibleShapes: ['Diamant', 'Carré'],
    style: 'tendance',
    shape: 'cat-eye',
    description: 'Audace milanaise. Monture géométrique avec les détails signature Prada.',
    material: 'Acétate & métal',
    color: 'Bordeaux',
  },
  {
    id: 'moscot-lemtosh',
    name: 'Lemtosh',
    brand: 'Moscot',
    price: 225,
    currency: '€',
    affiliate: 'EasyVerres',
    affiliateUrl: 'https://www.easyverres.com/?utm_source=myshape&utm_medium=catalogue&utm_campaign=moscot-lemtosh',
    compatibleShapes: ['Ovale', 'Rond'],
    style: 'classique',
    shape: 'round',
    description: 'New York depuis 1915. La monture ronde intellectuelle portée par Johnny Depp.',
    material: 'Acétate Zyl',
    color: 'Caramel',
  },
];

export const framesByShape = (shape: FaceShape): Frame[] => {
  return frames.filter(f => f.compatibleShapes.includes(shape));
};

export const getFrameById = (id: string): Frame | undefined => {
  return frames.find(f => f.id === id);
};
