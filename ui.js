const ownNames = {};
function setOwns(span) {
    props.innerHTML = '<p><b><u><i>Own Property Names:</i></u></b> ' + ownNames[span.id] + '</p>';
}

onmessage = function (data) {
    let id = 0;

    function tree(node, obj, opts) {
        if (!obj) {
            if (!node.parentElement.querySelector('[found="true"]')) {
                node.parentElement.remove();
            }
        }
        for (const prop in obj) {
            if (prop === '_value_reference' || prop === '_own_names') continue;
            const val = obj[prop];
            id += 1;
            ownNames[val._value_reference] = val._own_names.join(', ');
            node.innerHTML += `<li><span onmouseover="setOwns(this)" id="${val._value_reference}" found="${includes(opts, prop, obj.value)}" class="tf-nc">${prop}</span><ul id="${'id' + id}"></ul></li>`;
            tree(node.querySelector('#' + 'id' + id), val, opts);
        }
        if (!node.parentElement?.querySelector('[found="true"]')) {
            node.parentElement?.remove();
        }
    }

    function opts(queryString) {
        const opts = {filters: []};
        const urlParams = new URLSearchParams(queryString);
        const filters = urlParams.get('filters');
        if (!filters) return opts;
        for (const filter of filters.split(',')) {
            const f = {not: false, filter};
            if (filter[0] === '!') {
                f.not = true;
                f.filter = filter.split('!').join('');
            }
            opts.filters.push(f);
        }
        return opts;
    }

    function getLayers(start) {
        const layers = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
            12: [],
        }
        const spans = start.querySelectorAll('span');
        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            let d = -1, s = span;
            while (s !== start) {
                d += 1;
                s = s.parentElement;
            }
            layers[d / 2].push(span);
        }
        return layers;
    }

    function prepareMenu(menu, layers, maxLevels = 12, maxItems = 10) {
        const div = document.createElement('div');
        const x = document.createElement('input');
        x.placeholder = 'jump to';
        x.onchange = () => shortcut(x.value);
        div.appendChild(x);
        div.append(' | ');
        for (const level in layers) {
            const layer = layers[level];
            if (!--maxLevels) break;
            if (layer.length > maxItems) continue;
            for (let i = 0; i < layer.length; i++) {
                const span = layer[i];
                const a = document.createElement('a');
                a.textContent = span.textContent;
                a.href = 'javascript:;';
                a.onclick = () => span.scrollIntoView({behavior: 'smooth'})
                div.appendChild(a);
                div.append(' | ');
            }
        }
        div.lastChild?.remove();
        menu.appendChild(div);
    }

    function includes(opts, prop) {
        // ignore filters query param
        if (prop.includes('filters=')) {
            return false;
        }
        prop = prop.split('filters=')[0].toLowerCase();
        // ignore adsense stuff
        if (
            prop.startsWith('__') ||
            prop.includes('google') ||
            prop.includes('amp') ||
            prop.includes('ggeac') ||
            prop.includes('default_')
        ) {
            return false;
        }
        if (!opts.filters.length) return true;
        for (const filter of opts.filters) {
            let found = false;
            if (prop.includes(filter.filter.toLowerCase())) {
                found = true;
            }
            if (filter.not) {
                found = !found;
            }
            if (found) {
                return true;
            }
        }
        return false;
    }

    function toJson(head, obj) {
        for (const child of head.children) {
            const span = child.firstChild;
            const prop = span?.firstChild?.textContent;
            if (prop) {
                obj[prop] = {};
                toJson(child.lastChild, obj[prop]);
            }
        }
    }

    function getButtonInners() {
        return `
<button id="btn" onclick="navigator.clipboard.writeText(JSON.stringify(top.json));">
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
        <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
        <path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
    </svg>
</button>
`;
    }

    function shortcut(text) {
        const xpath = `//a[contains(text(),"${text}")][@class="ofstart"]`;
        const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement?.parentElement) {
            setTimeout(() =>
                    matchingElement?.parentElement.scrollIntoView({behavior: 'smooth'}),
                0);
        }
    }

    if (!data.data.result) return;
    const root = top.root = JSON.parse(data.data.result);
    const json = top.json = {};
    const e = document.createElement('ul');
    tree(e, root, opts(window.location.search));
    Array.from(e.querySelectorAll('ul')).filter(a=>!a.children.length).forEach(u=>u.remove());
    toJson(e, json);
    console.log('%c👀 Observe full live tree representing the full prototype chain:', 'color:deepskyblue');
    console.log('<top.root>', root);
    console.log('%c👀 Observe the filtered tree as a jsonable object:', 'color:deepskyblue');
    console.log('<top.json>', json);
    console.log('%c👀 Observe the filtered tree visually', 'color:deepskyblue');
    console.log(treeify.asTree(json));
    console.log('%c👆🏻 Begin at the top of the console 👆🏻', 'color:deepskyblue');
    const element = start;
    element.innerHTML = getButtonInners();
    if (!!JSON.parse(localStorage.full_screen)) element.style.height = '80%';
    element.appendChild(e);
    element.setAttribute('class', 'tf-tree');
    e.innerHTML = e.innerHTML
        .split('function').join('<xxx class="function">function</xxx>');
    const layers = getLayers(element);
    prepareMenu(menu, layers, 6, 30);
    document.querySelectorAll('.tf-nc').forEach(span => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('filters', span.textContent);
        const url = location.href.split('?')[0] + '?' + searchParams.toString();
        span.innerHTML = `<a class="ofstart" href="${url}">${span.innerHTML}</a>`;
    });
};