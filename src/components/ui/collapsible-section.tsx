import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, defaultOpen = true, count, children }: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 press focus-ring rounded"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">{title}</h2>
          {count != null && (
            <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`transition-all duration-200 overflow-hidden ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
