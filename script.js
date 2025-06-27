function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

function renderGraphList() {
    const ul = document.getElementById('graph-list');
    if (!ul) return;
    ul.innerHTML = '';
    Object.entries(graphs).forEach(([name, [code]]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        console.log(code, name);
        a.textContent = name;
        a.href = `?name=${encodeURIComponent(name)}`;
        li.appendChild(a);
        ul.appendChild(li);
    });
}

function renderIframeIfNeeded() {
    const name = getQueryParam('name');
    const header = document.querySelector('h1');
    const ul = document.getElementById('graph-list');
    const container = document.getElementById('iframe-container');
    container.innerHTML = '';
    // Remove any existing back button
    let backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.remove();
    // If no name param or invalid name, show list and header, hide title
    if (!name || !(name in graphs)) {
        if (header) header.style.display = '';
        if (ul) ul.style.display = '';
        // Remove any existing title
        const oldTitle = document.getElementById('graph-title');
        if (oldTitle) oldTitle.remove();
        return;
    }
    // Hide list and header
    if (header) header.style.display = 'none';
    if (ul) ul.style.display = 'none';
    // Add back button
    backBtn = document.createElement('button');
    backBtn.id = 'back-btn';
    backBtn.textContent = '← Back';
    backBtn.style = 'position: absolute; top: 16px; left: 16px; font-size: 1rem; padding: 6px 14px; cursor: pointer;';
    backBtn.onclick = () => {
        window.location.search = '';
    };
    document.body.appendChild(backBtn);
    // Show graph title
    const [code, width, height] = graphs[name];
    let title = document.getElementById('graph-title');
    if (!title) {
        title = document.createElement('h2');
        title.id = 'graph-title';
        title.style = 'text-align: center;';
        container.parentNode.insertBefore(title, container);
    }
    title.textContent = name;
    // Show iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.desmos.com/calculator/${code}?embed`;
    iframe.title = name;
    iframe.style = `border: 1px solid #ccc; width: ${width}; height: ${height}`;
    container.appendChild(iframe);
}

let graphs = {};
fetch('https://api.github.com/gists/f2942b939c3f94814f8f5011b1eb0939').then(r => {
    r.json().then(data => {
        graphs = JSON.parse(data["files"]["desmosgraphs.json"]["content"]);
        console.log(graphs)
        renderGraphList();
        renderIframeIfNeeded();
    })
})
