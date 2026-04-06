<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

const props = defineProps<{
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  rowKey: string;
  emptyLabel?: string;
}>();

const emit = defineEmits<{
  "row-click": [row: Record<string, unknown>];
}>();

function cell(row: Record<string, unknown>, key: string) {
  return row[key];
}
</script>

<template>
  <div class="data-table-wrap overflow-hidden rounded-[1.5rem] border border-black/8 bg-white">
    <div class="overflow-x-auto">
      <table class="data-table min-w-full text-left text-[15px]">
        <thead>
          <tr class="data-table-head-row">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="data-table-th px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-black/52"
              :class="col.headerClass"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td :colspan="columns.length" class="data-table-empty px-6 py-14 text-center text-[15px] text-black/52">
              {{ emptyLabel ?? "No rows yet." }}
            </td>
          </tr>
          <tr
            v-for="(row, idx) in rows"
            :key="String(row[rowKey] ?? idx)"
            class="data-table-row cursor-pointer transition-colors hover:bg-black/[0.02]"
            @click="emit('row-click', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="data-table-td border-t border-black/6 px-6 py-4 text-black/86"
              :class="col.class"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="cell(row, col.key)">
                {{ cell(row, col.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
