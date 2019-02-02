-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 24, 2019 at 08:48 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: ;
--

-- --------------------------------------------------------

--
-- Table structure for table `account_history`
--

CREATE TABLE `account_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` text NOT NULL,
  `text` text NOT NULL,
  `time` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_history`
--

INSERT INTO `account_history` (`id`, `user_id`, `user_type`, `text`, `time`) VALUES
(1, 3, 'passenger', 'Recharged for 100.00 NPR.', 1548239654962),
(2, 3, 'passenger', 'Paid 13.75 NPR to Bus: 2.', 1548239654962),
(3, 2, 'bus', 'Received 13.75 NPR from Passenger: 3.', 1548239654962),
(4, 3, 'passenger', 'Recharged for 100.00 NPR.', 1548240798462);

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `id` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `bus_number` text NOT NULL,
  `balance` decimal(11,2) NOT NULL DEFAULT '0.00',
  `route_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`id`, `email`, `password`, `bus_number`, `balance`, `route_id`) VALUES
(2, 'merobus@gmail.com', '123d74766d4e9f775d02f3090e8ccd6e', 'Mero Bus', '13.75', 2);

-- --------------------------------------------------------

--
-- Table structure for table `bus_routes`
--

CREATE TABLE `bus_routes` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `first_end` text NOT NULL,
  `last_end` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bus_routes`
--

INSERT INTO `bus_routes` (`id`, `bus_id`, `first_end`, `last_end`) VALUES
(1, 2, 'Ratna Park', 'Dhulikhel'),
(2, 2, 'Ratna Park', 'Panauti');

-- --------------------------------------------------------

--
-- Table structure for table `bus_stops`
--

CREATE TABLE `bus_stops` (
  `id` int(11) NOT NULL,
  `bus_route_id` int(11) NOT NULL,
  `stop_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bus_stops`
--

INSERT INTO `bus_stops` (`id`, `bus_route_id`, `stop_name`) VALUES
(3, 2, 'Khadpu'),
(4, 2, 'Banepa'),
(5, 2, 'Sanga'),
(6, 2, 'Bhaktapur'),
(7, 2, 'Thimi'),
(8, 2, 'Koteshwor'),
(9, 2, 'Baneswor'),
(10, 2, 'Ratna Park'),
(11, 2, 'Panauti'),
(12, 2, 'Lokanthali'),
(13, 2, 'Tinkune');

-- --------------------------------------------------------

--
-- Table structure for table `passengers`
--

CREATE TABLE `passengers` (
  `id` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `full_name` text NOT NULL,
  `address` text NOT NULL,
  `balance` decimal(11,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `passengers`
--

INSERT INTO `passengers` (`id`, `email`, `password`, `full_name`, `address`, `balance`) VALUES
(3, 'pragyakhadka@yahoo.com', '99d7ad6e520cf6ef2a48db2ed8968782', 'Pragya Khadka', 'Sanepa', '186.25');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `passenger_id` int(11) NOT NULL,
  `details` text NOT NULL,
  `amount` decimal(11,2) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Pending',
  `updated_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `bus_id`, `passenger_id`, `details`, `amount`, `status`, `updated_at`) VALUES
(3, 1, 1, 'Khadpu - Thimi', '15.00', 'Paid', 1548162449937),
(4, 1, 1, 'Khadpu - Bhaktapur', '25.00', 'Rejected', 1548162626968),
(5, 1, 1, 'Khadpu - Koteshwor', '13.75', 'Paid', 1548162663500),
(6, 2, 3, 'Khadpu - Thimi', '13.75', 'Paid', 1548238892916);

-- --------------------------------------------------------

--
-- Table structure for table `recharge_cards`
--

CREATE TABLE `recharge_cards` (
  `id` int(11) NOT NULL,
  `card_number` int(11) NOT NULL,
  `balance` decimal(11,2) NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Active',
  `used_by` int(11) NOT NULL DEFAULT '0',
  `used_at` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recharge_cards`
--

INSERT INTO `recharge_cards` (`id`, `card_number`, `balance`, `status`, `used_by`, `used_at`) VALUES
(1, 123456, '100.00', 'Used', 3, 1548240798460);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_history`
--
ALTER TABLE `account_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bus_routes`
--
ALTER TABLE `bus_routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bus_stops`
--
ALTER TABLE `bus_stops`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recharge_cards`
--
ALTER TABLE `recharge_cards`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_history`
--
ALTER TABLE `account_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bus_routes`
--
ALTER TABLE `bus_routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bus_stops`
--
ALTER TABLE `bus_stops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `passengers`
--
ALTER TABLE `passengers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `recharge_cards`
--
ALTER TABLE `recharge_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
