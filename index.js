

(function (env) {
	var Gun;
	if(typeof module !== "undefined" && module.exports){ Gun = require('gun/gun') }
	if(typeof window !== "undefined"){ Gun = window.Gun }

    Gun.chain.load = function(cb) {

        console.log(this);
        const gun = this
        return this.val(obj => {

            console.log('hello');
            obj = Gun.obj.copy(obj);
            const start = Date.now()
            const queue = {}
            let doc

            function expand(o) {
                console.log('expand');
                if (!doc) {
                    doc = o
                }
                Gun.obj.map(o, (val, prop) => {
                    const soul = Gun.val.rel.is(val)
                    if (soul) {
                        queue[soul] = true
                        console.log('found soul, lets expand', soul);
                        setTimeout(()=> {
                            queue[soul] = false
                            console.log('TIMEOUT');
                        }, 1000)
                        gun.get(soul).val(loadedValue => {
                            console.log('expanded');
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
                if (wait) {
                    console.log('wait');
                    // dont send the document back yet, we are still waiting for it load completely
                    return
                }
                console.log('done ?');
                if (done) { return }
                done = true;
                cb(doc)
            }

            expand(obj)
        })
    }
}());






















//
