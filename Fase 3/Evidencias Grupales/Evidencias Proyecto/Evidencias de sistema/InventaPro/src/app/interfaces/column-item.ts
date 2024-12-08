import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface ColumnItem<ItemData> {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<ItemData> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<ItemData> | null;
  width: string;
  isDateFilter?: boolean;
  hasBeenDateFiltered?: boolean;
}