'use client'

import MainHeader from "@/components/main-header"
import LoadingSpinner from "@/components/ui/loading-spinner";
import UserProfile from "@/components/user-profile"
import { useUserProfile } from "@/hooks/useUser"

export default function ProfilePage() {
  const { userProfile, isLoading, isError } = useUserProfile();
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading user profile</div>;
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <UserProfile userProfile={userProfile}/>
      </div>
    </div>
  )
}