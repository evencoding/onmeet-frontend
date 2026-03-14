import IntroCard from "@/features/dashboard/components/IntroCard";
import OngoingMeetings from "@/features/dashboard/components/OngoingMeetings";
import RecentMeetings from "@/features/dashboard/components/RecentMeetings";
import CreateMeetingModal from "@/features/dashboard/components/CreateMeetingModal";
import { useState } from "react";

export default function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateMeeting = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="space-y-10 max-w-4xl">
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
