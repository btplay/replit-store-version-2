import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LogOut, Calendar, FileText, Image, HelpCircle, Star, Link2, Send, Eye, Check, X, ChevronDown, ChevronUp, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = "/api";

function useAdminToken() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("bt_admin_token"));
  const save = (t: string) => { localStorage.setItem("bt_admin_token", t); setToken(t); };
  const clear = () => { localStorage.removeItem("bt_admin_token"); setToken(null); };
  return { token, save, clear };
}

async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!res.ok) throw new Error("Invalid credentials");
      const { token } = await res.json();
      onLogin(token);
    } catch {
      setError("Invalid username or password");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white border border-slate-100 shadow-sm p-10 w-full max-w-sm">
        <h1 style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.6rem" }} className="text-slate-800 mb-2">BT Play</h1>
        <p className="text-slate-500 text-sm mb-8 tracking-widest uppercase">Admin Dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="h-11 rounded-none bg-slate-50 border-transparent" />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 rounded-none bg-slate-50 border-transparent" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-11 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white tracking-widest uppercase text-xs border-none rounded-none">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Enquiries Tab ─────────────────────────────────────────────────────────────
function EnquiriesTab({ token }: { token: string }) {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyMsg, setReplyMsg] = useState<Record<number, string>>({});
  const [sending, setSending] = useState<number | null>(null);

  const load = useCallback(async () => {
    const data = await apiFetch("/admin/enquiries", token);
    setEnquiries(data);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelivery(id: number) {
    setSending(id);
    await apiFetch(`/admin/enquiries/${id}/confirm-delivery`, token, { method: "POST" });
    await load(); setSending(null);
  }

  async function sendReply(id: number) {
    setSending(id);
    await apiFetch(`/admin/enquiries/${id}/reply`, token, { method: "POST", body: JSON.stringify({ message: replyMsg[id] }) });
    setReplyMsg(r => ({ ...r, [id]: "" })); setSending(null);
  }

  const statusColor: Record<string, string> = {
    enquiry_received: "bg-yellow-100 text-yellow-800",
    quote_sent: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    event_complete: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-serif text-slate-900 mb-4">Enquiries ({enquiries.length})</h2>
      {enquiries.map(enq => (
        <div key={enq.id} className="bg-white border border-slate-100 shadow-sm">
          <button className="w-full flex items-start justify-between p-5 text-left" onClick={() => setExpanded(e => e === enq.id ? null : enq.id)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-medium text-slate-900">{enq.name}</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${statusColor[enq.status] ?? "bg-slate-100 text-slate-600"}`}>{enq.status?.replace(/_/g, " ")}</span>
                {enq.deliveryConfirmed === "confirmed" && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Delivery Confirmed</span>}
              </div>
              <p className="text-sm text-slate-500">{enq.email} · {enq.eventDate ?? "No date"}{enq.eventTime ? ` at ${enq.eventTime}` : ""} · {enq.bookingReference}</p>
            </div>
            {expanded === enq.id ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
          </button>

          {expanded === enq.id && (
            <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[["Phone", enq.phone], ["Package", enq.packageInterest], ["Guests", enq.guestCount], ["Venue", enq.venue], ["Event", enq.eventType], ["Delivery Charge", enq.deliveryCharge ? `£${enq.deliveryCharge}` : "None"]].map(([l, v]) => v ? (
                  <div key={l as string}><p className="text-[10px] text-slate-400 uppercase tracking-widest">{l}</p><p className="text-slate-700 font-medium">{v as string}</p></div>
                ) : null)}
              </div>
              {enq.additionalDetails && <p className="text-sm text-slate-600 bg-slate-50 p-3 italic">"{enq.additionalDetails}"</p>}
              <div className="flex flex-wrap gap-2 pt-2">
                {enq.deliveryConfirmed !== "confirmed" && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs tracking-widest uppercase border-none rounded-none h-9" disabled={sending === enq.id} onClick={() => confirmDelivery(enq.id)}>
                    <Check className="w-3 h-3 mr-1" /> {sending === enq.id ? "Sending…" : "Confirm Delivery"}
                  </Button>
                )}
                {["quote_sent", "awaiting_deposit", "confirmed"].map(s => (
                  <Button key={s} size="sm" variant="outline" className="text-xs tracking-widest uppercase rounded-none h-9" onClick={() => apiFetch(`/admin/enquiries/${enq.id}`, token, { method: "PATCH", body: JSON.stringify({ status: s }) }).then(load)}>
                    → {s.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Textarea value={replyMsg[enq.id] ?? ""} onChange={e => setReplyMsg(r => ({ ...r, [enq.id]: e.target.value }))} placeholder="Type a reply email…" className="min-h-[80px] text-sm rounded-none resize-none border-slate-200" />
                <Button size="sm" className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none self-end h-9 px-4 shrink-0" disabled={!replyMsg[enq.id] || sending === enq.id} onClick={() => sendReply(enq.id)}>
                  <Reply className="w-3 h-3 mr-1" /> Send
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Calendar Tab ──────────────────────────────────────────────────────────────
function CalendarTab({ token }: { token: string }) {
  const [data, setData] = useState<{ blocked: any[]; booked: any[] }>({ blocked: [], booked: [] });
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const load = useCallback(() => apiFetch("/admin/calendar", token).then(setData), [token]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif text-slate-900 mb-4">Block a Date</h2>
        <div className="flex gap-3">
          <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-10 rounded-none border-slate-200 max-w-[200px]" />
          <Input placeholder="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)} className="h-10 rounded-none border-slate-200 max-w-[250px]" />
          <Button className="h-10 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none text-xs tracking-widest uppercase px-6" onClick={() => apiFetch("/admin/calendar/block", token, { method: "POST", body: JSON.stringify({ date: newDate, reason }) }).then(load).then(() => { setNewDate(""); setReason(""); })}>Block</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-3">Blocked Dates ({data.blocked.length})</h3>
          <div className="space-y-2">
            {data.blocked.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between bg-white border border-slate-100 px-4 py-2.5 text-sm">
                <span className="text-slate-800 font-medium">{b.date}</span>
                <div className="flex items-center gap-3">
                  {b.reason && <span className="text-slate-500 text-xs">{b.reason}</span>}
                  <button onClick={() => apiFetch(`/admin/calendar/block/${b.date}`, token, { method: "DELETE" }).then(load)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {!data.blocked.length && <p className="text-slate-400 text-sm">No blocked dates</p>}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-3">Booked Dates ({data.booked.length})</h3>
          <div className="space-y-2">
            {data.booked.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between bg-white border border-emerald-100 px-4 py-2.5 text-sm">
                <div><span className="text-slate-800 font-medium">{b.date}</span>{b.clientName && <span className="text-slate-500 ml-2 text-xs">— {b.clientName}</span>}</div>
                <button onClick={() => apiFetch(`/admin/calendar/booked/${b.date}`, token, { method: "DELETE" }).then(load)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {!data.booked.length && <p className="text-slate-400 text-sm">No booked dates</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reviews Tab ───────────────────────────────────────────────────────────────
function ReviewsTab({ token }: { token: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState({ customerName: "", eventType: "Birthday", quote: "", rating: 5, location: "" });
  const load = useCallback(() => apiFetch("/admin/reviews", token).then(setReviews), [token]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-100 p-6">
        <h2 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-4">Add Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <Input placeholder="Customer Name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="h-10 rounded-none border-slate-200" />
          <Input placeholder="Event Type (e.g. Birthday)" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))} className="h-10 rounded-none border-slate-200" />
          <Input placeholder="Location (optional)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="h-10 rounded-none border-slate-200" />
          <Input type="number" min={1} max={5} placeholder="Rating (1-5)" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} className="h-10 rounded-none border-slate-200" />
        </div>
        <Textarea placeholder="Quote" value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} className="min-h-[80px] rounded-none border-slate-200 mb-3 resize-none" />
        <Button className="h-9 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none text-xs tracking-widest uppercase px-6" onClick={() => apiFetch("/admin/reviews", token, { method: "POST", body: JSON.stringify(form) }).then(load).then(() => setForm({ customerName: "", eventType: "Birthday", quote: "", rating: 5, location: "" }))}>Add Review</Button>
      </div>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-white border border-slate-100 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex gap-0.5 mb-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-[#D9C5B2] fill-current" />)}</div>
              <p className="text-slate-700 italic text-sm mb-1">"{r.quote}"</p>
              <p className="text-xs text-slate-500">{r.customerName} · {r.eventType}{r.location && ` · ${r.location}`}</p>
            </div>
            <button onClick={() => apiFetch(`/admin/reviews/${r.id}`, token, { method: "DELETE" }).then(load)} className="text-red-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAQ Tab ───────────────────────────────────────────────────────────────────
function FaqTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState(""); const [a, setA] = useState("");
  const load = useCallback(() => apiFetch("/admin/faq", token).then(setItems), [token]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 p-6">
        <h2 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-4">Add FAQ Item</h2>
        <Input placeholder="Question" value={q} onChange={e => setQ(e.target.value)} className="h-10 rounded-none border-slate-200 mb-3" />
        <Textarea placeholder="Answer" value={a} onChange={e => setA(e.target.value)} className="min-h-[80px] rounded-none border-slate-200 mb-3 resize-none" />
        <Button className="h-9 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none text-xs tracking-widest uppercase px-6" onClick={() => apiFetch("/admin/faq", token, { method: "POST", body: JSON.stringify({ question: q, answer: a, sortOrder: items.length }) }).then(load).then(() => { setQ(""); setA(""); })}>Add</Button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-slate-100 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm mb-1">{item.question}</p>
              <p className="text-slate-500 text-sm">{item.answer}</p>
            </div>
            <button onClick={() => apiFetch(`/admin/faq/${item.id}`, token, { method: "DELETE" }).then(load)} className="text-red-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>
          </div>
        ))}
        {!items.length && <p className="text-slate-400 text-sm">No FAQ items added. The FAQ page uses static content until you add items here.</p>}
      </div>
    </div>
  );
}

// ── Gallery Tab ───────────────────────────────────────────────────────────────
function GalleryTab({ token }: { token: string }) {
  const [images, setImages] = useState<any[]>([]);
  const [src, setSrc] = useState(""); const [alt, setAlt] = useState(""); const [cat, setCat] = useState("All");
  const load = useCallback(() => apiFetch("/admin/gallery", token).then(setImages), [token]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 p-6">
        <h2 className="text-sm font-bold tracking-widest uppercase text-slate-700 mb-4">Add Gallery Image (URL)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Input placeholder="Image URL (https://...)" value={src} onChange={e => setSrc(e.target.value)} className="h-10 rounded-none border-slate-200 md:col-span-2" />
          <select value={cat} onChange={e => setCat(e.target.value)} className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-slate-700">
            {["All", "Birthdays", "Indoor", "Outdoor", "Neutral themes"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Input placeholder="Alt text / description" value={alt} onChange={e => setAlt(e.target.value)} className="h-10 rounded-none border-slate-200 mb-3" />
        <Button className="h-9 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none text-xs tracking-widest uppercase px-6" onClick={() => apiFetch("/admin/gallery", token, { method: "POST", body: JSON.stringify({ src, alt, category: cat, sortOrder: images.length }) }).then(load).then(() => { setSrc(""); setAlt(""); })}>Add Image</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group">
            <img src={img.src} alt={img.alt} className="w-full h-32 object-cover border border-slate-100" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => apiFetch(`/admin/gallery/${img.id}`, token, { method: "DELETE" }).then(load)} className="text-white bg-red-500/80 p-1.5 rounded"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">{img.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Marketing Tab ─────────────────────────────────────────────────────────────
function MarketingTab({ token }: { token: string }) {
  const [subject, setSubject] = useState(""); const [body, setBody] = useState(""); const [result, setResult] = useState<string | null>(null); const [sending, setSending] = useState(false);

  async function send() {
    setSending(true); setResult(null);
    try {
      const data = await apiFetch("/admin/marketing/send", token, { method: "POST", body: JSON.stringify({ subject, htmlContent: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1e293b;"><div style="background:#B5C2B7;padding:24px 32px;"><h2 style="color:white;margin:0;letter-spacing:2px;">BT PLAY</h2></div><div style="padding:32px;background:white;border:1px solid #e2e8f0;border-top:none;">${body.replace(/\n/g, "<br>")}<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"><p style="font-size:12px;color:#94a3b8;">BT Play · Hertfordshire · hello@btplay.co.uk</p></div></div>` }) });
      setResult(`✓ Sent to ${data.sent} contacts`);
    } catch { setResult("✗ Failed to send — check API keys"); }
    setSending(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Marketing emails</strong> are sent via Brevo to everyone who has submitted an enquiry, contact form, or newsletter signup.
      </div>
      <div className="bg-white border border-slate-100 p-6 space-y-4">
        <Input placeholder="Email subject" value={subject} onChange={e => setSubject(e.target.value)} className="h-10 rounded-none border-slate-200" />
        <Textarea placeholder="Email body (plain text — will be styled automatically)…" value={body} onChange={e => setBody(e.target.value)} className="min-h-[200px] rounded-none border-slate-200 resize-none" />
        <Button className="h-10 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none rounded-none text-xs tracking-widest uppercase px-8" disabled={sending || !subject || !body} onClick={send}>
          <Send className="w-3 h-3 mr-2" /> {sending ? "Sending…" : "Send to All Contacts"}
        </Button>
        {result && <p className={`text-sm font-medium ${result.startsWith("✓") ? "text-emerald-600" : "text-red-500"}`}>{result}</p>}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "enquiries", label: "Enquiries", icon: FileText },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "marketing", label: "Marketing", icon: Send },
];

export default function Admin() {
  const { token, save, clear } = useAdminToken();
  const [tab, setTab] = useState("enquiries");
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (!token) { setValidating(false); return; }
    fetch(`${API}/admin/enquiries`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) { clear(); } })
      .catch(() => clear())
      .finally(() => setValidating(false));
  }, []);

  if (validating) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#B5C2B7] border-t-transparent rounded-full animate-spin" /></div>;
  if (!token) return <LoginPage onLogin={save} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.3rem" }} className="text-slate-800">BT Play Admin</span>
          <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-700 text-xs tracking-widest uppercase" onClick={() => { apiFetch("/admin/logout", token, { method: "POST" }).catch(() => {}); clear(); }}>
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t.id ? "border-[#B5C2B7] text-[#B5C2B7]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === "enquiries" && <EnquiriesTab token={token} />}
          {tab === "calendar" && <CalendarTab token={token} />}
          {tab === "reviews" && <ReviewsTab token={token} />}
          {tab === "faq" && <FaqTab token={token} />}
          {tab === "gallery" && <GalleryTab token={token} />}
          {tab === "marketing" && <MarketingTab token={token} />}
        </motion.div>
      </div>
    </div>
  );
}
