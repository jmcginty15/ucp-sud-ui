import React, { useRef, useState, useEffect, useCallback } from "react";
import { type LinksFunction } from "@remix-run/node";
import { Link as RLink } from "@remix-run/react";
import get from "lodash.get";
import { IconArrowUpward } from "~/icons/IconArrowUpward";
import { IconArrowDownward } from "~/icons/IconArrowDownward";
import cloneDeep from "lodash.clonedeep";
import { IconSort } from "~/icons/IconSort";
import { useSearchParams } from "@remix-run/react";
import type * as Polymorphic from "@reach/utils/polymorphic";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import { Checkbox } from "@cl-privacy/components/checkbox";
import stylesCheckbox from "@cl-privacy/components/checkbox/styles.css";
import styles from "./Table.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesCheckbox },
    { rel: "stylesheet", href: stylesButton },
    { rel: "stylesheet", href: styles }
  ];
};

export type TableProps<RD> = {
  columns: TColumn<RD>[];
  data: RD[];
  selection?: { onSelectionChange?: (rowData: RD[]) => void };
};

export type TColumn<RD> = {
  heading: string;
  // Get cell data from rowData using string path.
  // Supports dot notation for deep access.
  dataPath?: string;
  // More flexible way to get cell data from rowData.
  getData?: (rowData: RD) => any;
  // Override cell rendering.
  render?: (rowData: RD) => React.ReactNode;
  getTableCell?: (rowData: RD) => any;
  ordering?: { key: string };
  resizing?: {};
  editing?: {};
  // ellipsis?: boolean;
  // Emphasize the cell.
  emphasis?: boolean;
  align?: "start" | "end" | "center";
  // colSpan?: number;
  width?: string;
};

