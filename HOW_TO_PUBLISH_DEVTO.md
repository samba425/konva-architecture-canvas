# How to Publish on Dev.to - Step by Step Guide

## Method 1: Using the Dev.to Web Editor (Easiest)

### Step 1: Create a Dev.to Account
1. Go to https://dev.to
2. Click "Create Account" (top right)
3. Sign up with:
   - GitHub (recommended - faster)
   - Twitter
   - Email

### Step 2: Create a New Post
1. Once logged in, click "Create Post" (top right)
2. You'll see the editor with:
   - Title field
   - Tags field
   - Body editor
   - Cover image option

### Step 3: Copy Your Content

**From ARTICLE_DEVTO.md, copy everything AFTER the front matter:**

Start copying from line 12:
```
# 🎨 I built a Visual Architecture Diagram Builder for Angular
```

**DO NOT copy these lines** (they're for frontmatter only):
```
---
title: "Show HN: Visual Architecture Diagram Builder in Angular with 47+ Components"
published: true
description: "Built an open-source architecture diagram tool..."
tags: angular, javascript, showdev, opensource
cover_image: https://via.placeholder.com/...
---
```

### Step 4: Fill in the Fields

**Title:**
```
Show HN: Visual Architecture Diagram Builder in Angular with 47+ Components
```

**Tags:** (Dev.to allows up to 4 tags)
```
angular
javascript
showdev
opensource
```

**Body:**
Paste the content starting from "# 🎨 I built a Visual..."

### Step 5: Add Cover Image (Optional but Recommended)
1. Click "Add a cover image"
2. Upload your own screenshot OR
3. Create one at https://www.canva.com (1000x420px recommended)

### Step 6: Preview
1. Click the "Preview" button (top right)
2. Check formatting
3. Make sure code blocks look good
4. Check all links work

### Step 7: Publish!
1. Click "Publish" button (top right)
2. Your post is live! 🎉

---

## Method 2: Using Dev.to API (For Automation)

### Step 1: Get API Key
1. Go to https://dev.to/settings/extensions
2. Scroll to "DEV Community API Keys"
3. Click "Generate API Key"
4. Copy and save it securely

### Step 2: Use the API

```bash
# Create post using curl
curl -X POST https://dev.to/api/articles \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "article": {
      "title": "Show HN: Visual Architecture Diagram Builder in Angular with 47+ Components",
      "published": false,
      "body_markdown": "# 🎨 I built a Visual Architecture Diagram Builder for Angular\n\n...",
      "tags": ["angular", "javascript", "showdev", "opensource"],
      "description": "Built an open-source architecture diagram tool with Angular & Konva.js"
    }
  }'
```

---

## Method 3: Import from GitHub (Advanced)

### Step 1: Push to GitHub
Your ARTICLE_DEVTO.md is already in GitHub!

### Step 2: Connect Dev.to to GitHub
1. Go to https://dev.to/settings/extensions
2. Find "Publishing from RSS" section
3. Or use GitHub Actions (more complex)

---

## 📝 Quick Publishing Checklist

Before you hit publish:

- [ ] Title is catchy and clear
- [ ] Tags are relevant (max 4)
- [ ] Cover image is added (1000x420px)
- [ ] All code blocks have language specified
- [ ] Links are working
- [ ] Demo link is tested
- [ ] npm package name is correct
- [ ] GitHub link is correct
- [ ] No typos (use Grammarly)
- [ ] Call-to-action is clear
- [ ] You're ready to engage with comments!

---

## 🎨 Creating a Cover Image

### Option 1: Canva (Free)
1. Go to https://www.canva.com
2. Create custom size: 1000 x 420 pixels
3. Use template or design from scratch
4. Add text: "Konva Architecture Canvas"
5. Add subtitle: "Visual Diagram Builder for Angular"
6. Use dark theme colors (#1a1a2e background)
7. Download as PNG

### Option 2: Online Tools
- https://www.bannersnack.com/
- https://www.figma.com/ (free)
- https://www.photopea.com/ (Photoshop alternative)

### Option 3: Take Screenshot
1. Open your demo: https://samba425.github.io/konva-architecture-canvas/
2. Take a screenshot
3. Resize to 1000x420px
4. Add title overlay

---

## 📊 After Publishing

### Immediate (First Hour):
1. ✅ Share on Twitter with #DEVCommunity tag
2. ✅ Share on LinkedIn
3. ✅ Post in Angular Discord/Slack communities
4. ✅ Monitor comments and respond quickly

### First Day:
1. ✅ Respond to ALL comments
2. ✅ Thank people who engage
3. ✅ Share interesting discussions on Twitter
4. ✅ Check Dev.to analytics

### First Week:
1. ✅ Crosspost to Medium (set canonical URL)
2. ✅ Update GitHub README with "Featured on Dev.to" badge
3. ✅ Engage with related posts
4. ✅ Follow people who comment

---

## 💡 Pro Tips for Dev.to

### 1. Best Time to Publish
- **Tuesday-Thursday**: 8-10 AM EST (best engagement)
- **Avoid**: Friday afternoon, weekends (lower traffic)

### 2. Engage Early and Often
- Respond to comments within 1 hour
- Thank everyone who engages
- Answer questions thoroughly

### 3. Use the Right Tags
Best performing tags for your content:
- `angular` (primary)
- `javascript` (broad reach)
- `showdev` (for showcasing projects)
- `opensource` (community loves this)

Alternative tags:
- `webdev`
- `typescript`
- `tutorial`
- `beginners`

### 4. Write Engaging Titles
Good title formulas:
- "I built [thing] with [tech]"
- "How I [achieved result] using [approach]"
- "Show HN: [Project name] - [One line description]"
- "[Number] [things] I learned building [project]"

### 5. Structure Matters
- Start with TL;DR
- Use headers (##, ###)
- Include code examples
- Add images/GIFs
- End with call-to-action

### 6. Crosslink Content
Link to:
- Your other Dev.to articles
- Related community posts
- Useful resources
- Your GitHub

---

## 🎯 What to Expect

### Realistic Metrics (First Week):
- **Views**: 500-2,000
- **Reactions**: 20-100 ❤️
- **Comments**: 5-20
- **Followers**: 10-50
- **npm downloads**: +50-200

### If It Goes Viral:
- **Views**: 10,000+
- **Reactions**: 500+
- **Comments**: 50+
- **Top 7** badge on Dev.to
- **Featured** on Dev.to homepage

---

## 🔗 After Publishing - Add Badges

Once published, add to your GitHub README:

```markdown
## 📝 Featured On

[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](YOUR_DEVTO_ARTICLE_URL)
```

---

## 🚨 Common Issues & Solutions

### Issue: Code blocks not formatting
**Solution**: Add language after triple backticks
```typescript  ← Specify language
export class MyComponent {}
```

### Issue: Images not showing
**Solution**: Use full URLs, not relative paths
```markdown
![Demo](https://full-url-to-image.com/image.png)
```

### Issue: Low engagement
**Solution**: 
- Respond to every comment
- Share in relevant communities
- Use better title/cover image
- Post at optimal times

### Issue: Getting criticism
**Solution**: 
- Thank them for feedback
- Ask clarifying questions
- Consider implementing suggestions
- Stay professional and friendly

---

## ✅ Ready to Publish?

**Final Step-by-Step:**

1. Go to https://dev.to/new
2. Title: "Show HN: Visual Architecture Diagram Builder in Angular with 47+ Components"
3. Tags: angular, javascript, showdev, opensource
4. Body: Copy from ARTICLE_DEVTO.md (line 12 onwards)
5. Cover: Upload your screenshot
6. Preview: Check everything
7. Publish: Hit the button! 🚀
8. Share: Tweet it immediately
9. Engage: Respond to comments
10. Celebrate: You're published! 🎉

---

## 📞 Need Help?

If you have issues:
- Dev.to Help: https://dev.to/help
- Dev.to Forem: https://forem.dev/
- Dev.to Twitter: @ThePracticalDev
- Or message me!

---

**Good luck with your Dev.to debut! 🚀**

Remember: The content is great, but engagement is what makes it successful. Be present, be helpful, and be yourself!
