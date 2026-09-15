# Markdown Documentation Governance

## Purpose

Keep Markdown documentation concise, purposeful, and appropriately scoped.

Do not use Markdown files as a general-purpose storage for implementation knowledge, development history, internal application details, or information that does not belong to the document's explicit purpose.

Each Markdown file has a defined responsibility. Always place information in the appropriate document and avoid duplication.

---

## General Rules

1. Before adding or modifying content in any `.md` file, determine whether the information belongs to that file based on its purpose.

2. Do not add information merely because it may be useful for future development.

3. Do not document implementation details unless the target document explicitly exists for technical documentation.

4. Do not expose or duplicate internal application knowledge in documents intended for users, customers, reviewers, or other external parties.

5. Keep documentation concise. Prefer short, precise statements over lengthy explanations.

6. Do not document obvious implementation details, internal call flows, private methods, function references, class relationships, internal data structures, or source-code-level details unless they are explicitly required by `architecture.md` or another dedicated technical document.

7. Do not duplicate the same information across multiple Markdown files. If information belongs to a specific document, keep the authoritative version there and reference it conceptually rather than copying it elsewhere.

8. Do not create new Markdown files unless there is a clear and justified documentation purpose.

9. Do not turn documentation into a detailed narrative of development activities. Record only information that provides lasting value.

10. When in doubt, prefer less documentation rather than more documentation.

---

## CLAUDE.md

`CLAUDE.md` is an instruction file for Claude Code.

It must contain only information required to guide Claude Code's behavior when working with the repository.

Allowed content includes:

* coding conventions;
* architectural constraints that Claude must follow;
* development workflow rules;
* testing requirements;
* build and validation commands;
* important repository-specific instructions;
* restrictions and things Claude must not do;
* concise references to authoritative project documentation.

Do NOT use `CLAUDE.md` as a technical documentation repository.

Do NOT place the following in `CLAUDE.md` unless strictly required as an instruction:

* detailed application architecture;
* descriptions of internal application functionality;
* detailed class/module relationships;
* lists of functions, methods, handlers, services, or their relationships;
* detailed implementation flows;
* source-code-level explanations;
* detailed descriptions of database schemas;
* detailed API behavior;
* historical changes;
* long explanations of how existing functionality works;
* duplicated content from `architecture.md`;
* information that belongs in `README.md`, `CHANGELOG.md`, or `PRIVACY_POLICY.md`.

If Claude needs detailed technical context, consult the appropriate technical documentation or inspect the source code instead of expanding `CLAUDE.md`.

Keep `CLAUDE.md` minimal and instruction-oriented.

---

## architecture.md

`architecture.md` is the authoritative document for high-level technical architecture.

Technical information may be documented here when it provides meaningful architectural value.

Allowed content includes:

* system architecture;
* major components and boundaries;
* service/module responsibilities;
* important dependencies;
* architectural relationships;
* data flow at an architectural level;
* integration boundaries;
* significant architectural decisions;
* relevant technical constraints.

Technical details may be included when necessary to explain the architecture, but avoid documenting implementation details that can be directly understood from the source code.

Do not turn `architecture.md` into a complete source-code reference.

Do not document every class, method, function, file, or implementation step.

Do not use `architecture.md` as a changelog.

---

## CHANGELOG.md

`CHANGELOG.md` records externally meaningful changes to the project.

Each entry must clearly and concisely describe what was:

* Added;
* Changed;
* Fixed;
* Removed;
* Deprecated;
* Security-related.

Describe the result or behavior change, not the internal implementation.

Good:

* Added filtering by order status.
* Fixed incorrect calculation of invoice totals.
* Removed the deprecated export option.
* Updated authentication requirements.

Bad:

* Added `OrderFilterHandler` and connected it to `OrderQueryService`.
* Changed `CalculateTotalAsync()` to use `InvoiceCalculator`.
* Added a new repository method and modified the controller flow.

Do not include:

* internal function names;
* class names;
* method names;
* file paths;
* internal call chains;
* implementation algorithms;
* detailed technical explanations;
* developer notes;
* debugging history;
* descriptions of how the change was implemented.

The CHANGELOG should answer:

> What changed from the user's, product's, or system's perspective?

It should NOT answer:

> How was the change implemented internally?

Keep entries short, clear, and understandable without knowledge of the source code.

---

## README.md

`README.md` is the primary general-purpose project introduction and usage document.

It may contain:

* what the project is;
* its purpose;
* key capabilities;
* prerequisites;
* installation/setup instructions;
* basic configuration required to run it;
* basic usage;
* links to relevant documentation.

Do NOT include:

* detailed internal architecture;
* implementation details;
* internal class/function relationships;
* source-code-level explanations;
* development history;
* detailed technical design decisions;
* internal security mechanisms unless required for setup or usage;
* information that belongs in `architecture.md`.

The README should be understandable to someone who needs to understand, install, run, or use the project without exposing unnecessary internal implementation knowledge.

---

## PRIVACY_POLICY.md

`PRIVACY_POLICY.md` must contain only privacy-related and legally relevant information.

It may describe:

* what personal data is collected;
* why data is collected;
* how data is used;
* data retention;
* data sharing;
* user rights;
* security/privacy commitments;
* contact information required for privacy matters;
* other legally relevant privacy information.

Do NOT include:

* application architecture;
* implementation details;
* internal services or modules;
* source-code references;
* database implementation;
* internal APIs;
* technical development notes;
* changelog information;
* general project documentation.

Technical details should only be included when they are genuinely necessary to explain a privacy-related matter.

---

## Change Documentation Workflow

When making a code change:

1. Modify the source code.
2. Determine whether the change requires documentation.
3. If it does, identify the appropriate Markdown file based on the purpose of the information.
4. Update only the relevant document.
5. Keep the update concise.
6. Do not copy implementation details into user-facing documentation.
7. Do not add technical details to `CLAUDE.md` merely because they were discovered during implementation.
8. Do not document internal implementation unless the change represents a meaningful architectural decision that belongs in `architecture.md`.

---

## Information Classification

Before writing Markdown, classify the information:

### "How should Claude Code work?"

→ `CLAUDE.md`

### "How is the system architected?"

→ `architecture.md`

### "What changed?"

→ `CHANGELOG.md`

### "What is this project and how do I use/run it?"

→ `README.md`

### "What is the privacy/legal policy?"

→ `PRIVACY_POLICY.md`

If the information does not clearly fit one of these purposes, do not add it automatically.

---

## Documentation Quality Standard

Every Markdown change must satisfy these requirements:

* Relevant to the document's purpose.
* Concise.
* Non-duplicative.
* Appropriate for the intended audience.
* Free from unnecessary implementation details.
* Does not expose internal information unnecessarily.
* Provides lasting value.

Prefer:

> concise, factual, purpose-specific documentation

over:

> exhaustive documentation of everything Claude discovered while modifying the project.

When a shorter statement communicates the same information, always use the shorter statement.