export function Table<RD>(props: TableProps<RD>) {
  const { columns, data, selection } = props;

  if (
    columns.some(
      (column) =>
        column.dataPath == null &&
        column.getData == null &&
        column.render == null
    )
  ) {
    throw new Error("`dataPath` or `getData` or `render` must be supplied.");
  }

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const [tableHeight, setTableHeight] = useState<string | number>("auto");
  const [activeResizingIndex, setActiveResizingIndex] = useState<number | null>(
    null
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const [selectionSelectedIndices, setSelectionSelectedIndices] =
    React.useState<Set<number>>(new Set());

  const emptyCellText = "--";
  const selectionCellWidth = "40px";
  const minCellWidth = 70;
  const defaultCellWidth = "150px";
  // The field to order by.
  const searchParamKeyOrderBy = "ob";
  // The order direction. `asc` | `desc`
  const searchParamKeyOrderDirection = "od";

  const thRefs = getThRefs(columns.length);

  useEffect(() => {
    if (tableRef?.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, []);

  function handleMouseDown(index: number | null) {
    setActiveResizingIndex(index);
  }

  const mouseMove = useCallback(
    (e) => {
      if (!tableRef.current) {
        return;
      }

      let gridTemplateColumns: string[] = selection ? [selectionCellWidth] : [];

      for (let i = 0; i < thRefs.length; i++) {
        const colRef = thRefs[i];

        if (!colRef.current) {
          continue;
        }

        if (i === activeResizingIndex) {
          const width = e.clientX - colRef.current.offsetLeft;
          if (width >= minCellWidth) {
            gridTemplateColumns.push(`${width}px`);
          } else {
            gridTemplateColumns.push(`${colRef.current.offsetWidth}px`);
          }
        } else {
          gridTemplateColumns.push(`${colRef.current.offsetWidth}px`);
        }
      }

      tableRef.current.style.gridTemplateColumns = `${gridTemplateColumns.join(
        " "
      )}`;
    },
    [activeResizingIndex, thRefs, minCellWidth, selection]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveResizingIndex(null);
    removeListeners();
  }, [setActiveResizingIndex, removeListeners]);

  useEffect(() => {
    if (activeResizingIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }
    return () => {
      removeListeners();
    };
  }, [activeResizingIndex, mouseMove, mouseUp, removeListeners]);

  return (
    <div data-cl-table-wrapper="">
      <table
        ref={tableRef}
        data-cl-table=""
        style={{
          gridTemplateColumns: `${
            selection ? `${selectionCellWidth} ` : ""
          }${columns
            .map((column) => {
              return `minmax(${column.width ?? defaultCellWidth}, 1fr)`;
            })
            .join(" ")}`
        }}>
        <thead>
          <tr>
            {selection ? (
              <th>
                <div data-cl-table-selection-container="">
                  <Checkbox
                    checked={
                      selectionSelectedIndices.size === data.length &&
                      data.length > 0
                    }
                    onChange={(event) => {
                      if (typeof selection.onSelectionChange === "function") {
                        const checked = event.currentTarget.checked;
                        setSelectionSelectedIndices(() => {
                          const next = new Set<number>();
                          if (checked) {
                            for (let i = 0; i < data.length; i++) {
                              next.add(i);
                            }
                          }
                          return next;
                        });
                        selection.onSelectionChange(checked ? data : []);
                      }
                    }}
                  />
                </div>
              </th>
            ) : null}
            {columns.map((column, columnIndex) => {
              return (
                <th ref={thRefs[columnIndex]} key={columnIndex}>
                  <TableCell align={column.align}>
                    {column.heading}
                    {column.ordering ? (
                      // || column.filtering
                      <div data-cl-table-th-actions="">
                        {column.ordering ? (
                          <OrderingButton
                            fieldId={column.ordering.key}
                            searchParamKeyOrderBy={searchParamKeyOrderBy}
                            searchParamKeyOrderDirection={
                              searchParamKeyOrderDirection
                            }
                          />
                        ) : null}
                        {/* {column.filtering ? (
                          <Menu>
                            <MenuButton
                              as={Button}
                              variant={
                                searchParams.has(column.filtering.key)
                                  ? "xsPrimary"
                                  : "xsNeutral"
                              }
                            >
                              <IconFilterList />
                            </MenuButton>
                            {column.filtering.render(column.filtering.key)}
                          </Menu>
                        ) : null} */}
                      </div>
                    ) : null}
                  </TableCell>
                  {column?.resizing ? (
                    <Resizer
                      tableHeight={tableHeight}
                      columnIndex={columnIndex}
                      activeResizingIndex={activeResizingIndex}
                      handleMouseDown={handleMouseDown}
                    />
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, i) => {
            const selected = selectionSelectedIndices.has(i);
            return (
              <tr key={i}>
                {selection ? (
                  <td data-selected={selected}>
                    <div data-cl-table-selection-container="">
                      <Checkbox
                        checked={selectionSelectedIndices.has(i)}
                        onChange={(event) => {
                          if (
                            typeof selection.onSelectionChange === "function"
                          ) {
                            const checked = event.currentTarget.checked;
                            setSelectionSelectedIndices((curr) => {
                              const next = cloneDeep(curr);
                              if (checked) {
                                next.add(i);
                              } else {
                                next.delete(i);
                              }
                              selection.onSelectionChange?.(
                                Array.from(next.keys()).map(
                                  (i) => data[i as any]
                                )
                              );
                              return next;
                            });
                          }
                        }}
                      />
                    </div>
                  </td>
                ) : null}
                {columns.map((column, columnIndex) => {
                  if (typeof column.render === "function") {
                    return (
                      <td key={columnIndex} data-selected={selected}>
                        {column.render(rowData)}
                      </td>
                    );
                  }
                  let content =
                    typeof column.getData === "function"
                      ? column.getData(rowData)
                      : get(rowData, column.dataPath!);
                  if (content == null) {
                    content = emptyCellText;
                  } else {
                    content = String(content) || emptyCellText;
                  }
                  const TableCellComp =
                    typeof column.getTableCell === "function"
                      ? column.getTableCell(rowData)
                      : TableCell;
                  return (
                    <td key={columnIndex} data-selected={selected}>
                      <TableCellComp
                        align={column.align}
                        emphasis={column.emphasis}>
                        {content}
                      </TableCellComp>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getThRefs(length: number) {
  return Array.from({ length }, () => useRef<any>());
}

function OrderingButton(props: {
  fieldId: string;
  searchParamKeyOrderBy: string;
  searchParamKeyOrderDirection: string;
}) {
  const { fieldId, searchParamKeyOrderBy, searchParamKeyOrderDirection } =
    props;
  const [searchParams] = useSearchParams();
  const orderBy = searchParams.get(searchParamKeyOrderBy);
  const orderDirection = searchParams.get(searchParamKeyOrderDirection);

  const searchParamsTo = new URLSearchParams(location.search);
  searchParamsTo.set(searchParamKeyOrderBy, fieldId);
  const nextOrderDirection =
    orderBy === fieldId && orderDirection === "asc" ? "desc" : "asc";
  searchParamsTo.set(searchParamKeyOrderDirection, nextOrderDirection);
  const to = { ...location, search: searchParamsTo.toString() };

  return (
    <Button
      as={RLink}
      to={to}
      variant={orderBy === fieldId ? "primary" : "neutral"}
      size="xs">
      {orderBy === fieldId && orderDirection === "asc" ? (
        <IconArrowUpward />
      ) : orderBy === fieldId && orderDirection === "desc" ? (
        <IconArrowDownward />
      ) : (
        <IconSort />
      )}
    </Button>
  );
}

function Resizer(props: {
  tableHeight: string | number;
  columnIndex: number;
  activeResizingIndex: number | null;
  handleMouseDown: (resizingIndex: number) => void;
}) {
  const { tableHeight, columnIndex, activeResizingIndex, handleMouseDown } =
    props;
  return (
    <div
      data-cl-table-resize-handle=""
      style={{ height: tableHeight }}
      onMouseDown={() => handleMouseDown(columnIndex)}
      data-resizing={activeResizingIndex === columnIndex}
    />
  );
}

// eslint-disable-next-line react/display-name
export const TableCell = React.forwardRef((props, ref) => {
  const { children, align, emphasis, as: Comp = "span", ...rest } = props;
  return (
    <Comp
      ref={ref}
      data-cl-table-cell=""
      data-cl-table-cell-align={align}
      data-cl-table-cell-emphasis={emphasis}
      {...rest}>
      {children}
    </Comp>
  );
}) as Polymorphic.ForwardRefComponent<
  "span",
  {
    children: React.ReactNode;
    align?: TColumn<any>["align"];
    emphasis?: TColumn<any>["emphasis"];
  }
>;

export function TableActionsContainer(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div data-cl-table-actions-container="">{children}</div>;
}
