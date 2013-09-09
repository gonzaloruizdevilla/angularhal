var HalModels = {};
HalModels.simple_model = {
	_links: {
	  self: {
	    href: '/example'
	  },
	  eg: {
	    href: '/boo'
	  }
	},
	_embedded: {
	  foo: {
	    _links: {
	      self: {
	        href: '/embedded'
	      }
	    },
	    foo_prop: 'foo_val'
	  }
	},
	prop: 'val',
	other_prop: 'other_val'
};