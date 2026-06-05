const urlParams = new URLSearchParams(location.search);

const state = {
  route: "home",
  lang: urlParams.get("lang") || localStorage.getItem("fm-lang") || "en",
  profileQuery: "",
  profileFilters: urlParams.get("identifierDemo") === "1" ? ['TUID: "UMID-123-234"'] : [],
  profileSearched: urlParams.get("identifierDemo") === "1",
  profileSidebar: true,
  profileFullscreen: false,
  profileIdentifierMenu: urlParams.get("identifierMenu") === "1",
  profileIdentifierType: urlParams.get("identifierDemo") === "1" ? "TUID" : "",
  profileIdentifierValue: urlParams.get("identifierDemo") === "1" ? "UMID-123-234" : "",
  profileIdentifierError: false,
  profileLoading: urlParams.get("loading") === "1",
  profilePage: 1,
  profileItemsPerPage: 5,
  openFieldMenu: urlParams.get("fieldMenu") || "",
  fieldValues: {},
  audienceView: "cards",
  audienceTab: "all",
  audienceColumns: Number(urlParams.get("columns") || 4),
  audienceColumnMenu: urlParams.get("columnsMenu") === "1",
  audienceActionMenu: urlParams.get("audienceMenu") || "",
  audienceBuilderBaseFilters: urlParams.get("builderSource") === "profiles" ? ['TUID exists', 'category = customer', 'last_seen > last 30 days'] : [],
  audienceBuilderSource: urlParams.get("builderSource") || "",
  audienceBuilderCriteriaExpanded: urlParams.get("criteriaOpen") === "1",
  audienceBuilderPrompt: urlParams.get("audienceDemo") === "1" ? "Active customers in the last 30 days with consent" : "",
  audienceBuilderSelectedPrompts: urlParams.get("audienceDemo") === "1" ? ["Active customers in the last 30 days"] : [],
  audienceBuilderStep: urlParams.get("audienceStep") || "compose",
  audienceBuilderFilters: urlParams.get("audienceStep") ? ["category = customer", "last_seen > last 30 days", "consent = granted"] : [],
  audienceBuilderConditions: urlParams.get("audienceStep") === "review" ? [
    { field: "customer type", operator: "is", value: "customer" },
    { field: "timeframe", operator: "within", value: "last 7 days" },
    { field: "device type", operator: "uses", value: "Android or iOS" },
    { field: "behavioral category", operator: "contains", value: "devices, tariffs, entertainment bundles" }
  ] : [],
  audienceBuilderEstimateDirty: false,
  audienceBuilderLastEstimatedPrompt: "",
  audienceBuilderChannels: [],
  audienceBuilderResult: null,
  lastAudienceName: "",
  audiences: [
    { id: "aud-1", name: "Clientes activos ultimos 30 dias", count: 8124, status: "activated", filters: ["category = customer", "last_seen > last 30 days"], channels: ["Email", "Push"], created: "Apr 3, 2026" },
    { id: "aud-2", name: "Visitantes de marca con consentimiento", count: 3450, status: "draft", filters: ["category = visitor", "source = dev-brand-demo-consent"], channels: ["Email"], created: "Apr 5, 2026" },
    { id: "aud-3", name: "Clientes de alto valor 7d", count: 1890, status: "activated", filters: ["category = customer", "last_seen > last 7 days"], channels: ["Email", "SMS"], created: "Apr 6, 2026" }
  ],
  aggregations: [
    { id: "consented_customers_daily", metric: "Clientes consentidos diarios", useCase: "Event-based", source: "dev-brand-demo-consent", type: "count", column: "customer_id", timeRange: "Daily", labels: ["consent", "customer"], status: "activated" },
    { id: "brand_channel_visitors", metric: "Visitantes canal de marca", useCase: "Digital Activity of Users", source: "web_events", type: "count_distinct", column: "tuid", timeRange: "Last 7 Days", labels: ["brand", "visitor"], status: "activated" },
    { id: "crm_matched_profiles", metric: "Perfiles vinculados a CRM", useCase: "ID Snapshot", source: "crm_profiles", type: "count", column: "crm_id", timeRange: "Calendar Month", labels: ["crm"], status: "draft" },
    { id: "publisher_traffic_source", metric: "Trafico publisher por fuente", useCase: "Custom Aggregation", source: "publisher_events", type: "count_distinct", column: "source", timeRange: "Daily", labels: ["publisher", "source"], status: "error" }
  ]
};

const view = document.getElementById("view");
const modalRoot = document.getElementById("modalRoot");
const breadcrumbs = document.getElementById("breadcrumbs");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const toast = document.getElementById("toast");

const routeLabels = {
  home: "Home",
  profiles: "Profile Explorer",
  audiences: "Audiences",
  audienceBuilder: "Audience Builder",
  aggregation: "Aggregations"
};

