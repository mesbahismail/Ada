import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import { randomUUID } from 'node:crypto'

// Exercise the browser state modules without requiring a browser or an AI service.
function environment(saved = new Map()) {
  const modules = new Map(), timers = [], errors = [], storageListeners = new Set()
  const downloads = [], blobs = new Map()
  let states = [], cursor = 0, currentPath = '/chat'
  const localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  }
  const react = {
    useState(initial) {
      const index = cursor++
      if (!(index in states)) states[index] = initial
      return [states[index], (value) => { states[index] = typeof value === 'function' ? value(states[index]) : value }]
    },
    useSyncExternalStore(subscribe, getSnapshot) {
      subscribe(() => {})
      return getSnapshot()
    },
  }
  const window = {
    history: {
      replaceState: (_state, _unused, value) => { currentPath = value },
      pushState: (_state, _unused, value) => { currentPath = value },
    },
    setTimeout: (callback) => { timers.push(callback) },
    addEventListener: (_event, callback) => storageListeners.add(callback),
    removeEventListener: (_event, callback) => storageListeners.delete(callback),
  }
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative).exports
    const filename = path.resolve(relative)
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText
    const compiledModule = { exports: {} }
    modules.set(relative, compiledModule)
    const requireModule = (id) => {
      if (id === 'react') return react
      if (id === 'sonner') return { toast: { error: (message) => errors.push(message) } }
      if (id === 'lucide-react') return {}
      if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`)
      throw new Error(`Unexpected dependency: ${id}`)
    }
    vm.runInNewContext(source, { module: compiledModule, exports: compiledModule.exports, require: requireModule,
      window, localStorage, crypto: { randomUUID }, structuredClone, Blob,
      URL: { createObjectURL: (blob) => { const id = randomUUID(); blobs.set(id, blob); return id }, revokeObjectURL: (id) => blobs.delete(id) },
      document: { createElement: () => { const link = { click: () => downloads.push({ ...link }), remove() {} }; return link }, body: { appendChild() {} } },
    }, { filename })
    return compiledModule.exports
  }
  const history = load('src/registry/ada/hooks/use-conversations.ts')
  return { history, saved, errors, downloads, blobs, storageListeners,
    formatAge: load('src/registry/ada/lib/ada-data.ts').formatConversationAge,
    videoEditing: load('src/registry/ada/lib/video-editing.ts'),
    snapshot: () => history.useConversations(),
    render(options) { cursor = 0; return load('src/registry/ada/hooks/use-ada-chat.ts').useAdaChat(options) },
    remount() { states = []; cursor = 0 },
    flush() { while (timers.length) timers.shift()() },
    path: () => currentPath,
  }
}
const message = (content) => ({ id: randomUUID(), role: 'user', kind: 'text', label: 'Message', content })

test('history creates, saves, reopens, duplicates, exports and deletes conversations', async () => {
  const env = environment()
  assert.equal(env.snapshot().items.length, 7)
  const item = env.history.createConversation('chat', message('Plan a weekend trip'))
  env.history.updateMessages(item.id, (messages) => [...messages, { id: randomUUID(), role: 'assistant', kind: 'text', content: 'Here is the plan.' }])
  assert.equal(env.snapshot().items[0].id, item.id)
  assert.equal(env.snapshot().items[0].messages.length, 2)
  const reopened = environment(env.saved)
  assert.equal(reopened.snapshot().items[0].messages[1].content, 'Here is the plan.')
  const copy = env.history.duplicateConversation(item.id)
  assert.notEqual(copy.id, item.id)
  assert.equal(copy.title, 'Plan a weekend trip (copy)')
  env.history.updateMessages(copy.id, (messages) => [...messages, message('Only in the copy')])
  assert.equal(env.snapshot().items.find((chat) => chat.id === item.id).messages.length, 2)
  env.history.exportConversation(env.snapshot().items.find((chat) => chat.id === copy.id))
  assert.match(env.downloads[0].download, /\.json$/)
  const exported = JSON.parse(await env.blobs.get(env.downloads[0].href).text())
  assert.equal(exported.messages[2].content, 'Only in the copy')
  env.history.deleteConversation(item.id)
  env.history.updateMessages(item.id, (messages) => [...messages, message('Late reply')])
  assert.equal(env.snapshot().items.some((chat) => chat.id === item.id), false)
  assert.equal(environment(env.saved).snapshot().items.some((chat) => chat.id === item.id), false)
})

test('first send registers one chat, follow-ups reuse it, and New chat starts fresh', () => {
  const env = environment()
  let chat = env.render({ mode: 'chat' })
  chat.send('   ')
  assert.equal(env.snapshot().items.length, 7)
  chat.send('Help me write an email')
  chat = env.render({ mode: 'chat' })
  const id = chat.conversation.id
  assert.equal(env.path(), `/chat/${id}`)
  assert.equal(chat.messages[0].content, 'Help me write an email')
  assert.equal(chat.pending, 'Thinking…')
  chat.send('Ignored while pending')
  assert.equal(env.snapshot().items[0].messages.length, 1)
  env.flush()
  chat = env.render({ mode: 'chat' })
  assert.equal(chat.messages.length, 2)
  assert.equal(chat.pending, null)
  chat.send('Make it shorter')
  env.flush()
  chat = env.render({ mode: 'chat' })
  assert.equal(chat.conversation.id, id)
  assert.equal(chat.messages.length, 4)
  chat.reset()
  chat = env.render({ mode: 'chat' })
  assert.equal(chat.messages.length, 0)
  assert.equal(env.snapshot().items.length, 8)
  chat.send('A separate subject')
  env.flush()
  chat = env.render({ mode: 'chat' })
  assert.notEqual(chat.conversation.id, id)
  assert.equal(env.snapshot().items.length, 9)
  const reloaded = environment(env.saved)
  const saved = reloaded.snapshot().items.find((item) => item.id === id)
  assert.equal(reloaded.render({ mode: 'chat', conversation: saved }).messages.length, 4)
})

test('background replies finish on their original chat and deleted chats stay deleted', () => {
  const env = environment()
  let chat = env.render({ mode: 'chat' })
  chat.send('First conversation')
  chat = env.render({ mode: 'chat' })
  const first = chat.conversation.id
  chat.reset()
  chat = env.render({ mode: 'chat' })
  chat.send('Second conversation')
  chat = env.render({ mode: 'chat' })
  const second = chat.conversation.id
  env.history.deleteConversation(second)
  env.flush()
  assert.equal(env.snapshot().items.find((item) => item.id === first).messages.length, 2)
  assert.equal(env.snapshot().items.some((item) => item.id === second), false)
  chat = env.render({ mode: 'chat' })
  chat.send('Continue after deletion')
  env.flush()
  assert.equal(env.snapshot().items[0].title, 'Continue after deletion')
})

test('regeneration replaces the selected answer and saves the replacement', () => {
  const env = environment()
  let chat = env.render({ mode: 'chat' })
  chat.send('Explain rainbows')
  env.flush()
  chat = env.render({ mode: 'chat' })
  const previousAnswer = chat.messages[1].id
  chat.regenerate(previousAnswer)
  env.flush()
  chat = env.render({ mode: 'chat' })
  assert.equal(chat.messages.length, 2)
  assert.notEqual(chat.messages[1].id, previousAnswer)
  assert.equal(environment(env.saved).snapshot().items[0].messages[1].id, chat.messages[1].id)
})

test('history accepts cross-tab updates and persists an empty history', () => {
  const env = environment()
  env.snapshot()
  const otherTab = environment(env.saved)
  otherTab.snapshot()
  const created = otherTab.history.createConversation('image', message('A mountain lake'))
  for (const listener of env.storageListeners) listener({ key: 'ada-conversations-v1' })
  assert.equal(env.snapshot().items[0].id, created.id)
  for (const item of env.snapshot().items) env.history.deleteConversation(item.id)
  assert.equal(environment(env.saved).snapshot().items.length, 0)
})

test('compact history ages distinguish minutes, hours, days and months', () => {
  const { formatAge } = environment()
  const now = Date.parse('2026-10-25T12:00:00Z')
  for (const [minutes, label] of [[0, '0min'], [2, '2min'], [59, '59min'], [60, '1h'], [1440, '1d'], [10080, '7d'], [43200, '1m'], [525600, '1y']]) {
    assert.equal(formatAge({ updatedAt: new Date(now - minutes * 60000).toISOString(), date: 'Today' }, now), label)
  }
  assert.equal(formatAge({ updatedAt: new Date(now + 60000).toISOString(), date: 'Today' }, now), '0min')
  assert.match(formatAge({ date: 'Yesterday' }, now), /^1d$/)
  assert.doesNotMatch(formatAge({ date: 'Oct 18' }, now), /NaN/)
})

test('New on a reopened conversation preserves the old chat while its reply completes', () => {
  const env = environment()
  const previous = env.snapshot().items[0]
  let chat = env.render({ mode: 'chat', conversation: previous })
  const originalCount = chat.messages.length
  chat.send('Continue this saved conversation')
  chat = env.render({ mode: 'chat', conversation: previous })
  chat.reset()
  chat = env.render({ mode: 'chat', conversation: previous })
  assert.equal(chat.messages.length, 0)
  assert.equal(chat.pending, null)
  env.flush()
  chat.send('A fresh conversation')
  env.flush()
  chat = env.render({ mode: 'chat', conversation: previous })
  assert.notEqual(chat.conversation.id, previous.id)
  assert.equal(chat.messages.length, 2)
  const oldChat = environment(env.saved).snapshot().items.find((item) => item.id === previous.id)
  assert.equal(oldChat.messages.length, originalCount + 2)
  assert.equal(oldChat.messages[originalCount].content, 'Continue this saved conversation')
})

test('New chat immediately saves and opens a blank conversation, then titles it on first send', () => {
  const env = environment()
  const original = env.snapshot().items[0]
  let chat = env.render({ mode: 'chat', conversation: original })
  const created = chat.startNew()
  chat = env.render({ mode: 'chat', conversation: original })
  const id = chat.conversation.id
  assert.equal(chat.conversation.title, 'New chat')
  assert.equal(chat.messages.length, 0)
  assert.equal(created.id, id)
  assert.equal(env.snapshot().items.length, 8)
  assert.equal(environment(env.saved).snapshot().items[0].id, id)
  chat.send('Plan my week')
  env.flush()
  chat = env.render({ mode: 'chat', conversation: original })
  assert.equal(chat.conversation.id, id)
  assert.equal(chat.conversation.title, 'Plan my week')
  assert.equal(chat.messages.length, 2)
  assert.equal(env.snapshot().items.length, 8)
  chat.startNew()
  chat = env.render({ mode: 'chat', conversation: original })
  assert.notEqual(chat.conversation.id, id)
  assert.equal(chat.messages.length, 0)
  assert.equal(env.snapshot().items.find((item) => item.id === id).messages.length, 2)
  assert.equal(env.snapshot().items.find((item) => item.id === original.id).messages.length, original.messages.length)
})

test('video scene timelines preserve duration, support seeking and bounded splits', () => {
  const env = environment()
  const { createVideoTimeline, timelineDuration, sceneAtTime, splitVideoScene } = env.videoEditing
  const scenes = createVideoTimeline({ id: 'video', scene: 'forest', duration: 12, role: 'assistant', kind: 'video' }, 'A panda in a forest')
  assert.equal(scenes.length, 3)
  assert.equal(timelineDuration(scenes), 12)
  assert.equal(sceneAtTime(scenes, 0).scene.id, scenes[0].id)
  assert.equal(sceneAtTime(scenes, 4).scene.id, scenes[1].id)
  assert.equal(sceneAtTime(scenes, 12).scene.id, scenes[2].id)
  assert.equal(sceneAtTime(scenes, 100).scene.id, scenes[2].id)
  const split = splitVideoScene(scenes, scenes[0].id, 1.5, 'split')
  assert.equal(split.length, 4)
  assert.equal(timelineDuration(split), 12)
  assert.equal(split[0].duration, 1.5)
  assert.equal(split[1].duration, 2.5)
  assert.equal(split[1].id, 'split')
  const clamped = splitVideoScene(scenes, scenes[0].id, 99, 'bounded')
  assert.equal(clamped[0].duration, 3)
  assert.equal(clamped[1].duration, 1)
  const short = createVideoTimeline({ id: 'short', scene: 'forest', duration: 1.5, kind: 'video', role: 'assistant' })
  assert.equal(timelineDuration(short), 1.5)
  assert.equal(splitVideoScene(short, short[0].id, 0.5, 'no-split').length, 1)
})

test('video edit directions update previews and survive saving and reopening', () => {
  const env = environment()
  const { createVideoTimeline, applySceneDirection, timelineDuration } = env.videoEditing
  const original = env.snapshot().items.find((item) => item.id === 'panda-video')
  const video = original.messages.find((message) => message.kind === 'video')
  const scenes = createVideoTimeline(video)
  const next = scenes.map((scene, index) => index === 1 ? applySceneDirection(scene, 'Use golden hour and make it 6 seconds') : scene)
  assert.equal(next[1].scene, 'sunset')
  assert.equal(next[1].duration, 6)
  assert.equal(next[0].scene, 'forest')
  assert.equal(applySceneDirection(next[1], 'Make it 999 seconds').duration, 60)
  assert.equal(applySceneDirection(next[1], 'Make it 0 seconds').duration, 1)
  env.history.updateMessages(original.id, (messages) => messages.map((message) => message.id === video.id ? {
    ...message, scenes: next, duration: timelineDuration(next), scene: next[0].scene,
  } : message))
  const saved = environment(env.saved).snapshot().items.find((item) => item.id === original.id).messages.find((message) => message.id === video.id)
  assert.equal(saved.scenes.length, 3)
  assert.equal(saved.scenes[1].direction, 'Use golden hour and make it 6 seconds')
  assert.equal(saved.duration, 14)
  assert.equal(createVideoTimeline(saved)[1].scene, 'sunset')
})
