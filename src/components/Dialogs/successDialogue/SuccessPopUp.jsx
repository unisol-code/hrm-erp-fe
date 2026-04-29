import React from 'react'
import ABSTRACT from '../../../assets/images/background-abstract.png'
import { toastState } from '../../../state/toastState';

const SuccessPopUp = () => {
    const [toast] = useRecoilState(toastState);

    const onClose = () => {
        // Reset toast state (this will hide the popup)
        setToast({
            message: '',
            type: ''
        });
    };

    if (!toast.message) return null; // Don't render if no message exists

    return (
        <div className="fixed w-full inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className=" rounded-xl w-[641px] h-[419px] p-10 relative" style={{ backgroundImage: `url(${ABSTRACT})` }}>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-8 text-black hover text-3xl">
                    &times;
                </button>
                {/* Icon */}
                <div className="flex flex-col items-center">
                    {/* Title */}
                    <h1 className="text-2xl mt-2 h-7 w-[355px] font-medium mb-4">
                        {toast.type === 'success' ? 'Success!' : toast.type === 'error' ? 'Error!' : 'Notification'}
                    </h1>
                    <div className="text-6xl mb-6">
                        {toast.type === 'success' && '✔️'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'warning' && '⚠️'}
                        {toast.type === 'info' && 'ℹ️'}
                    </div>
                    <p className="mb-6 text-xl">{toast.message}</p>
                    {/* Buttons */}
                    <button onClick={onClose} className="bg-[#709EB1] hover text-white py-3 px-6 rounded-xl">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessPopUp