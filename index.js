(function (env) {
	var Gun;
	if(typeof module !== "undefined" && module.exports){ Gun = require('gun/gun') }
	if(typeof window !== "undefined"){ Gun = window.Gun }

	let globalOpt = {
		skipnull: true,
		log: false
	}

	module.exports = function(opt) {
		console.log(opt)
	    Object.assign(globalOpt, opt)
	}

    Gun.chain.load = function(cb, opt) {
        opt = Object.assign({}, globalOpt, opt)
        const gun = this
        const root = gun.back(-1)
        return this.val((obj, key) => {

            // if null or undefined (but shouldnt be able to be that, right ?).. skip it if opt allows
            if (obj == null && opt.skipnull) {
                if (opt.log) {
                    console.log('skipping null');
                }
                return
            }

            obj = Gun.obj.copy(obj);
            const queue = {}
            let doc
            let done

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
                    // dont send the document back yet / or again, we are either already done and have sent the doc, or are still waiting for it load completely
                    return
                }
                done = true;
                cb(doc, key)
            }

            expand(obj)
        })
    }
})()
