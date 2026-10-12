// Wirepad component library, templates and responsive adapt — ported from the
// Claude Design handoff (wirepad-lib.js) close to 1:1. Renderers are framework-agnostic:
// makeRenderer(createElement, Icon) returns render(el). Types live in wirepad-lib.d.ts.

export const FRAMES = {
  desktop: { label: 'Desktop', w: 1440, h: 1024 },
  tablet: { label: 'Tablet', w: 834, h: 1194 },
  mobile: { label: 'Mobile', w: 390, h: 844 },
};
export const uid = () => Math.random().toString(36).slice(2, 9);
const T = (type, label, icon, w, h, props = {}, at) => ({ type, label, icon, w, h, props, at });
const FULL = -1, INSET = -2;
const WEB = ['desktop', 'tablet'], APP = ['mobile', 'tablet'];

export const CATEGORIES = [
  { name: 'Basics', items: [
    T('heading', 'Heading', 'Heading', 360, 44, { text: 'Page heading' }),
    T('text', 'Text', 'Type', 240, 24, { text: 'Text label' }),
    T('paragraph', 'Paragraph', 'AlignLeft', 360, 72, { text: '' }),
    T('link', 'Link', 'Link', 120, 24, { text: 'Learn more' }),
    T('image', 'Image', 'Image', 320, 200, { text: '' }),
    T('video', 'Video', 'Video|Film', 360, 200),
    T('avatar', 'Avatar', 'CircleUser|UserCircle', 48, 48),
    T('rect', 'Rectangle', 'Square', 160, 100),
    T('ellipse', 'Ellipse', 'Circle', 100, 100),
    T('divider', 'Divider', 'Minus', 320, 12),
    T('arrow', 'Arrow', 'MoveRight|ArrowRight', 160, 20),
    T('note', 'Sticky note', 'StickyNote', 180, 140, { text: 'Note…' }),
  ]},
  { name: 'Sections', only: WEB, items: [
    T('navbar', 'Navbar', 'PanelTop', FULL, 72, { text: 'Acme', items: 'Product, Solutions, Pricing, Docs' }, 'top'),
    T('heroSplit', 'Hero · split', 'LayoutPanelLeft|Columns2', FULL, 640, { text: 'Ship better products, faster', sub: '', value: 'Announcing v2.0', items: 'Get started, Book a demo' }),
    T('heroCenter', 'Hero · centered', 'LayoutTemplate|PanelTop', FULL, 760, { text: 'The workspace for modern teams', sub: '', items: 'Start for free, Watch demo' }),
    T('logos', 'Logo cloud', 'Building2|Building', FULL, 160, { text: 'Trusted by teams at' }),
    T('features', 'Features', 'LayoutGrid', FULL, 460, { text: 'Everything your team needs', sub: '', items: 'Real-time collaboration, Enterprise security, Advanced analytics' }),
    T('featureSplit', 'Feature · image', 'GalleryHorizontal|Image', FULL, 560, { text: 'Work together without the chaos', value: 'COLLABORATION', sub: '', items: 'Real-time sync, Version history, Granular permissions', on: '' }),
    T('stats', 'Stats', 'Hash', FULL, 200, { items: '10k+ Active teams, 99.9% Uptime, 24/7 Support, 150+ Countries' }),
    T('testimonial', 'Testimonial', 'Quote', FULL, 360, { text: '“We replaced four tools with one. Our team ships twice as fast and nobody misses the old workflow.”', sub: 'Jordan Lee', value: 'Head of Product, Northwind' }),
    T('pricing', 'Pricing', 'BadgeDollarSign|DollarSign', FULL, 680, { text: 'Simple, transparent pricing', sub: '', items: 'Starter, Pro, Enterprise' }),
    T('faq', 'FAQ', 'CircleHelp|HelpCircle', FULL, 520, { text: 'Frequently asked questions', sub: '', items: 'How does the free trial work?, Can I change plans later?, Do you offer discounts for nonprofits?, How secure is my data?' }),
    T('blog', 'Blog grid', 'Newspaper', FULL, 520, { text: 'From the blog', items: 'How we rebuilt our editor, Designing for speed, A guide to async teams' }),
    T('team', 'Team', 'Users', FULL, 440, { text: 'Meet the team', items: 'Alex Kim, Sam Rivera, Priya Shah, Leo Martin' }),
    T('gallery', 'Gallery', 'LayoutGrid|Grid', FULL, 480, { value: '' }),
    T('contact', 'Contact', 'Mail', FULL, 600, { text: 'Get in touch', sub: '' }),
    T('cta', 'CTA banner', 'Megaphone', FULL, 360, { text: 'Ready to get started?', sub: '', items: 'Start free trial, Talk to sales' }),
    T('newsletter', 'Newsletter', 'Send', FULL, 220, { text: 'Stay in the loop', sub: '' }),
    T('footer', 'Footer', 'PanelBottom', FULL, 320, { text: 'Acme' }, 'bottom'),
  ]},
  { name: 'App UI', only: WEB, items: [
    T('sidebar', 'Sidebar', 'PanelLeft', 240, FULL, { text: 'Acme', items: 'Dashboard, Projects, Inbox, Calendar, Team, Reports, Settings' }),
    T('topbar', 'Top bar', 'PanelTop', 1200, 64, { text: 'Overview' }),
    T('filterbar', 'Filter bar', 'Filter', 1100, 40, { items: 'All, Active, Archived' }),
    T('tabs', 'Tabs', 'Columns3', 420, 40, { items: 'Overview, Activity, Settings' }),
    T('breadcrumb', 'Breadcrumb', 'ChevronsRight', 320, 24, { items: 'Home, Projects, Wirepad' }),
    T('pagination', 'Pagination', 'Ellipsis|MoreHorizontal', 300, 36),
    T('card', 'Card', 'CreditCard', 300, 300, { text: 'Card title' }),
    T('list', 'List', 'List', 360, 240),
    T('settingRow', 'Setting row', 'ToggleRight', 640, 72, { text: 'Email notifications', sub: '', on: '1' }),
    T('emptyState', 'Empty state', 'Inbox', 400, 320, { text: 'No projects yet', sub: '', items: 'Create project' }),
  ]},
  { name: 'Mobile', only: APP, items: [
    T('statusbar', 'Status bar', 'Signal', FULL, 44, {}, 'top'),
    T('navLarge', 'Large title', 'Heading1|Heading', FULL, 104, { text: 'Discover', on: '' }),
    T('appbar', 'App bar', 'ArrowLeft', FULL, 52, { text: 'Title' }),
    T('searchPill', 'Search', 'Search', INSET, 40, { text: 'Search' }),
    T('cellNav', 'Cell · menu', 'ChevronRight', FULL, 56, { text: 'Notifications', value: '', icon: 'Bell' }),
    T('cellAvatar', 'Cell · person', 'CircleUser|UserCircle', FULL, 72, { text: 'Maya Chen', sub: '', value: '9:41', on: '1' }),
    T('cellThumb', 'Cell · item', 'ShoppingBag', FULL, 96, { text: 'Product name', sub: '', value: '$24.00', on: '' }),
    T('settingsGroup', 'Settings group', 'Rows3|List', INSET, 224, { text: 'Preferences', items: 'Notifications, Appearance, Language, Dark mode' }),
    T('carousel', 'Carousel', 'GalleryHorizontalEnd|GalleryHorizontal', FULL, 240, { text: 'Popular now' }),
    T('productCard', 'Product card', 'Tag', 171, 236, { text: 'Product name', value: '$48.00' }),
    T('profileHeader', 'Profile header', 'UserRound|User', FULL, 300, { text: 'Jordan Lee', sub: '@jordan · Designer', items: '128 Posts, 2.4k Followers, 312 Following' }),
    T('bubble', 'Chat bubble', 'MessageCircle', 260, 44, { text: 'Hey! Are we still on?', on: '' }),
    T('composer', 'Composer', 'SendHorizontal|Send', FULL, 64, { text: 'Message' }, 'bottom'),
    T('fab', 'Floating button', 'CirclePlus|PlusCircle', 56, 56, { icon: 'Plus' }),
    T('bottomSheet', 'Bottom sheet', 'PanelBottomOpen|PanelBottom', FULL, 380, { text: 'Sort by', items: 'Recommended, Newest, Price: low to high, Price: high to low' }, 'bottom'),
    T('actionSheet', 'Action sheet', 'ListCollapse|List', INSET, 260, { items: 'Share, Copy link, Report' }, 'bottom'),
    T('tabbar', 'Tab bar', 'PanelBottom', FULL, 84, { items: 'Home, Search, Saved, Profile' }, 'bottom'),
    T('dots', 'Page dots', 'Ellipsis|MoreHorizontal', 64, 8, { value: '1' }),
    T('keyboard', 'Keyboard', 'Keyboard', FULL, 290, {}, 'bottom'),
    T('homeind', 'Home bar', 'GripHorizontal|Minus', FULL, 34, {}, 'bottom'),
  ]},
  { name: 'Forms', items: [
    T('button', 'Button', 'MousePointerClick', 140, 44, { text: 'Button' }),
    T('button2', 'Secondary', 'RectangleHorizontal', 140, 44, { text: 'Cancel' }),
    T('field', 'Field', 'TextCursorInput', 320, 72, { text: 'Email', sub: 'you@example.com' }),
    T('input', 'Input', 'TextCursor', 280, 44, { text: 'Placeholder' }),
    T('textarea', 'Text area', 'AlignJustify', 320, 120, { text: 'Write something…' }),
    T('search', 'Search', 'Search', 280, 44, { text: 'Search…' }),
    T('select', 'Dropdown', 'SquareChevronDown|ChevronDown', 240, 44, { text: 'Select option' }),
    T('segmented', 'Segmented', 'SquareSplitHorizontal|Columns2', 320, 40, { items: 'Day, Week, Month' }),
    T('chips', 'Chips', 'Tags|Tag', 360, 36, { items: 'All, Design, Product, Engineering' }),
    T('checkbox', 'Checkbox', 'SquareCheck|CheckSquare', 180, 24, { text: 'Remember me', on: '1' }),
    T('radio', 'Radio', 'CircleDot', 180, 24, { text: 'Option', on: '1' }),
    T('toggle', 'Toggle', 'ToggleRight', 44, 26, { on: '1' }),
    T('stepper', 'Stepper', 'Plus', 112, 40, { value: '1' }),
    T('otp', 'Code input', 'RectangleEllipsis|Hash', 280, 56, { value: '4' }),
    T('steps', 'Progress steps', 'ListChecks', 480, 56, { items: 'Cart, Shipping, Payment', value: '2' }),
    T('slider', 'Slider', 'SlidersHorizontal', 240, 24, { value: '60' }),
    T('progress', 'Progress', 'Activity', 240, 8, { value: '60' }),
    T('badge', 'Badge', 'BadgeCheck|Tag', 72, 26, { text: 'New' }),
  ]},
  { name: 'Data', items: [
    T('table', 'Table', 'Table2|Table', 720, 320, { items: 'Name, Company, Status, Date, Amount' }),
    T('stat', 'Stat card', 'TrendingUp', 270, 128, { text: 'Revenue', value: '$48,210', sub: '' }),
    T('barchart', 'Bar chart', 'ChartColumn|BarChart3', 420, 280, { text: 'Revenue' }),
    T('linechart', 'Line chart', 'ChartLine|LineChart', 420, 280, { text: 'Growth' }),
    T('piechart', 'Donut chart', 'ChartPie|PieChart', 320, 200, { text: 'Channels' }),
    T('calendar', 'Calendar', 'CalendarDays|Calendar', 320, 320, { text: 'October 2026' }),
  ]},
  { name: 'Overlays', items: [
    T('modal', 'Modal', 'AppWindow', 440, 260, { text: 'Modal title' }),
    T('confirm', 'Confirm', 'CircleAlert|AlertCircle', 320, 240, { text: 'Delete this item?' }),
    T('dropdown', 'Menu', 'Menu', 220, 168, { items: 'Edit, Duplicate, Share, Delete' }),
    T('alert', 'Alert', 'Info', 400, 72, { text: 'Your trial ends in 3 days' }),
    T('toast', 'Toast', 'Bell', 320, 52, { text: 'Changes saved' }),
    T('tooltip', 'Tooltip', 'MessageSquare', 160, 48, { text: 'Tooltip text' }),
    T('scrim', 'Backdrop', 'SquareDashed|Square', FULL, FULL),
  ]},
  { name: 'Icons', items: ['Star', 'Heart', 'Search', 'Menu', 'User', 'Settings', 'Bell', 'House', 'ShoppingCart', 'Mail', 'Plus', 'X', 'Check', 'Camera', 'Calendar', 'Share2', 'Trash2', 'Lock', 'MapPin', 'Filter']
    .map(n => T('icon', n === 'House' ? 'Home' : n === 'Share2' ? 'Share' : n === 'Trash2' ? 'Trash' : n, n, 28, 28, { icon: n })) },
];

