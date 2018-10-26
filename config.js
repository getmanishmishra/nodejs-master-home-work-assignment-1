/**
 * @author mmishra
 * @email mm62810@yahoo.com
 * @create date 2018-10-26 15:48:07
 * @modify date 2018-10-26 15:48:07
 * @desc [description]
*/

/**
 * Create and export server configuration variables
 */

 //Create general containers for all environments
 var environments = {};
 
 //Staging (default) environment

 environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
 };

 //production environment

 environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production'
};


//Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase():'';

//Check that current environment is one of the environment above. if not, default to staging

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


//Export the module
module.exports = environmentToExport;
