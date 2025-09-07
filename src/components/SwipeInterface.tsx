import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, Clock, DollarSign, Filter as FilterIcon, Bookmark, Loader2, Search, XCircle, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { JobDetailsModal } from './JobDetailsModal';
import { FilterModal, FilterOptions } from './FilterModal';
import { useAppContext, Job } from '../contexts/AppContext';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, serverTimestamp, orderBy, limit, startAfter, DocumentData } from 'firebase/firestore';

export function SwipeInterface() {
  const { currentUser } = useAppContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const swipedJobIdsRef = useRef<Set<string>>(new Set());

  // Fetch initial jobs
  const fetchJobs = useCallback(async (reset = true) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      if (reset) {
        setLoading(true);
        setJobs([]);
        setCurrentJobIndex(0);
        setLastVisible(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      // 1. Fetch IDs of jobs already swiped by the user
      const swipesCollection = collection(db, 'swipes');
      const swipesQuery = query(swipesCollection, where('userId', '==', currentUser.id));
      const swipeSnapshot = await getDocs(swipesQuery);
      const swipedIds = new Set(swipeSnapshot.docs.map(doc => doc.data().jobId));
      
      if (reset) {
        swipedJobIdsRef.current = swipedIds;
      }

      // 2. Build the jobs query with filters
      const jobsCollection = collection(db, 'jobs');
      let jobsQuery = query(
        jobsCollection,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      // Apply filters if any
      if (filters) {
        if (filters.minPay > 10) {
          jobsQuery = query(jobsQuery, where('hourlyRate', '>=', filters.minPay));
        }
        if (filters.maxPay < 50) {
          jobsQuery = query(jobsQuery, where('hourlyRate', '<=', filters.maxPay));
        }
        if (filters.categories.length > 0) {
          jobsQuery = query(jobsQuery, where('category', 'in', filters.categories));
        }
        if (filters.urgentOnly) {
          jobsQuery = query(jobsQuery, where('isUrgent', '==', true));
        }
        if (filters.remoteWork) {
          jobsQuery = query(jobsQuery, where('isRemote', '==', true));
        }
        if (filters.duration && filters.duration.length > 0) {
          jobsQuery = query(jobsQuery, where('duration', 'in', filters.duration));
        }
      }

      // Add pagination
      if (lastVisible && !reset) {
        jobsQuery = query(jobsQuery, startAfter(lastVisible));
      }

      // Execute the query
      const jobSnapshot = await getDocs(jobsQuery);
      
      // Update pagination state
      if (jobSnapshot.docs.length > 0) {
        setLastVisible(jobSnapshot.docs[jobSnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }

      // Process and filter jobs
      const newJobs = jobSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Job))
        .filter(job => !swipedIds.has(job.id)); // Filter out swiped jobs

      // Apply search filter if query exists
      const filteredJobs = searchQuery 
        ? newJobs.filter(job => 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : newJobs;

      const filterJobs = (jobs: Job[]) => {
        if (!filters) return jobs;
        return jobs.filter(job => 
          (filters.minPay <= job.hourlyRate && filters.maxPay >= job.hourlyRate) &&
          (filters.categories.length === 0 || filters.categories.includes(job.category)) &&
          (filters.urgentOnly ? job.isUrgent : true) &&
          (filters.remoteWork ? job.isRemote : true) &&
          (filters.duration.length === 0 || filters.duration.includes(job.duration))
        );
      };

      const filteredJobsWithFilters = filterJobs(filteredJobs);

      // Update jobs state
      if (reset) {
        setJobs(filteredJobsWithFilters);
      } else {
        setJobs(prev => [...prev, ...filteredJobsWithFilters]);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentUser, filters, searchQuery, lastVisible]);

  // Initial fetch and when filters/search change
  useEffect(() => {
    fetchJobs(true);
  }, [fetchJobs]);

  // Load more jobs when scrolling
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - 100 && 
      !loading && 
      !loadingMore && 
      hasMore
    ) {
      fetchJobs(false);
    }
  }, [loading, loadingMore, hasMore, fetchJobs]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    fetchJobs(true);
  };
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const currentJob = jobs[currentJobIndex];

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Swipe right - like
      handleSwipe('like');
    } else if (offset < -100 || velocity < -500) {
      // Swipe left - pass
      handleSwipe('pass');
    } else {
      // Snap back
      x.set(0);
    }
  };

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!currentJob || !currentUser) return;
    
    // Don't allow new swipes while applying
    if (isApplying) return;
    
    // Set applying state to prevent multiple swipes
    setIsApplying(true);
    
    try {
      // Record the swipe action in Firestore to prevent seeing the same job again
      const swipesCollection = collection(db, 'swipes');
      await addDoc(swipesCollection, {
        userId: currentUser.id,
        jobId: currentJob.id,
        action: action,
        timestamp: serverTimestamp(),
      });

      if (action === 'like') {
        // If liked, create an application in the 'applications' collection
        const applicationsCollection = collection(db, 'applications');
        await addDoc(applicationsCollection, {
          jobId: currentJob.id,
          jobTitle: currentJob.title,
          companyName: currentJob.company,
          employerId: currentJob.employerId,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          studentSkills: currentUser.skills || [],
          status: 'pending',
          applicationDate: serverTimestamp(),
          studentProfile: {
            bio: currentUser.bio || '',
            location: currentUser.location || '',
            phone: currentUser.phone || '',
            photoURL: currentUser.photoURL || undefined
          }
        });
        
        // Update application status for success feedback
        // setApplicationStatus(prev => ({
        //   ...prev,
        //   [currentJob.id]: 'success'
        // }));
        
        // Animate card to the right for like
        x.set(300);
      } else {
        // Animate card to the left for pass
        x.set(-300);
      }
      
      // Add to swiped jobs to prevent re-swipe
      swipedJobIdsRef.current.add(currentJob.id);
      
    } catch (err) {
      console.error("Error processing swipe: ", err);
      // setApplicationStatus(prev => ({
      //   ...prev,
      //   [currentJob.id]: 'error'
      // }));
      setError('Failed to process your application. Please try again.');
      // Reset position if there was an error
      x.set(0);
      return; // Don't proceed to next card on error
    } finally {
      setIsApplying(false);
    }

    // Animate card out and load the next one after a short delay
    setTimeout(() => {
      setCurrentJobIndex((prev) => prev + 1);
      }, 300);
      
    // Reset x position for the next card
    x.set(0);
  };

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(null);
    setSearchQuery('');
    fetchJobs(true);
  }, [fetchJobs]);

  // Handle save job
  const handleSaveJob = useCallback(() => {
    if (currentJob && !savedJobs.includes(currentJob.id)) {
      setSavedJobs(prev => [...prev, currentJob.id]);
    }
  }, [currentJob, savedJobs]);

  // Active filter count
  const getActiveFilterCount = () => {
    if (!filters) return 0;
    return (
      (filters.categories?.length || 0) +
      (filters.minPay ? 1 : 0) +
      (filters.maxPay && filters.maxPay < 50 ? 1 : 0) +
      (filters.urgentOnly ? 1 : 0) +
      (filters.remoteWork ? 1 : 0) +
      (filters.duration?.length || 0)
    );
  };
  
  const activeFilterCount = getActiveFilterCount();

  // Loading state
  if (loading && jobs.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding jobs that match your profile...</p>
      </div>
    );
  }

  // Error state
  if (error && jobs.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchJobs(true)}>Try Again</Button>
      </div>
    );
  }

  // Empty state
  if (jobs.length === 0 && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Briefcase className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">No jobs found</h3>
        <p className="text-muted-foreground max-w-md">
          {searchQuery || activeFilterCount > 0 
            ? 'Try adjusting your search or filters to find more jobs.'
            : 'There are no available jobs at the moment. Please check back later.'}
        </p>
        {(searchQuery || activeFilterCount > 0) && (
          <Button variant="outline" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  if (!currentJob) return null; // Should be covered by the 'No more jobs' screen

  return (
  <div className="h-full flex flex-col">
    {/* Header */}
    <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search jobs by title, company, or keywords"
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchJobs(true)}
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(true)}
            className="flex-shrink-0 flex items-center gap-2"
          >
            <FilterIcon className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Active Filters */}
          <AnimatePresence>
            {filters?.categories?.map(category => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                className="flex-shrink-0"
              >
                <Badge variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button 
                    onClick={() => {
                      const updatedFilters = { ...filters };
                      updatedFilters.categories = updatedFilters.categories.filter(c => c !== category);
                      setFilters(updatedFilters);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}

            {(filters?.minPay || filters?.maxPay) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                className="flex-shrink-0"
              >
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${filters?.minPay || '10'}-${filters?.maxPay || '50+'} /hr
                  <button 
                    onClick={() => {
                      let updatedFilters = { ...filters };
                      if ('minPay' in updatedFilters) {
                        const { minPay, ...rest } = updatedFilters;
                        updatedFilters = rest as FilterOptions;
                      }
                      if ('maxPay' in updatedFilters) {
                        const { maxPay, ...rest } = updatedFilters;
                        updatedFilters = rest as FilterOptions;
                      }
                      setFilters(updatedFilters);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            )}

            {filters?.urgentOnly && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                className="flex-shrink-0"
              >
                <Badge variant="secondary" className="flex items-center gap-1">
                  Urgent
                  <button 
                    onClick={() => {
                      const updatedFilters = { ...filters, urgentOnly: false };
                      setFilters(updatedFilters);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            )}

            {filters?.remoteWork && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                className="flex-shrink-0"
              >
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote
                  <button 
                    onClick={() => {
                      const updatedFilters = { ...filters, remoteWork: false };
                      setFilters(updatedFilters);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            )}

            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </div>
      </div>
    </div>

    {/* Card stack */}
    <div className="flex-1 flex items-center justify-center p-4 relative">
      {/* Next card (peek) */}
      {jobs[currentJobIndex + 1] && (
        <Card className="absolute w-80 h-96 bg-card border border-border scale-95 opacity-60 -z-10" />
      )}

      {/* Current card */}
      <motion.div
        ref={cardRef}
        className="w-80 h-96 relative cursor-grab active:cursor-grabbing"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.95 }}
      >
        <Card className="w-full h-full overflow-hidden relative bg-card">
          {/* Job image */}
          <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
            <div className="absolute inset-0 bg-black/20" />
            {currentJob.isUrgent && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                Urgent
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveJob}
              className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Bookmark className={`w-4 h-4 ${savedJobs.includes(currentJob.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Job details */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg mb-1">{currentJob.title}</h3>
              <p className="text-sm text-muted-foreground">{currentJob.company}</p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {currentJob.distance > 0 ? `${currentJob.distance}km` : 'Remote'}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                ${currentJob.hourlyRate}/hr
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {currentJob.duration}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{currentJob.category}</Badge>
              {currentJob.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {currentJob.skills.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{currentJob.skills.length - 2}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {currentJob.description}
            </p>

            <Button
              variant="outline"
              onClick={() => setShowJobDetails(true)}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Swipe indicators */}
      <motion.div
        className="absolute left-8 top-1/2 transform -translate-y-1/2 text-destructive"
        style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
      >
        <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4">
          <X className="w-8 h-8" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500"
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
      >
        <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
          <Heart className="w-8 h-8" />
        </div>
      </motion.div>
    </div>

    {/* Action buttons */}
    <div className="p-6 flex justify-center space-x-8">
      <Button
        variant="outline"
        size="lg"
        onClick={() => handleSwipe('pass')}
        className="w-16 h-16 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowJobDetails(true)}
        className="w-16 h-16 rounded-full"
      >
        <span className="text-lg">👁️</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => handleSwipe('like')}
        className="w-16 h-16 rounded-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      >
        <Heart className="w-6 h-6" />
      </Button>
    </div>

    {/* Modals */}
    {showJobDetails && currentJob && (
      <JobDetailsModal
        job={currentJob}
        onClose={() => setShowJobDetails(false)}
        onApply={() => {
          setShowJobDetails(false);
          handleSwipe('like');
        }}
      />
    )}

    {showFilters && (
      <FilterModal
        open={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setShowFilters(false);
          fetchJobs(true);
        }}
        initialFilters={filters || {
          radius: 10,
          minPay: 10,
          maxPay: 50,
          categories: [],
          urgentOnly: false,
          remoteWork: false,
          duration: []
        }}
      />
    )}
  </div>
  );
}