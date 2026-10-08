# PrintU — Master Product & Build Directive
## Version 1.0 — Hand this entire file to Gemini Antigravity

> **ROLE MODEL**
>
> The human is the Director.
>
> This document is the product brain and source of truth.
>
> Gemini Antigravity is the engineering team: it must inspect, reason, design, implement, test, debug, polish, and finish the application.
>
> Do not merely create a visual prototype. Build a genuinely functional product.

---

# 0. EXECUTIVE DIRECTIVE

Build **PrintU**, a lightweight, premium, family-friendly printing application delivered primarily as a **responsive web application and installable PWA**.

PrintU should make printing dramatically easier for ordinary people.

The target users include:

- parents
- children
- students
- siblings
- non-technical family members
- anyone who wants to print without understanding printer terminology

The core principle is:

> **The user should think about what they want to print, not how printers work.**

PrintU must work beautifully on:

1. Mobile phones
2. Tablets
3. Laptop screens
4. Desktop monitors

It must not look like a mobile website stretched onto desktop.

It must feel like one coherent product whose interface intelligently adapts to the available screen.

---

# 1. PRODUCT VISION

PrintU is not merely a prettier printer settings page.

It is a **simple print workflow system**.

The user should be able to:

1. Open PrintU.
2. Choose Photos or Documents.
3. Select what they want to print.
4. Choose a simple layout.
5. Adjust the result if necessary.
6. See an accurate print preview.
7. Select a printer.
8. Print.
9. If manual duplex printing is required, PrintU should guide them through the physical paper flipping process.
10. Clearly know when the job has completed or failed.

The complexity should remain hidden unless the user explicitly opens advanced settings.

---

# 2. PRODUCT PERSONALITY

PrintU should feel:

- premium
- calm
- trustworthy
- minimal
- fast
- friendly
- physical
- modern
- polished
- extremely intentional

It should NOT feel:

- like enterprise printer software
- like a generic admin dashboard
- like an AI-generated SaaS template
- like a school project
- like a bloated settings application
- like a glassmorphism showcase
- like a UI full of unnecessary cards
- like a developer tool

Reference the emotional quality of products such as:

- Apple
- Nike
- Google
- modern camera applications
- premium consumer hardware interfaces

But do not copy any company's interface.

Create an original PrintU identity.

---

# 3. BRAND IDENTITY

## Product name

**PrintU**

Always use the capitalization:

**PrintU**

Do not use:

- Print U
- Printu
- PRINTU as the normal product wordmark

---

# 4. ICON / APP IDENTITY

The application icon must be extremely simple.

### Required concept

A deep wine-red background.

A minimal:

**P**

or

**P + U**

mark in white.

The mark must remain recognizable at:

- 16px
- 32px
- 48px
- 96px
- 192px
- 512px

Do not put a printer illustration into the icon.

Do not make it complicated.

Do not use tiny text.

Do not add unnecessary shadows.

Do not make it look like an AI logo.

The icon should feel like a premium consumer app.

### Suggested visual direction

- Background: deep wine red
- Foreground: pure or slightly softened white
- Strong geometric form
- Rounded but confident
- Excellent negative space
- No excessive gradients

Create the required PWA icon assets and manifest configuration.

Also create the favicon variants.

If the project supports maskable icons, create an appropriate maskable version.

---

# 5. VISUAL DIRECTION

The primary visual direction should be:

## Deep Wine + Warm Aurora

Use a restrained palette.

Suggested starting direction:

- Deep wine red: `#541827`
- Dark wine: `#3D101D`
- Warm orange: `#F28B45`
- Soft cream/white: `#FFFDFC`
- Main text: near-black
- Secondary text: muted neutral
- Borders: extremely subtle neutral

These are starting references, not immutable requirements.

Antigravity may refine the palette if the resulting visual system is objectively better.

### Important

Do not turn the entire interface orange/red.

The accent should be used intelligently.

Large areas should remain clean and light.

Use subtle Aurora-like gradients and glow only where they improve hierarchy.

---

# 6. ALTERNATE VISUAL DIRECTION

If testing shows the wine/orange direction becomes too heavy, use a restrained pistachio/green direction as a secondary visual exploration.

The final product should still have one coherent visual identity.

Do not ship two competing themes unless the product genuinely benefits from theme selection.

---

# 7. TYPOGRAPHY

Typography must feel premium and highly readable.

Use one primary type family with appropriate system fallbacks.

Priorities:

