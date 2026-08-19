import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
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

for (const company of [
  'Palo Alto Networks',
  'Wayfair',
  'Orda Rides',
  'Maddy Group Ltd',
  'GSU College of Arts & Science, Digital Technologies',
]) {
  assert.match(normalized, new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing experience: ${company}`);
}

for (const project of ['Uncluster', 'WVS 1.02', 'Immigration Assistant']) {
  assert.match(html, new RegExp(project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing project: ${project}`);
}
for (const removed of ['LintKit', 'Go-Shop']) {
  assert.doesNotMatch(html, new RegExp(removed, 'i'), `${removed} must be removed`);
}

assert.match(html, /Backend systems, cloud infrastructure, and security automation\./, 'about copy changed unexpectedly');

console.log('single-page portfolio structure: ok');
