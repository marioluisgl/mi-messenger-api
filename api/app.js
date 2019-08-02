'use strict'

const bodyParser = require('body-parser');
const cors = require('cors');


class AppConfig{
    constructor(app){
		//dotenv.config();
		this.app = app;
    }
    
    includeConfig() {
      this.app.use(bodyParser.urlencoded({ extended: false}));
      this.app.use(bodyParser.json());
      this.app.use(cors({origin: true, credentials: true}));        
      //new expressConfig(this.app);
	}
}



module.exports = AppConfig;