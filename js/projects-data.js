/* ============================================
   Projects Data Store
   Defines all portfolio projects and their chapters/parts.
   ============================================ */

const portfolioProjects = [
    {
        id: 'transformer-lm',
        title: 'Transformer LM, From Scratch',
        year: '2024–2026',
        spec: {
            summary: 'A decoder-only language model written from zero in PyTorch — tokenizer, attention, training loop, all of it.',
            plain: 'I built an entire AI from scratch, on my own.',
            role: 'Independent research',
            stack: ['Python', 'PyTorch', 'CUDA'],
            facts: [
                { label: 'Model',      value: '4 layers, 4 heads, d_model 256 — 4.6M parameters' },
                { label: 'Corpus',     value: '1.5B+ tokens across 383,000 steps' },
                { label: 'Validation', value: '5.81 → 1.2–1.4 loss · ≈3.4 perplexity' },
                { label: 'Recipe',     value: 'RMSNorm · SwiGLU · Flash Attention · cosine LR' }
            ]
        },
        links: [
            { label: 'View source on GitHub', href: 'https://github.com/salesir/Scratch-AI' }
        ],
        parts: [
            {
                title: 'The Architecture: Building a Transformer Without Scaffolding',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Rather than use an AI that already existed, I built my own from nothing — the only way to really understand how they work.</span></p>

                    <p class="codex__page-lead">
                        Most people reach for Hugging Face and fine-tune. I wanted to understand the architecture at the
                        implementation level, so I wrote a <strong>decoder-only transformer</strong> from the ground up in
                        PyTorch — every component, no pretrained scaffolding. It follows the modern Llama-style recipe
                        rather than the original 2017 paper: <strong>RMSNorm</strong>, a <strong>SwiGLU</strong> feed-forward,
                        and fused QKV projections running on PyTorch's Flash Attention path.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Custom BPE Tokenizer</h4>
                            <p class="codex__feature-desc">Byte-pair encoding implemented directly, so the vocabulary and merge rules are mine rather than inherited from an existing tokenizer.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Fused QKV Attention</h4>
                            <p class="codex__feature-desc">One <code>Linear(d_model, 3 &times; d_model)</code> produces queries, keys and values in a single matmul, then splits across four heads onto the Flash Attention kernel.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">RMSNorm, not LayerNorm</h4>
                            <p class="codex__feature-desc">Root-mean-square normalisation drops the mean-centring and the bias term — fewer operations per block for equivalent training stability.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">SwiGLU Feed-Forward</h4>
                            <p class="codex__feature-desc">A gated block — <code>w3(silu(w1(x)) * w2(x))</code> — where one projection gates the other, instead of a single activation on one path.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Python</span>
                        <span class="codex__tech-pill">PyTorch</span>
                        <span class="codex__tech-pill">BPE Tokenization</span>
                        <span class="codex__tech-pill">RMSNorm</span>
                        <span class="codex__tech-pill">SwiGLU</span>
                        <span class="codex__tech-pill">Flash Attention</span>
                    </div>
                `
            },
            {
                title: 'The Training Pipeline: Making It Fit and Making It Converge',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Teaching it took three solid weeks of round-the-clock training on one machine.</span></p>

                    <p class="codex__page-lead">
                        Writing the model is the smaller half. Getting it to train stably across a
                        <strong>1.5B+ token corpus</strong> is where most of the engineering went.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Mixed-Precision Training</h4>
                            <p class="codex__feature-desc">fp16/bf16 training to cut memory pressure and increase throughput without destabilising convergence.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Gradient Accumulation</h4>
                            <p class="codex__feature-desc">Large effective batch sizes on limited VRAM by accumulating gradients across micro-batches before stepping the optimizer.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Cosine LR With Warmup</h4>
                            <p class="codex__feature-desc">Linear warmup into cosine decay — the schedule plotted at the top of this site. Warmup avoids early divergence; decay lets the run settle.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Validation Checkpointing</h4>
                            <p class="codex__feature-desc">Held-out evaluation during training with checkpoints saved on progress, so a long run survives interruption.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">fp16 / bf16</span>
                        <span class="codex__tech-pill">Gradient Accumulation</span>
                        <span class="codex__tech-pill">Cosine LR Scheduling</span>
                        <span class="codex__tech-pill">CUDA</span>
                    </div>
                `
            },
            {
                title: 'Results: What 383,000 Steps Actually Produced',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>This trained for three weeks on a single computer. The AIs you have heard of trained for years across warehouses of specialised hardware — which is exactly why mine writes English-shaped nonsense, and why that gap is the interesting part.</span></p>

                    <p class="codex__page-lead">
                        Every point below is a logged validation record from the run — 766 of them, over three
                        weeks of training. Validation sampled two held-out batches every 500 steps, so the raw
                        readings are deliberately noisy; the solid line is a rolling median through them.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/transformer-loss-curve.svg" alt="Validation loss falling from 5.81 at step 500 to a band between 1.2 and 1.4 by step 383,000" width="760" height="300" decoding="async">
                        <div class="codex__image-caption">Validation loss across 383,000 steps &mdash; plotted from metrics.jsonl, 22 Jan to 11 Feb 2026</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">5.81 → 1.2–1.4 loss</h4>
                            <p class="codex__feature-desc">Validation cross-entropy at step 500 versus the band it settled into over the final 50,000 steps.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">≈3.4–4.0 perplexity</h4>
                            <p class="codex__feature-desc">The exponential of that loss — down from 333 at the start of training.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">~60% token accuracy</h4>
                            <p class="codex__feature-desc">Median share of next tokens predicted exactly right across the run's final phase.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">383,000+ steps</h4>
                            <p class="codex__feature-desc">Optimizer steps across a multi-source corpus of over 1.5 billion tokens.</p>
                        </div>
                    </div>

                    <h5 class="codex__subhead">What 4.6M parameters actually learned</h5>
                    <p>
                        Prompted with <em>&ldquo;introduce yourself&rdquo;</em>, sampled from the trained checkpoint:
                    </p>

                    <pre class="codex__sample"><code>introduce yourself--fyron," said Every when he
room we parated together, "getting his nushers of Lays, "I sculatin
manker, brown'ene," my ching. je beautable at time account."

"The Gossane hold," seem into alway that sit, will be more."

"How abs: said</code></pre>

                    <p>
                        This is the honest result, and it is the interesting one. At 4.6M parameters the model learned
                        <strong>form</strong> without <strong>meaning</strong>: it opens and closes quotation marks correctly,
                        attributes dialogue with <em>said</em>, breaks paragraphs between speakers, and produces
                        English-shaped morphology — but the words are mostly invented. That gap is exactly what scale
                        buys you, and seeing it first-hand on my own architecture taught me more than a working
                        fine-tune would have.
                    </p>

                    <p>
                        The full implementation is published on GitHub with a walkthrough explaining each component of the
                        architecture — written so someone else can follow the same path rather than just read the result.
                    </p>
                `
            }
        ]
    },
    {
        id: 'omniswitch',
        title: 'OmniSwitch',
        year: '2026',
        spec: {
            summary: 'Switch Codex, Claude Code, and Antigravity logins on Windows without the sign-out / sign-in loop.',
            plain: 'One dashboard that runs every AI coding tool at once — and gets them to hand work to each other.',
            role: 'Solo build · shipped Windows beta',
            stack: ['Python 3.13', 'CustomTkinter', 'WebView2', 'Win32 API', 'SQLite'],
            facts: [
                { label: 'Surface',   value: 'Desktop dashboard + a 14-command CLI at parity' },
                { label: 'Scale',     value: '~13,300 lines across 100 modules' },
                { label: 'Testing',   value: '447 pytest cases, ~5,900 lines of tests' },
                { label: 'Shipping',  value: 'Packaged win64 beta, versioned release log' }
            ]
        },
        links: [
            { label: 'View source on GitHub', href: 'https://github.com/salesir/omniswitch' }
        ],
        parts: [
            {
                title: 'The Core: Multi-Provider Account Switching & Snapshot Engine',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Swap between accounts instantly, instead of signing out and back in all day.</span></p>

                    <p class="codex__page-lead">
                        <strong>OmniSwitch</strong> is a cross-provider AI account switcher and multi-model dashboard for Windows that enables instant, zero-friction session switching across <strong>OpenAI Codex</strong>, <strong>Claude Code</strong>, and <strong>Google Antigravity</strong>.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/screenshot1.png" alt="OmniSwitch Dashboard - Account Switching Interface" loading="lazy">
                        <div class="codex__image-caption">OmniSwitch Native Dashboard — Multi-Account Overview & Single-Click Switching</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Instant Account Swapping</h4>
                            <p class="codex__feature-desc">Swaps active developer logins in milliseconds without tedious sign-out/sign-in loops or session re-authentication.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Atomic Backup & Rollback</h4>
                            <p class="codex__feature-desc">Maintains an atomic snapshot history of the 20 most recent authentication states with instant recovery protection.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Zero-Config CLI Locator</h4>
                            <p class="codex__feature-desc">Discovers tool executables (e.g. <code>codex.exe</code> and <code>claude.exe</code>) automatically across local app paths even when omitted from system PATH.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Guided OAuth Sign-In</h4>
                            <p class="codex__feature-desc">Automates provider CLI authentication flows in the browser for seamless Google and single-sign-on credentials.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Python 3.13</span>
                        <span class="codex__tech-pill">CustomTkinter</span>
                        <span class="codex__tech-pill">Win32 API (pywin32)</span>
                        <span class="codex__tech-pill">Windows Credential Manager</span>
                        <span class="codex__tech-pill">Atomic I/O</span>
                    </div>
                `
            },
            {
                title: 'Embedded Chat AI: Zero-Metered Web Intelligence',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Use the AI chat you already pay for, inside the app, without paying for it twice.</span></p>

                    <p class="codex__page-lead">
                        Integrates the full web experiences of <strong>Claude</strong> and <strong>ChatGPT</strong> directly into the developer workspace, powered by an embedded Chromium/WebView2 runtime with zero API keys and zero token costs.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/screenshot2.png" alt="Embedded Chat AI Workspace" loading="lazy">
                        <div class="codex__image-caption">Embedded Chat AI — Native WebView2 Claude & ChatGPT Integration with Session Capture</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Native WebView2 Subprocess</h4>
                            <p class="codex__feature-desc">Embeds full web interfaces into the desktop GUI with seamless Win32 window reparenting and tree-kill lifecycle supervisors.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Unmetered Intelligence</h4>
                            <p class="codex__feature-desc">Leverages personal web subscriptions directly, eliminating token limits, credit card top-ups, and developer API billing.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">One-Click Session Capture</h4>
                            <p class="codex__feature-desc">Instantly extracts prompts, reasoning, and code blocks from active web conversations directly into local workspace files.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Isolated Browser Sandboxing</h4>
                            <p class="codex__feature-desc">Dedicated WebView2 user data profile isolated from system browsers, preventing session contamination.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Microsoft Edge WebView2</span>
                        <span class="codex__tech-pill">pywebview</span>
                        <span class="codex__tech-pill">Win32 IPC</span>
                        <span class="codex__tech-pill">Process Tree Supervision</span>
                    </div>
                `
            },
            {
                title: 'Shared Context: Unified Agent Memory & Memory Bridge',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Every AI reads from the same set of notes, so none of them lose the plot.</span></p>

                    <p class="codex__page-lead">
                        Solves the AI fragmentation problem by establishing a unified <strong><code>AGENTS.md</code></strong> shared memory bridge, ensuring that autonomous coding agents and conversational models stay perfectly aligned on project goals.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/screenshot3.png" alt="Shared Context Viewer" loading="lazy">
                        <div class="codex__image-caption">Shared Context Viewer — Real-Time AGENTS.md Inspector and Context Absorber</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Unified AGENTS.md Standard</h4>
                            <p class="codex__feature-desc">Maintains a standardized single source of truth for architectural decisions, task lists, and coding standards.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Real-Time Context Absorption</h4>
                            <p class="codex__feature-desc">Pulls working notes, project briefs, and brainstorm findings from whichever AI is currently active directly into the repository.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Seamless Multi-Agent Hand-off</h4>
                            <p class="codex__feature-desc">Enables seamless context continuity when switching from ideation in Claude to implementation in Codex or Antigravity.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Universal Path Binding</h4>
                            <p class="codex__feature-desc">Quick directory picker and relative path resolution to attach context files to any codebase on disk.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Markdown Parsing</span>
                        <span class="codex__tech-pill">File Watchers</span>
                        <span class="codex__tech-pill">TOML Configuration</span>
                        <span class="codex__tech-pill">State Synchronization</span>
                    </div>
                `
            },
            {
                title: 'Quick New Account: Automated Setup with Strict Safety Guardrails',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Sets up new accounts for you, and deliberately stops before anything it should not do on its own.</span></p>

                    <p class="codex__page-lead">
                        An intelligent registration automation engine designed to rapidly provision sandboxed secondary accounts for testing and high-throughput workflows, backed by rigorous security guardrails.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/screenshot4.png" alt="Quick New Account Setup" loading="lazy">
                        <div class="codex__image-caption">Quick Create Account — Granular Field Configuration, DOM Autofill & Credential Vault</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Per-Field Mode Customization</h4>
                            <p class="codex__feature-desc">Configure each registration field to <em>Off</em>, <em>My info</em>, or <em>Random</em> identity generation.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Zero-Plaintext Security Vault</h4>
                            <p class="codex__feature-desc">Generated credentials and security tokens are stored strictly within the hardware-backed Windows Credential Manager.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Smart DOM Navigation</h4>
                            <p class="codex__feature-desc">Injects validated DOM scripts to fill inputs and auto-advance across multi-step registration forms.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Absolute Human Guardrails</h4>
                            <p class="codex__feature-desc">Strictly halts at human verification roadblocks (SMS / CAPTCHA) and never clicks final contract/creation buttons.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">DOM Automation</span>
                        <span class="codex__tech-pill">Windows Credential Manager</span>
                        <span class="codex__tech-pill">Cryptographic Entropy</span>
                        <span class="codex__tech-pill">Account Notebook Store</span>
                    </div>
                `
            },
            {
                title: 'Quota Telemetry, Auto-Failover & Enterprise Security',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Watches how much of your usage limit is left, and moves you to another account before you run out.</span></p>

                    <p class="codex__page-lead">
                        High-availability quota telemetry and automated failover that keeps engineering momentum uninterrupted, combined with complete offline privacy and single-action data destruction.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/screenshot5.png" alt="Settings and Quota Configuration" loading="lazy">
                        <div class="codex__image-caption">Advanced Settings — Quota Polling Windows, Failover Rules & Danger Zone Controls</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Dual-Window Quota Tracking</h4>
                            <p class="codex__feature-desc">Continuous telemetry monitoring 5-hour burst limits and 7-day rolling quota windows across all saved accounts.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Smart Auto-Failover</h4>
                            <p class="codex__feature-desc">Automatically routes workloads to active backup accounts the instant rate limits or quotas are reached.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">System Tray Integration</h4>
                            <p class="codex__feature-desc">Single-instance mutex guard with background tray icon, quick actions, and customizable hotkeys.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Danger Zone Cryptographic Wipe</h4>
                            <p class="codex__feature-desc">Complete one-click data destruction that scrubs all local application caches and Windows credentials.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Threaded Polling Engine</span>
                        <span class="codex__tech-pill">Windows Mutex (win32event)</span>
                        <span class="codex__tech-pill">pystray</span>
                        <span class="codex__tech-pill">DPAPI Encryption</span>
                        <span class="codex__tech-pill">PyInstaller Standalone Build</span>
                    </div>
                `
            },
            {
                title: 'Agent Delegation, Context Relay & Isolated Parallel Sessions',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>The AIs hand jobs to each other and report back — supervised, logged, and impossible to lose track of.</span></p>

                    <p class="codex__page-lead">
                        The part I am most interested in: OmniSwitch can hand a scoped task from one coding agent
                        to another, and get a verifiable answer back. Agents are <strong>ranked</strong> &mdash;
                        Claude Code, then Codex, then Antigravity &mdash; and delegation flows
                        <strong>downward only</strong>, which is what stops two agents handing work back and forth
                        forever. The user sits above the hierarchy and can delegate to anyone.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/omniswitch-delegation.png" alt="The Delegation tab showing the agent hierarchy, a task form, and a task list where one entry is marked needs-human and another completed" loading="lazy">
                        <div class="codex__image-caption">The delegation queue &mdash; hierarchy across the top, and every handoff tracked to completed, errored, or waiting on a human</div>
                    </div>

                    <h5 class="codex__subhead">The handshake</h5>
                    <p>
                        A delegated task is a file, not a socket. OmniSwitch writes <code>DELEGATION.md</code> into the
                        project with a task id, and the receiving agent has to acknowledge it and report back through
                        markers in that same file:
                    </p>

                    <pre class="codex__sample"><code>[[OMNISWITCH-ACK d9326b515555]]        &lt;- agent confirms it started

[[OMNISWITCH-DONE d9326b515555]]
&lt;result / summary here&gt;
[[OMNISWITCH-END]]                     &lt;- agent reports back</code></pre>

                    <p>
                        Because the trail is a file in the repository, a handoff survives a crashed terminal, a closed
                        app, or an agent that simply never answers &mdash; and the delegator can always tell which of
                        those happened. The guide also resolves each agent's absolute launcher path, so a delegate that
                        cannot find a peer on <code>PATH</code> still reaches it instead of giving up or pretending to
                        be it.
                    </p>

                    <div class="codex__callout">
                        <strong>One design decision I am glad I made:</strong> the delegation guide tells the receiving
                        agent to treat the task text as <em>data</em>, not as instructions &mdash; to apply the same
                        judgement it would to any user request. An orchestration system that pipes untrusted text into
                        another agent is a prompt-injection channel unless you say so explicitly.
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Delegated Task Workflow</h4>
                            <p class="codex__feature-desc">Creates a project-local <code>DELEGATION.md</code> handoff, launches the selected agent, and tracks explicit ACK/DONE markers so work has a durable status trail.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Automatic Delivery & Diagnostics</h4>
                            <p class="codex__feature-desc">Dispatches tasks through configured CLI and desktop transports, reports actionable failures, and preserves concise results instead of losing context in raw command output.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Isolated Parallel Work</h4>
                            <p class="codex__feature-desc">Runs multiple CLI workloads with account-specific configuration homes, allowing concurrent jobs without colliding with the shared ambient login state.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">File Context Relay</h4>
                            <p class="codex__feature-desc">Builds bounded, cancellable project-context messages with type filters and a live preview, so relevant files can move into an active AI workflow without freezing the app.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Agent Orchestration</span>
                        <span class="codex__tech-pill">Thread Pools</span>
                        <span class="codex__tech-pill">CODEX_HOME Isolation</span>
                        <span class="codex__tech-pill">CLAUDE_CONFIG_DIR Isolation</span>
                        <span class="codex__tech-pill">Chrome DevTools Protocol</span>
                        <span class="codex__tech-pill">Streaming File Scan</span>
                    </div>

                    <h5 class="codex__subhead">How it stays honest</h5>
                    <p>
                        All of the above sits on a test suite that runs in well under a minute:
                    </p>

                    <pre class="codex__sample"><code>$ python -m pytest -q
........................................................................ [ 16%]
........................................................................ [ 32%]
........................................................................ [ 48%]
........................................................................ [ 64%]
........................................................................ [ 80%]
........................................................................ [ 96%]
...............                                                          [100%]

<span class="codex__pass">447 passed in 43.78s</span></code></pre>

                `
            },
            {
                title: 'The CLI: Everything the Dashboard Does, Without the Dashboard',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Anything you can click, you can also script — which is what lets the AIs drive it themselves.</span></p>

                    <p class="codex__page-lead">
                        Every operation in OmniSwitch exists twice — once as a button, once as a command. The
                        dashboard is a client of the same core the terminal talks to, not the place the logic lives.
                        That is the difference between an app you can automate and one you have to sit in front of.
                    </p>

                    <pre class="codex__sample"><code>$ python -m src.main --help

list      add       switch    restore   remove
quota     quota-all poll      capture   remember
capture-session     context   ask       network</code></pre>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Fourteen Commands, Full Parity</h4>
                            <p class="codex__feature-desc">Capture a login, switch, roll back, read quota, relay context, or drive a chat — every one scriptable, and every one hitting the same code path the GUI does.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Built To Be Called By Something Else</h4>
                            <p class="codex__feature-desc">A CLI is what lets a build script, a scheduled task, or another agent operate OmniSwitch. The delegation system on the previous page depends on exactly this.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">No Config-File Archaeology</h4>
                            <p class="codex__feature-desc">Settings that used to mean hand-editing TOML are surfaced in both interfaces, so neither one is the &ldquo;real&rdquo; way to use the tool.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Same Guarantees Either Way</h4>
                            <p class="codex__feature-desc">Atomic writes and automatic pre-switch backups are enforced in the core, so a scripted switch is exactly as recoverable as a clicked one.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">argparse</span>
                        <span class="codex__tech-pill">Core / Interface Split</span>
                        <span class="codex__tech-pill">Scriptable Automation</span>
                    </div>
                `
            },
            {
                title: 'Adding Another AI Is a Subclass, Not a Rewrite',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Supporting a brand-new AI tool takes an afternoon. There are three because nobody has asked for a fourth.</span></p>

                    <p class="codex__page-lead">
                        OmniSwitch supports Codex, Claude Code and Antigravity today — and that number is a
                        product decision, not a technical ceiling. Everything a provider needs to declare lives
                        behind a <strong>58-line base class</strong>. Support for a new tool is one subclass that
                        answers a handful of questions about where its login lives and how it should be swapped.
                    </p>

                    <pre class="codex__sample"><code>src/providers/
    base.py           58 lines   ← the entire contract
    codex.py         383 lines
    claude_code.py   251 lines
    antigravity.py   306 lines</code></pre>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Declare, Don&rsquo;t Branch</h4>
                            <p class="codex__feature-desc">A provider states where its session lives and which switching strategy it needs. Nothing in the core grows an <code>if</code> for it.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Two Strategies Cover Everything So Far</h4>
                            <p class="codex__feature-desc"><code>instant</code> swaps the auth file in place with no restart; <code>desktop</code> stops, swaps and relaunches for tools with no CLI. A new provider picks one.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">The Hard Parts Are Already Solved</h4>
                            <p class="codex__feature-desc">Backups, atomic writes, quota polling, credential storage and the delegation handshake are all provider-agnostic. A new integration inherits every one of them.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Proven Three Times</h4>
                            <p class="codex__feature-desc">Three providers with genuinely different shapes — two CLI-based, one driven over the Chrome DevTools Protocol — already fit the same contract without bending it.</p>
                        </div>
                    </div>

                    <div class="codex__callout">
                        <strong>Whatever tool comes next, this is ready for it.</strong> Adding a fourth assistant is
                        an afternoon of work against an interface that already survived three very different
                        integrations — the only reason there are three is that nobody has asked for a fourth yet.
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Strategy Pattern</span>
                        <span class="codex__tech-pill">Provider Abstraction</span>
                        <span class="codex__tech-pill">Open For Extension</span>
                    </div>
                `
            }
        ]
    },
    {
        id: 'career-resource-center',
        title: 'Career Resource Center',
        year: '2026',
        spec: {
            summary: 'A desktop tool that helps people write a r\u00e9sum\u00e9, find openings, and rehearse interviews \u2014 built for job seekers with no technical background.',
            plain: 'A free job-hunting assistant for people who have never written a résumé.',
            role: 'Solo build \u00b7 independent',
            stack: ['Python', 'Flask', 'pywebview', 'SQLite', 'PyInstaller'],
            facts: [
                { label: 'Surface',  value: 'Runs on the job seeker\u2019s own machine \u2014 nothing is hosted' },
                { label: 'Scale',    value: '~3,600 lines across 13 modules' },
                { label: 'Assistant', value: 'Zero API cost \u2014 drives a real chat session, not a paid endpoint' },
                { label: 'Design',   value: 'Large type, high contrast, plain language, few screens' }
            ]
        },
        links: [
            { label: 'Read the overview', href: 'https://salesir.github.io/career-resource-center/' },
            { label: 'View source on GitHub', href: 'https://github.com/salesir/career-resource-center' }
        ],
        parts: [
            {
                title: 'Built for People Who Are Not Developers',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Built so someone who has never used a tool like this can still finish a résumé today.</span></p>

                    <p class="codex__page-lead">
                        Every other project here is a tool for engineers or a game. This one is for someone sitting
                        down to write a r\u00e9sum\u00e9 who may never have written one before. That single constraint
                        drove every decision in it.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/crc-landing.png" alt="The opening screen, headed &lsquo;Preparing you for the work you want&rsquo;, with one large button and a note that no account setup is needed" loading="lazy">
                        <div class="codex__image-caption">One large button, plain language, and no account to create &mdash; the first screen asks nothing of the job seeker</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">It Reads Your Existing R\u00e9sum\u00e9</h4>
                            <p class="codex__feature-desc">Upload a <code>.docx</code>, <code>.pdf</code>, <code>.txt</code> or <code>.rtf</code> and it becomes an editable r\u00e9sum\u00e9 in the app. The format is sniffed from the file\u2019s first bytes, so a PDF someone renamed <code>resume.txt</code> is still read correctly.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Career Tracks</h4>
                            <p class="codex__feature-desc">Separate workspaces \u2014 Cybersecurity, IT, Office Administration \u2014 each holding its own skills, experience and notes, with a one-click look-up for typical pay and whether the field is growing.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">One-Page PDF Export</h4>
                            <p class="codex__feature-desc">Any saved r\u00e9sum\u00e9 exports to a clean, printable one-page PDF, ready to attach to an application without reformatting.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Accessibility As A Default</h4>
                            <p class="codex__feature-desc">Large text, high contrast, plain language, and a small consistent set of screens instead of a dense feature grid. If someone finds part of it hard to use, that is filed as a bug.</p>
                        </div>
                    </div>

                    <h5 class="codex__subhead">Three verdicts, not two</h5>
                    <p>
                        The upload validator scores independent signals \u2014 section headings, contact details, dates,
                        bullets, r\u00e9sum\u00e9 vocabulary \u2014 and subtracts for things r\u00e9sum\u00e9s never contain, like
                        <em>Dear Hiring Manager</em> or <em>Ingredients</em>. Crucially it can answer
                        <strong>&ldquo;unsure&rdquo;</strong> rather than being forced into yes or no:
                    </p>

                    <pre class="codex__sample"><code>resume      \u2192  "This looks like your r\u00e9sum\u00e9"        \u2014 proceed
unsure      \u2192  "This might be your r\u00e9sum\u00e9"          \u2014 proceed, but read it carefully
not_resume  \u2192  refused, with the specific reason  \u2014 "this reads like a letter"</code></pre>

                    <p>
                        Text extraction and the judgement call live in separate places on purpose, because only one of
                        them is a judgement call. Guessing wrong in either direction costs the job seeker real time,
                        and a confident wrong answer is worse than an honest hedge.
                    </p>

                                        <div class="codex__image-container">
                        <img src="assets/crc-career-tracks.png" alt="The Career Tracks screen with a partly typed search showing matching job titles including IT Project Coordinator and Logistics Coordinator" loading="lazy">
                        <div class="codex__image-caption">Career Tracks &mdash; typing part of a title matches anywhere in it, not just the start, across technical and non-technical fields alike</div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Flask</span>
                        <span class="codex__tech-pill">pywebview</span>
                        <span class="codex__tech-pill">SQLite</span>
                        <span class="codex__tech-pill">pypdf</span>
                        <span class="codex__tech-pill">fpdf2</span>
                    </div>
                `
            },
            {
                title: 'An Assistant That Costs the Organisation Nothing',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Gives every job seeker a real AI assistant without the organisation paying a penny for it.</span></p>

                    <p class="codex__page-lead">
                        A non-profit resource centre cannot always fund per-seat API keys. So until one exists, the
                        assistant runs on a <strong>web-automation bridge</strong>: the app opens a second window
                        pointed at a real chat service, parks it off-screen, then types into it and reads its replies
                        on the job seeker\u2019s behalf. They only ever see the app\u2019s own chat tab.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/crc-chat.png" alt="The chat tab, where a job seeker describes culinary experience and the assistant offers to build a resume while stating it will not invent missing details" loading="lazy">
                        <div class="codex__image-caption">The assistant answers in the app&rsquo;s own chat tab &mdash; and says plainly what it does <em>not</em> know</div>
                    </div>

                    <div class="codex__callout">
                        <strong>It refuses to invent things.</strong> Asked for a r&eacute;sum&eacute; from a few sentences, it answers &ldquo;without making up details &mdash; I&rsquo;ll leave out anything you haven&rsquo;t specified yet, such as your exact degree, work dates, and specific responsibilities.&rdquo; A tool that confidently fills in someone&rsquo;s employment dates would be actively dangerous: they are the one who has to defend it in the interview.
                    </div>

                    <div class="codex__image-container">
                        <img src="assets/crc-resume-editor.png" alt="The resume editor holding a generated summary, skills and experience section, with buttons to rebuild it from the chat or ask the assistant for a change" loading="lazy">
                        <div class="codex__image-caption">What the conversation produced, in an editable box &mdash; reviewed before it is saved, never silently</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">One Sign-In, Then Invisible</h4>
                            <p class="codex__feature-desc">The window surfaces once so a counselor can sign in, then returns off-screen. The session persists between runs, so it is normally a one-time step.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">A Seam, Not A Dead End</h4>
                            <p class="codex__feature-desc">The bridge sits behind an interface the paid API can replace with a one-line config change. The free path is a stopgap that was designed to be thrown away.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Conversations Become R\u00e9sum\u00e9s</h4>
                            <p class="codex__feature-desc">A r\u00e9sum\u00e9 the assistant writes during an ordinary conversation is saved into the catalog automatically, rather than being left in a chat log to copy out by hand.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Stays On The Machine</h4>
                            <p class="codex__feature-desc">Nothing is hosted. R\u00e9sum\u00e9s, tracks and notes live in a local SQLite database on the job seeker\u2019s own computer.</p>
                        </div>
                    </div>

                    <div class="codex__callout">
                        <strong>Why not simply hide the window?</strong> A genuinely hidden window gets throttled and
                        stops rendering, which breaks the automation. Parking it far off-screen keeps it alive and
                        drawable while remaining invisible in normal use \u2014 an unglamorous compromise, and the
                        difference between a feature that works and one that fails intermittently.
                    </div>
                `
            },
            {
                title: 'Two Decisions I Reversed',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Two features I built, disliked, and rebuilt properly.</span></p>

                    <p class="codex__page-lead">
                        The parts of this project I am most pleased with are the two places where the first version
                        worked and I replaced it anyway.
                    </p>

                    <h5 class="codex__subhead">The honesty slider had to go</h5>
                    <p>
                        An early build put a <em>Gentle / Balanced / Direct</em> dial on the chat tab \u2014 how blunt
                        should the assistant be with you? It asked the wrong question in the wrong place. Almost nobody
                        answers &ldquo;how much honesty can you handle?&rdquo; truthfully; anyone would feel talked down
                        to by <em>Gentle</em> and pick <em>Direct</em> to avoid admitting otherwise, which means some
                        people end up with harsher feedback than they actually wanted. It was also the first thing the
                        tool said to someone, before they had done anything worth feedback on.
                    </p>
                    <p>
                        It is now a choice of <strong>which interviewer to practise with</strong>, and it lives in
                        Interview Prep where it belongs. Picking <em>Friendly</em> says nothing about the person \u2014
                        only about the scenario they want to rehearse today.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/crc-interviewer.png" alt="Interview Prep setup asking what kind of interviewer to practice with, on a scale from Friendly through Realistic to Tough, with the selected setting explained beneath" loading="lazy">
                        <div class="codex__image-caption">The same control, reframed &mdash; Friendly / Realistic / Tough describes the interviewer, and every position explains itself</div>
                    </div>

                    <div class="codex__image-container">
                        <img src="assets/crc-interview-practice.png" alt="A practice interview in progress: the assistant asks a scenario question, the job seeker gives a short answer, and the assistant explains specifically why it is too short" loading="lazy">
                        <div class="codex__image-caption">Practice with specific critique &mdash; not &ldquo;good job&rdquo;, but which considerations a hiring manager wanted to hear</div>
                    </div>

                    <h5 class="codex__subhead">Links, not saved postings</h5>
                    <p>
                        The job tracker deep-links into live searches instead of storing individual postings. A stored
                        posting is mostly dead within a month, and a list of dead links is actively worse than nothing
                        for someone who is applying and hearing nothing back. A search for
                        &ldquo;Warehouse Associate near 60601&rdquo; always returns whatever is genuinely open today.
                    </p>
                    <p>
                        The primary source is <strong>CareerOneStop</strong>, run by the U.S. Department of Labor \u2014
                        real aggregated postings, free, no ads, no sign-up \u2014 alongside disability-focused boards and
                        free support services. The whole board is plain data, so when a site changes its URL format the
                        fix is a string, not a code change.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/crc-job-tracker.png" alt="The Job Tracker showing a saved location and a list of common jobs, each with a button that opens live openings for that role nearby" loading="lazy">
                        <div class="codex__image-caption">Set a location once, then every role opens whatever is genuinely hiring near it today</div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Product Judgement</span>
                        <span class="codex__tech-pill">Data-Driven Config</span>
                        <span class="codex__tech-pill">Mark-of-the-Web Handling</span>
                        <span class="codex__tech-pill">Local-First Storage</span>
                    </div>
                `
            }
        ]
    },
    {
        id: 'blackjack-simulator',
        title: 'Blackjack Simulator',
        year: '2026',
        spec: {
            summary: 'Six-deck blackjack odds solved by exact combinatorics rather than Monte Carlo sampling.',
            plain: 'A blackjack engine that works out the true odds of every decision — exactly, not by guessing.',
            role: 'Solo build · runs in the browser',
            stack: ['JavaScript', 'HTML/CSS'],
            facts: [
                { label: 'Method',  value: 'Exact enumeration over a finite 6-deck shoe' },
                { label: 'Depth',   value: 'Counting systems, shuffle tracking, ace sequencing' },
                { label: 'Modes',   value: 'Campaign play and analytical study' },
                { label: 'State',   value: 'Local persistence, custom deck engine' }
            ]
        },
        links: [
            { label: 'Play it in your browser', href: 'https://salesir.github.io/blackjack-table/' },
            { label: 'View source on GitHub', href: 'https://github.com/salesir/blackjack-table' }
        ],
        parts: [
            {
                title: 'Exact 6-Deck Combinatorics & Real-Time Probability Engine',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Most odds tools estimate. This one counts every card still left in the shoe and works out the real answer.</span></p>

                    <p class="codex__page-lead">
                        An advanced <strong>Blackjack & Advantage Play Simulator</strong> built to compute exact mathematical probabilities across a dynamic 6-deck shoe (312 cards), replacing generic random heuristics with 100% rigorous combinatoric modeling.
                    </p>

                    <div class="codex__image-container">
                        <img src="assets/blackjack-odds-panel.png" alt="The analytical view showing per-decision percentages for every seat alongside a dealer forecast column" loading="lazy">
                        <div class="codex__image-caption">Analytical mode &mdash; per-decision probabilities and a dealer-outcome forecast, recomputed from the live shoe</div>
                    </div>

                    <div class="codex__image-container">
                        <img src="assets/blackjack-shoe-state.png" alt="Dealer readout reading six decks, full legal shoe, 312 cards left, dealer bust 0.0 percent" loading="lazy">
                        <div class="codex__image-caption">The shoe is tracked exactly, not sampled &mdash; 6 decks, 312 cards, and a dealer-bust figure derived from what is actually left</div>
                    </div>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Finite Shoe Probability</h4>
                            <p class="codex__feature-desc">Simulates exact card depletion across 6 standard 52-card decks, computing instantaneous dealer bust odds and player expected values (EV).</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">True Count Normalization</h4>
                            <p class="codex__feature-desc">Dynamically recalculates True Count based on exact quarter-deck penetration, providing precision betting signals.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Kelly Criterion & Risk of Ruin</h4>
                            <p class="codex__feature-desc">Built-in bankroll risk calculator modeling bet spreading, standard deviation, and fractional Kelly bet sizing.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Zero-Approximation Math</h4>
                            <p class="codex__feature-desc">Avoids pre-computed static lookup tables by evaluating live conditional probabilities per hand in real time.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">JavaScript (ES6+)</span>
                        <span class="codex__tech-pill">Combinatorics Engine</span>
                        <span class="codex__tech-pill">Probability Modeling</span>
                        <span class="codex__tech-pill">State Machine Architecture</span>
                    </div>
                `
            },
            {
                title: 'Multi-System Card Counting & Interactive Training Drills',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Learn to count cards properly, with drills that catch you the moment you slip.</span></p>

                    <div class="codex__image-container">
                        <img src="assets/blackjack-count-readout.png" alt="Counting readout showing a running count of plus six under Hi-Opt II, a true count of 1.1, and 292 cards left in the shoe" loading="lazy">
                        <div class="codex__image-caption">Running count, true count and remaining shoe, with every rank's remaining copies tracked individually</div>
                    </div>

                    <div class="codex__image-container">
                        <img src="assets/blackjack-practice-settings.png" alt="Practice settings dialog with a counting-system dropdown set to Hi-Opt II and a wrong-answer behaviour set to repeat missed card" loading="lazy">
                        <div class="codex__image-caption">Drill configuration &mdash; the counting system is swappable, and missed cards can be requeued rather than skipped</div>
                    </div>

                    <p class="codex__page-lead">
                        Engineered with a versatile counting core supporting all primary blackjack counting systems, paired with customizable speed-drills and active decision verification.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">7 Supported Count Systems</h4>
                            <p class="codex__feature-desc">Full implementation of <strong>Hi-Lo</strong>, <strong>KO (Knock-Out)</strong>, <strong>Hi-Opt I & II</strong>, <strong>Zen Count</strong>, <strong>Omega II</strong>, and <strong>Halves</strong>.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Rapid-Fire Speed Drills</h4>
                            <p class="codex__feature-desc">Flashcard drill modes with adjustable cadence to train sub-second mental running count updates and error detection.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Ace Side-Count Tracker</h4>
                            <p class="codex__feature-desc">Independent ace density tracker for Level 2 systems to maximize insurance and double-down accuracy.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Index Play Deviations</h4>
                            <p class="codex__feature-desc">Full coverage of the <strong>Illustrious 18</strong> and <strong>Fab 4 Surrender</strong> strategy deviations against the dealer upcard.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Card Counting Systems</span>
                        <span class="codex__tech-pill">Illustrious 18 Matrix</span>
                        <span class="codex__tech-pill">Mental Drill Engine</span>
                        <span class="codex__tech-pill">Real-Time Validation</span>
                    </div>
                `
            },
            {
                title: 'Advanced Advantage Play: Shuffle Tracking & Ace Sequencing',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>The advanced techniques casinos actually watch for, modelled honestly — including where the ethical line sits.</span></p>


                    <p class="codex__page-lead">
                        A visual advantage-play simulator that visualizes how high-card clumps, slug cuts, and key cards propagate through standard multi-pass casino riffle and wash shuffles.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Packet Mapping & Clumping</h4>
                            <p class="codex__feature-desc">Visually track high-card and low-card zones as they are divided into packets during dealer riffles.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Ace Sequencing Windows</h4>
                            <p class="codex__feature-desc">Identify and track 'key card' predictors that signal an upcoming Ace window in subsequent shoes.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Cut Card Optimization</h4>
                            <p class="codex__feature-desc">Predict optimal cut-card placement to bring rich player-favorable slugs directly to the top of the shoe.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Advantage Knowledge Base</h4>
                            <p class="codex__feature-desc">Comprehensive interactive glossary explaining rule shopping, penetration analysis, and table dynamics.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Shuffle Simulation</span>
                        <span class="codex__tech-pill">Packet Tracking Math</span>
                        <span class="codex__tech-pill">Visual Density Mapping</span>
                        <span class="codex__tech-pill">Casino Dynamics</span>
                    </div>
                `
            },
            {
                title: 'High-Fidelity UI, Micro-Animations & Custom Deck Engine',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Built to feel like a real table rather than a spreadsheet.</span></p>

                    <p class="codex__page-lead">
                        Designed with an immersive gothic dark aesthetic featuring tactile micro-animations, physical card dynamics, and customizable visual themes.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Responsive State & Physics</h4>
                            <p class="codex__feature-desc">Every card interaction features state-driven micro-movements: dynamic flare effects, deals, and realistic hover rattle physics.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">4 Custom Deck Renderers</h4>
                            <p class="codex__feature-desc">Switch seamlessly between <strong>Latin Numerals</strong>, <strong>Tarot/Gothic</strong>, <strong>Classic Casino</strong>, and <strong>Minimalist Pip</strong> deck layouts.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Blood & Ember Visual Theme</h4>
                            <p class="codex__feature-desc">Atmospheric color gradients, custom SVGs, and glow shaders delivering an engaging visual experience.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Persistent Local State</h4>
                            <p class="codex__feature-desc">Stores user configurations, drill records, and shoe states automatically in browser LocalStorage.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">CSS3 Keyframes & Transforms</span>
                        <span class="codex__tech-pill">SVG Vector Graphics</span>
                        <span class="codex__tech-pill">DOM Animation Engine</span>
                        <span class="codex__tech-pill">LocalStorage Persistence</span>
                    </div>
                `
            }
        ]
    },
    {
        id: 'companion-uni',
        title: 'CompanionUni',
        year: '2024–2026',
        spec: {
            summary: 'A transparent, always-on-top character that walks to real desktop icons, reacts to being dragged, and runs file commands.',
            plain: 'An animated character that lives on your desktop and really does move your files.',
            role: 'Solo build · shelved prototype',
            stack: ['C#', 'Unity 6 URP', 'Win32 API', 'glTF / VRM'],
            facts: [
                { label: 'Rendering',   value: 'Alpha-preserving DX11 / URP click-through overlay' },
                { label: 'Desktop',     value: 'Reads Explorer icons cross-process via Win32 virtual memory' },
                { label: 'File ops',    value: 'SHFileOperation on a recycle-bin-safe path' },
                { label: 'Avatars',     value: 'Runtime glTF / GLB / VRM loading with humanoid retargeting' }
            ]
        },
        links: [
            { label: 'View source on GitHub', href: 'https://github.com/salesir/CompanionUni' }
        ],
        parts: [
            {
                title: 'Windows Desktop Companion Built in Unity',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>A character that sits on top of Windows and reacts to being clicked, dragged, and talked to.</span></p>

                    <div class="codex__video">
                        <video src="assets/companionuni-demo.mp4"
                               poster="assets/companionuni-poster.jpg"
                               autoplay muted loop playsinline preload="metadata" controls
                               aria-label="CompanionUni running on a Windows desktop: the character walks to icons, responds to commands, and opens its menus"></video>
                        <div class="codex__image-caption">Recorded on a live Windows desktop &mdash; walking to icons, radial menu, appearance and action controls</div>
                    </div>

                    <p class="codex__page-lead">
                        <strong>CompanionUni</strong> is a packaged Windows desktop-companion prototype built in Unity. It combines a transparent desktop window, interactive character control, and a modular behavior layer so a 3D character can live alongside ordinary desktop work.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Desktop Window Integration</h4>
                            <p class="codex__feature-desc">Built a transparent, desktop-aware presentation layer with window-mode controls so the companion can inhabit the desktop rather than a conventional game screen.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Interactive Character Control</h4>
                            <p class="codex__feature-desc">Implemented drag interactions, click reactions, movement, idle variety, clothing toggles, and context-menu actions around an interchangeable character profile system.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Behavior State Machine</h4>
                            <p class="codex__feature-desc">Organized appearance, idle, walking, dragging, sitting, dancing, and temporary reactions into a distinct behavior-state architecture with pose arbitration.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Shippable Windows Build</h4>
                            <p class="codex__feature-desc">Produced a standalone Windows build with the Unity runtime and required managed dependencies included alongside the executable.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Unity</span>
                        <span class="codex__tech-pill">C#</span>
                        <span class="codex__tech-pill">Windows Desktop Integration</span>
                        <span class="codex__tech-pill">Unity Input System</span>
                        <span class="codex__tech-pill">State Machines</span>
                    </div>
                `
            },
            {
                title: 'Runtime Avatars, Native Animation & Character Profiles',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Drop in almost any character model and it just works, animations and all.</span></p>


                    <p class="codex__page-lead">
                        The character pipeline is designed to support both project-bundled and user-selected runtime avatars. It maintains character-specific presentation, animation, and interaction behavior instead of treating every model as the same prefab.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Runtime glTF / VRM Loading</h4>
                            <p class="codex__feature-desc">Loads external character files at runtime through the UniGLTF and UniVRM ecosystem, registers the resulting model, and safely replaces the previous runtime instance when requested.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Native Clip Support</h4>
                            <p class="codex__feature-desc">Includes a dedicated runtime glTF clip controller for characters whose original animation clips and non-humanoid rigs need to be preserved rather than forced through a generic humanoid path.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Per-Character Presentation</h4>
                            <p class="codex__feature-desc">Uses character profiles, a central action library, expression drivers, and pose arbitration to coordinate model-specific behaviors with shared desktop interactions.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Diagnostics as Tooling</h4>
                            <p class="codex__feature-desc">Added editor utilities to inspect animation imports and compare character behavior, making failures in real-world assets easier to isolate and reproduce.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">UniGLTF</span>
                        <span class="codex__tech-pill">UniVRM</span>
                        <span class="codex__tech-pill">Runtime Asset Loading</span>
                        <span class="codex__tech-pill">Animation Systems</span>
                        <span class="codex__tech-pill">Editor Tooling</span>
                    </div>
                `
            },
            {
                title: 'Desktop-Surface Interaction & Command Handling',
                content: `
                    <p class="codex__plain"><span class="codex__plain-mark" aria-hidden="true"></span><span>Tell it to tidy a folder and it walks across your desktop and does it.</span></p>

                    <div class="codex__image-container">
                        <img src="assets/companionuni-radial-menu.png" alt="A radial menu around the character with eight segments: AI chat, mood, pose, tools, close, move, character and settings" loading="lazy">
                        <div class="codex__image-caption">The radial command menu &mdash; every companion action one gesture from the character</div>
                    </div>

                    <p class="codex__page-lead">
                        CompanionUni explores what it takes for a character to understand and act on the desktop around it: it can scan visible desktop targets, sit on nearby icons, and interpret a controlled set of natural-language-style commands into visible actions.
                    </p>

                    <div class="codex__features">
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Desktop Target Scanning</h4>
                            <p class="codex__feature-desc">Scans desktop items, resolves their screen-space geometry, and uses the nearest eligible target for icon and folder interactions.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Surface-Aware Sitting</h4>
                            <p class="codex__feature-desc">Calculates a character-local seat pose from a selected desktop item and synchronizes it with the active animation and behavior layers.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Command Parsing</h4>
                            <p class="codex__feature-desc">Parses commands for opening, creating, renaming, duplicating, moving, refreshing, focusing, and recycling desktop items, then pairs the result with a readable character gesture.</p>
                        </div>
                        <div class="codex__feature-card">
                            <h4 class="codex__feature-title">Feedback-First Interaction</h4>
                            <p class="codex__feature-desc">Uses effects, visible gestures, target selection, and event logging to make desktop actions legible instead of turning the character into an opaque automation layer.</p>
                        </div>
                    </div>

                    <div class="codex__tech-stack">
                        <span class="codex__tech-pill">Win32 Interop</span>
                        <span class="codex__tech-pill">Desktop Geometry</span>
                        <span class="codex__tech-pill">Command Parsing</span>
                        <span class="codex__tech-pill">Coroutines</span>
                        <span class="codex__tech-pill">UI Feedback</span>
                    </div>
                `
            }
        ]
    },
];