const f = (k, label, kind = 'text', hint = '') => ({ k, label, kind, hint });
const T_ = l => f('text', l), S_ = l => f('sub', l, 'text', 'Empty shows placeholder lines'), V_ = (l, h) => f('value', l, 'text', h || ''), L_ = (l, h) => f('items', l, 'area', h || 'Comma separated'), O_ = l => f('on', l, 'toggle'), IC = f('icon', 'Icon', 'icon');
export const FIELDS = {
  rect: [f('fill', 'Fill', 'toggle')], ellipse: [f('fill', 'Fill', 'toggle')],
  text: [T_('Text')], heading: [T_('Text')], link: [T_('Label')], note: [T_('Note')], paragraph: [f('text', 'Text', 'area', 'Empty shows placeholder lines')],
  button: [T_('Label')], button2: [T_('Label')], badge: [T_('Label')],
  field: [T_('Label'), f('sub', 'Placeholder')], input: [T_('Placeholder')], textarea: [T_('Placeholder')], search: [T_('Placeholder')], select: [T_('Value')],
  segmented: [L_('Options')], chips: [L_('Chips', 'Comma separated · first is selected')],
  checkbox: [T_('Label'), O_('Checked')], radio: [T_('Label'), O_('Selected')], toggle: [O_('On')],
  stepper: [V_('Value')], otp: [V_('Number of digits')], steps: [L_('Steps'), V_('Current step', 'e.g. 2')],
  slider: [V_('Percent', '0–100')], progress: [V_('Percent', '0–100')],
  navbar: [T_('Brand'), L_('Links')], topbar: [T_('Title')], sidebar: [T_('Brand'), L_('Menu items', 'Comma separated · first is active')],
  filterbar: [L_('Filters')], tabs: [L_('Tabs', 'Comma separated · first is active')], breadcrumb: [L_('Path')],
  heroSplit: [T_('Headline'), S_('Subtitle'), V_('Badge', 'Empty hides the badge'), L_('Buttons', 'Up to 2, comma separated')],
  heroCenter: [T_('Headline'), S_('Subtitle'), L_('Buttons', 'Up to 2, comma separated')],
  logos: [T_('Caption')], features: [T_('Heading'), S_('Subtitle'), L_('Features')],
  featureSplit: [V_('Eyebrow'), T_('Heading'), S_('Body'), L_('Checklist'), O_('Image on right')],
  stats: [L_('Stats', 'Number then label, e.g. 10k+ Users')], testimonial: [f('text', 'Quote', 'area'), f('sub', 'Name'), V_('Role')],
  pricing: [T_('Heading'), S_('Subtitle'), L_('Plans', 'Comma separated · 2nd is highlighted')], faq: [T_('Heading'), S_('Subtitle'), L_('Questions')],
  blog: [T_('Heading'), L_('Article titles')], team: [T_('Heading'), S_('Subtitle'), L_('Names')], gallery: [V_('Columns', 'Auto when empty')],
  contact: [T_('Heading'), S_('Subtitle')], cta: [T_('Heading'), S_('Subtitle'), L_('Buttons', 'Up to 2, comma separated')], newsletter: [T_('Heading'), S_('Subtitle')], footer: [T_('Brand')],
  card: [T_('Title')], list: [f('text', 'Title', 'text', 'Empty shows placeholder lines')], listitem: [f('text', 'Title', 'text', 'Empty shows placeholder lines')],
  settingRow: [T_('Title'), f('sub', 'Description', 'text', 'Empty shows placeholder line'), O_('On')], emptyState: [T_('Title'), f('sub', 'Description', 'text', 'Empty shows placeholder lines'), L_('Button', 'Empty hides the button')],
  table: [L_('Columns', 'A column named Status shows pills')], stat: [T_('Label'), V_('Value'), f('sub', 'Change')],
  barchart: [T_('Title')], linechart: [T_('Title')], piechart: [T_('Title')], calendar: [T_('Month')], image: [T_('Caption')], icon: [IC],
  navLarge: [T_('Title'), O_('Back button')], appbar: [T_('Title')], searchPill: [T_('Placeholder')],
  cellNav: [T_('Label'), V_('Detail'), IC], cellAvatar: [T_('Name'), f('sub', 'Message', 'text', 'Empty shows placeholder line'), V_('Time'), O_('Unread')],
  cellThumb: [T_('Title'), f('sub', 'Subtitle', 'text', 'Empty shows placeholder line'), V_('Price'), O_('Quantity stepper')],
  settingsGroup: [T_('Group title'), L_('Rows', 'Comma separated · last row has a toggle')], carousel: [T_('Title')], productCard: [T_('Name'), V_('Price')],
  profileHeader: [T_('Name'), f('sub', 'Handle'), L_('Stats', 'Number then label')], bubble: [f('text', 'Message', 'area'), O_('Sent by me')], composer: [T_('Placeholder')], fab: [IC],
  bottomSheet: [T_('Title'), L_('Options')], actionSheet: [L_('Options')], tabbar: [L_('Tabs', 'Comma separated · first is active')], dots: [V_('Active dot', '1–4')],
  modal: [T_('Title')], confirm: [T_('Title')], dropdown: [L_('Menu items')], alert: [T_('Message')], toast: [T_('Message')], tooltip: [T_('Text')],
};
export const ICON_NAMES = ['Star', 'Heart', 'Search', 'Menu', 'User', 'Users', 'Settings', 'Bell', 'House', 'ShoppingCart', 'ShoppingBag', 'Mail', 'Plus', 'X', 'Check', 'Camera', 'Calendar', 'Share2', 'Trash2', 'Lock', 'MapPin', 'Filter', 'Download', 'Upload', 'Phone', 'MessageCircle', 'Bookmark', 'Clock', 'Eye', 'Pencil', 'ArrowRight', 'ArrowLeft', 'ChevronDown', 'Info', 'Globe', 'Image', 'Music', 'Play', 'Sun', 'Moon', 'Zap', 'CreditCard', 'Shield', 'HelpCircle', 'LogOut', 'Wifi'];
export const LABELS = {};
const DEF = {};
CATEGORIES.forEach(c => c.items.forEach(i => { if (!LABELS[i.type]) LABELS[i.type] = i.label; if (!DEF[i.type]) DEF[i.type] = i.props; }));
Object.assign(LABELS, { icon: 'Icon', listitem: 'List item', line: 'Line', map: 'Map' });

const C = { ink: '#1d1d1f', mute: '#6e6e73', soft: '#a1a1a6', line: '#e5e5e2', line2: '#d4d4d0', fill: '#ededea', fill2: '#f6f6f4', paper: '#ffffff' };
const TAB_IC = { home: 'House|Home', search: 'Search', explore: 'Compass', discover: 'Compass', saved: 'Bookmark', favorites: 'Heart', profile: 'User', account: 'User', me: 'User', cart: 'ShoppingBag', shop: 'ShoppingBag', inbox: 'Inbox', messages: 'MessageCircle', chats: 'MessageCircle', calls: 'Phone', people: 'Users', settings: 'Settings', activity: 'Bell', library: 'Library|BookOpen', orders: 'Package' };

