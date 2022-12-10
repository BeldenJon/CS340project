-- phpMyAdmin SQL Dump
-- version 5.2.0-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 28, 2022 at 01:13 AM
-- Server version: 10.6.9-MariaDB-log
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_mihait`
--

-- --------------------------------------------------------

--
-- Table structure for table `Contractors`
--

CREATE TABLE `Contractors` (
  `ContractorID` int(6) NOT NULL,
  `LicenseNumber` varchar(20) DEFAULT NULL,
  `FirstName` tinytext NOT NULL,
  `LastName` tinytext NOT NULL,
  `BusinessName` varchar(255) NOT NULL,
  `ContactPhone` varchar(20) NOT NULL,
  `ContactEmail` varchar(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Contractors`
--

INSERT INTO `Contractors` (`ContractorID`, `LicenseNumber`, `FirstName`, `LastName`, `BusinessName`, `ContactPhone`, `ContactEmail`) VALUES
(1, '700000', 'Richard', 'Bronson', 'Area 57 Construction', '800-867-5309', 'contact@area57.com'),
(2, '446825', 'James', 'Roberts', 'Bill Bob\'s Septic', '347-832-4941', 'customerservice@bbseptic.com'),
(3, '330443', 'Austin', 'Richards', 'M&D Architects', '614-383-6780', 'contact@mdarchitects.com'),
(4, '561750', 'Samatha', 'Brown', 'Olson Engineering', '541-554-1757', 's.brown@olsoneng.com'),
(5, NULL, 'Tom', 'Petty', 'King County Department of Construction', '206-296-6600', 'permits@kingcounty.gov');

-- --------------------------------------------------------

--
-- Table structure for table `ContractorsTrades`
--

