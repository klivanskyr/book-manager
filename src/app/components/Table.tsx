import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

export type Row = {
    key: string,
    [key: string]: any,
}

export type Column = {
    key: string,
    label: string,
    [key: string]: any
}
export default function TableElement({ rows, columns }: { rows: Row[], columns: Column[] }) {
    return (
      <Table>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }