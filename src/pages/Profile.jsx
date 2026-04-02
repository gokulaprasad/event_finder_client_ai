import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Ticket,
  Edit2,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import {
  getProfile,
  updateProfile,
  getSavedEvents,
  getRegisteredEvents,
  getUserStats,
} from '../redux/slices/userSlice';
import EventCard from '../components/EventCard';
import { EventListSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const INTEREST_OPTIONS = [
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

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, savedEvents, registeredEvents, stats, isLoading } = useSelector(
    (state) => state.user
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    location: '',
    interests: [],
  });

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getSavedEvents());
    dispatch(getRegisteredEvents());
    dispatch(getUserStats());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || '',
        location: profile.location || '',
        interests: profile.interests || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(editData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const toggleInterest = (interest) => {
    setEditData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'registered', label: 'My Tickets', icon: Ticket },
    { id: 'saved', label: 'Saved Events', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Your name"
                  />
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Your location"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{profile?.email}</span>
                    </div>
                    {profile?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile?.interests?.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Edit Button */}
            <div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-lg"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Interests Edit */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Your Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      editData.interests.includes(interest)
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {!isEditing && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.upcomingEvents}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upcoming Events
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.registeredEventsCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Registered
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.savedEventsCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saved Events
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.interestsCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interests
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You've registered for {stats?.registeredEventsCount || 0} events and saved{' '}
                    {stats?.savedEventsCount || 0} events.
                  </p>
                </div>
                {registeredEvents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Upcoming Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registeredEvents.slice(0, 2).map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'registered' && (
              <div>
                {isLoading ? (
                  <EventListSkeleton count={3} />
                ) : registeredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No registered events
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't registered for any events yet.
                    </p>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-lg hover:bg-gradient-hover"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                {isLoading ? (
                  <EventListSkeleton count={3} />
                ) : savedEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No saved events
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't saved any events yet.
                    </p>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-lg hover:bg-gradient-hover"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