CREATE TABLE `ContractorsTrades` (
  `ContractorTradeID` int(9) NOT NULL,
  `ContractorID` int(6) NOT NULL,
  `TradeID` int(3) NOT NULL,
  `ActiveTrade` bit(1) NOT NULL,
  `ContractorTradesNotes` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `ContractorsTrades`
--

INSERT INTO `ContractorsTrades` (`ContractorTradeID`, `ContractorID`, `TradeID`, `ContractorTradesNotes`) VALUES
(1, 1, 1, NULL),
(2, 2, 3, 'Contractor is aggressive in pushing for lower cost septic systems. They have a good knowledge of the current climate at the county in approving gravity systems. Designs might cost a little more but likely make it up on construction costs on systems with curtain drains.'),
(3, 3, 2, '7/23/21 - Received several compliments on the finished architectural design of the home in North Bend. House sold'),
(4, 4, 3, '1/1/21 - Prices for civil engineering services increase from $0.60/ft^2 to $0.75/ft^2'),
(5, 4, 2, 'Have a couple drafters that are able to perform simple architectural services. Not recommended for high end complex homes.'),
(6, 5, 4, '3/1/21 - with Covid, wait time for construction inspections is 2 weeks out. Inspections for environment issues is 2 months out.');

-- --------------------------------------------------------

--
-- Table structure for table `JobSites`
--

CREATE TABLE `JobSites` (
  `JobSiteID` int(6) NOT NULL,
  `JobAddress` varchar(255) NOT NULL,
  `JobZipcode` varchar(10) NOT NULL,
  `JobDescription` varchar(255) DEFAULT NULL,
  `JobStart` date NOT NULL,
  `JobCompleted` date DEFAULT NULL,
  `JobCost` decimal(10,0) NOT NULL,
  `JobBudget` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `JobSites`
--

INSERT INTO `JobSites` (`JobSiteID`, `JobAddress`, `JobZipcode`, `JobDescription`, `JobStart`, `JobCompleted`, `JobCost`, `JobBudget`) VALUES
(1, '3000 SE Newton St, North Bend, WA', '98045', '5 acre lot with 3200 square foot house. Sloped lot designated R5. Power at the street (transformer required). Will require septic and connection to PUD water.', '2021-10-21', '2022-07-28', '567527', '560000'),
(2, '11525 SE Croston Ln, Issaquah, WA', '98029', '.12 acre lot with 2400 SF home flat lot with drainage issues. Zoned R', '2021-10-22', '2022-09-15', '435025', '450000'),
(3, '11529 SE Croston Ln, Issaquah, WA', '98029', '.12 acre lot with 2700 SF home flat lot with drainage issues. Zoned R3', '2021-10-22', NULL, '465387', '480000'),
(4, '9592 Shore Avenue Bellevue, WA', '08753', '.1 acre lot with 1700 SF home flat lot wooded lot. Connection to city water and sewer.', '2023-01-14', NULL, '602487', '625000'),
(5, '9959 West Longfellow St., Federal Way, WA', '92347', '.2 acre lot with 2300 SF home flat wooded lot with connection to city water and sewer.', '2020-08-02', NULL, '472114', '500000');

-- --------------------------------------------------------

--
-- Table structure for table `Tasks`
--

CREATE TABLE `Tasks` (
  `TaskID` int(8) NOT NULL,
  `JobSiteID` int(6) NOT NULL,
  `TaskDescription` varchar(255) NOT NULL,
  `TaskSequence` int(3) NOT NULL,
  `TaskStart` datetime NOT NULL,
  `TaskEnd` datetime NOT NULL,
  `ContractorTradeID` int(9),
  `TaskPercentComplete` decimal(3,0) NOT NULL,
  `TaskCostEstimate` decimal(10,2) NOT NULL,
  `TaskCostBilled` decimal(10,2) NOT NULL,
  `PaymentDueDate` date,
  `TaskCostPaid` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Tasks`
--

INSERT INTO `Tasks` (`TaskID`, `JobSiteID`, `TaskDescription`, `TaskSequence`, `TaskStart`, `TaskEnd`, `ContractorTradeID`, `TaskPercentComplete`, `TaskCostEstimate`, `TaskCostBilled`, `PaymentDueDate`, `TaskCostPaid`) VALUES
(1, 1, 'Perform Lot Feasibility Study', 1, '2021-10-01 00:00:00', '2021-12-01 00:00:00', 1, '100', '0', '0', '2021-12-01', b'0'),
(2, 1, 'Septic System Design', 2, '2021-10-15 00:00:00', '2021-10-22 00:00:00', 2, '100', '1500', '1000', '2021-11-22', b'1'),
(3, 1, 'Secure Project Funding (Loan)', 3, '2021-11-01 00:00:00', '2021-11-15 00:00:00', 1, '100', '4500', '4500', '2021-11-15', b'1'),
(4, 1, 'Finalize Purchase', 4, '2021-12-05 00:00:00', '2021-12-05 00:00:00', 1, '100', '135000', '125000', '2021-12-05', b'1'),
(5, 1, 'Construct Architectural Drawings', 5, '2021-12-15 00:08:00', '2022-01-15 00:14:15', 3, '100', '4500', '4200', '2022-02-01', b'1'),
(6, 1, 'Construct Engineering Drawings', 6, '2022-01-15 00:00:00', '2022-01-25 00:00:00', 4, '100', '2400', '2400', '2022-02-25', b'1'),
(7, 2, 'Perform Lot Feasibility Study', 1, '2021-10-22 00:07:00', '2021-12-25 00:17:30', 1, '100', '0', '0', '0000-00-00', b'0'),
(8, 2, 'County Inspection for wetland concerns', 2, '2022-11-05 00:00:00', '2022-11-05 00:00:00', 6, '0', '450', '0', '0000-00-00', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `Trades`
--

CREATE TABLE `Trades` (
  `TradeID` int(3) NOT NULL,
  `TradeName` tinytext NOT NULL,
  `TradeDescription` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Trades`
--

INSERT INTO `Trades` (`TradeID`, `TradeName`, `TradeDescription`) VALUES
(1, 'Project Manager', 'Plan, Schedule, Manage, Inspect and Pay all construction activities'),
(2, 'Architect', 'Construct architectural drawings for construction.'),
(3, 'Engineer', 'Includes all Engineering Trades (Environmental, Civil, Septic)'),
(4, 'Inspector', 'Inspect worksite (Typically assigned to County)'),
(5, 'Dirtwork', 'Clearing, and general dirtwork');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Contractors`
--
ALTER TABLE `Contractors`
  ADD PRIMARY KEY (`ContractorID`),
  ADD UNIQUE KEY `ContractorID` (`ContractorID`);

--
-- Indexes for table `ContractorsTrades`
--
ALTER TABLE `ContractorsTrades`
  ADD PRIMARY KEY (`ContractorTradeID`),
  ADD KEY `ContractorID` (`ContractorID`),
  ADD KEY `TradeID` (`TradeID`);

--
-- Indexes for table `JobSites`
--
ALTER TABLE `JobSites`
  ADD PRIMARY KEY (`JobSiteID`),
  ADD UNIQUE KEY `JobSiteID` (`JobSiteID`);

--
-- Indexes for table `Tasks`
--
ALTER TABLE `Tasks`
  ADD PRIMARY KEY (`TaskID`),
  ADD KEY `JobSiteID` (`JobSiteID`),
  ADD KEY `ContractorTradeID` (`ContractorTradeID`);

--
-- Indexes for table `Trades`
--
ALTER TABLE `Trades`
  ADD PRIMARY KEY (`TradeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Contractors`
--
ALTER TABLE `Contractors`
  MODIFY `ContractorID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ContractorsTrades`
--
ALTER TABLE `ContractorsTrades`
  MODIFY `ContractorTradeID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `JobSites`
--
ALTER TABLE `JobSites`
  MODIFY `JobSiteID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Tasks`
--
ALTER TABLE `Tasks`
  MODIFY `TaskID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Trades`
--
ALTER TABLE `Trades`
  MODIFY `TradeID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ContractorsTrades`
--
ALTER TABLE `ContractorsTrades`
  ADD CONSTRAINT `ContractorsTrades_ibfk_1` FOREIGN KEY (`ContractorID`) REFERENCES `Contractors` (`ContractorID`) ON DELETE CASCADE,
  ADD CONSTRAINT `ContractorsTrades_ibfk_2` FOREIGN KEY (`TradeID`) REFERENCES `Trades` (`TradeID`) ON DELETE CASCADE;
 
--
-- Constraints for table `Tasks`
--
ALTER TABLE `Tasks`
  ADD CONSTRAINT `Tasks_ibfk_1` FOREIGN KEY (`JobSiteID`) REFERENCES `JobSites` (`JobSiteID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Tasks_ibfk_2` FOREIGN KEY (`ContractorTradeID`) REFERENCES `ContractorsTrades` (`ContractorTradeID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
