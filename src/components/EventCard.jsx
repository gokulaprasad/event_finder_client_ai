import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { saveEvent, registerForEvent } from '../redux/slices/eventSlice';
import toast from 'react-hot-toast';

const EventCard = ({ event, showActions = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save events');
      return;
    }

    try {
      await dispatch(saveEvent(event._id)).unwrap();
      toast.success(event.isSaved ? 'Event removed from saved' : 'Event saved');
    } catch (error) {
      toast.error(error || 'Failed to save event');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    try {
      await dispatch(registerForEvent(event._id)).unwrap();
      toast.success(
        event.isRegistered ? 'Unregistered from event' : 'Successfully registered!'
      );
    } catch (error) {
      toast.error(error || 'Failed to register');
    }
  };

  const isFull = event.attendees?.length >= event.capacity;
  const availableSpots = event.capacity - (event.attendees?.length || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-hover border border-gray-200 dark:border-gray-700">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || 'https://via.placeholder.com/400x200?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.trendingScore > 10 && (
          <div className="absolute top-3 left-3 bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </div>
        )}
        {showActions && (
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                event.isSaved
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
          {event.category}
        </span>

        {/* Title */}
        <Link to={`/events/${event._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Date & Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.date), 'MMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location?.address}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>
              {event.attendees?.length || 0} / {event.capacity}
            </span>
            {availableSpots <= 5 && availableSpots > 0 && (
              <span className="ml-2 text-orange-500 text-xs">
                {availableSpots} spots left
              </span>
            )}
            {isFull && (
              <span className="ml-2 text-red-500 text-xs">Full</span>
            )}
          </div>

          {showActions && (
            <button
              onClick={handleRegister}
              disabled={isFull && !event.isRegistered}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                event.isRegistered
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : isFull
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-primary text-white hover:bg-gradient-hover'
              }`}
            >
              {event.isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
