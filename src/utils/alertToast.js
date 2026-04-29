import Swal from "sweetalert2";

export const confirmAlert = (message) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });
};

// Confirm before setting inactive
export const confirmInactive = (message) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message || "This will make the item inactive!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, make inactive",
    cancelButtonText: "Cancel",
  });
};