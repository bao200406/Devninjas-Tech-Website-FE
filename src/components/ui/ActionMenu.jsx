import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const ActionMenu = ({ items }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
        <MoreVertical className="w-5 h-5 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 shadow-lg">
        {items.map((item, index) => (
          <DropdownMenuItem 
            key={index} 
            onClick={item.onClick}
            className="cursor-pointer font-medium"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};