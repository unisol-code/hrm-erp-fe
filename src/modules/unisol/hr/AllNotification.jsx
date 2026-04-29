import { useEffect, useState, useMemo, useCallback } from "react";
import ActionRequired from "../../../components/Dialogs/ActionRequired";
import useDashboard from "../../../hooks/unisol/hrDashboard/useDashborad";
import Pagination from "../../../components/Pagination";
import { useParams } from "react-router-dom";
import {
  Bell,
  BellOff,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  AlertCircle,
  Mail,
  Users,
  X
} from "lucide-react";

export const AllNotification = () => {
  const { fetchUserAllNotification, allNotification, markNotification } = useDashboard();
  const { id } = useParams();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadInitialNotifications = async () => {
      setIsLoading(true);
      await fetchUserAllNotification(id, 1, limit);
      setIsLoading(false);
    };
    loadInitialNotifications();
  }, [markNotification, selectedType, searchTerm, unreadOnly]);

  useEffect(() => {
    if (allNotification?.data?.notifications) {
      if (page === 1) {
        setNotifications(allNotification.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...allNotification.data.notifications]);
      }
      setHasMore(allNotification.data.pagination?.hasNextPage || false);
    }
  }, [allNotification]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isBottom = scrollHeight - scrollTop <= clientHeight + 100;

    if (isBottom && !isLoading && hasMore) {
      loadMoreNotifications();
    }
  }, [isLoading, hasMore]);

  const loadMoreNotifications = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUserAllNotification(id, nextPage, limit);
    setIsLoading(false);
  };

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    return notifications.filter(notification => {
      const matchesSearch = searchTerm === "" ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "" || notification.type === selectedType;
      const matchesReadStatus = !unreadOnly || !notification.isRead;

      return matchesSearch && matchesType && matchesReadStatus;
    });
  }, [notifications, searchTerm, selectedType, unreadOnly]);

  const unreadCount = useMemo(() => {
    return notifications?.filter(n => !n.isRead).length || 0;
  }, [notifications]);

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
    setNotifications([]);
    fetchUserAllNotification(id, 1, data);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "payroll":
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case "leaveRequest":
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case "onboarding":
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Mail className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setUnreadOnly(false);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full gap-6 rounded-xl bg-gray-50">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread • {notifications?.length || 0} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedType && (
                <div className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType("")}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {unreadOnly && (
                <div className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full">
                  Unread only
                  <button onClick={() => setUnreadOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {(selectedType || unreadOnly || searchTerm) && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[140px]"
          >
            <option value="">All Types</option>
            <option value="reminder">Reminders</option>
            <option value="payroll">Payroll</option>
            <option value="leaveRequest">Leave Requests</option>
            <option value="onboarding">Onboarding</option>
          </select>

          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${unreadOnly
              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            <BellOff className="w-4 h-4" />
            <span className="hidden sm:inline">Unread</span>
          </button>

          <select
            value={limit}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      <div
        className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm"
        onScroll={handleScroll}
        style={{ overflowY: 'auto' }}
      >
        {filteredNotifications.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="p-4 mb-4 bg-gray-100 rounded-full">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType || unreadOnly
                ? "Try adjusting your filters"
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-indigo-50/30" : ""
                    }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-white border border-gray-200 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 mx-auto mt-2 bg-indigo-500 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {notification.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mb-3 text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Company ID: {notification.companyId?.slice(-6) || 'N/A'}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {!notification.isRead && (
                            <button className="text-sm text-indigo-600 hover:text-indigo-800">
                              Mark as read
                            </button>
                          )}
                          <ActionRequired notification={notification} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-center p-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">Loading more notifications...</p>
                </div>
              </div>
            )}

            {!hasMore && filteredNotifications.length > 0 && (
              <div className="p-4 text-center text-gray-500 border-t border-gray-200">
                <p>You've reached the end of notifications</p>
              </div>
            )}

            {filteredNotifications.length > 0 && !hasMore && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={allNotification?.data?.pagination?.currentPage || 1}
                  totalPages={allNotification?.data?.pagination?.totalPages || 1}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    setNotifications([]);
                    fetchUserAllNotification(id, newPage, limit);
                  }}
                  onItemsPerPageChange={onItemsPerPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};