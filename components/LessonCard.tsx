import { useEffect, useState } from "react";
import { Lesson, lessonTitle, lessonSummary } from "@/data/lessons";
import { isDone, markDone } from "@/lib/storage";

export default function LessonCard({
  lesson, locale
}: { lesson: Lesson; locale: "en"|"es" }) {
  const [done, setDone] = useState(false);
  useEffect(() => { setDone(isDone(lesson.id)); }, [lesson.id]);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full border bg-brand-50 flex items-center justify-center text-sm">📘</div>
        <div className="flex-1">
          <p className="font-semibold text-ink-900">{lessonTitle(lesson, locale)}</p>
          <p className="text-sm text-slate-700 mt-1">{lessonSummary(lesson, locale)}</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={lesson.href}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm no-underline bg-brand-500 text-white"
              target={lesson.href.startsWith("http") ? "_blank" : "_self"}
              rel="noreferrer"
              onClick={() => { markDone(lesson.id); setDone(true); }}
            >
              {locale === "en" ? "Open lesson" : "Abrir lección"}
            </a>
            {done && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border">
                {locale === "en" ? "Completed" : "Completada"}
              </span>
            )}
            <span className="text-xs text-slate-600">
              {lesson.duration_min} {locale==="en" ? "min" : "min"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
