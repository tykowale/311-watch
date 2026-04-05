import type { Complaint } from '@/lib/chicago311/types';

export type ComplaintTypeSummary = {
  type: string;
  count: number;
};

export function summarizeComplaintTypes(
  complaints: Complaint[],
  options?: { limit?: number }
): ComplaintTypeSummary[] {
  const counts = new Map<string, number>();

  for (const complaint of complaints) {
    counts.set(complaint.type, (counts.get(complaint.type) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.type.localeCompare(right.type);
    })
    .slice(0, options?.limit ?? 5);
}

export function filterComplaintsByType(complaints: Complaint[], selectedType: string | null) {
  if (!selectedType) {
    return complaints;
  }

  return complaints.filter((complaint) => complaint.type === selectedType);
}
