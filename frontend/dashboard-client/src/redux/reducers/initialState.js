export default {
	user: {
		isAuthenticated: false,
	},
	isLoading: true,
	savedEntities: {
		status: 'isLoading',
		entities: [
			]
	},
  pendingEntities: {
    status: 'isLoading',
    entities: [
    ]
  },
	savedSources: {
		status: 'isLoading',
		documents: []
	},
	savedVertices: {
		status: 'isLoading',
		vertices: []
	},
  savedConnections: {
    status: 'isLoading',
    connections: []
  },
  savedGraphs: {
    status: 'isLoading',
    connections: []
  },
	entityTypes: [],
	entityNames: [],
	projects: [
	],
	savedProjects: {
		status: 'isLoading',
    projects: []
	},
  currentProject: {_id: 0, name: "Sample"}
}