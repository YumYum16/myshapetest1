// MyShape — Logique de classification de morphologie faciale
// Basée sur MediaPipe Face Mesh 468 landmarks
// Landmarks clés utilisés pour les mesures

export type FaceShape = 'Ovale' | 'Carré' | 'Rond' | 'Triangulaire' | 'Diamant';

export interface FaceMeasurements {
  faceWidth: number;       // largeur pommettes (cheekbone to cheekbone)
  jawWidth: number;        // largeur mâchoire
  foreheadWidth: number;   // largeur front
  faceHeight: number;      // hauteur totale du visage
  heightToWidthRatio: number;
  jawToForeheadRatio: number;
  cheekToJawRatio: number;
  cheekToForeheadRatio: number;
}

export interface ClassificationResult {
  shape: FaceShape;
  confidence: number;
  measurements: FaceMeasurements;
  description: string;
  recommendations: string[];
  toAvoid: string[];
}

// Indices des landmarks MediaPipe Face Mesh
// Référence: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
export const LANDMARK_INDICES = {
  // Contour du visage
  leftCheek: 234,          // pommette gauche
  rightCheek: 454,         // pommette droite
  leftJaw: 172,            // mâchoire gauche
  rightJaw: 397,           // mâchoire droite
  chin: 152,               // menton
  foreheadTop: 10,         // sommet du front
  leftForehead: 103,       // front gauche
  rightForehead: 332,      // front droit
  leftTemple: 127,         // tempe gauche
  rightTemple: 356,        // tempe droite
  
  // Yeux (pour AR overlay)
  leftEyeOuter: 33,        // coin externe œil gauche
  rightEyeOuter: 263,      // coin externe œil droit
  leftEyeInner: 133,       // coin interne œil gauche
  rightEyeInner: 362,      // coin interne œil droit
  leftEyeTop: 159,         // haut œil gauche
  leftEyeBottom: 145,      // bas œil gauche
  rightEyeTop: 386,        // haut œil droit
  rightEyeBottom: 374,     // bas œil droit
  
  // Nez
  noseTip: 4,
  noseLeft: 129,
  noseRight: 358,
  
  // Bouche
  mouthLeft: 61,
  mouthRight: 291,
};

export function computeMeasurements(landmarks: { x: number; y: number; z: number }[]): FaceMeasurements {
  const lm = landmarks;
  
  // Largeur des pommettes (cheekbones)
  const leftCheek = lm[LANDMARK_INDICES.leftCheek];
  const rightCheek = lm[LANDMARK_INDICES.rightCheek];
  const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
  
  // Largeur de la mâchoire
  const leftJaw = lm[LANDMARK_INDICES.leftJaw];
  const rightJaw = lm[LANDMARK_INDICES.rightJaw];
  const jawWidth = Math.abs(rightJaw.x - leftJaw.x);
  
  // Largeur du front
  const leftForehead = lm[LANDMARK_INDICES.leftForehead];
  const rightForehead = lm[LANDMARK_INDICES.rightForehead];
  const foreheadWidth = Math.abs(rightForehead.x - leftForehead.x);
  
  // Hauteur du visage (front → menton)
  const foreheadTop = lm[LANDMARK_INDICES.foreheadTop];
  const chin = lm[LANDMARK_INDICES.chin];
  const faceHeight = Math.abs(chin.y - foreheadTop.y);
  
  const heightToWidthRatio = faceHeight / faceWidth;
  const jawToForeheadRatio = jawWidth / foreheadWidth;
  const cheekToJawRatio = faceWidth / jawWidth;
  const cheekToForeheadRatio = faceWidth / foreheadWidth;
  
  return {
    faceWidth,
    jawWidth,
    foreheadWidth,
    faceHeight,
    heightToWidthRatio,
    jawToForeheadRatio,
    cheekToJawRatio,
    cheekToForeheadRatio,
  };
}

