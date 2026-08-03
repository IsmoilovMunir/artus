import { useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { publishStatusStyle } from "@/lib/badge";
import type { Page } from "@/lib/types";

const GRID = "2fr 1fr 1fr 0.6fr";

export function PagesTab() {
  const pages = useAdminStore((s) => s.pages);
  const savePage = useAdminStore((s) => s.savePage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Page | null>(null);

  function openEditor(page: Page) {
    setEditingId(page.id);
    setDraft({ ...page });
  }
  function closeEditor() {
    setEditingId(null);
    setDraft(null);
  }
  function handleSave() {
    if (!draft) return;
    savePage({ ...draft, updated: new Date().toLocaleDateString("ru-RU") });
    closeEditor();
  }

  return (
    <div>
      <Card className="overflow-hidden mb-4">
        <div className="grid gap-4 px-5 py-3 text-[11.5px] text-faint font-semibold uppercase border-b border-border" style={{ gridTemplateColumns: GRID }}>
          <div>Страница</div>
          <div>Статус</div>
          <div>Обновлено</div>
          <div />
        </div>
        {pages.map((p, i) => (
          <div
            key={p.id}
            className={`grid gap-4 items-center px-5 py-3.5 ${i === pages.length - 1 ? "" : "border-b border-border-subtle"}`}
            style={{ gridTemplateColumns: GRID }}
          >
            <div className="text-[13.5px] font-medium">{p.title}</div>
            <div>
              <Badge style={publishStatusStyle(p.status)}>{p.status}</Badge>
            </div>
            <div className="text-[12.5px] text-muted font-mono">{p.updated}</div>
            <div onClick={() => openEditor(p)} className="text-[12.5px] font-semibold text-accent-cyan cursor-pointer text-right">
              Изменить
            </div>
          </div>
        ))}
      </Card>

      {draft && editingId && (
        <Card className="p-5.5" style={{ borderColor: "var(--color-accent-blue)" }}>
          <div className="text-[15px] font-bold mb-4">Редактирование: {draft.title}</div>
          <div className="mb-3.5">
            <div className="text-xs text-muted font-medium mb-1.5">Заголовок страницы</div>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="mb-3.5">
            <div className="text-xs text-muted font-medium mb-1.5">Содержимое</div>
            <Textarea rows={4} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4.5">
            <div>
              <div className="text-xs text-muted font-medium mb-1.5">Meta title</div>
              <Input value={draft.metaTitle} onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })} />
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1.5">Meta description</div>
              <Input value={draft.metaDescription} onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button accent="var(--color-accent-blue)" onClick={handleSave}>Сохранить</Button>
            <Button variant="outline" onClick={closeEditor}>Отмена</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
