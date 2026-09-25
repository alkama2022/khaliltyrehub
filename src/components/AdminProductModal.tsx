import { ImagePlus, Save, X } from 'lucide-react'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import type { Product, Season, VehicleType } from '../types'

interface AdminProductModalProps {
  product?: Product
  onClose: () => void
  onSave: (product: Product) => Promise<void>
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const defaultImage = '/images/tyre-studio.jpg'

export function AdminProductModal({ product, onClose, onSave }: AdminProductModalProps) {
  const [form, setForm] = useState({
    brand: product?.brand || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    previousPrice: product?.previousPrice || 0,
    size: product?.size || '',
    width: product?.width || 0,
    aspectRatio: product?.aspectRatio || 0,
    rimDiameter: product?.rimDiameter || 0,
    loadIndex: product?.loadIndex || 0,
    speedRating: product?.speedRating || 'H',
    vehicleType: product?.vehicleType || 'Passenger',
    season: product?.season || 'All-season',
    stock: product?.stock || 0,
    imageUrl: product?.images[0] || defaultImage,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError('For this local demo, use an image smaller than 1.5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('imageUrl', String(reader.result))
    reader.readAsDataURL(file)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.brand.trim() || !form.name.trim() || !form.size.trim() || form.price <= 0) {
      setError('Brand, name, size and a price greater than zero are required.')
      return
    }
    setSaving(true)
    const id = product?.id || `${toSlug(`${form.brand}-${form.name}-${form.size}`)}-${Date.now().toString().slice(-5)}`
    const next: Product = {
      id,
      brand: form.brand.trim(),
      name: form.name.trim(),
      description: form.description.trim() || `${form.brand} ${form.name} in ${form.size}, designed for ${form.vehicleType.toLowerCase()} vehicles.`,
      price: form.price,
      previousPrice: form.previousPrice > form.price ? form.previousPrice : undefined,
      images: [form.imageUrl || defaultImage, ...(product?.images || []).slice(1)],
      size: form.size.trim(),
      width: form.width,
      aspectRatio: form.aspectRatio,
      rimDiameter: form.rimDiameter,
      loadIndex: form.loadIndex,
      speedRating: form.speedRating.trim().toUpperCase(),
      vehicleType: form.vehicleType as VehicleType,
      season: form.season as Season,
      construction: product?.construction || 'Radial',
      tubeless: product?.tubeless ?? true,
      stock: form.stock,
      rating: product?.rating || 0,
      reviewCount: product?.reviewCount || 0,
      reviews: product?.reviews || [],
      createdDate: product?.createdDate || new Date().toISOString().slice(0, 10),
      popularity: product?.popularity || 50,
      badge: product?.badge,
    }
    await onSave(next)
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-backdrop admin-modal-backdrop" onMouseDown={onClose} role="presentation">
      <section className="admin-product-modal" role="dialog" aria-modal="true" aria-labelledby="admin-product-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div><span>{product ? 'Update catalogue' : 'New catalogue item'}</span><h2 id="admin-product-title">{product ? `Edit ${product.name}` : 'Add a tyre'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={21} /></button>
        </header>
        <form onSubmit={submit}>
          <div className="admin-product-form">
            <div className="admin-image-upload">
              <div className="admin-image-upload__preview">
                {form.imageUrl ? <img src={form.imageUrl} alt="Product preview" /> : <ImagePlus size={28} />}
              </div>
              <div>
                <label className="button button--outline" htmlFor="admin-image-file"><ImagePlus size={16} /> Upload image</label>
                <input id="admin-image-file" type="file" accept="image/*" onChange={handleImage} />
                <p>Or paste an image URL. Uploaded images are stored in this browser for the demo.</p>
                <input type="url" value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="admin-form-grid">
              <div className="form-field"><label htmlFor="admin-brand">Brand <b>*</b></label><input id="admin-brand" value={form.brand} onChange={(event) => update('brand', event.target.value)} placeholder="Michelin" /></div>
              <div className="form-field"><label htmlFor="admin-name">Model / name <b>*</b></label><input id="admin-name" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Primacy 4+" /></div>
              <div className="form-field"><label htmlFor="admin-size">Tyre size <b>*</b></label><input id="admin-size" value={form.size} onChange={(event) => update('size', event.target.value)} placeholder="205/55 R16" /></div>
              <div className="form-field"><label htmlFor="admin-price">Price (₦) <b>*</b></label><input id="admin-price" type="number" min="1" value={form.price || ''} onChange={(event) => update('price', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-previous-price">Previous price (₦)</label><input id="admin-previous-price" type="number" min="0" value={form.previousPrice || ''} onChange={(event) => update('previousPrice', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-stock">Stock quantity</label><input id="admin-stock" type="number" min="0" value={form.stock} onChange={(event) => update('stock', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-width">Width (mm)</label><input id="admin-width" type="number" min="0" value={form.width || ''} onChange={(event) => update('width', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-ratio">Aspect ratio</label><input id="admin-ratio" type="number" min="0" value={form.aspectRatio || ''} onChange={(event) => update('aspectRatio', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-rim">Rim diameter (in)</label><input id="admin-rim" type="number" min="0" value={form.rimDiameter || ''} onChange={(event) => update('rimDiameter', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-load">Load index</label><input id="admin-load" type="number" min="0" value={form.loadIndex || ''} onChange={(event) => update('loadIndex', Number(event.target.value))} /></div>
              <div className="form-field"><label htmlFor="admin-speed">Speed rating</label><input id="admin-speed" value={form.speedRating} onChange={(event) => update('speedRating', event.target.value)} placeholder="H" maxLength={3} /></div>
              <div className="form-field"><label htmlFor="admin-vehicle">Vehicle type</label><select id="admin-vehicle" value={form.vehicleType} onChange={(event) => update('vehicleType', event.target.value)}><option>Passenger</option><option>SUV &amp; 4x4</option><option>Commercial</option><option>Performance</option></select></div>
              <div className="form-field"><label htmlFor="admin-season">Season / type</label><select id="admin-season" value={form.season} onChange={(event) => update('season', event.target.value)}><option>All-season</option><option>Summer</option><option>Winter</option><option>All-terrain</option></select></div>
            </div>
            <div className="form-field"><label htmlFor="admin-description">Product description</label><textarea id="admin-description" rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the tyre and its intended use..." /></div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <footer>
            <button type="button" className="button button--outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button--dark" disabled={saving}><Save size={17} /> {saving ? 'Saving…' : 'Save tyre'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
