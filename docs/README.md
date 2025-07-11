# Documentation Site

This directory contains the Jekyll-based documentation site for the project, designed to be compatible with GitHub Pages.

## Quick Start

1. **Install dependencies**
   ```bash
   cd docs
   bundle install
   ```

2. **Run locally**
   ```bash
   bundle exec jekyll serve
   ```

3. **View the site**
   Open your browser and navigate to `http://localhost:4000`

## Structure

```
docs/
├── _config.yml          # Jekyll configuration
├── _layouts/            # Page layouts
│   └── default.html
├── _docs/              # Documentation pages collection
│   └── api-overview.md
├── assets/             # Static assets
│   ├── css/
│   │   └── style.scss
│   └── js/
│       └── main.js
├── index.md            # Home page
├── getting-started.md  # Getting started guide
├── docs.md            # Documentation index
├── Gemfile            # Ruby dependencies
└── README.md          # This file
```

## Adding New Documentation

### Creating a New Page

1. Create a new Markdown file in the appropriate directory
2. Add the front matter at the top:
   ```yaml
   ---
   layout: default
   title: Your Page Title
   ---
   ```
3. Write your content in Markdown

### Adding to Collections

For organized documentation, add files to the `_docs/` collection:

1. Create a new file in `_docs/`
2. Add front matter with layout and title
3. The page will automatically be available at `/docs/filename/`

### Navigation

Update the navigation in `_config.yml`:

```yaml
navigation:
  - title: Home
    url: /
  - title: Getting Started
    url: /getting-started/
  - title: Documentation
    url: /docs/
  - title: Your New Page
    url: /your-new-page/
```

## GitHub Pages Deployment

This site is configured to work with GitHub Pages out of the box:

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to the `docs/` folder
3. **Choose theme** (optional) - the site uses a custom theme
4. **Your site** will be available at `https://yourusername.github.io/repository-name/`

## Configuration

### Site Settings

Edit `_config.yml` to customize:

- `title`: Site title
- `description`: Site description
- `baseurl`: If your site is in a subdirectory
- `url`: Your site's URL

### Styling

The site uses custom CSS located in `assets/css/style.scss`. You can:

- Modify variables at the top of the file
- Add custom styles
- Override the default theme

### Features

The documentation site includes:

- **Responsive design** - Works on desktop and mobile
- **Syntax highlighting** - For code blocks
- **Search functionality** - Basic search implementation
- **Copy code buttons** - Easy code copying
- **Scroll to top** - Smooth scrolling navigation
- **Table of contents** - Auto-generated for long pages
- **SEO optimization** - Meta tags and structured data

## Writing Content

### Markdown Features

The site supports standard Markdown plus:

- **Code blocks** with syntax highlighting
- **Tables** with styling
- **Blockquotes** with custom styling
- **Lists** (ordered and unordered)
- **Links** with hover effects

### Front Matter Options

Available front matter variables:

```yaml
---
layout: default        # Layout to use
title: Page Title      # Page title
description: Page desc # Page description (for SEO)
---
```

### Code Blocks

Use triple backticks for code blocks:

````markdown
```javascript
function hello() {
    console.log("Hello, world!");
}
```
````

### Links

- **Internal links**: Use relative paths like `/getting-started/`
- **External links**: Use full URLs like `https://example.com`
- **Anchor links**: Use `#section-name` for same-page navigation

## Customization

### Themes

The site uses a custom theme, but you can:

1. **Switch to a GitHub Pages theme** by changing the `theme` in `_config.yml`
2. **Customize the existing theme** by modifying the CSS and layouts
3. **Create a completely new theme** by replacing the `_layouts/` and `assets/` directories

### Plugins

Enabled plugins:

- `jekyll-feed` - RSS feed generation
- `jekyll-sitemap` - XML sitemap generation
- `jekyll-seo-tag` - SEO meta tags

Add more plugins by editing the `Gemfile` and `_config.yml`.

## Development

### Local Development

1. **Install Ruby** (version 2.7+)
2. **Install Bundler**: `gem install bundler`
3. **Install dependencies**: `bundle install`
4. **Start the server**: `bundle exec jekyll serve`
5. **View changes** at `http://localhost:4000`

### File Watching

Jekyll automatically rebuilds the site when files change. To disable:

```bash
bundle exec jekyll serve --no-watch
```

### Draft Posts

Create draft pages in `_drafts/` - they won't be published but can be previewed with:

```bash
bundle exec jekyll serve --drafts
```

## Troubleshooting

### Common Issues

1. **Bundle install fails**
   - Make sure you have Ruby installed
   - Try `bundle update` instead

2. **Pages not updating**
   - Check for syntax errors in your Markdown
   - Restart the Jekyll server

3. **CSS not loading**
   - Verify the `baseurl` setting in `_config.yml`
   - Check that `style.scss` has the front matter `---`

4. **GitHub Pages not building**
   - Check the GitHub Pages settings
   - Review the build logs in the Actions tab

### Getting Help

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `bundle exec jekyll serve`
5. Submit a pull request

---

*Happy documenting! 📚*