import { createHashRouter } from 'react-router';
import { RootLayout } from '@/app/RootLayout';
import HomePage from '@/pages/HomePage';
import WindowsTraining from '@/pages/WindowsTraining';
import NotFoundPage from '@/pages/NotFoundPage';
import ProgressPageRoute from '@/pages/ProgressPage';
import { TrainingSession } from '@/features/training/components/TrainingSession';
import { TOOLS } from '@/features/training/tools';

// Una ruta por tool, derivada del registro. Las visuales (Windows) usan su
// página propia; el resto, el shell genérico de TrainingSession.
const toolRoutes = TOOLS.map((tool) => ({
  path: tool.path.slice(1),
  element: tool.visual ? (
    <WindowsTraining />
  ) : (
    <TrainingSession tool={tool.key} description={tool.description} />
  ),
}));

export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      ...toolRoutes,
      { path: 'progress', Component: ProgressPageRoute },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
