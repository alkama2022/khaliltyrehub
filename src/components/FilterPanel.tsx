import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { formatCurrency } from '../lib/format'
import type { Product, VehicleType } from '../types'

export interface CatalogueFilters {
  brands: string[]
  sizes: string[]
  vehicleTypes: VehicleType[]
  minPrice: number
  maxPrice: number
  minRating: number
  inStockOnly: boolean
}

interface FilterPanelProps {
  products: Product[]
  filters: CatalogueFilters
  onChange: (filters: CatalogueFilters) => void
  onReset: () => void
  onClose?: () => void
}

const toggle = <T,>(items: T[], value: T) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value]

export function FilterPanel({
  products,
  filters,
  onChange,
  onReset,
  onClose,
}: FilterPanelProps) {
  const brands = [...new Set(products.map((product) => product.brand))].sort()
  const sizes = [...new Set(products.map((product) => product.size))].sort()
  const vehicleTypes = [...new Set(products.map((product) => product.vehicleType))].sort()
  const activeCount =
    filters.brands.length +
    filters.sizes.length +
    filters.vehicleTypes.length +
    Number(filters.minPrice > 0) +
    Number(filters.maxPrice < 300000) +
    Number(filters.minRating > 0) +
    Number(filters.inStockOnly)

  return (
    <aside className="filter-panel">
      <div className="filter-panel__header">
        <div>
          <SlidersHorizontal size={19} />
          <h2>Filters</h2>
          {activeCount > 0 && <span>{activeCount}</span>}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close filters">
            <X size={21} />
          </button>
        )}
      </div>

      <div className="filter-group">
        <h3>Brand</h3>
        <div className="filter-options">
          {brands.map((brand) => (
            <label className="check-option" key={brand}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() =>
                  onChange({ ...filters, brands: toggle(filters.brands, brand) })
                }
              />
              <span className="check-option__box" />
              <span>{brand}</span>
              <small>
                {products.filter((product) => product.brand === brand).length}
              </small>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Price range</h3>
        <div className="range-values">
          <span>{formatCurrency(filters.minPrice)}</span>
          <span>{formatCurrency(filters.maxPrice)}</span>
        </div>
        <label className="range-field">
          <span>Minimum</span>
          <input
            type="range"
            min="0"
            max="250000"
            step="5000"
            value={filters.minPrice}
            onChange={(event) => {
              const value = Number(event.target.value)
              onChange({
                ...filters,
                minPrice: value,
                maxPrice: Math.max(filters.maxPrice, value + 5000),
              })
            }}
          />
        </label>
        <label className="range-field">
          <span>Maximum</span>
          <input
            type="range"
            min="50000"
            max="300000"
            step="5000"
            value={filters.maxPrice}
            onChange={(event) => {
              const value = Number(event.target.value)
              onChange({
                ...filters,
                maxPrice: value,
                minPrice: Math.min(filters.minPrice, value - 5000),
              })
            }}
          />
        </label>
      </div>

      <div className="filter-group">
        <h3>Tyre size</h3>
        <div className="size-options">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={filters.sizes.includes(size) ? 'is-active' : ''}
              onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Vehicle type</h3>
        <div className="filter-options">
          {vehicleTypes.map((type) => (
            <label className="check-option" key={type}>
              <input
                type="checkbox"
                checked={filters.vehicleTypes.includes(type)}
                onChange={() =>
                  onChange({
                    ...filters,
                    vehicleTypes: toggle(filters.vehicleTypes, type),
                  })
                }
              />
              <span className="check-option__box" />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Customer rating</h3>
        <div className="rating-options">
          {[4.8, 4.5, 4].map((rating) => (
            <button
              key={rating}
              type="button"
              className={filters.minRating === rating ? 'is-active' : ''}
              onClick={() =>
                onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating })
              }
            >
              <span>★ {rating} & up</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group filter-group--last">
        <label className="availability-option">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) =>
              onChange({ ...filters, inStockOnly: event.target.checked })
            }
          />
          <span className="check-option__box" />
          <span>
            <strong>In-stock only</strong>
            <small>Ready for dispatch</small>
          </span>
        </label>
      </div>

      <button type="button" className="filter-reset" onClick={onReset}>
        <RotateCcw size={16} /> Reset all filters
      </button>
    </aside>
  )
}
