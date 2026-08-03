import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Lock, X } from "lucide-react";
import { useAdminStore, useProduct } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Product, ProductDraft, SpecRow } from "@/lib/types";

function buildDraft(p: Product | undefined): ProductDraft {
  if (!p) {
    return {
      id: "", name: "Новый товар", sku: "ASN-NEW-000", brand: "Samsung", category: "Телевизоры",
      panel: "QLED", resolution: "4K", platform: "Tizen", size: '55"', price: 0, oldPrice: null,
      stock: 0, status: "Черновик", accessories: [], description: "",
      seoTitle: "", seoDescription: "", slug: "", seoKeywords: "", photoAlt: "", specs: [],
    };
  }
  return {
    ...p,
    seoTitle: p.seoTitle || `${p.name} купить в Aston`,
    seoDescription:
      p.seoDescription ||
      `Купить ${p.name} с доставкой по России. Гарантия, оригинальные аксессуары, наличие на складе.`,
    slug: p.slug || p.sku.toLowerCase(),
    seoKeywords: p.seoKeywords || `${p.brand}, ${p.category.toLowerCase()}, купить телевизор`,
    photoAlt: p.photoAlt || p.name,
    specs: p.specs ?? [],
  };
}

function Field({ label, locked, children }: { label: string; locked?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs text-muted font-medium">{label}</span>
        {locked ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-active text-muted flex items-center gap-1">
            <Lock size={9} /> со склада
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProduct(id);
  const saveProduct = useAdminStore((s) => s.saveProduct);
  const uploadProductPhoto = useAdminStore((s) => s.uploadProductPhoto);
  const deleteProductPhoto = useAdminStore((s) => s.deleteProductPhoto);
  const brandChoices = useAdminStore((s) => s.brands);
  const categoryChoices = useAdminStore((s) => s.categories);
  const whLastSync = useAdminStore((s) => s.settings.whLastSync);
  const isNew = id === undefined;

  const [draft, setDraft] = useState<ProductDraft>(() => buildDraft(product));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(buildDraft(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset the whole draft when navigating to a different product
  }, [product?.id]);

  useEffect(() => {
    if (product) setDraft((d) => ({ ...d, photos: product.photos ?? [] }));
  }, [product?.photos]);

  const mainPhoto = (draft.photos ?? []).find((p) => p.isMain) ?? (draft.photos ?? [])[0];

  function handlePhotoInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !product) return;
    uploadProductPhoto(product.id, file, (draft.photos ?? []).length === 0);
  }

  function handleDeletePhoto(photoId: string) {
    if (!product) return;
    deleteProductPhoto(product.id, photoId);
  }

  function set<K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function addSpecRow() {
    setDraft((d) => ({ ...d, specs: [...d.specs, { key: "", value: "" }] }));
  }
  function updateSpecRow(i: number, patch: Partial<SpecRow>) {
    setDraft((d) => ({ ...d, specs: d.specs.map((sp, idx) => (idx === i ? { ...sp, ...patch } : sp)) }));
  }
  function removeSpecRow(i: number) {
    setDraft((d) => ({ ...d, specs: d.specs.filter((_, idx) => idx !== i) }));
  }

  function handleSave() {
    saveProduct(draft);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/products");
    }, 650);
  }

  if (!isNew && !product) {
    return <div className="text-muted">Товар не найден.</div>;
  }

  return (
    <div>
      <div
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-[13px] text-muted mb-4.5 cursor-pointer w-fit"
      >
        <ChevronLeft size={14} />
        <span>Товары</span>
        <span>/</span>
        <span className="text-text-secondary">{draft.name}</span>
      </div>

      {!isNew && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] mb-4 w-fit"
          style={{ background: "color-mix(in oklch, var(--color-accent-green) 12%, transparent)", border: "1px solid color-mix(in oklch, var(--color-accent-green) 40%, transparent)" }}
        >
          <div className="w-[7px] h-[7px] rounded-full bg-accent-green" />
          <span className="text-[12.5px] font-medium" style={{ color: "var(--color-accent-green)" }}>
            Остаток синхронизирован со складом: {whLastSync}
          </span>
        </div>
      )}

      <div className="grid grid-cols-[1fr_340px] gap-5">
        <Card className="p-6 flex flex-col gap-4.5">
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <Field label="Название товара">
              <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="SKU">
              <Input mono value={draft.sku} onChange={(e) => set("sku", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Field label="Бренд">
              <Select value={draft.brand} onChange={(e) => set("brand", e.target.value)}>
                {brandChoices.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Select>
            </Field>
            <Field label="Категория">
              <Select value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {categoryChoices.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Тип панели">
              <Select value={draft.panel} onChange={(e) => set("panel", e.target.value)}>
                {["OLED", "QLED", "Mini LED", "LED", "—"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </Field>
            <Field label="Smart TV платформа">
              <Select value={draft.platform} onChange={(e) => set("platform", e.target.value)}>
                {["Tizen", "webOS", "Google TV", "—"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Field label="Диагональ">
              <Input value={draft.size} onChange={(e) => set("size", e.target.value)} />
            </Field>
            <Field label="Разрешение">
              <Select value={draft.resolution} onChange={(e) => set("resolution", e.target.value)}>
                {["8K", "4K", "FHD", "—"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </Field>
            <Field label="Цена, ₽">
              <Input mono type="number" value={draft.price} onChange={(e) => set("price", Number(e.target.value))} />
            </Field>
            <Field label="Остаток, шт" locked>
              <Input variant="locked" mono value={draft.stock} disabled />
            </Field>
          </div>

          <Field label="Описание">
            <Textarea rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div>
            <div className="text-xs text-muted font-medium mb-2">Совместимые аксессуары</div>
            <div className="flex flex-wrap gap-2">
              {draft.accessories.length === 0 ? (
                <span className="text-xs text-faint">нет привязанных аксессуаров</span>
              ) : (
                draft.accessories.map((a) => (
                  <div key={a} className="px-3 py-1.5 bg-surface-active border border-border-strong rounded-full text-xs text-text-secondary">
                    {a}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2.5">
              <div className="text-[13px] font-semibold">Характеристики</div>
              <div onClick={addSpecRow} className="text-xs font-semibold text-accent-cyan cursor-pointer">
                + Добавить строку
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {draft.specs.map((sp, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2">
                  <input
                    value={sp.key}
                    onChange={(e) => updateSpecRow(i, { key: e.target.value })}
                    placeholder="Параметр"
                    className="h-9 rounded-lg bg-surface-3 border border-border-input px-2.5 text-[12.5px] outline-none"
                  />
                  <input
                    value={sp.value}
                    onChange={(e) => updateSpecRow(i, { value: e.target.value })}
                    placeholder="Значение"
                    className="h-9 rounded-lg bg-surface-3 border border-border-input px-2.5 text-[12.5px] outline-none"
                  />
                  <div onClick={() => removeSpecRow(i)} className="h-9 rounded-lg bg-surface-active flex items-center justify-center cursor-pointer text-accent-orange">
                    <X size={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[13px] font-semibold mb-3">SEO для карточки товара</div>
            <div className="flex flex-col gap-3.5">
              <Field label="SEO title">
                <Input value={draft.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              </Field>
              <Field label="Meta description">
                <Textarea rows={2} value={draft.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="URL / slug">
                  <div className="flex items-center h-[38px] rounded-[9px] bg-surface-3 border border-border-input px-3">
                    <span className="text-xs text-faint font-mono">/product/</span>
                    <input
                      value={draft.slug}
                      onChange={(e) => set("slug", e.target.value)}
                      className="flex-1 h-full bg-transparent border-none text-[12.5px] font-mono outline-none"
                    />
                  </div>
                </Field>
                <Field label="Ключевые слова">
                  <Input value={draft.seoKeywords} onChange={(e) => set("seoKeywords", e.target.value)} />
                </Field>
              </div>
              <Field label="Alt-текст для главного фото">
                <Input value={draft.photoAlt} onChange={(e) => set("photoAlt", e.target.value)} />
              </Field>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-4.5">
            <div className="text-[13px] font-semibold mb-3">Галерея фото</div>
            {isNew ? (
              <div className="text-xs text-muted">Сохраните товар, чтобы загружать фото</div>
            ) : (
              <>
                <div className="w-full aspect-[4/3] rounded-[10px] bg-surface-2 flex items-center justify-center mb-2.5 overflow-hidden">
                  {mainPhoto ? (
                    <img src={mainPhoto.url} alt={draft.photoAlt || draft.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="font-mono text-[11px] text-muted">главное фото товара</div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(draft.photos ?? []).map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <div
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-[oklch(0.14_0.01_258/0.7)] flex items-center justify-center cursor-pointer text-accent-orange"
                      >
                        <X size={11} />
                      </div>
                    </div>
                  ))}
                  {(draft.photos ?? []).length < 4 && (
                    <label className="aspect-square rounded-lg bg-surface-active flex items-center justify-center cursor-pointer text-faint hover:text-text-tertiary">
                      +
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoInput} />
                    </label>
                  )}
                </div>
              </>
            )}
          </Card>

          <Card className="p-4.5">
            <div className="text-[13px] font-semibold mb-3">Статус публикации</div>
            <Select value={draft.status} onChange={(e) => set("status", e.target.value as ProductDraft["status"])} className="w-full mb-3.5">
              <option value="Активен">Активен</option>
              <option value="Черновик">Черновик</option>
              <option value="Архив">Архив</option>
            </Select>
            <Button className="w-full justify-center mb-2.5" onClick={handleSave}>
              {saved ? "Сохранено ✓" : "Сохранить товар"}
            </Button>
            <Button variant="outline" className="w-full justify-center" onClick={() => navigate("/products")}>
              Отмена
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
