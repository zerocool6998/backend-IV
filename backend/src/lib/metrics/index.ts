type MetricTags = Record<string, string>;

type CounterValue = {
  value: number;
  tags: MetricTags;
};

type HistogramValue = {
  value: number;
  tags: MetricTags;
};

const counters = new Map<string, CounterValue>();
const histograms = new Map<string, HistogramValue[]>();

function buildKey(name: string, tags: MetricTags): string {
  const normalizedTags = Object.entries(tags)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  return normalizedTags.length === 0 ? name : `${name}|${normalizedTags}`;
}

export function incrementMetric(name: string, tags: MetricTags = {}): void {
  const key = buildKey(name, tags);
  const current = counters.get(key);

  counters.set(key, {
    value: (current?.value ?? 0) + 1,
    tags
  });
}

export function observeMetric(name: string, value: number, tags: MetricTags = {}): void {
  const key = buildKey(name, tags);
  const existing = histograms.get(key) ?? [];

  existing.push({ value, tags });
  histograms.set(key, existing);
}

export function getMetricsSnapshot(): {
  counters: Array<{ key: string; value: number; tags: MetricTags }>;
  histograms: Array<{ key: string; values: number[]; tags: MetricTags }>;
} {
  return {
    counters: [...counters.entries()].map(([key, entry]) => ({
      key,
      value: entry.value,
      tags: entry.tags
    })),
    histograms: [...histograms.entries()].map(([key, entries]) => ({
      key,
      values: entries.map((entry) => entry.value),
      tags: entries[0]?.tags ?? {}
    }))
  };
}
