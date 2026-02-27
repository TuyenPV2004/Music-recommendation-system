const GENRE_COLORS = [
  "bg-red-500/10 text-red-400 border-red-500/20",
  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "bg-green-500/10 text-green-400 border-green-500/20",
  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "bg-teal-500/10 text-teal-400 border-teal-500/20",
];

export const getGenreColorClass = (id) => {
  // Simple hash to consistently pick a color based on string/int ID
  if (!id) return GENRE_COLORS[0];
  const strId = id.toString();
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GENRE_COLORS[Math.abs(hash) % GENRE_COLORS.length];
};
