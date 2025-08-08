
/**
 * Checks if a given date is today.
 * @param someDate The date to check.
 * @returns True if the date is today, false otherwise.
 */
export const isToday = (someDate: Date): boolean => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

/**
 * Checks if a given date was yesterday.
 * @param someDate The date to check.
 * @returns True if the date was yesterday, false otherwise.
 */
export const isYesterday = (someDate: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return someDate.getDate() === yesterday.getDate() &&
        someDate.getMonth() === yesterday.getMonth() &&
        someDate.getFullYear() === yesterday.getFullYear();
};
