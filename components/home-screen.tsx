import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Complaint } from '@/lib/chicago311/types';

import { useAddressComplaints, type AddressComplaintsState } from '@/features/complaints/use-address-complaints';

function formatComplaintDate(createdAt: string) {
  return new Date(createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatLoadedCount(totalCount: number | null, loadedCount: number) {
  if (totalCount === null) {
    return String(loadedCount);
  }

  if (totalCount <= loadedCount) {
    return String(totalCount);
  }

  return `${loadedCount}/${totalCount}`;
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <View className="gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-5">
      <View className="flex-row items-start justify-between gap-4">
        <Text className="flex-1 text-lg font-semibold text-white">{complaint.type}</Text>
        <Text className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[2px] text-cyan-200">
          {complaint.status}
        </Text>
      </View>

      <Text className="text-sm leading-6 text-slate-300">
        {complaint.address ?? 'Address unavailable'}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {complaint.communityArea ? (
          <Text className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Community area {complaint.communityArea}
          </Text>
        ) : null}
        {complaint.ward ? (
          <Text className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Ward {complaint.ward}
          </Text>
        ) : null}
      </View>

      <Text className="text-xs uppercase tracking-[2px] text-slate-500">
        Filed {formatComplaintDate(complaint.createdAt)}
      </Text>
    </View>
  );
}

function HomeScreenBody({ state }: { state: AddressComplaintsState }) {
  if (state.status === 'error') {
    return (
      <View className="gap-4 rounded-[28px] border border-rose-500/30 bg-rose-500/10 px-6 py-6">
        <Text className="text-2xl font-semibold text-white">Chicago 311 did not load.</Text>
        <Text className="text-base leading-6 text-slate-300">
          {state.errorMessage ?? 'The public dataset is reachable anonymously, but this request failed.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          className="items-center rounded-2xl bg-white px-4 py-4"
          onPress={state.search}>
          <Text className="text-base font-semibold text-slate-950">Search again</Text>
        </Pressable>
      </View>
    );
  }

  if (state.status === 'loading') {
    return (
      <View className="gap-4 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
        <Text className="text-2xl font-semibold text-white">Loading nearby complaints...</Text>
        <Text className="text-base leading-6 text-slate-300">
          Geocoding your address, then fetching the last 7 days of public Chicago 311 reports within
          half a mile.
        </Text>
      </View>
    );
  }

  if (state.status === 'empty') {
    return (
      <View className="gap-4 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
        <Text className="text-2xl font-semibold text-white">Nothing nearby in the last 7 days.</Text>
        <Text className="text-base leading-6 text-slate-300">
          That may mean a quiet pocket, sparse geocoding nearby, or a simulator location outside the
          city dataset.
        </Text>
        <Pressable
          accessibilityRole="button"
          className="items-center rounded-2xl bg-cyan-400 px-4 py-4"
          onPress={state.search}>
          <Text className="text-base font-semibold text-slate-950">Try another search</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {state.complaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </View>
  );
}

export function HomeScreen() {
  const state = useAddressComplaints();

  return <HomeScreenContent state={state} />;
}

export function HomeScreenContent({ state }: { state: AddressComplaintsState }) {
  const subtitle = state.coordinates
    ? `Around ${state.coordinates.latitude.toFixed(3)}, ${state.coordinates.longitude.toFixed(3)}`
    : 'Search by a Chicago address';

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-6 py-8">
        <View className="gap-3 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
          <Text className="text-sm font-medium uppercase tracking-[3px] text-cyan-300">
            311 Watch
          </Text>
          <Text className="text-4xl font-bold text-white">What are neighbors complaining about?</Text>
          <Text className="text-base leading-6 text-slate-300">
            Anonymous public data, one minimal flow: enter a Chicago address, pull recent nearby
            complaints, and see the signal before building anything heavier.
          </Text>
          <Text className="text-sm font-medium text-slate-500">{subtitle}</Text>
        </View>

        <View className="gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-5">
          <Text className="text-sm font-medium text-slate-400">Chicago address</Text>
          <TextInput
            value={state.query}
            onChangeText={state.setQuery}
            placeholder="1 E State St"
            placeholderTextColor="#64748b"
            autoCapitalize="words"
            autoCorrect={false}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-base text-white"
          />
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-2xl bg-cyan-400 px-4 py-4"
            onPress={state.search}>
            <Text className="text-base font-semibold text-slate-950">Search this address</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 rounded-3xl bg-cyan-400 px-5 py-5">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-950">
              Showing
            </Text>
            <Text testID="complaint-count" className="mt-3 text-3xl font-bold text-slate-950">
              {formatLoadedCount(state.totalCount, state.complaints.length)}
            </Text>
            <Text className="mt-2 text-xs font-medium text-slate-900/80">First page of nearby matches</Text>
          </View>

          <View className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-5 py-5">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
              Time window
            </Text>
            <Text className="mt-3 text-3xl font-bold text-white">7d</Text>
          </View>
        </View>

        <View className="gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-5">
          <Text className="text-sm font-medium text-slate-400">Default policy</Text>
          <Text className="text-2xl font-semibold text-white">Keep it tiny and useful.</Text>
          <Text className="text-sm leading-6 text-slate-400">
            This feed is address-centered to half a mile, spans 7 days, excludes duplicates, and
            filters out `311 INFORMATION ONLY CALL` so the first dogfood pass stays readable.
          </Text>
        </View>

        <HomeScreenBody state={state} />
      </ScrollView>
    </SafeAreaView>
  );
}
