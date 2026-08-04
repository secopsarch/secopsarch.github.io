# arunkube.org

Personal cloud-native engineering portfolio built with Hugo and the PaperMod theme.

## Design direction

The site uses a calm, editorial layout with warm infrastructure-inspired accents. The home page provides the visual personality: a clear platform-engineering value proposition, fast paths to work and background, and an optional desktop pixel companion. Detail pages prioritise readable content and accessible contrast.

## Content map

- **Home:** positioning, skills, project and resume calls to action.
- **Projects:** concise, structured write-ups for Kubernetes, OpenShift, Azure/Terraform and automation work.
- **About, Resume, Certifications, Contact:** clear professional context and contact route.

## Local development

```bash
hugo server -D
```

For a production check:

```bash
HUGO_CACHEDIR=/tmp/arunkube-hugo-cache hugo --minify --gc
```

## Publish to arunkube.org

The GitHub Actions workflow deploys on pushes to `main`. `static/CNAME` ensures the published artifact requests `arunkube.org`.

1. In the repository’s **Settings → Pages**, select **GitHub Actions** as the source and add `arunkube.org` as the custom domain.
2. Configure the DNS records shown by GitHub Pages at the domain registrar, then enable **Enforce HTTPS** after DNS verification completes.
3. Push this site to `main`; the workflow will build and deploy the `public` artifact.

Before publishing, replace the placeholder-style project narratives with links, outcomes and metrics that you are comfortable making public. Add verified certifications as they become available.
