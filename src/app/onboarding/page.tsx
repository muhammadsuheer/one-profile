import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { env } from '@/env'
import { suggestSlug } from '@/lib/onboarding'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export const metadata = { title: 'Get started' }

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <OnboardingWizard
      userName={user.name ?? 'Your name'}
      suggestedSlug={suggestSlug(user.name ?? '')}
      appHost={new URL(env.NEXT_PUBLIC_APP_URL).host}
    />
  )
}
