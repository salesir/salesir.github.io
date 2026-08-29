/* ============================================
   Project Codex — index + panel

   Every project is listed at once on the left; selecting one swaps the
   panel on the right. The panel opens with a spec sheet so the essentials
   (what it is, the stack, the hard numbers, the repo) are readable without
   a single click, and the long-form parts sit underneath for anyone who
   wants the detail.

   Project content is intentionally authored in the local projects-data.js
   file. Keep this API fed by trusted content; do not pass unreviewed CMS
   or form input as part.content.
   ============================================ */

class ProjectCodex {
    constructor() {
        this.index = document.getElementById('projectShelf');
        this.panel = document.getElementById('projectBook');
        this.spec = document.getElementById('projectSpec');
        this.pagesEl = document.getElementById('bookPages');
        this.pageNav = document.getElementById('pageNav');
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.pageIndicator = document.getElementById('pageIndicator');
        this.emptyState = document.getElementById('emptyState');

        this.projects = [];
        this.activeProject = null;
        this.activePage = 0;
        this.isFlipping = false;
        this.flipTimer = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this._bind();
    }

    /** Register a project, replacing an existing entry with the same id. */
    addProject(project) {
        if (!this._isValidProject(project)) {
            console.warn('[ProjectCodex] Ignored a project with incomplete metadata.', project);
            return;
        }

        const existingIndex = this.projects.findIndex(item => item.id === project.id);
        if (existingIndex === -1) {
            this.projects.push(project);
        } else {
            this.projects[existingIndex] = project;
            if (this.activeProject?.id === project.id) this.activeProject = project;
        }

        this._renderIndex();

        /* The panel is never empty: the first project registered opens it. */
        if (!this.activeProject) this.openProject(this.projects[0].id);
    }

    /** Remove a project by id, falling back to the first remaining one. */
    removeProject(id) {
        this.projects = this.projects.filter(project => project.id !== id);

        if (this.activeProject?.id === id) {
            this.activeProject = null;
            this._renderIndex();
            if (this.projects.length) this.openProject(this.projects[0].id);
            else this._clearPanel();
            return;
        }

        this._renderIndex();
    }

    /**
     * Show a project in the panel.
     * @param {string} id
     * @param {{focusPanel?: boolean}} [options] focusPanel moves focus to the
     *        case-study title, for callers driving this from elsewhere on the page.
     */
    openProject(id, options = {}) {
        const project = this.projects.find(item => item.id === id);
        if (!project) return;

        window.clearTimeout(this.flipTimer);
        this.isFlipping = false;
        this.activeProject = project;
        this.activePage = 0;

        this._syncActiveTab();
        this._renderSpec(project);
        this._renderPages(project);

        if (this.pageNav) this.pageNav.hidden = project.parts.length < 2;
        this._updateNav();

        if (options.scrollToPanel) this._scrollPanelIntoView();
        if (options.focusPanel) this.focusActiveTitle();
    }

    /**
     * Only the stacked (narrow) layout needs this. There the panel grows with
     * its content, so switching from a long case study to a short one can leave
     * the viewport parked past the end of the new one. On the wide layout the
     * codex is a fixed-height reader: the page height never changes, so
     * selecting a project must move nothing at all.
     */
    _scrollPanelIntoView() {
        if (!this.panel) return;
        if (!window.matchMedia('(max-width: 900px)').matches) return;
        if (this.panel.getBoundingClientRect().top >= 0) return;

        this.panel.scrollIntoView({
            behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        });
    }

    /** Move focus to the visible case-study title without scrolling the page. */
    focusActiveTitle() {
        const title = this.pagesEl?.querySelector('.codex__page.is-active .codex__page-title');
        if (!title) return;
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
    }

    _clearPanel() {
        this.activeProject = null;
        this.spec?.replaceChildren();
        this.pagesEl?.replaceChildren();
        if (this.pageNav) this.pageNav.hidden = true;
    }

