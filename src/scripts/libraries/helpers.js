/******************************************************
 *                    Create Element                  *
 ******************************************************/
self.create = (tag, classname=null, content=null, attrs={}) => {
    const elm = document.createElement(tag);
    if(classname) elm.className = classname;
    if(content) elm.innerHTML = content;
	Object.entries(attrs).forEach(a => elm.setAttribute(a[0], a[1]));
    return elm;
}
HTMLElement.prototype.create = function(tag, classname=null, content=null, attrs={}) {
    const elm = create(tag, classname, content, attrs);
    this.append(elm);
    return elm;
}


/******************************************************
 *               DOMDocument async loaded             *
 ******************************************************/
self.documentReady = function(clb = null) {
	return new Promise((res) => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async () => {
				if(clb) res(clb());
				else res(true);
			}, { once: true });
		} else {
			if(clb) res(clb());
			else res(true);
		}
	});
}


/******************************************************
 *             Body lock while working/busy           *
 ******************************************************/
self.busy = async (promise) => {
	document.documentElement.classList.add('is-busy');	
	const results = await Promise.allSettled(typeof promise == 'array' ? promise : [promise]);
	document.documentElement.classList.remove('is-busy');
	return typeof promise == 'array' ? results : results[0];
};
self.working = async (promise) => {
	document.documentElement.classList.add('is-working');	
	const results = await Promise.allSettled(typeof promise == 'array' ? promise : [promise]);
	document.documentElement.classList.remove('is-working');
	return typeof promise == 'array' ? results : results[0];
};


/******************************************************
 *               Dynamic Script Loading               *
 ******************************************************/
self.loadScript = function(endpoint, params = {}, isAsync = true) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        const script = document.createElement('script');
        script.src = url.toString();
        script.async = isAsync;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Échec du chargement du script : ${url}`));
        document.head.appendChild(script);
    });
};