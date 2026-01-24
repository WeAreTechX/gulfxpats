import { Ban, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

export default function Status({ status, id } : { status?: Status, id: number }) {
  const ids: { [key: number]: string } = {
    1: 'active',
    2: 'inactive',
    3: 'disabled',
    4: 'enabled',
    5: 'pending',
    6: 'deleted',
    7: 'published',
    8: 'unpublished',
    9: 'removed',
    10: 'verified',
    11: 'unverified'
  }

  status = { name: ids[id], code: ids[id] }

  if (!status) {
    return <span>-</span>
  }

  const getStatusGroup = () => {
    if (['active'].includes(status.name)) {
      return 'green'
    } else if (['inactive', 'removed'].includes(status.name)) {
      return 'red'
    } else if (['pending', 'incomplete'].includes(status.name)) {
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

