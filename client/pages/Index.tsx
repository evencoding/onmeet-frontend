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
    <Layout>
      <div className="space-y-10">
        {/* Intro Card */}
        <IntroCard onCreateMeeting={handleCreateMeeting} />

        {/* Ongoing Meetings */}
        <div className="max-w-4xl">
          <OngoingMeetings />
        </div>

        {/* Recent Meetings */}
        <div className="max-w-4xl">
          <RecentMeetings />
        </div>
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal isOpen={isCreateModalOpen} onClose={handleCloseModal} />
    </Layout>
  );
}
