# Git — Cheat Sheet

> **In one line:** Git saves snapshots of your code so you can go back, work on branches, and merge work from a team.

## The three areas
**Working folder** → `git add` → **Staging area** → `git commit` → **Local repo** → `git push` → **Remote** (GitHub).

## Daily commands
```bash
git status                       # what changed?
git diff                         # see the changes
git add file                     # stage a file
git commit -m "Add login"        # save a snapshot
git log --oneline --graph        # history
git switch -c feature/login      # create and move to a new branch
git pull                         # get and merge others' changes
git push -u origin feature/login # upload your branch
git stash / git stash pop        # park work and bring it back
```

## Merge vs rebase
- **Merge** — joins two branches with a merge commit. Keeps the real history. Safe on shared branches.
- **Rebase** — replays your commits on top of another branch. Clean straight history. **Never rebase commits others already have.**
- **Squash** — combine many commits into one.

## Undoing things
- `git restore file` — throw away unstaged changes.
- `git restore --staged file` — unstage.
- `git reset --soft HEAD~1` — undo the last commit, keep changes staged.
- `git reset HEAD~1` — undo the last commit, keep changes unstaged.
- `git reset --hard HEAD~1` — undo the last commit and **delete** its changes.
- `git revert <id>` — add a new commit that undoes an old one. **Safe for shared branches.**
- `git reflog` — list of everywhere you've been; recovers "lost" commits.

## Other must-knows
- **fetch** — download changes only. **pull** — fetch + merge.
- **cherry-pick** — copy one commit onto your branch (hotfixes).
- **bisect** — binary search for the commit that broke something.
- **HEAD** — where you are now. **Detached HEAD** — you checked out a commit, not a branch.
- **.gitignore** — files Git should never track.
- **Tags** — mark releases: `git tag v1.0.0`.

## Fixing a merge conflict
1. Git marks the conflict in the file: `<<<<<<<` … `=======` … `>>>>>>>`.
2. Edit the file to the correct version; remove the markers.
3. `git add file`, then `git commit` (or `git rebase --continue`).

## Branching strategies
- **GitHub flow** — `main` + short feature branches + pull requests.
- **Git Flow** — `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`.
- **Trunk-based** — tiny branches merged daily, feature flags hide unfinished work.

## How Git stores things
Commits point to snapshots (trees of files). A **branch** is just a pointer to a commit.
