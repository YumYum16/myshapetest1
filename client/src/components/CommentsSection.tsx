import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, X } from 'lucide-react';

interface Comment {
  id: string;
  frameId: string;
  author: string;
  rating: number;
  text: string;
  timestamp: number;
  likes: number;
  liked?: boolean;
}

interface CommentsSectionProps {
  frameId: string;
  frameName: string;
}

export default function CommentsSection({ frameId, frameName }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Load comments from localStorage
  useEffect(() => {
    const storageKey = `comments_${frameId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setComments(parsed);
      } catch (e) {
        console.error('Error parsing comments:', e);
      }
    }

    // Load liked comments
    const likedKey = `liked_comments_${frameId}`;
    const likedStored = localStorage.getItem(likedKey);
    if (likedStored) {
      try {
        setLiked(new Set(JSON.parse(likedStored)));
      } catch (e) {
        console.error('Error parsing liked:', e);
      }
    }
  }, [frameId]);

  const handleSubmitComment = () => {
    if (!newComment.trim() || !author.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      frameId,
      author,
      rating: newRating,
      text: newComment,
      timestamp: Date.now(),
      likes: 0,
      liked: false,
    };

    const updated = [comment, ...comments];
    setComments(updated);

    // Save to localStorage
    const storageKey = `comments_${frameId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Reset form
    setNewComment('');
    setNewRating(5);
    setAuthor('');
    setShowForm(false);
  };

  const handleLike = (commentId: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLiked(newLiked);

    // Save to localStorage
    const likedKey = `liked_comments_${frameId}`;
    localStorage.setItem(likedKey, JSON.stringify(Array.from(newLiked)));

    // Update comment likes
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, likes: c.likes + (newLiked.has(commentId) ? 1 : -1) }
          : c
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);

    // Save to localStorage
    const storageKey = `comments_${frameId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)}j`;

    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8" data-animate>
      <div className="mb-6">
        <h3
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C2B26' }}
        >
          Avis des utilisateurs ({comments.length})
        </h3>
        <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
          Partagez votre expérience avec cette monture
        </p>
      </div>

      {/* Add comment form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ color: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
        >
          + Ajouter un avis
        </button>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200" data-animate>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Votre avis
            </h4>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-200 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Author */}
            <input
              type="text"
              placeholder="Votre nom"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#0D6E4F' } as any}
            />

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Note :</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    {star <= newRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment text */}
            <textarea
              placeholder="Partagez votre avis sur cette monture..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
              rows={3}
              style={{ '--tw-ring-color': '#0D6E4F' } as any}
            />

            {/* Submit button */}
            <div className="flex gap-2">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || !author.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#0D6E4F', fontFamily: "'DM Sans', sans-serif" }}
              >
                Publier l'avis
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 transition-colors hover:bg-gray-100"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
            Aucun avis pour le moment. Soyez le premier à partager votre expérience !
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-animate
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: '#1C2B26' }}
                  >
                    {comment.author}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{ color: i < comment.rating ? '#FCD34D' : '#E5E7EB' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span
                      style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}
                    >
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                  title="Supprimer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p
                className="text-sm mb-3"
                style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}
              >
                {comment.text}
              </p>

              <div className="flex gap-4 text-xs" style={{ color: '#6B7280' }}>
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={liked.has(comment.id) ? 'currentColor' : 'none'}
                  />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
