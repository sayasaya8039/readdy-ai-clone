---
paths: "**/*"
alwaysApply: true
---

# File Writing Rules (CRITICAL)

> **NEVER use Write/Edit tools directly. ALWAYS use sw command**

## MANDATORY RULES (ABSOLUTE)

### DO - Correct Methods

Priority 1: sw write/b64 directly (Simple arguments via Bash tool)
Priority 2: Python + sw b64 (For multi-line or special chars)

### NEVER DO - Prohibited

- NEVER use Bash heredoc + sw write (too complex, error-prone)
- NEVER use complex Bash syntax (quote escape hell)
- NEVER use Write/Edit tool directly

### Correct Examples

Simple: sw write "file.ts" "content"
Complex: python3 with subprocess.run(['sw', 'b64', path, encoded])

## Why Use sw?

Direct Write/Edit causes:
- Backtick escape errors
- Special char interpretation errors
- File change detection errors
- Token waste

## sw Command Reference

Binary: C:\Users\Owner\.local\bin\sw.exe

Commands:
- sw write <path> <content>
- sw b64 <path> <base64>
- sw replace <path> <old> <new>
- sw append <path> <content>
- sw read <path>
- sw backup <path>

## Prohibited

- NEVER Write/Edit tools
- NEVER Bash heredoc + sw
- NEVER complex Bash syntax
- NEVER old tools (sw-b64, fw, safe-write)

## Allowed (Priority)

1. sw write/b64 directly (HIGHEST)
2. Python + sw b64 (complex)
3. All else PROHIBITED