1. readability
2. hierarchy
3. consistency
4. compactness
5. premium appearance

Avoid:

- novelty fonts
- excessive font weights
- oversized headings everywhere
- excessive uppercase labels
- tiny unreadable controls

Typography should communicate hierarchy without needing boxes around everything.

---

# 8. CORE UX PRINCIPLE

## Progressive disclosure

The default interface must show only what most people need.

Advanced printer settings should remain available but hidden behind:

**More settings**

or

**Advanced**

Never force ordinary users to understand:

- DPI
- driver terminology
- printer protocols
- spoolers
- feed direction
- page rendering
- color profiles
- margins in technical units

Translate technical complexity into human decisions.

Example:

Instead of exposing only:

`600 DPI`

show:

**Print quality**
- Standard
- High
- Maximum

Advanced information can still be available.

---

# 9. HOME SCREEN

The first screen should immediately answer:

> **What would you like to print?**

Primary choices:

### Photos

Description:
**Pictures and photo sheets**

### Documents

Description:
**PDFs, files and papers**

Optional third action:

### Quick Print

Description:
**Use your usual settings**

The home screen should also show a compact Recent section.

Example:

- recent document
- recent photo
- previous print job

Do not overcrowd the home screen.

---

# 10. PHOTO WORKFLOW

When the user chooses Photos:

## Step 1 — Select photos

Provide:

- Add photos
- native file/photo picker
- drag and drop on desktop
- thumbnail grid
- multi-selection
- deselection
- selected count
- search where appropriate
- recent/imported grouping if useful

The photo grid should be visually strong.

Selected photos should have an unmistakable but elegant selection state.

---

# 11. PHOTO LAYOUT

Provide simple visual choices:

- 1 photo per page
- 2 photos per page
- 4 photos per page
- 6 photos per page
- 9 photos per page

Do not present these merely as text radio buttons.

Show miniature page diagrams.

For example:

### 1 per page

One large photo.

### 2 per page

Two vertically or horizontally arranged photos depending on page orientation.

### 4 per page

2 × 2 grid.

### 6 per page

2 × 3 or 3 × 2 depending on orientation.

### 9 per page

3 × 3 grid.

The layout engine must calculate these dynamically.

---

# 12. PHOTO SIZE

Separate:

**Photos per page**

from:

**Physical photo size**

These are different concepts.

Support common photo sizes where practical:

- A4 sheet
- A5 sheet
- 4 × 6 inch
- 5 × 7 inch
- custom dimensions

Do not overload the basic interface.

---

# 13. PHOTO FIT MODES

Provide:

- Fit
- Fill
- Crop
- Original

Explain them visually where useful.

Never make the user guess what "Fill" means.

---

# 14. IMAGE ADJUSTMENTS

PrintU must provide practical image controls.

At minimum:

- Brightness
- Contrast
- Saturation
- Sharpness
- Warmth

Provide useful presets:

- Original
- Natural
- Vivid
- Black & White

Changes should update the preview immediately.

The original file must never be destructively overwritten.

---

# 15. IMPORTANT IMAGE QUALITY RULE

Do not falsely imply that selecting "High quality" magically creates more image detail.

PrintU must distinguish between:

### Source image quality

Resolution and actual image information.

### Image processing

Brightness, contrast, saturation, sharpness, etc.

### Printer output quality

The printer's available quality modes.

When technically possible, preserve high-resolution source images and generate appropriate print output for the selected physical size.

---

# 16. DOCUMENT WORKFLOW

When the user chooses Documents:

Show:

- recent documents
- imported documents
- search
- file type indicators
- document name
- page count where available
- date/time
- thumbnail or document preview where appropriate

Support common document workflows, prioritizing PDF.

The interface should feel like a clean personal document shelf rather than a file manager.

---

# 17. DOCUMENT SEARCH

Provide a prominent search field.

Search should be:

- fast
- forgiving
- useful on mobile and desktop

Search document names first.

If technically practical, support searchable document metadata/content.

Do not create a heavyweight indexing system unnecessarily.

---

# 18. PRINT PREVIEW

The print preview is one of the most important parts of PrintU.

It must represent the actual output as closely as reasonably possible.

The user should see:

- paper boundaries
- photo/document placement
- margins
- orientation
- number of pages
- scaling
- layout
- cropping
- page order

Example:

A4 sheet shown as an actual sheet.

If four photos are selected:

2 × 2 layout should visibly appear as 2 × 2.

