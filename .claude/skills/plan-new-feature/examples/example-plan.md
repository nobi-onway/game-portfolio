# Example Plan: Interactive Project Timeline

This is a demonstration of how the `plan-new-feature` skill generates a high-quality, architecturally sound design document for a new feature.

### 🎯 Feature Overview
An interactive, animated vertical timeline component that showcases project milestones with glassmorphism styling and scroll-triggered animations.

### 🏗 Architecture Blueprint
- **Components**: 
    - `TimelineContainer.tsx`: Global wrapper with scroll tracking.
    - `TimelineItem.tsx`: Individual milestone card.
    - `TimelineNode.tsx`: Glowing dot with pulsing animation on the line.
- **Data Flow**: Milletone data passed as an array of objects to `TimelineContainer`. Each `TimelineItem` calculates its own "progress" via `framer-motion`'s `useScroll`.
- **External Dependencies**: `framer-motion` for animations, `lucide-react` for icons.

### 🎨 Design Language
- **Theme**: **Glassmorphism Dark**. 
    - Background: Deep slate/near-black.
    - Card: `bg-white/5 backdrop-blur-md border border-white/10`.
    - Accents: Indigo-to-Violet gradient for the timeline path.
- **Special Effects**: 
    - Glowing "pulse" on the active milestone.
    - Linear border gradient that "fills" as the user scrolls.

### 🚀 Execution Plan (Step-by-Step)
1. **Foundation**: Define `TimelineItem` interface (title, date, description, icon, tag).
2. **Logic layer**: Implement a `useTimelineProgress` hook to track scroll position relative to the container.
3. **UI Layer**:
    - Create the SVG-based animated line.
    - Design the milestone card with standard Glassmorphism styles.
4. **Integration**: Map the data to items and wire up `framer-motion` initial/animate states.

### 🛡 Verification Checklist
- [ ] Mobile view: timeline flips to single-column layout.
- [ ] Accessibility: all icons have `aria-label`.
- [ ] Motion: `reduced-motion` check to disable animations for sensitive users.
