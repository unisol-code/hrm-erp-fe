import React from 'react';
import { MdClose } from 'react-icons/md';

const ImageZoomModal = ({ zoomImage, onClose }) => {
    if (!zoomImage) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh]">
                <img
                    src={zoomImage}
                    alt="Zoomed"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                    <MdClose className="w-6 h-6 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default ImageZoomModal;