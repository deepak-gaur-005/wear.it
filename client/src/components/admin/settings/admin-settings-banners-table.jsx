import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
 
const tableWrapClass = "overflow-x-auto";
const previewWrapClass = "h-16 w-28 overflow-hidden border border-border bg-muted";
const imageClass = "h-full w-full object-cover";
const publicIdTextClass = "max-w-[360px] truncate text-sm text-muted-foreground";

function formatDateTime(value) {
  return new Date(value).toLocaleDateString();
}

function AdminSettingsBannersTable({ items }) {
  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Public ID</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className={previewWrapClass}>
                  <img
                    src={item.imageUrl}
                    alt="Banner preview"
                    className={imageClass}
                  />
                </div>
              </TableCell>

              <TableCell>
                <p className={publicIdTextClass}>
                  {item.imagePublicId}
                </p>
              </TableCell>

              <TableCell>
                <p>{formatDateTime(item.createdAt)}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSettingsBannersTable;
