-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2024 at 07:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virya`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `id` int(11) NOT NULL,
  `itinerary_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accommodations`
--

INSERT INTO `accommodations` (`id`, `itinerary_id`, `name`, `rating`, `link`, `image_url`) VALUES
(1, 1, 'Gir Mud Hotel', 4, 'http://aaaaa.com', 'credit_card.png'),
(2, 1, 'Gir Hut Hotel', 4, 'http://bbbbb.com', 'FB__DB_contact.png'),
(3, 2, 'Gir Hotel', 5, 'http://ccccc.com', 'FB_DB_enquiries.png');

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `itinerary_id` int(11) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `itinerary_id`, `activity`) VALUES
(1, 1, 'MS'),
(2, 1, ' ES'),
(3, 2, 'MT');

-- --------------------------------------------------------

--
-- Table structure for table `itinerary`
--

CREATE TABLE `itinerary` (
  `id` int(11) NOT NULL,
  `safari_package_id` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `itinerary`
--

INSERT INTO `itinerary` (`id`, `safari_package_id`, `day`, `date`, `description`) VALUES
(1, 1, 1, '2024-12-17', 'jsbcjbjcbcbdbc'),
(2, 1, 2, '2024-12-18', 'jcbbbdbcbdb');

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `accommodation_id` int(11) NOT NULL,
  `itinerary_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `accommodation_id`, `itinerary_id`, `type`) VALUES
(1, 1, 1, 'B'),
(2, 1, 1, ' L'),
(3, 2, 1, 'B'),
(4, 2, 1, ' D'),
(5, 3, 2, 'B');

-- --------------------------------------------------------

--
-- Table structure for table `national_parks`
--

CREATE TABLE `national_parks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `image` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `river` varchar(255) NOT NULL,
  `seaon` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_types`
--

CREATE TABLE `room_types` (
  `id` int(11) NOT NULL,
  `accommodation_id` int(11) NOT NULL,
  `itinerary_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`id`, `accommodation_id`, `itinerary_id`, `type`) VALUES
(1, 1, 1, 'L'),
(2, 1, 1, ' S'),
(3, 2, 1, 'L'),
(4, 2, 1, ' N'),
(5, 3, 2, 'L');

-- --------------------------------------------------------

--
-- Table structure for table `safari_packages`
--

CREATE TABLE `safari_packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `national_park_id` int(11) DEFAULT NULL,
  `available` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `safari_packages`
--

INSERT INTO `safari_packages` (`id`, `name`, `duration`, `from_date`, `to_date`, `national_park_id`, `available`) VALUES
(1, 'Gir Adventures Safari', 2, '2024-12-17', '2024-12-18', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itineraryId` (`itinerary_id`);

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itineraryId` (`itinerary_id`);

--
-- Indexes for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `safariPackageId` (`safari_package_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itineraryId` (`itinerary_id`),
  ADD KEY `accommodationId` (`accommodation_id`);

--
-- Indexes for table `national_parks`
--
ALTER TABLE `national_parks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itineraryId` (`itinerary_id`),
  ADD KEY `accommodationId` (`accommodation_id`);

--
-- Indexes for table `safari_packages`
--
ALTER TABLE `safari_packages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `itinerary`
--
ALTER TABLE `itinerary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `national_parks`
--
ALTER TABLE `national_parks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `safari_packages`
--
ALTER TABLE `safari_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD CONSTRAINT `accommodations_ibfk_1` FOREIGN KEY (`itinerary_id`) REFERENCES `itinerary` (`id`);

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`itinerary_id`) REFERENCES `itinerary` (`id`);

--
-- Constraints for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD CONSTRAINT `itinerary_ibfk_1` FOREIGN KEY (`safari_package_id`) REFERENCES `safari_packages` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
