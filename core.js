(function(){
    function begin() {
        function isPrimitive(v) {
            if (null === v || undefined === v) {
                return true;
            }
            if (['boolean', 'number', 'string'].includes(typeof v)) {
                return true;
            }
            return false;
        }

        // because of adsense
        function isFrame(v) {
            let i = 0;
            let w;
            while (w) {
                w = top[i];
                if (v === w) {
                    return true;
                }
                i++;
            }
        }

        const root = {};
        const values = {};

        function cb(path) {
            let node = root;
            for (let i = 0; i < path.length; i++) {
                const val = path[i];
                const prop = getProp(val);
                if (!node[prop]) {
                    id += 1;
                    values['b' + id] = val;
                    node[prop] = {
                        _value_reference: 'vf' + id,
                        _own_names: Object.getOwnPropertyNames(val),
                    };
                }
                node = node[prop];
            }
        }

        function getProp(val) {
            switch (val) {
                case Symbol.prototype:
                    return 'Symbol';
                case Number.prototype:
                    return 'Number';
                case Array.prototype:
                    return 'Array';
                case Boolean.prototype:
                    return 'Boolean';
                case String.prototype:
                    return 'String';
                default:
                    let v = '';
                    try {
                        if (typeof val === 'symbol') {
                            v = val.toString();
                        } else if (typeof val === 'function') {
                            v = Function.prototype.toString.call(val);
                        } else {
                            v += val;
                        }
                        if ((v).startsWith('data:text/html;Base64,')) {
                            return '[location]';
                        }
                        return v
                            .split('[object ').join('')
                            .split('{ [native code] }').join('')
                            .split(']').join('')
                            .split('\n').join('');
                    } catch (e) {
                        return ({}).toString.call(val).split('[object ').join('').split(']').join('');
                    }
            }
        }

        function main(obj) {
            if (isPrimitive(obj) || isFrame(obj)) return;
            const protos = [obj];
            while (true) {
                if (isPrimitive(obj) || isFrame(obj)) break;
                const proto = Object.getPrototypeOf(obj);
                if (!proto) break;
                protos.push(proto);
                obj = proto;
            }
            protos.reverse();
            cb(protos);
        }

        let id = 0;

        (function () {
            const lt = new LavaTube(main, {
                onShouldIgnoreError: (p, o, e) => {
                    // console.error('sync error in LavaTube:', e);
                    return true;
                },
                maxRecursionLimit: 9,
            });
            window.LavaTube = undefined;
            window.begin = undefined;
            lt.walk(window);
            const result = JSON.stringify(root);
            setTimeout(() => {
                window.values = values;
                top.postMessage({result}, '*');
                console.log(`%c${decodeURIComponent(escape(window.atob('8J+Xuu+4jw==')))} Map each entry in the full tree below to its real actual object in runtime:`, 'color:deepskyblue');
                console.log('<generator.contentWindow.values>', values);
            }, 100);
        }());
    }
    document.write(`
<ifram`+`e id="generator" style="display: none" src="data:text/html;Base64,${
        btoa(
            atob('PGh0bWw+PGhlYWQ+PHNjcmlwdCBzcmM9Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGxhdmFtb2F0L2xhdmF0dWJlL2xhdmF0dWJlLmpzIj48L3NjcmlwdD48L2hlYWQ+PGJvZHk+PHNjcmlwdD4=') +
            begin.toString() + ';' + 'begin();' +
            atob('PC9zY3JpcHQ+PC9ib2R5PjwvaHRtbD4=')
        )
    }"></if`+`rame>
`);
}())
