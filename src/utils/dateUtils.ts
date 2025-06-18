/**
 * Format a date into a human-readable string
 * @param date The date to format
 * @returns Formatted date string (e.g., "June 15, 2023")
 */
export function formatDate(date: Date | string): string {
  // If the date is a string in YYYY-MM-DD, append 'T12:00:00' to avoid UTC offset issues
  let d = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(date + 'T12:00:00')
    : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date including time
 * @param date The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param date The date to convert to relative time
 * @returns A relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (diffInSecs < 60) {
    return 'just now';
  }
  if (diffInMins < 60) {
    return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
} 