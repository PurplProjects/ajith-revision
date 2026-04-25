import { useState } from 'react'

// ── Flip Card ──────────────────────────────────────────────────────────────
function FlashCard({ card, index, subjectColor }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      className="cursor-pointer rounded-2xl border-2 transition-all select-none min-h-[120px] flex flex-col justify-between p-4"
      style={{
        borderColor: flipped ? subjectColor : '#e5e7eb',
        backgroundColor: flipped ? subjectColor + '0d' : '#ffffff',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-gray-300">Q{index + 1}</span>
        <span className="text-xs text-gray-400">{flipped ? 'tap to flip back' : 'tap to reveal'}</span>
      </div>
      <div className="mt-2">
        {!flipped ? (
          <p className="text-sm font-semibold text-gray-800">{card.q}</p>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: subjectColor }}>Answer</p>
            <p className={`text-sm text-gray-800 ${card.worked ? 'font-mono font-bold' : ''}`}>{card.a}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Formula Card ───────────────────────────────────────────────────────────
function FormulaCard({ formula }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-800 text-sm">{formula.name}</span>
        <span className="text-xs text-gray-400">{formula.units}</span>
      </div>
      {/* Main formula */}
      <div className="bg-indigo-50 rounded-xl px-4 py-3 text-center mb-3">
        <span className="text-xl font-bold text-indigo-700 font-mono">{formula.formula}</span>
        <p className="text-xs text-indigo-500 mt-1">{formula.words}</p>
      </div>
      {/* Rearrangements */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Rearrangements:</p>
        <div className="flex gap-2">
          {formula.rearrangements.map((r, i) => (
            <span key={i} className="flex-1 text-center text-xs font-mono bg-gray-50 rounded-lg py-1.5 text-gray-600 border border-gray-100">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── FIFA Step ──────────────────────────────────────────────────────────────
function FifaStep({ step, color }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ backgroundColor: color }}>
        {step.letter}
      </div>
      <div>
        <p className="font-bold text-gray-800 text-sm">{step.word}</p>
        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
      </div>
    </div>
  )
}

// ── Resource Link ──────────────────────────────────────────────────────────
function ResourceLink({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-sm transition group"
    >
      <span className="text-2xl flex-shrink-0">{resource.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition">{resource.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
      </div>
      <span className="text-gray-300 group-hover:text-indigo-400 transition flex-shrink-0">↗</span>
    </a>
  )
}

// ── Main RevisionPanel ─────────────────────────────────────────────────────
export default function RevisionPanel({ revision, subjectColor }) {
  const [activeTopicId, setActiveTopicId] = useState(null)
  const [section, setSection] = useState('topics') // topics | formulas | resources

  if (!revision) return null

  const activeTopic = revision.topics?.find(t => t.id === activeTopicId)

  return (
    <div className="space-y-4">

      {/* Teacher note */}
      {revision.teacherNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <span className="text-xl">👨‍🏫</span>
          <div>
            <p className="text-xs font-semibold text-amber-800">{revision.teacherNote.teacher}</p>
            <p className="text-xs text-amber-700 mt-1">{revision.teacherNote.message}</p>
          </div>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-2">
        {[
          { key: 'topics', label: '🃏 Flashcards' },
          ...(revision.formulas ? [{ key: 'formulas', label: '📐 Formulas' }] : []),
          ...(revision.fifa ? [{ key: 'fifa', label: '⚽ FIFA Technique' }] : []),
          { key: 'resources', label: '🔗 Resources' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setSection(tab.key); setActiveTopicId(null) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              section === tab.key ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            style={section === tab.key ? { backgroundColor: subjectColor } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FLASHCARDS SECTION */}
      {section === 'topics' && (
        <div className="space-y-3">
          {/* Topic selector */}
          {!activeTopicId && (
            <div className="space-y-2">
              {revision.topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: topic.color }} />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm">{topic.title}</p>
                      <p className="text-xs text-gray-400">{topic.cards.length} flashcards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {topic.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: topic.badgeColor ?? topic.color }}>
                        {topic.badge}
                      </span>
                    )}
                    <span className="text-gray-400 text-sm">→</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Cards for selected topic */}
          {activeTopicId && activeTopic && (
            <div>
              <button
                onClick={() => setActiveTopicId(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← All topics
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTopic.color }} />
                <h3 className="font-bold text-gray-800">{activeTopic.title}</h3>
                {activeTopic.cgpRevision && (
                  <span className="text-xs text-gray-400">CGP p.{activeTopic.cgpRevision}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">Tap a card to reveal the answer. Tap again to flip back.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTopic.cards.map((card, i) => (
                  <FlashCard
                    key={i}
                    card={card}
                    index={i}
                    subjectColor={activeTopic.color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORMULAS SECTION */}
      {section === 'formulas' && revision.formulas && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">All key formulas for Year 7 Physics. Learn these — you need them for every calculation question.</p>
          {revision.formulas.map((f, i) => (
            <FormulaCard key={i} formula={f} />
          ))}
        </div>
      )}

      {/* FIFA SECTION */}
      {section === 'fifa' && revision.fifa && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-2">
            <p className="text-sm font-bold text-gray-800 mb-1">⚽ The FIFA Technique</p>
            <p className="text-xs text-gray-500">Use this for every calculation question. Follow the four steps in order.</p>
          </div>
          {revision.fifa.map((step, i) => (
            <FifaStep key={i} step={step} color={subjectColor} />
          ))}
          {/* Worked example */}
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 mt-2">
            <p className="text-xs font-bold text-indigo-800 mb-2">Worked example: A car travels 200 m in 10 s. What is its speed?</p>
            <div className="space-y-1 text-xs text-indigo-700">
              <p><span className="font-bold">F</span> — Find formula: s = d ÷ t</p>
              <p><span className="font-bold">I</span> — Insert values: s = 200 ÷ 10</p>
              <p><span className="font-bold">F</span> — Fine-tune: no rearrangement needed</p>
              <p><span className="font-bold">A</span> — Answer: s = 20 m/s</p>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES SECTION */}
      {section === 'resources' && revision.resources && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Links recommended by Mr King. All open in a new tab.</p>
          {revision.resources.map((r, i) => (
            <ResourceLink key={i} resource={r} />
          ))}
        </div>
      )}
    </div>
  )
}
