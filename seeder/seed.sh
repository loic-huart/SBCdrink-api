mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Ingredient --file ./seeder/data/ingredient.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Recipe --file ./seeder/data/recipe.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection RecipeStep --file ./seeder/data/recipeStep.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Order --file ./seeder/data/order.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection OrderStep --file ./seeder/data/orderStep.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Machineconfiguration --file ./seeder/data/machineconfiguration.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection File --file ./seeder/data/file.json --jsonArray
mongoimport --uri mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME --authenticationDatabase=admin --db $DB_NAME --collection Setting --file ./seeder/data/setting.json --jsonArray
cp -r ./seeder/uploads ./public