Do not use a generic thumbnail and call it a print preview.

---

# 19. PAPER SETTINGS

Support common choices:

- A4
- A5
- Letter where relevant
- 4 × 6 inch
- 5 × 7 inch
- Custom where practical

The interface should intelligently show relevant options based on the selected workflow.

---

# 20. ORIENTATION

Provide:

- Portrait
- Landscape
- Auto

Auto should intelligently choose orientation based on content/layout where possible.

Always make the selected orientation obvious in the preview.

---

# 21. MARGINS

Provide simple choices:

- Normal
- Small
- None / Borderless when supported

Do not expose technical measurements in the primary flow.

Advanced users may access exact measurements.

---

# 22. COLOR MODE

Provide:

- Color
- Grayscale

If the printer supports additional modes, expose them only under advanced settings.

---

# 23. PRINT QUALITY

Provide:

- Draft
- Standard
- High
- Maximum

Default should be **High** for photo printing if appropriate.

For ordinary documents, choose a sensible default that balances speed and quality.

The system should remember user preferences when appropriate.

---

# 24. COPIES AND COLLATION

Support:

- number of copies
- collate

Make the controls obvious.

Example:

`Copies   −  2  +`

---

# 25. DUPLEX PRINTING

Support two concepts:

### Automatic duplex

If the selected printer supports automatic duplex, use it.

### Manual duplex

If the printer does not support automatic duplex, PrintU must intelligently guide the user.

This is a signature feature.

---

# 26. MANUAL DUPLEX LOGIC

For a document:

1
2
3
4
5
6

PrintU should determine the correct first-side and second-side sequences based on the printer's configured feed profile.

Do not hard-code one universal flip assumption.

Different printers handle paper differently.

The application must support printer-specific manual duplex profiles.

---

# 27. MANUAL DUPLEX EXPERIENCE

After the first side finishes:

Show a dedicated full-screen instruction state.

Example:

# Flip the paper

Then display an animated paper representation.

The animation should clearly demonstrate:

1. pick up the stack
2. rotate/flip it
3. orient it correctly
4. put it back into the tray

Use:

- paper animation
- rotation
- arrows
- directional indicators
- top/bottom markers

Avoid relying on a paragraph of instructions.

---

# 28. DUPLEX CONFIRMATION

After the animation:

**I've flipped the paper**

Then:

**Continue**

and:

**Cancel**

Never automatically continue before the user confirms.

This prevents accidental wrong-side printing.

---

# 29. PRINTER DISCOVERY

PrintU should support printer discovery when the platform allows it.

The UI should present:

- printer name
- model where available
- connection type
- status
- ready/offline state

Example:

**Living Room Printer**
Canon TS3370s
Wi-Fi · Ready

The user should be able to select a printer without knowing its IP address.

---

# 30. CRITICAL PLATFORM ARCHITECTURE

A browser/PWA has security restrictions around direct local-network printer communication.

Do NOT fake universal Wi-Fi printing.

If direct browser printing is insufficient, build a lightweight **local PrintU Bridge** or equivalent local helper.

The bridge should:

- discover local printers where supported
- communicate with supported printing protocols
- receive print jobs securely from the local PrintU interface
- report printer/job status
- avoid unnecessary background services
- remain lightweight

The PWA remains the primary user experience.

The local bridge is infrastructure.

The user should not need to understand the bridge.

---

# 31. SECURITY MODEL

Do not expose a printer-control service openly to the network.

The local bridge must:

- bind safely
- authenticate requests from PrintU where appropriate
- validate print jobs
- avoid arbitrary command execution
- avoid accepting untrusted remote print commands
- use local origin restrictions where applicable
- avoid storing sensitive documents unnecessarily

Do not compromise security just to make a demo work.

---

# 32. FALLBACK PRINTING

If direct local printing is unavailable:

Give the user a graceful fallback.

For example:

**Print using system dialog**

or:

**Download print-ready PDF**

Never present a fake "Printing..." animation when no print job was actually submitted.

Truthful state is more important than visual polish.

---

# 33. PRINT QUEUE

Provide a simple print queue.

States:

- Preparing
- Ready
- Sending
- Printing
- Waiting for user
- Completed
- Failed
- Cancelled

Users should understand what is happening without seeing technical logs.

---

# 34. PRINT JOB DETAILS

A job can show:

- file name
- printer
- page count
- copies
- status
- start time
- completion state

Technical diagnostics should be available only under advanced settings.

