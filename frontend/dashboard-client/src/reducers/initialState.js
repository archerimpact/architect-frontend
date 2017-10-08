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
			{name: 'Alice Ma', type: 'Person', chips: ['Daryus Medora', 'Ali Ahmed']}, 
			{name: 'Daryus Medora', type: 'Person', chips: ['Michael Murphy']}, 
			{name: 'Michael Murphy', type: 'Company', chips:['Alice Ma']},
			{name: 'SCET', type: 'Location', chips:['Alice Ma', 'Daryus Medora', 'Michael Murphy']},
			{name: 'Archer', type: 'Company', chips: ['Daryus Medora']},
			{name: 'Ali Ahmed', type: 'Person', chips: ['Archer']}
			]
	},
	entityTypes: ["Company", "Person", "Location"],
	entityNames: ["Alice Ma", "Daryus Medora", "Michael Murphy", "SCET"]
}