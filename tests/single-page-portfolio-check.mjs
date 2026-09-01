import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../assets/js/index-new.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../assets/css/style-new.css', import.meta.url), 'utf8');
const manifestText = fs.readFileSync(new URL('../agent-manifest.json', import.meta.url), 'utf8');
const manifest = JSON.parse(manifestText);
const openAiSvg = fs.readFileSync(new URL('../assets/openai.svg', import.meta.url), 'utf8');
const cloudSvg = fs.readFileSync(new URL('../assets/cloud.svg', import.meta.url), 'utf8');
const heroHintSvg = fs.readFileSync(new URL('../assets/arr.svg', import.meta.url), 'utf8');
const normalized = html.replaceAll('&amp;', '&');
const heroTitleMarkup = html.match(/<h4 id=["']hero-title["'][^>]*>([\s\S]*?)<\/h4>/)?.[1] ?? '';

for (const id of ['top', 'about', 'experience', 'projects', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id} anchor`);
}

assert.match(html, /data-scroll-target=["']#about["']/, 'About navigation target missing');
assert.match(html, /data-work-filter=["']design["']/, 'Experience navigation must activate Experience');
assert.match(html, /data-work-filter=["']development["']/, 'Projects navigation must activate Projects');
assert.match(html, /data-scroll-target=["']#contact["']/, 'Contact navigation target missing');
assert.match(html, /data-scroll-target=["']#top["']/, 'Bright Owusu mark must return to hero');

assert.doesNotMatch(html, />\s*Home\s*</i, 'Home must not appear as a menu item');
assert.doesNotMatch(html, /works\/work\.html/i, 'legacy Work-page link remains');
assert.doesNotMatch(html, /about\/about\.html/i, 'legacy About-page link remains');
assert.doesNotMatch(html, /certifications-btn|Certifications?/i, 'certification UI remains');

assert.match(html, /class=["'][^"']*design-btn[^"']*active[^"']*["']/, 'Experience selector must be active by default');
assert.match(html, /class=["'][^"']*development-btn[^"']*["']/, 'Projects selector missing');
assert.match(html, /class=["']section work-tiles grid-fade grid-columns-part["']/, 'mobile tile rendering missing');
assert.match(html, /id=["']projectModal["']/, 'experience detail modal missing');
assert.match(html, /data-description=["'][^"']+["']/, 'experience modal descriptions missing');
assert.match(html, /id=["']github-activity["']/, 'GitHub activity section missing');
assert.match(html, /data-github-card/, 'GitHub activity card hook missing');
assert.match(html, /data-github-grid/, 'GitHub contribution grid missing');
assert.match(
  html,
  /class=["'][^"']*github-follow-links[^"']*["'][\s\S]*?<a(?=[^>]*class=["'][^"']*github-card-trigger[^"']*["'])(?=[^>]*href=["']https:\/\/x\.com\/omariii_vs\?s=11["'])[^>]*>[\s\S]*?<strong>Twitter<\/strong>[\s\S]*?<\/a>/,
  'Twitter follow link must sit beside GitHub and share its link styling',
);
assert.match(css, /\.github-follow-links \{[^}]*display: flex;[^}]*align-items: flex-end;[^}]*justify-content: space-between;/, 'GitHub and Twitter follow links must render inline');
assert.match(js, /function initGithubCard/, 'GitHub card initializer missing');
assert.match(js, /github-contributions-api\.jogruber\.de/, 'GitHub contribution endpoint missing');
assert.match(js, /total\.textContent = `\$\{contributionTotal\.toLocaleString\(\)\} contributions`;/, 'GitHub total should not include a year');
assert.doesNotMatch(js, /contributionTotal\.toLocaleString\(\)\} contributions in \$\{year\}/, 'GitHub total still includes a year');
assert.match(js, /const colors = \['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'\]/, 'GitHub contribution colors missing');
assert.match(css, /background: #0e4429;[\s\S]*?background: #006d32;[\s\S]*?background: #26a641;[\s\S]*?background: #39d353;/, 'GitHub legend must use green contribution colors');
assert.doesNotMatch(html, /ask-agent-wrap|ask-agent-providers|ask-agent-trigger/, 'About section Ask Agent controls should be removed');
assert.match(html, /id=["']ask-agent-hanger["']/, 'Header Chat Agent control missing');
assert.match(html, /Ask your agent about me/, 'Header Chat Agent label missing');
assert.match(html, /src=["']assets\/openai\.svg(?:\?[^"']*)?["']/, 'Header OpenAI image missing');
assert.match(html, /<img[^>]*id=["']hero-arrow["'][^>]*src=["']assets\/cl\.png["']/, 'Hero image should use cl.png');
assert.match(html, /<span class=["']name-primary["']>Bright Omari Owusu<\/span>\s*<span class=["']name-role["']>Cloud\/SWE<\/span>/, 'Static name lockup should include the name and Cloud/SWE role');
assert.doesNotMatch(html, /class=["']name-h1["'][^>]*data-scroll/, 'Hero name should not use marquee scrolling');
assert.doesNotMatch(js, /initScrollLetters\(\);/, 'Hero name should not initialize marquee scrolling');
assert.doesNotMatch(html, /class=["']overlay personal-image[^"']*data-scroll/, 'Hero cloud should not use scroll-driven parallax');
assert.doesNotMatch(js, /initArrowPointing|updateArrowPosition/, 'Hero cloud should not use scroll-driven rotation');
assert.match(css, /@media screen and \(min-width: 1025px\) \{[\s\S]*?\.home-header \.personal-image img \{[\s\S]*?height: 45\.5%;/, 'Hero image should be scaled to 1.3x on desktop');
assert.match(css, /\.home-header \.personal-image img \{[^}]*animation: hero-cloud-bob/, 'Hero cloud should have a lightweight float animation');
assert.match(css, /@keyframes hero-cloud-bob/, 'Hero cloud animation keyframes missing');
assert.match(css, /--hero-cloud-bob-tilt: -2deg;[\s\S]*?--hero-cloud-bob-tilt: 2deg;/, 'Hero cloud should have a soft animated tilt');
assert.match(js, /function initHeroCloudInteraction/, 'Hero cloud cursor interaction missing');
assert.match(js, /addEventListener\(['"]pointermove['"]/, 'Hero cloud should respond to pointer movement');
assert.doesNotMatch(js, /pointerType === ['"]touch['"]\) return/, 'Hero cloud should respond to touch movement');
assert.match(css, /\.home-header \.personal-image img \{[^}]*touch-action: none;/, 'Hero cloud should support touch interaction');
assert.match(js, /--hero-cloud-tilt/, 'Hero cloud should lean toward the cursor');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.home-header \.personal-image img \{[^}]*animation: none;/, 'Hero cloud motion should respect reduced-motion preferences');
assert.doesNotMatch(html, /class=["']arrow big["']|header-above-h4/, 'Hero arrow decoration should be removed');
assert.doesNotMatch(css, /header-above-h4/, 'Hero arrow decoration styles should be removed');
assert.match(html, /<h4 id=["']hero-title["'][^>]*>\s*<img[^>]*class=["'][^"']*hero-title-icon[^"']*["'][^>]*src=["']assets\/cloud\.svg["'][^>]*alt=["']Cloud["']/, 'Hero title should retain the cloud icon');
assert.doesNotMatch(heroTitleMarkup, /Software Engineer/, 'Hero title should no longer show Software Engineer');
assert.match(heroTitleMarkup, /Engineer/, 'Hero title should retain Engineer beside the cloud icon');
assert.match(html, /<img[^>]*class=["'][^"']*hero-title-hint[^"']*["'][^>]*src=["']assets\/arr\.svg["']/, 'Hero title hint arrow missing');
assert.match(html, /class=["']hero-title-group["'][\s\S]*?id=["']hero-tech-stack["'][^>]*class=["'][^"']*hero-tech-stack[^"']*["']/, 'Hero technology stack markup missing');
for (const technology of ['GCP', 'AWS', 'Azure', 'DigitalOcean', 'Python', 'Go', 'Terraform', 'TypeScript']) {
  assert.match(html, new RegExp(`>${technology}<`), `Hero technology ${technology} missing`);
}
assert.match(cloudSvg, /fill=["']#fff["']/i, 'Cloud SVG must be white');
assert.match(heroHintSvg, /fill:#FFFFFF/i, 'Hero title hint arrow must be white');
assert.match(css, /\.home-header \.hero-title-icon \{[^}]*width: 1\.8em;/, 'Cloud SVG sizing is missing');
assert.match(css, /\.home-header \.hero-title-icon \+ span \{[^}]*display: inline-block;/, 'Cloud icon and Engineer label must align inline');
assert.match(css, /\.home-header \.row \.flex-col h4 \{[^}]*display: flex;[^}]*align-items: center;[^}]*gap: \.3em;[^}]*white-space: nowrap;/, 'Cloud icon and Engineer label must stay on one line with spacing');
assert.match(css, /\.home-header \.row \.flex-col h4#hero-title \{[^}]*font-size: 2em;/, 'Hero title should be scaled up');
assert.match(css, /\.home-header \.hero-title-group \{[^}]*top: 41\.9vh;/, 'Hero title should align with the resized name lockup on larger screens');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.home-header \.personal-image img \{[\s\S]*?height: 35%;[\s\S]*?\.home-header \.hero-title-group \{[\s\S]*?top: 11vh;/, 'Hero title and agent icon should align on small screens');
assert.match(css, /\.home-header \.row \.flex-col h4#hero-title::after \{[^}]*transform: scaleX\(1\);/, 'Hero title underline should be permanently visible');
assert.match(css, /\.hero-tech-stack \{[^}]*display: grid;[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/, 'Hero technologies should use two columns');
assert.match(css, /\.home-header \.hero-tech-stack \{[^}]*opacity: 1;[^}]*visibility: visible;[^}]*pointer-events: auto;[^}]*transform: translateY\(0\);/, 'Hero technologies should remain visible');
assert.match(css, /\.hero-tech-stack \{[^}]*color: #fff;/, 'Hero technologies should use white text');
assert.match(css, /\.hero-title-hint \{[^}]*position: absolute;/, 'Hero title hint arrow should be positioned over the title');
assert.match(css, /\.hero-title-hint \{[^}]*transform: rotate\(-48deg\) scaleX\(-1\);/, 'Hero title hint arrow should point toward Engineer on desktop');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.hero-title-hint \{[\s\S]*?left: calc\(100% \+ \.4em\);[\s\S]*?width: 1\.25em;/, 'Hero title hint arrow should be small and right-aligned on mobile');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.hero-title-hint \{[\s\S]*?transform: translateY\(-50%\) rotate\(-12deg\) scaleX\(-1\);/, 'Hero title hint arrow should point left on mobile');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.hero-tech-stack \{[^}]*display: grid;[^}]*order: -1;/, 'Mobile hero technologies should remain visible above the title');
assert.match(openAiSvg, /fill=["']#fff["']/i, 'Header OpenAI image must be white');
assert.match(css, /\.home-header \.hanger-chat-image \{[\s\S]*?width: 2\.5em;[\s\S]*?height: 2\.5em;/, 'Header OpenAI image is not scaled down');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*top: 50%;[^}]*transform: translateY\(-50%\);/, 'Header OpenAI image is not vertically centered');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*right: 1\.75em;/, 'Header OpenAI image is not horizontally aligned');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*animation: hanger-chat-spin 8s linear infinite;/, 'Header OpenAI image is not spinning');
assert.match(css, /\.home-header \.hanger \{[^}]*z-index: 10;/, 'Header Chat Agent control must sit above overlapping content');
assert.match(css, /\.home-header \.get-height \{[^}]*z-index: 10;[^}]*pointer-events: none;/, 'Header overlay must not block the Chat Agent control');
assert.match(css, /\.home-header \.hanger \{[^}]*pointer-events: auto;/, 'Chat Agent control must remain clickable');
assert.doesNotMatch(css, /\.ask-agent-(?:wrap|button|trigger|providers|provider)/, 'About section Ask Agent styles should be removed');
assert.match(css, /\.home-header \.big-name h1 \{[\s\S]*?font-size: 2em;/, 'Hero name should match the Engineer title size');
assert.doesNotMatch(css, /font-size: max\((?:4\.5em, 7\.5vw|6\.5em, 10\.5vw|7\.5em, 12vw|8em, 13\.5vw|9em, 15vw)\)/, 'Hero name should not retain an oversized size');
assert.match(css, /\.home-header \.big-name \.name-role \{[^}]*font-size: 1em;[^}]*padding: 0;/, 'Static name role should match the name size');
assert.match(css, /\.home-header \.big-name \{[^}]*padding-left: calc\(var\(--gap-padding\) \/ 2\);[^}]*padding-right: calc\(var\(--gap-padding\) \/ 2\);/, 'Static name lockup should match navigation spacing');
assert.match(css, /\.home-header \.big-name \.name-wrap \{[^}]*align-items: flex-start;/, 'Static name lockup should be docked left');
assert.match(css, /\.home-header \.big-name \{[^}]*width: fit-content;[^}]*pointer-events: none;/, 'Static name wrapper should not shadow nearby elements');
assert.match(css, /\.home-header \.big-name \.name-h1 \{[^}]*width: fit-content;/, 'Static name heading wrapper should fit its content');
assert.match(css, /\.home-header \.big-name \.name-wrap \{[^}]*width: fit-content;/, 'Static name text wrapper should fit its content');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.home-header \.big-name h1 \{[\s\S]*?font-size: max\(2em, 4vw\);/, 'Hero name should be smaller on mobile');
assert.match(css, /@media screen and \(max-width: 720px\) \{[\s\S]*?\.home-header \.big-name \{[\s\S]*?padding-left: var\(--container-padding\);[\s\S]*?padding-right: var\(--container-padding\);/, 'Mobile hero name should align with the hero container');
assert.match(css, /\.home-header \.big-name \{[^}]*bottom: 8vh;/, 'Hero name should sit lower on desktop');
assert.match(css, /\.home-header \.big-name \{[\s\S]*?bottom: calc\(var\(--vh, 1vh\) \* 30\)/, 'Hero name should sit lower on mobile');
assert.match(css, /\.loading-container \{[^}]*height: 100vh;/, 'Loader must fill the viewport');
assert.match(css, /\.loading-screen \{[^}]*height: 100vh;/, 'Loader screen must fill the viewport');
assert.match(css, /\.home-header \{[^}]*height: 100vh;[^}]*min-height: 100vh;/, 'Hero must be exactly one viewport tall');
assert.doesNotMatch(css, /\.home-header \{[^}]*min-height: 115vh;/, 'Hero must not retain the oversized desktop height');
assert.doesNotMatch(css, /min-height: 110vh|min-height: calc\([^)]*\* 110\)/, 'Hero must not retain the oversized mobile height');
assert.match(css, /@keyframes hanger-chat-spin/, 'Header OpenAI spin animation is missing');
assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.home-header \.hanger-chat-image \{[^}]*animation: none;/, 'Header OpenAI spin must respect reduced motion');
assert.match(html, /data-agent-handoff/, 'Shared agent handoff hook missing');
assert.match(html, /href=["']https:\/\/chatgpt\.com\/["']/, 'Ask Agent fallback URL missing');
assert.match(html, /href=["']https:\/\/omari\.is-a\.dev\/agent-manifest\.json["']/, 'Public portfolio manifest link missing');
assert.match(js, /function initAskAgent/, 'Ask Agent initializer missing');
assert.doesNotMatch(js, /function initHeroTechStack|classList\.toggle\(['"]is-open['"]/, 'Persistent hero technologies should not use a click toggle');
assert.match(js, /querySelectorAll\('\[data-agent-handoff\]'\)/, 'Agent handoff links are not initialized together');
assert.doesNotMatch(js, /ask-agent-trigger|ask-agent-providers|agentProvider/, 'About section Ask Agent toggle logic should be removed');
assert.match(js, /https:\/\/chatgpt\.com\/\?q=\$\{encodeURIComponent\(manifestUrl\)\}/, 'Agent manifest URL construction missing');
assert.match(js, /encodeURIComponent\(manifestUrl\)/, 'Ask Agent must send only the manifest URL');
assert.equal(typeof manifest.agentPrompt, 'string', 'manifest agent prompt missing');
assert.match(manifest.agentPrompt, /concise professional summary/i, 'manifest agent prompt changed unexpectedly');
assert.equal(manifest.name, 'Bright Owusu', 'manifest name changed unexpectedly');
assert.equal(manifest.experience.length, 4, 'manifest experience count changed unexpectedly');
assert.equal(manifest.projects.length, 3, 'manifest project count changed unexpectedly');
assert.doesNotMatch(manifestText, /318-265-8445|owusuomaribright@gmail\.com/i, 'private contact data leaked into manifest');

for (const company of [
  'Palo Alto Networks',
  'Wayfair',
  'Orda Rides',
  'Maddy Group Ltd',
  'GSU College of Arts & Science, Digital Technologies',
]) {
  assert.match(normalized, new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing experience: ${company}`);
}

for (const project of ['Uncluster', 'WVS 1.01', 'Immigration Assistant', 'Go-Shop', 'Enterprise ERP']) {
  assert.match(html, new RegExp(project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing project: ${project}`);
}
assert.equal((html.match(/https:\/\/github\.com\/omariomari2\/WVS-1\.01\.git/g) || []).length, 2, 'WVS project links should use the WVS 1.01 repository');
assert.doesNotMatch(html, /WVS 1\.02|github\.com\/omariomari2\/wvs-102/, 'Old WVS 1.02 project reference remains');
assert.equal((html.match(/https:\/\/ems-woad-kappa\.vercel\.app\//g) || []).length, 2, 'Go-Shop project links should use the live deployment');

assert.match(html, /I build cloud-native infrastructure, backend platforms, and security systems focused on reliability, automation, and applied AI\./, 'cloud-focused about headline changed unexpectedly');
assert.match(html, /I specialize in building reliable cloud systems with Python, Google Cloud, and Terraform, using Cursor to accelerate thoughtful, production-ready engineering\./, 'skills-focused about copy changed unexpectedly');

console.log('single-page portfolio structure: ok');
