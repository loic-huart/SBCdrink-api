mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Ingredient --file ./seeder/data/ingredients.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Recipe --file ./seeder/data/recipes.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Order --file ./seeder/data/orders.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Machineconfiguration --file ./seeder/data/machineconfigurations.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection File --file ./seeder/data/files.json --jsonArray
cp -r ./seeder/uploads ./public