export function classifyFaceShape(measurements: FaceMeasurements): ClassificationResult {
  const { heightToWidthRatio, jawToForeheadRatio, cheekToJawRatio, cheekToForeheadRatio } = measurements;
  
  // Scores pour chaque morphologie (plus élevé = plus probable)
  const scores: Record<FaceShape, number> = {
    'Ovale': 0,
    'Carré': 0,
    'Rond': 0,
    'Triangulaire': 0,
    'Diamant': 0,
  };
  
  // Règles de classification
  
  // OVALE: ratio hauteur/largeur ~1.5, mâchoire < pommettes, front ≈ pommettes
  if (heightToWidthRatio >= 1.3 && heightToWidthRatio <= 1.7) scores['Ovale'] += 3;
  if (heightToWidthRatio >= 1.2 && heightToWidthRatio <= 1.8) scores['Ovale'] += 1;
  if (cheekToJawRatio >= 1.1 && cheekToJawRatio <= 1.3) scores['Ovale'] += 2;
  if (cheekToForeheadRatio >= 0.9 && cheekToForeheadRatio <= 1.15) scores['Ovale'] += 2;
  
  // CARRÉ: ratio hauteur/largeur ~1, mâchoire ≈ front ≈ pommettes, mâchoire anguleuse
  if (heightToWidthRatio >= 0.85 && heightToWidthRatio <= 1.15) scores['Carré'] += 3;
  if (jawToForeheadRatio >= 0.9 && jawToForeheadRatio <= 1.1) scores['Carré'] += 3;
  if (cheekToJawRatio >= 0.95 && cheekToJawRatio <= 1.1) scores['Carré'] += 2;
  
  // ROND: ratio hauteur/largeur ~1, mâchoire douce, pommettes larges
  if (heightToWidthRatio >= 0.85 && heightToWidthRatio <= 1.1) scores['Rond'] += 2;
  if (cheekToJawRatio >= 1.15 && cheekToJawRatio <= 1.4) scores['Rond'] += 3;
  if (jawToForeheadRatio >= 0.85 && jawToForeheadRatio <= 1.05) scores['Rond'] += 2;
  
  // TRIANGULAIRE: mâchoire > front
  if (jawToForeheadRatio >= 1.1) scores['Triangulaire'] += 4;
  if (jawToForeheadRatio >= 1.2) scores['Triangulaire'] += 2;
  if (cheekToJawRatio <= 1.05) scores['Triangulaire'] += 2;
  
  // DIAMANT: front étroit + mâchoire étroite, pommettes très larges
  if (cheekToForeheadRatio >= 1.2) scores['Diamant'] += 3;
  if (cheekToJawRatio >= 1.2) scores['Diamant'] += 3;
  if (jawToForeheadRatio >= 0.85 && jawToForeheadRatio <= 1.1) scores['Diamant'] += 1;
  if (heightToWidthRatio >= 1.2) scores['Diamant'] += 1;
  
  // Trouver la morphologie avec le score le plus élevé
  const sortedShapes = (Object.entries(scores) as [FaceShape, number][])
    .sort(([, a], [, b]) => b - a);
  
  const topShape = sortedShapes[0][0];
  const topScore = sortedShapes[0][1];
  const totalScore = sortedShapes.reduce((sum, [, s]) => sum + s, 0);
  const confidence = totalScore > 0 ? Math.min(topScore / totalScore, 1) : 0.5;
  
  return {
    shape: topShape,
    confidence: Math.round(confidence * 100),
    measurements,
    ...getFaceShapeInfo(topShape),
  };
}

export function getFaceShapeInfo(shape: FaceShape): { description: string; recommendations: string[]; toAvoid: string[] } {
  const info: Record<FaceShape, { description: string; recommendations: string[]; toAvoid: string[] }> = {
    'Ovale': {
      description: 'La morphologie ovale est considérée comme la plus polyvalente. Votre visage est légèrement plus long que large, avec des pommettes qui constituent la partie la plus large.',
      recommendations: ['Montures rectangulaires', 'Montures carrées', 'Montures cat-eye', 'Aviateurs', 'Clubmaster'],
      toAvoid: ['Montures trop petites', 'Montures trop grandes par rapport au visage'],
    },
    'Carré': {
      description: 'Votre visage présente une mâchoire forte et anguleuse, un front large et des pommettes prononcées. La largeur et la hauteur sont similaires.',
      recommendations: ['Montures rondes', 'Montures ovales', 'Montures cat-eye', 'Montures semi-cerclées'],
      toAvoid: ['Montures carrées', 'Montures rectangulaires', 'Montures anguleuses'],
    },
    'Rond': {
      description: 'Votre visage est aussi large que long, avec des courbes douces et une mâchoire arrondie. Les pommettes sont la partie la plus large.',
      recommendations: ['Montures rectangulaires', 'Montures carrées', 'Montures géométriques', 'Montures à pont haut'],
      toAvoid: ['Montures rondes', 'Montures petites', 'Montures sans angles'],
    },
    'Triangulaire': {
      description: 'Votre mâchoire est plus large que votre front. Ce visage en forme de poire est caractérisé par un menton fort et un front étroit.',
      recommendations: ['Montures cat-eye', 'Montures semi-cerclées', 'Montures plus larges en haut', 'Montures aviateur'],
      toAvoid: ['Montures qui s\'élargissent vers le bas', 'Montures très petites'],
    },
    'Diamant': {
      description: 'Votre visage est caractérisé par des pommettes larges et proéminentes, avec un front et une mâchoire étroits. C\'est la morphologie la plus rare.',
      recommendations: ['Montures cat-eye', 'Montures ovales', 'Montures sans cerclage', 'Montures rimless'],
      toAvoid: ['Montures trop étroites', 'Montures qui accentuent les pommettes'],
    },
  };
  
  return info[shape];
}

export function getEyePositionForAR(landmarks: { x: number; y: number; z: number }[], videoWidth: number, videoHeight: number) {
  const leftEyeOuter = landmarks[LANDMARK_INDICES.leftEyeOuter];
  const rightEyeOuter = landmarks[LANDMARK_INDICES.rightEyeOuter];
  const leftEyeInner = landmarks[LANDMARK_INDICES.leftEyeInner];
  const rightEyeInner = landmarks[LANDMARK_INDICES.rightEyeInner];
  
  // Centre entre les deux yeux
  const centerX = ((leftEyeOuter.x + rightEyeOuter.x) / 2) * videoWidth;
  const centerY = ((leftEyeOuter.y + rightEyeOuter.y) / 2) * videoHeight;
  
  // Largeur des lunettes = distance entre coins externes des yeux
  const eyeSpanX = Math.abs(rightEyeOuter.x - leftEyeOuter.x) * videoWidth;
  const eyeSpanY = Math.abs(rightEyeOuter.y - leftEyeOuter.y) * videoHeight;
  
  // Angle de rotation
  const angle = Math.atan2(
    rightEyeOuter.y - leftEyeOuter.y,
    rightEyeOuter.x - leftEyeOuter.x
  ) * (180 / Math.PI);
  
  // Largeur des lunettes (avec marge)
  const glassesWidth = eyeSpanX * 1.6;
  
  return {
    centerX,
    centerY,
    glassesWidth,
    angle,
    eyeSpanX,
  };
}
