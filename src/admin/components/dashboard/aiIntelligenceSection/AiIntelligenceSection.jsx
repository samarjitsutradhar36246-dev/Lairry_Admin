import { useNavigate } from "react-router-dom";
import AiHeader from "./AiHeader";
import ReadinessScoreCard from "./ReadinessScoreCard";
import ConfidenceDistributionCard from "./ConfidenceDistributionCard";
import AnomalyDetectionCard from "./AnomalyDetectionCard";
import ActiveUsersCard from "./ActiveUsersCard";
import TopTopicsCard from "./TopTopicsCard";
import SentimentFeedbackCard from "./SentimentFeedbackCard";
import ResponseTimeCard from "./ResponseTimeCard";
import NotificationsCard from "./NotificationsCard";

const AiIntelligenceSection = ({ mode = "full" }) => {
  const navigate = useNavigate();
  const isPreview = mode === "preview";

  // Choose a subset of cards for dashboard preview
  const previewCards = [
    <ReadinessScoreCard key="ReadinessScoreCard" />,
    <ActiveUsersCard key="ActiveUsersCard" />,
    <ConfidenceDistributionCard key="ConfidenceDistributionCard" />,
    <TopTopicsCard key="TopTopicsCard" />,
  ];

  return (
    <section
      className="space-y-6 max-w-7xl mx-auto"
      onClick={isPreview ? () => navigate("/admin/ai-model-intelligence") : undefined}
    >
      {/* Header in preview only */}
      {isPreview && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">AI Intelligence Overview</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/admin/ai-model-intelligence");
            }}
            className="text-cyan-400 text-sm"
          >
            View Full →
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {isPreview ? previewCards : (
          <>
            <ReadinessScoreCard />
            <ActiveUsersCard />
            <ConfidenceDistributionCard />
            <TopTopicsCard />
            <SentimentFeedbackCard />
            <ResponseTimeCard />
            <AnomalyDetectionCard />
            <NotificationsCard />
          </>
        )}
      </div>
    </section>
  );
};

export default AiIntelligenceSection;
