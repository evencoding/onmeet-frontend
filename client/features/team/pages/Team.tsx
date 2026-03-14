import { useParams } from "react-router-dom";
import TeamDetail from "@/features/team/components/TeamDetail";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

const teamNames: Record<string, string> = {
  marketing: "Marketing",
  product: "Product",
  design: "Design",
};

export default function Team() {
  useDocumentTitle("팀 - OnMeet");
  const { teamId } = useParams<{ teamId: string }>();

  if (!teamId || !teamNames[teamId]) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          팀을 찾을 수 없습니다
        </h1>
        <p className="text-text-sub">존재하지 않는 팀입니다.</p>
      </div>
    );
  }

  return <TeamDetail teamId={teamId} teamName={teamNames[teamId]} />;
}
