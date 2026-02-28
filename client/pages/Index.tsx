import Layout from "@/components/Layout";
import IntroCard from "@/components/IntroCard";
import OngoingMeetings from "@/components/OngoingMeetings";
import RecentMeetings from "@/components/RecentMeetings";
import CreateMeetingModal from "@/components/CreateMeetingModal";
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
    <Layout showRecentPanel={false}>
      <div className="space-y-10 max-w-4xl">
        {/* Intro Card */}
        <IntroCard onCreateMeeting={handleCreateMeeting} />

        {/* Ongoing Meetings */}
        <OngoingMeetings />
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
}
