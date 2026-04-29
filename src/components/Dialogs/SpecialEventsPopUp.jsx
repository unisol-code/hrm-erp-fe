import React from 'react';
import { X } from 'lucide-react';
import EventTemplate from '../../assets/images/birthdayTemplate.jpg';
import { useTheme } from '../../hooks/theme/useTheme';


const SpecialEventCard = ({ event }) => {
    const formattedDate = event?.eventDate
        ? new Intl.DateTimeFormat('en-GB').format(new Date(event?.eventDate))
        : 'NA';
    const { theme } = useTheme();
    return (
        <div className="bg-opacity-90 backdrop-blur rounded-lg p-4 shadow-lg flex items-center gap-4">
            <img
                src={event?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                alt="event"
                className="h-[50px] w-[50px] rounded-full object-cover border"
            />
            <div className="flex flex-col">
                <span className="font-semibold text-black text-lg">{event?.name}</span>
                <span className="text-md text-black">Celebration: {event?.eventCelebration}</span>
                <span className="text-md text-black">Date: {formattedDate}</span>
            </div>
        </div>
    );
};

const SpecialEventsPopUp = ({ specialDays, onClose }) => {
    const date = new Date();
    const todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-lg">
            <div className="relative w-[90vw] max-w-3xl h-[80vh] rounded-md overflow-hidden shadow-lg">
                {/* Full Background Image */}
                <img
                    src={EventTemplate}
                    alt="Event Background"
                    className="absolute inset-0 w-full h-full object-cover z-0 filter blur-sm"
                />

                {/* Overlay content */}
                <div className="relative z-10 flex flex-col w-full h-full py-5 px-6 overflow-y-auto rounded-md">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-800 hover:text-red-600 z-20"
                    >
                        <X size={24} />
                    </button>

                    {/* Titles */}
                    <h2 className="text-red-600 text-center font-bold text-xl mb-1">
                        Special Events
                    </h2>
                    <h3 className="text-red-600 text-center font-semibold text-lg my-4">
                        Today: {todayDate}
                    </h3>

                    <div className="space-y-6">
                        {/* Today's Special Events */}
                        <div>
                            <h4 className="text-red-600 text-center font-bold text-xl mb-1">
                                Today’s Events
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specialDays?.todaySpecialEvents?.length > 0 ? (
                                    specialDays.todaySpecialEvents.map((event) => (
                                        <SpecialEventCard key={event?.eventDate + event?.name} event={event} />
                                    ))
                                ) : (
                                    <p className="text-center text-black-500 font-semibold text-lg col-span-full py-2">
                                        No special events today.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Special Events */}
                        <div>
                            <h4 className="text-red-600 text-center font-bold text-xl mb-1">
                                Upcoming Events
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specialDays?.upcomingSpecialEvents?.length > 0 ? (
                                    specialDays.upcomingSpecialEvents.map((event) => (
                                        <SpecialEventCard key={event?.eventDate + event?.name} event={event} />
                                    ))
                                ) : (
                                    <p className="text-center text-black-500 font-semibold text-lg col-span-full py-2">
                                        No upcoming events.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialEventsPopUp;
