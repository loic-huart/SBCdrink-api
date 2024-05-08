mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection ingredients --file ./seeder/data/ingredients.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection recipes --file ./seeder/data/recipes.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection orders --file ./seeder/data/orders.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection machineconfigurations --file ./seeder/data/machineconfigurations.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection files --file ./seeder/data/files.json --jsonArray
cp -r ./seeder/uploads ./public