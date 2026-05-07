"use client"

import { useMemo, useState } from "react"
import {
  Calculator, FileText, WandSparkles, BarChart3, Lightbulb, BookOpen,
  LayoutDashboard, Bell, Sun, Moon, Star, Gem, ChevronDown, ArrowRight,
  Zap, Lock, Sparkles, HelpCircle, Menu, BadgeRussianRuble, Copy, Save,
  Check, Trash2, X
} from "lucide-react"

const COMMISSION = { wb: 0.20, ozon: 0.15 }
const STORAGE_KEY = "markethelper_saved_calculations"

export default function Home() {
  const [platform, setPlatform] = useState("wb")
  const [dark, setDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [credits, setCredits] = useState(23)
  const [copied, setCopied] = useState("")
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    price: "2990",
    cost: "1200",
    logistics: "250",
    extra: "100"
  })

  const [generator, setGenerator] = useState({
    product: "Женская сумка через плечо",
    advantages: "лёгкая, вместительная, стильная, подходит на каждый день",
    tone: "selling"
  })

  const [generatedDescription, setGeneratedDescription] = useState("")
  const [generatedTitle, setGeneratedTitle] = useState("")

  const numbers = useMemo(() => {
    const price = cleanNumber(form.price)
    const cost = cleanNumber(form.cost)
    const logistics = cleanNumber(form.logistics)
    const extra = cleanNumber(form.extra)
    const commission = price * COMMISSION[platform]
    const profit = price - cost - logistics - extra - commission

    return {
      price,
      cost,
      logistics,
      extra,
      commission,
      profit,
      margin: price > 0 ? (profit / price) * 100 : 0,
      roi: cost > 0 ? (profit / cost) * 100 : 0,
      payout: price - commission - logistics
    }
  }, [form, platform])

  const advice = useMemo(() => {
    if (numbers.price <= 0) return "Введите цену продажи, чтобы получить рекомендацию."
    if (numbers.profit <= 0) return "Товар уходит в минус. Попробуйте повысить цену, снизить закупку или пересчитать логистику."
    if (numbers.margin < 20) return "Маржа низкая. Проверьте комиссию, логистику и возможность поднять цену на 5–10%."
    if (numbers.margin < 40) return "Маржа хорошая. Товар можно тестировать, но стоит следить за рекламными расходами."
    return "Отличная маржа. Товар выглядит перспективным для масштабирования."
  }, [numbers])

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileMenuOpen(false)
  }

  function spendCredit() {
    setCredits((prev) => Math.max(0, prev - 1))
  }

  function generateDescription() {
    const p = generator.product.trim() || "товар"
    const adv = generator.advantages.trim() || "качество, удобство и стиль"
    const intro =
      generator.tone === "premium"
        ? `Премиальный ${p.toLowerCase()} создан для тех, кто ценит качество, стиль и продуманные детали.`
        : generator.tone === "simple"
        ? `${p} — удобный товар для ежедневного использования.`
        : `${p} — отличный выбор для тех, кто хочет получить стильный, удобный и практичный товар на каждый день.`

    setGeneratedDescription(`${intro}

Преимущества товара: ${adv}.

Описание можно использовать как основу карточки товара для Wildberries и Ozon. Добавьте точные характеристики, размеры, материалы и ключевые слова.`)
    spendCredit()
  }

  function generateTitle() {
    const p = generator.product.trim() || "Товар"
    setGeneratedTitle(`${p} универсальный стильный для Wildberries и Ozon`)
    spendCredit()
  }

  async function copyText(text, key) {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 1400)
  }

  function saveCalculation() {
    const item = {
      id: Date.now(),
      date: new Date().toLocaleString("ru-RU"),
      platform,
      form,
      result: numbers
    }

    const old = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...old].slice(0, 10)))
    setSaved(true)
  }

  function clearCalculation() {
    setForm({ price: "", cost: "", logistics: "", extra: "" })
    setSaved(false)
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <MobileTopBar
          dark={dark}
          credits={credits}
          onMenu={() => setMobileMenuOpen(true)}
          onTheme={() => setDark(!dark)}
          onCredits={() => setCredits(50)}
        />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Закрыть меню"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/50"
            />
            <div className="absolute left-0 top-0 h-full w-[86vw] max-w-[330px] bg-white dark:bg-slate-900 shadow-2xl">
              <Sidebar
                mobile
                onClose={() => setMobileMenuOpen(false)}
                scrollTo={scrollTo}
              />
            </div>
          </div>
        )}

        <aside className="hidden lg:block fixed left-0 top-0 h-screen w-[300px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10">
          <Sidebar scrollTo={scrollTo} />
        </aside>

        <main id="home" className="min-h-screen lg:ml-[300px] px-4 sm:px-6 lg:px-8 xl:px-10 py-5 lg:py-6 max-w-[1540px]">
          <DesktopTopBar
            dark={dark}
            credits={credits}
            onTheme={() => setDark(!dark)}
            onCredits={() => setCredits(50)}
          />

          <section className="mb-7 sm:mb-8 pt-3 lg:pt-0">
            <h1 className="text-[30px] sm:text-4xl xl:text-[42px] leading-[1.08] font-black tracking-tight mb-3 text-slate-950 dark:text-white">
              Добро пожаловать в MarketHelper 👋
            </h1>
            <p className="text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">
              AI-инструменты для продавцов на маркетплейсах: считайте прибыль, создавайте описания и быстрее запускайте товары.
            </p>
          </section>

          <section className="mb-7 sm:mb-8">
            <SectionTitle>Быстрые действия</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
              <ActionCard icon={Calculator} title="Рассчитать прибыль" text="Узнайте итоговую прибыль с учётом комиссии, логистики и дополнительных расходов." color="from-violet-500 to-indigo-500" onClick={() => scrollTo("calculator")} />
              <ActionCard icon={FileText} title="Сгенерировать описание" text="Создайте понятное описание товара для карточки на Wildberries или Ozon." color="from-emerald-400 to-teal-500" onClick={() => scrollTo("generator")} />
              <ActionCard icon={Zap} title="Сгенерировать заголовок" text="Получите короткий продающий заголовок, который можно использовать как основу." color="from-amber-400 to-orange-500" onClick={() => scrollTo("generator")} />
            </div>
          </section>

          <section className="grid grid-cols-1 2xl:grid-cols-[0.9fr_1.35fr] gap-5 sm:gap-6 mb-7 sm:mb-8">
            <div id="calculator" className="card scroll-mt-24 lg:scroll-mt-8">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <h2 className="card-title">Калькулятор прибыли</h2>
                <HelpCircle size={17} className="text-slate-400" />
              </div>

              <div className="space-y-5">
                <div>
                  <label className="label">Платформа</label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                    <PlatformButton active={platform === "wb"} onClick={() => setPlatform("wb")} code="WB" label="Wildberries" />
                    <PlatformButton active={platform === "ozon"} onClick={() => setPlatform("ozon")} code="OZ" label="Ozon" blue />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4">
                  <Field label="Цена продажи" value={form.price} onChange={(v) => updateField("price", v)} />
                  <Field label="Себестоимость товара" value={form.cost} onChange={(v) => updateField("cost", v)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4">
                  <Field label="Логистика до склада" value={form.logistics} onChange={(v) => updateField("logistics", v)} />
                  <Field label="Доп. расходы" value={form.extra} onChange={(v) => updateField("extra", v)} />
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <button onClick={() => scrollTo("results")} className="btn-primary min-h-[52px]">
                    Рассчитать прибыль
                    <Sparkles size={18} />
                  </button>
                  <button onClick={clearCalculation} className="secondary-icon-btn">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="text-xs leading-5 text-slate-500 dark:text-slate-400 flex items-start justify-center gap-2 pt-1">
                  <Lock size={14} className="text-violet-600 shrink-0 mt-0.5" />
                  <span>Расчёты сохраняются только после нажатия кнопки “Сохранить”.</span>
                </div>
              </div>
            </div>

            <div id="results" className="card scroll-mt-24 lg:scroll-mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                <h2 className="card-title">Результаты расчёта</h2>
                <button onClick={saveCalculation} className="btn-soft w-full sm:w-auto justify-center">
                  {saved ? <Check size={17} /> : <Save size={17} />}
                  {saved ? "Сохранено" : "Сохранить расчёт"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Metric title="Чистая прибыль" value={`${formatMoney(numbers.profit)} ₽`} badge={numbers.profit > 0 ? "прибыль" : "убыток"} />
                <Metric title="Маржа" value={`${numbers.margin.toFixed(1)}%`} badge={numbers.margin >= 25 ? "хорошая" : "низкая"} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
                <MiniStat title={`Комиссия ${platform === "wb" ? "WB" : "Ozon"}`} value={`${formatMoney(numbers.commission)} ₽`} />
                <MiniStat title="Логистика" value={`${formatMoney(numbers.logistics)} ₽`} />
                <MiniStat title="К перечислению" value={`${formatMoney(numbers.payout)} ₽`} />
                <MiniStat title="ROI" value={`${numbers.roi.toFixed(0)}%`} />
              </div>

              <div className="rounded-2xl border border-amber-200 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-500/10 p-4 sm:p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-2">
                    <Star size={18} fill="currentColor" />
                    AI-рекомендация
                  </div>
                  <button onClick={() => alert(advice)} className="btn-soft-white w-full sm:w-auto justify-center">Подробнее</button>
                </div>
                <div className="text-slate-700 dark:text-slate-200 leading-7">
                  {advice}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-6">
                <Lightbulb size={18} className="text-amber-500 shrink-0 mt-1" />
                <span><b>Совет:</b> Добавьте больше характеристик в описание товара, чтобы повысить конверсию.</span>
              </div>
            </div>
          </section>

          <section id="generator" className="grid grid-cols-1 2xl:grid-cols-2 gap-5 sm:gap-6 mb-7 sm:mb-8 scroll-mt-24 lg:scroll-mt-8">
            <div className="card">
              <h2 className="card-title mb-5">AI-генератор карточки товара</h2>

              <div className="space-y-5">
                <TextInput label="Название товара" value={generator.product} onChange={(v) => setGenerator({ ...generator, product: v })} />

                <div>
                  <label className="label">Преимущества</label>
                  <textarea value={generator.advantages} onChange={(e) => setGenerator({ ...generator, advantages: e.target.value })} className="input min-h-[120px] resize-y leading-7" />
                </div>

                <div>
                  <label className="label">Стиль текста</label>
                  <select value={generator.tone} onChange={(e) => setGenerator({ ...generator, tone: e.target.value })} className="input">
                    <option value="selling">Продающий</option>
                    <option value="premium">Премиальный</option>
                    <option value="simple">Простой</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={generateDescription} className="btn-primary min-h-[52px]">
                    Описание
                    <WandSparkles size={18} />
                  </button>
                  <button onClick={generateTitle} className="btn-outline min-h-[52px]">
                    Заголовок
                    <Zap size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title mb-5">Результат генерации</h2>
              <div className="space-y-4">
                <OutputBlock title="Описание" text={generatedDescription || "Нажмите “Описание”, чтобы сгенерировать текст."} onCopy={() => copyText(generatedDescription, "description")} copied={copied === "description"} disabled={!generatedDescription} />
                <OutputBlock title="Заголовок" text={generatedTitle || "Нажмите “Заголовок”, чтобы сгенерировать название."} onCopy={() => copyText(generatedTitle, "title")} copied={copied === "title"} disabled={!generatedTitle} />
              </div>
            </div>
          </section>

          <section id="articles" className="scroll-mt-24 lg:scroll-mt-8 pb-8">
            <SectionTitle>Будущие статьи для трафика</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
              <Article title="Как рассчитать прибыль на Wildberries" />
              <Article title="Как написать описание товара для Ozon" color="emerald" />
              <Article title="Ошибки новичков на маркетплейсах" color="amber" />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ scrollTo, mobile = false, onClose }) {
  return (
    <div className="h-full px-5 py-6 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center justify-between gap-3 px-2 mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-200 dark:shadow-none" />
            <div className="min-w-0">
              <div className="text-2xl font-black tracking-tight leading-tight">MarketHelper</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">AI tools for sellers</div>
            </div>
          </div>

          {mobile && (
            <button onClick={onClose} className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10">
              <X size={22} />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          <button onClick={() => scrollTo("home")} className="nav-active">
            <LayoutDashboard size={21} />
            <span>Главная</span>
          </button>

          <SidebarTitle>Инструменты</SidebarTitle>
          <MenuItem icon={Calculator} label="Калькулятор прибыли" onClick={() => scrollTo("calculator")} />
          <MenuItem icon={WandSparkles} label="AI Генератор описаний" onClick={() => scrollTo("generator")} />
          <MenuItem icon={Zap} label="AI Генератор заголовков" onClick={() => scrollTo("generator")} />
          <MenuItem icon={BarChart3} label="Аналитика расчёта" onClick={() => scrollTo("results")} />
          <MenuItem icon={Lightbulb} label="Идеи товаров" badge="New" onClick={() => scrollTo("articles")} />

          <SidebarTitle>Полезное</SidebarTitle>
          <MenuItem icon={BookOpen} label="Гайды и статьи" onClick={() => scrollTo("articles")} />
          <MenuItem icon={FileText} label="Шаблоны карточек" onClick={() => scrollTo("generator")} />
        </nav>
      </div>

      <div className="space-y-4 pt-6">
        <div className="rounded-3xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-400/20 p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-violet-600 shadow-sm">
            <Gem size={22} />
          </div>
          <div className="font-bold text-lg mb-2 leading-snug">Расширьте возможности</div>
          <div className="text-sm leading-6 text-slate-600 dark:text-slate-400 mb-5">
            Подключите Pro и получите доступ ко всем AI-функциям.
          </div>
          <button onClick={() => alert("Раздел оплаты будет добавлен позже")} className="btn-primary w-full">
            Перейти на Pro
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold">M</div>
            <div className="min-w-0">
              <div className="font-semibold truncate">Мой аккаунт</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Базовый план</div>
            </div>
          </div>
          <ChevronDown size={18} className="text-slate-500 shrink-0" />
        </div>
      </div>
    </div>
  )
}

function DesktopTopBar({ dark, credits, onTheme, onCredits }) {
  return (
    <header className="hidden lg:flex min-h-16 items-center justify-end gap-4 mb-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-5 py-3 flex items-center gap-4 shadow-sm">
        <Star size={20} className="text-amber-400 shrink-0" />
        <div className="text-sm leading-5 whitespace-nowrap">
          <span className="text-violet-700 dark:text-violet-300 font-semibold">Кредитов AI:</span>
          <span className="font-bold"> {credits} / 50</span>
        </div>
        <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
        <button onClick={onCredits} className="text-sm font-semibold text-violet-700 dark:text-violet-300">Пополнить</button>
      </div>

      <button onClick={onTheme} className="icon-btn">
        {dark ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      <button onClick={() => alert("Новых уведомлений нет")} className="icon-btn relative">
        <Bell size={22} />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-violet-600" />
      </button>
    </header>
  )
}

function MobileTopBar({ dark, credits, onMenu, onTheme, onCredits }) {
  return (
    <header className="sticky top-0 z-40 lg:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between gap-3">
      <button onClick={onMenu} className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
        <Menu size={23} />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <div className="h-9 w-9 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400" />
        <div className="font-black text-lg truncate">MarketHelper</div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onCredits} className="hidden xs:flex h-10 px-3 rounded-2xl bg-violet-50 text-violet-700 font-bold text-xs items-center justify-center">
          {credits}/50
        </button>
        <button onClick={onTheme} className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
          {dark ? <Sun size={21} /> : <Moon size={21} />}
        </button>
      </div>
    </header>
  )
}

function cleanNumber(value) {
  const n = Number(String(value).replace(/\s/g, "").replace(",", "."))
  return Number.isFinite(n) ? n : 0
}

function formatMoney(value) {
  return Math.round(value).toLocaleString("ru-RU")
}

function SidebarTitle({ children }) {
  return <div className="pt-7 pb-2 px-4 text-xs font-bold uppercase tracking-wider text-violet-500">{children}</div>
}

function MenuItem({ icon: Icon, label, badge, onClick }) {
  return (
    <button onClick={onClick} className="nav-item">
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={21} className="text-slate-500 shrink-0" />
        <span className="font-medium truncate">{label}</span>
      </div>
      {badge && <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 shrink-0">{badge}</span>}
    </button>
  )
}

function ActionCard({ icon: Icon, title, text, color, onClick }) {
  return (
    <button onClick={onClick} className="action-card">
      <div className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg`}>
        <Icon size={28} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-bold mb-1 text-slate-900 dark:text-white leading-snug">{title}</div>
        <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</div>
      </div>
      <ArrowRight size={21} className="text-violet-600 shrink-0 hidden sm:block" />
    </button>
  )
}

function PlatformButton({ active, onClick, code, label, blue }) {
  return (
    <button onClick={onClick} className={`rounded-xl border py-3 px-3 font-bold flex items-center justify-center gap-2 text-sm leading-5 ${active ? (blue ? "border-blue-300 bg-blue-50 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300" : "border-violet-300 bg-violet-50 dark:bg-violet-500/15 text-violet-800 dark:text-violet-300") : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}>
      <span className={`h-6 w-6 shrink-0 rounded-lg ${blue ? "bg-blue-600" : "bg-violet-600"} text-white flex items-center justify-center text-xs`}>{code}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input value={value} inputMode="decimal" onChange={(e) => onChange(e.target.value)} className="input pr-9" />
        <BadgeRussianRuble size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  )
}

function Metric({ title, value, badge }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 border bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-400/20 min-w-0">
      <div className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-5">{title}</div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="text-[34px] sm:text-4xl xl:text-[42px] leading-none font-black tracking-tight text-violet-700 dark:text-violet-300 break-words">
          {value}
        </div>
        <div className="rounded-xl px-3 py-1.5 text-sm font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
          {badge}
        </div>
      </div>
    </div>
  )
}

function MiniStat({ title, value }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-3 sm:p-4 min-w-0">
      <div className="text-xs leading-5 text-slate-500 dark:text-slate-400 mb-2 min-h-[20px]">{title}</div>
      <div className="font-extrabold text-base sm:text-lg leading-tight break-words">{value}</div>
    </div>
  )
}

function OutputBlock({ title, text, onCopy, copied, disabled }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="font-bold text-lg leading-snug">{title}</div>
        <button disabled={disabled} onClick={onCopy} className="btn-soft-white disabled:opacity-40 w-full sm:w-auto justify-center">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <div className="whitespace-pre-line text-slate-700 dark:text-slate-200 leading-7 break-words">
        {text}
      </div>
    </div>
  )
}

function Article({ title, color = "violet" }) {
  const colorClass =
    color === "emerald" ? "bg-emerald-100 text-emerald-700" :
    color === "amber" ? "bg-amber-100 text-amber-700" :
    "bg-violet-100 text-violet-700"

  return (
    <button onClick={() => alert("Статья будет добавлена позже")} className="article-card">
      <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${colorClass}`}>
        <FileText size={22} />
      </div>
      <div className="font-extrabold leading-6 flex-1 min-w-0 text-slate-900 dark:text-white">{title}</div>
      <ArrowRight size={22} className="text-violet-600 shrink-0 hidden sm:block" />
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 className="text-xl font-black mb-4 tracking-tight text-slate-950 dark:text-white">{children}</h2>
}
