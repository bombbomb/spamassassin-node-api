var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var spamdLib    = require('node-spamd');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/evaluate', function(request, response) {
    var spamd = new spamdLib('noreply@example.com' /* sender */, 'noreply@example.com' /* receiver */, 'spamassassin' /* host */, 783 /* port */);

    var subject = request.body.subject;
    var message = request.body.body;

    if (validateRequest(subject, message)) {
        spamd.evaluate(subject, message, function (result, error) {
            if (error) {
                response.send(error);
            } else {
                response.send(JSON.stringify(result));
            }
        });
    } else {
        var invalidRequest = {};
        invalidRequest.error = "Invalid Request. Failed to parse message.";

        response.send(JSON.stringify(invalidRequest));
    }
});

// Nothing too fancy here. Should try and weed out bad requests as the call to spam assassin can be expensive.
function validateRequest(subject, message)
{
    if (!subject || !message)
        return false;
    return true;
}


app.listen(80);
