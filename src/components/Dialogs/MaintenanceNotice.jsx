import React from 'react'
import { IoMdClose } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";

const MaintenanceNotice = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="h-screen w-screen  flex justify-center items-center">
                <div className="w-[764.34px] max-h-[574px] overflow-auto scrollbar-hide bg-[#E1FDF9] rounded-2xl shadow-lg">
                    <div className='w-full h-[93.85px] flex items-center justify-between ' style={{ background: 'linear-gradient(105.4deg, #E0D2C7 -0.05%, #44B09E 100.05%)' }}>
                        <h1 className='text-xl font-medium px-16'>
                            System Maintenance Notice
                        </h1>

                        {/*Download and Close Button */}
                        <div className="flex items-end px-6 space-x-4 cursor-pointer">
                            <button >
                                <IoMdClose size={28} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center px-6 py-16">
                        {/* Reminder Message */}
                        <div className="w-[700px] text-left p-6 ">
                            <p className="text-lg">
                                <span className="font-semibold">Reminder:</span> The system will undergo maintenance on Saturday, August 26th, from 12:00 AM to 4:00 AM. During this time, some features may be temporarily unavailable. Please save your work and log out before the scheduled maintenance. Thank you for your understanding!
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center mt-8 space-x-8 w-[700px] py-6">
                            <button className="px-6 py-2 text-xl font-normal text-[#005C4A] bg-[#68B8A7] opacity-[65] border border-[#005C4A] rounded-lg">
                                Acknowledge
                            </button>
                            <button className="px-6 py-2 text-xl font-normal text-[#6D7F00] bg-[#E5EDB5] border border-[#6D7F00] rounded-lg">
                                Remind Me Later
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MaintenanceNotice