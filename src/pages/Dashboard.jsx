import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { getEvents, setFilters } from '../redux/slices/eventSlice';
import { getRecommendations } from '../redux/slices/userSlice';
import EventCard from '../components/EventCard';
import { EventListSkeleton } from '../components/Skeleton';

const CATEGORIES = [
  'All',
  'Technology',
  'Business',
  'Music',
  'Sports',
  'Arts',
  'Food',
  'Health',
  'Education',
  'Entertainment',
  'Networking',
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { events, isLoading, pagination, filters } = useSelector(
    (state) => state.events
  );
  const { recommendations } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events on mount and when filters change
  useEffect(() => {
    dispatch(getEvents({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  // Fetch recommendations for logged in users
  useEffect(() => {
    if (user) {
      dispatch(getRecommendations());
    }
  }, [dispatch, user]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchQuery }));
    dispatch(getEvents({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category: category === 'All' ? '' : category }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      dispatch(getEvents({ page: newPage, limit: pagination.limit, ...filters }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find your next unforgettable experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:bg-gradient-hover transition-all"
            >
              Search
            </button>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (filters.category === '' && category === 'All') ||
                  filters.category === category
                    ? 'bg-gradient-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        {user && recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recommended For You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            All Events
          </h2>

          {isLoading ? (
            <EventListSkeleton count={6} />
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