const copy = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    services: "Data Services",
    segment: "Segment",
    campaign: "Campana",
    profileTesting: "Profile Testing",
    graphql: "GraphQL Explorer",
    profileExplorer: "Profile Explorer",
    aggregations: "Aggregations",
    audiences: "Audiences",
    eventReports: "Event dashboards",
    profileDashboards: "Profile dashboards",
    masterFeed: "Master Feed",
    cdsExtract: "CDS Extract",
    integrations: "Integration",
    logs: "Monitoring & Logs",
    automation: "Automation Designer",
    homeTitle: "Welcome to Funnel Manager",
    homeLine1: "Hello! Welcome to Teavaro's administration platform. Here you can create and manage your digital campaigns.",
    homeLine2: "Create your first campaign with the quick actions below. To go to the viewer use the sidebar.",
    quickActions: "Quick Actions",
    createSegments: "Create segments",
    createCampaign: "Create Campaign",
    profileExplorerCopy: "Search profiles in your data with our tool, FM.",
    createSegmentsCopy: "Segment your audience to improve your customers' experience.",
    createCampaignCopy: "You can create triggers and schedule them for your marketing strategy.",
    advancedTools: "Advanced tools",
    dataReport: "Data Report",
    poweredByKibana: "Powered by Kibana",
    eventReportsCopy: "Event based reports.",
    flowIntegration: "Flow Integration",
    platformPartners: "Platform Partners",
    flowCopy: "Predefined flows to connect your data.",
    automationDesigner: "Automation Designer",
    dataManagement: "Data Management",
    automationCopy: "Data connections through multiple channels and services",
    refreshMetrics: "Refresh metrics",
    createAudience: "Create audience",
    searchIdentifier: "Search identifier",
    searchAttribute: "Search attribute",
    searchByIdentifier: "Search by Identifier",
    selectIdentifierType: "Select the identifier type",
    identifierTypeValue: "Select identifier type and value",
    identifierTypePlaceholder: "Enter or select the identifier type",
    identifierValuePlaceholder: "Enter the identifier value",
    identifierTypeError: "Invalid input: expected string, received null",
    search: "Search",
    clear: "Clear",
    clearAllFilters: "Clear all filters",
    expandExplorer: "Expand explorer",
    filterPanel: "Filter panel",
    hideFilters: "Hide filters",
    showFilters: "Show filters",
    noFilters: "No filters applied",
    noDataTitle: "No data to display",
    noDataHint: "Use identifier search, attribute search, or side filters to find profiles.",
    filters: "Filters",
    category: "Category",
    source: "Creation source",
    profileActivity: "Profile activity",
    creationDate: "Creation date",
    age: "Age",
    selectCategory: "Select category",
    selectSource: "Select source",
    selectRange: "Select range",
    greaterThan: "greater than",
    lessThan: "less than",
    equal: "equal",
    audienceSubtitle: "audiences - profiles total",
    cardView: "Card view",
    tableView: "Table view",
    newAudience: "New audience",
    all: "All",
    active: "Active",
    drafts: "Drafts",
    searchAudiences: "Search audiences...",
    profiles: "profiles",
    channels: "Channels",
    activate: "Activate",
    aggregationCreate: "Create aggregation",
    searchByNameOrId: "Search by name or ID",
    state: "State",
    metric: "Metric",
    reportPeriod: "Report period",
    tag: "Tag",
    useCase: "Use case",
    dataSource: "Data source",
    stop: "Stop",
    play: "Play",
    audienceBuilder: "Audience Builder",
    defineAudience: "Define your audience with natural language",
    describeAudience: "Describe your audience",
    audienceHelp: "Use natural language to define who you want to reach. Existing filters will be used as the base.",
    noBaseFilters: "No base filters - the prompt will define the full audience",
    baseFilters: "Base filters",
    generateAudience: "Generate audience",
    reviewAudience: "Review and activate your audience",
    activeFilters: "Active filters",
    estimatedAudienceSize: "Estimated Audience Size",
    basedOnFilters: "Based on",
    filtersAcrossProfiles: "filters across ~20,000 profiles",
    cancel: "Cancel",
    save: "Save",
    metricName: "Metric name",
    metricNew: "New metric",
    tagsComma: "Tags, comma separated",
    selectTemplateHint: "Select template, metric, filters, and details.",
    containsSearch: "contains search",
    ageValue: "Age value",
    name: "Name",
    created: "Created",
    lastActivity: "Last activity",
    totalProfiles: "Total profiles",
    customers: "Customers",
    visitors: "Visitors",
    activeCustomers: "Active customers",
    activeVisitors: "Active visitors",
    newActiveCustomers: "New active customers",
    pageOf: "of",
    rowsPerPage: "Rows per page",
    loadingProfiles: "Loading profiles...",
    audienceName: "Audience name",
    activationChannels: "Activation channels",
    activationOptions: "Activation options",
    activationHelp: "Choose where this audience should be available after creation.",
    emailActivation: "Email campaign",
    pushActivation: "Push notification",
    smsActivation: "SMS activation",
    webhookActivation: "Webhook / API",
    cancelAudience: "Cancel audience",
    audienceActivatedTitle: "Audience activated",
    audienceDraftTitle: "Audience saved as draft",
    audienceCancelledTitle: "Audience creation cancelled",
    audienceActivatedCopy: "Your audience is active and ready across the selected activation channels.",
    audienceDraftCopy: "Your audience was saved as a draft. You can review it later from Audience Viewer.",
    audienceCancelledCopy: "The audience creation flow was cancelled and no audience was saved.",
    backToAudiences: "Back to Audience Viewer",
    createAnother: "Create another audience",
    columns: "Columns",
    refine: "Refine",
    saveDraft: "Save draft",
    activateAudience: "Activate audience",
    audienceCreated: "Audience created",
    updatedAgo: "Updated a few seconds ago"
  },
  es: {
    home: "Inicio",
    dashboard: "Panel de control",
    services: "Servicios de Datos",
    segment: "Segmento",
    campaign: "Campana",
    profileTesting: "Testeo de perfil",
    graphql: "Explorador de GraphQL",
    profileExplorer: "Profile Explorer",
    aggregations: "Agregaciones",
    audiences: "Audiencias",
    eventReports: "Paneles de eventos",
    profileDashboards: "Paneles de perfil",
    masterFeed: "Canal Principal",
    cdsExtract: "Extraccion CDS",
    integrations: "Integracion",
    logs: "Monitoreo & Registros",
    automation: "Disenador de Automatizacion",
    homeTitle: "Bienvenido a Funnel Manager",
    homeLine1: "Hola! Bienvenido a la plataforma de administracion de Teavaro. Aqui puedes crear y administrar tus campanas digitales.",
    homeLine2: "Crea tu primer campana con las acciones rapidas abajo. Para ir al visualizador usa la barra lateral.",
    quickActions: "Acciones Rapidas",
    createSegments: "Crear segmentos",
    createCampaign: "Crear Campana",
    profileExplorerCopy: "Busca perfiles en tus datos con nuestra herramienta, FM.",
    createSegmentsCopy: "Segmenta tu audiencia para mejorar la experiencia de tus clientes.",
    createCampaignCopy: "Puedes crear disparadores y programa para tu estrategia de marketing.",
    advancedTools: "Herramientas avanzadas",
    dataReport: "Reporte de Datos",
    poweredByKibana: "Impulsado por Kibana",
    eventReportsCopy: "Reportes basados en eventos.",
    flowIntegration: "Integracion de flujos",
    platformPartners: "Socios de Plataforma",
    flowCopy: "Flujos predeterminados para conectar tus datos.",
    automationDesigner: "Disenador de Automatizacion",
    dataManagement: "Gestion de Datos",
    automationCopy: "Conexiones de datos a traves de multiples canales y servicios",
    refreshMetrics: "Actualizar metricas",
    createAudience: "Crear audiencia",
    searchIdentifier: "Buscar identificador",
    searchAttribute: "Buscar atributo",
    searchByIdentifier: "Buscar por identificador",
    selectIdentifierType: "Selecciona tipo de identificador",
    identifierTypeValue: "Selecciona tipo y valor de identificador",
    identifierTypePlaceholder: "Ingresa o selecciona el tipo de identificador",
    identifierValuePlaceholder: "Ingresa el valor del identificador",
    identifierTypeError: "Entrada invalida: se esperaba texto, se recibio null",
    search: "Buscar",
    clear: "Limpiar",
    clearAllFilters: "Limpiar filtros",
    expandExplorer: "Expandir explorador",
    filterPanel: "Panel de filtros",
    hideFilters: "Ocultar filtros",
    showFilters: "Mostrar filtros",
    noFilters: "Sin filtros aplicados",
    noDataTitle: "No hay datos para mostrar",
    noDataHint: "Utiliza la busqueda por identificador, atributo o los filtros laterales para encontrar perfiles.",
    filters: "Filtros",
    category: "Categoria",
    source: "Fuente de creacion",
    profileActivity: "Actividad de perfil",
    creationDate: "Fecha de creacion",
    age: "Edad",
    selectCategory: "Selecciona categoria",
    selectSource: "Selecciona fuente",
    selectRange: "Selecciona rango",
    greaterThan: "mayor que",
    lessThan: "menor que",
    equal: "igual",
    audienceSubtitle: "audiencias - perfiles totales",
    cardView: "Vista tarjetas",
    tableView: "Vista tabla",
    newAudience: "Nueva audiencia",
    all: "Todas",
    active: "Activas",
    drafts: "Borradores",
    searchAudiences: "Buscar audiencias...",
    profiles: "perfiles",
    channels: "Canales",
    activate: "Activar",
    aggregationCreate: "Crear agregacion",
    searchByNameOrId: "Buscar por nombre o ID",
    state: "Estado",
    metric: "Metrica",
    reportPeriod: "Periodo de reporte",
    tag: "Etiqueta",
    useCase: "Caso de uso",
    dataSource: "Fuente de datos",
    stop: "Detener",
    play: "Iniciar",
    audienceBuilder: "Audience Builder",
    defineAudience: "Define tu audiencia con lenguaje natural",
    describeAudience: "Describe tu audiencia",
    audienceHelp: "Usa lenguaje natural para definir a quienes quieres alcanzar. Los filtros existentes se usaran como base.",
    noBaseFilters: "Sin filtros base - el prompt definira toda la audiencia",
    baseFilters: "Filtros base",
    generateAudience: "Generar audiencia",
    reviewAudience: "Revisa y activa tu audiencia",
    activeFilters: "Filtros activos",
    estimatedAudienceSize: "Tamano estimado de audiencia",
    basedOnFilters: "Basado en",
    filtersAcrossProfiles: "filtros sobre ~20,000 perfiles",
    cancel: "Cancelar",
    save: "Guardar",
    metricName: "Nombre de metrica",
    metricNew: "Nueva metrica",
    tagsComma: "Etiquetas separadas por coma",
    selectTemplateHint: "Selecciona plantilla, metrica, filtros y detalles.",
    containsSearch: "contiene busqueda",
    ageValue: "Valor de edad",
    name: "Nombre",
    created: "Creado",
    lastActivity: "Ultima actividad",
    totalProfiles: "Total profiles",
    customers: "Customers",
    visitors: "Visitors",
    activeCustomers: "Active customers",
    activeVisitors: "Active visitors",
    newActiveCustomers: "New active customers",
    pageOf: "de",
    rowsPerPage: "Filas por pagina",
    loadingProfiles: "Cargando perfiles...",
    audienceName: "Nombre de audiencia",
    activationChannels: "Canales de activacion",
    activationOptions: "Opciones de activacion",
    activationHelp: "Elige donde estara disponible esta audiencia despues de crearla.",
    emailActivation: "Campana de email",
    pushActivation: "Notificacion push",
    smsActivation: "Activacion SMS",
    webhookActivation: "Webhook / API",
    cancelAudience: "Cancelar audiencia",
    audienceActivatedTitle: "Audiencia activada",
    audienceDraftTitle: "Audiencia guardada como borrador",
    audienceCancelledTitle: "Creacion de audiencia cancelada",
    audienceActivatedCopy: "Tu audiencia esta activa y lista en los canales seleccionados.",
    audienceDraftCopy: "Tu audiencia se guardo como borrador. Puedes revisarla luego en Audience Viewer.",
    audienceCancelledCopy: "El flujo de creacion fue cancelado y no se guardo audiencia.",
    backToAudiences: "Volver al Audience Viewer",
    createAnother: "Crear otra audiencia",
    columns: "Columnas",
    refine: "Refinar",
    saveDraft: "Guardar borrador",
    activateAudience: "Activar audiencia",
    audienceCreated: "Audiencia creada",
    updatedAgo: "Actualizado hace unos segundos"
  }
};

function t(key) {
  return copy[state.lang][key] || copy.en[key] || key;
}

function icon(name, cls = "") {
  return `<span class="material-symbols-outlined ${cls}">${name}</span>`;
}

const iconify = icon;

function routeTo(route) {
  state.route = route;
  if (location.hash.slice(1) !== route) history.replaceState(null, "", `#${route}`);
  document.querySelectorAll("[data-route]").forEach((item) => item.classList.toggle("active", item.dataset.route === route));
  closeDrawer();
  render();
}

function setBreadcrumb(route) {
  const keys = { home: "home", profiles: "profileExplorer", audiences: "audiences", audienceBuilder: "audienceBuilder", aggregation: "aggregations" };
  breadcrumbs.textContent = t(keys[route] || "home");
}

function setBuilderBreadcrumb() {
  breadcrumbs.textContent = state.lang === "en" ? "Dashboard / Audiences / New Audience" : "Panel de control / Audiencias / Nueva audiencia";
}

function chip(text, tone = "") {
  return `<span class="chip ${tone}">${text}</span>`;
}

function statusChip(status) {
  if (status === "activated") return chip(state.lang === "en" ? "Active" : "Activado", "success");
  if (status === "deactivated") return chip(state.lang === "en" ? "Inactive" : "Desactivado", "gray");
  if (status === "draft") return chip(state.lang === "en" ? "Draft" : "Borrador", "warning");
  if (status === "error") return chip("Error", "error");
  return chip(status, "gray");
}

