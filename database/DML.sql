-- Area 57 Web App CRUD Queries
-- variables with ":" suffix represent data passed to mySQL from the backend programming language

-- Operations for Job page

-- get all fields from Jobsites table to populate the Jobs webpage
SELECT JobSiteID, JobAddress, JobZipcode, JobDescription, DATE_FORMAT(JobStart, '%Y-%m-%d') as Date_Start, DATE_FORMAT(JobCompleted, '%Y-%m-%d') as Date_Complete, JobCost, JobBudget FROM JobSites;

-- add item into JobSites entity table
INSERT INTO JobSites (JobAddress, JobZipcode, JobDescription, JobStart, JobCompleted, JobCost, JobBudget) 
	VALUES :data.JobAddress, :zipcode, :data.JobDescription, :data.JobStart, :data.JobCompleted, :jobcost, :jobbudget;

-- delete an entry
DELETE FROM JobSites WHERE JobSiteID = :jobID_selected_from_link

-- update JobSites entity table based on form inputs
UPDATE JobSites SET JobAddress = :address, JobZipcode= :JobZipcode, JobDescription = :description, JobStart= :startDate, JobCompleted = :endDate, JobCost = :jobCost, JobBudget = :jobBudget 
	WHERE id= :jobID_selected_from_link


-- Operations for Tasks Page

-- Extract all fields from Tasks entity table and display
SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as Paid From Tasks
        LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
        LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
        LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
        LEFT JOIN JobSites ON JobSites.JobSiteID = Tasks.JobSiteID
        ORDER BY JobsiteID, TaskSeq;

-- add item into Tasks entity table
INSERT INTO Tasks (JobSiteID, TaskDescription, TaskSequence, TaskStart, TaskEnd, ContractorTradeID, TaskPercentComplete, TaskCostEstimate, TaskCostBilled, PaymentDueDate, TaskCostPaid) 
    VALUES :jobSite, :data.TaskDescription, :seq, :data.TaskStart, :data.TaskEnd, :contTrade, :percent, :cost, :billed, :data.PaymentDueDate, :paid;

-- delete an entry
DELETE FROM Tasks WHERE TaskID = :TaskID_selected_from_link

-- update Tasks entity table based on form inputs
UPDATE Tasks SET JobSiteID = :JobSiteID_selected_from_dropdown, TaskDescription = :taskDescription, TaskSequence = :Sequence, TaskStart = :starDate, 
	TaskEnd = :endDate, ContractorTradeID = :ContractorTrades, TaskPercentComplete = :TaskPercentCompleted, TaskCostEstimate = :TaskCostEstimate, 
	TaskCostBilled = :TaskCostBilled, PaymentDueDate = :PaymentDueDate, TaskCostPaid = :TaskCostPaid WHERE id= :TaskID_selected_from_link

--Retrieve data for Selectable Contractor-Trade dropdown
SELECT ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade" FROM  ContractorsTrades
	INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
	INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
	ORDER BY Contractors.BusinessName ASC;

--Retrieve data for Selectable JobSite dropdown
SELECT JobSiteID, JobAddress FROM JobSites;

-- Return output table based on :search of JobSite address
SELECT TaskID, Tasks.JobSiteID, JobSites.JobAddress, TaskDescription as 'Description', TaskSequence as 'TaskSeq', DATE_FORMAT(TaskStart, '%Y-%m-%d') as 'Start_Date', DATE_FORMAT(TaskEnd, '%Y-%m-%d') as 'End_Date',
        Tasks.ContractorTradeID, CONCAT(Contractors.BusinessName," - ", Trades.TradeName) as "ContTrade", TaskPercentComplete as 'PercentComplete',
        TaskCostEstimate as 'CostEstimate', TaskCostBilled as 'CostBilled', DATE_FORMAT(PaymentDueDate, '%Y-%m-%d') as 'Due_Date', CAST(TaskCostPaid as INT) as Paid From Tasks
        LEFT JOIN ContractorsTrades ON Tasks.ContractorTradeID = ContractorsTrades.ContractorTradeID
        LEFT JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
        LEFT JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
        LEFT JOIN JobSites ON JobSites.JobSiteID = Tasks.JobSiteID
        WHERE JobSites.JobAddress LIKE %:search%
        ORDER BY JobsiteID, TaskSeq;`;
		
		
-- Operations for Contractors Page

-- Extract all fields from Contractors entity table and display
SELECT * FROM Contractors;

-- add item into Contractors entity table
INSERT INTO Contractors (LicenseNumber, FirstName, LastName, BusinessName, ContactPhone, ContactEmail) 
	VALUES :data.LicenseNumber, :data.FirstName, :data.LastName, :data.BusinessName, :data.ContactPhone, :data.ContactEmail;

-- delete an entry
DELETE FROM Contractors WHERE ContractorID = :ContractorID_selected_from_link

-- update Contractors entity table based on form inputs
UPDATE Contractors SET LicenseNumber = :LicenseNumber, FirstName = :firstName, LastName = :lastName, BusinessName = :BusinessName, ContactPhone = :contactPhone, ContactEmail = :contactEmail 
	WHERE ContractorID= :ContractorID_selected_from_link

-- Operations for Trades Page

-- Extract all fields from Trades entity table and display
SELECT * FROM Trades;

-- add item into Trades entity table
INSERT INTO Trades (TradeName, TradeDescription)
    VALUES :data.TradeName, :data.TradeDescription;

-- delete an entry
DELETE FROM Trades WHERE TradeID = :TradeID_selected_from_link

-- update Trades entity table based on form inputs
UPDATE Trades SET TradeName = :tradeName, TradeDescription = :tradeDescription WHERE TradeID= :TradeID_selected_from_link


-- Operations for ContractorTrades Page

-- Extract all fields from ContractorTrades entity table and display
SELECT ContractorTradeID, Contractors.ContractorID, Contractors.BusinessName, Trades.TradeID, Trades.TradeName, 
		ContractorTradesNotes, CAST(ActiveTrade as INT) AS ActiveTrade FROM ContractorsTrades
            INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
            INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
            ORDER BY Contractors.BusinessName, Trades.TradeName;

-- update ContractorTrades entity table based on form inputs
UPDATE ContractorsTrades SET ContractorTradeNotes = :ContractorTradeNotes, ActiveTrade= :ActiveTrade_checkbox WHERE ContractorTradeID= :ContractorTradeID_selected_from_link

-- add item into ContractorTrades entity table
INSERT INTO ContractorsTrades (ContractorID, TradeID, ActiveTrade, ContractorTradesNotes) 
	VALUES :contID, :tradeID, :active, :data.ContractorTradesNotes;

--Retrieve data for Selectable Contractors dropdown
SELECT ContractorID, BusinessName FROM Contractors;

--Retrieve data for Selectable Trades dropdown
SELECT TradeID, TradeName FROM Trades;

-- Return output table based on user search query
SELECT ContractorTradeID, Contractors.ContractorID, Contractors.BusinessName, Trades.TradeID, Trades.TradeName, ContractorTradesNotes, CAST(ActiveTrade as INT) AS ActiveTrade FROM ContractorsTrades
    INNER JOIN Contractors ON ContractorsTrades.ContractorID = Contractors.ContractorID
    INNER JOIN Trades on ContractorsTrades.TradeID = Trades.TradeID
    WHERE Trades.TradeName LIKE :search%
    ORDER BY Contractors.BusinessName;