import { useEffect, useState } from "react";

import { getProduct, getProductAdminUrl, type Product, type ProductImage } from "../lib/api";
import { formatPrice } from "../lib/format";

type ProductDetailPageProps = {
  productId: number;
};

function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoadingProduct(true);
      setErrorMessage("");

      try {
        const response = await getProduct(productId);

        if (isMounted) {
          setProduct(response);
          setSelectedImage(response.primary_image ?? response.images[0] ?? null)
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load product.";

        if (isMounted) {
          setErrorMessage(message);
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoadingProduct) {
    return (
      <main className="main-content">
        <section className="catalog-empty-state">
          <h2>Loading product</h2>
          <p>Preparing product details.</p>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="main-content">
        <section className="catalog-empty-state" role="alert">
          <h2>Product unavailable</h2>
          <p>{errorMessage || "This product could not be found."}</p>
          <a className="secondary-link-button detail-back-link" href="/products">
            Back to catalog
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <section className="product-detail-header">
        <a className="secondary-link-button" href="/products">
          Back to catalog
        </a>

        <a
          className="secondary-link-button"
          href={getProductAdminUrl(product.id)}
          rel="noreferrer"
          target="_blank"
        >
          Edit in admin
        </a>
      </section>

      <section className="product-detail-layout">
        <div className="product-detail-media">
          <div className="product-detail-image-panel">
            {selectedImage?.image_url ? (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || product.name}
              />
            ) : (
              <span>No image</span>
            )}
          </div>

          {product.images.length > 1 ? (
            <div className="product-image-thumbnails" aria-label="Product images">
              {product.images.map((image, index) => (
                <button
                  className={
                    selectedImage?.id === image.id
                      ? "product-thumbnail is-selected"
                      : "product-thumbnail"
                  }
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                >
                  {image.image_url ? (
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `${product.name} image ${index + 1}`}
                    />
                  ) : (
                    <span>Image {index + 1}</span>
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <article className="product-detail-content">
          <p className="eyebrow">{product.category}</p>

          <h1 className="product-detail-title">{product.name}</h1>

          <p className="product-detail-sku">{product.sku}</p>

          <p className="product-detail-price">{formatPrice(product.price)}</p>

          {product.description ? (
            <p className="product-detail-description">{product.description}</p>
          ) : (
            <p className="product-detail-description">
              No product description has been added yet.
            </p>
          )}

          <div className="product-detail-actions">
            <button className="primary-button" type="button">
              Add to layout
            </button>

            <button className="secondary-button" type="button">
              Add to list
            </button>
          </div>

          <dl className="product-spec-grid">
            <div>
              <dt>Recommended space</dt>
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
        </article>
      </section>
    </main>
  );
}

export default ProductDetailPage;