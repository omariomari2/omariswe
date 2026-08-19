from pathlib import Path
import re

p = Path('index.html')
s = p.read_text()

s = s.replace('<main class="main" id="portfolio"', '<main class="main" id="work"')
s = s.replace('href="#experience" data-scroll-target="#experience" data-barba-prevent', 'href="#experience" data-scroll-target="#experience" data-work-filter="design" data-barba-prevent')
s = s.replace('href="#projects" data-scroll-target="#projects" data-barba-prevent', 'href="#projects" data-scroll-target="#experience" data-work-filter="development" data-barba-prevent')

experiences = [
    ('Product Security Intern', 'Palo Alto Networks', 'May 2026 – Aug 2026', 'Built cloud-security automation and AI tooling for 2,000+ engineers, including Slack-based on-call triage and Azure privileged-access workflows across 16 production tenants.', '#111827'),
    ('AI Automation Extern', 'Wayfair', 'Jan 2026 – Mar 2026', 'Built AI automation pipelines for large-scale market intelligence, processing 1M+ records while reducing report turnaround and inference cost.', '#4B5563'),
    ('Software Engineer', 'Orda Rides', 'Aug 2025 – Dec 2025', 'Built and operated production ride-booking services for 300+ users, shipping releases and migrating infrastructure without customer-visible downtime.', '#1F2937'),
    ('Software Engineering Intern', 'Maddy Group Ltd', 'Jan 2025 – Aug 2025', 'Built backend notification services with gRPC, GraphQL, PostgreSQL and Kubernetes, supporting high-throughput workloads with 99.9% uptime.', '#374151'),
    ('Undergraduate Researcher', 'GSU College of Arts &amp; Science, Digital Technologies', 'Jan 2025 – Aug 2025', 'Built an AWS voice agent for student services and improved intent routing through production-log analysis and iterative NLP testing.', '#6B7280'),
]
projects = [
    ('Uncluster', 'Code Generation Engine', 'Go, Fiber, TypeScript', 'https://uncluster-production.up.railway.app/how-it-works.html', '#0F172A'),
    ('WVS 1.02', 'Distributed Security Agent', 'TypeScript, Cloudflare Workers, Llama', 'https://github.com/omariomari2/wvs-102', '#334155'),
    ('Immigration Assistant', 'RAG Assistant', 'Python, LangChain, TensorFlow, Gemini', 'https://webpager.onrender.com/', '#475569'),
]

rows = []
for role, company, period, desc, color in experiences:
    rows.append(f'''              <li class="design visible">\n                <div class="stripe animate"></div>\n                <a href="#" class="row" data-description="{desc}">\n                  <div class="flex-col"><h4><span>{role}</span></h4></div>\n                  <div class="flex-col animate"><p>{company}</p></div>\n                  <div class="flex-col animate"><p>{period}</p></div>\n                </a>\n              </li>''')
for name, system, stack, url, color in projects:
    rows.append(f'''              <li class="development">\n                <div class="stripe animate"></div>\n                <a href="{url}" class="row" target="_blank" rel="noopener noreferrer">\n                  <div class="flex-col"><h4><span>{name}</span></h4></div>\n                  <div class="flex-col animate"><p>{system}</p></div>\n                  <div class="flex-col animate"><p>{stack}</p></div>\n                </a>\n              </li>''')

tiles = []
for role, company, period, desc, color in experiences:
    tiles.append(f'''            <li class="design visible">\n              <div class="single-tile-wrap">\n                <a href="#" class="row" data-description="{desc}">\n                  <div class="flex-col"><div class="tile-image"><div class="overlay overlay-color" style="background-color: {color};"></div></div></div>\n                  <div class="flex-col"><h4><span>{role}</span></h4><div class="stripe"></div></div>\n                  <div class="flex-col"><p>{company}</p></div>\n                  <div class="flex-col"><p>{period}</p></div>\n                </a>\n              </div>\n            </li>''')
for name, system, stack, url, color in projects:
    tiles.append(f'''            <li class="development">\n              <div class="single-tile-wrap">\n                <a href="{url}" class="row" target="_blank" rel="noopener noreferrer">\n                  <div class="flex-col"><div class="tile-image"><div class="overlay overlay-color" style="background-color: {color};"></div></div></div>\n                  <div class="flex-col"><h4><span>{name}</span></h4><div class="stripe"></div></div>\n                  <div class="flex-col"><p>{system}</p></div>\n                  <div class="flex-col"><p>{stack}</p></div>\n                </a>\n              </div>\n            </li>''')

