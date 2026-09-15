import { CategoryDialog } from "@/components/admin/products/category-dialog";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import { ProductToolbar } from "@/components/admin/products/product-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";

const pageWrap = "space-y-6 p-6";

const cardClass = "border-border bg-card shadow-sm";

const cardHeaderClass = "space-y-4";

const cardTitleClass = "text-xl";

const cardContentClass = "space-y-4";

function AdminProducts() {

  const {search,
    setSearch, 
    products, 
    categories, 
    loading, 
    refreshAll,
    categoryDialogOpen, 
    setCategoryDialogOpen, 
    productDialogOpen, 
    setProductDialogOpen, 
    editingProduct, 
    openCreateDialog,
    closeProductDialog} = useAdminProducts()

  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className={cardTitleClass}>
            Products
          </CardTitle>
          <ProductToolbar
            search={search}
            onSearchVhanges={setSearch}
            onManageCategories={() => setCategoryDialogOpen(true)}          
            onAddProduct={openCreateDialog}
          />
        </CardHeader>

        <CardContent>Titles</CardContent>
      </Card> 

      <CategoryDialog
      open={categoryDialogOpen}
      onOpenChange={setCategoryDialogOpen}
      categories={categories}
      onSaved={refreshAll}
      />

      <ProductDialog
      open={productDialogOpen}
      onOpenChange={(open)=> {
        if(!open){
          closeProductDialog();
          return
        }
        setProductDialogOpen(true)
      }}
      categories={categories}
      />
    </div>
  )
}

export default AdminProducts;