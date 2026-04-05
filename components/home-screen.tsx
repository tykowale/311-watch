import { ActivityIndicator, Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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

function formatCompactDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
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

function SearchSummary({ state }: { state: AddressComplaintsState }) {
  if (state.status !== 'ready' || state.complaints.length === 0 || state.isSearching) {
    return null;
  }

  return (
    <View className="flex-row gap-4">
      <View className="flex-1 rounded-3xl bg-cyan-400 px-5 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-950">Showing</Text>
        <Text testID="complaint-count" className="mt-3 text-3xl font-bold text-slate-950">
          {formatLoadedCount(state.totalCount, state.complaints.length)}
        </Text>
        <Text className="mt-2 text-xs font-medium text-slate-900/80">First page of nearby matches</Text>
      </View>

      <View className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-5 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">Search window</Text>
        <Text className="mt-3 text-3xl font-bold text-white">7d</Text>
        <Text className="mt-2 text-xs font-medium text-slate-500">Half-mile radius</Text>
      </View>
    </View>
  );
}

function ComplaintTypeChips({ state }: { state: AddressComplaintsState }) {
  if (state.status !== 'ready' || state.complaintTypeSummary.length === 0 || state.isSearching) {
    return null;
  }

  return (
    <View className="gap-3 rounded-[28px] border border-slate-800 bg-slate-900 px-5 py-5">
      <Text className="text-sm font-medium text-slate-400">Top complaint types nearby</Text>
      <View className="flex-row flex-wrap gap-3">
        <Pressable
          accessibilityRole="button"
          className={state.selectedComplaintType === null
            ? 'rounded-full bg-cyan-400 px-4 py-2'
            : 'rounded-full border border-slate-700 bg-slate-950 px-4 py-2'}
          onPress={() => state.selectComplaintType(null)}>
          <Text className={state.selectedComplaintType === null ? 'text-sm font-semibold text-slate-950' : 'text-sm font-semibold text-white'}>
            All
          </Text>
        </Pressable>

        {state.complaintTypeSummary.map((item) => {
          const isSelected = state.selectedComplaintType === item.type;

          return (
            <Pressable
              key={item.type}
              accessibilityRole="button"
              className={isSelected
                ? 'rounded-full bg-cyan-400 px-4 py-2'
                : 'rounded-full border border-slate-700 bg-slate-950 px-4 py-2'}
              onPress={() => state.selectComplaintType(item.type)}>
              <Text className={isSelected ? 'text-sm font-semibold text-slate-950' : 'text-sm font-semibold text-white'}>
                {item.type} ({item.count})
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
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

function CompactComplaintRow({ complaint }: { complaint: Complaint }) {
  return (
    <View className="flex-row items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4">
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-white">{complaint.address ?? 'Address unavailable'}</Text>
        <Text className="text-sm text-slate-400">Filed {formatCompactDate(complaint.createdAt)}</Text>
      </View>
      <Text className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[2px] text-cyan-200">
        {complaint.status}
      </Text>
    </View>
  );
}

function HomeScreenBody({ state }: { state: AddressComplaintsState }) {
  if (state.status === 'idle') {
    return (
      <View className="gap-3 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
        <Text className="text-xl font-semibold text-white">Start with one Chicago address.</Text>
        <Text className="text-base leading-6 text-slate-300">
          Enter a street address above to see the first page of complaints filed within half a mile in
          the last 7 days.
        </Text>
      </View>
    );
  }

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
        <Text className="text-sm font-medium text-cyan-300">Search in progress. This can take a moment.</Text>
      </View>
    );
  }

  if (state.status === 'empty') {
    return (
      <View className="gap-4 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
        <Text className="text-2xl font-semibold text-white">Nothing nearby in the last 7 days.</Text>
        <Text className="text-base leading-6 text-slate-300">
          Try a busier nearby intersection or another neighborhood to quickly compare what residents
          are reporting.
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

  if (state.selectedComplaintType) {
    return (
      <View className="gap-4">
        <View className="gap-2 rounded-[28px] border border-slate-800 bg-slate-900 px-5 py-5">
          <Text className="text-xl font-semibold text-white">{state.selectedComplaintType} addresses</Text>
          <Text className="text-sm leading-6 text-slate-400">
            Focused view for where this issue is showing up in the current result set.
          </Text>
        </View>

        {state.visibleComplaints.map((complaint) => (
          <CompactComplaintRow key={complaint.id} complaint={complaint} />
        ))}
      </View>
    );
  }

  return (
    <View className="gap-4">
      {state.visibleComplaints.map((complaint) => (
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
  const hasResults = state.status === 'ready' && state.complaints.length > 0;
  const searchButtonLabel = state.isSearching ? 'Searching…' : 'Search this address';

  function submitSearch() {
    Keyboard.dismiss();
    state.search();
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-6 py-8"
        keyboardShouldPersistTaps="handled">
        <View className="gap-3 rounded-[28px] bg-slate-950 px-1 py-2">
          <Text className="text-sm font-medium uppercase tracking-[3px] text-cyan-300">
            311 Watch
          </Text>
          <Text className="text-4xl font-bold text-white">What are neighbors complaining about?</Text>
          <Text className="text-base leading-6 text-slate-300">
            Enter one Chicago address to see recent nearby 311 complaints without accounts, maps, or
            extra setup.
          </Text>
          <Text className="text-sm font-medium text-slate-500">{subtitle}</Text>
        </View>

        <View className="gap-4 rounded-[28px] border border-slate-800 bg-slate-900 px-5 py-5">
          <View className="gap-1">
            <Text className="text-sm font-medium text-slate-400">Chicago address</Text>
            <Text className="text-base text-white">Search complaints around an address you know.</Text>
          </View>
          <TextInput
            value={state.query}
            onChangeText={state.setQuery}
            placeholder="1 E State St"
            placeholderTextColor="#64748b"
            autoCapitalize="words"
            autoCorrect={false}
            editable={!state.isSearching}
            className={state.isSearching
              ? 'rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-4 text-base text-white'
              : 'rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-base text-white'}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: state.isSearching }}
            className={state.isSearching ? 'flex-row items-center justify-center gap-3 rounded-2xl bg-cyan-400/70 px-4 py-4' : 'flex-row items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-4 py-4'}
            disabled={state.isSearching}
            onPress={submitSearch}>
            {state.isSearching ? (
              <ActivityIndicator accessibilityLabel="Searching indicator" color="#020617" />
            ) : null}
            <Text className="text-base font-semibold text-slate-950">{searchButtonLabel}</Text>
          </Pressable>
          {!hasResults ? (
            <Text className="text-sm leading-6 text-slate-500">
              {state.isSearching
                ? 'Pulling public Chicago 311 data now so you know the search is working.'
                : 'Uses public Chicago 311 data from the last 7 days within half a mile of the address.'}
            </Text>
          ) : null}
        </View>

        <SearchSummary state={state} />
        <ComplaintTypeChips state={state} />

        <HomeScreenBody state={state} />
      </ScrollView>
    </SafeAreaView>
  );
}
