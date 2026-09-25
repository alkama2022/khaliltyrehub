import { ChevronRight, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FilterPanel,
  type CatalogueFilters,
} from '../components/FilterPanel'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { useProducts } from '../hooks/useProducts'
import { usePageMeta } from '../hooks/usePageMeta'
import type { SortOption, VehicleType } from '../types'

const defaultFilters: CatalogueFilters = {
  brands: [],
  sizes: [],
  vehicleTypes: [],
  minPrice: 0,
  maxPrice: 300000,
  minRating: 0,
  inStockOnly: false,
}

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  rating: 'Highest Rated',
  newest: 'Newest',
  popular: 'Most Popular',
}

export function ShopPage() {
  usePageMeta({
    title: 'Shop Tyres',
    description:
      'Browse authentic passenger, SUV, commercial and performance tyres by brand, model, size, vehicle and rating.',
    path: '/shop',
  })
  const { products, loading, error } = useProducts()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState<CatalogueFilters>(() => ({
    ...defaultFilters,
    brands: searchParams.get('brand') ? [searchParams.get('brand')!] : [],
    sizes: searchParams.get('size') ? [searchParams.get('size')!] : [],
    vehicleTypes: searchParams.get('vehicleType')
      ? [searchParams.get('vehicleType') as VehicleType]
      : [],
  }))
  const [sort, setSort] = useState<SortOption>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    // Keep filter chips in sync when a footer/brand link opens a new query.
    // oxlint-disable-next-line react/set-state-in-effect
    const brand = searchParams.get('brand')
    const size = searchParams.get('size')
    const vehicleType = searchParams.get('vehicleType') as VehicleType | null
    // oxlint-disable-next-line react/set-state-in-effect
    setFilters((current) => ({
      ...current,
      brands: brand ? [brand] : [],
      sizes: size ? [size] : [],
      vehicleTypes: vehicleType ? [vehicleType] : [],
    }))
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        [product.brand, product.name, product.size, product.vehicleType, product.season]
          .join(' ')
          .toLowerCase()
          .includes(query)
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
      const matchesSize = filters.sizes.length === 0 || filters.sizes.includes(product.size)
      const matchesVehicle =
        filters.vehicleTypes.length === 0 || filters.vehicleTypes.includes(product.vehicleType)
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice
      const matchesRating = product.rating >= filters.minRating
      const matchesStock = !filters.inStockOnly || product.stock > 0
      return matchesSearch && matchesBrand && matchesSize && matchesVehicle && matchesPrice && matchesRating && matchesStock
    })

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'newest': return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        case 'popular': return b.popularity - a.popularity
        default: return b.popularity - a.popularity
      }
    })
  }, [products, search, filters, sort])

  const activeCount =
    filters.brands.length +
    filters.sizes.length +
    filters.vehicleTypes.length +
    Number(filters.minPrice > 0) +
    Number(filters.maxPrice < 300000) +
    Number(filters.minRating > 0) +
    Number(filters.inStockOnly)

  const clearAll = () => {
    setFilters(defaultFilters)
    setSearch('')
  }

  const removeBrand = (brand: string) =>
    setFilters((current) => ({ ...current, brands: current.brands.filter((item) => item !== brand) }))

  return (
    <>
      <section className="page-hero page-hero--shop">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link><ChevronRight size={14} /><span>Shop Tyres</span>
          </div>
          <span className="section-kicker section-kicker--light">Find your match</span>
          <h1>Shop premium tyres</h1>
          <p>Search authentic products by brand, model, size or vehicle type.</p>
        </div>
      </section>

      <section className="shop-section page-section">
        <div className="container">
          <div className="shop-toolbar">
            <label className="shop-search">
              <Search size={20} />
              <input
                type="search"
                placeholder="Search by brand, model or size (e.g. 205/55 R16)"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search tyres"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={17} />
                </button>
              )}
            </label>
            <button
              type="button"
              className="button button--outline mobile-filter-button"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter size={18} /> Filters {activeCount > 0 && <span>{activeCount}</span>}
            </button>
            <label className="sort-select">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="shop-layout">
            <div className="shop-filters">
              <FilterPanel
                products={products}
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
              />
            </div>

            <div className="shop-results">
              <div className="shop-results__header">
                <div>
                  <SlidersHorizontal size={17} />
                  <span>
                    {loading ? 'Loading catalogue…' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'tyre' : 'tyres'} found`}
                  </span>
                </div>
                {search && <p>Results for “<strong>{search}</strong>”</p>}
              </div>

              {(filters.brands.length > 0 ||
                filters.sizes.length > 0 ||
                filters.vehicleTypes.length > 0 ||
                filters.inStockOnly) && (
                <div className="active-filters">
                  {filters.brands.map((brand) => (
                    <button type="button" onClick={() => removeBrand(brand)} key={brand}>{brand} <X size={13} /></button>
                  ))}
                  {filters.sizes.map((size) => (
                    <button
                      type="button"
                      onClick={() => setFilters((current) => ({ ...current, sizes: current.sizes.filter((item) => item !== size) }))}
                      key={size}
                    >{size} <X size={13} /></button>
                  ))}
                  {filters.vehicleTypes.map((type) => (
                    <button
                      type="button"
                      onClick={() => setFilters((current) => ({ ...current, vehicleTypes: current.vehicleTypes.filter((item) => item !== type) }))}
                      key={type}
                    >{type} <X size={13} /></button>
                  ))}
                  {filters.inStockOnly && (
                    <button type="button" onClick={() => setFilters((current) => ({ ...current, inStockOnly: false }))}>In stock <X size={13} /></button>
                  )}
                  <button className="active-filters__clear" type="button" onClick={clearAll}>Clear all</button>
                </div>
              )}

              {error ? (
                <div className="no-results">
                  <h2>We couldn’t load these tyres.</h2>
                  <p>{error}</p>
                  <button className="button button--dark" onClick={() => window.location.reload()}>Try again</button>
                </div>
              ) : loading ? (
                <div className="product-grid product-grid--shop">
                  {Array.from({ length: 6 }, (_, index) => <ProductSkeleton key={index} />)}
                </div>
              ) : filteredProducts.length ? (
                <div className="product-grid product-grid--shop">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <span><Search size={28} /></span>
                  <h2>No tyres match those filters</h2>
                  <p>Try a broader price range or clear some filters to see more products.</p>
                  <button className="button button--dark" onClick={clearAll}>Clear all filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="filter-drawer-backdrop" onMouseDown={() => setMobileFiltersOpen(false)}>
          <aside onMouseDown={(event) => event.stopPropagation()}>
            <FilterPanel
              products={products}
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
              onClose={() => setMobileFiltersOpen(false)}
            />
            <button className="button button--dark button--block" onClick={() => setMobileFiltersOpen(false)}>
              Show {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </button>
          </aside>
        </div>
      )}
    </>
  )
}
