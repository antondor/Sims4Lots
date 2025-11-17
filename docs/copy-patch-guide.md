# Using the "Copy patch" button

When a pull request or code review shows a **Copy patch** button, it copies a unified diff to your clipboard. You can apply that patch locally without opening a PR using these steps:

## 1. Save the clipboard to a patch file

On macOS:

```bash
pbpaste > change.patch
```

On Linux:

```bash
xclip -selection clipboard -o > change.patch
# or, if you have wl-clipboard on Wayland:
wl-paste > change.patch
```

## 2. Apply the patch

Run `git apply` from the repository root:

```bash
git apply change.patch
```

If the patch applies cleanly, your working tree will have the new files and edits. Review with `git status` and `git diff`.

## 3. If the patch contains commits

Some patches include commit metadata. To keep the commits, use `git am` instead:

```bash
git am change.patch
```

## 4. Resolve conflicts if needed

If `git apply` or `git am` reports conflicts:

1. Open the reported files and resolve `<<<<<<<` conflict markers.
2. Mark files as resolved: `git add <file>`.
3. Continue (for `git am`): `git am --continue`.

## 5. Clean up

After applying, you can delete the temporary patch file:

```bash
rm change.patch
```

With this workflow you can bring the copied patch into your codebase without creating a pull request.
