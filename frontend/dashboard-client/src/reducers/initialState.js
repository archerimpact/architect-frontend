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
			{id: 0, name: 'Alice Ma', type: 'Person', chips: ['Daryus Medora'], projects: [0, 1]}, 
			{id: 1, name: 'Daryus Medora', type: 'Person', chips: ['Alice Ma'], projects: [0]}, 
			{id: 2, name: 'Angelina Wang', type: 'Person', chips: ['Daryus Medora'], projects: [1]}, 
			]
	},
	entityTypes: ["Company", "Person", "Location"],
	entityNames: ["Alice Ma", "Daryus Medora", "Michael Murphy", "SCET"],
	projects: [
		{id: 0, title: 'Venezuela Sanctions 24 Aug 2017', owner: 'Anjali Banerjee', lastAction: 'No latest activity.', entities: [0, 1]},
		{id: 1, title: 'Syria Archive Project', owner: 'Haley', lastAction: 'No latest activity.', entities: [0, 2]}
		]

}