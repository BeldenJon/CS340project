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
    let query1 = `SELECT JobSiteID, JobAddress, JobZipcode, JobDescription, DATE_FORMAT(JobStart, '%Y-%m-%d') as Date_Start, DATE_FORMAT(JobCompleted, '%Y-%m-%d') as Date_Complete, JobCost, JobBudget FROM JobSites;`;

    db.pool.query(query1, function (error, rows, fields) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].Date_Complete == "0000-00-00") {
                rows[i].Date_Complete = "";
            }
        }
        res.render('JobSites', { data: rows });
    })
});


app.get('/Tasks', function (req, res) {
    let query1;
    if (req.query.jobsite === undefined) {
        query1 = `SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as Paid From Tasks
        LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
        LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
        LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
        LEFT JOIN JobSites ON JobSites.JobSiteID = Tasks.JobSiteID
        ORDER BY JobsiteID, TaskSeq;`;
    } else {
        query1 = `SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as Paid From Tasks
        LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
        LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
        LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
        LEFT JOIN JobSites ON JobSites.JobSiteID = Tasks.JobSiteID
        WHERE JobSites.JobAddress LIKE "%${req.query.jobsite}%"
        ORDER BY JobsiteID, TaskSeq;`;
    }
    let query2 = "SELECT JobSiteID, JobAddress FROM JobSites;";
    let query3 = `SELECT ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade" FROM  ContractorsTrades
                    INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
                    INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
                    ORDER BY Contractors.BusinessName ASC; `;
    db.pool.query(query1, function (error, rows, fields) {
        let tasks = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let jobs = rows;
            db.pool.query(query3, function (error, rows, fields) {
                let contrTrades = rows;
                for (let i = 0; i < tasks.length; i++) {
                    tasks[i].Paid = tasks[i].Paid == 0 ? "NO" : "YES";
                    if (tasks[i].Due_Date == "0000-00-00") {
                        tasks[i].Due_Date = "";
                    }
                }
                res.render('Tasks', { data: tasks, jobs: jobs, contrTrades: contrTrades });
            })
        })
    })
});


app.get('/Contractors', function (req, res) {
    let query1 = "SELECT * FROM Contractors;";

    db.pool.query(query1, function (error, rows, fields) {
        res.render('Contractors', { data: rows });
    })
});


app.get('/Trades', function (req, res) {
    let query1 = "SELECT * FROM Trades;";

    db.pool.query(query1, function (error, rows, fields) {
        res.render('Trades', { data: rows });
    })
});


