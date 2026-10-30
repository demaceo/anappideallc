import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { STORY, chapterById, type StoryChapterId } from '../../data/story'

const pad = (n: number) => String(n).padStart(2, '0')

// "Chapter 03 / 07" — the visible thread that ties one page's chapter to the
// rest of the story.
function chapterCount(index: number) {
  return `Chapter ${pad(index + 1)} / ${pad(STORY.length)}`
}

interface StoryChapterProps {
  id: StoryChapterId
  // Extra content under the copy, e.g. the proof list on Work.
  children?: ReactNode
}

export function StoryChapter({ id, children }: StoryChapterProps) {
  const { chapter, index } = chapterById(id)
  const headingId = `story-${chapter.id}`
  return (
    <section className="story-chapter" aria-labelledby={headingId}>
      <p className="story-chapter-label">
        <span className="story-chapter-count">{chapterCount(index)}</span>
        <span aria-hidden="true"> · </span>
        {chapter.title}
      </p>
      <h2 id={headingId} className="story-chapter-heading">{chapter.heading}</h2>
      {chapter.body.map((p) => (
        <p key={p} className="story-chapter-body">{p}</p>
      ))}
      {children}
    </section>
  )
}

// Link to the following chapter's page. Renders nothing on the last chapter,
// where the page itself closes the story.
export function StoryNext({ id }: { id: StoryChapterId }) {
  const { index } = chapterById(id)
  const next = STORY[index + 1]
  if (!next) return null
  return (
    <nav className="story-next" aria-label="Founder story">
      <span className="story-next-label">Next · {chapterCount(index + 1)}</span>
      <Link to={next.path} className="story-next-link">
        {next.title} <span aria-hidden="true">→</span>
      </Link>
    </nav>
  )
}
