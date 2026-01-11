import Layout from "@/components/Layout";
import { Plus, MoreVertical, GripVertical, Check } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export default function TeamBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "해야 할 일",
      color: "bg-slate-100",
      tasks: [
        {
          id: "1",
          title: "디자인 시스템 구축",
          status: "todo",
          priority: "high",
          assignee: "김철수",
          dueDate: "2024-01-20",
        },
        {
          id: "2",
          title: "API 문서화",
          status: "todo",
          priority: "medium",
          assignee: "이영희",
          dueDate: "2024-01-25",
        },
      ],
    },
    {
      id: "in_progress",
      title: "진행 중",
      color: "bg-blue-100",
      tasks: [
        {
          id: "3",
          title: "로그인 기능 개발",
          status: "in_progress",
          priority: "high",
          assignee: "박민준",
          dueDate: "2024-01-18",
        },
        {
          id: "4",
          title: "성능 최적화",
          status: "in_progress",
          priority: "medium",
          assignee: "정호준",
          dueDate: "2024-01-22",
        },
      ],
    },
    {
      id: "done",
      title: "완료됨",
      color: "bg-green-100",
      tasks: [
        {
          id: "5",
          title: "프로젝트 세팅",
          status: "done",
          priority: "high",
          assignee: "김철수",
          dueDate: "2024-01-10",
        },
        {
          id: "6",
          title: "팀 미팅 스케줄 정하기",
          status: "done",
          priority: "low",
          assignee: "이영희",
          dueDate: "2024-01-12",
        },
      ],
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">팀 보드</h1>
            <p className="text-text-sub">팀의 작업을 관리하고 진행 상황을 추적하세요</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
            <Plus className="w-5 h-5" />
            새 카드
          </button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-2xl p-4 min-h-96 flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {column.title}
                </h2>
                <span className="px-2 py-1 bg-white/60 rounded-full text-xs font-semibold text-foreground">
                  {column.tasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-move"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2 flex-1">
                        <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-sm font-semibold text-foreground leading-tight flex-1">
                          {task.title}
                        </h3>
                      </div>
                      <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Task Metadata */}
                    <div className="space-y-2">
                      {/* Priority */}
                      {task.priority && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      )}

                      {/* Assignee and Due Date */}
                      <div className="flex items-center justify-between text-xs text-text-sub">
                        {task.assignee && (
                          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">
                            {task.assignee}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Task Button */}
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors group/add">
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">카드 추가</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
