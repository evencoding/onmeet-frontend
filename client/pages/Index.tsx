import Layout from "@/components/Layout";
import IntroCard from "@/components/IntroCard";
import OngoingMeetings from "@/components/OngoingMeetings";

export default function Index() {
  return (
    <Layout>
      <div className="max-w-4xl space-y-6">
        {/* Intro Card */}
        <IntroCard />

        {/* Ongoing Meetings */}
        <OngoingMeetings />
      </div>
    </Layout>
  );
}
