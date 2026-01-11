import { UserPlus, MoreVertical } from "lucide-react";

interface MeetingRoomHeaderProps {
  title: string;
  onInvite?: () => void;
}

export default function MeetingRoomHeader({ title, onInvite }: MeetingRoomHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-white/40 backdrop-blur-md">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onInvite}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Invite Participant
        </button>
        
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
