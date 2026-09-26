# Open Please website

A polished, animated, mobile-responsive GitHub Pages website for **Open Please**, a Central Indiana community initiative focused on sensory-considerate STEM, creative, and social experiences for autistic children.

## What is included

- Custom Open Please logo and favicon
- Responsive dark/light themes with saved preference
- Animated constellation background and cursor glow
- Scroll reveals, count-up goals, 3D card tilt, magnetic buttons, and moving gradients
- Mobile navigation and accessible keyboard behavior
- Reduced-motion support for visitors who request it
- Expandable FAQ section
- Contact form that composes an email without requiring a server
- Optional photo slots with animated gradient fallbacks
- Web app manifest and offline cache for faster repeat visits
- Social sharing preview artwork
- No frameworks, package manager, database, or paid service required

## Publish it on GitHub Pages

1. Create a new GitHub repository, such as `open-please`.
2. Upload everything in this folder, including the `assets` folder and `.nojekyll` file.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder, then save.
7. GitHub will publish the site at a URL similar to:
   `https://YOUR-USERNAME.github.io/open-please/`

The site uses relative paths, so it works both at a project URL and at a custom domain.

## Required edit before publishing

Open `index.html` and find this line near the top:

```html
<body data-contact-email="REPLACE_WITH_YOUR_EMAIL">
```

Replace the placeholder with the email address that should receive messages:

```html
<body data-contact-email="your-real-email@example.com">
```

The form opens the visitor's default email application. It does not store data or submit information to a third-party service.

## Optional photos

The website is fully designed without photos. To add your own, put JPG files in `assets/images/` using these exact names:

- `stem-workshop.jpg`
- `creative-play.jpg`
- `community-circle.jpg`

No code changes are needed. The photos automatically appear behind the program artwork. See `assets/images/README.md` for dimensions and consent guidance.

## Easy customization

### Change colors

At the top of `styles.css`, edit these variables:

```css
--purple: #9a7cff;
--mint: #7be0c3;
--peach: #ffad87;
--yellow: #f4dc82;
--blue: #74b7ff;
```

### Change wording or programs

All public text is in `index.html`. Search for headings such as:

- `Different minds. Open possibilities.`
- `Open Lab`
- `Open Studio`
- `Open Circle`
- `First-year launch goals`

The current wording deliberately describes Open Please as a **community initiative in development**, not as an already registered nonprofit or established service provider.

### Change the social sharing image

The source artwork is `assets/og-card.svg`, and the browser-ready image is `assets/og-card.png`. Edit the SVG and export it again as a 1200 × 630 PNG if the messaging changes.

## Preview locally

From this folder, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## File structure

```text
open-please-site/
├── index.html
├── styles.css
├── script.js
├── sw.js
├── site.webmanifest
├── .nojekyll
├── LICENSE
├── README.md
└── assets/
    ├── logo-mark.svg
    ├── favicon.svg
    ├── og-card.svg
    ├── og-card.png
    └── images/
        └── README.md
```

## Before a real program launch

The website is a communications tool, not a substitute for program safeguards. Before hosting activities involving children, work through a qualified community partner on caregiver consent, supervision, volunteer screening and preparation, emergency procedures, privacy, photography consent, and accommodation planning.

## License

The code and original website graphics are provided under the MIT License. Photos you add remain subject to their own permissions and consent requirements.
