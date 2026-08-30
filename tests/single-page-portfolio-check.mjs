import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../assets/js/index-new.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../assets/css/style-new.css', import.meta.url), 'utf8');
const manifestText = fs.readFileSync(new URL('../agent-manifest.json', import.meta.url), 'utf8');
const manifest = JSON.parse(manifestText);
const openAiSvg = fs.readFileSync(new URL('../assets/openai.svg', import.meta.url), 'utf8');
const normalized = html.replaceAll('&amp;', '&');

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
assert.match(js, /function initGithubCard/, 'GitHub card initializer missing');
assert.match(js, /github-contributions-api\.jogruber\.de/, 'GitHub contribution endpoint missing');
assert.match(js, /total\.textContent = `\$\{contributionTotal\.toLocaleString\(\)\} contributions`;/, 'GitHub total should not include a year');
assert.doesNotMatch(js, /contributionTotal\.toLocaleString\(\)\} contributions in \$\{year\}/, 'GitHub total still includes a year');
assert.match(js, /const colors = \['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'\]/, 'GitHub contribution colors missing');
assert.match(css, /background: #0e4429;[\s\S]*?background: #006d32;[\s\S]*?background: #26a641;[\s\S]*?background: #39d353;/, 'GitHub legend must use green contribution colors');
assert.match(html, /id=["']ask-agent["']/, 'Ask Agent control missing');
assert.match(html, /id=["']ask-agent-hanger["']/, 'Header Chat Agent control missing');
assert.match(html, /Ask your agent about me/, 'Header Chat Agent label missing');
assert.match(html, /src=["']assets\/openai\.svg(?:\?[^"']*)?["']/, 'Header OpenAI image missing');
assert.match(openAiSvg, /fill=["']#fff["']/i, 'Header OpenAI image must be white');
assert.match(css, /\.home-header \.hanger-chat-image \{[\s\S]*?width: 2\.5em;[\s\S]*?height: 2\.5em;/, 'Header OpenAI image is not scaled down');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*top: 50%;[^}]*transform: translateY\(-50%\);/, 'Header OpenAI image is not vertically centered');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*right: 1\.75em;/, 'Header OpenAI image is not horizontally aligned');
assert.match(css, /\.home-header \.hanger-chat-image \{[^}]*animation: hanger-chat-spin 8s linear infinite;/, 'Header OpenAI image is not spinning');
assert.match(css, /\.home-header \.hanger \{[^}]*z-index: 10;/, 'Header Chat Agent control must sit above overlapping content');
assert.match(css, /\.home-header \.get-height \{[^}]*z-index: 10;[^}]*pointer-events: none;/, 'Header overlay must not block the Chat Agent control');
assert.match(css, /\.home-header \.hanger \{[^}]*pointer-events: auto;/, 'Chat Agent control must remain clickable');
assert.match(css, /@keyframes hanger-chat-spin/, 'Header OpenAI spin animation is missing');
assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.home-header \.hanger-chat-image \{[^}]*animation: none;/, 'Header OpenAI spin must respect reduced motion');
assert.match(html, /data-agent-handoff/, 'Shared agent handoff hook missing');
assert.match(html, /href=["']https:\/\/chatgpt\.com\/["']/, 'Ask Agent fallback URL missing');
assert.match(html, /href=["']https:\/\/omari\.is-a\.dev\/agent-manifest\.json["']/, 'Public portfolio manifest link missing');
assert.match(js, /function initAskAgent/, 'Ask Agent initializer missing');
assert.match(js, /querySelectorAll\('\[data-agent-handoff\], #ask-agent'\)/, 'Agent handoff links are not initialized together');
assert.match(js, /chatgpt\.com\/\?q=/, 'ChatGPT prompt URL construction missing');
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

for (const project of ['Uncluster', 'WVS 1.02', 'Immigration Assistant', 'Go-Shop', 'Enterprise ERP']) {
  assert.match(html, new RegExp(project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing project: ${project}`);
}

assert.match(html, /Backend systems, cloud infrastructure, and security automation\./, 'about copy changed unexpectedly');

console.log('single-page portfolio structure: ok');
