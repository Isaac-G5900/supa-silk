const RECENT_JOBS_KEY = 'recentlyViewedJobs';
const MAX_RECENT_JOBS = 50;

export interface RecentJob {
  id: string;
  title: string;
  viewedAt: number;
}

export const addRecentJob = (job: { id: string; title: string }) => {
  try {
    const recentJobs: RecentJob[] = JSON.parse(localStorage.getItem(RECENT_JOBS_KEY) || '[]');
    
    // Remove if already exists
    const filteredJobs = recentJobs.filter(j => j.id !== job.id);
    
    // Add to front of array with timestamp
    const updatedJobs = [
      { ...job, viewedAt: Date.now() },
      ...filteredJobs
    ].slice(0, MAX_RECENT_JOBS);

    localStorage.setItem(RECENT_JOBS_KEY, JSON.stringify(updatedJobs));
  } catch (error) {
    console.error('Error saving recent job:', error);
  }
};

export const getRecentJobs = (): RecentJob[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_JOBS_KEY) || '[]');
  } catch {
    return [];
  }
};