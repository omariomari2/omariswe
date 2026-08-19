import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const normalized = html.replaceAll('&amp;', '&');

for (const id of ['top', 'about', 'experience', 'projects', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id} section`);
}

for (const label of ['About', 'Experience', 'Projects', 'Contact']) {
  assert.match(html, new RegExp(`data-scroll-target=["']#${label.toLowerCase()}["'][^>]*>[\\s\\S]*?${label}`, 'i'), `missing ${label} navigation target`);
}

assert.doesNotMatch(html, />\s*Home\s*</i, 'Home must not appear as a menu item');
assert.doesNotMatch(html, /works\/work\.html/i, 'legacy Work-page link remains');
assert.doesNotMatch(html, /about\/about\.html/i, 'legacy About-page link remains');
assert.doesNotMatch(html, /Certifications?/i, 'certification UI remains');

for (const company of [
  'Palo Alto Networks',
  'Wayfair',
  'Orda Rides',
  'Maddy Group Ltd',
  'GSU College of Arts & Science, Digital Technologies',
]) {
  assert.match(normalized, new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing experience: ${company}`);
}

for (const project of ['Immigration Assistant', 'Uncluster', 'Go-Shop', 'WVS 1.02', 'LintKit']) {
  assert.match(html, new RegExp(project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing project: ${project}`);
}

assert.match(html, /Backend systems, cloud infrastructure, and security automation\./, 'about copy is not the approved terse version');
assert.match(html, /data-scroll-target=["']#top["']/, 'Bright Owusu mark must return to hero');

console.log('single-page portfolio structure: ok');
