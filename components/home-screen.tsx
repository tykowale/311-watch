import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWatchStore } from '@/stores/use-watch-store';

export function HomeScreen() {
  const activeWatchers = useWatchStore((state) => state.activeWatchers);
  const openReports = useWatchStore((state) => state.openReports);
  const highlightedBorough = useWatchStore((state) => state.highlightedBorough);
  const addWatcher = useWatchStore((state) => state.addWatcher);
  const cycleBorough = useWatchStore((state) => state.cycleBorough);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 gap-6 px-6 py-8">
        <View className="gap-3 rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-6">
          <Text className="text-sm font-medium uppercase tracking-[3px] text-cyan-300">
            311 Watch
          </Text>
          <Text className="text-4xl font-bold text-white">Expo starter, city-ops edition.</Text>
          <Text className="text-base leading-6 text-slate-300">
            NativeWind is styling this screen, Zustand is powering the live counters, and the app is
            ready for Expo-based iteration.
          </Text>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 rounded-3xl bg-cyan-400 px-5 py-5">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-950">
              Active watchers
            </Text>
            <Text testID="watcher-count" className="mt-3 text-3xl font-bold text-slate-950">
              {activeWatchers}
            </Text>
          </View>

          <View className="flex-1 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-5">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-emerald-200">
              Open reports
            </Text>
            <Text className="mt-3 text-3xl font-bold text-white">{openReports}</Text>
          </View>
        </View>

        <View className="gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-5">
          <Text className="text-sm font-medium text-slate-400">Current focus</Text>
          <Text testID="borough-label" className="text-2xl font-semibold text-white">
            {highlightedBorough}
          </Text>
          <Text className="text-sm leading-6 text-slate-400">
            Start with a tight surface area: one clear route, one small store, and one shared styling
            system.
          </Text>
        </View>

        <View className="mt-auto gap-3">
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-2xl bg-cyan-400 px-4 py-4"
            onPress={addWatcher}>
            <Text className="text-base font-semibold text-slate-950">Add watcher</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4"
            onPress={cycleBorough}>
            <Text className="text-base font-semibold text-white">Rotate borough focus</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
