{
    const cache = new Map();

    function getAllProps() {
        let props = Object.getOwnPropertyNames(globalThis)
        props = props.concat(Object.getOwnPropertyNames(Object.prototype))
        if (globalThis?.Window?.prototype) {
            props = props.concat(Object.getOwnPropertyNames(Window.prototype))
        }
        if (globalThis?.EventTarget?.prototype) {
            props = props.concat(Object.getOwnPropertyNames(EventTarget.prototype))
        }
        return props;
    }

    function getAllPropsFromCache(obj) {
        let ownProps = cache.get(obj);
        if (!ownProps) {
            ownProps = Object.getOwnPropertyNames(obj);
            cache.set(obj, ownProps);
        }

        return ownProps;
    }

    function getAllProps(obj, props = []) {
        if (!obj) {
            return props;
        }

        props = [...props, ...getAllPropsFromCache(obj)];
        return getAllProps(Object.getPrototypeOf(obj), props);
    }

    function walk(start, cb) {
        for (let i = 0; i < props.length; i++) {
            const prop = props[i];
            const obj = start[prop];
            if (!obj) continue;
            walk(obj, cb);
        }
        cb(obj);
    }

    function prepareCB(tree = {}) {
        return function cb(path) {
            let subtree = tree;
            for (let i =  0; i < path.length; i++) {
                if (!subtree[path[i]]) {
                    subtree[path[i]] = path.length - 1 === i ? 0 : {value: path[i]};
                }
                subtree = subtree[path[i]];
            }
        }
    }

    function main(start) {
        // const tree = {};
        // const cb = prepareCB(tree);
        // walk(start, (obj) => {
        //     const proto = Object.getPrototypeOf(obj);
        //     const name = `${({}).toString.call(proto)}`;
        // });

        const tree = {};
        const cb = prepareCB(tree);
        const props = getAllProps(start);
        for (let i = 0; i < props.length; i++) {
            const prop = props[i];
            let obj = start[prop];
            const protos = [obj];
            while (true) {
                if (!obj) break;
                const proto = Object.getPrototypeOf(obj);
                if (!proto) break;
                protos.push(proto);
                obj = proto;
            }
            protos.reverse();
            cb(protos);
        }
        return tree;
    }

    (function(){
        const tree = main(window);
        console.log(tree);
        const treed = treeify.asTree(tree);
        console.log(treed);
    }());
}
