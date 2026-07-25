import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Package } from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  productToEdit?: Product | null;
  categories: string[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Development Boards',
    brand: 'EdgeKart',
    price: 499,
    originalPrice: 649,
    stock: 20,
    rating: 4.5,
    imageId: 'esp32',
    description: '',
    features: [],
    packageContents: [],
    tags: [],
    specifications: {},
    featured: false,
    isNew: true,
    isBestSeller: false,
  });

  const [featuresStr, setFeaturesStr] = useState('');
  const [contentsStr, setContentsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        id: productToEdit.id || productToEdit._id,
        name: productToEdit.name || '',
        sku: productToEdit.sku || productToEdit.customId || '',
        category: productToEdit.category || categories[0] || 'Development Boards',
        brand: productToEdit.brand || 'EdgeKart',
        price: productToEdit.price ?? 0,
        originalPrice: productToEdit.originalPrice ?? null,
        stock: productToEdit.stock ?? productToEdit.stockCount ?? 0,
        rating: productToEdit.rating ?? 4.5,
        imageId: productToEdit.imageId || 'esp32',
        description: productToEdit.description || '',
        featured: !!productToEdit.featured,
        isNew: productToEdit.isNew ?? (productToEdit as any).isNewProduct ?? false,
        isBestSeller: !!productToEdit.isBestSeller,
      });
      setFeaturesStr(Array.isArray(productToEdit.features) ? productToEdit.features.join(', ') : '');
      setContentsStr(Array.isArray(productToEdit.packageContents) ? productToEdit.packageContents.join(', ') : '');
      setTagsStr(Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : '');

      const specs = productToEdit.specs || productToEdit.specifications || {};
      const pairs = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
      setSpecsList(pairs.length > 0 ? pairs : [{ key: '', value: '' }]);
    } else {
      setFormData({
        name: '',
        sku: 'EK-DEV-' + Math.floor(100 + Math.random() * 900),
        category: categories[0] || 'Development Boards',
        brand: 'EdgeKart',
        price: 499,
        originalPrice: 649,
        stock: 25,
        rating: 4.5,
        imageId: 'esp32',
        description: '',
        featured: false,
        isNew: true,
        isBestSeller: false,
      });
      setFeaturesStr('Integrated Wi-Fi & Bluetooth, Dual Core Tensilica LX6, 520 KB SRAM');
      setContentsStr('1x DevKit Board, Anti-Static Packaging');
      setTagsStr('esp32, iot, microcontroller, wifi');
      setSpecsList([
        { key: 'Processor', value: 'ESP32 Dual-Core 240MHz' },
        { key: 'Wireless', value: '802.11 b/g/n Wi-Fi + BLE' }
      ]);
    }
    setError('');
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specsList];
    updated[index][field] = val;
    setSpecsList(updated);
  };

  const addSpecRow = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Title Validation
    if (!formData.name || !formData.name.trim()) {
      setError('Product title is required.');
      return;
    }

    // 2. SKU Validation
    if (!formData.sku || !formData.sku.trim()) {
      setError('SKU / Model ID is required.');
      return;
    }

    // 3. Category Validation
    if (!formData.category || !formData.category.trim()) {
      setError('Category selection is required.');
      return;
    }

    // 4. Selling Price Validation
    if (formData.price === undefined || formData.price === null || Number(formData.price) < 0) {
      setError('Selling price must be a valid non-negative number.');
      return;
    }

    // 5. Original Price Validation
    if (formData.originalPrice !== undefined && formData.originalPrice !== null && Number(formData.originalPrice) < 0) {
      setError('Original MRP price cannot be negative.');
      return;
    }

    // 6. Stock Validation
    if (formData.stock === undefined || formData.stock === null || Number(formData.stock) < 0) {
      setError('Stock quantity must be a valid non-negative integer.');
      return;
    }

    // 7. Description Validation
    if (!formData.description || !formData.description.trim()) {
      setError('Product description is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Convert comma-separated strings to arrays
    const features = featuresStr.split(',').map((s) => s.trim()).filter(Boolean);
    const packageContents = contentsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const tags = tagsStr.split(',').map((s) => s.trim()).filter(Boolean);

    // Convert specsList to object
    const specifications: Record<string, string> = {};
    specsList.forEach((item) => {
      if (item.key.trim()) {
        specifications[item.key.trim()] = item.value.trim();
      }
    });

    const payload: Partial<Product> = {
      ...formData,
      features,
      packageContents,
      tags,
      specifications,
      specs: specifications,
      customId: formData.sku || formData.customId || undefined,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      console.error('Save product error:', err);
      setError(err.message || 'Failed to save product. Check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass max-w-3xl w-full rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {productToEdit ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h3>
              <p className="text-xs text-slate-400">
                {productToEdit ? `Updating ID: ${productToEdit.id || productToEdit._id}` : 'Fill in product catalog specs, pricing, and stock'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError('')} className="text-rose-400 hover:text-rose-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ESP32 DevKit V1 Wi-Fi + BLE"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU / Model ID *</label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. EK-DEV-001"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category || categories[0]}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand || 'EdgeKart'}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.price ?? 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Original MRP Price (₹)</label>
              <input
                type="number"
                min={0}
                value={formData.originalPrice ?? ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.stock ?? 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Image Artwork Key / URL</label>
              <div className="flex gap-2">
                <select
                  value={formData.imageId || 'esp32'}
                  onChange={(e) => setFormData({ ...formData, imageId: e.target.value })}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="esp32">esp32</option>
                  <option value="mq2-sensor">mq2-sensor</option>
                  <option value="oled-096">oled-096</option>
                  <option value="pico-w">pico-w</option>
                  <option value="nema17">nema17</option>
                  <option value="power-5v">power-5v</option>
                  <option value="dht22">dht22</option>
                  <option value="arduino-kit">arduino-kit</option>
                </select>
                <input
                  type="text"
                  placeholder="Or custom Image Key / URL"
                  value={formData.imageId || ''}
                  onChange={(e) => setFormData({ ...formData, imageId: e.target.value })}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Comprehensive hardware component breakdown and features..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
              />
              <span className="font-medium text-amber-400">★ Featured Product</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
              />
              <span className="font-medium text-cyan-400">Mark as New Arrival</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
              />
              <span className="font-medium text-emerald-400">Best Seller Badge</span>
            </label>
          </div>

          {/* Lists */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Features (comma-separated)</label>
              <input
                type="text"
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                placeholder="Wi-Fi, Bluetooth, 520KB SRAM, Dual Core"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Package Contents (comma-separated)</label>
              <input
                type="text"
                value={contentsStr}
                onChange={(e) => setContentsStr(e.target.value)}
                placeholder="1x ESP32 Board, 1x Header Pins"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Search Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="esp32, iot, wifi, bluetooth"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dynamic Specifications list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Technical Specifications</label>
              <button
                type="button"
                onClick={addSpecRow}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Spec Line
              </button>
            </div>

            <div className="space-y-2">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Parameter (e.g. Operating Voltage)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 3.3V DC)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : productToEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
