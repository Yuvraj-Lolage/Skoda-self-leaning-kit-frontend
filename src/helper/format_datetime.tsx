export const formatLastActive = (timestamp: string) => {
  if (!timestamp) return "Offline";

  const now = new Date().getTime();
  const last = new Date(timestamp).getTime();
  const diff = now - last;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return "Online";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};