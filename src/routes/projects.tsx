import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { pageMeta, canonical } from "@/lib/seo";
import { DEPARTMENTS } from "@/lib/course-catalogue";
import {
  generateProjectTopics,
  buildResearchOutline,
  type ProjectTopic,
  type ResearchOutline,
} from "@/lib/academics.functions";
import { toast } from "sonner";
import { Loader2, Lightbulb, ListTree, ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: pageMeta({
      title: "Project Topic Generator and Research Outline Builder | Augur.edu",
      description:
        "Generate approvable final year project topics for any Nigerian university department and build the full five chapter research outline with methodology and references.",
      path: "/projects",
    }),
    links: canonical("/projects"),
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user } = useAuth();
  const topicsFn = useServerFn(generateProjectTopics);
  const outlineFn = useServerFn(buildResearchOutline);

  const [department, setDepartment] = useState(DEPARTMENTS[0]?.name ?? "Computer Science");
  const [level, setLevel] = useState("400");
  const [interest, setInterest] = useState("");
  const [topics, setTopics] = useState<ProjectTopic[] | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [chosen, setChosen] = useState("");
  const [outline, setOutline] = useState<ResearchOutline | null>(null);
  const [loadingOutline, setLoadingOutline] = useState(false);

  async function suggest() {
    if (!user) return toast.error("Sign in to generate project topics.");
    setLoadingTopics(true);
    try {
      const r = await topicsFn({ data: { department, interest: interest.trim() || undefined, level } });
      setTopics(r);
      if (!r.length) toast.error("No topics came back, try again.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not generate topics.");
    } finally {
      setLoadingTopics(false);
    }
  }

  async function outlineFor(topic: string) {
    if (!user) return toast.error("Sign in to build an outline.");
    if (topic.trim().length < 5) return toast.error("Enter or pick a project topic first.");
    setChosen(topic);
    setLoadingOutline(true);
    setOutline(null);
    try {
      const r = await outlineFn({ data: { topic: topic.trim(), department } });
      setOutline(r);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not build that outline.");
    } finally {
      setLoadingOutline(false);
    }
  }

  function download() {
    if (!outline) return;
    const body = [
      outline.title,
      "",
      "ABSTRACT",
      outline.abstract,
      "",
      ...outline.chapters.flatMap((c) => [c.heading.toUpperCase(), ...c.points.map((p) => `- ${p}`), ""]),
      "SUGGESTED REFERENCES",
      ...outline.references.map((r) => `- ${r}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${outline.title.slice(0, 60).replace(/[^\w ]+/g, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Project topics and research outlines</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Get final year project topics your supervisor will actually approve, then turn any topic into the full five
          chapter Nigerian project outline with scope, methodology and reference suggestions.
        </p>

        <section className="glass mt-8 rounded-3xl p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <Lightbulb className="h-4 w-4 text-primary" /> Topic generator
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-sm sm:col-span-1">
              <span className="text-muted-foreground">Department</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Level</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {["300", "400", "500", "600"].map((l) => (
                  <option key={l} value={l}>
                    {l} level
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Your interest (optional)</span>
              <input
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g. fintech fraud detection"
                className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <button
            onClick={suggest}
            disabled={loadingTopics}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loadingTopics ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
            {loadingTopics ? "Thinking" : "Suggest topics"}
          </button>
          {!user && (
            <p className="mt-3 text-xs text-muted-foreground">
              <Link to="/auth" className="text-primary underline">
                Sign in
              </Link>{" "}
              to use the generator.
            </p>
          )}

          {topics && topics.length > 0 && (
            <div className="mt-6 grid gap-3">
              {topics.map((t) => (
                <div key={t.topic} className="rounded-2xl border border-border bg-background/50 p-4">
                  <h3 className="text-sm font-semibold leading-snug">{t.topic}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{t.rationale}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <span className="text-foreground">Scope: </span>
                    {t.scope}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <span className="text-foreground">Method: </span>
                    {t.methods}
                  </p>
                  <button
                    onClick={() => outlineFor(t.topic)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    Build the outline <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass mt-6 rounded-3xl p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <ListTree className="h-4 w-4 text-primary" /> Research outline builder
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={chosen}
              onChange={(e) => setChosen(e.target.value)}
              placeholder="Paste or type your project topic"
              className="min-w-[16rem] flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={() => outlineFor(chosen)}
              disabled={loadingOutline}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loadingOutline ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListTree className="h-4 w-4" />}
              {loadingOutline ? "Structuring" : "Build outline"}
            </button>
          </div>

          {outline && (
            <div className="mt-6">
              <h3 className="font-display text-base font-semibold">{outline.title}</h3>
              {outline.abstract && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {outline.abstract}
                </p>
              )}
              <div className="mt-5 space-y-4">
                {outline.chapters.map((c) => (
                  <div key={c.heading} className="rounded-2xl border border-border bg-background/50 p-4">
                    <h4 className="text-sm font-semibold">{c.heading}</h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                      {c.points.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">-</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {outline.references.length > 0 && (
                <div className="mt-4 rounded-2xl border border-border bg-background/50 p-4">
                  <h4 className="text-sm font-semibold">Suggested references</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {outline.references.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={download}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-accent/10"
              >
                <Download className="h-4 w-4" /> Download outline
              </button>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
