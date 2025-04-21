# Setting Up GitHub for National Park Directory

Follow these steps to connect your local repository to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Enter a name for your repository (e.g., "national-park-directory")
4. Optionally add a description
5. Keep the repository public (or select private if you prefer)
6. **Do not** initialize the repository with a README, .gitignore, or license since we already have these files
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see instructions. Follow the "push an existing repository" section.

Run these commands in your terminal:

```bash
# Replace YOUR_USERNAME with your GitHub username and REPO_NAME with your repository name
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

For example, if your GitHub username is "parkexplorer" and repository name is "national-park-directory":

```bash
git remote add origin https://github.com/parkexplorer/national-park-directory.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Setup

1. Refresh your GitHub repository page
2. You should see all your files and the README displayed

## Additional Git Commands

Once set up, here are some common Git commands you'll use:

```bash
# Pull changes from GitHub
git pull

# Check status of your files
git status

# Add new or modified files
git add .

# Commit your changes
git commit -m "Your commit message"

# Push changes to GitHub
git push

# Create and switch to a new branch
git checkout -b new-branch-name

# Switch to an existing branch
git checkout branch-name
```

## Protecting Sensitive Information

Remember that your `.env` file containing API keys should never be pushed to GitHub. It's already in the `.gitignore` file, but always double-check that sensitive information isn't being tracked before pushing.

Use environment variables or secrets in your deployment platform (like Netlify or Vercel) to securely store API keys.

## GitHub Actions (Optional)

You can set up GitHub Actions for continuous integration and deployment. This is an advanced topic that you can explore once you're comfortable with the basic GitHub workflow. 