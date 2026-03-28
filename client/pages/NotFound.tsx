import { useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { Home } from "lucide-react";

const NotFound = () => {
  useDocumentTitle("페이지를 찾을 수 없습니다 - OnMeet");
  const location = useLocation();

  useEffect(() => {
    Sentry.captureMessage(`404: ${location.pathname}`, "warning");
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-8xl font-bold om-gradient-text">404</div>
        <p className="text-xl text-muted-foreground">페이지를 찾을 수 없습니다</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
        >
          <Home className="w-4 h-4" />
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
};

export default NotFound;
