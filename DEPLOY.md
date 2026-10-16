# Deploy GitHub Pages

1. Create a **public** GitHub repository named `gui-cong-minh`.
2. Upload all files and folders from this project to the repository root, including `.github/workflows/deploy.yml` (using git is recommended to preserve hidden folders).
3. Settings > Pages > Build and deployment > Source: **GitHub Actions**.
4. Push to branch `main`. Wait for the Deploy to GitHub Pages workflow to succeed.
5. Visit `https://YOUR_USERNAME.github.io/gui-cong-minh/`.

Git commands:
```bash
git init
git add .
git commit -m "Initial letter website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gui-cong-minh.git
git push -u origin main
```

Note: the site is publicly accessible to anyone with the URL, and repository contents are public.