work = f'''      <section id="experience" class="section work-filters" data-scroll-section>\n        <div class="container"><div class="filter-row"><div class="toggle-row">\n          <div class="btn btn-normal design-btn active"><div class="btn-click magnetic" data-strength="25" data-strength-text="15"><div class="btn-fill"></div><span class="btn-text"><span class="btn-text-inner change">Experience<div class="count-nr">5</div></span></span></div></div>\n          <div class="btn btn-normal development-btn" id="projects"><div class="btn-click magnetic" data-strength="25" data-strength-text="15"><div class="btn-fill"></div><span class="btn-text"><span class="btn-text-inner change">Projects<div class="count-nr">3</div></span></span></div></div>\n        </div></div></div>\n      </section>\n      <section class="section-wrap section-wrap-work once-in" data-scroll-section>\n        <section class="section work-grid small-work-grid grid-fade grid-rows-part visible"><div class="container">\n          <div class="grid-sub-title">\n            <div class="grid-sub-title-design" style="width:100%; display:flex;"><div class="flex-col"><h5>Role</h5></div><div class="flex-col"><h5>Company</h5></div><div class="flex-col"><h5>Period</h5></div></div>\n            <div class="grid-sub-title-development" style="display:none; width:100%;"><div class="flex-col"><h5>Project</h5></div><div class="flex-col"><h5>System</h5></div><div class="flex-col"><h5>Stack</h5></div></div>\n          </div>\n          <ul class="work-items mouse-pos-list-image-wrap all-active">\n{chr(10).join(rows)}\n            <div class="stripe last animate"></div>\n          </ul>\n        </div></section>\n        <section class="section work-tiles grid-fade grid-columns-part"><div class="container"><ul>\n{chr(10).join(tiles)}\n        </ul></div></section>\n      </section>\n'''

pattern = r'      <section id="experience"[\s\S]*?      </section>\n\n      <div class="footer-rounded-div"'
match = re.search(pattern, s)
if not match:
    raise RuntimeError('work region not found')
s = s[:match.start()] + work + '\n      <div class="footer-rounded-div"' + s[match.end():]

modal = '''\n  <div class="modal-overlay" id="projectModal">\n    <div class="modal-content">\n      <button class="modal-close" id="closeModal" aria-label="Close details">&times;</button>\n      <h2 class="modal-title" id="modalTitle">Experience</h2>\n      <p class="modal-tools" id="modalTools"></p>\n      <div class="modal-description" id="modalDescription"></div>\n      <a href="#" class="modal-link" id="modalLink" target="_blank" rel="noopener noreferrer">Visit Project</a>\n    </div>\n  </div>\n'''
if 'id="projectModal"' not in s:
    s = s.replace('  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>', modal + '\n  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>')

start = "  <script>\n    document.addEventListener('DOMContentLoaded', function () {"
idx = s.find(start)
if idx < 0:
    raise RuntimeError('SPA navigation helper not found')
end = s.find('  </script>', idx)
if end < 0:
    raise RuntimeError('SPA navigation helper end not found')
end += len('  </script>')
helper = '''  <script>\n    document.addEventListener('DOMContentLoaded', function () {\n      function activateWorkFilter(filter) {\n        var showProjects = filter === 'development';\n        var activeButton = document.querySelector(showProjects ? '.development-btn' : '.design-btn');\n        var inactiveButton = document.querySelector(showProjects ? '.design-btn' : '.development-btn');\n        if (activeButton) { activeButton.classList.add('active'); activeButton.classList.remove('not-active'); }\n        if (inactiveButton) { inactiveButton.classList.remove('active'); inactiveButton.classList.add('not-active'); }\n        var designHeader = document.querySelector('.grid-sub-title-design');\n        var projectHeader = document.querySelector('.grid-sub-title-development');\n        if (designHeader) designHeader.style.display = showProjects ? 'none' : 'flex';\n        if (projectHeader) projectHeader.style.display = showProjects ? 'flex' : 'none';\n        document.querySelectorAll('.work-items li, .work-tiles li').forEach(function (item) {\n          item.classList.remove('visible');\n          if (item.classList.contains(showProjects ? 'development' : 'design')) item.classList.add('visible');\n        });\n        if (typeof scroll !== 'undefined' && scroll && typeof scroll.update === 'function') {\n          setTimeout(function () { scroll.update(); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }, 50);\n        }\n      }\n      document.addEventListener('click', function (event) {\n        var filterButton = event.target.closest('.design-btn, .development-btn');\n        if (!filterButton) return;\n        event.preventDefault();\n        event.stopImmediatePropagation();\n        activateWorkFilter(filterButton.classList.contains('development-btn') ? 'development' : 'design');\n      }, true);\n      document.querySelectorAll('[data-scroll-target]').forEach(function (link) {\n        link.addEventListener('click', function (event) {\n          event.preventDefault();\n          event.stopPropagation();\n          var requestedFilter = link.getAttribute('data-work-filter');\n          if (requestedFilter) activateWorkFilter(requestedFilter);\n          var target = document.querySelector(link.getAttribute('data-scroll-target'));\n          if (!target) return;\n          document.querySelectorAll('.btn-hamburger, .btn-menu').forEach(function (button) { button.classList.remove('active'); });\n          var main = document.querySelector('main');\n          if (main) main.classList.remove('nav-active');\n          if (typeof scroll !== 'undefined' && scroll && typeof scroll.scrollTo === 'function') {\n            scroll.start();\n            setTimeout(function () { scroll.scrollTo(target, { offset: 0, duration: 900, easing: [0.7, 0.00, 0.35, 1.00], disableLerp: true }); }, 40);\n          } else { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }\n        });\n      });\n    });\n  </script>'''
s = s[:idx] + helper + s[end:]

p.write_text(s)
