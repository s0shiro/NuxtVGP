/**
 * Shared date formatting utilities for the application
 */

export const useDateFormatting = () => {
  /**
   * Formats a launch date string into a human-readable format
   * @param dateString - The date string to format (ISO format)
   * @param fallbackText - Text to return if date is null/undefined (default: 'Unknown')
   * @returns Formatted date string or fallback text
   */
  const formatLaunchDate = (dateString: string | null | undefined, fallbackText = 'Unknown'): string => {
    if (!dateString) return fallbackText

    try {
      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date)
    } catch (error) {
      console.warn('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  /**
   * Formats a date for display without time
   * @param dateString - The date string to format
   * @param fallbackText - Text to return if date is null/undefined
   * @returns Formatted date string (date only)
   */
  const formatDateOnly = (dateString: string | null | undefined, fallbackText = 'Unknown'): string => {
    if (!dateString) return fallbackText

    try {
      const date = new Date(dateString)

      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      console.warn('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  /**
   * Formats a date for relative time (e.g., "2 days ago")
   * @param dateString - The date string to format
   * @returns Relative time string
   */
  const formatRelativeTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Unknown'

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

      if (diffInDays === 0) return 'Today'
      if (diffInDays === 1) return 'Yesterday'
      if (diffInDays < 0) return 'In the future'
      if (diffInDays < 7) return `${diffInDays} days ago`
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
      return `${Math.floor(diffInDays / 365)} years ago`
    } catch (error) {
      console.warn('Error formatting relative time:', error)
      return 'Unknown'
    }
  }

  return {
    formatLaunchDate,
    formatDateOnly,
    formatRelativeTime
  }
}