---

# 35. ERROR HANDLING

Errors must be human-readable.

Bad:

> `IPP_ERROR_0x800401F3`

Better:

> **PrintU couldn't reach the printer.**
>
> Check that the printer is switched on and connected to the same network.

Then provide:

**Try again**

and:

**Printer settings**

---

# 36. OFFLINE BEHAVIOR

The PWA should remain useful when offline where technically practical.

Offline capabilities may include:

- opening the app
- browsing locally stored/imported recent items
- preparing print layouts
- generating previews
- editing photos
- generating print-ready files

Actual network printing naturally requires connectivity.

Never pretend otherwise.

---

# 37. RESPONSIVE DESIGN

This is mandatory.

PrintU must be designed for:

### Mobile

Approx. 320px and above.

### Tablet

Portrait and landscape.

### Laptop

Common laptop widths.

### Desktop

Large monitors.

The desktop layout should not simply be a stretched mobile layout.

---

# 38. DESKTOP EXPERIENCE

On desktop/laptop, take advantage of the available space.

A strong layout could be:

Left:

Navigation / workflow

Center:

Main content

Right:

Live print preview / settings

Example:

```text
┌──────────┬──────────────────────────────┬──────────────┐
│ PrintU    │                              │ Preview      │
│           │       Photos                │              │
│ Photos    │       [photo grid]          │   A4 sheet   │
│ Documents │                              │              │
│ Recent    │                              │              │
│           │                              │              │
└──────────┴──────────────────────────────┴──────────────┘
```

But do not force a three-column layout if it hurts usability.

---

# 39. MOBILE EXPERIENCE

On mobile:

- bottom navigation where useful
- full-width primary actions
- large touch targets
- sheets/bottom panels for settings
- sticky Print button where appropriate
- preview optimized for portrait phones
- avoid tiny controls

Never make desktop controls simply shrink down.

---

# 40. TOUCH TARGETS

Interactive elements should be comfortable for fingers.

Do not create tiny icon buttons that are difficult to tap.

---

# 41. ACCESSIBILITY

Support:

- keyboard navigation
- visible focus states
- readable contrast
- semantic controls
- screen-reader-friendly labels
- reduced motion where appropriate
- accessible touch targets

Accessibility must not make the interface visually ugly.

---

# 42. ANIMATION PRINCIPLES

Motion should communicate physical actions.

Good examples:

- photo selection
- paper movement
- page transitions
- print progress
- duplex flipping
- subtle Aurora movement

Avoid:

- endless floating blobs
- excessive bouncing
- random glowing buttons
- unnecessary page transitions
- distracting particle effects

Animation should feel expensive, not loud.

---

# 43. PRINTU'S SIGNATURE PAPER ANIMATION

Create a beautiful reusable paper animation component.

It can be used for:

- printing
- duplex instructions
- completed jobs
- loading print previews

The paper should have realistic but minimal movement.

Do not make it cartoonish.

---

# 44. MICROCOPY

Use short, human language.

Examples:

**What would you like to print?**

**Choose photos**

**Choose a layout**

**Looks good**

**Print**

**Flip the paper**

**Ready?**

**Printing…**

**Done**

Avoid corporate language.

Avoid technical jargon in the main experience.

---

# 45. QUICK PRINT

Provide an optional Quick Print flow.

It should use the user's saved defaults.

Example:

```text
Quick Print

Canon TS3370s
A4
Color
High quality
1 copy

[ Choose file ]

[ Print ]
```

This should be extremely fast.

---

# 46. SAVED PRESETS

Allow useful presets such as:

- Photo Sheet
- School Document
- Black & White
- High Quality Photo

Users can save their own presets if this can be implemented cleanly.

Do not make preset management complicated.

---

# 47. SETTINGS

Settings should be compact.

Sections:

### Printers
- connected printers
- add printer
- default printer

### Printing
- default paper
- default quality
- default color
- default copies

### Appearance
- theme
- reduced motion

### Advanced
- printer diagnostics
- paper-feed calibration
- test page
- local bridge status

---

# 48. PRINTER CALIBRATION

For manual duplex, support a one-time printer-specific calibration workflow.

The user should be guided through a simple test.

PrintU should learn/store:

- flip direction
- rotation
- feed orientation
- printed-side orientation

This information belongs to the selected printer profile.

---

# 49. PRINTER PROFILES

A printer profile can contain:

