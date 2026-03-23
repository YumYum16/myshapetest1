// Vision LLM-based face shape analysis
// Replaces MediaPipe with a more accurate LLM-powered approach

export type FaceShape = 'Ovale' | 'Carré' | 'Rond' | 'Triangulaire' | 'Diamant';

export interface LLMAnalysisResult {
  shape: FaceShape;
  confidence: number;
  analysis_details: string;
}

export interface ClassificationResult extends LLMAnalysisResult {
  description: string;
  recommendations: string[];
  toAvoid: string[];
}

// Map English shape names to French
const shapeMapping: Record<string, FaceShape> = {
  'oval': 'Ovale',
  'round': 'Rond',
  'square': 'Carré',
  'triangular': 'Triangulaire',
  'diamond': 'Diamant',
  'heart': 'Ovale',
};

export async function analyzeFaceWithLLM(imageUrl: string): Promise<LLMAnalysisResult> {
  try {
    const response = await fetch('/api/analyze-face', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map English shape to French
    const frenchShape = shapeMapping[data.face_shape.toLowerCase()] || 'Ovale';
    
    return {
      shape: frenchShape,
      confidence: Math.min(Math.max(data.confidence, 0), 100),
      analysis_details: data.analysis_details || '',
    };
  } catch (error) {
    console.error('LLM analysis error:', error);
    throw error;
  }
}

export function getFullClassification(result: LLMAnalysisResult): ClassificationResult {
  const info = getFaceShapeInfo(result.shape);
  return {
    ...result,
    ...info,
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
