git checkout --ours README.md
git add README.md
git add prompt-quest sync.sh 2>/dev/null
git commit -m "Merge: keep project README"
git push -u origin main
