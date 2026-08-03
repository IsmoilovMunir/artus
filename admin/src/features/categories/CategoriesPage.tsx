import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CategoryItem } from "@/lib/types";

const SWATCHES = [
  "var(--color-accent-violet)",
  "var(--color-accent-cyan)",
  "var(--color-accent-orange)",
  "var(--color-accent-green)",
  "var(--color-accent-amber)",
  "var(--color-accent-purple)",
  "var(--color-accent-blue)",
  "var(--color-accent-yellow)",
];

function extractErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const jsonStart = raw.indexOf("{");
  if (jsonStart < 0) return raw;
  try {
    const parsed = JSON.parse(raw.slice(jsonStart));
    return typeof parsed?.message === "string" ? parsed.message : raw;
  } catch {
    return raw;
  }
}

export function CategoriesPage() {
  const categories = useAdminStore((s) => s.categoryList);
  const loadCategoryList = useAdminStore((s) => s.loadCategoryList);
  const createCategory = useAdminStore((s) => s.createCategory);
  const updateCategory = useAdminStore((s) => s.updateCategory);
  const deleteCategory = useAdminStore((s) => s.deleteCategory);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [swatch, setSwatch] = useState(SWATCHES[0]);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryList();
  }, [loadCategoryList]);

  function startCreate() {
    setEditingId("new");
    setName("");
    setSwatch(SWATCHES[0]);
    setError(null);
  }

  function startEdit(c: CategoryItem) {
    setEditingId(c.id);
    setName(c.name);
    setSwatch(c.swatch ?? SWATCHES[0]);
    setError(null);
  }

  function cancel() {
    setEditingId(null);
    setError(null);
  }

  async function save() {
    if (!name.trim()) {
      setError("Введите название");
      return;
    }
    try {
      if (editingId === "new") {
        await createCategory({ name: name.trim(), swatch });
      } else if (editingId) {
        await updateCategory(editingId, { name: name.trim(), swatch });
      }
      setEditingId(null);
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  async function handleDelete(c: CategoryItem) {
    if (!confirm(`Удалить категорию «${c.name}»?`)) return;
    setDeleteError(null);
    try {
      await deleteCategory(c.id);
    } catch (e) {
      setDeleteError(extractErrorMessage(e));
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3.5">
        {deleteError ? <div className="text-[12.5px] text-accent-orange">{deleteError}</div> : <div />}
        <Button accent="var(--color-accent-blue)" onClick={startCreate}>
          <Plus size={15} />
          Добавить категорию
        </Button>
      </div>

      {editingId && (
        <Card className="p-4.5 mb-4 flex flex-col gap-3.5">
          <div className="flex gap-3.5 items-end">
            <div className="flex-1">
              <div className="text-xs text-muted font-medium mb-1.5">Название</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button onClick={save}>Сохранить</Button>
            <Button variant="outline" onClick={cancel}>
              <X size={15} />
            </Button>
          </div>
          <div>
            <div className="text-xs text-muted font-medium mb-1.5">Цвет</div>
            <div className="flex gap-2">
              {SWATCHES.map((s) => (
                <div
                  key={s}
                  onClick={() => setSwatch(s)}
                  className="w-7 h-7 rounded-lg cursor-pointer"
                  style={{
                    background: s,
                    outline: swatch === s ? "2px solid var(--color-text)" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
          {error && <div className="text-[12.5px] text-accent-orange">{error}</div>}
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id} className="p-[18px_20px]">
            <div className="flex justify-between items-start mb-2.5">
              <div className="text-[15px] font-bold">{c.name}</div>
              <div className="w-9 h-9 rounded-lg" style={{ background: c.swatch ?? SWATCHES[0] }} />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-[12.5px] text-muted">{c.productCount} товаров</div>
              <div className="flex gap-2.5">
                <div onClick={() => startEdit(c)} className="cursor-pointer text-faint hover:text-text-secondary">
                  <Pencil size={13} />
                </div>
                <div onClick={() => handleDelete(c)} className="cursor-pointer text-faint hover:text-accent-orange">
                  <Trash2 size={13} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
