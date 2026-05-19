import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardPage } from "@/pages/Dashboard";
import { PipelineConfigPage } from "@/pages/PipelineConfig";
import { ReviewInboxPage } from "@/pages/ReviewInbox";
import { ReviewDetailPage } from "@/pages/ReviewDetail";
import { LibraryPage } from "@/pages/Library";
import { AnalyticsPage } from "@/pages/Analytics";
import { SettingsPage } from "@/pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelineConfigPage />} />
        <Route path="/review" element={<ReviewInboxPage />} />
        <Route path="/review/:id" element={<ReviewDetailPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
