/*
    Setup for a simple web app
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 59306;                 // Set a port number at the top so it's easy to change in the future


//Database
var db = require('./database/db-connector.js')


// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Static Files
app.use(express.static('public'));



/***************************************************************
*                     GET ROUTES                               *
***************************************************************/
app.get('/', function (req, res) {
    res.render('index',);
});

app.get('/JobSites', function (req, res) {
    let query1 = "SELECT * FROM JobSites;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('JobSites', { data: rows });
    })
});

app.get('/Tasks', function (req, res) {
    let query1 = "SELECT * FROM Tasks;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('Tasks', { data: rows });
    })
});


/***************************************************************
*                     POST ROUTES                               *
***************************************************************/
app.post('/add_JobSite-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let zipcode = parseInt(data.JobZipcode);
    if (isNaN(zipcode)) {
        zipcode = 'NULL'
    }

    let jobcost = parseFloat(data.JobCost);
    if (isNaN(jobcost)) {
        jobcost = 'NULL'
    }

    let jobbudget = parseFloat(data.JobBudget);
    if (isNaN(jobbudget)) {
        jobbudget = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO JobSites (JobAddress, JobZipcode, JobDescription, JobStart, JobCompleted, JobCost, JobBudget) VALUES (
        '${data.JobAddress}', ${zipcode}, '${data.JobDescription}', '${data.JobStart}', '${data.JobCompleted}', ${jobcost}, ${jobbudget})`;
    db.pool.query(query1, function (error, rows, fields) {


        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM JobSites;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});


/***************************************************************
*                     UPDATE ROUTES                            *
***************************************************************/
app.put('/put-JobSites-ajax', function (req, res, next) {
    let data = req.body;

    let jobSiteID = parseInt(data.JobsiteID);
    let address = data.JobAddress;
    let zipCode = parseInt(data.JobZipcode);
    let description = data.JobDescription;
    let startDate = data.JobStart;
    let endDate = data.JobCompleted;
    let jobCost = parseFloat(data.JobCost);
    let jobBudget = parseFloat(data.JobBudget);

    let queryUpdateJobSites = `UPDATE JobSites SET JobAddress = ?, JobZipcode= ?, JobDescription = ?, JobStart= ?, JobCompleted = ?, JobCost = ?, JobBudget = ? WHERE JobSiteID= ?`;
    let selectJobSite = `SELECT * FROM JobSites WHERE JobSiteID = ?`

    //'${data.JobAddress}', ${zipcode}, '${data.JobDescription}', '${data.JobStart}', '${data.JobCompleted}', ${jobcost}, ${jobbudget})`;

    // Run the 1st query
    db.pool.query(queryUpdateJobSites, [address, zipCode, description, startDate, endDate, jobCost, jobBudget, jobSiteID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectJobSite, [jobSiteID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});




/***************************************************************
*                     DELETE ROUTES                            *
***************************************************************/
app.delete('/delete-JobSite-ajax/', function (req, res, next) {
    let data = req.body;
    let jobSiteID = parseInt(data.JobSiteID);
    let delete_JobSite = `DELETE FROM JobSites WHERE JobSiteID = ?`;
    let delete_JobSite_Tasks = `DELETE FROM Tasks WHERE JobSiteID = ?`;

    // Run the 1st query
    db.pool.query(delete_JobSite, [jobSiteID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }

        else {
            /*
            // Run the second query
            db.pool.query(delete_JobSite, [JobSiteID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    */
            res.sendStatus(204);
        }
        //    })
        //}
    })
});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});