import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { getEventById, registerForEvent, saveEvent, clearCurrentEvent } from '../redux/slices/eventSlice';
import { DetailSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent, isLoading } = useSelector((state) => state.events);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEventById(id));
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    try {
      await dispatch(registerForEvent(id)).unwrap();
      toast.success(
        currentEvent.isRegistered
          ? 'Unregistered from event'
          : 'Successfully registered!'
      );
    } catch (error) {
      toast.error(error || 'Failed to register');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save events');
      navigate('/login');
      return;
    }

    try {
      await dispatch(saveEvent(id)).unwrap();
      toast.success(currentEvent.isSaved ? 'Event removed from saved' : 'Event saved');
    } catch (error) {
      toast.error(error || 'Failed to save event');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentEvent?.title,
        text: currentEvent?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  const isFull = currentEvent.attendees?.length >= currentEvent.capacity;
  const availableSpots = currentEvent.capacity - (currentEvent.attendees?.length || 0);
  const isOrganizer = user?._id === currentEvent.organizer?._id;
  const canJoinChat = currentEvent.isRegistered || isOrganizer;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Hero Image */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
          <img
            src={currentEvent.image || 'https://via.placeholder.com/800x400?text=Event'}
            alt={currentEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full mb-3">
              {currentEvent.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {currentEvent.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organizer */}
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentEvent.organizer?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {currentEvent.organizer?.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                About this event
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {currentEvent.description}
              </p>
            </div>

            {/* Attendees */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Attendees ({currentEvent.attendees?.length || 0})
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentEvent.attendees?.slice(0, 10).map((attendee, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
                    title={attendee.user?.name}
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {attendee.user?.name?.charAt(0)}
                    </span>
                  </div>
                ))}
                {currentEvent.attendees?.length > 10 && (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      +{currentEvent.attendees.length - 10}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Event Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Date</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {format(new Date(currentEvent.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Time</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {format(new Date(currentEvent.date), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentEvent.location?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Capacity</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentEvent.attendees?.length || 0} / {currentEvent.capacity} registered
                      {availableSpots <= 5 && availableSpots > 0 && (
                        <span className="block text-orange-500 text-sm mt-1">
                          Only {availableSpots} spots left!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleRegister}
                  disabled={isFull && !currentEvent.isRegistered}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    currentEvent.isRegistered
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : isFull
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-primary text-white hover:bg-gradient-hover'
                  }`}
                >
                  {currentEvent.isRegistered
                    ? 'Unregister'
                    : isFull
                    ? 'Event Full'
                    : 'Register Now'}
                </button>

                {canJoinChat && (
                  <Link
                    to={`/chat/${currentEvent._id}`}
                    className="w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Join Chat</span>
                  </Link>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                      currentEvent.isSaved
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${currentEvent.isSaved ? 'fill-current' : ''}`}
                    />
                    <span>{currentEvent.isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Price Card */}
            {currentEvent.price > 0 && (
              <div className="bg-gradient-primary rounded-xl p-6 text-white">
                <p className="text-white/80 text-sm mb-1">Ticket Price</p>
                <p className="text-3xl font-bold">${currentEvent.price}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
