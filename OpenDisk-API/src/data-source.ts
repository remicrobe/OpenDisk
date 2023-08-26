import { DataSource } from "typeorm"
import config from './loadconfig'
console.log(config)

export const AppDataSource = new DataSource({
    type: "mysql", 
    host: config.DBHOST,
    port: 3306,
    username: config.DBUSER,
    password: config.DBPASSWORD,
    database: config.DBNAME,
    entities: ["src/entity/**/*.ts"],
    logging: true,
    synchronize: true
})
 