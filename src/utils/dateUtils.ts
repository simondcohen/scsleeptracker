// Format date for the date input
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date for display in the table
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00'); // Use noon to avoid timezone issues
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

// Is the given date the current day?
export const isCurrentDay = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const checkDate = new Date(dateString + 'T12:00:00');
  checkDate.setHours(12, 0, 0, 0);
  
  return today.getTime() === checkDate.getTime();
};

// Get the Sunday of a given week (start of week)
export const getSundayOfWeek = (date: Date): Date => {
  const result = new Date(date.getTime());
  result.setHours(12, 0, 0, 0);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return result;
};

// Get array of dates from Sunday to Saturday
export const getWeekDates = (startDate: Date): Date[] => {
  const sunday = getSundayOfWeek(startDate);
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    date.setHours(12, 0, 0, 0);
    dates.push(date);
  }
  
  return dates;
};