- printer identifier
- display name
- capabilities
- paper sizes
- color capabilities
- duplex capability
- borderless capability
- manual duplex instructions
- feed orientation
- calibration state

Never assume all printers behave identically.

---

# 50. LOCAL DATA

Use local storage appropriately for:

- preferences
- printer profiles
- recent jobs
- UI settings
- non-sensitive metadata

Avoid storing large original documents permanently unless the user explicitly chooses to save/import them.

Be privacy-conscious.

---

# 51. PRIVACY

Printing often involves:

- school documents
- personal photos
- family documents
- potentially sensitive files

Therefore:

- do not upload documents unnecessarily
- prefer local processing when practical
- clearly indicate when something leaves the device
- provide deletion controls for locally stored temporary files
- avoid analytics that expose document contents
- never send documents to a third-party AI service merely to process them

---

# 52. PERFORMANCE

PrintU must remain lightweight.

Do not turn it into a huge application.

Priorities:

1. Fast startup
2. Fast navigation
3. Efficient image handling
4. Lazy loading
5. Avoid unnecessary dependencies
6. Avoid loading massive assets on startup
7. Avoid memory leaks when handling many images
8. Process large files safely

If 100 high-resolution photos are selected, the application should not freeze the UI.

Use appropriate background processing/workers where necessary.

---

# 53. LARGE IMAGE HANDLING

Thumbnails should not use full-resolution images unnecessarily.

Create efficient preview representations.

Only generate high-resolution output when needed for the final print job.

Release unused image memory.

---

# 54. PDF HANDLING

PDF rendering should be robust.

Support:

- page thumbnails
- page selection
- page count
- page preview
- N-up printing
- selected pages
- all pages
- copies
- orientation
- scaling

Do not render every page at full resolution simultaneously.

---

# 55. FILE HANDLING

Support:

- drag and drop on desktop
- file picker
- photo picker on mobile where available

Clearly show:

- unsupported file type
- corrupted file
- oversized file
- password-protected document
- failed import

Never silently fail.

---

# 56. NO FAKE FEATURES

This is a hard rule.

Do not create buttons that only look functional.

Do not simulate printer discovery.

Do not simulate a successful print job.

Do not fake printer status.

Do not show fake completion.

If a feature cannot be implemented in the current environment, provide a real fallback or clearly communicate the limitation.

---

# 57. NO PLACEHOLDER DESIGN

Do not ship:

- Lorem ipsum
- placeholder printer names
- fake random statistics
- dummy dashboards
- generic cards
- "Coming soon" features
- empty screens without explanation

Use realistic product states.

---

# 58. NO OVERENGINEERING

Do not build infrastructure merely because it is theoretically interesting.

Every technical component must have a product reason.

Prefer:

- simple
- local
- maintainable
- reliable

over:

- distributed
- complicated
- clever
- unnecessary

---

# 59. ARCHITECTURE PRINCIPLE

The implementation technology is deliberately left open.

**Do not blindly follow a prescribed framework/library list from this document.**

Choose the smallest sensible architecture that can satisfy the requirements.

The product must remain maintainable.

Separate major concerns logically:

- UI
- print workflow
- document processing
- image processing
- layout calculation
- printer communication
- printer profiles
- state management
- persistence

The exact implementation is the engineering team's decision.

---

# 60. CORE DATA MODEL

Conceptually, PrintU needs entities similar to:

### PrintJob

- source files
- job type
- selected printer
- paper
- orientation
- layout
- quality
- color mode
- copies
- duplex mode
- page range
- status

### Printer

- identity
- name
- model
- connection
- capabilities
- status
- manual duplex profile

### Preset

- name
- print configuration

### RecentItem

- file metadata
- type
- date
- thumbnail/preview reference where appropriate

Exact implementation is up to Antigravity.

---

# 61. NAVIGATION

Keep navigation predictable.

Possible primary sections:

- Home
- Photos
- Documents
- Recent
- Printers
- Settings

On mobile, reduce navigation to what is actually useful.

Do not create a giant navigation menu.

---

# 62. FIRST-RUN EXPERIENCE

First launch should be short.

Possible sequence:

### Welcome

**Meet PrintU.**

Print without the complicated stuff.

### Printer

**Let's connect your printer.**

### Permissions

Only request permissions when needed.

### Done

**You're ready to print.**

Do not make onboarding a tutorial that takes five minutes.

---

# 63. EMPTY STATES

Every empty state should explain what to do.

Example:

### No printers

**No printer connected yet.**

