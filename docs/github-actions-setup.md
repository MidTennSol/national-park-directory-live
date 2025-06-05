# GitHub Actions Blog Automation Setup Guide

This guide walks you through setting up professional GitHub Actions automation for daily blog post generation.

## 🔑 Required GitHub Secrets

You need to configure these secrets in your GitHub repository:

### Step 1: Go to Repository Settings
1. Navigate to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets

Click **New repository secret** for each of these:

#### `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-`)
- **Description**: Required for AI content generation
- **How to get**: 
  1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
  2. Create a new secret key
  3. Copy the key (starts with `sk-`)

#### `AIRTABLE_API_KEY`
- **Value**: Your Airtable personal access token
- **Description**: Required for park data and tracking
- **How to get**:
  1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
  2. Click "Create token"
  3. Give it access to your parks database
  4. Copy the token (starts with `pat`)

#### `AIRTABLE_BASE_ID`
- **Value**: Your Airtable base ID
- **Description**: Identifies your specific parks database
- **How to get**:
  1. Go to your Airtable base
  2. Click "Help" → "API documentation"
  3. Copy the base ID (starts with `app`)

## 🚀 Automation Features

### Daily Automation
- **Schedule**: Runs every day at 7:00 AM UTC (3:00 AM EST)
- **Content**: Generates 600-1200 word comprehensive blog posts
- **SEO**: Optimized with geographic targeting and keywords
- **Tracking**: Updates Airtable records automatically

### Manual Triggering
You can manually trigger blog generation:

1. Go to **Actions** tab in GitHub
2. Click **Daily Blog Post Generation**
3. Click **Run workflow**
4. Optional: Specify park ID or topic
5. Click **Run workflow**

### Workflow Features
- ✅ Connection testing (Airtable + OpenAI)
- 📝 Blog post generation with enhanced prompts
- 🔄 Automatic git commits and pushes
- 📊 Blog statistics reporting
- 🚀 Automatic Vercel deployment
- ❌ Comprehensive error handling

## 📋 Workflow Process

1. **Connection Tests**: Verifies Airtable and OpenAI APIs
2. **Park Selection**: Chooses next available park (geographic diversity)
3. **Content Generation**: Creates 600-1200 word blog post
4. **File Creation**: Saves to `src/content/blog/`
5. **Airtable Update**: Marks park as blogged with metadata
6. **Git Commit**: Commits changes with descriptive message
7. **Deployment**: Vercel automatically deploys the new blog
8. **Statistics**: Reports updated blog generation stats

## 🎯 Content Quality

### Enhanced AI Prompts
- **Length**: 600-1200 words (varied, not fixed)
- **Structure**: 6+ comprehensive sections
- **SEO**: Geographic keywords and long-tail optimization
- **Quality**: Expert-level travel guide content
- **Uniqueness**: Specific details and insider knowledge

### Content Sections
- Introduction with compelling hook (150-250 words)
- Historical/cultural background (200-300 words)
- Activities and attractions guide (250-350 words)
- Practical visitor information (150-250 words)
- Tips for different visitor types (200-300 words)
- Regional attractions and context (100-200 words)
- Inspiring conclusion with call-to-action (100-150 words)

## 🔍 Monitoring and Logs

### Success Indicators
- ✅ New blog file in `src/content/blog/`
- 📝 Descriptive commit message with park name
- 🚀 Automatic Vercel deployment
- 📊 Updated blog statistics

### Troubleshooting
Check the **Actions** tab for detailed logs if issues occur:

- **Connection failures**: Check API keys and permissions
- **No content generated**: All parks may have blogs already
- **Generation errors**: OpenAI API issues or quota limits
- **Commit failures**: GitHub permissions or token issues

## 🔄 Customization Options

### Modify Schedule
Edit `.github/workflows/daily-blog-automation.yml`:
```yaml
schedule:
  - cron: '0 7 * * *'  # Daily at 7 AM UTC
  # Change to: '0 12 * * *' for noon UTC
  # Or: '0 9 * * 1,3,5' for Mon/Wed/Fri at 9 AM
```

### Change Blog Topics
The workflow supports topic variations:
- `complete visitor guide` (default)
- `family adventure guide`
- `photography guide`
- `hiking and trails guide`
- `historical exploration`
- `seasonal spotlight`

### Manual Generation
You can specify exact parks or topics when manually running the workflow.

## 📈 Expected Results

### Blog Output
- **Daily posts**: One comprehensive blog per day
- **Word count**: 600-1200 words (varied)
- **SEO optimized**: Geographic keywords and meta descriptions
- **Professional quality**: Expert travel guide content

### Site Integration
- **Auto-deployment**: Vercel deploys within 2-3 minutes
- **Blog listing**: New posts appear on `/blog` automatically
- **Search-friendly**: SEO optimized for park name + location
- **Mobile ready**: Responsive design with proper formatting

## 🎉 Activation

Once you've added all three secrets:

1. **Test manually**: Go to Actions → Run workflow
2. **Check output**: Verify blog post is generated
3. **Confirm deployment**: Check your live site
4. **Monitor daily**: Automation runs every day at 7 AM UTC

The system will generate professional, SEO-optimized blog content automatically, helping grow your site's content and search engine visibility!

## 🔒 Security Notes

- Never commit API keys to your repository
- Use GitHub secrets for all sensitive data
- Rotate API keys periodically for security
- Monitor usage to stay within API limits 