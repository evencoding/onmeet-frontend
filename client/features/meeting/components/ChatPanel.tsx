import { memo, useCallback, useRef } from "react";
import { Send, X, FileText } from "lucide-react";
import { useRoomContext } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import { toast } from "@/shared/hooks/use-toast";

export default memo(function ChatPanel() {
  const room = useRoomContext();
  const encoder = useRef(new TextEncoder());
  const isComposingRef = useRef(false);

  const { showChat, chatMessages, chatInput, noteText, showNoteInput } =
    useMeetingRoomStore(
      useShallow((s) => ({
        showChat: s.showChat,
        chatMessages: s.chatMessages,
        chatInput: s.chatInput,
        noteText: s.noteText,
        showNoteInput: s.showNoteInput,
      })),
    );

  const handleSendMessage = useCallback(async () => {
    const { chatInput, addChatMessage, setChatInput } =
      useMeetingRoomStore.getState();
    if (!chatInput.trim()) return;

    const message = chatInput;
    setChatInput("");

    try {
      const data = JSON.stringify({ type: "chat", message });
      await room.localParticipant.publishData(encoder.current.encode(data), {
        reliable: true,
      });
    } catch (err) {
      console.warn("Failed to send chat message:", err);
      toast({ title: "메시지 전송 실패", description: "메시지를 전송하지 못했습니다", variant: "destructive" });
    }

    addChatMessage({
      id: Date.now().toString(),
      sender: "You",
      message,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, [room]);

  const handleAddNote = useCallback(() => {
    const { noteText, addChatMessage, setNoteText, setShowNoteInput } =
      useMeetingRoomStore.getState();
    if (noteText.trim()) {
      addChatMessage({
        id: Date.now().toString(),
        sender: "You",
        message: `📝 ${noteText}`,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      setNoteText("");
      setShowNoteInput(false);
    }
  }, []);

  if (!showChat) return null;

  return (
    <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
      <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
        <h3 className="font-semibold">채팅</h3>
        <button
          onClick={() => useMeetingRoomStore.getState().toggleChat()}
          aria-label="채팅 닫기"
          className="p-1 hover:bg-purple-500/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {msg.sender[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="text-xs text-white/50">{msg.timestamp}</p>
              </div>
              <p className="text-sm text-white/90 bg-purple-500/20 rounded-lg p-2 mt-1">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showNoteInput && (
        <div className="px-4 py-3 border-t border-purple-500/20 bg-purple-500/10 space-y-2">
          <p className="text-xs text-white/60 font-semibold">노트 추가</p>
          <textarea
            value={noteText}
            onChange={(e) => useMeetingRoomStore.getState().setNoteText(e.target.value)}
            placeholder="노트를 입력하세요..."
            className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none h-20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddNote}
              className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => {
                const s = useMeetingRoomStore.getState();
                s.setShowNoteInput(false);
                s.setNoteText("");
              }}
              className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-sm transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4 border-t border-purple-500/20 flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => useMeetingRoomStore.getState().setChatInput(e.target.value)}
          onCompositionStart={() => { isComposingRef.current = true; }}
          onCompositionEnd={() => { isComposingRef.current = false; }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (isComposingRef.current || e.nativeEvent.isComposing || e.keyCode === 229) return;
            e.preventDefault();
            handleSendMessage();
          }}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          title="메시지 전송"
          aria-label="메시지 전송"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const s = useMeetingRoomStore.getState();
            s.setShowNoteInput(!s.showNoteInput);
          }}
          className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg transition-colors"
          title="노트 추가"
          aria-label="노트 추가"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