Make sure your printer is on and connected to your network.

**Add printer**

### No recent documents

**Your recent documents will appear here.**

---

# 64. LOADING STATES

Never show a blank screen.

Use elegant skeletons or meaningful progress states.

For print preparation:

**Preparing your pages…**

For image processing:

**Optimizing photos…**

---

# 65. PRINT PREPARATION PIPELINE

Conceptually:

```text
Input
  ↓
Validate
  ↓
Decode
  ↓
Transform
  ↓
Layout
  ↓
Render
  ↓
Preview
  ↓
Create print-ready output
  ↓
Submit to printer
  ↓
Monitor
  ↓
Complete
```

Each stage must have meaningful error handling.

---

# 66. PRINT PREVIEW ACCURACY

The preview and generated print output should share the same layout logic wherever practical.

Avoid a situation where:

> Preview says one thing but printer receives something different.

The preview should be generated from the same core layout calculations used for final output.

---

# 67. COLOR MANAGEMENT

Do not promise perfect color reproduction across all printers.

Where possible:

- preserve image color information
- avoid destructive transformations
- use printer-supported color modes
- make color enhancement controls predictable

The UI should not claim:

> "This will guarantee perfect colors."

Instead, provide practical control.

---

# 68. DARK MODE

Support dark mode if it can be done elegantly.

Do not simply invert everything.

The print preview itself should remain visually representative of the physical paper.

---

# 69. PWA REQUIREMENTS

The application must have:

- installable manifest
- appropriate icons
- app name
- short name
- theme color
- background color
- proper startup behavior
- offline shell where practical
- standalone display
- responsive viewport
- proper favicon

PWA metadata must be complete and professional.

---

# 70. ICON ASSET REQUIREMENTS

Create/export appropriate sizes and formats.

At minimum, account for:

- favicon
- 192px icon
- 512px icon
- maskable icon where appropriate
- Apple/mobile icon where appropriate

Use the simple white PrintU mark on deep wine red.

Do not generate dozens of unnecessary icon variants.

---

# 71. DESKTOP INSTALLATION

The PWA should feel native when installed on a laptop/desktop.

The app should:

- launch cleanly
- use the available screen efficiently
- avoid browser-like navigation clutter
- maintain proper window layout
- remember useful UI preferences

---

# 72. RESPONSIVE BREAKPOINT PHILOSOPHY

Do not design around a single device.

Use content-driven responsive behavior.

At smaller widths:

- stack controls
- use bottom sheets
- simplify navigation

At medium widths:

- use two-column layouts where useful

At large widths:

- allow preview and controls to coexist

At very large widths:

- prevent content from becoming absurdly wide

---

# 73. VISUAL HIERARCHY

Every screen should have one obvious primary action.

Examples:

Photo selection:

**Continue**

Preview:

**Print**

Duplex:

**Continue**

Error:

**Try again**

Never have five equally prominent buttons.

---

# 74. BUTTON DESIGN

Primary buttons should feel tactile and premium.

Use:

- subtle elevation
- subtle gradient/glow where appropriate
- clear hover state
- pressed state
- disabled state
- focus state

Do not use excessive pill-shaped buttons everywhere.

Use rounded corners consistently, but allow rectangular forms when they communicate structure better.

---

# 75. CARDS

Do not put every element into a card.

Cards should represent meaningful objects:

- document
- printer
- preset
- job

The app should still have breathing room.

---

# 76. ICONOGRAPHY

Use a consistent icon language.

Do not mix:

- random emoji
- unrelated icon packs
- different stroke weights

Emoji can appear only where it genuinely improves familiarity, not as the primary visual system.

---

# 77. PRINTER STATUS

Printer states should be obvious:

- Ready
- Printing
- Offline
- Paper needed
- Error
- Unknown

Use text plus subtle visual indicators.

Never rely on color alone.

---

# 78. PRINT CONFIRMATION

Before printing, the final screen should provide a compact summary:

```text
Canon TS3370s

A4 · Portrait
Color · High quality
4 photos / page
2 pages
1 copy
```

Then:

**Print**

This is the final confidence check.

---

# 79. COMPLETION SCREEN

After a successful job:

```text
✓

All done.

12 pages printed.

[ Print another ]
[ Done ]
```

Keep it calm.

Do not make it feel like a game.

---

# 80. FAILED PRINT

If printing fails:

```text
Something went wrong.

PrintU couldn't complete this job.

[ Try again ]
[ Choose another printer ]
[ Save print-ready file ]
```

