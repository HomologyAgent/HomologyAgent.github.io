(() => {
  'use strict';

  const root = document.querySelector('.builder');
  if (!root) return;
  const catalogUrl = root.dataset.catalogUrl;
  const catalogBase = new URL('.', catalogUrl);
  const defaultConfigUrl = new URL('dxplay.json', catalogBase).href;
  const selectedCategories = new Set(['film-series', 'animation', 'short-drama']);
  const selectedDeliveries = new Set(['direct', 'resolver', 'drive-share']);
  const disabledSources = new Set();
  const labels = {direct: '直接播放', resolver: '解析播放', 'drive-share': '网盘分享'};
  let catalog = {categories: [], sources: []};

  const byId = id => document.getElementById(id);
  const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
  const activeSources = () => catalog.sources.filter(source =>
    source.health === 'verified'
      && source.classification.content.some(category => selectedCategories.has(category))
      && selectedDeliveries.has(source.classification.delivery));
  const enabledSources = () => activeSources().filter(source => !disabledSources.has(source.id));
  const site = source => ({
    key: source.id,
    name: source.name,
    type: source.type,
    api: new URL(source.plugin, catalogBase).href,
    searchable: source.capabilities.searchable ? 1 : 0,
    quickSearch: source.capabilities.quickSearch ? 1 : 0,
    filterable: source.capabilities.filterable ? 1 : 0,
    changeable: source.capabilities.changeable ? 1 : 0,
    ...(source.extension === undefined ? {} : {ext: source.extension}),
    ...(source.headers === undefined ? {} : {headers: source.headers}),
  });
  const config = () => ({
    name: 'DXPlay · ' + catalog.categories.filter(category => selectedCategories.has(category.id)).map(category => category.name).join(' + '),
    sites: enabledSources().map(site),
  });
  const configText = () => JSON.stringify(config(), null, 2) + '\n';

  const renderCategories = () => {
    const counts = Object.fromEntries(catalog.categories.map(category => [category.id,
      catalog.sources.filter(source => source.classification.content.includes(category.id)).length]));
    byId('category-options').innerHTML = catalog.categories.map(category => `
      <label class="option-card ${category.explicit ? 'adult' : ''}">
        <input type="checkbox" value="${escapeText(category.id)}" ${selectedCategories.has(category.id) ? 'checked' : ''}>
        <span class="option-title"><span>${escapeText(category.name)}</span><span class="option-count">${counts[category.id]}</span></span>
        <span class="option-description">${escapeText(category.description)}</span>
      </label>`).join('');
    byId('category-options').addEventListener('change', event => {
      const input = event.target.closest('input[type="checkbox"]');
      if (!input) return;
      if (input.checked) selectedCategories.add(input.value); else selectedCategories.delete(input.value);
      renderSources();
    });
  };

  const renderDeliveries = () => {
    byId('delivery-options').innerHTML = Object.entries(labels).map(([id, name]) => `
      <label class="segment"><input type="checkbox" value="${id}" checked><span>${name}</span></label>`).join('');
    byId('delivery-options').addEventListener('change', event => {
      const input = event.target.closest('input[type="checkbox"]');
      if (!input) return;
      if (input.checked) selectedDeliveries.add(input.value); else selectedDeliveries.delete(input.value);
      renderSources();
    });
  };

  const visibleSources = () => {
    const query = byId('source-search').value.trim().toLocaleLowerCase('zh-CN');
    return activeSources().filter(source => !query || source.name.toLocaleLowerCase('zh-CN').includes(query));
  };
  const renderSources = () => {
    const active = activeSources();
    const visible = visibleSources();
    byId('source-summary').textContent = `当前组合 ${active.length} 个源，列表显示 ${visible.length} 个`;
    byId('source-list').innerHTML = visible.length ? visible.map(source => {
      const categories = source.classification.content.map(id => catalog.categories.find(value => value.id === id)?.name || id).join(' · ');
      return `<label class="source-item">
        <input type="checkbox" value="${escapeText(source.id)}" ${disabledSources.has(source.id) ? '' : 'checked'}>
        <span><span class="source-name">${escapeText(source.name)}</span>
        <span class="source-meta">${escapeText(categories)} · ${escapeText(labels[source.classification.delivery] || source.classification.delivery)}</span></span>
      </label>`;
    }).join('') : '<p>没有匹配当前条件的源。</p>';
    byId('source-list').querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      if (input.checked) disabledSources.delete(input.value); else disabledSources.add(input.value);
      renderOutput();
    }));
    renderOutput();
  };
  const renderOutput = () => {
    const count = enabledSources().length;
    byId('selection-count').textContent = count + ' 个源';
    byId('config-preview').textContent = configText();
    byId('download-config').disabled = count === 0;
    byId('copy-config').disabled = count === 0;
  };
  const renderPresets = () => {
    byId('preset-links').innerHTML = catalog.categories.map(category => {
      const url = new URL('configs/' + category.id + '.json', catalogBase).href;
      return `<a class="preset-link ${category.explicit ? 'adult' : ''}" href="${escapeText(url)}">${escapeText(category.name)} JSON</a>`;
    }).join('');
  };
  const copy = async (value, button) => {
    await navigator.clipboard.writeText(value);
    const label = button.textContent;
    button.textContent = '已复制';
    window.setTimeout(() => { button.textContent = label; }, 1400);
  };

  byId('source-search').addEventListener('input', renderSources);
  byId('enable-visible').addEventListener('click', () => { visibleSources().forEach(source => disabledSources.delete(source.id)); renderSources(); });
  byId('disable-visible').addEventListener('click', () => { visibleSources().forEach(source => disabledSources.add(source.id)); renderSources(); });
  byId('copy-config').addEventListener('click', event => copy(configText(), event.currentTarget));
  byId('copy-default-url').addEventListener('click', event => copy(defaultConfigUrl, event.currentTarget));
  byId('download-config').addEventListener('click', () => {
    const blob = new Blob([configText()], {type: 'application/json;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dxplay.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  fetch(catalogUrl, {cache: 'no-cache'}).then(response => {
    if (!response.ok) throw new Error('catalog unavailable');
    return response.json();
  }).then(value => {
    if (value.schemaVersion !== 1 || !Array.isArray(value.categories) || !Array.isArray(value.sources)) throw new Error('catalog invalid');
    catalog = value;
    byId('catalog-status').textContent = `目录已加载 · ${catalog.sources.length} 个源`;
    byId('default-config-link').href = defaultConfigUrl;
    renderCategories();
    renderDeliveries();
    renderPresets();
    renderSources();
  }).catch(() => {
    byId('catalog-status').textContent = '目录加载失败，请稍后重试';
    byId('catalog-status').classList.add('error');
  });
})();
