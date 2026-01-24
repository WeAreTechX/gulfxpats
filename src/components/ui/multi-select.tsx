import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  id?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  label,
  error,
  isLoading = false,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionId: number) => {
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const handleRemove = (e: React.MouseEvent, optionId: number) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== optionId));
  };

  const selectedOptions = options.filter((option) => value.includes(option.id));
  const displayText =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length === 1
      ? selectedOptions[0].name
      : `${selectedOptions.length} selected`;

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className={cn(
              "w-full flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-[#00A558]/50 focus-visible:border-[#00A558] disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]",
              error
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                : "border-gray-300"
            )}
          >
            <span className={cn("flex-1 text-left", value.length === 0 && "text-gray-500")}>
              {displayText}
            </span>
            <ChevronDownIcon className="size-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : options.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No options available</div>
            ) : (
              <div className="p-1">
                {options.map((option) => {
                  const isSelected = value.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100",
                        isSelected && "bg-gray-50"
                      )}
                      onClick={() => handleToggle(option.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.id)}
                        className="rounded border-gray-300 text-[#00A558] focus:ring-[#00A558]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="flex-1">{option.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#00A558]/10 text-[#00A558] rounded-md"
            >
              {option.name}
              <button
                type="button"
                onClick={(e) => handleRemove(e, option.id)}
                className="hover:bg-[#00A558]/20 rounded-full p-0.5"
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}






