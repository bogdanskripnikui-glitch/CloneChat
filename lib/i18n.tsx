"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react"

export type Locale = "en" | "ru"

const STORAGE_KEY = "voxform.locale"
const LANGUAGE_EVENT = "voxform-language-change"

const ru: Record<string, string> = {
  "Skip to content": "Перейти к содержимому",
  "Primary navigation": "Основная навигация",
  "Voxform home": "Главная Voxform",
  Language: "Язык",
  English: "Английский",
  "Your voice": "Ваш голос",
  "Train your voice": "Обучить голос",
  "AI clone": "AI-клон",
  "Writing modes": "Режимы текста",
  Pricing: "Тарифы",
  "Get in touch": "Связаться",
  "Get started": "Начать",
  "Start with my voice": "Начать с моего голоса",
  "See how it works": "Как это работает",
  "No account needed for your first analysis.":
    "Для первого анализа аккаунт не нужен.",
  "AI clone with your words, rhythm, and voice.":
    "AI-клон с вашими словами, ритмом и голосом.",
  "AI clone with your words.": "AI-клон с вашими словами.",
  "AI clone with your": "AI-клон с вашими",
  "words.": "словами.",
  "rhythm.": "ритмом.",
  "voice.": "голосом.",
  "Add your writing once. Create messages, posts, and articles that still sound unmistakably like you.":
    "Добавьте свои тексты один раз. Создавайте сообщения, посты и статьи, которые звучат именно как вы.",
  "Give it something unmistakably yours.": "Дайте ему что-то безошибочно ваше.",
  "Add a few paragraphs, a file, or existing writing. Voxform learns your rhythm, vocabulary, and level of directness before creating a single draft.":
    "Добавьте несколько абзацев, файл или готовый текст. Voxform изучит ваш ритм, словарь и манеру общения.",
  "Teach AI how you write": "Научите AI писать как вы",
  "Start with a few paragraphs. You can refine your voice later.":
    "Начните с нескольких абзацев. Позже голос можно уточнить.",
  "Choose a writing source": "Выберите источник",
  "Paste text": "Вставить текст",
  Voice: "Голос",
  "Upload file": "Загрузить файл",
  "Other sources": "Другие источники",
  "Your writing samples": "Примеры ваших текстов",
  "Use text you wrote yourself. More variety produces a better voice profile.":
    "Используйте собственные тексты. Разнообразие улучшает профиль голоса.",
  "Your text stays private and can be deleted anytime.":
    "Ваш текст остаётся приватным, его можно удалить в любой момент.",
  "Analyze my voice": "Проанализировать голос",
  "Add a voice sample": "Добавьте образец голоса",
  "Record voice": "Записать голос",
  "Stop recording": "Остановить запись",
  "Upload audio": "Загрузить аудио",
  "Your waveform will react to your voice.":
    "Дорожка будет реагировать на громкость вашего голоса.",
  "Voice waveform": "Волновая форма голоса",
  "Live voice waveform": "Активная волновая форма голоса",
  "Live audio playback waveform":
    "Активная волновая форма воспроизводимого аудио",
  "Record or upload MP3, WAV, M4A, WebM, or OGG. Clear recordings produce a more accurate voice clone.":
    "Запишите голос или загрузите MP3, WAV, M4A, WebM или OGG. Чистая запись даст более точный клон.",
  "Upload TXT or Markdown files of any length.":
    "Загрузите TXT или Markdown любой длины.",
  "Writing samples and voice messages move through voice analysis into a reusable voice profile, which creates messages, chatbot conversations, emails, and replies.":
    "Тексты и голосовые сообщения проходят анализ и создают многоразовый профиль голоса для сообщений, чат-бота, писем и ответов.",
  "Your writing": "Ваши тексты",
  "Samples & files": "Примеры и файлы",
  "Voice message": "Голосовое сообщение",
  "Upload & clone": "Загрузить и клонировать",
  "Voice analysis": "Анализ голоса",
  "Tone & rhythm": "Тон и ритм",
  "Voice profile": "Профиль голоса",
  "Reusable baseline": "Готовый профиль",
  Messages: "Сообщения",
  Chatbot: "Чат-бот",
  Emails: "Письма",
  Replies: "Ответы",
  "One voice, adapted to every format": "Один голос для любого формата",
  "Source link or handle": "Ссылка или профиль",
  "Use sample import": "Импортировать пример",
  "Public writing URL": "Публичная ссылка на текст",
  "Telegram chats": "Чаты Telegram",
  "Docs and workspaces": "Документы и рабочие пространства",
  "Finding patterns in your voice…": "Ищем особенности вашего голоса…",
  "Finding patterns in your writing…": "Ищем особенности вашего текста…",
  "Voice profile ready": "Профиль голоса готов",
  "Your voice profile is ready": "Ваш профиль голоса готов",
  "Name your voice": "Назовите голос",
  "Voice name": "Название голоса",
  "Add to library": "Добавить в библиотеку",
  Back: "Назад",
  "Try it now": "Попробовать",
  "Talk to Your AI clone": "Общайтесь со своим AI-клоном",
  "AI that sounds like you": "AI, который звучит как вы",
  "It keeps your vocabulary, pacing, and intent — then adapts to the moment and the person you’re talking to.":
    "Он сохраняет ваш словарь, темп и намерение, а затем адаптируется к ситуации и собеседнику.",
  "Your AI clone": "Ваш AI-клон",
  "Voice not added": "Голос не добавлен",
  "I’ve learned the rhythm of your writing. What would you like to work on?":
    "Я изучил ритм ваших текстов. Над чем поработаем?",
  "Make this update feel clear, warm, and direct.":
    "Сделай это сообщение ясным, тёплым и прямым.",
  "Absolutely. I’ll keep it concise, human, and close to how you naturally write.":
    "Конечно. Сделаю кратко, живо и близко к вашей естественной манере.",
  "Write to your clone…": "Напишите своему клону…",
  "Message your AI clone": "Сообщение AI-клону",
  "Attach files": "Прикрепить файлы",
  "Choose emoji": "Выбрать эмодзи",
  "Send message": "Отправить сообщение",
  "Enter to send · Shift + Enter for a new line":
    "Enter — отправить · Shift + Enter — новая строка",
  Writing: "Пишу",
  "One voice, shaped for the moment.": "Один голос для любой ситуации.",
  "Change the context without losing the person behind the words.":
    "Меняйте контекст, сохраняя человека за словами.",
  "Adaptive modes": "Адаптивные режимы",
  "Rewrite without losing your baseline voice.":
    "Переписывайте, сохраняя свой голос.",
  Before: "До",
  "In your voice": "Вашим голосом",
  Post: "Пост",
  Message: "Сообщение",
  Email: "Письмо",
  Article: "Статья",
  Reply: "Ответ",
  "Your rhythm stays intact": "Ваш ритм сохраняется",
  "Paste text, files, or docs": "Текст, файлы или документы",
  "We are excited to announce the launch of our new platform that helps teams improve productivity and streamline workflows across departments.":
    "Мы рады объявить о запуске новой платформы, которая помогает командам работать продуктивнее и упрощает процессы.",
  "We are excited to announce the launch of our new platform that helps teams improve productivity and streamline workflows across departments. The point lands faster, the tone stays composed, and the message still sounds recognisably like you.":
    "Мы запускаем новую платформу, которая помогает командам работать продуктивнее и упрощает процессы. Суть звучит быстрее, тон остаётся спокойным, а текст — узнаваемо вашим.",
  "Start free. Upgrade anytime.": "Начните бесплатно. Обновитесь позже.",
  "Start free.": "Начните бесплатно.",
  "Upgrade anytime.": "Обновитесь позже.",
  "Billing cycle": "Период оплаты",
  "The free tier proves the voice fit. Paid plans unlock Telegram imports, more modes, unlimited drafts, and collaborative review.":
    "Бесплатный тариф покажет точность голоса. Платные планы откроют импорт Telegram, дополнительные режимы и совместную работу.",
  Monthly: "Ежемесячно",
  Yearly: "Ежегодно",
  Free: "Бесплатно",
  Pro: "Про",
  Teams: "Команды",
  "for first analysis": "за первый анализ",
  "per month": "в месяц",
  "per workspace": "за рабочее пространство",
  "Start free": "Начать бесплатно",
  "Join Pro waitlist": "В лист ожидания Pro",
  "Request access": "Запросить доступ",
  "Try the core workflow without an account.":
    "Попробуйте основной сценарий без аккаунта.",
  "1 voice profile": "1 профиль голоса",
  "5 generations per week": "5 генераций в неделю",
  "Paste text and file upload": "Вставка текста и загрузка файлов",
  "Most wanted": "Популярный",
  "For creators and operators who need daily output.":
    "Для авторов и специалистов, которым тексты нужны каждый день.",
  "Unlimited generations": "Безлимитные генерации",
  "Telegram chat imports": "Импорт чатов Telegram",
  "Separate business and casual modes": "Деловой и разговорный режимы",
  "For teams that want shared voice systems and review flow.":
    "Для команд с общими профилями голоса и согласованием текстов.",
  "Shared style libraries": "Общие библиотеки стиля",
  "Approval-ready draft pipeline": "Согласование черновиков",
  "Priority onboarding": "Приоритетное подключение",
  "Build a writing system that sounds like you.":
    "Создайте систему текстов, которая звучит как вы.",
  "Get early access": "Получить ранний доступ",
  "Join the early group for voice profiles, Telegram imports, and assisted replies.":
    "Присоединяйтесь к ранней группе с профилями голоса, импортом Telegram и умными ответами.",
  "Work email": "Рабочая почта",
  "Join early access": "Получить ранний доступ",
  "We’ll only use it to send access updates.":
    "Мы используем почту только для новостей о доступе.",
  "Back to first screen": "Вернуться к первому экрану",
  "Dashboard preview": "Предпросмотр панели",
  Dashboard: "Главная",
  Billing: "Оплата",
  Settings: "Настройки",
  "No password yet": "Пока без пароля",
  Menu: "Меню",
  Logout: "Выйти",
  "Log out": "Выйти",
  Voices: "Голоса",
  Workspace: "Рабочая область",
  "Your writing voice library": "Библиотека ваших голосов",
  "Founder voice": "Голос основателя",
  "Operator voice": "Рабочий голос",
  "Direct, calm, product-facing": "Прямой, спокойный, продуктовый",
  "Structured, low-friction, internal clarity":
    "Структурный, простой, для внутренней работы",
  "Voice profiles": "Профили голоса",
  "Add another": "Добавить ещё",
  "Draft text in your own rhythm": "Создавайте текст в своём ритме",
  "Source text": "Исходный текст",
  "Left source. Right launch output. Long text scrolls inside the panel.":
    "Слева исходник, справа результат. Длинный текст прокручивается внутри блока.",
  Launch: "Публикация",
  "Ready result": "Готовый результат",
  Copy: "Копировать",
  Save: "Сохранить",
  "Launch post": "Пост о запуске",
  "A cleaner way to scale your writing without losing your voice":
    "Простой способ масштабировать тексты, не теряя свой голос",
  "Most AI writing tools flatten people into the same tone. Founder voice keeps the opposite promise. We are launching the next version of Voxform. It should sound clear, human, and useful. The message needs to work for a product update, an email, and a short direct message without losing the person behind the writing. The point lands faster, the tone stays composed, and the message keeps its human cadence.":
    "Большинство AI-инструментов делают всех одинаковыми. Голос основателя сохраняет индивидуальность. Мы запускаем новую версию Voxform — ясную, живую и полезную для поста, письма или короткого сообщения. Суть звучит быстрее, а человеческий ритм остаётся.",
  "Refine my samples": "Уточнить примеры",
  "Unlock more outputs": "Открыть больше форматов",
  "AI chat": "AI-чат",
  "Talk in any voice.": "Общайтесь любым голосом.",
  "Choose a saved voice and continue a live conversation with its rhythm, vocabulary, and intent.":
    "Выберите сохранённый голос и продолжите разговор с его ритмом, словарём и интонацией.",
  "Choose a voice": "Выберите голос",
  "Add voice": "Добавить голос",
  "Your voice library is empty.": "Библиотека голосов пуста.",
  "Online · ready to talk": "Онлайн · готов к разговору",
  Online: "Онлайн",
  "Choose File": "Выбрать файл",
  "Message AI clone": "Сообщение AI-клону",
  "The voice model did not return a reply.": "Модель голоса не ответила.",
  "The voice model is unavailable.": "Модель голоса недоступна.",
  "Writing…": "Пишу…",
  "Add a voice to enable playback": "Добавьте голос для озвучивания",
  "Generating speech": "Создаём озвучку",
  "Stop playback": "Остановить воспроизведение",
  "Text to rewrite": "Текст для переписывания",
  "Output format": "Формат результата",
  "Voice ready": "Голос готов",
  "Start free. Upgrade when the voice becomes mission-critical.":
    "Начните бесплатно. Обновитесь, когда голос станет важен для работы.",
  "Prepare account controls.": "Настройте параметры аккаунта.",
  "Voxform preview": "Предпросмотр Voxform",
  "Login layer later": "Вход появится позже",
  "Google auth coming soon": "Вход через Google скоро появится",
  "Login, theme, and team controls will live here.":
    "Здесь появятся вход, тема и управление командой.",
}

const LanguageContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
}>({ locale: "en", setLocale: () => undefined })

function translateDynamic(text: string): string {
  const exact = ru[text]
  if (exact) return exact
  const ready = text.match(/^(.+) · ready$/)
  if (ready) return `${ready[1]} · готов`
  const characters = text.match(/^(\d[\d\s,.]*) characters$/)
  if (characters) return `${characters[1]} символов`
  const recorded = text.match(/^Recorded (.+)$/)
  if (recorded) return `Записано ${recorded[1]}`
  const useVoice = text.match(/^Use (.+)$/)
  if (useVoice) return `Использовать ${translateDynamic(useVoice[1])}`
  const moreActions = text.match(/^More actions for (.+)$/)
  if (moreActions) return `Действия для «${translateDynamic(moreActions[1])}»`
  const freeChars = text.match(/^Free: (.+)$/)
  if (freeChars) return `Бесплатно: ${freeChars[1]}`
  const drafted = text.match(/^Drafted in (.+)$/)
  if (drafted) return `Создано голосом «${translateDynamic(drafted[1])}»`
  const saved = text.match(/^(\d+) saved$/)
  if (saved) return `Сохранено: ${saved[1]}`
  return text
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    (onStoreChange) => {
      window.addEventListener(LANGUAGE_EVENT, onStoreChange)
      window.addEventListener("storage", onStoreChange)
      return () => {
        window.removeEventListener(LANGUAGE_EVENT, onStoreChange)
        window.removeEventListener("storage", onStoreChange)
      }
    },
    () => (window.localStorage.getItem(STORAGE_KEY) === "ru" ? "ru" : "en"),
    () => "en"
  )
  const textOriginsRef = useRef(new WeakMap<Text, string>())
  const attributeOriginsRef = useRef(
    new WeakMap<Element, Map<string, string>>()
  )

  useEffect(() => {
    const textOrigins = textOriginsRef.current
    const attributeOrigins = attributeOriginsRef.current

    function translateText(node: Text) {
      const parent = node.parentElement
      if (
        !parent ||
        parent.closest("script, style, code, pre, [translate='no']")
      )
        return
      const raw = node.nodeValue ?? ""
      const trimmed = raw.trim()
      if (!trimmed) return
      if (!textOrigins.has(node)) textOrigins.set(node, trimmed)
      const original = textOrigins.get(node) ?? trimmed
      const translated = locale === "ru" ? translateDynamic(original) : original
      if (trimmed !== translated) {
        const leading = raw.match(/^\s*/)?.[0] ?? ""
        const trailing = raw.match(/\s*$/)?.[0] ?? ""
        node.nodeValue = `${leading}${translated}${trailing}`
      }
    }

    function translateElement(element: Element) {
      if (element.closest("[translate='no']")) return
      for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
        const current = element.getAttribute(attribute)
        if (!current) continue
        let origins = attributeOrigins.get(element)
        if (!origins) {
          origins = new Map()
          attributeOrigins.set(element, origins)
        }
        if (!origins.has(attribute)) origins.set(attribute, current)
        const original = origins.get(attribute) ?? current
        const translated =
          locale === "ru" ? translateDynamic(original) : original
        if (current !== translated) element.setAttribute(attribute, translated)
      }
    }

    function translateTree(root: Node) {
      if (root.nodeType === Node.TEXT_NODE) translateText(root as Text)
      if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element)
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
      )
      let node = walker.nextNode()
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) translateText(node as Text)
        else translateElement(node as Element)
        node = walker.nextNode()
      }
    }

    document.documentElement.lang = locale
    document.title =
      locale === "ru"
        ? "Voxform — Пишите как вы"
        : "Voxform — Write like yourself"
    translateTree(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target)
        mutation.addedNodes.forEach(translateTree)
      }
    })
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale(nextLocale: Locale) {
        window.localStorage.setItem(STORAGE_KEY, nextLocale)
        window.dispatchEvent(new Event(LANGUAGE_EVENT))
      },
    }),
    [locale]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
