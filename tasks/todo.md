# Tasks: Smart Folder & Batch Ingestion

## Task 1: Утилита рекурсивного сканирования директорий
**Description:** Разработать модуль `src/utils/folderScanner.ts`, который принимает объект `DataTransfer` или список файлов, обходит каталоги с помощью `webkitGetAsEntry()`, циклически забирает все вложенные элементы (обходя ограничение 100 файлов на чанк), фильтрует аудиоформаты и возвращает структурированный результат.

**Acceptance criteria:**
- [x] Функция `scanDroppedItems(dataTransfer: DataTransfer): Promise<ScanResult>` рекурсивно читает папки и подпапки.
- [x] Неаудио файлы (`.jpg`, `.png`, `.pdf`, `.DS_Store` и др.) отсеиваются и подсчитываются в `skippedCount`.
- [x] Ограничение глубины рекурсии (макс. 5) и максимального числа файлов (макс. 200).
- [x] Предоставляется фолбэк на `dataTransfer.files`, если `webkitGetAsEntry` недоступен.

**Verification:**
- [x] `npm run build && npx oxlint` без ошибок.
- [x] Экспорт типов `ScanResult` и тесты логики сканирования.

**Dependencies:** None  
**Files likely touched:** `src/utils/folderScanner.ts`, `src/utils/audioFiles.ts`  
**Estimated scope:** Small (1-2 файла)

---

## Task 2: Компонент информационного уведомления (Toast)
**Description:** Создать компонент `src/components/Notification/NotificationToast.tsx` для отображения результатов сканирования (сколько аудиофайлов добавлено и сколько неаудио-файлов пропущено) с авто-исчезновением через 4 секунды и возможностью закрытия вручную.

**Acceptance criteria:**
- [x] Компонент рендерит аккуратный всплывающий тост в правом нижнем (или верхнем центральном) углу.
- [x] Поддерживает типы: `success`, `info`, `warning`.
- [x] Автоматически исчезает через 4 секунды с плавной анимацией.
- [x] Доступен для скринридеров (`role="status"`, `aria-live="polite"`).

**Verification:**
- [x] Сборка без ошибок.
- [x] Тест анимации и закрытия.

**Dependencies:** None  
**Files likely touched:** `src/components/Notification/NotificationToast.tsx`  
**Estimated scope:** Small (1 файл)

---

## Checkpoint 1: Foundation
- [x] `src/utils/folderScanner.ts` готов и типизирован.
- [x] `NotificationToast` готов к отображению.
- [x] `npm run build && npx oxlint` проходят на 100%.

---

## Task 3: Интеграция сканера в зоны Drag & Drop
**Description:** Обновить `CompactDropZone.tsx` и `BatchDropzoneModal.tsx` для использования `scanDroppedItems`. Отображать анимацию загрузки/сканирования при дропе тяжелых папок.

**Acceptance criteria:**
- [x] В `CompactDropZone` дроп папки извлекает аудиофайлы и передает их в `onFilesDropped`.
- [x] В `BatchDropzoneModal` дроп папки добавляет все найденные аудиофайлы в список выбранных с указанием пути/имени.
- [x] Если в дропе были неаудио файлы, модалка и дропзона возвращают информацию о пропущенных файлах.

**Verification:**
- [x] `npm run build && npx oxlint` проходят без ошибок.

**Dependencies:** Task 1, Task 2  
**Files likely touched:**
- `src/components/FileSelector/CompactDropZone.tsx`
- `src/components/BatchDropzone/BatchDropzoneModal.tsx`

**Estimated scope:** Small (2 файла)

---

## Task 4: Подключение конвейера и обратной связи в App.tsx
**Description:** Связать обновленный импорт с состоянием приложения в `App.tsx`: показ уведомления о найденных и пропущенных файлах, запуск транскрибации для добавленных треков.

**Acceptance criteria:**
- [x] При добавлении папки через любую зону появляется уведомление о результате импорта.
- [x] Новые треки добавляются в список, выбирается первый трек и запускается симуляция транскрибации.
- [x] Все пути и имена корректно отображаются в таблице.

**Verification:**
- [x] `npm run build && npx oxlint` проходят с 0 warnings.
- [x] Проверка в браузере.

**Dependencies:** Task 3  
**Files likely touched:** `src/App.tsx`, `src/components/FileSelector/FileSelector.tsx`  
**Estimated scope:** Small (2 файла)

---

## Checkpoint 2: Core Features
- [x] Дроп папки с аудио + фото + pdf работает в обеих зонах.
- [x] Все неаудио файлы игнорируются, аудиозаписи идут в очередь.
- [x] Тост сообщает пользователю точные цифры импорта.

---

## Task 5: Автоматизированные тесты и верификация
**Description:** Запустить автоматический тест в Headless Chrome CDP для проверки сценариев дропа папок и смешанных файлов, убедиться в отсутствии регрессий и оформить изменения в git.

**Acceptance criteria:**
- [x] Chrome CDP тест подтверждает корректную работу дропа и уведомлений без консольных ошибок.
- [x] `npm run build` и `npx oxlint` завершаются с кодом 0.

**Verification:**
- [x] Результаты теста: 0 browser errors.

**Dependencies:** Task 4  
**Files likely touched:** `scratch/test-folder-drop.mjs`  
**Estimated scope:** Small (1 файл)

---

## Final Checkpoint: Complete
- [x] Все acceptance criteria выполнены.
- [x] Релиз готов к отправке.
