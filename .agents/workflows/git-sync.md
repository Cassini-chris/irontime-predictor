---
description: how to sync code between laptops using github
---

# Git Sync Workflow

Use this workflow to ensure your work is always up to date on both of your laptops.

## Laptop A: Finishing Your Session
1. Stage all changes:
   ```powershell
   git add .
   ```

2. Commit your progress:
   ```powershell
   git commit -m "update: $(get-date -f 'yyyy-MM-dd HH:mm')"
   ```

3. Push to the remote repository:
   ```powershell
   git push origin main
   ```

## Laptop B: Starting Your Session
1. Ensure your local copy is up to date:
   ```powershell
   git pull origin main
   ```

2. If there are dependency updates:
   ```powershell
   npm install
   ```

## Troubleshooting: Local Conflicts
If you forgot to pull and started working, and `git pull` fails:
1. Stash your current changes:
   ```powershell
   git stash
   ```
2. Pull the remote updates:
   ```powershell
   git pull origin main
   ```
3. Re-apply your stashed changes:
   ```powershell
   git stash pop
   ```
