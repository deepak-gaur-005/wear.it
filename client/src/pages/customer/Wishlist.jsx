import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function CustomerWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      try {
        const data = await apiGet("/customer/wishlist");
        if (active) {
          setItems(data?.items ?? []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load your wishlist.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      active = false;
    };
  }, []);

  async function removeItem(productId) {
    setRemovingProductId(productId);
    setError("");

    try {
      await apiDelete(`/customer/wishlist/items/${productId}`);
      setItems((currentItems) =>
        currentItems.filter((item) => item.productId !== productId),
      );
    } catch (removeError) {
      setError(removeError.message || "Unable to remove this item.");
    } finally {
      setRemovingProductId(null);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-muted-foreground">Loading wishlist...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="space-y-3 rounded-xl border border-border/60 bg-card p-4"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
              ) : null}
              <div>
                <p className="text-sm text-muted-foreground">{item.brand}</p>
                <h2 className="font-medium">{item.title}</h2>
                <p className="mt-1">${item.finalPrice}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => void removeItem(item.productId)}
                disabled={removingProductId === item.productId}
              >
                {removingProductId === item.productId
                  ? "Removing..."
                  : "Remove"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
