var dbConfig = {
	synchronize: false,
};

switch (process.env.NODE_ENV) {
	case 'development':
		Object.assign(dbConfig, {
			type: 'sqlite',
			database: 'db.sqlite',
			entities: ['**/*.entity.js'],
		});
		break;
	case 'production':
		break;
	case 'test':
		Object.assign(dbConfig, {
			type: 'sqlite',
			database: 'test.sqlite',
			entities: ['**/*.entity.ts'],
		});
		break;
	default:
		throw new Error('Unknown environment');
}

module.exports = dbConfig;
