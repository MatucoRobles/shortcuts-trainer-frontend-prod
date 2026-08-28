import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { router } from '@/app/router.tsx'
import { RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
