var HalModels = {};
HalModels.simple_model = {
	_links: {
	  self: {
	    href: '/example'
	  },
	  eg: {
	    href: '/boo'
	  },
      orders: {
        href : '/orders',
      },
      order: {
        href : '/orders/{id}',
        templated : true
      },
      orderRow: {
        href : '/orders/{id}/rows/{rowId}',
        templated : true
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

HalModels.updated_simple_model = {
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
	prop: 'val2',
	other_prop: 'other_val2'
};