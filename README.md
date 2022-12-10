# CS340project

## Problem Statement:

Area 57 construction builds 15 houses per year all over King County, Washington. Building residential housing typically has 60 to 80 steps using 15 to 20 different contractors and 3 to 5 different inspectors. These 60 to 80 steps will typically require 25 to 30 different trades with some contractors having more than one trade they are skilled in (ex: a contractor that is a Framer can also be a Roofer or a Finish Contractor). Each of these 60 to 80 steps depend on preceding steps to be complete to prevent work delays and cost overruns. This database-driven website will provide real time feedback to the project manager about build progress, task flow, budget management, scheduling, and vendor participation. Considering the macro environment with rising inflation in raw materials, wages, and real estate coupled with rising interest rates (leading to greater holding costs), it is more paramount than ever that a builder has a comprehensive project management application to utilize. 

## Database Outline:

Contractors: records contact and trade details of contractors for active projects\
  ContractorID: int, auto_increment, not NULL, PK\
  LicenseNumber: varchar\
  FirstName: text, not NULL\
  LastName text, not NULL\
  BusinessName:  varchar, not NULL\
  ContactPhone: varchar, not NULL\
  ContactEmail: varchar, not NULL, UNIQUE\
  Relationship: M:M relationship between Contractors and Trades with ContractorID FK in intermediary entity table ContractorTrades\
\
Trades: entity records details of trades that are part of residential construction\
  TradeID: int, auto_increment, not NULL, PK\
  TradeName: text, not NULL\
  TradeDescription:  varchar, not NULL\
  Relationship: M:M relationship between Trades and Contractors with TradeID FK in intermediary entity table ContractorTrades\
\
ContractorsTrades: Intermediary table for Contractors and Trades relationship that serves dual purpose of linking both with Tasks entity\
  ContractorTradeID: int, auto_increment, PK\
  ContractorID: int, not NULL, FK\
  TradeID: int, not NULL, FK\
  ContractorTradesNotes: varchar\
  ActiveTrade: bit, not NULL\
  Relationship: 1:M relationship between ContractorTrades and Tasks with ContractorTradeID as FK in Tasks entity\
\
JobSites: captures active jobsite locations and corresponding tasks and budget \
  JobSiteID: int, auto_increment, not NULL, PK\
  JobAddress: varchar, not NULL\
  JobZipcode: varchar, not NULL\
  JobDescription: varchar\
  JobStart: date, not NULL\
  JobCompleted: date\
  JobCost: decimal, not NULL\
  JobBudget: decimal, not NULL\
  Relationship: 1:M relationship between JobSites and Tasks with JobSitesID as FK in Tasks entity\
\
Tasks: profiles and tracks progression of phases of residential construction capturing task details, start/end dates, completion %, and billing details\
  TaskID: int, auto_increment, not NULL, PK\
  JobSiteID: int, not NULL, FK\
  TaskDescription: varchar, not NULL\
  TaskSequence: int, not NULL \
  TaskStart: datetime, not NULL\
  TaskEnd: datetime, not NULL\
  ContractorTradeID: int, not NULL, FK\
  TaskPercentComplete: decimal, not NULL\
  TaskCostEstimate: decimal, not NULL\
  TaskCostBilled: decimal, not NULL\
  PaymentDueDate: date\
  TaskCostPaid: bit, not NULL\
  Relationships: M:1 relationship between Tasks and JobSites entity tables, with JobSitesID as FK in Tasks\
  M:1 relationship between Tasks and ContratorTrades with ContractorTaskID as FK\

## Entity and Relationship Diagram:
![ERD](https://user-images.githubusercontent.com/86134647/206863090-f99da393-7461-4b50-b373-f78074a4375e.png)

## Running Database and code:
Made with LiceCap:
![gif1](https://user-images.githubusercontent.com/86134647/206862712-ca5f7633-da87-45d6-b348-18873d4cff71.gif)
