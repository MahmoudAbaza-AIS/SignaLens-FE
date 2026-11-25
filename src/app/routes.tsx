import { Route, Routes } from 'react-router-dom'
import { LoginPage, RequireAuth } from '@/modules/auth'
import { UsersSettingsPage } from '@/modules/users'
import { OverviewPage } from '@/modules/overview/pages/OverviewPage'
import { DashboardsPage } from '@/modules/dashboards/pages/DashboardsPage'
import { AiChatPage } from '@/modules/ai-chat/pages/AiChatPage'
import { AssetsTagsPage } from '@/modules/assets/pages/AssetsTagsPage'
import { EtlHealthPage } from '@/modules/etl/pages/EtlHealthPage'
import { AppShell } from '@/shared/components/layout/AppShell'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="dashboards" element={<DashboardsPage />} />
          <Route path="ai-chat" element={<AiChatPage />} />
          <Route path="assets-tags" element={<AssetsTagsPage />} />
          <Route path="etl-health" element={<EtlHealthPage />} />
          <Route path="users-settings" element={<UsersSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