    _bind() {
        this.prevBtn?.addEventListener('click', () => this._flip(-1));
        this.nextBtn?.addEventListener('click', () => this._flip(1));

        /* Roving-tabindex keyboard support for the project index. */
        this.index?.addEventListener('keydown', event => {
            const tabs = [...this.index.querySelectorAll('.codex__tab')];
            if (!tabs.length) return;

            const current = tabs.indexOf(document.activeElement);
            if (current === -1) return;

            const moves = {
                ArrowDown: current + 1,
                ArrowRight: current + 1,
                ArrowUp: current - 1,
                ArrowLeft: current - 1,
                Home: 0,
                End: tabs.length - 1,
            };
            if (!(event.key in moves)) return;

            event.preventDefault();
            const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
            next.focus();
            this.openProject(next.dataset.project, { scrollToPanel: true });
        });

        /* Left/Right flip between parts, but not while the index has focus —
           there the same keys move between projects. */
        document.addEventListener('keydown', event => {
            if (!this.activeProject) return;
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            if (this.index?.contains(document.activeElement)) return;
            if (!this.panel?.contains(document.activeElement)) return;

            event.preventDefault();
            this._flip(event.key === 'ArrowRight' ? 1 : -1);
        });
    }

    _isValidProject(project) {
        return Boolean(
            project &&
            typeof project.id === 'string' && project.id &&
            typeof project.title === 'string' && project.title &&
            typeof project.year === 'string' && project.year &&
            Array.isArray(project.parts) && project.parts.length &&
            project.parts.every(part =>
                part && typeof part.title === 'string' && typeof part.content === 'string'),
        );
    }

    /* ============================================
       Index
       ============================================ */

    _renderIndex() {
        this.index.querySelectorAll('.codex__tab').forEach(tab => tab.remove());
        if (this.emptyState) this.emptyState.hidden = this.projects.length > 0;

        const frag = document.createDocumentFragment();

        this.projects.forEach((project, position) => {
            const isActive = this.activeProject?.id === project.id;

            const tab = document.createElement('button');
            tab.type = 'button';
            /* Re-rendering the index must preserve the selection: each later
               addProject() call rebuilds every tab from scratch. */
            tab.className = isActive ? 'codex__tab is-active' : 'codex__tab';
            tab.id = `tab-${project.id}`;
            tab.dataset.project = project.id;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', String(isActive));
            tab.setAttribute('aria-controls', 'projectSpec');
            tab.tabIndex = isActive ? 0 : -1;

            const head = document.createElement('span');
            head.className = 'codex__tab-head';

            const number = document.createElement('span');
            number.className = 'codex__tab-number';
            number.textContent = String(position + 1).padStart(2, '0');

            const title = document.createElement('span');
            title.className = 'codex__tab-title';
            title.textContent = project.title;

            const year = document.createElement('span');
            year.className = 'codex__tab-year';
            year.textContent = project.year;

            head.append(number, title, year);
            tab.append(head);

            /* The summary and stack are what make the list scannable without
               opening anything, so they render into the tab itself. */
            if (project.spec?.summary) {
                const summary = document.createElement('span');
                summary.className = 'codex__tab-summary';
                summary.textContent = project.spec.summary;
                tab.append(summary);
            }

            if (Array.isArray(project.spec?.stack) && project.spec.stack.length) {
                const stack = document.createElement('span');
                stack.className = 'codex__tab-stack';
                project.spec.stack.forEach(item => {
                    const chip = document.createElement('span');
                    chip.className = 'codex__tab-chip';
                    chip.textContent = item;
                    stack.append(chip);
                });
                tab.append(stack);
            }

            tab.addEventListener('click', () => this.openProject(project.id, { scrollToPanel: true }));
            frag.append(tab);
        });

        this.index.append(frag);
    }

    _syncActiveTab() {
        this.index.querySelectorAll('.codex__tab').forEach(tab => {
            const isActive = tab.dataset.project === this.activeProject?.id;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });
    }

    /* ============================================
       Panel
       ============================================ */

