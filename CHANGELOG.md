# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-22

### Added
- **Model Language Selection**: Target language selector (`Авто`, `Русский`, `Казахский`, `Английский`) to tune speech recognition precision.
- **Batch Upload Language Preset**: Staged 4-way language segmented toggle in `BatchDropzoneModal` so newly imported files inherit the target language.
- **Inline Language Badges**: Quick-access dropdown pills in the audio queue table (`FileTableRow`) allowing 1-click language overrides per file.
- **Re-transcription Workflow**: Dedicated re-run action in both table rows and `TranscriptViewer` to re-process audio with updated language parameters.
- **English Demo Transcript**: Added realistic English presentation speech model transcript to validate multilingual audio output.

### Fixed
- **Dropdown Clipping**: Removed `overflow-hidden` on the file table and added smart upward positioning (`dropup`) for bottom rows to prevent language menus being truncated.
- **Unified Dark Gray Borders**: Standardized all language badge borders to a uniform dark gray (`border-neutral-400`), replacing multi-colored pastels.

## [0.1.0] - 2026-09-21

### Added
- **Multi-File Table View**: Responsive full-width file table replacing disconnected cards, displaying file name, duration, size, and status.
- **Audio Player Card**: Interactive track scrubber, play/pause controls, 5-second skip forward/back, and 0.75x–1.5x speed selector.
- **Transcript Viewer**: Toggle between raw text and timestamped view modes with quick copy and `.txt` file export.
- **Interactive Seeking**: Clicking on any timestamp or segment instantly jumps the audio player to that timestamp.
- **Batch Upload & Dropzone**: Dedicated multi-file upload modal with drag & drop and keyboard Escape dismissal, plus an inline compact dropzone.
- **Batch Export**: Download all completed transcripts in a single `.zip` archive with summary metadata.
- **Bilingual Demo Data**: Authentic Kazakh-Russian mixed Lorem Ipsum sample transcripts reflecting real bilingual conversation.

### Changed
- **Unified Card Headers**: Symmetrical and clean card header structure across all three main panels using Heroicons badges.
- **Minimalist Status Indicator**: Circular SVG progress ring that seamlessly turns into a directional chevron button upon completion.
- **Typography**: Switched to Montserrat font with Cyrillic support and soft header glow.

### Security
- **File Upload Hardening**: Strict MIME-type and extension validation (MP3, WAV, M4A, OGG, FLAC) with a 250 MB size ceiling.
- **Zip Slip Mitigation**: File name sanitization against directory traversal sequences (`..`, `/`, `\`) and invalid characters.
- **Collision Deduplication**: Duplicate file names in batch ZIP exports are automatically disambiguated to prevent data overwrite.
