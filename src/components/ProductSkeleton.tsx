export function ProductSkeleton() {
  return (
    <div className="product-card product-skeleton" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="product-card__body">
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--medium" />
        <div className="skeleton skeleton--button" />
      </div>
    </div>
  )
}
