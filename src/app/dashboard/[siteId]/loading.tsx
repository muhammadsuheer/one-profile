import { Skeleton } from '@/components/ui/skeleton'

export default function SiteLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="mx-auto h-[540px] w-[340px] rounded-[42px]" />
      </div>
    </div>
  )
}