    _renderSpec(project) {
        if (!this.spec) return;

        this.spec.setAttribute('role', 'tabpanel');
        this.spec.setAttribute('aria-labelledby', `tab-${project.id}`);

        const frag = document.createDocumentFragment();

        const eyebrow = document.createElement('p');
        eyebrow.className = 'codex__spec-eyebrow';
        eyebrow.textContent = [project.spec?.role, project.year].filter(Boolean).join(' · ');

        const heading = document.createElement('h3');
        heading.className = 'codex__spec-title';
        heading.textContent = project.title;

        frag.append(eyebrow, heading);

        if (project.spec?.summary) {
            const summary = document.createElement('p');
            summary.className = 'codex__spec-summary';
            summary.textContent = project.spec.summary;
            frag.append(summary);
        }

        /* One sentence a non-technical reader can act on, before the spec table. */
        if (project.spec?.plain) {
            const plain = document.createElement('p');
            plain.className = 'codex__plain';

            const mark = document.createElement('span');
            mark.className = 'codex__plain-mark';
            mark.setAttribute('aria-hidden', 'true');

            const text = document.createElement('span');
            text.textContent = project.spec.plain;

            plain.append(mark, text);
            frag.append(plain);
        }

        if (Array.isArray(project.spec?.facts) && project.spec.facts.length) {
            const list = document.createElement('dl');
            list.className = 'codex__spec-facts';

            project.spec.facts.forEach(fact => {
                if (!fact || typeof fact.label !== 'string' || typeof fact.value !== 'string') return;
                const row = document.createElement('div');
                row.className = 'codex__spec-fact';

                const label = document.createElement('dt');
                label.textContent = fact.label;
                const value = document.createElement('dd');
                value.textContent = fact.value;

                row.append(label, value);
                list.append(row);
            });

            if (list.childElementCount) frag.append(list);
        }

        const links = this._createProjectLinks(project.links);
        if (links) frag.append(links);

        this.spec.replaceChildren(frag);
    }

    /** Populate the pages container for the given project. */
    _renderPages(project) {
        const pages = document.createDocumentFragment();

        project.parts.forEach((part, index) => {
            const page = document.createElement('article');
            page.className = `codex__page${index === 0 ? ' is-active' : ''}`;
            page.dataset.page = String(index);

            const number = document.createElement('span');
            number.className = 'codex__page-number';
            number.textContent = `Part ${index + 1} of ${project.parts.length}`;

            const title = document.createElement('h4');
            title.className = 'codex__page-title';
            title.textContent = part.title;

            const body = document.createElement('div');
            body.className = 'codex__page-body';
            /* Trusted, hand-authored case-study HTML from projects-data.js. */
            body.innerHTML = part.content;

            page.append(number, title, body);
            pages.append(page);
        });

        this.pagesEl.replaceChildren(pages);
        this.pagesEl.scrollTop = 0;

        /* Demo videos autoplay so the project shows itself the moment it opens,
           but nobody who asked the OS for less motion should get a moving image
           they did not start. */
        if (this.prefersReducedMotion) {
            this.pagesEl.querySelectorAll('video[autoplay]').forEach(video => {
                video.autoplay = false;
                video.removeAttribute('autoplay');
                video.pause();
            });
        }
    }

    _createProjectLinks(links) {
        if (!Array.isArray(links)) return null;

        const container = document.createElement('div');
        container.className = 'codex__project-links';

        links.forEach(link => {
            if (!link || typeof link.label !== 'string' || !this._isSafeExternalUrl(link.href)) return;

            const anchor = document.createElement('a');
            anchor.className = 'codex__project-link';
            anchor.href = link.href;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = `${link.label} ↗`;
            container.append(anchor);
        });

        return container.childElementCount ? container : null;
    }

    _isSafeExternalUrl(value) {
        if (typeof value !== 'string') return false;

        try {
            const url = new URL(value);
            return url.protocol === 'https:' || url.protocol === 'http:';
        } catch {
            return false;
        }
    }

    /** Flip forward (+1) or backward (-1) through the case-study parts. */
    _flip(direction) {
        if (!this.activeProject || this.isFlipping) return;

        const nextPage = this.activePage + direction;
        if (nextPage < 0 || nextPage >= this.activeProject.parts.length) return;

        const pages = this.pagesEl.querySelectorAll('.codex__page');
        pages[this.activePage]?.classList.remove('is-active');

        this.activePage = nextPage;
        pages[this.activePage]?.classList.add('is-active');
        this._updateNav();

        /* The parts area scrolls internally, so returning it to the top is all
           that is needed on the wide layout. */
        this.pagesEl.scrollTop = 0;
        this._scrollPanelIntoView();

        /* Brief lock so a held arrow key cannot outrun the enter animation. */
        this.isFlipping = true;
        const delay = this.prefersReducedMotion ? 0 : 180;
        this.flipTimer = window.setTimeout(() => { this.isFlipping = false; }, delay);
    }

    /** Sync previous/next buttons and page indicator text. */
    _updateNav() {
        if (!this.activeProject) return;

        const total = this.activeProject.parts.length;
        if (this.prevBtn) this.prevBtn.disabled = this.activePage === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.activePage === total - 1;
        if (this.pageIndicator) this.pageIndicator.textContent = `Part ${this.activePage + 1} of ${total}`;
    }
}