Do not erase the user's configuration.

They should be able to retry.

---

# 81. CANCELLATION

If a job is cancellable:

**Cancel printing**

Ask for confirmation only when cancellation could cause confusion.

Never lose the user's prepared layout unnecessarily.

---

# 82. TESTING REQUIREMENTS

Antigravity must test the actual application.

Do not stop after the UI renders.

Test:

### Photos

- one photo
- multiple photos
- large photos
- portrait photos
- landscape photos
- mixed aspect ratios

### Layouts

- 1
- 2
- 4
- 6
- 9

### Documents

- 1-page PDF
- multi-page PDF
- selected pages
- copies
- N-up

### Settings

- portrait
- landscape
- grayscale
- color
- quality changes
- margins
- scaling

### Duplex

- even page count
- odd page count
- different printer feed profiles

### Devices

- phone
- tablet
- laptop
- desktop

### Failures

- printer unavailable
- disconnected network
- invalid file
- oversized image
- unsupported file
- cancelled job

---

# 83. RESPONSIVE QA

Do not only check that elements technically fit.

Check that the application **feels designed** at each size.

Verify:

- no horizontal overflow
- no clipped buttons
- no microscopic controls
- preview remains useful
- dialogs fit
- keyboard works
- touch interactions work
- typography remains balanced

---

# 84. PERFORMANCE QA

Test:

- cold startup
- warm startup
- 1 photo
- 20 photos
- 100 photos
- large PDFs
- long PDFs

Watch for:

- memory growth
- UI freezes
- unnecessary network requests
- oversized bundles
- excessive re-rendering

---

# 85. PRINT RELIABILITY QA

Where real hardware is available, perform real print tests.

Test:

1. normal document
2. photo
3. 4-up photos
4. color
5. grayscale
6. manual duplex
7. multiple copies

Compare:

**Preview → Generated output → Physical paper**

They should agree.

---

# 86. DEVELOPMENT STRATEGY

Do not build the entire system blindly in one pass.

Work in vertical slices.

Recommended sequence:

### Slice 1
Home + navigation + responsive shell.

### Slice 2
Photo import + selection.

### Slice 3
Photo layout engine + preview.

### Slice 4
Image adjustments.

### Slice 5
Documents + PDF preview.

### Slice 6
Print configuration.

### Slice 7
Print-ready output.

### Slice 8
Printer discovery/connection.

### Slice 9
Real print jobs.

### Slice 10
Manual duplex.

### Slice 11
PWA installation.

### Slice 12
Polish + QA.

After each slice, test before proceeding.

---

# 87. AUTONOMOUS EXECUTION RULE

Antigravity should not repeatedly stop to ask:

> "Should I implement X?"

if X is clearly implied by this specification.

Make sensible engineering decisions independently.

Ask for clarification only when:

1. Two requirements genuinely conflict.
2. A required external credential/account is unavailable.
3. Hardware-specific information is required and cannot be discovered.
4. A destructive decision cannot safely be inferred.

Otherwise:

**decide → implement → test → improve.**

---

# 88. ENGINEERING JUDGMENT

If this document contains a technically impossible assumption, do not blindly implement a fake version.

Instead:

1. identify the limitation
2. choose the closest real solution
3. preserve the intended user experience
4. document the tradeoff
5. implement a graceful fallback

The product must remain truthful.

---

# 89. NO UNNECESSARY DEPENDENCY BLOAT

Do not add libraries simply because they are popular.

Before introducing a dependency, ask:

- Is it necessary?
- Is it reliable?
- Is it maintained?
- Does it materially improve the product?
- Can the requirement be implemented simply without it?

Choose the smallest sensible implementation.

---

# 90. CODE QUALITY

Code should be:

- modular
- readable
- maintainable
- typed where appropriate
- logically separated
- tested
- free of obvious duplication

Avoid giant components.

Avoid mysterious global state.

Avoid hard-coded printer-specific behavior scattered throughout the UI.

---

# 91. CONFIGURATION OVER HARD-CODING

Printer behavior should be represented as capabilities/profiles.

Do not write:

```text
if printer === "Canon TS3370s"
```

throughout the application.

Instead, use printer capabilities/profile data.

---

# 92. REAL-WORLD PRINTER COMPATIBILITY

Do not assume every printer supports the same capabilities.

Capabilities may include:

- color
- grayscale
- duplex
- borderless
- paper sizes
- quality modes
- trays
- orientation

