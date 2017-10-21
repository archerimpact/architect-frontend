export default {
	isLoading: true,
	savedLinks: {
		status: 'isLoading',
		links: [{url: 'https://www.google.com', label: 'Google'},
				{url: 'https://www.facebook.com', label: 'Facebook'}]
	},
	savedEntities: {
		status: 'isLoading',
		entities: [
			{id: 0, name: 'Alice Ma', type: 'Person', chips: ['Daryus Medora'], sources: [], projects: [0, 1], qid: ""}, 
			{id: 1, name: 'Daryus Medora', type: 'Person', chips: ['Alice Ma'], sources: [], projects: [0], qid: ""}, 
			{id: 2, name: 'Angelina Wang', type: 'Person', chips: ['Daryus Medora'], sources: [], projects: [1], qid: ""}, 
			]
	},
	savedSources: {
		status: 'isLoading',
		documents: [
			{id: 0, name: 'Business Registry #1', type: 'Primary Source', path: '', projects: [0, 1], qid: ""}, 
			{id: 1, name: 'Legal Case #1', type: 'Primary Source', path: '', projects: [0], qid: ""}, 
			],
		notes: [
			{id: 0, name: 'This is a note', type: 'Description', text: "Here's a lot of text", project: [0,1]}
			]
	},
	entityTypes: ["Company", "Person", "Location"],
	entityNames: ["Alice Ma", "Daryus Medora", "Angelina Wang"],
	projects: [
		{id: 0, title: 'Venezuela Sanctions 24 Aug 2017', owner: 'Anjali Banerjee', lastAction: 'No latest activity.', entities: [0, 1]},
		{id: 1, title: 'Syria Archive Project', owner: 'Haley', lastAction: 'No latest activity.', entities: [0, 2]}
		]

}