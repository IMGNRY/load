(function (env) {
	var Gun;
	if(typeof module !== "undefined" && module.exports){ Gun = require('gun/gun') }
	if(typeof window !== "undefined"){ Gun = window.Gun }

    Gun.chain.load = function(cb) {
        const gun = this, root = gun.back(-1)
        return this.val((obj, key) => {

            obj = Gun.obj.copy(obj);
            //const start = Date.now()
            const queue = {}
            let doc, done

            function expand(o) {
                if (!doc) {
                    doc = o
                }
                Gun.obj.map(o, (val, prop) => {
                    const soul = Gun.val.rel.is(val)
                    if (soul) {
                        queue[soul] = true
                        root.get(soul).val(loadedValue => {
                            queue[soul] = false
                            loadedValue = Gun.obj.copy(loadedValue)
                            o[prop] = loadedValue
                            expand(loadedValue)
                        })
                        return
                    }

                    // if it doesnt have a soul, just attach the value as is
                    o[prop] = val
                })
                const wait = Gun.obj.map(queue, wait => {
                    if (wait) {
                        return true
                    }
        		});
                if (done || wait) {
                    // dont send the document back yet, we are still waiting for it load completely
                    return
                }
                done = true;
                cb(doc, key)
            }

            expand(obj)
        })
    }
}());