The UI should adapt to actual printer capabilities where available.

---

# 93. FALLBACK HIERARCHY

When a capability is unavailable:

1. Use the real capability if supported.
2. Offer a local fallback.
3. Offer system print.
4. Offer print-ready PDF export.
5. Clearly explain the limitation.

Never fake it.

---

# 94. PRINT-READY EXPORT

Always maintain the ability to produce a final print-ready document.

This is important because it provides:

- fallback
- debugging
- sharing
- archival
- compatibility

The user should be able to save the final prepared output when appropriate.

---

# 95. PRIVACY-FIRST DEFAULTS

No account should be required for basic local printing unless a future feature genuinely needs one.

Do not introduce cloud storage just because it is convenient.

PrintU should work primarily as a local utility.

---

# 96. NO AI GIMMICKS

PrintU does not need:

- AI chatbot
- AI assistant
- AI-generated printing suggestions
- unnecessary AI branding

The intelligence is in the workflow itself.

The product should feel like a beautifully engineered tool.

---

# 97. DESIGN REVIEW CHECKLIST

Before calling the UI finished, ask:

- Does it look like a real product?
- Does it look good without screenshots being staged?
- Is there too much glass?
- Are there too many cards?
- Are there too many gradients?
- Is the typography excellent?
- Is the hierarchy obvious?
- Can a child understand it?
- Can a parent use it without help?
- Does desktop feel intentional?
- Does mobile feel intentional?
- Are animations useful?
- Does anything look AI-generated?
- Is anything unnecessarily complicated?

If yes to the last question, simplify.

---

# 98. PRODUCT QUALITY BAR

PrintU should feel like something a small professional product team could ship.

Not:

> "I built this in a weekend."

Instead:

> "This is surprisingly good. Why doesn't my printer software already work like this?"

That is the target.

---

# 99. DEFINITION OF DONE

PrintU is not done when:

- the page loads
- the animations work
- the UI looks pretty
- a fake printer appears

PrintU is done when:

### UX

A normal family member can print without technical assistance.

### Photos

Photos can be selected, arranged, adjusted, previewed, and prepared for printing.

### Documents

Documents can be imported, selected, previewed, configured, and prepared.

### Preview

The preview accurately reflects the intended output.

### Printing

A real supported printer can receive a real print job.

### Duplex

Manual duplex is genuinely guided and printer-profile-aware.

### Responsive

Phone, tablet, laptop, and desktop experiences are polished.

### PWA

The application installs correctly and has professional icons/metadata.

### Reliability

Failures are handled honestly and recoverably.

### Performance

The application remains responsive with realistic workloads.

### Visual quality

The final product feels premium, minimalist, and original.

---

# 100. FINAL ANTIGRAVITY INSTRUCTION

You are not being asked to write a mockup.

You are being asked to **build PrintU**.

Read this entire specification before making architectural decisions.

Then:

1. Inspect the repository/environment.
2. Determine the appropriate implementation strategy.
3. Create the application foundation.
4. Build the responsive design system.
5. Implement the core user flows.
6. Implement the print engine/workflow.
7. Implement real printer communication where technically possible.
8. Implement the local bridge if required.
9. Implement manual duplex correctly.
10. Implement PWA behavior.
11. Create the PrintU icon assets.
12. Test on mobile and desktop layouts.
13. Test realistic printing workflows.
14. Fix problems rather than documenting them as "known issues."
15. Polish the interface.
16. Run a final product-quality review.
17. Leave the repository in a runnable, understandable state.

Do not stop at a prototype if the required functionality can be implemented.

Do not replace difficult functionality with fake UI.

Do not sacrifice usability for technical convenience.

Do not over-engineer.

Do not make the application heavy.

Do not add unnecessary libraries.

Do not turn PrintU into an AI dashboard.

Do not ask unnecessary questions.

**Use engineering judgment.**

The goal is simple:

> **Open PrintU. Choose what you want to print. See exactly what will happen. Press Print.**

Everything else should disappear into the product.

---

# 101. DIRECTOR'S NORTH STAR

When in doubt, use this question:

> **Would my mother, father, younger sibling, or a child be able to use this without me explaining printer technology to them?**

If the answer is no:

**simplify the experience.**

And another:

> **Would I be proud to install this on my own laptop and phone as my everyday printer app?**

If the answer is no:

**keep improving it.**

---

## PRINTU

### Simple printing. Properly designed.

