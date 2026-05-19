import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Loader2, Mail } from 'lucide-react';
import { FavoriteGlasses } from '@/hooks/useFavorites';
import { MorphologyResult } from '@/hooks/useSimpleFaceDetection';

interface EmailRecommendationsFormProps {
  morphology: MorphologyResult | null;
  favorites: FavoriteGlasses[];
  onSuccess?: () => void;
}

export default function EmailRecommendationsForm({
  morphology,
  favorites,
  onSuccess,
}: EmailRecommendationsFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Send email with recommendations
      const response = await fetch('/api/send-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          morphology: morphology ? {
            type: morphology.type,
            explanation: morphology.explanation,
            confidence: morphology.confidence,
          } : null,
          favorites: favorites.map((fav) => ({
            id: fav.id,
            name: fav.name,
            brand: fav.brand,
            price: fav.price,
            rating: fav.rating,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des recommandations');
      }

      setSuccess(true);
      setEmail('');
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Recevoir vos recommandations par email
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || success}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A2622] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D6E4F] disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isLoading || success || !email}
            className="bg-[#0D6E4F] hover:bg-[#0a5540] text-white"
          >
            {success ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Envoyé
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 dark:text-green-300">
            Recommandations envoyées ! Vérifiez votre email.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Nous vous enverrons vos recommandations personnalisées basées sur votre morphologie faciale
        et vos lunettes préférées.
      </p>
    </form>
  );
}
