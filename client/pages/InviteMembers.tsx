import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Plus, Trash2, Copy, Check, ArrowRight } from "lucide-react";

interface InvitedEmail {
  id: string;
  email: string;
}

export default function InviteMembers() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = (location.state as { companyId: string })?.companyId;

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
    const inviteLink = `${window.location.origin}/signup?token=demo-token-${email}`;
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

      // TODO: API call to send invites
      // const response = await sendInvites({
      //   companyId,
      //   emails: emails.map(e => e.email),
      // });

      console.log(
        "Invites sent:",
        emails.map((e) => e.email),
      );
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "초대 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white mb-4">
            <span className="text-xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ONMEET</h1>
          <p className="text-text-sub">사원 초대</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-brand-500 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            팀 멤버 초대
          </h2>
          <p className="text-text-sub mb-6">
            팀에 참여할 사원들의 이메일을 입력해주세요
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Email Input Section */}
          <div className="mb-6 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-500" />
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
                    className="flex-1 px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
                  />
                  <button
                    onClick={addEmail}
                    className="px-4 py-3 bg-brand-100 hover:bg-brand-200 text-brand-600 font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">추가</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Invited Emails List */}
          {emails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                초대된 사원들 ({emails.length}명)
              </h3>
              <div className="space-y-2">
                {emails.map((emailObj) => (
                  <div
                    key={emailObj.id}
                    className="flex items-center justify-between p-4 bg-white/60 border border-border/20 rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {emailObj.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyInviteLink(emailObj.email)}
                        className="p-2 hover:bg-surface-subtle rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="초대 링크 복사"
                      >
                        {copiedId === emailObj.email ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeEmail(emailObj.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                        title="제거"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-xl">
            <p className="text-sm text-brand-900 leading-relaxed">
              💡 <strong>초대 방법:</strong> 각 사원의 이메일을 추가한 후 "링크
              복사"를 눌러 초대 링크를 복사하고 공유하세요. 사원들은 초대 링크를
              통해 회원가입 할 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border border-border/60 bg-white/70 text-foreground text-sm font-semibold rounded-xl hover:bg-white hover:border-border hover:shadow-md transition-all duration-200"
            >
              나중에 하기
            </button>
            <button
              onClick={handleSendInvites}
              disabled={isLoading || emails.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "처리 중..." : "완료"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Demo Note */}
        <p className="mt-6 text-center text-xs text-text-sub">
          💡 이 페이지에서는 사원들을 초대할 수 있습니다. 초대 링크를 복사하여
          공유하세요.
        </p>
      </div>
    </div>
  );
}
