import { UserPlus, MoreVertical } from "lucide-react";

interface MeetingRoomHeaderProps {
  title: string;
  onInvite?: () => void;
  onToggleParticipants?: () => void;
  isGuest?: boolean;
}

export default function MeetingRoomHeader({
  title,
  onInvite,
  onToggleParticipants,
  isGuest = false,
}: MeetingRoomHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-purple-900/20 backdrop-blur-md">
      <h1 className="text-lg font-bold text-white/90">{title}</h1>

      <div className="flex items-center gap-3">
        {!isGuest && (
          <button
            onClick={onInvite}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md shadow-purple-500/30"
          >
            <UserPlus className="w-4 h-4" />
            Invite Participant
          </button>
        )}

        <button
          onClick={onToggleParticipants}
          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-white/70 hover:text-white/90"
          title="토글 패널"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
