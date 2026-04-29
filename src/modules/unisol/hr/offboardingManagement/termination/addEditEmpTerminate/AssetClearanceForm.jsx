import React from 'react';
import { FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import { MdPhotoCamera, MdZoomOutMap } from 'react-icons/md';

const AssetClearanceForm = ({ theme, welcomeKits, onImageZoom }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <h3 className="text-xl font-bold text-gray-800">3. Asset Clearance</h3>
            </div>

            <div className="mb-4">
                <p className="text-gray-600 mb-2">Assigned Welcome Kits ({welcomeKits.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {welcomeKits.map((kit, index) => (
                        <div key={kit._id || index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-medium text-gray-900">{kit.name}</h4>
                                    {kit.description && (
                                        <p className="text-sm text-gray-600 mt-1">{kit.description}</p>
                                    )}
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    kit.isAcknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {kit.isAcknowledged ? 'Acknowledged' : 'Pending'}
                                </span>
                            </div>

                            {kit.photos && kit.photos.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Photos: {kit.photos.length}</p>
                                    <div className="flex gap-2 overflow-x-auto">
                                        {kit.photos.map((photo, photoIndex) => (
                                            <div key={photoIndex} className="relative">
                                                <img
                                                    src={photo}
                                                    alt={`${kit.name} ${photoIndex + 1}`}
                                                    className="w-20 h-20 rounded object-cover cursor-pointer hover:opacity-90"
                                                    onClick={() => onImageZoom(photo)}
                                                />
                                                <button
                                                    onClick={() => onImageZoom(photo)}
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                                                >
                                                    <MdZoomOutMap className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Asset Clearance Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <FaExclamationTriangle className="mr-2" />
                    Pending
                </span>
            </div>
        </div>
    );
};

export default AssetClearanceForm;