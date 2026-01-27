# Digital Media Library - Business Requirements Document

## 1. Table of Contents
- [1.1 Intended Audience](#11-intended-audience)
- [1.2 Glossary and Acronyms](#12-glossary-and-acronyms)
- [1.3 References](#13-references)
- [2. Business Overview](#2-business-overview)
    - [2.1 Current State Analysis](#21-current-state-analysis)
    - [2.2 Business Problem or Opportunity](#22-business-problem-or-opportunity)
    - [2.3 Business Objectives (SMART Criteria)](#23-business-objectives-smart-criteria)
- [3. Business Requirements](#3-business-requirements)
    - [3.1 High-Level Business Requirements](#31-high-level-business-requirements)
    - [3.2 Prioritization and Traceability](#32-prioritization-and-traceability)
- [4. Functional Requirements](#4-functional-requirements)
    - [4.1 Overview](#41-overview)
    - [4.2 Functional Requirements Catalogue](#42-functional-requirements-catalogue)
- [5. Data Requirements & Glossary](#5-data-requirements--glossary)
    - [5.1 Data Principles](#51-data-principles)
    - [5.2 Core Data Entities](#52-core-data-entities-business-level-data-dictionary)
    - [5.3 Metadata Requirements](#53-metadata-requirements-minimum-set-for-search)
    - [5.4 Naming Requirements](#54-naming-requirements)
    - [5.5 Glossary Additions](#55-glossary-additions-data-focused)
- [6. Integrations & Dependencies](#6-integrations--dependencies-lean-version-to-avoid-repetition)

## 1. Introduction

### 1.1 Intended Audience
(Content inferred from context) Stakeholders, Developers, Project Managers.

### 1.2 Glossary and Acronyms

| Term | Definition |
| :--- | :--- |
| **DML** | Digital Media Library (this project) |
| **BRD** | Business Requirements Document |
| **MKT** | Marketing (primary source/uploader of event photos) |
| **PCM** | Project and Cost Management (captures project evidence: photos + survey) |
| **SharePoint** | Current storage platform with duplicated assets across multiple sites |
| **SLA** | Service Level Agreement (used here in context of shared-link expectations) |
| **KPI** | Key Performance Indicator |
| **MoSCoW** | Prioritization method: Must/Should/Could/Won’t |
| **RACI** | Responsibility matrix: Responsible/Accountable/Consulted/Informed |
| **NFR** | Non-Functional Requirement (e.g., performance, security) |

### 1.3 References
*   BRD Template (Business Requirements Document Template)
*   Stakeholder elicitation notes / Q&A transcript for DML (provided as elicitation output)

---

## 2. Business Overview

### 2.1 Current State Analysis
Digital content (images and videos) is currently stored and managed in SharePoint, where the same item may be duplicated across two SharePoint locations, resulting in duplicated storage usage and operational confusion. The dataset is described as not clean (inconsistent naming/metadata), with rapid growth that makes content difficult to search and selectively share.

**Primary content sources:**
*   Marketing (MKT): event photos
*   Design: rendered images
*   Project and Cost Management (PCM): project documentation evidence (photos + survey)
*   Video content: stored in the same SharePoint alongside images; users need the ability to filter by type (image vs video)

**Key current pain points:**
*   **Duplicated storage and cost pressure:** Duplication across repositories increases storage usage and cost.
*   **Low findability:** Inconsistent structure/metadata limits effective search and reuse.
*   **Risky/inefficient sharing:** Selective external sharing is difficult when sharing is folder-based; the business needs to share only the required images/videos, not entire folders.

### 2.2 Business Problem or Opportunity

**Business Problem:**
*   The organization is incurring high storage usage due to duplicated images/videos in SharePoint and lacks a single source of truth.
*   Users spend unnecessary effort finding the correct images/videos because metadata and structure are not standardized.
*   External sharing creates policy exposure when users must share folders rather than selected items.

**Opportunity:**
*   Implement Digital Media Library (DML) to migrate legacy images/videos and manage new images/videos going forward in one centralized repository (single source of truth), improving governance, searchability, and controlled sharing while reducing duplication and associated costs.

### 2.3 Business Objectives (SMART Criteria)

| ID | Objective (SMART) | Measure / Data Source | Target / Timeframe |
| :--- | :--- | :--- | :--- |
| **BO-001** | Consolidate images/videos into a single source of truth and reduce duplication, achieving ~50% reduction in total storage footprint versus the current combined SharePoint baseline (estimated). | Storage usage reports (SharePoint vs DML), dedup metrics | Within 6 months after migration completion |
| **BO-002** | Improve retrieval efficiency by reducing the median time to find the right image/video by ~60% versus baseline (estimated). | User time study + system logs (search → open/download) | Within 3 months after go-live |
| **BO-003** | Improve external sharing compliance by ensuring 100% of external shares are performed via DML controlled sharing (item-level selection + access controls once defined), with auditable tracking. | Share/audit logs; periodic compliance review | From go-live, reviewed quarterly |
| **BO-004** | Reduce operational rework caused by duplicates by achieving a near-zero duplicate re-upload rate for already-migrated images/videos (estimated goal). | Duplicate detection logs; upload analytics | Within 6 months after go-live |

---

## 3. Business Requirements

### 3.1 High-Level Business Requirements

| ID | Description | Priority (MoSCoW) | Linked Objective | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **BR-001** | DML shall provide a single, centralized repository for digital media (images/videos) to reduce duplication across current SharePoint storage. | Must | BO-001, BO-004 | New media is stored in DML as the primary location; users can reference/share without creating duplicate copies in multiple locations. |
| **BR-002** | DML shall support uploading exported files only for both images and videos, including folder-based upload aligned with naming rules and configured structure. | Must | BO-001 | Users can upload a folder of exported images/videos successfully and see them organized under the configured structure. |
| **BR-003** | DML shall support large file handling suitable for business usage (including images up to ~150MB). | Must | BO-001 | Representative large images can be uploaded and previewed reliably without workarounds. |
| **BR-004** | DML shall enable a batch preview + curation workflow (preview larger than thumbnail) including tagging and notes, followed by summary and confirmation. | Must | BO-002 | Users can upload → preview items in batch → apply tags/notes → view summary → confirm or return to preview. |
| **BR-005** | DML shall support search-first discovery with filters that at minimum include: Country, Content Type (Image/Video), and Render vs Real. | Must | BO-002 | Users can find media using filters (Country / Type / Render-Real) and open the correct item/album via search results. |
| **BR-006** | DML shall support internal sharing using an album-based model. | Must | BO-002, BO-003 | Users can share an album internally to intended internal users without exposing unrelated content. |
| **BR-007** | DML shall support external sharing of selected media with controlled access (email-style flow + access code + link validity expectations), enabling selective sharing rather than folder exposure. | Must | BO-003 | A user can share selected media externally using DML controls (access code + link settings) and access can expire/revoke per defined policy once finalized. |
| **BR-008** | DML shall support in-browser preview for videos in Phase 1 (not “download-only”). | Must | BO-002 | Users can open and preview a video in the browser from within DML. |
| **BR-009** | DML shall implement a governed permission model including Super Admin (IT), Admin, Standard Member/Contributor, plus Grant Permission by email at album level to designated users. | Must | BO-003 | Super Admin can manage Admin list; Admin can manage configuration; users can Grant Permission by entering an email to grant album-level access. |
| **BR-010** | DML shall provide administrative configuration to manage the root folder structure (configurable, not hard-coded) and prevent destructive actions by non-admin users. | Must | BO-002, BO-003 | Admin can configure root structure; standard users can add media/subfolders under allowed areas but cannot delete the root structure. |
| **BR-011** | DML shall support soft delete governance for major folders/albums to prevent accidental loss (state/status change rather than irreversible removal). | Should | BO-003 | Deleted major folders/albums move to a recoverable state with audit trail; restore is possible per governance rules. |
| **BR-012** | DML shall log critical governance actions (minimum: edit/delete) to support accountability and traceability. | Must | BO-003 | Audit log records who/what/when for edit and delete actions and can be reviewed by authorized roles. |
| **BR-013** | DML shall support content lifecycle management rules (delete-tag grace period, unreviewed cleanup, cold storage, inactivity deletion) to control storage growth—while ensuring cold storage still allows immediate preview. | Must | BO-001, BO-004 | Lifecycle rules can be applied; items in cold storage remain immediately previewable to the end user. |
| **BR-014** | DML should support the ability to migrate legacy SharePoint media after Phase 1 success, to consolidate older content into the single source of truth. | Could | BO-001, BO-004 | A defined migration approach can be executed post-Phase-1 without disrupting ongoing usage; migrated media becomes searchable and shareable in DML. |

### 3.2 Prioritization and Traceability
*   Requirements are prioritized using MoSCoW (Must/Should/Could/Won’t).
*   Each business requirement is linked to at least one business objective (BO-001 to BO-004) to maintain traceability.
*   A full traceability matrix (BO → BR → Functional Requirements) will be maintained in an appendix.

---

## 4. Functional Requirements

### 4.1 Overview
This section defines the functional capabilities DML must provide to support the target workflow: **Upload → Batch Preview/Curation → Summary/Confirm → Search/Reuse → Share (Internal/External) → Lifecycle Governance**, for digital media (images and videos).

### 4.2 Functional Requirements Catalogue

#### 4.2.1 Administration & Configuration

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-ADM-001** | The system shall support roles: Super Admin (IT), Admin, and Standard Member. | Must | Super Admin can access admin console; Admin can access configuration functions; Standard Member cannot access admin console. |
| **FR-ADM-002** | Super Admin shall be able to add/remove Admins. | Must | Super Admin can add/remove an Admin and changes take effect immediately for that user. |
| **FR-ADM-003** | Admin shall be able to configure the root folder structure template (e.g., Market/Entity → Sector → Project folder) with the ability to customize nodes. | Must | Admin can create/edit the root structure template; end users see the updated structure for organizing albums. |
| **FR-ADM-004** | The system shall restrict destructive actions on the root structure: non-admin users cannot delete root folders; deletion follows governance rules. | Must | Standard users cannot delete configured root folders; attempts are blocked and logged. |
| **FR-ADM-005** | The system shall support soft delete for major folders/albums (status/state change). | Should | Deleted major folder/album is not permanently removed; authorized roles can restore per governance rule. |

#### 4.2.2 Library Structure & Albums

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-LIB-001** | The system shall organize media under the configured folder structure and allow users to create/manage albums within permitted locations. | Must | Users can create an album in an allowed folder and see it in the library tree. |
| **FR-LIB-002** | The system shall allow users (where permitted) to create subfolders under existing folders. | Should | A permitted user can create a subfolder; the folder appears in the navigation and is searchable. |
| **FR-LIB-003** | The system shall support album-level ownership (Uploader) and album-level permissions (Designated Users). | Must | Album shows owner/uploader; designated users can access the album according to granted permissions. |
| **FR-LIB-004** | The system shall support moving media items from one album to another album (within permitted locations), without creating duplicate copies. | Must | User can select one or multiple media items and move them to a destination album. After the move, the items appear only in the destination album, and metadata/tags/notes/versions remain attached. Any active External Share Links including the item remain valid. |
| **FR-LIB-005** | When moving media items, the system shall support renaming the moved item(s) to follow naming conventions (manual or system-assisted), while keeping the original file content unchanged. | Must | During/after move, user can rename the item; the displayed name updates and follows agreed naming format. The original file remains preserved. |

#### 4.2.3 Upload & Ingestion

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-UPL-001** | The system shall support upload of exported files only (images and videos). | Must | Users can upload supported exported formats; unsupported source design formats are rejected with clearly error. |
| **FR-UPL-002** | The system shall support folder-based upload into an album. | Must | Users can upload a folder containing multiple files and see all items added to the chosen album. |
| **FR-UPL-003** | The system shall support large image uploads up to ~150MB per image. | Must | A 150MB image can be uploaded, stored, and later previewed successfully. |
| **FR-UPL-004** | The system shall capture required metadata needed for search filters: Country, Content Type (Image/Video), Render vs Real. | Must | Uploaded items are searchable by these fields after metadata entry/confirmation. |
| **FR-UPL-005** | The system shall enforce validation and show clear messages for upload failures (e.g., unsupported type, size limit). | Must | Failed items show reason; successful items are not blocked by failed items. |

#### 4.2.4 Batch Preview & Curation

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-CUR-001** | The system shall provide a batch preview mode that displays media larger than thumbnails. | Must | Users can open an album and view items in batch preview. |
| **FR-CUR-002** | In batch preview, users shall be able to apply curation tags including: delete, selected, share internal. | Must | Tags can be applied/removed; tag state persists and appears in summary. |
| **FR-CUR-003** | In batch preview, users shall be able to add notes to items. | Must | Notes are saved and appear in item details and in the summary list. |
| **FR-CUR-004** | The system shall provide a summary view grouped by tag (and showing sizes and notes list), followed by a confirm step or return-to-preview. | Must | Users can review summary, confirm actions, or go back to preview to adjust before confirming. |
| **FR-CUR-005** | From preview/summary, authorized users can initiate external share link creation for selected items without using a tag. | Must | Authorized user can select items in preview/summary and launch external share link creation without applying any tag; system enforces permissions. |

#### 4.2.5 Media Preview & Basic Processing (Images & Videos)

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-PRV-001** | The system shall support image preview at usable resolution (beyond thumbnail). | Must | Users can open an image and view it clearly without downloading. |
| **FR-PRV-002** | The system shall support in-browser video preview in Phase 1. | Must | Users can play a video inside the application UI (not download-only). |
| **FR-PRV-003** | The system shall generate and display thumbnails for both images and videos. | Must | List/grid views show thumbnails; videos display a poster/thumbnail. |
| **FR-PRV-004** | The system shall support keeping the original file while also providing usable preview representations. | Must | Original file remains available for download; preview does not replace original. |
| **FR-PRV-005** | The system shall support manual crop for images (scope limited to crop; no advanced editing). | Should | User can crop an image and save a cropped version while retaining the original. |
| **FR-PRV-006** | The system shall support image resize while preserving aspect ratio, and shall retain the original file. Resize must support: (A) presets, (B) user-entered %, (C) user-entered dimensions. | Must | User can generate a resized version; aspect ratio preserved. Original file remains unchanged. Resized version saved as separate item with suffix (e.g. `_50pct`). |

#### 4.2.6 Search & Discovery

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-SRC-001** | The system shall provide search/filtering across the library including: Country, Content Type, Render vs Real. | Must | Users can filter results using these fields and open the correct item/album from results. |
| **FR-SRC-002** | The system shall allow browsing via folder structure and also searching without relying on folder navigation alone. | Must | Users can reach items either via browsing or search. |
| **FR-SRC-003** | The system shall support sorting results (e.g., by date uploaded, size). | Should | Users can change sort order and see results update. |

#### 4.2.7 Sharing & Permissions (Internal + “Grant Permission”)

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-PER-001** | The system shall support Grant Permission by email to add a Designated User at the album level. | Must | User enters email; designated user gains access to the album per granted role; action is auditable. |
| **FR-SHI-001** | The system shall support internal sharing to authorized internal users without exposing unrelated folders. | Must | Internal recipients can access the shared album/items per permissions. |

#### 4.2.8 External Sharing

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-SHE-001** | The system shall support external sharing via an email-style flow to share selected media externally. | Must | User can select media and initiate an external share flow. |
| **FR-SHE-002** | External sharing shall require an access code mechanism. | Must | External recipient must provide a code to access shared content. |
| **FR-SHE-003** | External sharing shall support configurable link validity expectations (expiry/availability) and revocation behavior. | Must | System can set validity rules and disable access when revoked/expired. |
| **FR-SHE-004** | External recipients shall be able to download shared media as permitted by policy/settings. | Must | Download works for allowed items; restrictions are enforced. |
| **FR-SHE-005** | System shall provide a “Shared Links” area where authorized users can view share links they created. | Must | Shared Link Management should provide table of shared links (see FR-SHE-006). |
| **FR-SHE-006** | For each link show: created date/time, created by, expiry/TTL remaining, status (active/expired/revoked), recipient list, shared items count. | Must | (As described) |
| **FR-SHE-007** | Detail page shows included media items + security info (access code present, expiry date/time) + revoke status. | Must | (As described) |
| **FR-SHE-008** | Authorized users can revoke a link; effect is immediate. | Must | No one can access resources via the revoked link. |

#### 4.2.9 Intranet Embed/Link

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-INT-001** | The system shall provide an embeddable link/reference for use on the Intranet. | Must | Users can generate a link/reference that can be placed on Intranet pages. |

#### 4.2.10 Audit & Logging

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-AUD-001** | The system shall log edit/delete actions with who/what/when to a database for audit. | Must | Authorized roles can review audit entries for edit/delete actions. |

#### 4.2.11 Lifecycle Management

| ID | Functional Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-LIF-001** | The system shall support lifecycle rules: delete-tag grace period, unreviewed cleanup, cold storage movement, inactivity deletion. | Must | Lifecycle actions can be executed according to configured rules and recorded in audit/history. |
| **FR-LIF-002** | When media is in cold storage, users must still be able to open/preview immediately. | Must | User experience remains “preview immediately” regardless of storage tier. |

---

## 5. Data Requirements & Glossary

### 5.1 Data Principles
*   **Single Source of Truth:** Manage digital media (images/videos) centrally.
*   **Search-First:** Metadata is required for findability beyond folders.
*   **Non-Destructive:** Maintain original files; create derived versions (resize/crop) as separate/linked entities.
*   **Lifecycle Rules:** Enforceable based on metadata, tags, and usage.

### 5.2 Core Data Entities (Business-Level Data Dictionary)

#### 5.2.1 Folder (Configured Structure)
Represents the configured root structure and its nodes (e.g., Market/Entity → Sector → Project folder).
*   **Attributes:** Folder ID, Folder Name, Parent Folder ID, Folder Level, Status, Created By, Created Date.

#### 5.2.2 Album
Primary unit for curation, permissions, and sharing.
*   **Attributes:** Album ID, Album Name, Folder Reference, Owner/Uploader, Country, Content Type (Image/Video/Mixed), Status, Created Date.

#### 5.2.3 Media Item (Image/Video)
Represents an uploaded image or video.
*   **Attributes:** Media ID, Album ID, Media Type, Original Filename, System Display Name, Country, Render vs Real, File Size, Format, Upload Date, Uploaded By, Tags, Status, Lifecycle Dates.

#### 5.2.4 Media Version (Derived Outputs)
Represents resized/cropped versions while keeping the original.
*   **Attributes:** Version ID, Media ID, Version Type, Suffix Naming, Resize Method, Resize Value, Created By, Created Date.

#### 5.2.5 Tag
Tags used in curation and lifecycle actions.
*   **Attributes:** Tag Name, Tag Category, Applies To.
*   **Initial Set:** delete, selected, share internal.

#### 5.2.6 Note
Captures user-entered context for a media item.
*   **Attributes:** Note ID, Media ID, Note Text, Created By, Created Date.

#### 5.2.7 Permission Grant (Designated User)
Represents “Grant Permission by email” at album level.
*   **Attributes:** Grant ID, Album ID, Email, Granted Role/Actions, Granted By, Granted Date, Status.

#### 5.2.8 External Share Link
*   **Attributes:** Share ID, Shared Items (List), Recipient Email(s), Access Code, TTL/Expiry, Revoked Flag, Created By, Created Date, Status.

#### 5.2.9 Audit Log
*   **Attributes:** Audit ID, Event Type (Edit/Delete), Actor, Target Type, Target ID, Timestamp, Details.

### 5.3 Metadata Requirements (Minimum Set for Search)
*   **Country:** Controlled list.
*   **Content Type:** Image / Video.
*   **Render vs Real:** Render / Real (required per media item).

### 5.4 Naming Requirements
*   **Auto-naming pattern:** `country_project_notes(optional)_auto-increment`
*   **Derived media versions suffix:**
    *   Resize: `_50pct` (example)
    *   Crop: `_crop1`

### 5.5 Glossary Additions (Data-Focused)
*   **Digital media:** Images and videos managed in DML.
*   **Album:** The primary grouping unit used for curation, sharing, and permission delegation.
*   **Designated User:** A user granted access via “Grant Permission” by email at the album level.
*   **TTL/Expiry:** Time limit after which an external share link becomes invalid.
*   **Soft delete:** Reversible “status change” deletion.

---

## 6. Integrations & Dependencies (Lean Version to Avoid Repetition)
*   **Intranet:** Provides a link that opens DML (not embedded viewing).
*   **Outlook:** External sharing notifications sent via email.
*   **Storage platform:** Enterprise storage (e.g., Azure File Service) for originals and derived versions.