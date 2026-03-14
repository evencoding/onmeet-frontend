import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import AuthLayout from "@/shared/components/AuthLayout";
import { useInviteMember } from "@/features/auth/hooks";

interface InvitedEmail {
  id: string;
  email: string;
}

export default function InviteMembers() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = (location.state as { companyId: string })?.companyId;
  const inviteMemberMutation = useInviteMember();

  const [emails, setEmails] = useState<InvitedEmail[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addEmail = () => {
    setError("");
    if (!currentEmail) {
      setError("이메일을 입력해주세요");
      return;
    }
    if (!currentEmail.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (emails.some((e) => e.email === currentEmail)) {
      setError("이미 추가된 이메일입니다");
      return;
    }

    setEmails([...emails, { id: Date.now().toString(), email: currentEmail }]);
    setCurrentEmail("");
  };

  const removeEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  const copyInviteLink = (email: string) => {
    const inviteLink = `${window.location.origin}/signup?company=${companyId ?? ""}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedId(email);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendInvites = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (emails.length === 0) {
        throw new Error("최소 1명 이상의 사원을 초대해야 합니다");
      }

      await Promise.all(
        emails.map((e) =>
          inviteMemberMutation.mutateAsync({ email: e.email, role: "USER" }),
        ),
      );
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "초대 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <AuthLayout
      subtitle="사원 초대"
      colorTheme="purple"
      maxWidth="max-w-2xl"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white">팀 멤버 초대</h2>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <p className="text-white/60 mb-6">
          팀에 참여할 사원들의 이메일을 입력해주세요
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm text-red-300 font-medium">{error}</p>
        </motion.div>
      )}

      <motion.div
        className="mb-6 space-y-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-400" />
          이메일 주소
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addEmail();
              }
            }}
            placeholder="employee@company.com"
            className="flex-1 px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
          />
          <button
            onClick={addEmail}
            className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold rounded-xl transition-colors flex items-center gap-2 border border-purple-500/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">추가</span>
          </button>
        </div>
      </motion.div>

      {emails.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-sm font-semibold text-white/90 mb-3">
            초대된 사원들 ({emails.length}명)
          </h3>
          <div className="space-y-2">
            {emails.map((emailObj) => (
              <div
                key={emailObj.id}
                className="flex items-center justify-between p-3 bg-white/5 border border-purple-500/20 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">
                    {emailObj.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyInviteLink(emailObj.email)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    title="초대 링크 복사"
                  >
                    {copiedId === emailObj.email ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeEmail(emailObj.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-400"
                    title="제거"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-purple-200 leading-relaxed">
          <strong>초대 방법:</strong> 각 사원의 이메일을 추가한 후 "링크
          복사"를 눌러 초대 링크를 복사하고 공유하세요. 사원들은 초대 링크를
          통해 회원가입 할 수 있습니다.
        </p>
      </motion.div>

      <div className="flex gap-3">
        <motion.button
          onClick={handleSkip}
          className="flex-1 px-6 py-3 border border-purple-500/30 bg-white/5 text-white text-sm font-semibold rounded-xl hover:bg-white/10 hover:border-purple-500/60 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          나중에 하기
        </motion.button>
        <motion.button
          onClick={handleSendInvites}
          disabled={isLoading || emails.length === 0}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {isLoading ? "처리 중..." : "완료"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </AuthLayout>
  );
}