app.get('/ContractorsTrades', function (req, res) {
    let query1;
    //console.log(req.query.trade);
    if (req.query.trade === undefined) {
        query1 = `SELECT ContractorTradeID, Contractors.ContractorID, Contractors.BusinessName, Trades.TradeID, Trades.TradeName, ContractorTradesNotes, CAST(ActiveTrade as INT) AS ActiveTrade FROM ContractorsTrades
                    INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
                    INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
                    ORDER BY Contractors.BusinessName, Trades.TradeName;`;
    } else {
        query1 = `SELECT ContractorTradeID, Contractors.ContractorID, Contractors.BusinessName, Trades.TradeID, Trades.TradeName, ContractorTradesNotes, CAST(ActiveTrade as INT) AS ActiveTrade FROM ContractorsTrades
                    INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
                    INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
                    WHERE Trades.TradeName LIKE "${req.query.trade}%"
                    ORDER BY Contractors.BusinessName;`;
    }
    let query2 = "SELECT ContractorID, BusinessName FROM Contractors;";
    let query3 = "SELECT TradeID, TradeName FROM Trades;";

    db.pool.query(query1, function (error, rows, fields) {
        let ContractorTrades = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let contractors = rows;
            db.pool.query(query3, function (error, rows, fields) {
                let trades = rows;
                for (let i = 0; i < ContractorTrades.length; i++) {
                    ContractorTrades[i].ActiveTrade = parseInt(ContractorTrades[i].ActiveTrade) == 0 ? "NO" : "YES";
                }
                res.render('ContractorsTrades', { data: ContractorTrades, Contractor: contractors, Trade: trades });
            })
        })
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
            query2 = `SELECT JobSiteID, JobAddress, JobZipcode, JobDescription, DATE_FORMAT(JobStart, '%Y-%m-%d') as JobStart, DATE_FORMAT(JobCompleted, '%Y-%m-%d') as JobCompleted, JobCost, JobBudget FROM JobSites;`;
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


app.post('/add_Task-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let jobSite = parseInt(data.JobSiteID);

    let seq = parseInt(data.TaskSequence);
    if (isNaN(seq)) { seq = 'NULL' }

    let contTrade = parseInt(data.ContractorTradeID);
    if (isNaN(contTrade)) { contTrade = 'NULL' }

    let percent = parseInt(data.TaskPercentComplete);
    if (isNaN(percent)) { percent = 'NULL' }

    let cost = parseFloat(data.TaskCostEstimate);
    if (isNaN(cost)) { cost = 'NULL' }

    let billed = parseFloat(data.TaskCostBilled);
    if (isNaN(billed)) { billed = 'NULL' }

    let paid = parseInt(data.TaskCostPaid);

    // Create the query and run it on the database
    query1 = `INSERT INTO Tasks (JobSiteID, TaskDescription, TaskSequence, TaskStart, TaskEnd, ContractorTradeID, TaskPercentComplete, TaskCostEstimate, TaskCostBilled, PaymentDueDate, TaskCostPaid) 
        VALUES (${jobSite}, '${data.TaskDescription}', ${seq}, '${data.TaskStart}', '${data.TaskEnd}', ${contTrade}, ${percent}, ${cost}, ${billed}, '${data.PaymentDueDate}', ${paid})`;
    db.pool.query(query1, function (error, rows, fields) {


        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no errors, SELECT of all columns in the HTML table to fill table.
            query2 = `SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
                        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
                        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as 'Paid' From Tasks
                            LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
                            LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
                            LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
                            LEFT JOIN JobSites ON Tasks.JobSiteID = JobSites.JobSiteID;`;
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


app.post('/add_Contractor-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Contractors (LicenseNumber, FirstName, LastName, BusinessName, ContactPhone, ContactEmail) 
            VALUES ('${data.LicenseNumber}', '${data.FirstName}', '${data.LastName}', '${data.BusinessName}', '${data.ContactPhone}', '${data.ContactEmail}')`;

    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error return the data to add_contractors.js to be added to table
            query2 = `SELECT * FROM Contractors;`;
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


app.post('/add_Trade-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let tradename = data.TradeName;
    if (tradename == "") {
        tradename = 'NULL';
        return false;
    }

    let tradedesc = data.TradeDescription;
    if (tradedesc == "") {
        tradedesc = 'NULL';
        return false;
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Trades (TradeName, TradeDescription)
    VALUES ('${data.TradeName}', '${data.TradeDescription}')`;

    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error return the data to add_trades.js to be added to table
            query2 = `SELECT * FROM Trades;`;
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



app.post('/add_ContractorTrade-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let contID = parseInt(data.ContractorID);
    let tradeID = parseInt(data.TradeID);
    let active = parseInt(data.ActiveTrade);

    // Create the query and run it on the database
    query1 = `INSERT INTO ContractorsTrades (ContractorID, TradeID, ActiveTrade, ContractorTradesNotes) VALUES (${contID}, ${tradeID}, ${active}, '${data.ContractorTradesNotes}')`;

    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error return the data to add_contractors.js to be added to table
            query2 = `SELECT ContractorTradeID, Contractors.ContractorID, Contractors.BusinessName, Trades.TradeID, Trades.TradeName, CAST(ActiveTrade AS INT) AS ActiveTrade, ContractorTradesNotes FROM ContractorsTrades
                        INNER JOIN Contractors On ContractorsTrades.ContractorID = Contractors.ContractorID
                        INNER JOIN Trades ON ContractorsTrades.TradeID = Trades.TradeID
                        ORDER BY ContractorTradeID;`;
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
    let selectJobSite = `SELECT JobSiteID, JobAddress, JobZipcode, JobDescription, DATE_FORMAT(JobStart, '%Y-%m-%d') as JobStart, DATE_FORMAT(JobCompleted, '%Y-%m-%d') as JobCompleted, JobCost, JobBudget FROM JobSites WHERE JobSiteID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateJobSites, [address, zipCode, description, startDate, endDate, jobCost, jobBudget, jobSiteID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return all the data so we can use it to update the JobSites table on the front-end
        else {
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


app.put('/put-Task-ajax', function (req, res, next) {
    let data = req.body;

    let taskID = parseInt(data.TaskID)
    let jobSiteID = parseInt(data.JobSiteID);
    let description = data.TaskDescription;
    let sequence = parseInt(data.TaskSequence);
    let start = data.TaskStart;
    let end = data.TaskEnd;
    let contTradeID = parseInt(data.ContractorTradeID);
    if (isNaN(contTradeID)) {
        contTradeID = null;
    }
    let percent = parseInt(data.TaskPercentComplete);
    let costEstimate = parseFloat(data.TaskCostEstimate);
    let costBilled = parseFloat(data.TaskCostBilled);
    let paymentDate = data.PaymentDueDate;
    let paid = parseInt(data.TaskCostPaid);
    if (isNaN(paid)) { paid = 0 }

    let queryUpdateTask = `UPDATE Tasks SET JobSiteID = ?, TaskDescription= ?, TaskSequence = ?, TaskStart= ?, TaskEnd = ?, ContractorTradeID = ?, TaskPercentComplete = ?, TaskCostEstimate = ?, TaskCostBilled = ?, PaymentDueDate = ?, TaskCostPaid = ? WHERE TaskID= ?`;
    let selectTasks = `SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
                        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
                        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as Paid From Tasks
                            LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
                            LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
                            LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
                            LEFT JOIN JobSites ON Tasks.JobSiteID = JobSites.JobSiteID
                            WHERE TaskID = ?;`;
    // Run the 1st query
    db.pool.query(queryUpdateTask, [jobSiteID, description, sequence, start, end, contTradeID, percent, costEstimate, costBilled, paymentDate, paid, taskID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, run our second query and return the data so we can use it to update the Tasks table on the front-end
        else {
            db.pool.query(selectTasks, [taskID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    //console.log(rows);
                    res.send(rows);
                }
            })
        }
    })
});


app.put('/put-Contractor-ajax', function (req, res, next) {
    let data = req.body;

    let contractorID = parseInt(data.ContractorID);
    let lic = data.LicenseNumber;
    let first = data.FirstName;
    let last = data.LastName;
    let business = data.BusinessName;
    let phone = data.ContactPhone;
    let email = data.ContactEmail;

    let queryUpdateContractor = `UPDATE Contractors SET LicenseNumber= ?, FirstName = ?, LastName= ?, BusinessName =  ?, ContactPhone = ?, ContactEmail = ? WHERE ContractorID= ?`;
    let selectContractor = `SELECT * FROM Contractors WHERE ContractorID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateContractor, [lic, first, last, business, phone, email, contractorID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return all the data so we can use it to update the JobSites table on the front-end
        else {
            db.pool.query(selectContractor, [contractorID], function (error, rows, fields) {
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


app.put('/put-Trade-ajax', function (req, res, next) {
    let data = req.body;

    let tradeID = parseInt(data.TradeID);
    let tradename = data.TradeName;
    let tradedesc = data.TradeDescription;

    // Capture NULL values
    if (tradename == "") {
        tradename = 'NULL';
        return false;
    }

    if (tradedesc == "") {
        tradedesc = 'NULL';
        return false;
    }

    let queryUpdateTrade = `UPDATE Trades SET TradeName = ?, TradeDescription = ? WHERE TradeID= ?`;
    let selectTrade = `SELECT * FROM Trades WHERE TradeID = ?`

    // Run the 1st query
    db.pool.query(queryUpdateTrade, [tradename, tradedesc, tradeID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return all the data so we can use it to update the Trades table on the front-end
        else {
            db.pool.query(selectTrade, [tradeID], function (error, rows, fields) {
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


app.put('/put-ContractorTrade-ajax', function (req, res, next) {
    let data = req.body;

    let contractorTradeID = parseInt(data.ContractorTradeID);
    let notes = data.ContractorTradesNotes;
    let active = parseInt(data.ActiveTrade);
    if (isNaN(active)) {
        active = "0"
    };

    let queryUpdateContractorTrades = `UPDATE ContractorsTrades SET ActiveTrade= ?, ContractorTradesNotes = ? WHERE ContractorTradeID= ?`;
    let selectContractorTrade = `SELECT ContractorTradeID, CAST(ActiveTrade AS INT) as ActiveTrade, ContractorTradesNotes FROM ContractorsTrades
                                    WHERE ContractorTradeID = ?;`;

    // Run the 1st query
    db.pool.query(queryUpdateContractorTrades, [active, notes, contractorTradeID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return all the data so we can use it to update the JobSites table on the front-end
        else {
            db.pool.query(selectContractorTrade, [contractorTradeID], function (error, rows, fields) {
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

    // Run the query
    db.pool.query(delete_JobSite, [jobSiteID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-Task-ajax/', function (req, res, next) {
    let data = req.body;
    let taskID = parseInt(data.TaskID);
    let delete_Task = `DELETE FROM Tasks WHERE TaskID = ?`;
    // Run the 1st query
    db.pool.query(delete_Task, [taskID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


app.delete('/delete-Contractor-ajax/', function (req, res, next) {
    let data = req.body;
    let ContractorID = parseInt(data.ContractorID);
    let delete_Contractor = `DELETE FROM Contractors WHERE ContractorID = ?`;
    // Note that the on Cascade ON Delete deletes from the ContractorsTrades table and 
    // Cascade Set NULL sets the ContractorTradeID in Tasks table to Null
    db.pool.query(delete_Contractor, [ContractorID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


app.delete('/delete-Trade-ajax/', function (req, res, next) {
    let data = req.body;
    let TradeID = parseInt(data.TradeID);
    let delete_Trade = `DELETE FROM Trades WHERE TradeID = ?`;
    // Note that the on Cascade ON Delete deletes from the ContractorsTrades table and 
    // Cascade Set NULL sets the ContractorTradeID in Tasks table to Null
    db.pool.query(delete_Trade, [TradeID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});


/***************************************************************
*                          LISTENER                            *
***************************************************************/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});