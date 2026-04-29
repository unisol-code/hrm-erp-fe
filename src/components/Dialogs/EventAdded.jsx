import React from 'react'
import ABSTRACT from '../../assets/images/background-abstract.png'

const EventAdded = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className=" rounded-xl w-[641px] h-[419px] p-10 relative" style={{ backgroundImage: `url(${ABSTRACT})` }}>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-8 text-black hover text-3xl">
                    &times;
                </button>

                {/* Icon */}
                <div className="flex flex-col py-10 justify-center items-center">

                    {/* Title */}
                    <h1 className="text-2xl mt-2 h-7 w-[355px] font-medium mb-4">
                        Event Added Successfully
                    </h1>

                    <div className="text-6xl mb-6">✔️</div>

                    {/* Message */}
                    <p className="text-center text-black text-[22px] font-light mb-8">
                        The event have been successfully added
                    </p>


                    {/* Buttons */}
                    <button onClick={onClose} className="bg-[#709EB1] hover text-white py-3 px-6 rounded-xl">
                        OK
                    </button>

                </div>
            </div>
        </div>
    )
}

export default EventAdded