---
layout: default
title: DXPlay 源生成器
---

<div class="builder" data-catalog-url="https://raw.githubusercontent.com/HomologyAgent/dxsrc/master/catalog.json">
  <section class="intro-panel">
    <p class="eyebrow">DXPLAY COMMUNITY CATALOG</p>
    <h1>按你的喜好，生成一份干净的源配置</h1>
    <p>选择内容类型与播放方式，必要时再关闭个别源。所有处理都在浏览器本地完成。</p>
    <div class="status-row">
      <span id="catalog-status" class="status-chip">正在读取目录…</span>
      <a id="default-config-link" class="quiet-link" href="https://raw.githubusercontent.com/HomologyAgent/dxsrc/master/dxplay.json">默认配置 URL</a>
    </div>
  </section>

  <section class="panel">
    <div class="section-heading">
      <div><span class="step">01</span><h2>内容偏好</h2></div>
      <span class="section-note">可以多选</span>
    </div>
    <div id="category-options" class="option-grid" aria-live="polite"></div>
  </section>

  <section class="panel split-panel">
    <div>
      <div class="section-heading compact">
        <div><span class="step">02</span><h2>播放方式</h2></div>
      </div>
      <div id="delivery-options" class="segmented" role="group" aria-label="播放方式"></div>
    </div>
    <div>
      <label class="search-label" for="source-search">查找源</label>
      <input id="source-search" class="search-input" type="search" placeholder="输入源名称" autocomplete="off">
    </div>
  </section>

  <section class="panel">
    <div class="section-heading">
      <div><span class="step">03</span><h2>源列表</h2></div>
      <div class="inline-actions">
        <button id="enable-visible" class="text-button" type="button">启用当前结果</button>
        <button id="disable-visible" class="text-button" type="button">关闭当前结果</button>
      </div>
    </div>
    <div id="source-summary" class="source-summary"></div>
    <div id="source-list" class="source-list" aria-live="polite"></div>
  </section>

  <section class="panel output-panel">
    <div class="section-heading">
      <div><span class="step">04</span><h2>生成配置</h2></div>
      <span id="selection-count" class="selection-count">0 个源</span>
    </div>
    <div class="output-actions">
      <button id="download-config" class="primary-button" type="button">下载 dxplay.json</button>
      <button id="copy-config" class="secondary-button" type="button">复制 JSON</button>
      <button id="copy-default-url" class="secondary-button" type="button">复制默认配置 URL</button>
    </div>
    <details class="preview">
      <summary>预览生成内容</summary>
      <pre id="config-preview"></pre>
    </details>
    <p class="footnote">自定义组合需要下载或复制 JSON；固定分类配置可以直接使用 DXSrc 的公开 URL。</p>
  </section>

  <section class="preset-panel">
    <h2>固定分类 URL</h2>
    <p>适合直接粘贴到 DXPlay；内容会随 DXSrc 发布自动更新。</p>
    <div id="preset-links" class="preset-links"></div>
  </section>
</div>

<script src="{{ '/assets/js/app.js' | relative_url }}" defer></script>
