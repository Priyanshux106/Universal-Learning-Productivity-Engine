# Learnwise AI - Product Requirements Document

## Executive Summary

**Learnwise AI** is a comprehensive AI Learning Operating System designed to make learning 2x faster and 3x more structured by combining personalized roadmaps, AI-powered explanations, active recall testing, and deep work sessions with engaging gamification.

---

## Core Modules

### 🔹 Module 1: Smart Learning Path Generator

**User Inputs**: Topic, Current skill level, Target timeline  
**AI Output**: Phase-wise roadmap, Weekly breakdown, Daily tasks

**Requirements**:
- [ ] REQ-1.1: Onboarding flow (topic, skill level, timeline)
- [ ] REQ-1.2: RoadmapService with Gemini API integration
- [ ] REQ-1.3: RoadmapPage component with timeline visualization
- [ ] REQ-1.4: Task completion tracking
- [ ] REQ-1.5: Progress widget in Dashboard
- [ ] REQ-1.6: Supabase table `learning_roadmaps`
- [ ] REQ-1.7: XP rewards (+5 per task, +50 per phase)

---

### 🔹 Module 2: AI Concept Simplifier

**User Inputs**: Complex text/topic, Explanation level  
**AI Output**: Simplified explanation, Examples, Analogies, Key points, Memory hooks

**Requirements**:
- [ ] REQ-2.1: ConceptSimplifierPage component
- [ ] REQ-2.2: Level selector (Beginner/Intermediate/Advanced)
- [ ] REQ-2.3: simplifierService with Gemini API
- [ ] REQ-2.4: Multi-format output display
- [ ] REQ-2.5: Save to library functionality
- [ ] REQ-2.6: Supabase table `concept_simplifications`
- [ ] REQ-2.7: Dashboard library section
- [ ] REQ-2.8: +10 XP per simplification

---

### 🔹 Module 3: Active Recall & Smart Testing Engine

**Features**: MCQs, Short-answer, Scenario-based questions, Flashcards  
**Context-Aware**: Based on roadmap progress and weak areas

**Requirements**:
- [ ] REQ-3.1: QuizPage with question navigation
- [ ] REQ-3.2: quizService for MCQ generation (Grok API)
- [ ] REQ-3.3: Multiple question type support
- [ ] REQ-3.4: Adaptive difficulty algorithm
- [ ] REQ-3.5: ResultsPage with diagnostics
- [ ] REQ-3.6: FlashcardPage with flip animation
- [ ] REQ-3.7: flashcardService with spaced repetition
- [ ] REQ-3.8: Supabase tables `quiz_attempts`, `flashcard_sessions`
- [ ] REQ-3.9: XP rewards (+20 quiz, +5 flashcards)

---

### 🔹 Module 4: AI Productivity Mode

**Features**: Study timer (30/60/90 min), Focus lock, AI summaries, Next actions

**Requirements**:
- [ ] REQ-4.1: DeepStudyPage with timer
- [ ] REQ-4.2: Duration selector
- [ ] REQ-4.3: Focus lock mechanism
- [ ] REQ-4.4: Countdown timer (Web Workers)
- [ ] REQ-4.5: studySessionService
- [ ] REQ-4.6: AI session summary (Gemini API)
- [ ] REQ-4.7: XP based on duration (+10/20/30)
- [ ] REQ-4.8: Streak updates
- [ ] REQ-4.9: Supabase table `study_sessions`

---

## Gamification System

### XP Sources
- Quiz: +10 attempt, +10 completion, +15 perfect score
- Simplification: +10
- Flashcards: +5
- Study sessions: +10/20/30 (30/60/90 min)
- Roadmap: +5 task, +50 phase
- Streaks: +5 to +200

### Levels & Streaks
- Progressive leveling (1-100)
- Daily streak tracking
- Milestone rewards (7, 14, 30 days)

### Badges
- 4 rarity tiers (Common, Rare, Epic, Legendary)
- Categories: Skill, Consistency, Performance, Improvement

---

## Database Schema

1. **learning_roadmaps** - User roadmaps
2. **concept_simplifications** - Saved simplifications
3. **quiz_attempts** - Quiz history
4. **flashcard_sessions** - Flashcard practice
5. **study_sessions** - Deep work tracking
6. **streaks** - Daily streak data
7. **user_preferences** - User settings

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Next.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Gemini API, Grok API
- **Storage**: LocalStorage cache

---

## Implementation Priority

### Phase 1 (MVP)
1. Roadmap Generator
2. Concept Simplifier
3. Quiz Engine
4. Deep Study Mode
5. Gamification Core
6. Dashboard

### Phase 2
1. Flashcard System
2. Adaptive Difficulty
3. Advanced Analytics

### Phase 3 (Optional)
1. Leaderboards
2. Challenge Mode
3. Quest System

---

**Version**: 1.0 | **Status**: Ready for Development
