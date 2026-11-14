# Git — One-liners

> The most asked questions, each answered in one sentence.

1. **What is Git?** — A distributed version control system that tracks snapshots of your code.
2. **What is the staging area?** — Where you collect changes before committing them.
3. **`git fetch` vs `git pull`?** — Fetch downloads changes; pull downloads and merges them into your branch.
4. **Merge vs rebase?** — Merge joins histories with a merge commit; rebase replays your commits on top for a straight history.
5. **When should you not rebase?** — On commits that others already have.
6. **`git reset` vs `git revert`?** — Reset moves the branch back (rewrites history); revert adds a new commit that undoes one.
7. **`reset --soft` vs `--mixed` vs `--hard`?** — Soft keeps changes staged, mixed keeps them unstaged, hard deletes them.
8. **What is `git stash`?** — It saves uncommitted changes aside so you can switch work.
9. **What is `cherry-pick`?** — Copying one commit onto the current branch.
10. **What is `git reflog`?** — A log of everywhere HEAD has been, used to recover lost commits.
11. **What is HEAD?** — A pointer to the commit you currently have checked out.
12. **What is detached HEAD?** — Checking out a commit directly instead of a branch.
13. **What is a merge conflict?** — When Git can't combine two changes to the same lines automatically.
14. **What is a fast-forward merge?** — Moving the branch pointer forward when no merge commit is needed.
15. **What is a squash merge?** — Combining all of a branch's commits into one.
16. **What is `.gitignore`?** — A list of files Git should not track.
17. **What is `git bisect`?** — A binary search through history to find the commit that introduced a bug.
18. **`--force` vs `--force-with-lease`?** — Force overwrites the remote; force-with-lease refuses if someone else pushed.
19. **What is trunk-based development?** — Everyone merges small changes into main often, using feature flags.
20. **What is a branch in Git?** — A movable pointer to a commit.
