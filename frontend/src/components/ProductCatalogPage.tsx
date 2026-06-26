import { useEffect, useState } from "react";

import { formatPrice } from "../lib/format";
import { getProducts, type Product } from "../lib/api";

const spaceOptions = [
  { value: "", label: "All spaces" },
  { value: "pantry", label: "Pantry" },
  { value: "coffee_station", label: "Coffee Station" },
  { value: "laundry_room", label: "Laundry Room" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "vanity", label: "Vanity" },
  { value: "closet", label: "Closet" },
  { value: "cabinet", label: "Cabinet" },
  { value: "other", label: "Other" },
];

const styleOptions = [
  { value: "", label: "All styles" },
  { value: "clear_acrylic", label: "Clear Acrylic" },
  { value: "bamboo_natural", label: "Bamboo / Natural" },
  { value: "white_minimal", label: "White Minimal" },
  { value: "cream_neutral", label: "Cream Neutral" },
  { value: "mixed", label: "Mixed" },
];

function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadProducts() {
    setIsLoadingProducts(true);
    setErrorMessage("");

    try {
      const response = await getProducts({
        query,
        space: selectedSpace,
        style: selectedStyle,
      });

      setProducts(response.results);
      setProductCount(response.count);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load the product catalog.";

      setErrorMessage(message);
      setProducts([]);
      setProductCount(0);
    } finally {
      setIsLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // We intentionally load once on first render.
    // Filtering is triggered by the form submit for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    loadProducts();
  }

  function handleClearFilters() {
    setQuery("");
    setSelectedSpace("");
    setSelectedStyle("");

    setIsLoadingProducts(true);
    setErrorMessage("");

    getProducts()
      .then((response) => {
        setProducts(response.results);
        setProductCount(response.count);
      })
      .catch(() => {
        setErrorMessage("Unable to load the product catalog.");
        setProducts([]);
        setProductCount(0);
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });
  }

  return (
    <main className="main-content">
      <section className="catalog-hero">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="catalog-title">Products</h1>
          <p className="catalog-description">
            Browse products by space, style, and detail.
          </p>
        </div>

        <a className="secondary-link-button" href="/">
          Back home
        </a>
      </section>

      <section className="catalog-toolbar" aria-label="Product filters">
        <form className="catalog-filters" onSubmit={handleSubmit}>
          <label className="form-field catalog-search-field">
            <span>Search</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, SKU, material..."
              type="search"
              value={query}
            />
          </label>

          <label className="form-field">
            <span>Space</span>
            <select
              onChange={(event) => setSelectedSpace(event.target.value)}
              value={selectedSpace}
            >
              {spaceOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Style</span>
            <select
              onChange={(event) => setSelectedStyle(event.target.value)}
              value={selectedStyle}
            >
              {styleOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="catalog-filter-actions">
            <button className="primary-button" type="submit">
              Apply
            </button>

            <button
              className="secondary-button"
              onClick={handleClearFilters}
              type="button"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="catalog-results-heading">
        <p>
          {isLoadingProducts
            ? "Loading products..."
            : `${productCount} product${productCount === 1 ? "" : "s"}`}
        </p>
      </section>

      {errorMessage ? (
        <section className="catalog-empty-state" role="alert">
          <h2>Catalog unavailable</h2>
          <p>{errorMessage}</p>
        </section>
      ) : null}

      {!isLoadingProducts && !errorMessage && products.length === 0 ? (
        <section className="catalog-empty-state">
          <h2>No products found</h2>
          <p>Try clearing filters or searching for another product.</p>
        </section>
      ) : null}

      {!errorMessage && products.length > 0 ? (
        <section className="product-grid" aria-label="Product catalog">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-frame">
                {product.primary_image?.image_url ? (
                  <img
                    src={product.primary_image.image_url}
                    alt={product.primary_image.alt_text || product.name}
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>

              <div className="product-card-body">
                <div>
                  <p className="product-category">{product.category}</p>
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-sku">{product.sku}</p>
                </div>

                <p className="product-price">{formatPrice(product.price)}</p>

                <dl className="product-details">
                  <div>
                    <dt>Space</dt>
                    <dd>{product.recommended_space_label}</dd>
                  </div>

                  <div>
                    <dt>Size</dt>
                    <dd>{product.size_label}</dd>
                  </div>

                  <div>
                    <dt>Material</dt>
                    <dd>{product.material}</dd>
                  </div>

                  <div>
                    <dt>Color</dt>
                    <dd>{product.color}</dd>
                  </div>

                  <div>
                    <dt>Dimensions</dt>
                    <dd>
                      {product.width} × {product.depth} × {product.height} in
                    </dd>
                  </div>

                  <div>
                    <dt>Inventory</dt>
                    <dd>{product.inventory_quantity}</dd>
                  </div>
                </dl>
                
                <a href={`/products/${product.id}`} className="product-detail-link">View details</a>

              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}

export default ProductCatalogPage;