function showToast(message, tone = "") {
  toast.textContent = message;
  toast.classList.toggle("success", tone === "success");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderHome() {
  setBreadcrumb("home");
  view.innerHTML = `
    <div class="title-row">
      <div>
        <h1>${t("homeTitle")}</h1>
        <p class="subtitle">${t("homeLine1")}</p>
        <p class="subtitle" style="margin-top:0">${t("homeLine2")}</p>
      </div>
    </div>

    <section class="v-sheet">
      <div class="sheet-title">${t("quickActions")}</div>
      <div class="quick-grid">
        ${quickCard(t("profileExplorer"), t("profileExplorerCopy"), "person_search", "go-profiles")}
        ${quickCard(t("createSegments"), t("createSegmentsCopy"), "groups", "new-audience")}
        ${quickCard(t("createCampaign"), t("createCampaignCopy"), "campaign", "new-audience")}
      </div>
    </section>

    <section class="v-sheet">
      <div class="sheet-title">${t("advancedTools")}</div>
      <div class="advanced-grid">
        ${advancedCard(t("dataReport"), t("poweredByKibana"), t("eventReportsCopy"), advancedToolImages.dataDiscovery)}
        ${advancedCard(t("flowIntegration"), t("platformPartners"), t("flowCopy"), advancedToolImages.integrationFlows)}
        ${advancedCard(t("automationDesigner"), t("dataManagement"), t("automationCopy"), advancedToolImages.automationDesigner)}
      </div>
    </section>
  `;
}

function updateChromeTexts() {
  const labels = [
    t("dashboard"), t("services"), t("segment"), t("campaign"), t("profileTesting"), t("graphql"),
    t("profileExplorer"), t("aggregations"), t("audiences"), t("eventReports"), t("profileDashboards"),
    t("masterFeed"), t("cdsExtract"), t("integrations"), t("logs"), t("automation")
  ];
  document.querySelectorAll(".drawer-item").forEach((item, index) => {
    if (labels[index]) item.textContent = labels[index];
  });
  const userPref = document.querySelector(".drawer-user span");
  if (userPref) userPref.textContent = state.lang === "en" ? "User preferences" : "Preferencias de usuario";
  const langLabel = document.getElementById("langLabel");
  if (langLabel) langLabel.textContent = state.lang.toUpperCase();
  document.documentElement.lang = state.lang;
}

function quickCard(title, copy, icon, action) {
  return `
    <article class="v-card hover" data-card-action="${action}">
      <div class="card-title">${title}</div>
      <p class="card-copy">${copy}</p>
      <div class="tonal-avatar">${iconify(icon)}</div>
    </article>
  `;
}

const advancedToolImages = {
  dataDiscovery: "./assets/home/data-discovery.png?v=20260604-1908",
  integrationFlows: "./assets/home/integration-flows.png?v=20260604-1908",
  automationDesigner: "./assets/home/automation-designer.png?v=20260604-1908"
};

function advancedCard(title, subtitle, copy, imageSrc) {
  return `
    <article class="v-card advanced-card hover">
      <div class="advanced-media">
        <img src="${imageSrc}" alt="${title}" loading="lazy">
      </div>
      <div class="advanced-content">
        <div class="advanced-card-title">${title}</div>
        <p class="advanced-card-subtitle">${subtitle}</p>
        <p class="advanced-card-copy">${copy}</p>
      </div>
    </article>
  `;
}

function renderProfiles() {
  setBreadcrumb("profiles");
  const filters = currentBaseFilters();
  const hasResults = true;
  const audienceButtonLabel = filters.length
    ? (state.lang === "en" ? "Create audience" : "Crear audiencia")
    : t("createAudience");
  view.innerHTML = `
    <div class="profile-screen ${state.profileFullscreen ? "is-fullscreen" : ""}">
    <div class="title-row">
      <h1>Profile Explorer</h1>
      <div class="actions">
        <button class="button tonal" data-action="refresh-profiles">${icon("refresh")} ${t("refreshMetrics")}</button>
        <button class="button audience-create-button ${filters.length ? "has-badge" : ""}" data-action="create-audience-from-profile">
          ${icon("group_add")} ${audienceButtonLabel}
          ${filters.length ? `<span class="button-badge">${filters.length}</span>` : ""}
        </button>
      </div>
    </div>

    <div class="kpi-grid">
      ${profileKpi("totalProfiles", "20K", t("totalProfiles"))}
      ${profileKpi("customers", "12.4K", t("customers"))}
      ${profileKpi("visitors", "7.6K", t("visitors"))}
      ${profileKpi("activeCustomers", "3.2K", t("activeCustomers"))}
      ${profileKpi("activeVisitors", "2.1K", t("activeVisitors"))}
      ${profileKpi("newActiveCustomers", "486", t("newActiveCustomers"))}
    </div>

    ${profileSearchBar(filters)}

    <div class="profile-layout ${state.profileSidebar ? "" : "collapsed"}">
      <div class="table-card">
        ${profileTable(hasResults)}
      </div>
      ${state.profileSidebar ? profileSidePanel() : ""}
    </div>
    </div>
  `;
}

function profileSearchBar(filters) {
  const chips = filters.length
    ? filters.map((filter, index) => removableChip(filter, index)).join("")
    : `<span class="search-empty">${t("noFilters")}</span>`;
  return `
    <section class="fm-search-bar" aria-label="Profile Explorer search">
      <div class="search-content">
        <div class="identifier-menu-anchor">
        <button class="identifier-trigger" data-action="toggle-identifier-menu" title="${t("searchByIdentifier")}">
          ${icon("search")}
          <span>${t("searchByIdentifier")}</span>
        </button>
        ${state.profileIdentifierMenu ? identifierPopup() : ""}
        </div>
        <button class="attribute-trigger" data-action="attribute-search" title="${t("searchAttribute")}">${icon("tune")} <span>${t("searchAttribute")}</span></button>
        <div class="search-chip-strip">${chips}</div>
      </div>
      <div class="search-actions">
        <button class="search-icon danger" data-action="clear-profile-filters" title="${t("clearAllFilters")}">${icon("cancel")}</button>
        <span class="search-divider"></span>
        <button class="search-icon" data-action="toggle-profile-fullscreen" title="${t("expandExplorer")}">${icon(state.profileFullscreen ? "fullscreen_exit" : "fullscreen")}</button>
        <span class="search-divider"></span>
        <button class="search-icon badge-anchor" data-action="toggle-profile-sidebar" title="${t("filterPanel")}">
          ${icon(state.profileSidebar ? "filter_alt_off" : "filter_alt")}
          <span class="filter-badge">${filters.length}</span>
        </button>
      </div>
    </section>
  `;
}

function identifierPopup() {
  const identifierTypes = ["TUID", "UMID", "Email", "Phone", "CRM ID", "Cookie ID", "Device ID"];
  return `
    <div class="identifier-popover" role="dialog" aria-label="${t("searchByIdentifier")}">
      <h3>${t("searchByIdentifier")}</h3>
      <p class="muted">${t("identifierTypeValue")}</p>
      <label class="field-block compact ${state.profileIdentifierError ? "invalid" : ""}">
        <select class="select identifier-select" id="identifierType">
          <option value="">${t("identifierTypePlaceholder")}</option>
          ${identifierTypes.map((type) => `<option ${state.profileIdentifierType === type ? "selected" : ""}>${type}</option>`).join("")}
        </select>
        ${state.profileIdentifierError ? `<span class="field-error">${t("identifierTypeError")}</span>` : ""}
      </label>
      <input class="input identifier-value" id="identifierValue" value="${escapeAttr(state.profileIdentifierValue)}" placeholder="${t("identifierValuePlaceholder")}" />
      <div class="popover-actions">
        <button class="button text" data-action="close-identifier-menu">${t("cancel")}</button>
        <button class="button neutral" data-action="apply-identifier-search">${t("search")}</button>
      </div>
    </div>
  `;
}

function removableChip(text, index) {
  return `
    <span class="search-chip">
      <span>${text}</span>
      <button type="button" data-remove-profile-filter="${index}" title="Remove filter">${icon("close")}</button>
    </span>
  `;
}

function menuField({ key, label, placeholder, options, value, menu = "up", extraClass = "" }) {
  const current = value || state.fieldValues[key] || "";
  const isOpen = state.openFieldMenu === key;
  return `
    <div class="field-block menu-field-block ${extraClass}">
      ${label ? `<label>${label}</label>` : ""}
      <div class="menu-field ${isOpen ? "open" : ""}">
        ${isOpen ? `
          <div class="field-menu ${menu === "down" ? "down" : "up"}">
            ${options.map((option) => `<button type="button" data-menu-option="${key}" data-menu-value="${escapeAttr(option.value || option)}">${option.label || option}</button>`).join("")}
          </div>
        ` : ""}
        <button type="button" class="field-trigger ${current ? "has-value" : ""}" data-toggle-field-menu="${key}">
          <span>${current || placeholder}</span>
          ${icon("arrow_drop_down")}
        </button>
      </div>
    </div>
  `;
}

function profileKpi(id, value, label) {
  return `
    <article class="v-card kpi-card">
      <h4>${label}</h4>
      <div class="kpi-value">${value}</div>
      <p class="kpi-label">${t("updatedAgo")}</p>
    </article>
  `;
}

function profileTable(hasResults) {
  if (!hasResults) {
    return `
      <div class="profile-table-empty">
        ${state.profileLoading ? `<div class="table-loading-bar"><span></span></div>` : ""}
        <div>
        <h2>${t("noDataTitle")}</h2>
          <p class="muted" style="margin-top:8px">${t("noDataHint")}</p>
        </div>
      </div>
    `;
  }
  const rows = [
    ["umid-0019274", "tuid-a43f19", "customer", "dev-brand-demo-consent", "742", "2025-04-28", "2026-06-02"],
    ["umid-0019821", "tuid-b88c41", "customer", "crm_profiles", "510", "2025-11-14", "2026-06-01"],
    ["umid-0021044", "tuid-c17d08", "visitor", "web_events", "37", "2026-05-03", "2026-06-03"],
    ["umid-0021770", "tuid-d09b62", "customer", "publisher_events", "901", "2024-12-18", "2026-05-31"]
  ];
  return `
    <div class="server-table-wrap ${state.profileLoading ? "is-loading" : ""}">
      ${state.profileLoading ? `<div class="table-loading-bar"><span></span></div><div class="table-loading-state">${icon("autorenew")} ${t("loadingProfiles")}</div>` : ""}
    <table>
      <thead>
        <tr><th>UMID</th><th>TUID</th><th>${t("category")}</th><th>${t("source")}</th><th>${t("age")}</th><th>${t("creationDate")}</th><th>${t("lastActivity")}</th></tr>
      </thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell, i) => `<td class="${i < 2 ? "mono" : ""}">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
    </div>
    <div class="data-table-footer">
      <label>${t("rowsPerPage")}:
        <select class="footer-select" id="profileItemsPerPage">
          ${[5, 10, 25, 50].map((value) => `<option value="${value}" ${state.profileItemsPerPage === value ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </label>
      <span>${(state.profilePage - 1) * state.profileItemsPerPage + 1}-${Math.min(state.profilePage * state.profileItemsPerPage, 1451)} ${t("pageOf")} 1451</span>
      <div class="actions"><button class="mini" data-action="profile-prev-page" title="Previous" ${state.profilePage === 1 ? "disabled" : ""}>${icon("chevron_left")}</button><button class="mini" data-action="profile-next-page" title="Next">${icon("chevron_right")}</button></div>
    </div>
  `;
}

function profileSidePanel() {
  const sourceOptions = [
    "brand-demo-app-click-ident",
    "brand-demo-app-ident",
    "brand-demo-app-info",
    "brand-demo-click-ident",
    "brand-demo-info",
    "brand-demo-newsletter",
    "dev-brand-demo-consent",
    "crm_profiles",
    "web_events"
  ];
  return `
    <aside class="side-panel">
      <h3>${t("filters")}</h3>
      ${profileCategoryChips()}
      ${menuField({ key: "source", label: t("source"), placeholder: t("selectSource"), options: sourceOptions, menu: "up" })}
      ${menuField({ key: "last_seen", label: t("profileActivity"), placeholder: t("selectRange"), options: ["last 7 days", "last 30 days", "last 365 days"], menu: "up" })}
      ${menuField({ key: "creation_date", label: t("creationDate"), placeholder: t("selectRange"), options: ["last 7 days", "last 30 days", "last 365 days"], menu: "up" })}
      <div class="field-block">
        <label>${t("age")}</label>
        ${menuField({ key: "age_operator", label: "", placeholder: t("greaterThan"), value: state.fieldValues.age_operator || t("greaterThan"), options: [{ value: "gt", label: t("greaterThan") }, { value: "lt", label: t("lessThan") }, { value: "eq", label: t("equal") }], menu: "up", extraClass: "nested" })}
        <input class="input" id="ageValue" type="number" placeholder="${t("ageValue")}" />
      </div>
      <button class="button" data-action="apply-age-filter" style="width:100%;justify-content:center">${icon("search")} ${t("search")}</button>
    </aside>
  `;
}

function profileCategoryChips() {
  const options = ["customer", "visitor"];
  const activeCategories = state.profileFilters
    .filter((filter) => filter.startsWith("category = "))
    .map((filter) => filter.replace("category = ", ""));
  return `
    <div class="field-block menu-field-block first">
      <label>${t("category")}</label>
      <div class="chip-filter-group" role="group" aria-label="${t("category")}">
        ${options.map((option) => {
          const selected = activeCategories.includes(option);
          return `
            <button type="button" class="filter-chip ${selected ? "selected" : ""}" data-category-filter="${option}" aria-pressed="${selected}">
              ${icon(selected ? "check" : "check")}
              <span>${option}</span>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function currentBaseFilters() {
  const base = [...state.profileFilters];
  if (state.profileQuery.trim() && !base.includes(state.profileQuery.trim())) base.unshift(`"${state.profileQuery.trim()}" ${t("containsSearch")}`);
  return base;
}

function renderAudiences() {
  setBreadcrumb("audiences");
  const total = state.audiences.reduce((sum, a) => sum + a.count, 0);
  const filtered = state.audiences.filter((a) => state.audienceTab === "all" || a.status === state.audienceTab);
  view.innerHTML = `
    <div class="title-row">
      <div>
        <h1>${t("audiences")}</h1>
        <p class="subtitle">${state.audiences.length} ${state.lang === "en" ? `audiences - ${total.toLocaleString()} total profiles` : `audiencias - ${total.toLocaleString()} perfiles totales`}</p>
      </div>
      <div class="actions">
        <div class="button-group" role="group" aria-label="Audience view">
          <button class="${state.audienceView === "cards" ? "active" : ""}" data-action="cards">${icon("grid_view")} ${t("cardView")}</button>
          <button class="${state.audienceView === "table" ? "active" : ""}" data-action="table">${icon("table")} ${t("tableView")}</button>
        </div>
        <div class="column-menu-anchor">
          <button class="button surface" data-action="toggle-column-menu">${icon("view_column")} ${state.audienceColumns}</button>
          ${state.audienceColumnMenu ? `<div class="column-menu">${[4, 5, 6].map((cols) => `<button data-audience-columns="${cols}">${cols} ${t("columns")}</button>`).join("")}</div>` : ""}
        </div>
        <button class="button" data-action="new-audience">${icon("group_add")} ${t("newAudience")}</button>
      </div>
    </div>
    <div class="toolbar grow">
      <div class="tabs">
        ${audienceTab("all", `${t("all")} ${state.audiences.length}`)}
        ${audienceTab("activated", `${t("active")} ${state.audiences.filter((a) => a.status === "activated").length}`)}
        ${audienceTab("draft", `${t("drafts")} ${state.audiences.filter((a) => a.status === "draft").length}`)}
      </div>
      <input class="input search-input" placeholder="${t("searchAudiences")}" />
    </div>
    ${state.audienceView === "table" ? audienceTable(filtered) : `<div class="audience-grid" style="--audience-columns:${state.audienceColumns}">${filtered.map(audienceCard).join("")}</div>`}
  `;
}

function audienceTab(id, label) {
  return `<button class="tab ${state.audienceTab === id ? "active" : ""}" data-audience-tab="${id}">${label}</button>`;
}

function audienceCard(a) {
  return `
    <article class="v-card audience-card hover">
      <div class="audience-card-head">
        <h3 class="audience-card-title" title="${escapeAttr(a.name)}">${a.name}</h3>
        <div class="actions audience-menu-anchor">
          ${statusChip(a.status)}
          <button class="mini" data-toggle-audience-menu="${a.id}" title="More">${icon("more_vert")}</button>
          ${state.audienceActionMenu === a.id ? `
            <div class="card-action-menu">
              <button data-edit-audience="${a.id}">${icon("edit")} ${state.lang === "en" ? "Edit" : "Editar"}</button>
              <button data-delete-audience="${a.id}">${icon("delete")} ${state.lang === "en" ? "Delete" : "Eliminar"}</button>
            </div>` : ""}
        </div>
      </div>
      <div class="audience-count kpi-value">${a.count.toLocaleString()} <span class="muted count-label">${t("profiles")}</span></div>
      <div class="filter-row audience-filter-row">${a.filters.map((f) => chip(f)).join("")}</div>
      <div class="channel-avatar-row" aria-label="${t("channels")}">${a.channels.map(channelAvatar).join("")}</div>
      <div class="audience-card-footer"><span class="muted">${a.created}</span>${a.status === "draft" ? `<button class="button success" data-activate="${a.id}">${icon("play_arrow")} ${t("activate")}</button>` : ""}</div>
    </article>
  `;
}

function channelAvatar(channel) {
  const icons = {
    Email: "mail",
    SMS: "sms",
    Push: "notifications_active",
    Export: "download"
  };
  return `<span class="channel-avatar" title="${escapeAttr(channel)}">${icon(icons[channel] || "hub")}</span>`;
}

function audienceTable(list) {
  return `
    <div class="table-card">
      <table>
        <thead><tr><th>${t("name")}</th><th>${t("state")}</th><th>${t("profiles")}</th><th>${t("filters")}</th><th>${t("channels")}</th><th>${t("created")}</th><th></th></tr></thead>
        <tbody>${list.map((a) => `<tr><td>${a.name}</td><td>${statusChip(a.status)}</td><td>${a.count.toLocaleString()}</td><td>${a.filters.map((f) => chip(f)).join(" ")}</td><td>${a.channels.join(", ")}</td><td>${a.created}</td><td><button class="mini" data-edit-audience="${a.id}">${icon("more_horiz")}</button></td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderAggregation() {
  setBreadcrumb("aggregation");
  view.innerHTML = `
    <div class="title-row">
      <h1>${t("aggregations")}</h1>
      <div class="actions">
        <button class="top-icon" title="Info">${icon("info")}</button>
        <button class="button surface" data-action="create-aggregation">${icon("add")} ${t("aggregationCreate")}</button>
      </div>
    </div>
    <div class="toolbar grow">
      <input class="input search-input" placeholder="${t("searchByNameOrId")}" />
      <div class="filter-row">
        <select class="select"><option>${t("state")}</option><option>error</option><option>activated</option><option>deactivated</option><option>draft</option></select>
        <select class="select"><option>${t("metric")}</option><option>count</option><option>count_distinct</option></select>
        <select class="select"><option>${t("reportPeriod")}</option><option>Daily</option><option>Last N Days</option><option>Calendar Month</option><option>Calendar Week</option><option>Snapshot</option></select>
        <select class="select"><option>${t("tag")}</option><option>consent</option><option>brand</option><option>crm</option></select>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>${t("useCase")}</th><th>${t("dataSource")}</th><th>${t("metric")}</th><th>${t("reportPeriod")}</th><th>${t("tag")}</th><th>${t("state")}</th></tr></thead>
        <tbody>${state.aggregations.map(aggregationRow).join("")}</tbody>
      </table>
      <div class="table-footer"><span>1-${state.aggregations.length} ${t("pageOf")} ${state.aggregations.length}</span><div class="actions"><button class="mini" title="Previous">${icon("chevron_left")}</button><button class="mini" title="Next">${icon("chevron_right")}</button></div></div>
    </div>
  `;
}

function aggregationRow(a) {
  return `
    <tr>
      <td><strong>${a.metric}</strong><div class="muted" style="margin-top:8px">${a.useCase}</div>${statusChip(a.status)}</td>
      <td><div class="mono">${a.id}</div><div class="muted" style="margin-top:8px">${a.source}</div></td>
      <td><div>${a.column}</div><div class="muted" style="margin-top:8px">${a.type}</div></td>
      <td>${a.timeRange}</td>
      <td><div class="filter-row">${a.labels.map((label) => chip(label)).join("")}</div></td>
      <td><div class="actions">${a.status === "activated" ? `<button class="button error" data-toggle-agg="${a.id}">${icon("stop")} ${t("stop")}</button>` : `<button class="button success" data-toggle-agg="${a.id}" ${a.status === "error" || a.status === "draft" ? "disabled" : ""}>${icon("play_arrow")} ${t("play")}</button>`}<button class="mini" data-delete-agg="${a.id}">${icon("more_horiz")}</button></div></td>
    </tr>
  `;
}

function openAudienceBuilder(baseFilters = [], source = "") {
  state.audienceBuilderBaseFilters = [...baseFilters];
  state.audienceBuilderSource = source;
  state.audienceBuilderCriteriaExpanded = false;
  state.audienceBuilderPrompt = "";
  state.audienceBuilderSelectedPrompts = [];
  state.audienceBuilderFilters = [];
  state.audienceBuilderConditions = [];
  state.audienceBuilderEstimateDirty = false;
  state.audienceBuilderLastEstimatedPrompt = "";
  state.audienceBuilderStep = "compose";
  state.audienceBuilderResult = null;
  state.audienceBuilderChannels = [];
  state.lastAudienceName = "";
  routeTo("audienceBuilder");
}

function renderAudienceBuilder() {
  setBuilderBreadcrumb();
  const suggestedPrompts = state.lang === "en"
    ? ["Active customers in the last 7 days", "Android users interested in new devices", "iOS users who viewed entertainment bundles", "Users from selected regions who viewed tariffs"]
    : ["Clientes activos en los ultimos 7 dias", "Usuarios Android interesados en nuevos dispositivos", "Usuarios iOS que vieron paquetes de entretenimiento", "Usuarios de regiones seleccionadas que vieron tarifas"];
  const hasConditions = state.audienceBuilderConditions.length > 0;
  const hasStartingAudience = state.audienceBuilderSource === "profiles" && state.audienceBuilderBaseFilters.length > 0;
  const canEstimate = state.audienceBuilderPrompt.trim().length > 0 || hasConditions;
  const showBuilderEmptyState = !hasStartingAudience && !hasConditions;
  const canActivate = hasConditions && state.audienceBuilderChannels.length === 1 && !state.audienceBuilderEstimateDirty;
  const cancelLabel = state.audienceBuilderSource === "profiles" ? (state.lang === "en" ? "Cancel & back" : "Cancelar y volver") : t("cancel");
  view.innerHTML = `
    <section class="audience-builder-page exact">
      <header class="builder-top">
        <div class="builder-title-block">
          <div>
            <h1>${t("audienceBuilder")}</h1>
            <p class="subtitle">${hasStartingAudience ? (state.lang === "en" ? "Refine the starting population into a final audience." : "Refina la poblacion inicial en una audiencia final.") : (state.lang === "en" ? "Create and estimate a final audience." : "Crea y estima una audiencia final.")}</p>
          </div>
        </div>
        <div class="builder-top-actions">
          <button class="button text" data-action="cancel-audience-flow">${cancelLabel}</button>
          <button class="button tonal" data-action="save-audience-draft" ${hasConditions ? "" : "disabled"}>${t("saveDraft")}</button>
          <button class="button" data-action="activate-audience-flow" ${canActivate ? "" : "disabled"}>${icon("bolt")} ${state.lang === "en" ? "Activate Audience" : "Activar audiencia"}</button>
        </div>
      </header>

      <div class="builder-exact-shell">
        <main class="builder-definition-pane">
          <section class="definition-block">
            <h3>Audience Definition</h3>
            <p class="muted">${hasStartingAudience ? (state.lang === "en" ? "Refine the starting audience using natural language." : "Refina la audiencia inicial usando lenguaje natural.") : (state.lang === "en" ? "Define the audience using natural language." : "Define la audiencia usando lenguaje natural.")}</p>
            <div class="textarea-wrap">
              <textarea class="textarea builder-textarea exact" id="audiencePrompt" placeholder="${hasStartingAudience ? (state.lang === "en" ? "Describe who you want to target within this starting audience... e.g. Users interested in entertainment bundles using Android or iOS in selected regions" : "Describe a quien quieres alcanzar dentro de esta audiencia inicial...") : (state.lang === "en" ? "Describe who you want to target... e.g. Active Android or iOS users interested in entertainment bundles" : "Describe a quien quieres alcanzar...")}">${escapeText(state.audienceBuilderPrompt)}</textarea>
              <span class="run-hint">Ctrl + Enter</span>
            </div>
          </section>

          <section class="example-block">
            <h4>${state.lang === "en" ? "Suggested prompts" : "Prompts sugeridos"}</h4>
            <div class="suggested-prompt-list">${suggestedPrompts.map((prompt) => `<button class="suggested-prompt ${state.audienceBuilderSelectedPrompts.includes(prompt) ? "selected" : ""}" data-example="${escapeAttr(prompt)}"><span>${prompt}</span>${icon(state.audienceBuilderSelectedPrompts.includes(prompt) ? "check" : "add")}</button>`).join("")}</div>
          </section>
        </main>

        <aside class="builder-estimation-pane">
          ${hasStartingAudience ? renderProfileSourceAudienceCard() : ""}
          ${showBuilderEmptyState ? renderAudienceBuilderEmptyState(canEstimate) : hasStartingAudience ? `
            <section class="activation-section">
              <h3>${t("activationOptions")}</h3>
              <p class="muted">${state.lang === "en" ? "Select one mandatory activation type for the final audience." : "Selecciona un tipo de activacion obligatorio para la audiencia final."}</p>
              <div class="activation-card-grid">${activationOptions().map(activationCard).join("")}</div>
            </section>
          ` : `
            ${renderEstimatedAudienceCard({ includeStartingAudience: false })}
            <section class="activation-section">
              <h3>${t("activationOptions")}</h3>
              <p class="muted">${state.lang === "en" ? "Select one mandatory activation type for the final audience." : "Selecciona un tipo de activacion obligatorio para la audiencia final."}</p>
              <div class="activation-card-grid">${activationOptions().map(activationCard).join("")}</div>
            </section>
          `}
        </aside>
      </div>
    </section>
  `;
}

function renderAudienceBuilderEmptyState(canEstimate) {
  return `
    <div class="empty-estimation builder-empty-state">
      <div class="empty-estimation-icon">${icon("groups")}</div>
      <h3>${state.lang === "en" ? "No audience definition yet" : "Aun no hay definicion de audiencia"}</h3>
      <p>${state.lang === "en" ? "Describe your audience on the left, then run the estimation to generate conditions, size, breakdowns, and activation options." : "Describe la audiencia a la izquierda y ejecuta la estimacion para generar condiciones, tamano, desgloses y activacion."}</p>
      <button class="button estimation-button" data-action="run-estimation" ${canEstimate ? "" : "disabled"}>${icon("play_arrow")} ${state.lang === "en" ? "Run Estimation" : "Ejecutar estimacion"}</button>
    </div>
  `;
}

function viewCriteriaButton() {
  return `<button class="button tonal" data-action="toggle-builder-criteria">View criteria (3)</button>`;
}

function variantCriteriaDetails() {
  const criteria = state.audienceBuilderBaseFilters.length
    ? state.audienceBuilderBaseFilters
    : ['category = customer', 'last_seen > last 30 days', 'TUID exists'];
  return state.audienceBuilderCriteriaExpanded ? `
    <div class="variant-criteria-details">
      <strong>Profile Explorer base criteria</strong>
      ${criteria.map((item) => `<span>${escapeText(item)}</span>`).join("")}
      <p class="muted">Base filters define the starting population, not the final refinements.</p>
    </div>` : "";
}

function renderProfileSourceAudienceCard() {
  const hasEstimated = state.audienceBuilderConditions.length > 0;
  const canEstimate = state.audienceBuilderPrompt.trim().length > 0 || state.audienceBuilderConditions.length > 0;
  if (!hasEstimated) {
    return `
      <article class="audience-info-card profile-source-result">
        <div class="card-heading">
          <h3>Audience</h3>
          <button class="button tonal" data-action="run-estimation" ${canEstimate ? "" : "disabled"}>${icon("play_arrow")} ${state.lang === "en" ? "Estimate" : "Estimar"}</button>
        </div>
        <div class="variant-number"><strong class="kpi-value">1,451</strong> profiles</div>
        <div class="source-panel">
          <div>
            <strong>Starting Audience</strong>
            <span class="muted">Source: Profile Explorer</span>
          </div>
          ${viewCriteriaButton()}
        </div>
        <p class="muted small-note">Base filters define the starting population, not the final refinements.</p>
        ${variantCriteriaDetails()}
      </article>
    `;
  }
  return renderEstimatedAudienceCard({ includeStartingAudience: true });
}

function renderEstimatedAudienceCard({ includeStartingAudience }) {
  const estimated = finalAudienceCount();
  const baseCount = basePopulationCount();
  const retained = Math.round((estimated / baseCount) * 100);
  const canEstimate = state.audienceBuilderPrompt.trim().length > 0 || state.audienceBuilderConditions.length > 0;
  const comparison = includeStartingAudience
    ? (state.lang === "en" ? `From ${baseCount.toLocaleString()} starting profiles to ${estimated.toLocaleString()} matching profiles` : `De ${baseCount.toLocaleString()} perfiles iniciales a ${estimated.toLocaleString()} perfiles coincidentes`)
    : (state.lang === "en" ? `From ${baseCount.toLocaleString()} available profiles to ${estimated.toLocaleString()} matching profiles` : `De ${baseCount.toLocaleString()} perfiles disponibles a ${estimated.toLocaleString()} perfiles coincidentes`);
  return `
    <article class="audience-info-card profile-source-result estimated">
      <div class="card-heading">
        <h3>Final Audience</h3>
        <div class="estimation-actions">
          <button class="button tonal" data-action="run-estimation" ${canEstimate && state.audienceBuilderEstimateDirty ? "" : "disabled"}>${icon("play_arrow")} ${state.lang === "en" ? "Estimate" : "Estimar"}</button>
          <button class="mini estimation-refresh" data-action="run-estimation" ${canEstimate ? "" : "disabled"} title="Refresh">${icon("refresh")}</button>
        </div>
      </div>
      <div class="variant-number"><strong class="kpi-value">${estimated.toLocaleString()}</strong> ${t("profiles")}</div>
      <p><strong>${retained}% ${state.lang === "en" ? "retained" : "retenido"}</strong></p>
      <div class="progress retained-progress"><span style="width:${retained}%"></span></div>
      <p class="muted">${comparison}</p>
      ${includeStartingAudience ? collapsedStartingRow() : ""}
      <details class="split-expander">
        <summary><span>Audience breakdowns</span>${icon("expand_more")}</summary>
        ${compactBreakdowns("tiles")}
      </details>
    </article>
  `;
}

function collapsedStartingRow() {
  return `
    <div class="collapsed-starting-row">
      <div>
        <strong>Starting Audience</strong>
        <span class="muted">1,451 profiles · Source: Profile Explorer</span>
      </div>
      ${viewCriteriaButton()}
    </div>
  `;
}

function compactBreakdowns(mode = "tiles") {
  const items = [
    ["Device split", "Android 54%", "iOS 46%"],
    ["Region split", "North 38%", "Central 34%", "South 28%"],
    ["Interest split", "Devices 42%", "Tariffs 31%", "Entertainment 27%"]
  ];
  return `<div class="variant-breakdowns ${mode}">${items.map(([title, ...rows]) => `<div><strong>${title}</strong>${rows.map((row) => `<span>${row}</span>`).join("")}</div>`).join("")}</div>`;
}

function basePopulationCount() {
  return state.audienceBuilderSource === "profiles" ? 1451 : 20000;
}

function finalAudienceCount() {
  if (!state.audienceBuilderConditions.length) return basePopulationCount();
  const base = basePopulationCount();
  const prompt = state.audienceBuilderPrompt.toLowerCase();
  const promptScore = Array.from(prompt).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const channelScore = state.audienceBuilderChannels.reduce((sum, channel) => sum + channel.length, 0);
  let retention = state.audienceBuilderSource === "profiles" ? 0.74 : 0.82;
  retention -= Math.min(0.34, state.audienceBuilderConditions.length * 0.055);
  if (/7|last 7|ultimos 7/.test(prompt)) retention -= 0.08;
  if (/android|ios|device|dispositivo/.test(prompt)) retention -= 0.05;
  if (/region|regiones|selected regions/.test(prompt)) retention -= 0.06;
  if (/consent|consentimiento/.test(prompt)) retention -= 0.04;
  retention += ((promptScore + channelScore) % 9) / 100;
  const minimum = state.audienceBuilderSource === "profiles" ? 120 : 1260;
  return Math.max(minimum, Math.round(base * Math.max(0.08, Math.min(0.97, retention))));
}

function renderStartingAudienceCard() {
  const criteria = state.audienceBuilderBaseFilters.length
    ? state.audienceBuilderBaseFilters
    : (state.lang === "en" ? ["All available profiles"] : ["Todos los perfiles disponibles"]);
  const visible = state.audienceBuilderCriteriaExpanded ? criteria : criteria.slice(0, 3);
  return `
    <section class="starting-audience-card">
      <div class="card-heading">
        <div>
          <h3>Starting Audience</h3>
          <p class="muted">${state.lang === "en" ? "Source: Profile Explorer" : "Origen: Profile Explorer"}</p>
        </div>
        <span class="chip gray">${state.lang === "en" ? "Base population" : "Poblacion base"}</span>
      </div>
      <div class="starting-count"><strong class="kpi-value">${basePopulationCount().toLocaleString()}</strong> <span class="muted">${t("profiles")}</span></div>
      <div class="criteria-list">${visible.map((item) => `<span>${escapeText(item)}</span>`).join("")}${!state.audienceBuilderCriteriaExpanded && criteria.length > 3 ? `<span>+ ${criteria.length - 3} ${state.lang === "en" ? "more" : "mas"}</span>` : ""}</div>
      <button class="button tonal" data-action="toggle-builder-criteria">${state.audienceBuilderCriteriaExpanded ? (state.lang === "en" ? "Hide criteria" : "Ocultar criterios") : (state.lang === "en" ? "View criteria" : "Ver criterios")}</button>
      <p class="muted small-note">${state.lang === "en" ? "Base filters are the initial universe, not final audience refinements." : "Los filtros base son el universo inicial, no refinamientos finales."}</p>
    </section>
  `;
}

function renderAudienceConditions() {
  return `
    <section class="audience-conditions">
      <div class="card-heading">
        <div>
          <h3>Audience Conditions</h3>
          <p class="muted">${state.lang === "en" ? "Users who:" : "Usuarios que:"}</p>
        </div>
        <button class="button tonal" data-action="add-audience-condition">${icon("add")} ${state.lang === "en" ? "Add condition" : "Agregar condicion"}</button>
      </div>
      <div class="condition-list">${state.audienceBuilderConditions.map(conditionRow).join("")}</div>
    </section>
  `;
}

function conditionRow(condition, index) {
  const fields = ["customer type", "timeframe", "device type", "region", "behavioral category"];
  const operators = ["is", "within", "uses", "in", "contains"];
  return `
    <div class="condition-row" data-condition-index="${index}">
      <span class="condition-prefix">${index === 0 ? (state.lang === "en" ? "Users who" : "Usuarios que") : ""}</span>
      <select class="select" data-condition-field="${index}">${fields.map((field) => `<option ${condition.field === field ? "selected" : ""}>${field}</option>`).join("")}</select>
      <select class="select" data-condition-operator="${index}">${operators.map((operator) => `<option ${condition.operator === operator ? "selected" : ""}>${operator}</option>`).join("")}</select>
      <input class="input" data-condition-value="${index}" value="${escapeAttr(condition.value)}" />
      <button class="mini text-icon" data-remove-condition="${index}" title="Remove">${icon("close")}</button>
    </div>
  `;
}

function renderEstimationCard() {
  const estimated = finalAudienceCount();
  const canEstimate = state.audienceBuilderPrompt.trim().length > 0 || state.audienceBuilderConditions.length > 0;
  const comparison = state.audienceBuilderSource === "profiles"
    ? (state.lang === "en" ? `From ${basePopulationCount().toLocaleString()} starting profiles to ${estimated.toLocaleString()} matching profiles` : `De ${basePopulationCount().toLocaleString()} perfiles iniciales a ${estimated.toLocaleString()} perfiles coincidentes`)
    : (state.lang === "en" ? `From ${basePopulationCount().toLocaleString()} available profiles to ${estimated.toLocaleString()} matching profiles` : `De ${basePopulationCount().toLocaleString()} perfiles disponibles a ${estimated.toLocaleString()} perfiles coincidentes`);
  return `
    <section class="estimate builder-estimate">
      <div class="card-heading">
        <div>
          <span>${t("estimatedAudienceSize")}</span>
          <div><strong class="kpi-value">${estimated.toLocaleString()}</strong> ${t("profiles")}</div>
        </div>
        <button class="button tonal" data-action="run-estimation" ${canEstimate && state.audienceBuilderEstimateDirty ? "" : "disabled"}>${icon("play_arrow")} ${state.lang === "en" ? "Estimate" : "Estimar"}</button>
      </div>
      <p>${comparison}</p>
      <div class="progress"><span style="width:${Math.round((estimated / basePopulationCount()) * 100)}%"></span></div>
      <div class="breakdown-grid">
        ${breakdown("Device split", [["Android", 54], ["iOS", 46]])}
        ${breakdown("Region split", [["North", 38], ["Central", 34], ["South", 28]])}
        ${breakdown("Interest split", [["Devices", 42], ["Tariffs", 31], ["Entertainment", 27]])}
      </div>
    </section>
  `;
}

function breakdown(title, rows) {
  return `<div class="breakdown"><strong>${title}</strong>${rows.map(([label, value]) => `<span><em>${label}</em><b>${value}%</b></span>`).join("")}</div>`;
}

function activationOptions() {
  return [
    { id: "Email", title: "Email", icon: "mail", copy: state.lang === "en" ? "Activate the final audience for lifecycle campaigns." : "Activa la audiencia final para campanas de ciclo de vida." },
    { id: "SMS", title: "SMS", icon: "sms", copy: state.lang === "en" ? "Send the final audience to SMS journeys." : "Envia la audiencia final a journeys SMS." },
    { id: "Push", title: "Push", icon: "notifications_active", copy: state.lang === "en" ? "Use the final audience for app and web push." : "Usa la audiencia final para push de app y web." },
    { id: "Export", title: "Export", icon: "download", copy: state.lang === "en" ? "Export the final audience for external activation." : "Exporta la audiencia final para activacion externa." }
  ];
}

function activationCard(option) {
  const selected = state.audienceBuilderChannels.includes(option.id);
  return `
    <button class="activation-card ${selected ? "selected" : ""}" data-activation-channel="${option.id}">
      <span class="activation-content">
        <span class="activation-card-head">
          <span class="activation-avatar">${icon(option.icon)}</span>
          <span><strong>${option.title}</strong><small>${option.id}</small></span>
        </span>
        <span class="activation-copy">${option.copy}</span>
      </span>
      <span class="activation-check">${icon(selected ? "check_circle" : "radio_button_unchecked")}</span>
    </button>
  `;
}

function showAudienceReview() {
  const promptInput = document.getElementById("audiencePrompt");
  if (promptInput) state.audienceBuilderPrompt = promptInput.value.trim();
  if (!state.audienceBuilderPrompt.trim() && !state.audienceBuilderConditions.length) return;
  state.audienceBuilderFilters = deriveFilters(state.audienceBuilderPrompt || state.audienceBuilderBaseFilters.join(" "));
  if (!state.audienceBuilderConditions.length || state.audienceBuilderPrompt !== state.audienceBuilderLastEstimatedPrompt) {
    state.audienceBuilderConditions = generateAudienceConditions(state.audienceBuilderPrompt);
  }
  state.audienceBuilderLastEstimatedPrompt = state.audienceBuilderPrompt;
  state.audienceBuilderEstimateDirty = false;
  state.audienceBuilderStep = "review";
  routeTo("audienceBuilder");
}

function toggleSuggestedPrompt(prompt) {
  const selected = state.audienceBuilderSelectedPrompts.includes(prompt);
  state.audienceBuilderSelectedPrompts = selected
    ? state.audienceBuilderSelectedPrompts.filter((item) => item !== prompt)
    : [...state.audienceBuilderSelectedPrompts, prompt];
  state.audienceBuilderPrompt = selected
    ? removePromptText(state.audienceBuilderPrompt, prompt)
    : [state.audienceBuilderPrompt.trim(), prompt].filter(Boolean).join(". ");
  state.audienceBuilderEstimateDirty = true;
}

function removePromptText(text, prompt) {
  return text
    .split(".")
    .map((part) => part.trim())
    .filter((part) => part && part !== prompt)
    .join(". ");
}

function generateAudienceConditions(text) {
  const content = text || "";
  const conditions = [
    { field: "customer type", operator: "is", value: /prepaid|prepago/i.test(content) ? "prepaid customer" : "customer" },
    { field: "timeframe", operator: "within", value: /7/.test(content) ? "last 7 days" : "last 30 days" }
  ];
  if (/android|ios|device|dispositivo/i.test(content)) conditions.push({ field: "device type", operator: "uses", value: /android/i.test(content) && /ios/i.test(content) ? "Android or iOS" : "Android" });
  if (/region|regiones|selected regions/i.test(content)) conditions.push({ field: "region", operator: "in", value: "selected regions" });
  if (/device|tariff|entertainment|bundle|dispositivo|tarifa|entretenimiento/i.test(content)) conditions.push({ field: "behavioral category", operator: "contains", value: "devices, tariffs, entertainment bundles" });
  return conditions;
}
function deriveFilters(text) {
  const filters = ["category = customer"];
  if (/7/.test(text)) filters.push("last_seen > last 7 days");
  else filters.push("last_seen > last 30 days");
  if (/email|correo/i.test(text)) filters.push("email exists");
  if (/consent|consentimiento/i.test(text)) filters.push("consent = granted");
  if (/brand|marca|source|fuente/i.test(text)) filters.push("source = dev-brand-demo-consent");
  return [...new Set(filters)];
}

function openAggregationModal() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <section class="modal">
        <header class="modal-header"><div><h2>${t("aggregationCreate")}</h2><p class="subtitle">${t("selectTemplateHint")}</p></div><button class="close" data-close-modal>&times;</button></header>
        <div class="modal-body">
          <select class="select" id="aggUseCase"><option>Event-based</option><option>ID Snapshot</option><option>Custom Aggregation</option><option>Digital Activity of Users</option></select>
          <input class="input" id="aggName" placeholder="${t("metricName")}" />
          <select class="select" id="aggMetric"><option value="count">count</option><option value="count_distinct">count_distinct</option></select>
          <select class="select" id="aggPeriod"><option>Daily</option><option>Last 7 Days</option><option>Calendar Month</option><option>Snapshot</option></select>
          <input class="input" id="aggTags" placeholder="${t("tagsComma")}" />
        </div>
        <footer class="modal-footer"><button class="button surface" data-close-modal>${t("cancel")}</button><button class="button" data-save-agg>${t("save")}</button></footer>
      </section>
    </div>
  `;
}

function saveAudience(status) {
  const nameInput = document.getElementById("audienceName");
  const name = (nameInput ? nameInput.value.trim() : "") || titleCase(state.audienceBuilderPrompt || t("newAudience"));
  const filters = state.audienceBuilderConditions.length ? state.audienceBuilderConditions.map((c) => `${c.field} ${c.operator} ${c.value}`) : deriveFilters(name);
  const selectedChannels = state.audienceBuilderChannels.length ? state.audienceBuilderChannels : [];
  state.audiences.unshift({ id: `aud-${Date.now()}`, name, count: finalAudienceCount(), status, filters, channels: selectedChannels, created: "Jun 4, 2026" });
  state.lastAudienceName = name;
  if (status === "activated") {
    closeModal();
    routeTo("audiences");
    showToast(state.lang === "en" ? "Audience activated successfully" : "Audiencia activada correctamente", "success");
  } else {
    openAudienceResultModal(status, name);
    showToast(t("audienceCreated"));
  }
}

function defaultAudienceName() {
  return titleCase(state.audienceBuilderPrompt || state.audienceBuilderSelectedPrompts[0] || t("newAudience")).slice(0, 80);
}

function openActivateAudienceModal() {
  const name = defaultAudienceName();
  modalRoot.innerHTML = `
    <div class="modal-backdrop activate-backdrop">
      <section class="modal activate-modal" role="dialog" aria-modal="true" aria-label="${state.lang === "en" ? "Activate Audience" : "Activar audiencia"}">
        <header class="activate-modal-header">
          <div>
            <h2>${state.lang === "en" ? "Activate Audience" : "Activar audiencia"}</h2>
            <p class="muted">${state.lang === "en" ? "Give your audience a name before activating." : "Dale un nombre a tu audiencia antes de activarla."}</p>
          </div>
          <button class="close activate-close" data-close-modal aria-label="${t("cancel")}">${icon("close")}</button>
        </header>
        <div class="activate-modal-body">
          <label class="activate-name-field">
            <span>${t("audienceName")}</span>
            <input class="input" id="audienceName" maxlength="80" value="${escapeAttr(name)}" />
            <small id="audienceNameCounter">${name.length}/80</small>
          </label>
        </div>
        <footer class="activate-modal-footer">
          <button class="button surface" data-close-modal>${t("cancel")}</button>
          <button class="button" data-action="confirm-activate-audience">${icon("bolt")} ${state.lang === "en" ? "Activate" : "Activar"}</button>
        </footer>
      </section>
    </div>
  `;
}

function cancelAudienceFlow() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <section class="modal result-modal warning" role="dialog" aria-modal="true">
        <button class="close result-close" data-close-modal>&times;</button>
        <div class="modal-result-body">
          <div class="result-icon">${icon("warning")}</div>
          <h2>${state.lang === "en" ? "Abandon audience builder?" : "Abandonar Audience Builder?"}</h2>
          <p class="muted">${state.lang === "en" ? "Your current audience definition progress will be discarded." : "Se descartara el avance realizado en la definicion de audiencia."}</p>
          <div class="actions">
            <button class="button text" data-close-modal>${state.lang === "en" ? "Keep editing" : "Seguir editando"}</button>
            <button class="button" data-action="confirm-cancel-audience">${state.audienceBuilderSource === "profiles" ? (state.lang === "en" ? "Cancel & back" : "Cancelar y volver") : t("cancel")}</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function openAudienceResultModal(status, name) {
  const resultMap = {
    activated: { title: t("audienceActivatedTitle"), copy: t("audienceActivatedCopy"), icon: "check_circle", tone: "success" },
    draft: { title: t("audienceDraftTitle"), copy: t("audienceDraftCopy"), icon: "draft", tone: "warning" },
    cancelled: { title: t("audienceCancelledTitle"), copy: t("audienceCancelledCopy"), icon: "cancel", tone: "error" }
  };
  const result = resultMap[status];
  modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <section class="modal result-modal ${result.tone}" role="dialog" aria-modal="true">
        <button class="close result-close" data-close-modal>&times;</button>
        <div class="modal-result-body">
          <div class="result-icon">${icon(result.icon)}</div>
          <h2>${result.title}</h2>
          <p class="muted">${result.copy}</p>
          ${name ? `<strong>${escapeText(name)}</strong>` : ""}
          <div class="actions">
            <button class="button surface" data-action="builder-back">${t("backToAudiences")}</button>
            <button class="button" data-action="new-audience">${icon("group_add")} ${t("createAnother")}</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function toggleActivationChannel(channel) {
  state.audienceBuilderChannels = [channel];
  renderAudienceBuilder();
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function triggerProfileLoad() {
  state.profileLoading = true;
  renderProfiles();
  clearTimeout(state.profileLoadingTimer);
  state.profileLoadingTimer = setTimeout(() => {
    state.profileLoading = false;
    renderProfiles();
  }, 850);
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function titleCase(text) {
  const cleaned = text.replace(/^"(.+)" contiene busqueda$/i, "$1").slice(0, 56);
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
}

function render() {
  updateChromeTexts();
  if (state.route === "home") renderHome();
  if (state.route === "profiles") renderProfiles();
  if (state.route === "audiences") renderAudiences();
  if (state.route === "audienceBuilder") renderAudienceBuilder();
  if (state.route === "aggregation") renderAggregation();
}

document.addEventListener("click", (event) => {
  const card = event.target.closest("[data-card-action]");
  if (card) {
    const action = card.dataset.cardAction;
    if (action === "go-profiles") routeTo("profiles");
    if (action === "new-audience") openAudienceBuilder([]);
  }
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.route) routeTo(target.dataset.route);
  if (target.dataset.action === "go-profiles") routeTo("profiles");
  if (target.dataset.action === "new-audience") closeModal(), openAudienceBuilder([]);
  if (target.dataset.action === "builder-back") closeModal(), routeTo("audiences");
  if (target.dataset.action === "generate-audience-page" || target.dataset.action === "run-estimation") showAudienceReview();
  if (target.dataset.action === "cancel-audience-flow") cancelAudienceFlow();
  if (target.dataset.action === "confirm-cancel-audience") closeModal(), routeTo(state.audienceBuilderSource === "profiles" ? "profiles" : "audiences");
  if (target.dataset.action === "save-audience-draft") saveAudience("draft");
  if (target.dataset.action === "activate-audience-flow") openActivateAudienceModal();
  if (target.dataset.action === "confirm-activate-audience") saveAudience("activated");
  if (target.dataset.activationChannel) toggleActivationChannel(target.dataset.activationChannel);
  if (target.dataset.action === "create-audience-from-profile") openAudienceBuilder(currentBaseFilters(), "profiles");
  if (target.dataset.action === "toggle-builder-criteria") state.audienceBuilderCriteriaExpanded = !state.audienceBuilderCriteriaExpanded, renderAudienceBuilder();
  if (target.dataset.action === "add-audience-condition") state.audienceBuilderConditions = [...state.audienceBuilderConditions, { field: "behavioral category", operator: "contains", value: "new interest" }], state.audienceBuilderEstimateDirty = true, renderAudienceBuilder();
  if (target.dataset.toggleFieldMenu) {
    state.openFieldMenu = state.openFieldMenu === target.dataset.toggleFieldMenu ? "" : target.dataset.toggleFieldMenu;
    renderProfiles();
  }
  if (target.dataset.categoryFilter) {
    const value = target.dataset.categoryFilter;
    const filter = `category = ${value}`;
    const hasFilter = state.profileFilters.includes(filter);
    state.profileFilters = hasFilter
      ? state.profileFilters.filter((item) => item !== filter)
      : [filter, ...state.profileFilters];
    state.profileSearched = state.profileFilters.length > 0 || state.profileQuery.trim().length > 0;
    triggerProfileLoad();
  }
  if (target.dataset.menuOption) {
    const key = target.dataset.menuOption;
    const value = target.dataset.menuValue;
    state.fieldValues[key] = value;
    state.openFieldMenu = "";
    if (key !== "age_operator") {
      state.profileFilters = [`${key} = ${value}`, ...state.profileFilters.filter((f) => !f.startsWith(`${key} =`))];
      state.profileSearched = true;
      triggerProfileLoad();
    } else {
      renderProfiles();
    }
  }
  if (target.dataset.action === "create-aggregation") openAggregationModal();
  if (target.dataset.action === "toggle-identifier-menu") {
    state.profileIdentifierMenu = !state.profileIdentifierMenu;
    state.profileIdentifierError = false;
    renderProfiles();
  }
  if (target.dataset.action === "close-identifier-menu") {
    state.profileIdentifierMenu = false;
    state.profileIdentifierError = false;
    renderProfiles();
  }
  if (target.dataset.action === "apply-identifier-search") {
    state.profileIdentifierType = document.getElementById("identifierType").value;
    state.profileIdentifierValue = document.getElementById("identifierValue").value.trim();
    if (!state.profileIdentifierType) {
      state.profileIdentifierError = true;
      renderProfiles();
      return;
    }
    const value = state.profileIdentifierValue || "UMID-123-234";
    const identifierFilter = `${state.profileIdentifierType}: "${value}"`;
    state.profileQuery = identifierFilter;
    state.profileFilters = [identifierFilter, ...state.profileFilters.filter((f) => !f.startsWith(`${state.profileIdentifierType}:`))];
    state.profileSearched = true;
    state.profileIdentifierMenu = false;
    state.profileIdentifierError = false;
    triggerProfileLoad();
  }
  if (target.dataset.action === "profile-search") {
    state.profileQuery = document.getElementById("profileQuery").value;
    state.profileSearched = true;
    if (state.profileQuery.trim()) state.profileFilters = [`search contains ${state.profileQuery.trim()}`, ...state.profileFilters.filter((f) => !f.startsWith("search contains"))];
    triggerProfileLoad();
  }
  if (target.dataset.action === "attribute-search") state.profileSidebar = true, renderProfiles();
  if (target.dataset.action === "clear-profile-filters") state.profileFilters = [], state.profileQuery = "", state.profileSearched = false, state.profileIdentifierValue = "", triggerProfileLoad();
  if (target.dataset.action === "toggle-profile-fullscreen") state.profileFullscreen = !state.profileFullscreen, renderProfiles();
  if (target.dataset.action === "toggle-profile-sidebar") state.profileSidebar = !state.profileSidebar, renderProfiles();
  if (target.dataset.removeProfileFilter !== undefined) {
    const removedIndex = Number(target.dataset.removeProfileFilter);
    const queryOffset = state.profileQuery.trim() ? 1 : 0;
    if (removedIndex === 0 && queryOffset) state.profileQuery = "";
    else state.profileFilters = state.profileFilters.filter((_, index) => index !== removedIndex - queryOffset);
    state.profileSearched = state.profileQuery.trim().length > 0 || state.profileFilters.length > 0;
    triggerProfileLoad();
  }
  if (target.dataset.removeCondition !== undefined) {
    state.audienceBuilderConditions = state.audienceBuilderConditions.filter((_, index) => index !== Number(target.dataset.removeCondition));
    state.audienceBuilderEstimateDirty = true;
    renderAudienceBuilder();
  }
  if (target.dataset.action === "apply-age-filter") {
    const value = document.getElementById("ageValue").value || "750";
    const op = state.fieldValues.age_operator || "gt";
    state.profileFilters = [`age ${op} ${value}`, ...state.profileFilters.filter((f) => !f.startsWith("age"))];
    state.profileSearched = true;
    triggerProfileLoad();
  }
  if (target.dataset.action === "profile-prev-page") state.profilePage = Math.max(1, state.profilePage - 1), triggerProfileLoad();
  if (target.dataset.action === "profile-next-page") state.profilePage += 1, triggerProfileLoad();
  if (target.dataset.audienceTab) state.audienceTab = target.dataset.audienceTab, renderAudiences();
  if (target.dataset.action === "cards") state.audienceView = "cards", renderAudiences();
  if (target.dataset.action === "table") state.audienceView = "table", renderAudiences();
  if (target.dataset.action === "toggle-column-menu") state.audienceColumnMenu = !state.audienceColumnMenu, renderAudiences();
  if (target.dataset.audienceColumns) state.audienceColumns = Number(target.dataset.audienceColumns), state.audienceColumnMenu = false, renderAudiences();
  if (target.dataset.toggleAudienceMenu) state.audienceActionMenu = state.audienceActionMenu === target.dataset.toggleAudienceMenu ? "" : target.dataset.toggleAudienceMenu, renderAudiences();
  if (target.dataset.activate) state.audiences = state.audiences.map((a) => a.id === target.dataset.activate ? { ...a, status: "activated" } : a), renderAudiences();
  if (target.dataset.deleteAudience) state.audiences = state.audiences.filter((a) => a.id !== target.dataset.deleteAudience), state.audienceActionMenu = "", renderAudiences();
  if (target.dataset.editAudience) {
    const audience = state.audiences.find((a) => a.id === target.dataset.editAudience);
    state.audienceActionMenu = "";
    openAudienceBuilder(audience ? audience.filters : []);
  }
  if (target.dataset.generateAudience !== undefined) showAudienceReview();
  if (target.dataset.example) {
    toggleSuggestedPrompt(target.dataset.example);
    renderAudienceBuilder();
  }
  if (target.dataset.refineAudience !== undefined) state.audienceBuilderStep = "compose", routeTo("audienceBuilder");
  if (target.dataset.saveAudience) saveAudience(target.dataset.saveAudience);
  if (target.dataset.channel !== undefined) target.classList.toggle("selected");
  if (target.dataset.closeModal !== undefined) closeModal();
  if (target.dataset.saveAgg !== undefined) {
    state.aggregations.unshift({
      id: `metric_${Date.now().toString().slice(-5)}`,
      metric: document.getElementById("aggName").value.trim() || t("metricNew"),
      useCase: document.getElementById("aggUseCase").value,
      source: "custom_source",
      type: document.getElementById("aggMetric").value,
      column: "profile_id",
      timeRange: document.getElementById("aggPeriod").value,
      labels: (document.getElementById("aggTags").value || "custom").split(",").map((t) => t.trim()).filter(Boolean),
      status: "draft"
    });
    closeModal();
    routeTo("aggregation");
  }
  if (target.dataset.toggleAgg) {
    state.aggregations = state.aggregations.map((a) => a.id === target.dataset.toggleAgg ? { ...a, status: a.status === "activated" ? "deactivated" : "activated" } : a);
    renderAggregation();
  }
  if (target.dataset.deleteAgg) state.aggregations = state.aggregations.filter((a) => a.id !== target.dataset.deleteAgg), renderAggregation();
});

document.addEventListener("change", (event) => {
  if (event.target.id === "identifierType") {
    state.profileIdentifierType = event.target.value;
    state.profileIdentifierError = false;
  }
  if (event.target.id === "profileItemsPerPage") {
    state.profileItemsPerPage = Number(event.target.value);
    state.profilePage = 1;
    triggerProfileLoad();
  }
  if (event.target.dataset.conditionField !== undefined) {
    state.audienceBuilderConditions[Number(event.target.dataset.conditionField)].field = event.target.value;
    state.audienceBuilderEstimateDirty = true;
    renderAudienceBuilder();
  }
  if (event.target.dataset.conditionOperator !== undefined) {
    state.audienceBuilderConditions[Number(event.target.dataset.conditionOperator)].operator = event.target.value;
    state.audienceBuilderEstimateDirty = true;
    renderAudienceBuilder();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "profileQuery") state.profileQuery = event.target.value;
  if (event.target.id === "identifierValue") state.profileIdentifierValue = event.target.value;
  if (event.target.id === "audiencePrompt") {
    state.audienceBuilderPrompt = event.target.value;
    state.audienceBuilderSelectedPrompts = [];
    state.audienceBuilderEstimateDirty = true;
    const button = document.querySelector("[data-generate-audience]");
    if (button) button.disabled = Number(button.dataset.baseCount) === 0 && event.target.value.trim().length === 0;
    document.querySelectorAll("[data-action='generate-audience-page']").forEach((item) => {
      item.disabled = event.target.value.trim().length === 0;
    });
    document.querySelectorAll("[data-action='run-estimation']").forEach((item) => {
      item.disabled = event.target.value.trim().length === 0 && state.audienceBuilderConditions.length === 0;
    });
    document.querySelectorAll("[data-action='activate-audience-flow']").forEach((item) => item.disabled = true);
  }
  if (event.target.id === "audienceName") {
    const counter = document.getElementById("audienceNameCounter");
    if (counter) counter.textContent = `${event.target.value.length}/80`;
  }
  if (event.target.dataset.conditionValue !== undefined) {
    state.audienceBuilderConditions[Number(event.target.dataset.conditionValue)].value = event.target.value;
    state.audienceBuilderEstimateDirty = true;
    document.querySelectorAll("[data-action='run-estimation']").forEach((item) => item.disabled = false);
    document.querySelectorAll("[data-action='activate-audience-flow']").forEach((item) => item.disabled = true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.id === "profileQuery" && event.key === "Enter") {
    state.profileQuery = event.target.value;
    state.profileSearched = true;
    if (state.profileQuery.trim()) state.profileFilters = state.profileFilters.filter((f) => !f.startsWith("search contains"));
    renderProfiles();
  }
  if (event.target.id === "identifierValue" && event.key === "Enter") {
    document.querySelector("[data-action='apply-identifier-search']")?.click();
  }
  if (event.target.id === "audiencePrompt" && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    showAudienceReview();
  }
});

const initialRoute = location.hash.slice(1);
if (routeLabels[initialRoute]) state.route = initialRoute;
window.addEventListener("hashchange", () => {
  const hashRoute = location.hash.slice(1);
  if (routeLabels[hashRoute]) routeTo(hashRoute);
});

document.getElementById("toggleDrawer").addEventListener("click", () => {
  drawer.classList.toggle("open");
  drawerBackdrop.classList.toggle("open");
});
drawerBackdrop.addEventListener("click", closeDrawer);
document.getElementById("langToggle").addEventListener("click", () => {
  state.lang = state.lang === "en" ? "es" : "en";
  localStorage.setItem("fm-lang", state.lang);
  render();
});

if (urlParams.get("dark") === "1" || localStorage.getItem("fm-dark") === "true") document.body.classList.add("dark");
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("fm-dark", String(document.body.classList.contains("dark")));
});

render();





