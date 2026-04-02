import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { getTrendingEvents } from '../redux/slices/eventSlice';
import EventCard from '../components/EventCard';
import { EventListSkeleton } from '../components/Skeleton';

const Landing = () => {
  const dispatch = useDispatch();
  const { trendingEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getTrendingEvents());
  }, [dispatch]);

  const features = [
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'Find events tailored to your interests with our AI-powered recommendation system.',
    },
    {
      icon: Users,
      title: 'Connect with Community',
      description: 'Meet like-minded people and build your network at events you love.',
    },
    {
      icon: Zap,
      title: 'Real-time Chat',
      description: 'Chat with attendees before, during, and after events.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is safe with enterprise-grade security.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Events That{' '}
              <span className="gradient-text">Inspire You</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find and join amazing events near you. From tech conferences to music festivals,
              connect with your community and make memories.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-medium hover:bg-gradient-hover transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Find Events</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>1000+ Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50k+ Attendees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-green-500" />
                Trending Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Most popular events happening now
              </p>
            </div>
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <EventListSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingEvents.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} showActions={false} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose EventSphere?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We make event discovery and management simple, secure, and social.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Discover Amazing Events?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of event enthusiasts and start exploring events tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EventSphere</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 EventSphere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
