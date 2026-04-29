import React, { useState, useEffect, useRef } from "react";
import useWelcomeKit from "../../../../hooks/unisol/onboarding/useWelcomekit";

export default function WelcomeKitDetailsTab({ formik }) {  // Add formik prop
  const [selectedItems, setSelectedItems] = useState([]);
  const [welcomeKitData, setWelcomeKitData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  
  const { welcomekKitDropdownOptions } = useWelcomeKit();

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const options = await welcomekKitDropdownOptions();
        
        let dataArray = [];
        
        if (Array.isArray(options)) {
          dataArray = options;
        } else if (options?.data && Array.isArray(options.data)) {
          dataArray = options.data;
        }
        
        setWelcomeKitData(dataArray);
      } catch (error) {
        console.error("Error fetching welcome kit options:", error);
        setWelcomeKitData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update formik whenever selectedItems changes
 // Update the useEffect that syncs with formik
// Update formik whenever selectedItems changes
useEffect(() => {
  // Create array of objects with welcomeKitId and name
  const welcomeKitArray = selectedItems.map((itemId) => {
    const item = welcomeKitData.find(
      (kit) => (kit.welcomeKitId || kit._id) === itemId
    );
    return {
      welcomeKitId: itemId,
      name: item?.name || ""
    };
  });
  
  formik.setFieldValue("welcomeKit", welcomeKitArray);
}, [selectedItems, welcomeKitData]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const getSelectedNames = () => {
    if (selectedItems.length === 0) return "";
    return selectedItems
      .map((id) => {
        const item = welcomeKitData.find(
          (kit) => (kit.welcomeKitId || kit._id) === id
        );
        return item?.name || "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const filteredData = welcomeKitData.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Dropdown Section */}
      <div className="grid grid-cols-3 items-start gap-y-2">
        {/* Label */}
        <div className="w-full col-span-1 pl-8 pt-8">
          <label className="font-medium text-gray-700">Welcome Kit Item:</label>
        </div>

        {/* Custom Multi-Select Dropdown */}
        <div className="col-span-2 p-8">
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              disabled={isLoading}
              className="w-full min-h-[42px] px-3 py-2 text-left bg-white border-2 border-gray-400 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <span className={selectedItems.length === 0 ? "text-gray-400" : "text-gray-900"}>
                {isLoading
                  ? "Loading welcome kits..."
                  : selectedItems.length === 0
                  ? "Select service feature..."
                  : getSelectedNames()}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Options List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredData.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      {isLoading ? "Loading..." : "No welcome kits available"}
                    </div>
                  ) : (
                    filteredData.map((item) => {
                      const itemId = item.welcomeKitId || item._id;
                      const isSelected = selectedItems.includes(itemId);

                      return (
                        <label
                          key={itemId}
                          className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(itemId)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-900">
                            {item.name || "Unnamed Kit"}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedItems.map((itemId) => {
            const item = welcomeKitData.find(
              (kit) => (kit.welcomeKitId || kit._id) === itemId
            );
            
            if (!item) return null;
            
            return (
              <div
                key={itemId}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => {
                    setSelectedItems(prev => prev.filter(id => id !== itemId));
                  }}
                  className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                  title="Remove item"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Image */}
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.name || "Welcome Kit Item"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {item.name || "Unnamed Kit"}
                  </h3>
                  {item.welcomeKitId && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {item.welcomeKitId}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State - Show when no items selected */}
        {!isLoading && selectedItems.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select items from the dropdown above to display them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}