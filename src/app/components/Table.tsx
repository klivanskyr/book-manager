'use client'; 

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Pagination } from "@nextui-org/react";

export type Row = {
    key: string,
    [key: string]: any,
}

export type Column = {
    key: string,
    label: string,
    [key: string]: any
}

export default function TableElement({ rows, columns, classNames, page=undefined, pages=[], setPage=()=>{}, hideHeader=false, hasPagination=false }: { rows: Row[], columns: Column[], classNames?: {}, page?: any, pages?: any[], setPage?: Function, hideHeader?: boolean, hasPagination?: boolean }) {
  if (hasPagination) {
    return (
      <Table classNames={classNames} hideHeader={hideHeader} aria-label="Table"
        bottomContent={
          <Pagination isCompact showControls showShadow color="primary" page={page} total={pages.length} onChange={(page) => setPage(page)}/>
        }
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  } else {
    return (
      <Table hideHeader={hideHeader} aria-label="Table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
}