# Git — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Rebasing a shared branch
- ❌ `git rebase main` on a branch teammates use, then `push --force`.
- ✅ Rebase only your own unpushed work. On shared branches, merge.

### 2. `reset` on pushed commits
- ❌ `git reset --hard HEAD~2 && git push -f` on `main`.
- ✅ Use `git revert` — it adds an undo commit and keeps history.

### 3. `--force` vs `--force-with-lease`
- ❌ `git push --force` overwrites a teammate's new commits.
- ✅ `--force-with-lease` refuses if the remote changed.

### 4. `reset --hard` loses work
- ❌ Running it with uncommitted changes.
- ✅ Those changes are gone (reflog only has commits). Stash first.

### 5. `.gitignore` doesn't untrack
- ❌ Adding `.env` to `.gitignore` after committing it.
- ✅ Also run `git rm --cached .env`.

### 6. Committed a secret
- ❌ Deleting it in a new commit and moving on.
- ✅ It's still in history. **Rotate the secret first**, then clean history.

### 7. fetch vs pull
- ❌ Thinking `fetch` updates your branch.
- ✅ `fetch` only downloads; `pull` = fetch + merge (or rebase).

### 8. Detached HEAD commits
- ❌ Committing after `git checkout <sha>`, then switching away → commits look lost.
- ✅ Create a branch (`git switch -c fix`) to keep them; `reflog` can recover them.

### 9. Huge commits
- ❌ One commit with 3 features and a refactor.
- ✅ Small, focused commits are easier to review, revert and bisect.
