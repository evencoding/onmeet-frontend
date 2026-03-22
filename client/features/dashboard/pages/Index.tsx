import IntroCard from "@/features/dashboard/components/IntroCard";
import OngoingMeetings from "@/features/dashboard/components/OngoingMeetings";
import CreateMeetingModal from "@/features/dashboard/components/CreateMeetingModal";
import { useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function Index() {
  useDocumentTitle("오늘 회의 - OnMeet");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateMeeting = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="space-y-10">
        <IntroCard onCreateMeeting={handleCreateMeeting} />
        <OngoingMeetings />
      </div>

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
