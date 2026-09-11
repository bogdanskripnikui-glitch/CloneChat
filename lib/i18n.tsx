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
  "Youmanize home": "Главная Youmanize",
  Language: "Язык",
  English: "Английский",
  "Your voice": "Ваш голос",
  "Train your voice": "Обучить голос",
  "AI clone": "AI-клон",
  "Writing modes": "Режимы текста",
  "iOS app": "iOS",
  "Web app": "Web",
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
  "Add a few paragraphs, a file, or existing writing. Youmanize learns your rhythm, vocabulary, and level of directness before creating a single draft.":
    "Добавьте несколько абзацев, файл или готовый текст. Youmanize изучит ваш ритм, словарь и манеру общения.",
  "Teach AI how you write": "Научите AI писать как вы",
  "Start with a few paragraphs. You can refine your voice later.":
    "Начните с нескольких абзацев. Позже голос можно уточнить.",
  "Choose a writing source": "Выберите источник",
  "Paste text": "Вставить текст",
  Voice: "Голос",
  "Upload file": "Загрузить файл",
  "Other sources": "Другие источники",
  "Message archive": "Архив сообщений",
  "Imported from your messages": "Импортировано из ваших сообщений",
  "Import a public URL, message archive, or document source.":
    "Импортируйте публичную ссылку, архив сообщений или документ.",
  "Load exported messages and learn your conversational rhythm.":
    "Загрузите экспорт сообщений, чтобы изучить ваш ритм общения.",
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
  "Upload a writing sample": "Загрузите образец текста",
  "Remove uploaded file": "Удалить загруженный файл",
  "Audio ready": "Аудио готово",
  "No audio": "Нет аудио",
  "Back to result": "Вернуться к результату",
  "Voice sample hidden": "Запись скрыта",
  "Writing samples hidden": "Примеры текстов скрыты",
  "Open the recording again to review or replace it.":
    "Откройте запись, чтобы прослушать или заменить её.",
  "Open your source text again and the result panel will collapse.":
    "Откройте исходный текст — панель результата свернётся.",
  "Open recording": "Открыть запись",
  "Open samples": "Открыть примеры",
  "Voice analysis progress": "Ход анализа голоса",
  analyzing: "анализируем",
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
  "For now this loads a realistic sample flow for URL, Telegram, or docs-based imports.":
    "Сейчас это запускает демонстрационный импорт из URL, Telegram или документов.",
  "Public writing URL": "Публичная ссылка на текст",
  "Import published posts and keep the same tone in new drafts.":
    "Импортируйте опубликованные посты и сохраняйте их тон в новых черновиках.",
  "Telegram chats": "Чаты Telegram",
  "Load chat exports and learn your real conversational rhythm.":
    "Загрузите экспорт чатов, чтобы изучить ваш естественный ритм общения.",
  "Docs and workspaces": "Документы и рабочие пространства",
  "Bring in notes, docs, and internal writing for deeper voice coverage.":
    "Добавьте заметки, документы и внутренние тексты для более точного профиля.",
  "Imported from your site": "Импортировано с вашего сайта",
  "Imported from Telegram export": "Импортировано из Telegram",
  "Imported from docs": "Импортировано из документов",
  "Finding patterns in your voice…": "Ищем особенности вашего голоса…",
  "Finding patterns in your writing…": "Ищем особенности вашего текста…",
  "Voice profile ready": "Профиль голоса готов",
  "Your voice profile is ready": "Ваш профиль голоса готов",
  "This is how it will appear in your library and drafting workspace.":
    "Так он будет отображаться в библиотеке и редакторе.",
  "We saved the tone, pacing, and delivery from your voice.":
    "Мы сохранили тон, темп и подачу вашего голоса.",
  "We saved the rhythm, tone, and vocabulary from your writing.":
    "Мы сохранили ритм, тон и словарь ваших текстов.",
  "We saved a reusable baseline for every new draft and conversation.":
    "Мы сохранили профиль для каждого нового черновика и диалога.",
  "We couldn’t analyze this recording": "Не удалось проанализировать запись",
  "We need a longer voice sample.": "Нужен более длинный образец голоса.",
  "We couldn’t hear your voice clearly enough.":
    "Не удалось достаточно чётко распознать голос.",
  "Record a longer sample with a few complete sentences.":
    "Запишите несколько полных предложений.",
  "The audio is too quiet or unclear. Move closer to the microphone and reduce background noise.":
    "Запись слишком тихая или неразборчивая. Подойдите ближе к микрофону и уменьшите фоновый шум.",
  "Try another sample": "Попробовать другой образец",
  "Your voice sample stays private and can be deleted anytime.":
    "Запись остаётся приватной, её можно удалить в любой момент.",
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
  "Profile not added": "Профиль не добавлен",
  "Analyze a writing or voice sample first so I can respond in your style.":
    "Сначала проанализируйте текст или голос, чтобы я мог отвечать в вашей манере.",
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
  "Youmanize for iOS": "Youmanize для iOS",
  "Your voice, in your pocket.": "Ваш стиль — всегда под рукой.",
  "Youmanize iOS Profiles screen with voice profile progress and training sources":
    "Экран профилей Youmanize для iOS с прогрессом профиля голоса и источниками обучения",
  "Build a voice profile from the words you already use, then create posts, rewrite drafts, and answer messages in your own style.":
    "Создайте профиль из привычных слов, а затем пишите посты, переписывайте черновики и отвечайте на сообщения в своей манере.",
  "Train from real material": "Обучайте на реальных материалах",
  "Files, notes, answers, and phrase choices.":
    "Файлы, заметки, ответы и выбор фраз.",
  "A separate voice for every role": "Отдельный профиль для каждой роли",
  "Each profile keeps its own chat history and style.":
    "У каждого профиля своя история чата и стиль.",
  "Create in your style": "Создавайте в своей манере",
  "Outline, rewrite, stylize, or answer from one screen.":
    "Планы, рерайт, стилизация и ответы на одном экране.",
  "Youmanize for Web": "Youmanize для Web",
  "One workspace for every version of you.":
    "Одно пространство для каждой вашей роли.",
  "Youmanize Web profile library with Personal, Work, and Public voices":
    "Библиотека профилей Youmanize Web с личным, рабочим и публичным стилями",
  "Manage distinct style profiles, add source material, chat with AI, generate text, and turn a trained voice into audio from one focused workspace.":
    "Управляйте профилями, добавляйте материалы, общайтесь с AI, создавайте тексты и озвучивайте их обученным голосом в одном пространстве.",
  "Profiles and source library": "Профили и библиотека материалов",
  "Keep personal, work, and public voices separate.":
    "Разделяйте личный, рабочий и публичный стиль.",
  "Chat and text generation": "Чат и генерация текстов",
  "Write, adapt, and continue conversations with AI.":
    "Пишите, адаптируйте и продолжайте разговоры с AI.",
  "Voice and integrations": "Голос и интеграции",
  "Clone speech and connect the providers you already use.":
    "Клонируйте речь и подключайте привычные сервисы.",
  "Paste text, files, or docs": "Текст, файлы или документы",
  "We are excited to announce the launch of our new platform that helps teams improve productivity and streamline workflows across departments.":
    "Мы рады объявить о запуске новой платформы, которая помогает командам работать продуктивнее и упрощает процессы.",
  "We are excited to announce the launch of our new platform that helps teams improve productivity and streamline workflows across departments. The point lands faster, the tone stays composed, and the message still sounds recognisably like you.":
    "Мы запускаем новую платформу, которая помогает командам работать продуктивнее и упрощает процессы. Суть звучит быстрее, тон остаётся спокойным, а текст — узнаваемо вашим.",
  "Planned pricing": "Планируемая цена",
  "3-day free trial": "3 дня бесплатно",
  "$4.99 per month": "$4.99 в месяц",
  "$49.99 per year": "$49.99 в год",
  "Download on the": "Загрузите в",
  "Coming soon": "Скоро",
  "Back to first screen": "Вернуться к первому экрану",
  "Dashboard preview": "Предпросмотр панели",
  Dashboard: "Главная",
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
  "Most AI writing tools flatten people into the same tone. Founder voice keeps the opposite promise. We are launching the next version of Youmanize. It should sound clear, human, and useful. The message needs to work for a product update, an email, and a short direct message without losing the person behind the writing. The point lands faster, the tone stays composed, and the message keeps its human cadence.":
    "Большинство AI-инструментов делают всех одинаковыми. Голос основателя сохраняет индивидуальность. Мы запускаем новую версию Youmanize — ясную, живую и полезную для поста, письма или короткого сообщения. Суть звучит быстрее, а человеческий ритм остаётся.",
  "Refine my samples": "Уточнить примеры",
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
  "Voice service authorization failed. Reconnect ElevenLabs and try again.":
    "Не удалось подключиться к ElevenLabs. Обновите ключ и попробуйте снова.",
  "Writing…": "Пишу…",
  "Add a voice to enable playback": "Добавьте голос для озвучивания",
  "Add a voice to enable download": "Добавьте голос для скачивания",
  "Generating speech": "Создаём озвучку",
  "Generating audio file": "Создаём аудиофайл",
  "Stop playback": "Остановить воспроизведение",
  "Text to rewrite": "Текст для переписывания",
  "Output format": "Формат результата",
  "Voice ready": "Голос готов",
  "Prepare account controls.": "Настройте параметры аккаунта.",
  "Youmanize preview": "Предпросмотр Youmanize",
  "Privacy Policy": "Политика конфиденциальности",
  "Terms of Use": "Условия использования",
  Support: "Поддержка",
  "Data deletion": "Удаление данных",
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
  const playWith = text.match(/^Play with (.+)$/)
  if (playWith) return `Воспроизвести голосом «${playWith[1]}»`
  const downloadWith = text.match(/^Download audio with (.+)$/)
  if (downloadWith) return `Скачать аудио голосом «${downloadWith[1]}»`
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
      let original = textOrigins.get(node) ?? trimmed
      const previousTranslation = translateDynamic(original)
      if (trimmed !== original && trimmed !== previousTranslation) {
        original = trimmed
        textOrigins.set(node, original)
      }
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
        let original = origins.get(attribute) ?? current
        const previousTranslation = translateDynamic(original)
        if (current !== original && current !== previousTranslation) {
          original = current
          origins.set(attribute, original)
        }
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

    const englishOnlyRoute = [
      "/privacy",
      "/terms",
      "/support",
      "/data-deletion",
    ].includes(window.location.pathname)

    document.documentElement.lang = englishOnlyRoute ? "en" : locale
    if (!englishOnlyRoute) {
      document.title =
        locale === "ru"
          ? "Youmanize — Пишите как вы"
          : "Youmanize — Write like yourself"
    }
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
