import type {
  OverviewInsight,
  OverviewKpi,
  OverviewSpendRecord,
  OverviewWidgetConfig,
} from "~/types/mock";

interface WidgetSeries {
  label: string;
  color: "brand" | "product" | "interaction" | "depth";
  values: number[];
}

interface WidgetTableColumn {
  key: string;
  label: string;
}

export type OverviewWidgetPayload =
  | {
      kind: "kpi";
      kpi: OverviewKpi;
    }
  | {
      kind: "chart";
      visualization: "bar" | "line" | "area" | "stacked_bar";
      labels: string[];
      series: WidgetSeries[];
    }
  | {
      kind: "donut";
      segments: Array<{ label: string; value: number; color: "brand" | "product" | "interaction" | "depth" }>;
    }
  | {
      kind: "table";
      columns: WidgetTableColumn[];
      rows: Array<Record<string, string>>;
    }
  | {
      kind: "insights";
      items: OverviewInsight[];
    }
  | {
      kind: "alerts";
      items: ReturnType<typeof useAppData>["alerts"]["value"];
    }
  | {
      kind: "connections";
      summary: NonNullable<ReturnType<typeof useAppData>["overview"]["value"]>["connectionsSummary"];
    };

function formatCompactCurrency(value: number) {
  return `$${value.toFixed(value >= 100 ? 0 : 1)}k`;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function groupSpendRecords(records: OverviewSpendRecord[], by: "channel" | "vendor") {
  const groups = new Map<string, Record<string, number>>();
  for (const record of records) {
    const key = record[by];
    if (!groups.has(key)) groups.set(key, {});
    const next = groups.get(key)!;
    next[record.category] = (next[record.category] ?? 0) + record.amount;
  }

  const categories = [...groups.keys()];
  const stackKeys = [...new Set(records.map((record) => record.category))];

  return {
    labels: categories,
    series: stackKeys.map((stackKey, index) => ({
      label: stackKey,
      color: (["brand", "product", "interaction", "depth"][index % 4] ?? "product") as WidgetSeries["color"],
      values: categories.map((category) => groups.get(category)?.[stackKey] ?? 0),
    })),
  };
}

export function useOverviewWidgetPayloads() {
  const { overview, alerts } = useAppData();

  function payloadFor(widget: OverviewWidgetConfig, rangeSize = 0): OverviewWidgetPayload | null {
    const snapshot = overview.value;
    if (!snapshot) return null;
    const trendPoints = rangeSize > 0 ? snapshot.trendPoints.slice(-rangeSize) : snapshot.trendPoints;
    const spendRecords = rangeSize > 0 ? snapshot.spendRecords.slice(-Math.min(snapshot.spendRecords.length, rangeSize)) : snapshot.spendRecords;

    if (widget.visualization === "kpi") {
      const kpi = snapshot.kpis.find((item) => item.id === widget.metric || item.label === widget.title);
      return kpi ? { kind: "kpi", kpi } : null;
    }

    if (widget.visualization === "insights") {
      return { kind: "insights", items: snapshot.insights };
    }

    if (widget.visualization === "alerts") {
      return { kind: "alerts", items: alerts.value.slice(0, 3) };
    }

    if (widget.visualization === "connections") {
      return { kind: "connections", summary: snapshot.connectionsSummary };
    }

    if (widget.visualization === "table") {
      if (widget.datasetKey === "spendRecords") {
        return {
          kind: "table",
          columns: [
            { key: "date", label: "Date" },
            { key: "channel", label: "Channel" },
            { key: "vendor", label: "Vendor" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount" },
          ],
          rows: spendRecords.map((record) => ({
            date: record.date,
            channel: record.channel,
            vendor: record.vendor,
            category: record.category,
            amount: formatCompactCurrency(record.amount),
          })),
        };
      }
    }

    if (widget.visualization === "donut") {
      const sourceRows =
        widget.datasetKey === "leadSourceSummaries"
          ? snapshot.leadSourceSummaries.map((row) => ({
              label: row.source,
              value:
                widget.metric === "deals"
                  ? row.deals
                  : widget.metric === "revenue"
                    ? row.revenue
                    : row.qualifiedLeads,
            }))
          : snapshot.platformSummaries.map((row) => ({
              label: row.platform,
              value:
                widget.metric === "spend"
                  ? row.spend
                  : widget.metric === "revenue"
                    ? row.revenue
                    : row.qualifiedLeads,
            }));

      return {
        kind: "donut",
        segments: sourceRows.map((row, index) => ({
          label: row.label,
          value: row.value,
          color: (["brand", "product", "interaction", "depth"][index % 4] ?? "product") as "brand" | "product" | "interaction" | "depth",
        })),
      };
    }

    if (widget.datasetKey === "trendPoints") {
      if (widget.visualization === "area" && widget.source === "summary") {
        return {
          kind: "chart",
          visualization: "area",
          labels: trendPoints.map((point) => point.date),
          series: [
            { label: "Spend", color: "depth", values: trendPoints.map((point) => point.spend) },
            { label: "Revenue", color: "product", values: trendPoints.map((point) => point.revenue) },
          ],
        };
      }

      const valueKey =
        widget.metric === "qualified_leads"
          ? "qualifiedLeads"
          : widget.metric === "pipeline_revenue"
            ? "pipelineRevenue"
            : widget.metric === "closed_revenue"
              ? "closedRevenue"
              : widget.metric === "deals"
                ? "deals"
                : widget.metric === "spend"
                  ? "spend"
                  : "revenue";

      return {
        kind: "chart",
        visualization: widget.visualization as "bar" | "line" | "area" | "stacked_bar",
        labels: trendPoints.map((point) => point.date),
        series: [
          {
            label: widget.title,
            color: widget.source === "crm_data" ? "brand" : widget.source === "spend_data" ? "depth" : "product",
            values: trendPoints.map((point) => Number(point[valueKey as keyof (typeof trendPoints)[number]] ?? 0)),
          },
        ],
      };
    }

    if (widget.datasetKey === "platformSummaries") {
      const valueKey =
        widget.metric === "spend"
          ? "spend"
          : widget.metric === "roi"
            ? "roi"
            : widget.metric === "qualified_leads"
              ? "qualifiedLeads"
              : widget.metric === "deals"
                ? "deals"
                : "revenue";

      return {
        kind: "chart",
        visualization: widget.visualization as "bar" | "line" | "area" | "stacked_bar",
        labels: snapshot.platformSummaries.map((row) => row.platform),
        series: [
          {
            label: widget.title,
            color: widget.metric === "roi" ? "interaction" : widget.metric === "spend" ? "depth" : "product",
            values: snapshot.platformSummaries.map((row) => Number(row[valueKey as keyof (typeof snapshot.platformSummaries)[number]] ?? 0)),
          },
        ],
      };
    }

    if (widget.datasetKey === "campaignClusters") {
      const valueKey = widget.metric === "spend" ? "spend" : widget.metric === "revenue" ? "revenue" : "roi";
      return {
        kind: "chart",
        visualization: "bar",
        labels: snapshot.campaignClusters.map((row) => row.cluster),
        series: [
          {
            label: widget.title,
            color: valueKey === "roi" ? "interaction" : valueKey === "spend" ? "depth" : "product",
            values: snapshot.campaignClusters.map((row) => Number(row[valueKey])),
          },
        ],
      };
    }

    if (widget.datasetKey === "spendRecords") {
      const grouped = groupSpendRecords(spendRecords, widget.dimension === "vendor" ? "vendor" : "channel");
      return {
        kind: "chart",
        visualization: widget.visualization as "bar" | "line" | "area" | "stacked_bar",
        labels: grouped.labels,
        series: widget.visualization === "stacked_bar"
          ? grouped.series
          : [
              {
                label: widget.title,
                color: "depth",
                values: grouped.labels.map((label, index) =>
                  grouped.series.reduce((sum, series) => sum + (series.values[index] ?? 0), 0),
                ),
              },
            ],
      };
    }

    if (widget.datasetKey === "funnel") {
      return {
        kind: "chart",
        visualization: "bar",
        labels: snapshot.funnel.map((stage) => stage.stage),
        series: [
          {
            label: "Funnel volume",
            color: "brand",
            values: snapshot.funnel.map((stage) => stage.value),
          },
        ],
      };
    }

    return null;
  }

  return {
    payloadFor,
    formatCompactCurrency,
    formatPercent,
  };
}
