const titleWidget = {
    // 元数据
    metadata: {
        name: 'Title Widget',
        version: '1.0.0',
        description: 'Main title component for Web4 applications'
    },

    // HTML 模板
    html: [
        '<div class="title-section">',
        '    <h1 class="main-title">Web4 Application</h1>',
        '    <p class="subtitle">Built on decentralized storage</p>',
        '    <div class="features">',
        '        <div class="feature">',
        '            <span class="icon">⚡</span>',
        '            <span class="label">Fast</span>',
        '        </div>',
        '        <div class="feature">',
        '            <span class="icon">🔒</span>',
        '            <span class="label">Secure</span>',
        '        </div>',
        '        <div class="feature">',
        '            <span class="icon">🌐</span>',
        '            <span class="label">Decentralized</span>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join('\n'),

    // CSS 样式
    css: [
        '.title-section {',
        '    text-align: center;',
        '    padding: 80px 20px;',
        '    background: rgba(99, 102, 241, 0.05);',
        '    border-radius: 16px;',
        '    margin-bottom: 40px;',
        '}',
        '',
        '.main-title {',
        '    font-size: 4em;',
        '    font-weight: 700;',
        '    margin: 0 0 20px 0;',
        '    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);',
        '    -webkit-background-clip: text;',
        '    background-clip: text;',
        '    -webkit-text-fill-color: transparent;',
        '    letter-spacing: -0.02em;',
        '}',
        '',
        '.subtitle {',
        '    font-size: 1.5em;',
        '    color: #888;',
        '    margin: 0 0 40px 0;',
        '}',
        '',
        '.features {',
        '    display: flex;',
        '    justify-content: center;',
        '    gap: 40px;',
        '    flex-wrap: wrap;',
        '}',
        '',
        '.feature {',
        '    display: flex;',
        '    flex-direction: column;',
        '    align-items: center;',
        '    gap: 10px;',
        '}',
        '',
        '.feature .icon {',
        '    font-size: 2.5em;',
        '}',
        '',
        '.feature .label {',
        '    font-size: 1.1em;',
        '    color: #666;',
        '}',
        '',
        'body.light-theme .subtitle {',
        '    color: #666;',
        '}',
        '',
        '@media (max-width: 768px) {',
        '    .main-title {',
        '        font-size: 2.5em;',
        '    }',
        '    .subtitle {',
        '        font-size: 1.2em;',
        '    }',
        '}'
    ].join('\n'),

    // JavaScript 逻辑
    js: [
        'console.log("Title widget loaded successfully");'
    ].join('\n')
};

module.exports = { titleWidget };
