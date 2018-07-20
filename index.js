const { createLogger, format, transports } = require(`winston`);
const request = require(`request-promise`);
const aws = require(`aws-sdk`);

const logger = createLogger({
    level: `info`,
    format: format.printf(info => `${info.level.toUpperCase()}: ${info.message}`),
    transports: [new transports.Console()]
});

exports.handler = async(event, context, callback) => {
    let down = [];
    
    for(let i = 0; i < event.sites.length; i++){
        await request.get(`http://${event.sites[i]}/healthcheck`).then(
            res => logger.info(`SUCCESS ${event.sites[i]}`),
            err => {
                logger.info(`FAILURE ${event.sites[i]} - ${err.statusCode}`);
                down.push(event.sites[i]);
            }
        );
    }
    
    if(down.length > 0){
        let sns = new aws.SNS();
        sns.publish({
            Subject: `HealthCheck Report`,
            Message: `HealthCheck found the following sites are offline:\n\n${down.join("\n")}`,
            TopicArn: process.env.TOPIC_ARN
        }, (err, res) => {
            if(err){
                logger.error(`Error publishing to SNS: ${err}`);
            }
        });
    }

    logger.info("Finished, returning results");
    callback(null, down);
};
