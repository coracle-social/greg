import { Component, createResource, Show } from 'solid-js'
import { useAppState } from '../AppState'
import { loadProfile } from '@welshman/app'
import type { PublishedProfile } from '@welshman/app'
import { INDEXER_RELAYS } from '../config/welshman'

const ProfileInfo: Component = () => {
  const [state] = useAppState()

  // Create resource to load profile data
  const [profile] = createResource(
    () => state.currentUserPubkey,
    async (pubkey: string) => {
      try {
        return await loadProfile(pubkey, { relays: INDEXER_RELAYS })
      } catch (err) {
        console.error('Failed to load profile:', err)
        throw err
      }
    }
  )

  return (
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <Show 
        when={true} 
        fallback={
          <div class="text-red-500">Failed to load profile. Please try again later.</div>
        }
      >
        <Show when={profile()} fallback={<div>Loading profile...</div>}>
          <div class="flex items-center gap-4">
            {/* Profile Picture */}
            <div class="w-16 h-16 rounded-full overflow-hidden">
              <Show when={profile()?.picture} fallback={
                <div class="w-full h-full bg-gray-200 dark:bg-gray-700" />
              }>
                <img 
                  src={profile()?.picture} 
                  alt={profile()?.name || 'Profile picture'}
                  class="w-full h-full object-cover"
                />
              </Show>
            </div>

            {/* Profile Info */}
            <div>
              <h2 class="text-xl font-bold">
                {profile()?.name || 'Anonymous'}
              </h2>
              <Show when={profile()?.nip05}>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {profile()?.nip05}
                </p>
              </Show>
              <Show when={profile()?.about}>
                <p class="mt-2 text-gray-700 dark:text-gray-300">
                  {profile()?.about}
                </p>
              </Show>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ProfileInfo 