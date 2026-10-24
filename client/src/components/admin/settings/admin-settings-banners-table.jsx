import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
 
const tableWrapClass = "overflow-x-auto";
const previewWrapClass = "h-16 w-28 overflow-hidden border border-border bg-muted";
const imageClass = "h-full w-full object-cover";
const publicIdTextClass = "max-w-[360px] truncate text-sm text-muted-foreground";
const deleteButtonClass = "rounded-none text-destructive hover:text-destructive";

function formatDateTime(value) {
  return new Date(value).toLocaleDateString();
}

function AdminSettingsBannersTable({
  items,
  onDelete,
  deletingBannerId,
}) {
  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Public ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Delete</TableHead>
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

              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  className={deleteButtonClass}
                  disabled={Boolean(deletingBannerId)}
                  onClick={() => onDelete(item._id)}
                  aria-label={`Delete banner ${item.imagePublicId}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSettingsBannersTable;
