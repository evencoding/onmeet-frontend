import IntroCard from "@/features/dashboard/components/IntroCard";
import OngoingMeetings from "@/features/dashboard/components/OngoingMeetings";
import MeetingBookingModal from "@/features/schedule/components/MeetingBookingModal";
import { useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function Index() {
  useDocumentTitle("오늘 회의 - OnMeet");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-10">
        <IntroCard onCreateMeeting={() => setIsCreateModalOpen(true)} />
        <OngoingMeetings />
      </div>

      {isCreateModalOpen && (
        <MeetingBookingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
}
