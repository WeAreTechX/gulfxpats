import { Ban, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

export default function Status(status: Status) {
  if (!status) {
    return <span>-</span>
  }

  const getStatusGroup = () => {
    if (['active', 'published', 'verified', 'enabled'].includes(status.code)) {
      return 'green'
    } else if (['inactive', 'disabled', 'deleted'].includes(status.code)) {
      return 'red'
    } else if (['pending', 'unverified'].includes(status.code)) {
      return 'yellow'
    } else {
      return 'gray'
    }
  }
  const getStatusColor = () => {
    switch (getStatusGroup()) {
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (getStatusGroup()) {
      case "green":
        return CheckCircle;
      case "red":
        return Ban;
      case "yellow":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <span key="status"
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit",
        getStatusColor()
      )}
    >
      <StatusIcon className="w-4 h-4 hidden" />
      {status.name === 'Incomplete' ? 'Pending' : status.name}
    </span>
  );
}

