import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Share2, Sparkles, Plus, Award } from 'lucide-react';
import { CommunityPost } from '../types';

interface CommunityForumViewProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Motivasi');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  const filterTabs = ['Semua', 'Motivasi', 'Tips Olahraga', 'Menu Sehat', 'Pencapaian'];

  const filteredPosts = posts.filter((p) => {
    if (selectedFilter === 'Semua') return true;
    return p.category === selectedFilter;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddPost({
      id: 'post-' + Date.now(),
      authorName: 'Pengguna Bugar (Saya)',
      authorTitle: 'Anggota Aktif',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserMe',
      category: newCategory,
      content: newContent.trim(),
      likesCount: 0,
      hasLiked: false,
      comments: [],
      createdAt: 'Baru saja',
    });

    setNewContent('');
    setIsNewPostOpen(false);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
    setActiveCommentPostId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forum Komunitas & Saling Berbagi Motivasi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Berbagi kisah inspiratif, tips latihan, rekomendasi makanan sehat, dan rayakan konsistensi bersama ribuan pengguna lainnya.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Bagikan Motivasi Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* New Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreatePost}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Tulis Kiriman Motivasi Komunitas
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPostOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Kategori
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CommunityPost['category'])}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="Motivasi">Motivasi & Cerita Disiplin</option>
                <option value="Tips Olahraga">Tips & Trik Latihan</option>
                <option value="Menu Sehat">Menu & Resep Sehat</option>
                <option value="Pencapaian">Pencapaian & Streak Baru</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Isi Pesan
              </label>
              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Bagikan pengalaman latihan, kendala yang berhasil dilewati, atau tips pola makan sehat Anda hari ini..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsNewPostOpen(false)}
                className="flex-1 py-2.5 font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 font-semibold rounded-xl bg-emerald-500 text-white shadow-xs"
              >
                Kirim ke Komunitas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4"
          >
            {/* Author Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {post.authorName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{post.authorTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Unboxed category label */}
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Attached workout summary if present */}
            {post.workoutSummary && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {post.workoutSummary.exerciseName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-mono tabular-nums">
                  <span>{post.workoutSummary.durationMin} menit</span>
                  <span>·</span>
                  <span className="text-orange-500 font-semibold">{post.workoutSummary.caloriesBurned} kcal</span>
                </div>
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                    post.hasLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                  }`}
                  aria-label="Sukai postingan"
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                  <span className="font-mono tabular-nums">{post.likesCount} Suka</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors cursor-pointer"
                  aria-label="Tampilkan komentar"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-mono tabular-nums">{post.comments.length} Komentar</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Komunitas BugarKu ID
              </span>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in text-xs">
                {/* Existing comments */}
                {post.comments.length > 0 && (
                  <div className="space-y-2">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                    placeholder="Tulis tanggapan atau kata semangat..."
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCommentSubmit(post.id)}
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