export function makeRenderer(h, Icon) {
  return function render(el) {
    const W = el.w, H = el.h, p = el.props || {};
    const I = (n, s = 18, c = C.ink, w = 1.75) => h(Icon, { name: n, size: s, color: c, strokeWidth: w });
    const d = (style, ...ch) => h('div', { style }, ...ch);
    const full = { position: 'absolute', inset: 0, boxSizing: 'border-box' };
    const row = (x = {}) => ({ display: 'flex', alignItems: 'center', ...x });
    const col = (x = {}) => ({ display: 'flex', flexDirection: 'column', ...x });
    const ctr = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const bar = (w, x = {}) => d({ height: 8, width: w, maxWidth: '100%', background: C.fill, borderRadius: 4, flexShrink: 0, ...x });
    const tx = (t, x = {}) => d({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, ...x }, t);
    const its = () => String(p.items ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const ph = (x = {}, s = 28) => d({ background: C.fill, ...ctr, overflow: 'hidden', borderRadius: 8, boxSizing: 'border-box', ...x }, I('Image', s, C.soft, 1.5));
    const btn = (t, k = 'pri', x = {}, ic) => d({ ...row({ justifyContent: 'center', gap: 8 }), height: 40, padding: '0 18px', borderRadius: 8, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', flexShrink: 0, background: k === 'pri' ? C.ink : k === 'sec' ? C.paper : 'transparent', color: k === 'pri' ? '#fff' : C.ink, border: k === 'sec' ? `1px solid ${C.line2}` : '1px solid transparent', ...x }, ic ? I(ic, 16, k === 'pri' ? '#fff' : C.ink) : null, t);
    const chip = (t, on) => d({ ...row(), height: 34, padding: '0 14px', borderRadius: 99, fontSize: 14, whiteSpace: 'nowrap', boxSizing: 'border-box', flexShrink: 0, background: on ? C.ink : C.paper, color: on ? '#fff' : C.ink, border: `1px solid ${on ? C.ink : C.line2}` }, t);
    const av = (s, x = {}) => d({ width: s, height: s, borderRadius: 99, background: C.fill, ...ctr, flexShrink: 0, ...x }, I('User', Math.round(s * 0.5), C.soft, 1.75));
    const tog = (on, w = 44, ht = 26) => d({ width: w, height: ht, borderRadius: 99, background: on ? C.ink : C.line2, position: 'relative', flexShrink: 0 }, d({ position: 'absolute', top: 3, left: on ? w - ht + 3 : 3, width: ht - 6, height: ht - 6, borderRadius: 99, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }));
    const step = v => d({ ...row(), height: '100%', minHeight: 32, border: `1px solid ${C.line2}`, borderRadius: 99, justifyContent: 'space-between', padding: '0 4px', boxSizing: 'border-box', flexShrink: 0, gap: 4 }, d({ width: 28, ...ctr }, I('Minus', 14)), d({ minWidth: 16, textAlign: 'center', fontSize: 15, fontWeight: 500 }, v), d({ width: 28, ...ctr }, I('Plus', 14)));
    const pad = W >= 1100 ? 80 : W >= 700 ? 40 : 20, wide = W >= 760, hs = W >= 1100 ? 56 : W >= 700 ? 44 : 32;
    const H2 = (t, x = {}) => d({ fontSize: Math.round(hs * 0.7), fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, textWrap: 'balance', ...x }, t);
    const sub = (n = 2, x = {}) => p.sub ? d({ fontSize: 17, lineHeight: 1.5, color: C.mute, textWrap: 'pretty', ...x }, p.sub)
      : d(col({ gap: 10, width: '100%', ...x }), ...Array.from({ length: n }, (_, i) => bar(n > 1 && i === n - 1 ? '62%' : '100%')));
    const border = `1px solid ${C.line2}`;
    const on = !!p.on;
    switch (el.type) {
      case 'rect': return d({ ...full, border, borderRadius: 8, background: p.fill ? C.fill : 'transparent' });
      case 'ellipse': return d({ ...full, border: `1.5px solid ${C.line2}`, borderRadius: '50%', background: p.fill ? C.fill : 'transparent' });
      case 'line': return d({ ...full, ...row() }, d({ height: 1.5, width: '100%', background: C.soft }));
      case 'arrow': return d({ ...full, ...row() }, d({ flex: 1, height: 1.5, background: C.mute }), d({ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `10px solid ${C.mute}` }));
      case 'divider': return d({ ...full, ...row() }, d({ height: 1, width: '100%', background: C.line }));
      case 'text': return d({ ...full, fontSize: 16, lineHeight: 1.4, overflow: 'hidden' }, p.text);
      case 'heading': return d({ ...full, fontSize: Math.max(14, Math.round(H * 0.72)), lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }, p.text);
      case 'link': return tx(p.text, { ...full, fontSize: 15, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 });
      case 'note': return d({ ...full, background: '#fbf1b8', padding: 14, fontSize: 15, lineHeight: 1.4, borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,.08)', overflow: 'hidden' }, p.text);
      case 'paragraph': {
        if (p.text) return d({ ...full, fontSize: 16, lineHeight: 1.55, color: C.mute, overflow: 'hidden', textWrap: 'pretty' }, p.text);
        const n = Math.max(1, Math.floor((H + 10) / 18));
        return d({ ...full, ...col({ gap: 10 }), paddingTop: 2, overflow: 'hidden' }, ...Array.from({ length: n }, (_, i) => bar(n > 1 && i === n - 1 ? '58%' : ['100%', '96%', '98%', '92%'][i % 4])));
      }
      case 'button': return d({ ...full, background: C.ink, color: '#fff', borderRadius: 8, ...ctr, fontSize: 15, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap' }, p.text);
      case 'button2': return d({ ...full, border, borderRadius: 8, ...ctr, fontSize: 15, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap' }, p.text);
      case 'field': return d({ ...full, ...col({ gap: 6 }) }, tx(p.text, { fontSize: 14, fontWeight: 500 }), d({ flex: 1, ...row(), border, borderRadius: 8, padding: '0 14px', color: C.soft, fontSize: 15, minHeight: 0 }, tx(p.sub)));
      case 'input': return d({ ...full, border, borderRadius: 8, ...row(), padding: '0 14px', color: C.soft, fontSize: 15 }, tx(p.text));
      case 'textarea': return d({ ...full, border, borderRadius: 8, padding: '12px 14px', color: C.soft, fontSize: 15, overflow: 'hidden' }, p.text);
      case 'search': return d({ ...full, border, borderRadius: 8, ...row({ gap: 10 }), padding: '0 14px', color: C.soft, fontSize: 15 }, I('Search', 17, C.soft), tx(p.text));
      case 'select': return d({ ...full, border, borderRadius: 8, ...row({ gap: 8 }), padding: '0 12px 0 14px', fontSize: 15 }, tx(p.text, { flex: 1 }), I('ChevronDown', 18, C.mute));
      case 'segmented': return d({ ...full, display: 'flex', padding: 3, background: C.fill, borderRadius: 9, gap: 2 }, ...its().map((t, i) => d({ flex: 1, ...ctr, borderRadius: 7, fontSize: 14, fontWeight: i === 0 ? 600 : 500, background: i === 0 ? C.paper : 'transparent', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,.12)' : 'none', color: i === 0 ? C.ink : C.mute, whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0 }, t)));
      case 'chips': return d({ ...full, ...row({ gap: 8 }), overflow: 'hidden' }, ...its().map((t, i) => chip(t, i === 0)));
      case 'checkbox': { const s = Math.min(20, H); return d({ ...full, ...row({ gap: 10 }), fontSize: 15 }, d({ width: s, height: s, boxSizing: 'border-box', borderRadius: 5, border: on ? 'none' : `1.5px solid ${C.line2}`, background: on ? C.ink : 'transparent', ...ctr, flexShrink: 0 }, on ? I('Check', s - 6, '#fff', 3) : null), tx(p.text)); }
      case 'radio': { const s = Math.min(20, H); return d({ ...full, ...row({ gap: 10 }), fontSize: 15 }, d({ width: s, height: s, boxSizing: 'border-box', borderRadius: 99, border: `1.5px solid ${on ? C.ink : C.line2}`, ...ctr, flexShrink: 0 }, on ? d({ width: s - 10, height: s - 10, borderRadius: 99, background: C.ink }) : null), tx(p.text)); }
      case 'toggle': return d({ ...full }, tog(on, W, H));
      case 'stepper': return d({ ...full }, step(p.value || '1'));
      case 'otp': { const n = Math.max(1, Math.min(8, +p.value || 4)); return d({ ...full, display: 'flex', gap: 10 }, ...Array.from({ length: n }, (_, i) => d({ flex: 1, boxSizing: 'border-box', border: i === 0 ? `2px solid ${C.ink}` : border, borderRadius: 10, ...ctr, fontSize: 24, fontWeight: 600 }, i === 0 ? '4' : ''))); }
      case 'steps': {
        const a = its(), cur = Math.max(0, (+p.value || 1) - 1);
        return d({ ...full, ...row({ alignItems: 'flex-start' }) }, ...a.flatMap((t, i) => [
          d({ ...col({ alignItems: 'center', gap: 6 }), flexShrink: 0 }, d({ width: 28, height: 28, borderRadius: 99, boxSizing: 'border-box', ...ctr, fontSize: 13, fontWeight: 600, background: i <= cur ? C.ink : C.paper, color: i <= cur ? '#fff' : C.mute, border: `1.5px solid ${i <= cur ? C.ink : C.line2}` }, i < cur ? I('Check', 14, '#fff', 2.5) : String(i + 1)), tx(t, { fontSize: 13, color: i <= cur ? C.ink : C.mute })),
          i < a.length - 1 ? d({ flex: 1, height: 2, background: i < cur ? C.ink : C.line, margin: '13px 10px 0' }) : null]));
      }
      case 'slider': { const pc = Math.max(0, Math.min(100, +p.value || 0)); return d({ ...full, ...row() }, d({ position: 'relative', width: '100%', height: 4, background: C.fill, borderRadius: 2 }, d({ position: 'absolute', left: 0, top: 0, bottom: 0, width: pc + '%', background: C.ink, borderRadius: 2 }), d({ position: 'absolute', left: `calc(${pc}% - 10px)`, top: -8, width: 20, height: 20, borderRadius: 99, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)' }))); }
      case 'progress': { const pc = Math.max(0, Math.min(100, +p.value || 0)); return d({ ...full, background: C.fill, borderRadius: H, overflow: 'hidden' }, d({ height: '100%', width: pc + '%', background: C.ink, borderRadius: H })); }
      case 'badge': return d({ ...full, background: C.fill, borderRadius: 99, ...ctr, fontSize: 13, fontWeight: 500 }, p.text);
      case 'navbar': {
        return d({ ...full, ...row({ gap: 32 }), padding: `0 ${pad}px`, borderBottom: `1px solid ${C.line}`, background: C.paper },
          d(row({ gap: 10, flexShrink: 0 }), d({ width: 26, height: 26, borderRadius: 7, background: C.ink }), tx(p.text, { fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' })),
          wide ? d(row({ gap: 28, flex: 1, fontSize: 15, color: C.mute, overflow: 'hidden' }), ...its().map(t => tx(t))) : d({ flex: 1 }),
          wide ? d(row({ gap: 8 }), btn('Log in', 'ghost', { height: 38 }), btn('Sign up', 'pri', { height: 38 })) : I('Menu', 24));
      }
      case 'topbar': return d({ ...full, ...row({ gap: 16 }), padding: '0 24px', borderBottom: `1px solid ${C.line}`, background: C.paper },
        tx(p.text, { fontSize: 18, fontWeight: 600, flexShrink: 0 }), d({ flex: 1 }),
        d({ ...row({ gap: 8 }), height: 38, width: Math.min(320, W * 0.35), boxSizing: 'border-box', border, borderRadius: 8, padding: '0 12px', color: C.soft, fontSize: 14 }, I('Search', 16, C.soft), 'Search…', d({ flex: 1 }), d({ fontSize: 11, border: `1px solid ${C.line}`, borderRadius: 4, padding: '1px 5px', fontFamily: 'var(--font-geist-mono), monospace' }, '⌘K')),
        I('Bell', 20, C.mute), av(34));
      case 'sidebar': {
        const ic = ['LayoutDashboard|LayoutGrid', 'Folder', 'Inbox', 'Calendar', 'Users', 'ChartColumn|BarChart3', 'Settings', 'CreditCard'];
        return d({ ...full, ...col({ gap: 2 }), padding: 16, background: C.fill2, borderRight: `1px solid ${C.line}`, overflow: 'hidden' },
          d(row({ gap: 10, padding: '4px 8px 20px' }), d({ width: 26, height: 26, borderRadius: 7, background: C.ink, flexShrink: 0 }), tx(p.text, { fontWeight: 600, fontSize: 17 })),
          ...its().map((t, i) => d({ ...row({ gap: 12 }), height: 38, padding: '0 10px', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', flexShrink: 0, background: i === 0 ? C.paper : 'transparent', border: `1px solid ${i === 0 ? C.line : 'transparent'}`, color: i === 0 ? C.ink : C.mute }, I(ic[i % ic.length], 18, i === 0 ? C.ink : C.mute), tx(t))),
          d({ flex: 1 }),
          d({ ...row({ gap: 10 }), padding: '12px 8px 0', borderTop: `1px solid ${C.line}` }, av(32), d(col({ gap: 6, flex: 1 }), bar('70%'), bar('45%'))));
      }
      case 'filterbar': return d({ ...full, ...row({ gap: 12 }) },
        d({ ...row({ gap: 8 }), height: '100%', width: Math.min(280, W * 0.3), boxSizing: 'border-box', border, borderRadius: 8, padding: '0 12px', color: C.soft, fontSize: 14, flexShrink: 0 }, I('Search', 16, C.soft), 'Search…'),
        d(row({ gap: 6, flex: 1, overflow: 'hidden' }), ...its().map((t, i) => chip(t, i === 0))),
        btn('Filter', 'sec', { height: '100%' }, 'ListFilter|Filter'), btn('New', 'pri', { height: '100%' }, 'Plus'));
      case 'tabs': return d({ ...full, display: 'flex', alignItems: 'flex-end', gap: 28, borderBottom: `1px solid ${C.line}`, overflow: 'hidden' },
        ...its().map((t, i) => d({ paddingBottom: 10, marginBottom: -1, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', color: i === 0 ? C.ink : C.mute, borderBottom: `2px solid ${i === 0 ? C.ink : 'transparent'}` }, t)));
      case 'breadcrumb': { const a = its(); return d({ ...full, ...row({ gap: 8 }), fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap' }, ...a.flatMap((t, i) => [d({ color: i === a.length - 1 ? C.ink : C.mute, fontWeight: i === a.length - 1 ? 500 : 400 }, t), i < a.length - 1 ? I('ChevronRight', 14, C.soft) : null])); }
      case 'pagination': { const s = Math.min(H, 36); return d({ ...full, ...row({ gap: 6, justifyContent: 'center' }) }, ...['‹', '1', '2', '3', '…', '9', '›'].map((t, i) => d({ width: s, height: s, boxSizing: 'border-box', borderRadius: 8, border: t === '…' || i === 1 ? 'none' : border, background: i === 1 ? C.ink : 'transparent', color: i === 1 ? '#fff' : C.ink, ...ctr, fontSize: 14 }, t))); }
      case 'heroSplit': return d({ ...full, padding: `${wide ? 0 : 32}px ${pad}px`, display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gridTemplateRows: wide ? '1fr' : 'auto 1fr', alignItems: 'center', gap: wide ? 64 : 24 },
        d(col({ gap: 24, minWidth: 0 }),
          p.value ? d({ ...row({ gap: 8 }), alignSelf: 'flex-start', border, borderRadius: 99, padding: '4px 12px 4px 4px', fontSize: 13, color: C.mute }, d({ background: C.ink, color: '#fff', borderRadius: 99, padding: '2px 8px', fontSize: 12 }, 'New'), p.value) : null,
          d({ fontSize: hs, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, textWrap: 'balance' }, p.text),
          sub(3, { maxWidth: 480 }),
          d(row({ gap: 12, marginTop: 8 }), ...its().slice(0, 2).map((t, i) => btn(t, i ? 'sec' : 'pri', { height: 48, padding: '0 22px' })))),
        ph({ alignSelf: 'stretch', margin: wide ? '64px 0' : 0, borderRadius: 14 }, 44));
      case 'heroCenter': return d({ ...full, ...col({ alignItems: 'center', gap: 24 }), padding: `${wide ? 96 : 48}px ${pad}px 0`, textAlign: 'center', overflow: 'hidden' },
        d({ fontSize: hs + 4, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, maxWidth: 900, textWrap: 'balance' }, p.text),
        sub(2, { maxWidth: 560, alignItems: 'center' }),
        d(row({ gap: 12, marginTop: 4 }), ...its().slice(0, 2).map((t, i) => btn(t, i ? 'sec' : 'pri', { height: 48, padding: '0 22px' }))),
        ph({ width: '100%', flex: 1, marginTop: 32, borderRadius: '14px 14px 0 0', border: `1px solid ${C.line}`, borderBottom: 'none', minHeight: 0 }, 48));
      case 'logos': return d({ ...full, ...col({ alignItems: 'center', justifyContent: 'center', gap: 28 }), padding: `0 ${pad}px` },
        tx(p.text, { fontSize: 14, color: C.mute }),
        d(row({ gap: wide ? 56 : 24, justifyContent: 'center', flexWrap: 'wrap' }), ...Array.from({ length: wide ? 6 : 3 }, (_, i) => d(row({ gap: 8 }), d({ width: 24, height: 24, borderRadius: i % 2 ? 99 : 6, background: C.line2 }), bar([72, 56, 84, 64, 76, 60][i], { height: 12, background: C.line2 })))));
      case 'features': {
        const a = its(), cols = W >= 900 ? Math.min(a.length, 3) : W >= 560 ? 2 : 1, FI = ['Zap', 'ShieldCheck|Shield', 'ChartLine|LineChart', 'Layers', 'Globe', 'Sparkles'];
        return d({ ...full, padding: `${wide ? 80 : 40}px ${pad}px`, ...col({ gap: 48 }), overflow: 'hidden' },
          d(col({ alignItems: 'center', gap: 16, textAlign: 'center' }), H2(p.text, { maxWidth: 720 }), sub(2, { maxWidth: 520, alignItems: 'center' })),
          d({ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 40 }, ...a.map((t, i) => d(col({ gap: 14 }),
            d({ width: 44, height: 44, borderRadius: 10, background: C.fill2, border: `1px solid ${C.line}`, ...ctr }, I(FI[i % FI.length], 20)),
            tx(t, { fontSize: 18, fontWeight: 600 }), d(col({ gap: 9 }), bar('100%'), bar('88%'), bar('55%'))))));
      }
      case 'featureSplit': {
        const img = ph({ alignSelf: 'stretch', borderRadius: 14, minHeight: wide ? 0 : 220 }, 40);
        const body = d(col({ gap: 20, justifyContent: 'center', minWidth: 0 }),
          p.value ? tx(p.value, { fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: C.mute }) : null,
          H2(p.text, { fontSize: Math.round(hs * 0.66) }), sub(3),
          its().length ? d(col({ gap: 12 }), ...its().map(t => d(row({ gap: 10, fontSize: 16 }), d({ width: 22, height: 22, borderRadius: 99, background: C.fill, ...ctr, flexShrink: 0 }, I('Check', 13, C.ink, 2.5)), tx(t)))) : null,
          d(row({ gap: 6, fontSize: 15, fontWeight: 500, marginTop: 4 }), 'Learn more', I('ArrowRight', 16)));
        return d({ ...full, padding: `${wide ? 64 : 32}px ${pad}px`, display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: wide ? 64 : 24 }, ...(on ? [body, img] : [img, body]));
      }
      case 'stats': { const a = its(); return d({ ...full, padding: `0 ${pad}px`, display: 'grid', gridTemplateColumns: `repeat(${wide ? a.length : 2},minmax(0,1fr))`, alignContent: 'center', gap: 24, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` },
        ...a.map(t => { const [v, ...r] = t.split(' '); return d(col({ gap: 6, alignItems: 'center', textAlign: 'center', minWidth: 0 }), d({ fontSize: wide ? 44 : 32, fontWeight: 600, letterSpacing: '-0.03em' }, v), tx(r.join(' '), { fontSize: 15, color: C.mute, maxWidth: '100%' })); })); }
      case 'testimonial': return d({ ...full, ...col({ alignItems: 'center', justifyContent: 'center', gap: 28 }), padding: `0 ${pad}px`, textAlign: 'center' },
        I('Quote', 32, C.soft),
        d({ fontSize: wide ? 30 : 21, lineHeight: 1.35, fontWeight: 500, letterSpacing: '-0.015em', maxWidth: 860, textWrap: 'balance' }, p.text),
        d(row({ gap: 12 }), av(44), d(col({ gap: 3, alignItems: 'flex-start' }), d({ fontSize: 15, fontWeight: 600 }, p.sub || 'Name'), d({ fontSize: 14, color: C.mute }, p.value || 'Role'))));
      case 'pricing': {
        const tiers = its(), prices = ['$0', '$19', '$49', '$99'], cols = W >= 900 ? tiers.length : 1;
        return d({ ...full, padding: `${wide ? 72 : 32}px ${pad}px`, ...col({ gap: 40 }), overflow: 'hidden' },
          d(col({ alignItems: 'center', gap: 14, textAlign: 'center' }), H2(p.text), sub(1, { maxWidth: 420, alignItems: 'center' })),
          d({ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 20, flex: 1, minHeight: 0 }, ...tiers.map((t, i) => {
            const hi = i === 1;
            return d({ ...col({ gap: 18 }), padding: 28, borderRadius: 14, border: hi ? `2px solid ${C.ink}` : border, boxSizing: 'border-box', minHeight: 0, overflow: 'hidden' },
              d(row({ justifyContent: 'space-between' }), tx(t, { fontSize: 17, fontWeight: 600 }), hi ? d({ fontSize: 12, background: C.ink, color: '#fff', borderRadius: 99, padding: '3px 10px' }, 'Popular') : null),
              d(row({ alignItems: 'baseline', gap: 4 }), d({ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em' }, prices[i % 4]), d({ fontSize: 15, color: C.mute }, '/month')),
              bar('80%'),
              btn(i === 0 ? 'Start free' : 'Get started', hi ? 'pri' : 'sec', { width: '100%', height: 44 }),
              d({ height: 1, background: C.line, flexShrink: 0 }),
              d(col({ gap: 13 }), ...[70, 85, 60, 75, 50].map(w => d(row({ gap: 10 }), I('Check', 16, C.ink, 2.25), bar(w + '%')))));
          })));
      }
      case 'faq': return d({ ...full, padding: `${wide ? 72 : 32}px ${pad}px`, display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1.6fr)' : '1fr', gap: wide ? 64 : 24, alignContent: 'start' },
        d(col({ gap: 16 }), H2(p.text, { fontSize: Math.round(hs * 0.66) }), sub(2)),
        d(col(), ...its().map((t, i) => d({ ...col({ gap: 14 }), padding: '20px 0', borderBottom: `1px solid ${C.line}`, borderTop: i === 0 ? `1px solid ${C.line}` : 'none' },
          d(row({ gap: 16, justifyContent: 'space-between' }), tx(t, { fontSize: 17, fontWeight: 500 }), I(i === 0 ? 'Minus' : 'Plus', 18)),
          i === 0 ? d(col({ gap: 9 }), bar('100%'), bar('72%')) : null))));
      case 'blog': {
        const cols = W >= 900 ? 3 : W >= 560 ? 2 : 1;
        return d({ ...full, padding: `${wide ? 64 : 32}px ${pad}px`, ...col({ gap: 32 }), overflow: 'hidden' },
          d(row({ justifyContent: 'space-between', gap: 16 }), H2(p.text, { fontSize: Math.round(hs * 0.6) }), d(row({ gap: 6, fontSize: 15, fontWeight: 500, flexShrink: 0 }), 'View all', I('ArrowRight', 16))),
          d({ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 24, flex: 1, minHeight: 0 }, ...its().slice(0, cols).map(t => d(col({ gap: 12, minHeight: 0 }),
            ph({ flex: 1, minHeight: 100, borderRadius: 12 }, 32), tx('Product · 5 min read', { fontSize: 13, color: C.mute }),
            d({ fontSize: 19, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }, t), bar('90%'),
            d(row({ gap: 8, marginTop: 4 }), av(24), bar(80))))));
      }
      case 'team': {
        const cols = W >= 900 ? 4 : 2;
        return d({ ...full, padding: `${wide ? 64 : 32}px ${pad}px`, ...col({ gap: 36 }), overflow: 'hidden' },
          d(col({ alignItems: 'center', gap: 14 }), H2(p.text), sub(1, { maxWidth: 380, alignItems: 'center' })),
          d({ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 24, flex: 1, minHeight: 0 }, ...its().slice(0, cols).map(t => d(col({ gap: 10, alignItems: 'center', minHeight: 0 }),
            d({ width: '100%', flex: 1, minHeight: 80, borderRadius: 14, background: C.fill, ...ctr }, I('User', 48, C.soft, 1.25)), tx(t, { fontSize: 16, fontWeight: 600 }), bar(90)))));
      }
      case 'gallery': {
        const narrow = W < 500, cols = +p.value || (W >= 900 ? 4 : W >= 500 ? 3 : 3), gap = narrow ? 2 : 16, pd = narrow ? 0 : pad;
        const cw = (W - 2 * pd - (cols - 1) * gap) / cols, rh = narrow ? cw : cw * 0.78, vp = narrow ? 0 : 24, rows = Math.max(1, Math.ceil((H - 2 * vp + gap) / (rh + gap)));
        return d({ ...full, padding: `${vp}px ${pd}px`, display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gridAutoRows: rh, gap, overflow: 'hidden' }, ...Array.from({ length: cols * rows }, () => ph({ borderRadius: narrow ? 0 : 10 }, narrow ? 20 : 28)));
      }
      case 'contact': {
        const fld = (l, area) => d(col({ gap: 6, flex: area ? 1 : 'none', minHeight: 0 }), d({ fontSize: 14, fontWeight: 500 }, l), d({ height: area ? 'auto' : 44, flex: area ? 1 : 'none', minHeight: area ? 80 : 0, border, borderRadius: 8 }));
        return d({ ...full, padding: `${wide ? 72 : 32}px ${pad}px`, display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: wide ? 64 : 24 },
          d(col({ gap: 20 }), H2(p.text, { fontSize: Math.round(hs * 0.66) }), sub(2),
            d(col({ gap: 16, marginTop: 12 }), ...[['Mail', 'hello@acme.com'], ['Phone', '+1 (555) 010-2030'], ['MapPin', 'San Francisco, CA']].map(([ic, t]) => d(row({ gap: 12, fontSize: 15 }), d({ width: 40, height: 40, borderRadius: 10, background: C.fill2, border: `1px solid ${C.line}`, ...ctr, flexShrink: 0 }, I(ic, 18)), t)))),
          d({ ...col({ gap: 16 }), padding: 28, borderRadius: 14, border, minHeight: 0 },
            d({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, fld('First name'), fld('Last name')), fld('Email'), fld('Message', true), btn('Send message', 'pri', { height: 46 })));
      }
      case 'cta': return d({ ...full, padding: `24px ${pad}px`, display: 'flex' },
        d({ flex: 1, borderRadius: 18, background: C.ink, color: '#fff', ...col({ alignItems: 'center', justifyContent: 'center', gap: 20 }), padding: 32, textAlign: 'center' },
          H2(p.text, { maxWidth: 720 }),
          p.sub ? d({ fontSize: 17, color: '#c7c7cc', maxWidth: 520 }, p.sub) : bar(320, { background: '#3a3a3d' }),
          d(row({ gap: 12, marginTop: 4 }), btn(its()[0] || 'Get started', 'sec', { border: 'none', height: 48 }), its()[1] ? btn(its()[1], 'ghost', { color: '#fff', border: '1px solid #55555a', height: 48 }) : null)));
      case 'newsletter': return d({ ...full, padding: `0 ${pad}px`, display: 'flex', flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'stretch', justifyContent: wide ? 'space-between' : 'center', gap: 24, background: C.fill2 },
        d(col({ gap: 10 }), d({ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }, p.text), sub(1, { width: wide ? 360 : '100%' })),
        d(row({ gap: 10 }), d({ ...row(), height: 48, width: wide ? 320 : 'auto', flex: wide ? 'none' : 1, boxSizing: 'border-box', border, borderRadius: 8, background: '#fff', padding: '0 14px', color: C.soft, fontSize: 15 }, 'you@example.com'), btn('Subscribe', 'pri', { height: 48 })));
      case 'footer': {
        const brand = p.text || 'Acme', n = wide ? 4 : 2;
        return d({ ...full, padding: `${wide ? 56 : 32}px ${pad}px 0`, ...col(), borderTop: `1px solid ${C.line}`, background: C.paper, overflow: 'hidden' },
          d({ display: 'grid', gridTemplateColumns: wide ? `1.4fr repeat(${n},minmax(0,1fr))` : 'repeat(2,minmax(0,1fr))', gap: 32, flex: 1, minHeight: 0 },
            d(col({ gap: 14 }), d(row({ gap: 8 }), d({ width: 24, height: 24, borderRadius: 6, background: C.ink }), d({ fontWeight: 600, fontSize: 17 }, brand)), bar('80%'), bar('60%')),
            ...['Product', 'Company', 'Resources', 'Legal'].slice(0, n).map(t => d(col({ gap: 14 }), d({ fontSize: 14, fontWeight: 600 }, t), bar('60%'), bar('75%'), bar('50%'), bar('65%')))),
          d({ ...row({ justifyContent: 'space-between' }), height: 64, borderTop: `1px solid ${C.line}`, fontSize: 13, color: C.mute, flexShrink: 0 }, `© 2026 ${brand} Inc.`, d(row({ gap: 16 }), I('Twitter|AtSign', 18, C.mute), I('Github', 18, C.mute), I('Linkedin', 18, C.mute))));
      }
      case 'card': return d({ ...full, border, borderRadius: 12, overflow: 'hidden', ...col() },
        ph({ height: '52%', borderRadius: 0, flexShrink: 0 }, 32),
        d({ padding: 16, ...col({ gap: 10, flex: 1 }), minHeight: 0 }, tx(p.text, { fontSize: 17, fontWeight: 600 }), bar('95%'), bar('70%'), d({ flex: 1 }),
          d(row({ justifyContent: 'space-between' }), d(row({ gap: 8 }), av(24), bar(70)), I('Heart', 18, C.mute))));
      case 'list': case 'listitem': {
        const n = el.type === 'list' ? Math.max(1, Math.floor(H / 64)) : 1, rh = el.type === 'list' ? 64 : H;
        return d({ ...full, overflow: 'hidden' }, ...Array.from({ length: n }, (_, i) => d({ ...row({ gap: 12 }), height: rh, borderBottom: `1px solid ${C.line}`, padding: '0 4px', boxSizing: 'border-box' },
          av(40), d(col({ gap: 8, flex: 1, minWidth: 0 }), p.text ? tx(p.text, { fontSize: 15, fontWeight: 500 }) : bar(['55%', '40%', '62%'][i % 3], { background: C.line2 }), bar(['80%', '70%', '75%'][i % 3])), I('ChevronRight', 18, C.soft))));
      }
      case 'settingRow': return d({ ...full, ...row({ gap: 24, justifyContent: 'space-between' }), borderBottom: `1px solid ${C.line}` },
        d(col({ gap: 6, minWidth: 0 }), tx(p.text, { fontSize: 15, fontWeight: 500 }), p.sub ? tx(p.sub, { fontSize: 14, color: C.mute }) : bar(240)), tog(on));
      case 'emptyState': return d({ ...full, ...col({ alignItems: 'center', justifyContent: 'center', gap: 14 }), padding: 24, textAlign: 'center' },
        d({ width: 64, height: 64, borderRadius: 99, background: C.fill2, border: `1px solid ${C.line}`, ...ctr }, I('Inbox', 28, C.mute)),
        d({ fontSize: 18, fontWeight: 600 }, p.text),
        p.sub ? d({ fontSize: 15, color: C.mute, maxWidth: 320 }, p.sub) : d(col({ gap: 8, alignItems: 'center', width: '70%' }), bar('100%'), bar('70%')),
        its()[0] ? btn(its()[0], 'pri', { marginTop: 6 }, 'Plus') : null);
      case 'table': {
        const c = its(), n = Math.max(1, Math.floor((H - 44) / 52));
        const cb = () => d({ width: 16, height: 16, boxSizing: 'border-box', border: `1.5px solid ${C.line2}`, borderRadius: 4, flexShrink: 0 });
        const cell = (t, j, r) => {
          let kids;
          if (j === 0) kids = [av(28), bar(['60%', '45%', '70%', '52%'][r % 4], { background: C.line2 })];
          else if (/status/i.test(t)) kids = [d({ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 99, background: r % 3 === 1 ? C.fill : 'transparent', border: r % 3 === 1 ? 'none' : border }, ['Active', 'Pending', 'Paused'][r % 3])];
          else kids = [bar(['70%', '45%', '60%', '35%', '55%'][(r + j) % 5])];
          return d({ flex: j === 0 ? 1.6 : 1, minWidth: 0, ...row({ gap: 10 }) }, ...kids);
        };
        const head = d({ ...row({ gap: 16 }), height: 44, padding: '0 16px', background: C.fill2, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }, cb(), ...c.map((t, j) => tx(t, { flex: j === 0 ? 1.6 : 1, fontSize: 13, fontWeight: 500, color: C.mute })));
        const rows = Array.from({ length: n }, (_, r) => d({ ...row({ gap: 16 }), height: 52, padding: '0 16px', borderBottom: `1px solid ${C.line}`, flexShrink: 0 }, cb(), ...c.map((t, j) => cell(t, j, r))));
        return d({ ...full, border, borderRadius: 12, overflow: 'hidden', ...col() }, head, ...rows);
      }
      case 'stat': return d({ ...full, border, borderRadius: 12, padding: 20, ...col({ gap: 8, justifyContent: 'center' }), overflow: 'hidden' },
        d(row({ justifyContent: 'space-between' }), tx(p.text, { fontSize: 14, color: C.mute }), I('TrendingUp', 16, C.mute)),
        tx(p.value, { fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }),
        tx(p.sub || '+12.5% from last month', { fontSize: 13, color: C.mute }));
      case 'barchart': {
        const v = [42, 65, 50, 82, 60, 74, 48, 92, 70, 56];
        return d({ ...full, border, borderRadius: 12, padding: 20, ...col({ gap: 16 }) },
          d(row({ justifyContent: 'space-between' }), tx(p.text, { fontSize: 15, fontWeight: 600 }), d({ fontSize: 12, color: C.mute, border, borderRadius: 6, padding: '3px 8px' }, 'Last 6 months')),
          d({ flex: 1, position: 'relative', minHeight: 0 },
            ...[0, 1, 2, 3].map(i => d({ position: 'absolute', left: 0, right: 0, top: `${i * 33.3}%`, height: 1, background: C.line })),
            d({ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '3%', padding: '0 1%', borderBottom: `1px solid ${C.line2}` }, ...v.slice(0, Math.max(4, Math.min(10, Math.floor(W / 44)))).map((x, i) => d({ flex: 1, height: x + '%', background: x === 92 ? C.ink : C.line2, borderRadius: '4px 4px 0 0' })))));
      }
      case 'linechart': return d({ ...full, border, borderRadius: 12, padding: 20, ...col({ gap: 16 }) },
        d(row({ justifyContent: 'space-between' }), tx(p.text, { fontSize: 15, fontWeight: 600 }), d(row({ gap: 12, fontSize: 12, color: C.mute }), d(row({ gap: 6 }), d({ width: 8, height: 8, borderRadius: 99, background: C.ink }), 'This year'), d(row({ gap: 6 }), d({ width: 8, height: 8, borderRadius: 99, background: C.line2 }), 'Last year'))),
        d({ flex: 1, position: 'relative', minHeight: 0 },
          ...[0, 1, 2, 3].map(i => d({ position: 'absolute', left: 0, right: 0, top: `${i * 33.3}%`, height: 1, background: C.line })),
          h('svg', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }, viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
            h('polygon', { points: '0,100 0,78 14,62 28,66 42,42 57,48 71,28 85,32 100,12 100,100', fill: C.fill2 }),
            h('polyline', { points: '0,88 14,82 28,84 42,70 57,74 71,62 85,66 100,54', fill: 'none', stroke: C.line2, strokeWidth: 2, vectorEffect: 'non-scaling-stroke' }),
            h('polyline', { points: '0,78 14,62 28,66 42,42 57,48 71,28 85,32 100,12', fill: 'none', stroke: C.ink, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }))));
      case 'piechart': {
        const s = Math.max(40, Math.min(H - 40, W * 0.5)), lg = W > s + 120;
        return d({ ...full, border, borderRadius: 12, padding: 20, ...col({ gap: 12 }) }, tx(p.text, { fontSize: 15, fontWeight: 600 }),
          d({ flex: 1, ...row({ gap: 24, justifyContent: 'center' }), minHeight: 0 },
            d({ width: s, height: s, borderRadius: 99, flexShrink: 0, background: `conic-gradient(${C.ink} 0 42%, #8e8e93 0 68%, ${C.line2} 0 86%, ${C.fill} 0 100%)`, ...ctr }, d({ width: '62%', height: '62%', borderRadius: 99, background: '#fff' })),
            lg ? d(col({ gap: 10, flex: 1, minWidth: 0 }), ...[[C.ink, 42], ['#8e8e93', 26], [C.line2, 18], [C.fill, 14]].map(([c, v]) => d(row({ gap: 8, fontSize: 13 }), d({ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }), bar('50%'), d({ marginLeft: 'auto', color: C.mute }, v + '%')))) : null));
      }
      case 'calendar': return d({ ...full, border, borderRadius: 12, padding: 16, ...col({ gap: 10 }) },
        d(row({ justifyContent: 'space-between' }), I('ChevronLeft', 18), d({ fontSize: 15, fontWeight: 600 }, p.text), I('ChevronRight', 18)),
        d({ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', fontSize: 12, color: C.mute, textAlign: 'center' }, ...'SMTWTFS'.split('').map(c => d({}, c))),
        d({ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '1fr', flex: 1, fontSize: 14, minHeight: 0 }, ...Array.from({ length: 35 }, (_, i) => { const n = i - 3, ok = n >= 1 && n <= 31, sel = n === 12; return d(ctr, ok ? d({ width: 30, height: 30, borderRadius: 99, ...ctr, background: sel ? C.ink : 'transparent', color: sel ? '#fff' : C.ink }, String(n)) : null); })));
      case 'image': return d({ ...full, background: C.fill, borderRadius: 8, ...ctr, overflow: 'hidden', flexDirection: 'column', gap: 8 }, I('Image', Math.max(16, Math.min(40, Math.min(W, H) * 0.22)), C.soft, 1.5), p.text ? d({ fontSize: 13, color: C.mute }, p.text) : null);
      case 'video': return d({ ...full, background: '#2c2c2e', borderRadius: 8, ...ctr, overflow: 'hidden' },
        d({ width: 56, height: 56, borderRadius: 99, background: 'rgba(255,255,255,.92)', ...ctr }, d({ width: 0, height: 0, marginLeft: 4, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `16px solid ${C.ink}` })),
        d({ position: 'absolute', left: 16, right: 16, bottom: 14, height: 4, background: '#5a5a5e', borderRadius: 2 }, d({ width: '35%', height: '100%', background: '#fff', borderRadius: 2 })));
      case 'avatar': { const s = Math.min(W, H); return d({ ...full, borderRadius: 99, background: C.fill, ...ctr, overflow: 'hidden' }, I('User', Math.round(s * 0.5), C.soft)); }
      case 'map': return d({ ...full, background: C.fill2, borderRadius: 8, overflow: 'hidden', ...ctr, border: `1px solid ${C.line}` },
        h('svg', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }, viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
          ...['0,30 40,38 100,20', '20,0 30,50 24,100', '0,75 55,60 100,82', '70,0 62,45 80,100'].map((pt, i) => h('polyline', { key: i, points: pt, fill: 'none', stroke: C.line2, strokeWidth: 6, vectorEffect: 'non-scaling-stroke' }))),
        d({ position: 'relative' }, I('MapPin', 32, C.ink, 2)));
      case 'icon': return d({ ...full, ...ctr }, I(p.icon || 'Star', Math.min(W, H), C.ink, 1.75));
      case 'statusbar': return d({ ...full, ...row({ justifyContent: 'space-between' }), padding: '0 28px', fontSize: 16, fontWeight: 600 }, '9:41', d(row({ gap: 6 }), I('Signal', 16, C.ink, 2.25), I('Wifi', 16, C.ink, 2.25), I('BatteryFull|Battery', 22, C.ink, 1.75)));
      case 'navLarge': return d({ ...full, ...col({ justifyContent: 'space-between' }), padding: '6px 16px 10px' },
        d(row({ justifyContent: 'space-between', height: 36 }), on ? d(row({ gap: 0, fontSize: 16, marginLeft: -6 }), I('ChevronLeft', 26), 'Back') : d({}), d(row({ gap: 18 }), I('Search', 22), I('Plus', 24))),
        tx(p.text, { fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }));
      case 'appbar': return d({ ...full, ...row({ gap: 12 }), padding: '0 12px', borderBottom: `1px solid ${C.line}`, background: C.paper }, I('ChevronLeft', 26), tx(p.text, { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 600 }), I('Ellipsis|MoreHorizontal', 24));
      case 'searchPill': return d({ ...full, ...row({ gap: 8 }), background: C.fill, borderRadius: 10, padding: '0 12px', color: C.mute, fontSize: 16 }, I('Search', 18, C.mute), tx(p.text, { flex: 1 }), I('Mic', 18, C.mute));
      case 'cellNav': return d({ ...full, ...row({ gap: 14 }), padding: '0 16px', borderBottom: `1px solid ${C.line}` },
        d({ width: 32, height: 32, borderRadius: 8, background: C.fill, ...ctr, flexShrink: 0 }, I(p.icon || 'Bell', 18)), tx(p.text, { flex: 1, fontSize: 16 }), p.value ? tx(p.value, { fontSize: 15, color: C.mute }) : null, I('ChevronRight', 18, C.soft));
      case 'cellAvatar': return d({ ...full, ...row({ gap: 12 }), padding: '0 16px' }, av(Math.min(48, H - 16)),
        d({ ...col({ gap: 5, flex: 1, minWidth: 0, justifyContent: 'center' }), alignSelf: 'stretch', borderBottom: `1px solid ${C.line}` },
          d(row({ justifyContent: 'space-between', gap: 8 }), tx(p.text, { fontSize: 16, fontWeight: 600 }), p.value ? tx(p.value, { fontSize: 13, color: C.mute, flexShrink: 0 }) : null),
          d(row({ gap: 8 }), p.sub ? tx(p.sub, { fontSize: 15, color: C.mute, flex: 1 }) : bar('75%'), on ? d({ width: 10, height: 10, borderRadius: 99, background: C.ink, flexShrink: 0, marginLeft: 'auto' }) : null)));
      case 'cellThumb': return d({ ...full, ...row({ gap: 14 }), padding: '0 16px', borderBottom: `1px solid ${C.line}` },
        ph({ width: H - 24, height: H - 24, flexShrink: 0, borderRadius: 10 }, 22),
        d(col({ gap: 6, flex: 1, minWidth: 0 }), tx(p.text, { fontSize: 16, fontWeight: 500 }), p.sub ? tx(p.sub, { fontSize: 14, color: C.mute }) : bar('55%'), tx(p.value, { fontSize: 16, fontWeight: 600 })),
        on ? d({ height: 34 }, step('1')) : I('Heart', 20, C.mute));
      case 'settingsGroup': { const a = its(); return d({ ...full, ...col({ gap: 8 }), overflow: 'hidden' },
        p.text ? tx(p.text, { fontSize: 13, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 16px' }) : null,
        d({ background: C.fill2, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.line}` }, ...a.map((t, i) => d({ ...row({ gap: 12 }), height: 48, padding: '0 16px', borderTop: i ? `1px solid ${C.line}` : 'none' }, tx(t, { flex: 1, fontSize: 16 }), i === a.length - 1 ? tog(true) : I('ChevronRight', 18, C.soft))))); }
      case 'carousel': { const cw = Math.round((W - 32) * 0.72); return d({ ...full, ...col({ gap: 12 }), overflow: 'hidden' },
        d({ ...row({ justifyContent: 'space-between' }), padding: '0 16px' }, tx(p.text, { fontSize: 20, fontWeight: 600 }), d({ fontSize: 15, color: C.mute }, 'See all')),
        d({ ...row({ gap: 12, alignItems: 'stretch' }), flex: 1, padding: '0 16px', minHeight: 0 }, ...[0, 1, 2].map(() => d({ width: cw, flexShrink: 0, ...col({ gap: 8 }) }, ph({ flex: 1, borderRadius: 14 }, 28), bar('70%'), bar('40%'))))); }
      case 'productCard': return d({ ...full, ...col({ gap: 6 }) },
        d({ position: 'relative', flex: 1, minHeight: 0 }, ph({ position: 'absolute', inset: 0, borderRadius: 12 }, 28), d({ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 99, background: '#fff', ...ctr }, I('Heart', 16))),
        tx(p.text, { fontSize: 15, fontWeight: 500, marginTop: 4 }), tx(p.value, { fontSize: 15, fontWeight: 600 }));
      case 'profileHeader': return d({ ...full, ...col({ alignItems: 'center', gap: 8 }), padding: '16px 16px 0', overflow: 'hidden' },
        av(88), tx(p.text, { fontSize: 22, fontWeight: 700, marginTop: 4 }), p.sub ? tx(p.sub, { fontSize: 15, color: C.mute }) : bar(160),
        d({ display: 'flex', width: '100%', justifyContent: 'space-around', margin: '10px 0' }, ...its().map(t => { const [v, ...r] = t.split(' '); return d(col({ alignItems: 'center', gap: 2 }), d({ fontSize: 18, fontWeight: 700 }, v), d({ fontSize: 13, color: C.mute }, r.join(' '))); })),
        d({ display: 'flex', gap: 10, width: '100%' }, btn('Follow', 'pri', { flex: 1 }), btn('Message', 'sec', { flex: 1 })));
      case 'bubble': return d({ ...full, display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' },
        d({ maxWidth: '100%', height: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 18, [on ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: 6, background: on ? C.ink : C.fill, color: on ? '#fff' : C.ink, fontSize: 16, lineHeight: 1.4, overflow: 'hidden' }, p.text));
      case 'composer': return d({ ...full, ...row({ gap: 10 }), padding: '0 12px', borderTop: `1px solid ${C.line}`, background: C.paper },
        I('Plus', 24, C.mute), d({ flex: 1, height: 38, boxSizing: 'border-box', borderRadius: 99, border, ...row(), padding: '0 14px', color: C.soft, fontSize: 16 }, p.text), d({ width: 36, height: 36, borderRadius: 99, background: C.ink, ...ctr, flexShrink: 0 }, I('ArrowUp', 18, '#fff', 2.25)));
      case 'fab': return d({ ...full, borderRadius: 99, background: C.ink, ...ctr, boxShadow: '0 6px 16px rgba(0,0,0,.2)' }, I(p.icon || 'Plus', Math.round(Math.min(W, H) * 0.45), '#fff', 2));
      case 'bottomSheet': return d({ ...full, background: C.paper, borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 30px rgba(0,0,0,.12)', ...col({ gap: 4 }), padding: '10px 20px 34px', overflow: 'hidden' },
        d({ width: 40, height: 5, borderRadius: 3, background: C.line2, alignSelf: 'center', flexShrink: 0 }),
        d(row({ justifyContent: 'space-between', margin: '10px 0 6px' }), tx(p.text, { fontSize: 19, fontWeight: 600 }), d({ width: 30, height: 30, borderRadius: 99, background: C.fill, ...ctr }, I('X', 16))),
        ...its().map((t, i) => d({ ...row({ gap: 12 }), height: 50, fontSize: 16, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }, tx(t, { flex: 1 }), d({ width: 22, height: 22, boxSizing: 'border-box', borderRadius: 99, border: `1.5px solid ${i === 0 ? C.ink : C.line2}`, ...ctr }, i === 0 ? d({ width: 12, height: 12, borderRadius: 99, background: C.ink }) : null))),
        d({ flex: 1 }), btn('Apply', 'pri', { height: 50, width: '100%', borderRadius: 12 }));
      case 'actionSheet': { const a = its(); return d({ ...full, ...col({ gap: 8 }) },
        d({ flex: 1, background: C.fill2, borderRadius: 14, overflow: 'hidden', ...col(), border: `1px solid ${C.line}` }, ...a.map((t, i) => d({ flex: 1, ...ctr, fontSize: 18, borderTop: i ? `1px solid ${C.line}` : 'none' }, t))),
        d({ height: 56, flexShrink: 0, background: C.paper, borderRadius: 14, border, ...ctr, fontSize: 18, fontWeight: 600 }, 'Cancel')); }
      case 'tabbar': { const df = ['House|Home', 'Search', 'Heart', 'User', 'Settings']; return d({ ...full, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 8, borderTop: `1px solid ${C.line}`, background: 'rgba(255,255,255,.96)' },
        ...its().map((t, i) => { const c = i === 0 ? C.ink : C.soft; return d(col({ alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: c, minWidth: 0 }), I(TAB_IC[t.toLowerCase()] || df[i % df.length], 24, c, i === 0 ? 2.1 : 1.75), t); })); }
      case 'dots': { const a = Math.max(0, (+p.value || 1) - 1); return d({ ...full, ...row({ gap: 6, justifyContent: 'center' }) }, ...Array.from({ length: 4 }, (_, i) => d({ width: i === a ? 20 : 8, height: 8, borderRadius: 4, background: i === a ? C.ink : C.line2 }))); }
      case 'homeind': return d({ ...full, ...ctr }, d({ width: 134, height: 5, borderRadius: 3, background: C.ink }));
      case 'keyboard': {
        const key = (t, x = {}) => d({ flex: 1, background: '#fff', borderRadius: 6, boxShadow: '0 1px 0 rgba(0,0,0,.25)', ...ctr, fontSize: 18, ...x }, t);
        return d({ ...full, background: '#d8d8dc', padding: '8px 4px 30px', ...col({ gap: 11 }) },
          ...['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((r, i) => d({ flex: 1, display: 'flex', gap: 6, padding: i === 1 ? '0 18px' : i === 2 ? '0 46px' : 0 }, ...r.split('').map(c => key(c)))),
          d({ flex: 1, display: 'flex', gap: 6 }, key('123', { flex: 1.3, background: '#b4b4ba', fontSize: 15 }), key('space', { flex: 5, fontSize: 15 }), key('return', { flex: 1.8, background: '#b4b4ba', fontSize: 15 })));
      }
      case 'modal': return d({ ...full, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,.14)', padding: 24, ...col({ gap: 12 }), overflow: 'hidden' },
        d(row({ gap: 8, marginBottom: 4 }), tx(p.text, { flex: 1, fontSize: 19, fontWeight: 600 }), I('X', 20, C.mute)), bar('100%'), bar('94%'), bar('62%'), d({ flex: 1 }),
        d(row({ justifyContent: 'flex-end', gap: 10 }), btn('Cancel', 'sec'), btn('Confirm', 'pri')));
      case 'confirm': return d({ ...full, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,.14)', padding: 24, ...col({ alignItems: 'center', gap: 10 }), textAlign: 'center', overflow: 'hidden' },
        d({ width: 48, height: 48, borderRadius: 99, background: C.fill, ...ctr }, I('Trash2', 22)), tx(p.text, { fontSize: 18, fontWeight: 600, maxWidth: '100%', marginTop: 4 }), bar('85%'), bar('60%'), d({ flex: 1 }),
        d({ display: 'flex', gap: 10, width: '100%' }, btn('Cancel', 'sec', { flex: 1 }), btn('Delete', 'pri', { flex: 1 })));
      case 'dropdown': return d({ ...full, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.10)', padding: 6, ...col({ gap: 2 }), overflow: 'hidden' },
        ...its().map((t, i) => d({ ...row({ gap: 10 }), height: 36, padding: '0 10px', borderRadius: 6, fontSize: 14, background: i === 0 ? C.fill2 : 'transparent', flexShrink: 0 }, I(['Pencil', 'Copy', 'Share2|Share', 'Trash2', 'Archive'][i % 5], 16, C.mute), tx(t))));
      case 'alert': return d({ ...full, background: C.fill2, border: `1px solid ${C.line}`, borderRadius: 10, ...row({ gap: 14 }), padding: '0 16px', overflow: 'hidden' }, I('Info', 22), d(col({ gap: 8, flex: 1, minWidth: 0 }), tx(p.text, { fontSize: 15, fontWeight: 600 }), bar('70%')), I('X', 16, C.mute));
      case 'toast': return d({ ...full, background: C.ink, color: '#fff', borderRadius: 10, ...row({ gap: 12 }), padding: '0 16px', boxShadow: '0 8px 24px rgba(0,0,0,.18)' }, I('CircleCheck|CheckCircle', 20, '#fff'), tx(p.text, { flex: 1, fontSize: 15 }), I('X', 16, '#c7c7cc'));
      case 'tooltip': return d({ ...full, ...col({ alignItems: 'center' }) }, d({ flex: 1, width: '100%', background: C.ink, color: '#fff', borderRadius: 8, ...ctr, fontSize: 14, padding: '0 10px', overflow: 'hidden', boxSizing: 'border-box' }, tx(p.text)), d({ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `7px solid ${C.ink}` }));
      case 'scrim': return d({ ...full, background: 'rgba(0,0,0,.4)' });
      case 'button2x': return null;
      default: return d({ ...full, border, borderRadius: 8 });
    }
  };
}

const E = (t, x, y, w, h, p = {}) => ({ id: uid(), type: t, x, y, w, h, props: { ...(DEF[t] || {}), ...p } });
const stack = (id, name, frame, list) => {
  const W = FRAMES[frame].w, total = list.reduce((a, r) => a + r[1], 0);
  return { id, name, frame, h: total, build: () => { let y = 0; return list.map(([t, ht, p]) => { const e = E(t, 0, y, W, ht, p); y += ht; return e; }); } };
};
const nav = ['navbar', 72, { text: 'Acme', items: 'Product, Solutions, Pricing, Docs' }];
const foot = ['footer', 320, { text: 'Acme' }];
const D_SIDE = (items) => E('sidebar', 0, 0, 240, 1024, { text: 'Acme', items });
const BLANK = { id: 'blank', name: 'Blank', frame: null, build: () => [] };

export const TEMPLATES = [
  stack('saas', 'SaaS landing', 'desktop', [nav,
    ['heroSplit', 640, { text: 'Ship better products, faster' }], ['logos', 160], ['features', 480],
    ['featureSplit', 560], ['stats', 200], ['testimonial', 360], ['pricing', 680], ['cta', 360], foot]),
  stack('startup', 'Startup homepage', 'desktop', [nav,
    ['heroCenter', 760], ['logos', 160],
    ['featureSplit', 560, { text: 'Plan, track and ship in one place', value: 'PLANNING', on: '1' }],
    ['featureSplit', 560, { text: 'Reports that write themselves', value: 'INSIGHTS', items: 'Live dashboards, Scheduled exports, Custom metrics' }],
    ['faq', 520], ['newsletter', 220], foot]),
  stack('pricingpage', 'Pricing page', 'desktop', [nav,
    ['pricing', 720, { text: 'Plans for teams of every size' }], ['logos', 160],
    ['faq', 560, { text: 'Billing questions', items: 'Can I switch plans anytime?, Do you offer annual billing?, What payment methods do you accept?, Is there a free trial?' }],
    ['cta', 360, { text: 'Still have questions?', items: 'Contact sales' }], foot]),
  stack('blogpage', 'Blog', 'desktop', [nav,
    ['featureSplit', 560, { value: 'FEATURED', text: 'How we rebuilt our editor from scratch', items: '' }],
    ['blog', 520, { text: 'Latest articles' }],
    ['blog', 520, { text: 'Engineering', items: 'Scaling to a million users, Our testing stack, Shipping weekly' }],
    ['newsletter', 220], foot]),
  stack('about', 'About / company', 'desktop', [nav,
    ['heroSplit', 600, { text: 'We build tools for people who make things', value: '', items: 'Join the team, Our story' }],
    ['stats', 200, { items: '2019 Founded, 120 People, 14 Countries, $40M Raised' }],
    ['team', 460], ['gallery', 480], ['contact', 600], foot]),
  { id: 'dashboard', name: 'Dashboard', frame: 'desktop', build: () => [
    D_SIDE('Dashboard, Projects, Inbox, Calendar, Team, Reports, Settings'),
    E('topbar', 240, 0, 1200, 64, { text: 'Overview' }),
    E('stat', 264, 88, 270, 128, { text: 'Revenue', value: '$48,210' }), E('stat', 558, 88, 270, 128, { text: 'Active users', value: '2,481' }),
    E('stat', 852, 88, 270, 128, { text: 'Orders', value: '913' }), E('stat', 1146, 88, 270, 128, { text: 'Churn rate', value: '2.4%' }),
    E('linechart', 264, 240, 760, 340, { text: 'Revenue' }), E('piechart', 1048, 240, 368, 340, { text: 'Traffic sources' }),
    E('table', 264, 604, 1152, 396, { items: 'Customer, Plan, Status, Date, Amount' }),
  ]},
  { id: 'crm', name: 'List / CRM', frame: 'desktop', build: () => [
    D_SIDE('Customers, Deals, Inbox, Calendar, Reports, Settings'),
    E('topbar', 240, 0, 1200, 64, { text: 'Customers' }),
    E('tabs', 264, 88, 520, 40, { items: 'All customers, Active, Churned' }),
    E('filterbar', 264, 152, 1152, 40, { items: 'All, Enterprise, SMB, Startup' }),
    E('table', 264, 216, 1152, 684, { items: 'Customer, Company, Status, Plan, Revenue' }),
    E('pagination', 1116, 924, 300, 36),
  ]},
  { id: 'settingsDesk', name: 'Settings', frame: 'desktop', build: () => [
    D_SIDE('Settings, Dashboard, Projects, Team, Billing'),
    E('heading', 288, 40, 400, 40, { text: 'Settings' }),
    E('tabs', 288, 104, 1104, 40, { items: 'General, Notifications, Billing, Team, Integrations' }),
    E('avatar', 288, 176, 72, 72), E('button2', 376, 190, 120, 44, { text: 'Upload' }), E('link', 512, 200, 100, 24, { text: 'Remove' }),
    E('field', 288, 280, 540, 72, { text: 'Full name', sub: 'Jordan Lee' }), E('field', 852, 280, 540, 72, { text: 'Email', sub: 'jordan@acme.com' }),
    E('settingRow', 288, 384, 1104, 76, { text: 'Email notifications', sub: 'Receive a summary of activity every morning', on: '1' }),
    E('settingRow', 288, 460, 1104, 76, { text: 'Product updates', sub: 'News about features and improvements', on: '' }),
    E('settingRow', 288, 536, 1104, 76, { text: 'Two-factor authentication', sub: 'Add an extra layer of security', on: '1' }),
    E('button2', 1132, 652, 120, 44, { text: 'Cancel' }), E('button', 1268, 652, 124, 44, { text: 'Save' }),
  ]},
  { id: 'signinDesk', name: 'Sign in', frame: 'desktop', build: () => [
    E('rect', 120, 96, 32, 32, { fill: '1' }), E('text', 164, 100, 120, 24, { text: 'Acme' }),
    E('heading', 120, 296, 480, 44, { text: 'Welcome back' }),
    E('text', 120, 352, 480, 24, { text: 'Sign in to continue to your workspace.' }),
    E('field', 120, 416, 480, 72, { text: 'Email', sub: 'you@example.com' }),
    E('field', 120, 508, 480, 72, { text: 'Password', sub: '••••••••' }),
    E('checkbox', 120, 604, 200, 24, { text: 'Remember me' }), E('link', 456, 604, 144, 24, { text: 'Forgot password?' }),
    E('button', 120, 656, 480, 48, { text: 'Sign in' }), E('button2', 120, 720, 480, 48, { text: 'Continue with Google' }),
    E('text', 120, 800, 480, 24, { text: "Don't have an account? Sign up" }),
    E('image', 744, 24, 672, 976),
  ]},
  { id: 'productDesk', name: 'Product page', frame: 'desktop', h: 1200, build: () => [
    E('navbar', 0, 0, 1440, 72, { text: 'Store', items: 'New, Men, Women, Sale' }),
    E('breadcrumb', 80, 104, 400, 24, { items: 'Home, Shoes, Everyday Sneaker' }),
    E('image', 80, 152, 640, 560), ...[0, 1, 2, 3].map(i => E('image', 80 + i * 164, 728, 148, 120)),
    E('heading', 784, 152, 576, 44, { text: 'Everyday Sneaker' }), E('heading', 784, 208, 200, 32, { text: '$120' }),
    E('paragraph', 784, 264, 520, 64),
    E('text', 784, 360, 200, 24, { text: 'Size' }), E('chips', 784, 392, 576, 36, { items: '38, 39, 40, 41, 42, 43' }),
    E('text', 784, 452, 200, 24, { text: 'Color' }), E('segmented', 784, 484, 360, 40, { items: 'Black, White, Grey' }),
    E('stepper', 784, 556, 128, 48), E('button', 928, 556, 432, 48, { text: 'Add to cart' }),
    E('tabs', 784, 648, 576, 40, { items: 'Details, Shipping, Reviews' }), E('paragraph', 784, 712, 576, 100),
    E('blog', 0, 880, 1440, 320, { text: 'You may also like', items: 'Runner, Classic, Trail' }),
  ]},
  stack('landingTab', 'Landing', 'tablet', [['navbar', 64, { text: 'Acme' }],
    ['heroCenter', 720], ['features', 720], ['testimonial', 360], ['cta', 340], ['footer', 360]]),
  { id: 'splitTab', name: 'Mail split view', frame: 'tablet', build: () => [
    E('statusbar', 0, 0, 834, 32),
    E('navLarge', 0, 32, 320, 104, { text: 'Inbox' }), E('searchPill', 16, 140, 288, 40),
    ...['Maya Chen', 'Leo Martin', 'Priya Shah', 'Sam Rivera', 'Alex Kim', 'Nora Diaz', 'Tom Wu', 'Ava Brooks', 'Ivan Petrov', 'Zoe Hart', 'Kai Long', 'Mia Ross'].map((n, i) => E('cellAvatar', 0, 196 + i * 76, 320, 76, { text: n, value: i ? 'Mon' : '9:41', on: i < 2 ? '1' : '' })),
    E('rect', 320, 0, 1, 1194, { fill: '1' }),
    E('appbar', 321, 32, 513, 52, { text: '' }),
    E('heading', 352, 112, 450, 36, { text: 'Project kickoff' }),
    E('cellAvatar', 336, 164, 498, 72, { text: 'Maya Chen', sub: 'to me', value: '9:41', on: '' }),
    E('paragraph', 352, 260, 450, 160), E('image', 352, 448, 450, 280),
    E('composer', 321, 1096, 513, 64), E('homeind', 321, 1160, 513, 34),
  ]},
  { id: 'onboard', name: 'Onboarding', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('link', 330, 56, 44, 24, { text: 'Skip' }),
    E('image', 24, 112, 342, 400), E('dots', 163, 540, 64, 8),
    E('heading', 24, 580, 342, 32, { text: 'Plan trips with friends' }),
    E('paragraph', 24, 628, 342, 44),
    E('button', 24, 724, 342, 52, { text: 'Get started' }), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'signinMob', name: 'Sign in', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('rect', 167, 104, 56, 56, { fill: '1' }),
    E('heading', 24, 196, 342, 32, { text: 'Welcome back' }), E('text', 24, 240, 342, 24, { text: 'Sign in to your account' }),
    E('field', 24, 296, 342, 72, { text: 'Email', sub: 'you@example.com' }), E('field', 24, 384, 342, 72, { text: 'Password', sub: '••••••••' }),
    E('link', 24, 472, 160, 24, { text: 'Forgot password?' }),
    E('button', 24, 520, 342, 52, { text: 'Sign in' }),
    E('divider', 24, 596, 342, 12),
    E('button2', 24, 624, 342, 52, { text: 'Continue with Apple' }), E('button2', 24, 688, 342, 52, { text: 'Continue with Google' }),
    E('text', 88, 764, 240, 24, { text: 'New here? Create account' }), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'feedMob', name: 'Home feed', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('navLarge', 0, 44, 390, 104, { text: 'Discover' }),
    E('searchPill', 16, 152, 358, 40, { text: 'Search places' }),
    E('chips', 16, 208, 374, 34, { items: 'All, Beaches, Mountains, Cities, Food' }),
    E('carousel', 0, 262, 390, 248, { text: 'Popular now' }),
    E('heading', 16, 530, 300, 26, { text: 'Near you' }),
    E('cellThumb', 0, 564, 390, 96, { text: 'Lakeside cabin', value: '$140 / night' }), E('cellThumb', 0, 660, 390, 96, { text: 'City loft', value: '$98 / night' }),
    E('tabbar', 0, 760, 390, 84, { items: 'Home, Explore, Saved, Profile' }),
  ]},
  { id: 'shopMob', name: 'Shop grid', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('navLarge', 0, 44, 390, 104, { text: 'Shop' }),
    E('searchPill', 16, 152, 358, 40, { text: 'Search products' }),
    E('chips', 16, 208, 374, 34, { items: 'All, Shoes, Bags, Watches, Hats' }),
    E('productCard', 16, 262, 171, 236, { text: 'Everyday Sneaker', value: '$120' }), E('productCard', 203, 262, 171, 236, { text: 'Canvas Tote', value: '$48' }),
    E('productCard', 16, 514, 171, 236, { text: 'Field Watch', value: '$210' }), E('productCard', 203, 514, 171, 236, { text: 'Wool Cap', value: '$32' }),
    E('tabbar', 0, 760, 390, 84, { items: 'Home, Search, Cart, Profile' }),
  ]},
  { id: 'pdpMob', name: 'Product detail', frame: 'mobile', build: () => [
    E('image', 0, 0, 390, 420), E('statusbar', 0, 0, 390, 44), E('fab', 16, 56, 40, 40, { icon: 'ArrowLeft' }),
    E('heading', 16, 440, 300, 30, { text: 'Everyday Sneaker' }), E('icon', 346, 444, 26, 26, { icon: 'Heart' }),
    E('heading', 16, 480, 160, 26, { text: '$120.00' }),
    E('text', 16, 528, 200, 22, { text: 'Size' }), E('chips', 16, 558, 374, 34, { items: '38, 39, 40, 41, 42' }),
    E('paragraph', 16, 616, 358, 62),
    E('divider', 0, 700, 390, 12),
    E('stepper', 16, 728, 112, 48), E('button', 140, 728, 234, 48, { text: 'Add to cart' }), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'cartMob', name: 'Cart', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('appbar', 0, 44, 390, 52, { text: 'Cart' }),
    E('steps', 32, 112, 326, 56, { items: 'Cart, Shipping, Payment', value: '1' }),
    E('cellThumb', 0, 184, 390, 104, { text: 'Everyday Sneaker', sub: 'Size 41 · Black', value: '$120.00', on: '1' }),
    E('cellThumb', 0, 288, 390, 104, { text: 'Canvas Tote', sub: 'Natural', value: '$48.00', on: '1' }),
    E('cellThumb', 0, 392, 390, 104, { text: 'Wool Cap', sub: 'Grey', value: '$32.00', on: '1' }),
    E('text', 16, 528, 200, 24, { text: 'Subtotal' }), E('text', 290, 528, 84, 24, { text: '$200.00' }),
    E('text', 16, 560, 200, 24, { text: 'Shipping' }), E('text', 290, 560, 84, 24, { text: 'Free' }),
    E('divider', 16, 592, 358, 12),
    E('heading', 16, 616, 160, 26, { text: 'Total' }), E('heading', 260, 616, 114, 26, { text: '$200.00' }),
    E('button', 16, 740, 358, 52, { text: 'Checkout' }), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'profileMob', name: 'Profile', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('appbar', 0, 44, 390, 52, { text: 'Profile' }),
    E('profileHeader', 0, 96, 390, 300),
    E('tabs', 16, 408, 358, 40, { items: 'Posts, Saved, Tagged' }),
    E('gallery', 0, 456, 390, 304, { value: '3' }),
    E('tabbar', 0, 760, 390, 84, { items: 'Home, Search, Activity, Profile' }),
  ]},
  { id: 'msgsMob', name: 'Messages', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('navLarge', 0, 44, 390, 104, { text: 'Messages' }),
    E('searchPill', 16, 152, 358, 40),
    ...['Maya Chen', 'Leo Martin', 'Design team', 'Priya Shah', 'Sam Rivera', 'Alex Kim', 'Nora Diaz'].map((n, i) => E('cellAvatar', 0, 204 + i * 76, 390, 76, { text: n, value: ['9:41', '9:12', '8:30', 'Yesterday', 'Mon', 'Sun', 'Sat'][i], on: i < 2 ? '1' : '' })),
    E('fab', 318, 680, 56, 56, { icon: 'Pencil' }),
    E('tabbar', 0, 760, 390, 84, { items: 'Chats, Calls, People, Settings' }),
  ]},
  { id: 'chatMob', name: 'Chat', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('appbar', 0, 44, 390, 52, { text: 'Maya Chen' }),
    E('bubble', 16, 120, 270, 66, { text: 'Hey! Are we still on for Saturday morning?', on: '' }),
    E('bubble', 104, 198, 270, 44, { text: 'Yes! 10am at the trailhead', on: '1' }),
    E('bubble', 104, 248, 270, 44, { text: "I'll bring snacks", on: '1' }),
    E('bubble', 16, 304, 270, 44, { text: 'Perfect, see you there', on: '' }),
    E('image', 144, 360, 230, 170),
    E('bubble', 16, 546, 270, 66, { text: 'That view is going to be amazing', on: '' }),
    E('composer', 0, 746, 390, 64), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'settingsMob', name: 'Settings', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('navLarge', 0, 44, 390, 104, { text: 'Settings', on: '1' }),
    E('cellAvatar', 0, 152, 390, 76, { text: 'Jordan Lee', sub: 'Account, security, sign-in', value: '', on: '' }),
    E('settingsGroup', 16, 248, 358, 232, { text: 'Preferences', items: 'Notifications, Appearance, Language, Location services' }),
    E('settingsGroup', 16, 496, 358, 184, { text: 'Support', items: 'Help center, Privacy policy, Dark mode' }),
    E('button2', 16, 704, 358, 48, { text: 'Sign out' }), E('homeind', 0, 810, 390, 34),
  ]},
  { id: 'searchMob', name: 'Search', frame: 'mobile', build: () => [
    E('statusbar', 0, 0, 390, 44), E('searchPill', 16, 56, 358, 40, { text: 'Search' }),
    E('chips', 16, 112, 374, 34, { items: 'Recent, Trending, People, Places' }),
    E('heading', 16, 166, 300, 24, { text: 'Recent searches' }),
    ...['Weekend getaways', 'Coffee near me', 'Hiking trails', 'Bookstores'].map((t, i) => E('cellNav', 0, 200 + i * 56, 390, 56, { text: t, icon: 'Clock' })),
    E('heading', 16, 442, 300, 24, { text: 'Trending' }),
    E('productCard', 16, 478, 171, 260, { text: 'Lisbon', value: '1.2k saves' }), E('productCard', 203, 478, 171, 260, { text: 'Kyoto', value: '980 saves' }),
    E('tabbar', 0, 760, 390, 84, { items: 'Home, Search, Saved, Profile' }),
  ]},
];


const FIXED = new Set(['button', 'button2', 'icon', 'avatar', 'toggle', 'checkbox', 'radio', 'badge', 'fab', 'stepper', 'dots', 'link', 'otp']);
const MEDIA = new Set(['image', 'video', 'map', 'card', 'productCard', 'barchart', 'linechart', 'piechart', 'calendar', 'rect', 'ellipse']);
const TEXTY = new Set(['text', 'paragraph', 'bubble', 'note']);
const GROW = { features: 1.8, pricing: 2.4, faq: 1.25, contact: 1.7, footer: 1.5, stats: 1.5, featureSplit: 1.35, heroSplit: 1.25, team: 1.2, testimonial: 1.2, newsletter: 1.4 };
const BOTTOM_T = new Set(['tabbar', 'composer', 'homeind', 'keyboard', 'bottomSheet', 'actionSheet']);
const BLEED = new Set(['navbar', 'topbar', 'footer', 'heroSplit', 'heroCenter', 'logos', 'features', 'featureSplit', 'stats', 'testimonial', 'pricing', 'faq', 'blog', 'team', 'contact', 'cta', 'newsletter', 'composer', 'divider', 'scrim', 'tabs', 'gallery', 'carousel']);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const splitItems = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean);

export function adaptPage(pg, to) {
  const from = pg.frame;
  if (!FRAMES[to] || from === to) return false;
  const oW = FRAMES[from].w, nW = FRAMES[to].w, oH = pg.h || FRAMES[from].h;
  const narrow = nW < 600, wasNarrow = oW < 600, toPhone = narrow && !wasNarrow, toWide = !narrow && wasNarrow;
  const removed = new Set(), added = [];
  const isFull = e => e.x <= 4 && e.x + e.w >= oW - 4;
  const conv = (e, type, h, props) => { e.type = type; if (h != null) e.h = h; e.props = { ...(DEF[type] || {}), ...(props || {}) }; };
  for (const e of pg.elements) {
    const p = e.props || {};
    if (toPhone) {
      if (e.type === 'topbar') conv(e, 'appbar', 52, { text: p.text });
      else if (e.type === 'filterbar') conv(e, 'chips', 34, { items: p.items });
      else if (e.type === 'table') conv(e, 'list', e.h);
    } else if (toWide) {
      if (['statusbar', 'homeind', 'keyboard'].includes(e.type)) removed.add(e);
      else if (e.type === 'navLarge') conv(e, 'heading', 48, { text: p.text });
      else if (e.type === 'appbar') conv(e, 'topbar', 64, { text: p.text });
      else if (e.type === 'searchPill') conv(e, 'search', 44, { text: p.text });
    }
  }
  let rails = [], bottoms = [], body = [], scrims = [], topNav = null;
  for (const e of pg.elements) {
    if (removed.has(e)) continue;
    if (e.type === 'scrim') { scrims.push(e); continue; }
    if (e.type === 'sidebar' || (e.x <= 4 && e.h >= oH * 0.8 && e.w < oW * 0.4)) { rails.push(e); continue; }
    if (e.y + e.h >= oH - 2 && e.y > oH * 0.4 && (BOTTOM_T.has(e.type) || isFull(e))) { bottoms.push(e); continue; }
    body.push(e);
  }
  const railR = rails.length ? Math.max(...rails.map(r => r.x + r.w)) : 0;
  if (toPhone) {
    rails.forEach(r => { if (r.type === 'sidebar') { const it = splitItems(r.props && r.props.items).slice(0, 4).join(', '); conv(r, 'tabbar', 84, { items: it || DEF.tabbar.items }); bottoms.push(r); } else body.push(r); });
    rails = [];
  }
  if (toWide) {
    const tb = bottoms.find(b => b.type === 'tabbar');
    if (tb) { const it = tb.props && tb.props.items; conv(tb, 'navbar', 72, { text: 'Acme', items: it }); bottoms = bottoms.filter(b => b !== tb); topNav = tb; }
  }
  body.sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = [];
  for (const e of body) { const r = rows[rows.length - 1]; if (r && e.y < r.bot - 4) { r.items.push(e); r.bot = Math.max(r.bot, e.y + e.h); } else rows.push({ top: e.y, bot: e.y + e.h, items: [e] }); }
  rails.forEach(r => { r.x = 0; r.w = Math.min(r.w, Math.round(nW * 0.3)); });
  const railNR = rails.length ? Math.max(...rails.map(r => r.w)) : 0;
  let contentBottom = 0;
  if (narrow) {
    const M = 16, maxW = nW - 2 * M;
    let cursor = 0;
    if (toPhone && !body.some(e => e.type === 'navbar' || e.type === 'statusbar')) { added.push({ id: uid(), type: 'statusbar', x: 0, y: 0, w: nW, h: 44, props: {} }); cursor = 44; }
    let prevBot = 0;
    rows.forEach((r, ri) => {
      cursor += ri === 0 ? clamp(r.top, 0, 24) : clamp(r.top - prevBot, 0, 32);
      prevBot = r.bot;
      const its = r.items.slice().sort((a, b) => a.x - b.x);
      const sized = its.map(e => {
        const full = isFull(e) || (railR > 0 && e.x <= railR + 4 && e.x + e.w >= oW - 4);
        let w, h = e.h;
        if (full) w = nW;
        else if (FIXED.has(e.type) && e.w < oW * 0.5) w = Math.min(e.w, maxW);
        else if (e.w >= oW * 0.22 || e.w > maxW) w = maxW;
        else w = e.w;
        if (!full && w !== e.w) {
          const k = w / e.w;
          if (MEDIA.has(e.type)) h = Math.round(e.h * clamp(k, 0.5, 1.5));
          else if (TEXTY.has(e.type)) h = Math.round(e.h * clamp(1 / k, 1, 3));
        }
        if (e.type === 'heading') h = Math.min(h, 36);
        if (full && GROW[e.type] && !wasNarrow) h = Math.round(h * GROW[e.type]);
        return { e, w, h, full, ctr: !full && Math.abs(e.x + e.w / 2 - oW / 2) < 16 };
      });
      const totalW = sized.reduce((a, q) => a + q.w, 0) + 12 * (sized.length - 1);
      if (sized.length > 1 && !sized.some(q => q.full) && totalW <= maxW) {
        const gL = Math.min(...its.map(e => e.x)), gR = Math.max(...its.map(e => e.x + e.w));
        let x = Math.abs((gL + gR) / 2 - oW / 2) < 24 ? Math.round((nW - totalW) / 2) : M;
        const rh = Math.max(...sized.map(q => q.h));
        sized.forEach(q => { Object.assign(q.e, { x, y: cursor + Math.round((rh - q.h) / 2), w: q.w, h: q.h }); x += q.w + 12; });
        cursor += rh;
      } else {
        sized.forEach((q, i) => { Object.assign(q.e, { x: q.full ? 0 : q.ctr ? Math.round((nW - q.w) / 2) : M, y: cursor, w: q.w, h: q.h }); cursor += q.h + (i < sized.length - 1 ? 12 : 0); });
      }
    });
    contentBottom = cursor;
  } else {
    const pad = nW >= 1100 ? 80 : 40, colW = Math.min(nW - 2 * pad, 720), colL = Math.round((nW - colW) / 2);
    const freed = [...removed].filter(e => e.y <= 4).reduce((a, e) => Math.max(a, e.y + e.h), 0);
    let offset = (topNav ? topNav.h : 0) - freed;
    rows.forEach(r => {
      let newBot = -Infinity; const off0 = offset;
      r.items.forEach(e => {
        const rightOfRail = railR > 0 && e.x >= railR - 4;
        let oA0 = 0, oA1 = oW, nA0 = 0, nA1 = nW;
        if (wasNarrow) { oA0 = 16; oA1 = oW - 16; nA0 = colL; nA1 = colL + colW; }
        else if (rightOfRail) { oA0 = railR; nA0 = railNR; }
        const k = (nA1 - nA0) / (oA1 - oA0), X = v => Math.round(nA0 + (v - oA0) * k);
        let x, w, h = e.h;
        const bleed = isFull(e) && (!toWide || BLEED.has(e.type));
        if (bleed) { x = 0; w = nW; if (toWide && GROW[e.type]) h = Math.round(h / GROW[e.type]); }
        else if (isFull(e)) { x = colL; w = colW; if (MEDIA.has(e.type)) h = Math.round(e.h * clamp(colW / oW, 0.6, 1.6)); }
        else if (rightOfRail && e.x <= railR + 4 && e.x + e.w >= oW - 4) { x = railNR; w = nW - railNR; }
        else if (FIXED.has(e.type) && e.w < (oA1 - oA0) * 0.6) {
          w = Math.min(e.w, nA1 - nA0);
          const lm = e.x - oA0, rm = oA1 - (e.x + e.w), cen = Math.abs(e.x + e.w / 2 - (oA0 + oA1) / 2) < 12;
          x = cen ? Math.round((nA0 + nA1 - w) / 2) : rm < lm ? X(e.x + e.w) - w : X(e.x);
        } else {
          x = X(e.x); w = Math.max(8, X(e.x + e.w) - x);
          if (MEDIA.has(e.type)) h = Math.round(e.h * clamp(k, 0.6, 1.6));
          else if (TEXTY.has(e.type) && k < 1) h = Math.round(e.h * clamp(1 / k, 1, 2.5));
        }
        Object.assign(e, { x, y: e.y + off0, w, h });
        newBot = Math.max(newBot, e.y + h);
      });
      offset += (newBot - off0) - r.bot;
      contentBottom = Math.max(contentBottom, newBot);
    });
  }
  const bottomsH = bottoms.reduce((a, b) => a + b.h, 0);
  const minH = FRAMES[to].h;
  let pageH = Math.max(minH, Math.round(contentBottom + (bottomsH ? (narrow ? 16 : 24) : 0) + bottomsH));
  if (!narrow && !wasNarrow && pg.h) pageH = Math.max(pageH, Math.round(contentBottom + bottomsH));
  let by = pageH - bottomsH;
  bottoms.sort((a, b) => a.y - b.y).forEach(b => {
    const inset = !isFull(b) && b.x > 4;
    Object.assign(b, { x: inset ? 16 : 0, w: inset ? nW - 32 : nW, y: by }); by += b.h;
  });
  if (topNav) Object.assign(topNav, { x: 0, y: 0, w: nW });
  rails.forEach(r => { r.y = 0; r.h = pageH; });
  scrims.forEach(sc => Object.assign(sc, { x: 0, y: 0, w: nW, h: pageH }));
  pg.frame = to;
  if (pageH === minH) delete pg.h; else pg.h = pageH;
  pg.elements = [...pg.elements.filter(e => !removed.has(e)), ...added];
  return true;
}

export function makePage(tplId, frame, name) {
  const t = TEMPLATES.find(x => x.id === tplId) || BLANK;
  const f = t.frame || frame || 'desktop';
  const pg = { id: uid(), name: name || t.name, frame: f, elements: t.build() };
  if (t.h && t.h !== FRAMES[f].h) pg.h = t.h;
  return pg;
}
export function defaultProject() {
  const p = makePage('blank', 'desktop', 'Page 1');
  return { name: 'Untitled project', activeId: p.id, pages: [p] };
}
