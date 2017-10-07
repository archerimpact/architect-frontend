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
			{name: 'Alice Ma', type: 'Person', chips: ['Daryus Medora']}, 
			{name: 'Daryus Medora', type: 'Person', chips: ['Michael Murphy']}, 
			{name: 'Michael Murphy', type: 'Company', chips:['Alice Ma']},
			{name: 'SCET', type: 'Location', chips:['Alice Ma', 'Daryus Medora']}
			]
	},
	entityTypes: ["Company", "Person", "Location"]
}