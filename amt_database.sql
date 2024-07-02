-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 24, 2024 at 10:57 PM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amt`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `aname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `aname`) VALUES
(1, 'admin@gmail.com', '1234', 'mj');

-- --------------------------------------------------------

--
-- Table structure for table `certification`
--

CREATE TABLE `certification` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `assigned_date` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `target_date` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Not_Completed',
  `adate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bedate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bextime` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification`
--

INSERT INTO `certification` (`id`, `name`, `cname`, `assigned_date`, `target_date`, `type`, `status`, `adate`, `edate`, `reason`, `bedate`, `bextime`) VALUES
(1, 'Abhishek T', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(2, 'Abin ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(3, 'Adarsh', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2022-03-22', '2026-03-21', NULL, NULL, NULL),
(4, 'Adarsh', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2023-11-07', '2025-11-06', NULL, NULL, NULL),
(5, 'Adarsh', 'Aruba accredited SDWAN professional (AASP)', NULL, NULL, NULL, 'completed', '2023-06-01', '2026-06-01', NULL, NULL, NULL),
(6, 'Adarsh', 'Aruba Certified Switching professional (ACSP)', NULL, NULL, NULL, 'completed', '2023-09-01', '2026-09-01', NULL, NULL, NULL),
(7, 'Akshay', 'HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2021-10-21', '2023-10-21', NULL, NULL, NULL),
(8, 'Balakrishna ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-21', '2026-03-21', NULL, NULL, NULL),
(9, 'Bharath', 'ACX - Network Security', NULL, NULL, NULL, 'completed', '2023-05-24', '2026-05-23', NULL, NULL, NULL),
(10, 'Bharath', 'Aruba Certified ClearPass Expert (ACCX)', NULL, NULL, NULL, 'completed', '2023-05-26', '2026-05-25', NULL, NULL, NULL),
(11, 'Bharath', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2022-10-12', '2024-12-11', NULL, NULL, NULL),
(12, 'Bharath', ' Aruba product - Configuring SD Branch ', NULL, NULL, NULL, 'completed', '2022-12-10', '2024-09-12', NULL, NULL, NULL),
(13, 'Bharath', ' HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2024-03-14', '2025-03-13', NULL, NULL, NULL),
(14, 'Bharath', ' Secure SD-WAN Provisioning', NULL, NULL, NULL, 'completed', '2021-08-29', '2024-08-28', NULL, NULL, NULL),
(15, 'Bharath', 'Aruba networking product specilist - security service edge (APS-SSE)', NULL, NULL, NULL, 'completed', '2023-11-17', '2025-11-16', NULL, NULL, NULL),
(16, 'Charles', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2023-04-01', '2025-03-31', NULL, NULL, NULL),
(17, 'Charles', 'Aruba accredited sdwan professional (AASP)', NULL, NULL, NULL, 'completed', '2023-07-17', '2025-07-16', NULL, NULL, NULL),
(18, 'Danish', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-18', '2026-03-18', NULL, NULL, NULL),
(19, 'darshan', 'Aruba Certified Switching Professional (ACSP)', NULL, NULL, NULL, 'completed', '2023-05-24', '2026-05-23', NULL, NULL, NULL),
(20, 'darshan', 'Aruba Certified ClearPass Associate (ACCA)', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(21, 'darshan', 'Aruba Certified Edge Associate (ACEA)', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(22, 'darshan', 'Aruba Certified Edge Professional (ACEP) ', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(23, 'darshan', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(24, 'darshan', 'Aruba Product specialist- CX 10K Switch', NULL, NULL, NULL, 'completed', '2023-10-19', '2026-10-18', NULL, NULL, NULL),
(25, 'darshan', ' Aruba Data Center Network Specialist  (ADCNS)', NULL, NULL, NULL, 'completed', '2023-04-12', '2025-12-03', NULL, NULL, NULL),
(26, 'darshan', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-05-24', '2026-05-23', NULL, NULL, NULL),
(27, 'darshan', 'HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2023-03-14', '2025-03-14', NULL, NULL, NULL),
(28, 'darshan', 'Aruba Certified Mobility Professional (ACMP)', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(29, 'darshan', 'Aruba Certified ClearPass Professional (ACCP)', NULL, NULL, NULL, 'completed', '2022-10-26', '2025-10-25', NULL, NULL, NULL),
(30, 'darshan', 'Aruba networking product specilist - security service edge (APS-SSE)', NULL, NULL, NULL, 'completed', '2023-11-30', '2025-11-29', NULL, NULL, NULL),
(31, 'Dhinesh', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(32, 'Divya', ' Certified customer scuccess manager (CCSM) Level 1', NULL, NULL, NULL, 'completed', '2024-04-11', NULL, NULL, NULL, NULL),
(33, 'Faisal ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(34, 'Ganesh', 'Aruba accredited sdwan professional (AASP)', NULL, NULL, NULL, 'completed', '2024-01-14', '2026-01-14', NULL, NULL, NULL),
(35, 'Ganesh', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-21', '2026-03-21', NULL, NULL, NULL),
(36, 'Gaurav', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', '2024-02-26', NULL, NULL, NULL, NULL),
(37, 'Gaurav', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(38, 'Mani Baarathi', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2023-03-31', '2026-03-30', NULL, NULL, NULL),
(39, 'Mani Baarathi', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(40, 'Manisaran', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-23', '2026-03-23', NULL, NULL, NULL),
(41, 'Manohar', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(42, 'Manoj Subbiah', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(43, 'Mazhar', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-04-13', '2026-04-12', NULL, NULL, NULL),
(44, 'Mazhar', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-07-03', '2026-07-03', NULL, NULL, NULL),
(45, 'Mohammad Zeeshaan', 'Aruba networking product specilist - security service edge (APS-SSE)', NULL, NULL, NULL, 'completed', '2024-02-28', '2026-02-28', NULL, NULL, NULL),
(46, 'Mohammad Zeeshan', ' Aruba accredited sdwan expert assessment (ACSX)', NULL, NULL, NULL, 'completed', '2024-02-23', '2026-02-23', NULL, NULL, NULL),
(47, 'Moiz', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-04-02', '2026-04-01', NULL, NULL, NULL),
(48, 'Moiz', 'Aruba Product specialist- CX 10K Switch', NULL, NULL, NULL, 'completed', '2023-10-30', '2025-10-29', NULL, NULL, NULL),
(49, 'Moiz', 'Aruba accredited SDWAN professional (AASP)', NULL, NULL, NULL, 'completed', '2023-07-31', '2025-07-30', NULL, NULL, NULL),
(50, 'Moiz', ' Aruba accredited sdwan expert assessment (ACSX)', NULL, NULL, NULL, 'completed', '2023-08-01', '2025-07-31', NULL, NULL, NULL),
(51, 'Nishanth', 'Aruba Certified Mobility Professional (ACMP)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(52, 'Nishanth', 'Aruba Certified ClearPass Professional (ACCP)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(53, 'Nishanth', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(54, 'Nishanth', 'HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2023-03-14', '2025-03-13', NULL, NULL, NULL),
(55, 'Nishanth', 'Aruba Certified ClearPass Associate (ACCA)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(56, 'Nishanth', 'Aruba Certified Design Professional (ACDP)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(57, 'Nishanth', 'Aruba Certified Design Associate (ACDA)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(58, 'Nishanth', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(59, 'Nishanth', 'Aruba Certified Edge Professional (ACEP)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(60, 'Nishanth', 'Aruba Certified Edge Associate (ACEA)', NULL, NULL, NULL, 'completed', '2023-04-28', '2026-04-27', NULL, NULL, NULL),
(61, 'Prashant', 'HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2021-10-14', '2023-10-14', NULL, NULL, NULL),
(62, 'Prathamesh', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-04-02', '2026-04-01', NULL, NULL, NULL),
(63, 'Prathamesh', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2021-11-27', '2024-11-26', NULL, NULL, NULL),
(64, 'Prathamesh', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2023-11-07', '2025-11-06', NULL, NULL, NULL),
(65, 'Punit', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2023-03-30', '2026-03-29', NULL, NULL, NULL),
(66, 'Punit', 'Aruba accredited sdwan professional (AASP) ', NULL, NULL, NULL, 'completed', '2023-07-23', '2026-07-23', NULL, NULL, NULL),
(67, 'Punit ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(68, 'Rahul Kumar ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(69, 'Rakesh', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2021-11-27', '2024-11-26', NULL, NULL, NULL),
(70, 'Rakshith', 'Aruba accredited sdwan professional (AASP)', NULL, NULL, NULL, 'completed', '2023-01-08', '2025-01-08', NULL, NULL, NULL),
(71, 'Rakshith ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-21', '2026-03-21', NULL, NULL, NULL),
(72, 'Rajshekar E', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-04-10', '2026-04-10', NULL, NULL, NULL),
(73, 'Sachin', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2024-02-26', '2027-02-26', NULL, NULL, NULL),
(74, 'Sachin ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-21', '2026-03-21', NULL, NULL, NULL),
(75, 'Sai Praveen', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(76, 'Sanketh ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', '2024-03-27', '2026-03-27', NULL, NULL, NULL),
(77, 'Sethu ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(78, 'Shashikant', 'HPE Sales Certified - Aruba Networking Solutions(APAS)', NULL, NULL, NULL, 'completed', '2021-10-14', '2023-10-14', NULL, NULL, NULL),
(79, 'Snehal ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(80, 'Surya ', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(81, 'Syed Zeeshaan Hafeez', 'Aruba Certified ClearPass Associate (ACCA)', NULL, NULL, NULL, 'completed', '2023-04-17', '2026-04-16', NULL, NULL, NULL),
(82, 'Syed Zeeshaan Hafeez', 'Aruba Certified ClearPass Professional (ACCP)', NULL, NULL, NULL, 'completed', '2023-04-20', '2026-04-19', NULL, NULL, NULL),
(83, 'Syed Zeeshaan Hafeez', 'Aruba accredited sdwan professional (AASP)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(84, 'Syed Zeeshaan Hafeez', ' Aruba accredited sdwan expert assessment (ACSX)', NULL, NULL, NULL, 'completed', '2023-07-15', '2025-07-15', NULL, NULL, NULL),
(85, 'Vivek', 'Aruba Certified Mobility Associate (ACMA)', NULL, NULL, NULL, 'completed', '2023-04-06', '2026-04-05', NULL, NULL, NULL),
(86, 'Abin ', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2023-09-01', '2024-03-16', NULL, NULL, NULL),
(87, 'Sanket', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', NULL, '2024-03-23', NULL, NULL, NULL),
(88, 'Sethu', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, '2024-03-23', NULL, NULL, NULL),
(89, 'Mazhar', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, '2024-03-23', NULL, NULL, NULL),
(90, 'Sachin', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, '2024-03-30', NULL, NULL, NULL),
(91, 'Adarsh', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(92, 'Vivek', 'Aruba Certified Canpus Associate (ACCA)', NULL, NULL, NULL, 'completed', '2024-01-19', '2024-04-22', NULL, NULL, NULL),
(93, 'Moiz', 'Aruba Data Center Network Specialist (ADCNS)', NULL, NULL, NULL, 'completed', NULL, '2023-04-30', NULL, NULL, NULL),
(94, 'Rajshekar', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2024-01-23', NULL, NULL, NULL, NULL),
(95, 'Rajshekar', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(96, 'Abhishek T', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', '2024-01-17', NULL, NULL, NULL, NULL),
(97, 'Snehal', 'Aruba Certified Switching Associate (ACSA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(98, 'Snehal', 'Aruba product specialist central (APSC)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(99, 'Nishanth', 'ACMX', NULL, NULL, NULL, 'completed', NULL, '2023-05-15', NULL, NULL, NULL),
(100, 'Prathamesh', 'Aruba certified network security associate (ACNSA)', NULL, NULL, NULL, 'completed', NULL, '2024-04-15', NULL, NULL, NULL),
(101, 'Charles', 'Aruba certified network security associate (ACNSA)', NULL, NULL, NULL, 'completed', NULL, '2024-04-15', NULL, NULL, NULL),
(102, 'Charles', 'Cerified wireless network associate (CWNA)', NULL, NULL, NULL, 'completed', NULL, '2024-05-15', NULL, NULL, NULL),
(103, 'Prathamesh', 'ACNSP', NULL, NULL, NULL, 'completed', NULL, '2024-04-26', NULL, NULL, NULL),
(104, 'Snehal', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(105, 'Syed Zeeshaan Hafeez', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(106, 'Prathamesh', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(107, 'Roshan', 'ACNA DC', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(108, 'Adarsh', 'ACNA DC', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(109, 'Abin ', 'ACNA DC', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(110, 'Vivek', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(111, 'Mazhar', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(112, 'Nishanth', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(113, 'Bharath', 'ACNA campus', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(114, 'Darshan', 'ACNA DC', NULL, NULL, NULL, 'completed', '2024-04-15', NULL, NULL, NULL, NULL),
(115, 'Amar', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(116, 'Balakrishna', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(117, 'Suraj', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(118, 'Rakshit', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(119, 'Anangh', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(120, 'Arun', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(121, 'Manisaran', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(122, 'Hariharsutan', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(123, 'Rahul Kumar', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(124, 'Krishna', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(125, 'Punit', 'ACNSA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(126, 'Pankaj', '\"Aruba Certified Canpus Associate (ACA) Silverpeak\"', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(127, 'Dhinesh', 'Aruba Certified Canpus Associate (ACA)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(128, 'Sachin', 'ZTNA -101', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(129, 'Sachin', 'ZTNA -301', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(130, 'Bharath', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(131, 'Darshan', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(132, 'Prathamesh', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(133, 'Roshan', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(134, 'Charles', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(135, 'Syed', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(136, 'Punit', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(137, 'Adarsh', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(138, 'Nishanth', 'ZTNA', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(139, 'Syed Zeeshaan Hafeez', 'NSE 4', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(140, 'Gaurav', 'FCA (Fortinet Certified Associate)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(141, 'Moiz', 'NSE 4', NULL, NULL, NULL, 'completed', '2024-03-06', '2026-03-06', NULL, NULL, NULL),
(142, 'Mazhar', 'FCA (Fortinet Certified Associate)', NULL, NULL, NULL, 'completed', '2023-08-01', NULL, NULL, NULL, NULL),
(143, 'Charles', 'FCF (Fortinet Certified Fundamentle in Cybersecurity)', NULL, NULL, NULL, 'completed', '2024-03-07', '2026-03-07', NULL, NULL, NULL),
(144, 'Charles', 'FCAC (Fortinet Certified Associate in Cybersecurity)', NULL, NULL, NULL, 'completed', '2022-07-08', '2025-12-13', NULL, NULL, NULL),
(145, 'Charles', 'Fortinet SD-WAN 7.2 Architect', NULL, NULL, NULL, 'completed', '2023-12-13', '2025-12-13', NULL, NULL, NULL),
(146, 'Charles', 'Fortinet FortiGate 7.4 Operator', NULL, NULL, NULL, 'completed', '2024-03-18', '2027-03-18', NULL, NULL, NULL),
(147, 'Manjunath Kashyap', 'NSE 4- FortiOS 6.2', NULL, NULL, NULL, 'completed', '2023-12-13', NULL, NULL, NULL, NULL),
(148, 'Manjunath Kashyap', 'NSE 5- Fortiedr 5.0', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(149, 'Manjunath Kashyap', 'NSE 5- FortiManager 6.2', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(150, 'Manjunath Kashyap', 'NSE 5- FortiAnalyzer 6.2', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(151, 'Manjunath Kashyap', 'NSE 7- Enterprise Firewall 7.0', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(152, 'Manjunath Kashyap', ' NSE 7- OT Security 6.4', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(153, 'Manjunath Kashyap', 'NSE 7- SD WAN 6.4', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(154, 'Prathamesh', 'FCA (Fortinet Certified Associate)', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(155, 'Mani Bharathi', 'NSE 4', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL),
(156, 'Ganesh', 'NSE 4', NULL, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `certification_cost`
--

CREATE TABLE `certification_cost` (
  `id` int NOT NULL,
  `cname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cost` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_cost`
--

INSERT INTO `certification_cost` (`id`, `cname`, `cost`) VALUES
(1, 'CCNA', '1600'),
(2, 'ACSA', '5000');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `admin_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `timeadded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lab_request_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `email`, `chat_type`, `user_message`, `admin_message`, `timeadded`, `lab_request_id`) VALUES
(4, 'suraj@airowire.com', 'lab', 'Hi', 'no', '2024-03-25 08:07:43', 6),
(5, 'suraj@airowire.com', 'lab', 'Hi', 'no', '2024-03-25 09:35:17', 5),
(6, 'suraj@airowire.com', 'lab', 'hi', 'no', '2024-03-25 10:45:31', 5),
(7, 'suraj@airowire.com', 'lab', 'HI', 'no', '2024-03-25 10:58:57', 4);

-- --------------------------------------------------------

--
-- Table structure for table `elab`
--

CREATE TABLE `elab` (
  `id` int NOT NULL,
  `cname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpocname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cphone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cemail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sdate` date NOT NULL,
  `edate` date NOT NULL,
  `remail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `material` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Part_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Qty` int NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Not_Approved',
  `serialNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tno` varchar(255) NOT NULL,
  `ticket_status` varchar(255) NOT NULL DEFAULT 'open',
  `rreason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'noserial'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `elab`
--

INSERT INTO `elab` (`id`, `cname`, `cpocname`, `cphone`, `cemail`, `sdate`, `edate`, `remail`, `material`, `Part_No`, `Qty`, `status`, `serialNumber`, `tno`, `ticket_status`, `rreason`) VALUES
(122, 'DRL', 'hari', '63616285589', 'yogi@gmail.com', '2024-05-20', '2024-05-21', 'jeevan@airowire.com', 'MR32-HW', 'NA', 1, 'Pending with jeevan', 'noserial', 'ANPL-93327', 'open', NULL),
(123, 'DRL', 'hari', '63616285589', 'yogi@gmail.com', '2024-05-20', '2024-05-21', 'jeevan@airowire.com', 'AP-505H-RW', 'R3V46A', 2, 'Pending with jeevan', 'CNN6KSM3CP', 'ANPL-93327', 'open', NULL),
(124, 'DRL', 'Kin', '636163634', 'yo@gmail.com', '2024-05-28', '2024-05-29', 'yogesh@airowire.com', 'AP-505H-RW', 'R3V46A', 1, 'rejected by manager', NULL, 'ANPL-31760', 'open', 'K');

-- --------------------------------------------------------

--
-- Table structure for table `fpotp`
--

CREATE TABLE `fpotp` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `otp` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fpotp`
--

INSERT INTO `fpotp` (`id`, `email`, `otp`) VALUES
(11, 'yogeshas91889@gmail.com', 507717),
(15, 'kiran.p@airowire.com', 566138),
(18, 'yogesh@airowire.com', 432443),
(20, 'abhishek.t@airowire.com', 779354);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `slno` int NOT NULL,
  `OEM` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Part_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Qty` int NOT NULL,
  `SerialNo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`slno`, `OEM`, `Part_No`, `Description`, `Qty`, `SerialNo`) VALUES
(1, 'TP LINK', 'NA', 'EAP120 with MKT', 1, '02157612002467'),
(2, 'AEROHIVE', 'NA', 'AP122', 1, '01221703277169'),
(3, 'CISCO', 'NA', 'MR32-HW', 1, 'Q2JD-KFNJ-6W2T'),
(4, 'ARUBA', 'R3V46A', 'AP-505H-RW', 7, 'CNN6KSM3CP, CNN6KSM3LN, CNN6KSM3G4, CNN6KSM3KJ, CNN6KSM3KW, CNN6KSM3HQ, CNN6KSM3K2, CNN6KSM3MT, CNN6KSM3LD'),
(5, 'ARUBA', 'NA', 'IAP-205', 2, 'CM0645404, CM0645393, CM0645385'),
(6, 'ARUBA', 'NA', 'IAP-207-RW', 1, 'CND1JST38S'),
(7, 'ARUBA', 'NA', 'IAP-305-RW', 1, 'CNF4JSS7TR'),
(8, 'ARUBA', 'NA', 'IAP-215-RW', 1, 'CK0286578'),
(9, 'ARUBA', 'R2W96A', 'AP11-RW', 2, 'CNJPK9T2QX, CNP5K9T39D'),
(10, 'ARUBA', 'JW047A', 'AP-220-MNT-W1W', 194, ''),
(11, 'ARUBA', 'JL188A', 'IAP-103-RW', 3, 'CN63HHD26X, CU0287775, CN5CHHD1N7'),
(12, 'CISCO', 'NA', 'AIR-CAP702W-D-K9', 4, 'KWC183804H6, KWC18380633, KWC1838060A, KWC183800N7'),
(13, 'CISCO', 'NA', 'AIR-CAP1702I-D-K9', 12, 'FGL1847X1UP, FGL1847X1UE, FGL1847X1UF, FGL1847X1UL, FGL1847X1UN, FGL1847X1UT, FGL1847X1UD, FGL1847X1UK, FGL1847X1UA, FGL1847X1UJ, FGL1845XAJ0, FGL1845XAJ1'),
(14, 'CISCO', 'NA', 'AIR-CAP2702I-D-K9', 13, 'FGL1846XBRQ, FGL1846XBQT, FGL1944XJDD, FGL1846XBRN, FGL1846XBRT, FGL1846XBRF, FGL1846XBRS, FGL1846XBRJ, FGL1944XJDG, FGL1846XBRP, FGL1846XBRM, FGL1846XBRK, FGL1846XBRV'),
(15, 'CISCO', 'NA', 'ASA 5525-X FIREWALL', 2, 'FCH19327YWJ, FCH19057LUJ'),
(16, 'CISCO', 'NA', '4300 SERIES', 1, 'FDO2109A10C'),
(17, 'CISCO', 'NA', 'AIR-PWR-5500-AC', 2, 'FCW1846L008, FCW1845L0AM'),
(18, 'ARUBA', 'J9779A', '2530 24G POE+SWITCH', 27, 'CN92FPB0MB, CN92FPB0Y3, CN95FPB19D, CN96FPB0L8, CN95FPB14S, CN95FPB174, CN92FPB10V, CN92FPB10X, CN95FPB0WH, CN92FPB12C, CN96FPB0QR, CN95FPB0S1, CN92FPB0WF, CN92FPB0P1, CN95FPB0ML, CN92FPB0NY, CN95FPB0W2, CN95FPB1FN, CN92FPB0JP, CN92FPB0WJ, CN95FPB195, CN92FPB10C, CN95FPB0QH, CN92FPB0LQ, CN96FPB0DM, CN95FPB0J6, CN95FPB0HD'),
(19, 'ARUBA', 'JL319A', '2930 M 24G', 4, 'SG91JQKG87, SG91JQKG20, SG91JQKFXD, SG91JQKFHP'),
(20, 'ARUBA', 'JL261A', '2930  F 24G', 1, 'CN90HL215R'),
(21, 'ARUBA', 'JX945A', 'IAP-305-RW(Udaan)', 194, 'CNH3JSSGKB, CNH3JSS8VV, CNH7JSSLB2, CNJ8JSS7C4, CNH3JSS8YS, CNH7JSSLB1, CNH7JSSLGD, CNGZJSSJH7, CNGZJSSGKD, CNH7JSSLC3, CNJ8JSS786, CNH7JSSL9K, CNH7JSSLBF, CNGZJSSB28, CNH7JSSLBP, CNH3JSS8ZN, CNJ8JSS7B0, CNGZJSSN44, CNH7JSSLBR, CNJ8JSS33Y, CNH3JSS8YF, CNH7JSSL92, CNH7JSSLBC, CNJ8JSS771, CNGZJSSN4C, CNH3JSSGK5, CNGZJSSN3X, CNH7JSSL4W, CNH7JSSL05, CNJ8JSS75B, CNJ8JSS79F, CNGZJSSHJX, CNGZJSSN3H, CNJ8JSS74S, CNGZJSSN9Q, CNH3JSSGJB, CNH7JSSLGK, CNGZJSSN2S, CNH3JSSGKK, CNJ8JSS78H, CNGZJSSN5T, CNGZJSSN35, CNJ8JSS775, CNGZJSSN6Q, CNH7JSSLBS, CNJ8JSS76Z, CNJ8JSS79W, CNGZJSSN6C, CNJ8JSS76X, CNJ8JSS79C, CNJ8JSS79X, CNH7JSSL9C, CNGZJSSN4L, CNGZJSSN98, CNHZJSS8HW, CNGZJSSN59, CNHZJSS90H, CNGZJSSN9D, CNJ8JSS7CK, CNJ8JSS7B9, CNJ8JSS79P, CNHZJSS8VB, CNH7JSSLC4, CNH3JSSG4Z, CNHZJSS8NG, CNJ8JSS79D, CNJ8JSS7CQ, CNJ8JSS7C3, CNH3JSSGKG, CNH7JSSLBV, CNJ8JSS783, CNGZJSSN6M, CNJ8JSS75Q, CNGZJSSN9N, CNGZJSSN5Y, CNH3JSSG64, CNJ8JSS7B5, CNGZJSSN94, CNH3JSSG5Q, CNHZJSS8VK, CNH7JSSL3L, CNH7JSSL4S, CNGZJSSHRW, CNJ8JSS779, CNJ8JSS77Z, CNH7JSSL9N, CNH7JSSL4V, CNGZJSSN48, CNGZJSSN9X, CNH7JSSL8M, CNH7JSSL9T, CNH7JSSL3N, CNHZJSS7S5, CNH7JSSL9M, CNJ8JSS19W, CNGZJSSP8X, CNJ8JSS670, CNH3JSS8SR, CNGZJSSN69, CNJ8JSS33Q, CNJ8JSS767, CNJ8JSS76F, CNJ8JSS787, CNH7JSSBW6, CNJ8JSS7C7, CNHZJSS8DC, CNGZJSSN61, CNJ8JSS7BZ, CNGZJSSN5X, CNGZJSSP9K, CNH3JSSG55, CNJ8JSS77M, CNJ8JSS79G, CNGZJSSP8S, CNGZJSSN4P, CNHZJSS840, CNGZJSSN4W, CNGZJSSN6B, CNJ8JSS78Q, CNGZJSSN9S, CNJ8JSS74B, CNGZJSSHC3, CNH7JSSL9X, CNH3JSS8VS, CNGZJSSN9F, CNJ8JSS7C0, CNJ8JSS79S, CNJ8JSS7BB, CNJ8JSS758, CNJ8JSS72L, CNGZJSSN5Q, CNGZJSSN58, CNGZJSSN56, CNH3JSSG6K, CNJ8JSS756, CNJ8JSS7BC, CNGZJSSN99, CNH3JSSGKF, CNH3JSS8XX, CNGZJSSN9M, CNJ8JSS7BH, CNGZJSSN5W, CNGZJSSB45, CNGZJSSN93, CNJ8JSS73K, CNJ8JSS78Y, CNH3JSS937, CNGZJSSN4R, CNJ8JSS31J, CNJ8JSS76Y, CNJ8JSS7BM, CNGZJSSN79, CNH7JSSLB5, CNH7JSSLGB, CNJ8JSS766, CNH7JSSLBG, CNHZJSS8P5, CNH3JSS92J, CNJ8JSS75C, CNJ8JSS7B6, CNJ8JSS79K, CNJ8JSS79B, CNGZJSSN66, CNGZJSSN5J, CNH3JSSG6H, CNJ8JSS79H, CNGZJSSN6D, CNH3JSS938, CNGZJSSN5H, CNJ8JSS79R, CNH7JSSLBQ, CNJ8JSS78Z, CNH3JSS8V0, CNH3JSSGK8, CNGZJSSGPZ, CNH7JSSLCN, CNH7JSSL4Q, CNGZJSSN5S, CNH7JSSLBD, CNH7JSSL8S, CNJ8JSS74D, CNGZJSSN6L, CNJ8JSS79L, CNJ8JSS77P, CNH3JSS8WH, CNGZJSSN5K, CNH7JSSL46, CNJ8JSS78D, CNH7JSSLFF, CNH7JSSLB6, CNH7JSSKX4, CNH7JSSLCX, CNH7JSSLB7, CNH7JSSL4L'),
(22, 'ARUBA', 'JZ320A', 'AP-303-RW', 1, 'CNGSK9T3FR  '),
(23, 'ARUBA', 'NA', '7240 CONTROLLER', 1, 'CX0001603'),
(24, 'ARUBA', 'J9773A', '2530 24G POE+SWITCH1', 27, 'CN21FP41Y0'),
(25, 'ARUBA', 'Q9H62A', 'AP-515-RW', 23, 'CNH9KD56BJ, CNNGKD59KD, CNNJKD5QVC, CNNJKD5S60, CNH9KD56CH, CNH9KD56BN, CNH9KD56BS, CNNFKD5BTJ, CNNJKD5S5F, CNH9KD56CL, CNH9KD56MN, CNH9KD56CB, CNH9KD56BV, CNNDKD51LC, CNH9KD56BT, CNH9KD56BZ, CNNDKD51H2, CNNJKD5S1C, CNNJKD5RZC, CNH9KD56C6, CNH9KD5730, CNMDKD5LHS, CNNDKD51R5'),
(26, 'ARUBA', 'JZ336A', 'AP 535', 1, 'CNP9K9W3X0'),
(27, 'ARUBA', 'R2H28A', 'AP-505-RW', 27, 'CNP5KPPD89, CNP5KPPCZD, CNP5KPPDBK, CNP5KPPD1R, CNP5KPPDBT, CNP5KPPDDR, CNP5KPPDDX, CNP5KPPDDW, CNP5KPPDCY, CNP5KPPDG0, CNP5KPPDC8, CNP5KPPDDQ, CNP5KPPDDM, CNP5KPPDDV, CNP5KPPDDC, CNP5KPPDD8, CNP5KPPDDN, CNP5KPPDG3, CNP5KPPD9F, PHNWKPPDYK, PHNWKPPCWV, PHNWKPPDMF, PHNWKPPDYM, PHNWKPPDXQ, PHNWKPPDYS, PHNWKPPD7B, PHNWKPPDZ4'),
(28, 'ARUBA', 'JL681A', '1930 8G CLASS 4 POE SWITCH', 18, 'CN07KPC0QK, CN23KPC40Z, CN23KPC3C6, CN23KPC3Q0, CN23KPC3PZ, CN23KPC3QZ, CN23KPC7C0, CN23KPC378, CN23KPC40W, CN23KPC3NH, CN19KPC096, CN23KPC3G5, CN23KPC3DX, CN23KPC3XY, CN23KPC3CZ, CN23KPC3HK, CN23KPC3MP, CN23KPC40Y'),
(29, 'CISCO', 'NA', 'WS-C2960C-8TC-L V04', 1, 'FOC2224Y0KT'),
(30, 'ARUBA', 'JY728A', 'AP CONSOLE CABLE', 2, 'NA'),
(31, 'ARUBA', 'J9773A', '2530 24G POE+SWITCH (NEW SWITCH WITH BOX OPEN)', 3, 'CN19FP41LY, CN19FP40MZ, CN04FP41DY'),
(32, 'ARUBA', 'J4858D', '1G SFP SX', 22, 'MY8BKBP2F9, CN90KC5416, MY8BKBP3BB, CN84KC5N47, CN84KC5N6N, MY8BKBP1D7, MY8BKBP3NS, MY8BKBP2V2, MY8BKBP3BG, MY8BKBP3B8, MY8BKBP252, MY8BKBP2C6, MY8BKBP3B1, MY8BKBP25Q, MY8BKBP3B0, MY8BKBP2F6, CN87KBQ046, MY8BKBP25T, CN84KC5N28, CN84KC5N1B, MY8BKBP25S, MY8BKBP41P'),
(33, 'ARUBA', 'J4859D', '1G SFP LX', 3, 'CN87KBQ171, CN87KBQ0175, CN87KBQ139'),
(34, 'CISCO', 'NA', 'GLC-SX-MM', 1, 'H11F806'),
(35, 'CISCO', 'NA', 'GLC-SX-MMD', 1, 'FNS16411NPS'),
(36, 'FINISAR', 'NA', 'FG-TRAN-LX', 4, 'N1CAHK1, N1CA0JG, N19B6JS, N1BA2SW'),
(37, ' ', 'NA', 'JUNIPER MIST AP-43', 2, 'A072420071157, A0724200710EB'),
(38, ' ', 'J9150D', '10G SFP+SR', 6, 'CN0AKJVL1N, CN23KV5BN0, CN23KV5BF5, CN23KV56H4, CN23KJVPFQ, CN23KV5B3B'),
(39, ' ', 'R1C73A', 'AP-POE-BTSR 1P SR 802 3bt 60W Midspan Injector', 3, 'NA'),
(40, ' ', 'JW055A', 'Aruba AP-270-MNT-H2 270 Series', 1, 'NA'),
(41, ' ', 'R7H75A', 'Aru baUXlG-Series. 1 1 ax+EthernetSensor', 2, 'CNPRKYT00W,CNPRKYT04W'),
(42, ' ', 'R3T84A', 'Aruba UXI Mounting Kit', 6, 'NA'),
(43, ' ', 'R3T90A', 'Aruba UXI Power Supply WW ', 4, 'NA'),
(44, 'Ruckus', '901-R650-WW00', 'Ruckus-650', 1, '122339002393'),
(45, 'Ruckus', 'NA', 'Ruckus-ICX 7150-C12P', 1, 'FEK3212U07J'),
(46, 'ARUBA', 'J9782A', 'Aruba 2530-24 Switch', 1, 'CN85FPF039'),
(47, 'Microsemi', 'PD3501G/AC', 'Power over Ethernet(Poe) DC Power adopter', 1, 'C19236555000001808'),
(48, 'Fortinet', 'FG-40F', 'Fortigate 40F', 1, 'FGT40FTK21099SCR'),
(49, 'Juniper', 'NA', 'EX2300 24P', 1, 'JY0219460179'),
(50, 'ARUBA', 'R3J18A', 'AP-MNT-D Campus AP mount bracket kit ', 4, 'NA'),
(51, 'ARUBA', 'JL262A', 'ARUBA2930F48G POE+4SFPSWITCH', 15, 'CN8AHL328Q, CN8AHL331D, CN8AHL32QG, CN8AHL32PY, CN8BHL31YT, CN8BHL31PP, CN8AHL32TZ, CN8AHL38YC, CN8AHL38SM, CN8AHL32X7, CN8AHL38SJ, CN8AHL38QD, CN8AHL32X5, CN8AHL32T1, CN8BHL31QJ'),
(52, 'ARUBA', 'J8177D', 'Aruba 1G SFP RJ45', 2, 'CN7BKC7072,CN7BKC7076'),
(53, 'EDGE', '10G-SFP-20V3-AU', '10G-SFP-20V3-AU SMF TX:1310NM 20KM/9dB', 46, 'EO82312210003, EO82312210004, EO82312210005, EO82312210006, EO82312210007, EO82312210008, EO82312210009, EO82312210010, EO82312210011, EO82312210012, EO82312210013, EO82312210014, EO82312210015, EO82312210016, EO82312210017, EO82312210018, EO82312210019, EO82312210020, EO82312210021, EO82312210022, EO82312210023, EO82312210024, EO82312210025, EO82312210026, EO82312210027, EO82312210028, EO82312210029, EO82312210030, EO82312210031, EO82312210032, EO82312210033, EO82312210034, EO82312210035, EO82312210036, EO82312210037, EO82312210038, EO82312210039, EO82312210040, EO82312210041, EO82312210042, EO82312210043, EO82312210044, EO82312210045, EO82312210046, EO82312210047, EO82312210048'),
(54, 'EDGE', '1.25G-SFP-20D-AU', '1.25G-SFP-20D-AU SMF TX/RX:1310NM/1310NM 20KM/15dB', 20, 'EO1232210071, EO1232210072, EO1232210073, EO1232210074, EO1232210075, EO1232210076, EO1232210077, EO1232210078, EO1232210079, EO1232210080, EO1232210081, EO1232210082, EO1232210083, EO1232210084, EO1232210085, EO1232210086, EO1232210087, EO1232210088, EO1232210089, EO1232210090'),
(55, 'EDGE', '1.25G-SFP-550D-AU', '1.25G-SFP-550D-AU MMF TX/RX:850NM/850NM 550M/9dB', 20, 'EO1232210051, EO1232210052, EO1232210053, EO1232210054, EO1232210055, EO1232210056, EO1232210057, EO1232210058, EO1232210059, EO1232210060, EO1232210061, EO1232210062, EO1232210063, EO1232210064, EO1232210065, EO1232210066, EO1232210067, EO1232210068, EO1232210069, EO1232210070'),
(56, 'EDGE', '10G-SFP-300V2-AU', '10G-SFP-300V2-AU MMF TX/RX:850NM/850NM 300M/4.6dB', 50, 'EO1232210001, EO1232210002, EO1232210003, EO1232210004, EO1232210005, EO1232210006, EO1232210007, EO1232210008, EO1232210009, EO1232210010, EO1232210011, EO1232210012, EO1232210013, EO1232210014, EO1232210015, EO1232210016, EO1232210017, EO1232210018, EO1232210019, EO1232210020, EO1232210021, EO1232210022, EO1232210023, EO1232210024, EO1232210025, EO1232210026, EO1232210027, EO1232210028, EO1232210029, EO1232210030, EO1232210031, EO1232210032, EO1232210033, EO1232210034, EO1232210035, EO1232210036, EO1232210037, EO1232210038, EO1232210039, EO1232210040, EO1232210041, EO1232210042, EO1232210043, EO1232210044, EO1232210045, EO1232210046, EO1232210047, EO1232210048, EO1232210049, EO1232210050'),
(57, 'Ruckus', '901-R550-WW00', 'Ruckus-550', 1, '102322002751'),
(58, 'Cisco', 'SFP-10-SR', 'SFP-10-SR', 4, 'OPM2435137G, FNS242611N5, OPM2435137H, ACW24250G1X'),
(59, 'Aruba', 'JL683A', '1930 24P Switch', 2, 'CN1AKPF2PS,CN1AKPF2ZF');

-- --------------------------------------------------------

--
-- Table structure for table `kra_template`
--

CREATE TABLE `kra_template` (
  `id` int NOT NULL,
  `template_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kra_template`
--

INSERT INTO `kra_template` (`id`, `template_name`) VALUES
(1, 'Network Engineer'),
(2, 'Senior Network Engineer'),
(3, 'Technical Associate'),
(6, 'Template_123');

-- --------------------------------------------------------

--
-- Table structure for table `kra_template_data`
--

CREATE TABLE `kra_template_data` (
  `id` int NOT NULL,
  `template_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `kra_item` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kra_template_data`
--

INSERT INTO `kra_template_data` (`id`, `template_name`, `kra_item`) VALUES
(37, 'Network Engineer', 'No of Heatmap  - Major and Minor'),
(38, 'Network Engineer', 'Quality of heatmap'),
(39, 'Network Engineer', 'Comments'),
(40, 'Network Engineer', 'Projects - Major and Minor'),
(41, 'Network Engineer', 'Quality of Project task delivery'),
(42, 'Network Engineer', 'Comments'),
(43, 'Network Engineer', 'Onsite Visits/Audit & Surveys- Min 10 Site Visits'),
(44, 'Network Engineer', 'Quality of Survey and Client handling skill'),
(45, 'Network Engineer', 'Comments'),
(46, 'Network Engineer', 'Tasks -Documentation, visio\'s, survey reports, etc'),
(47, 'Network Engineer', 'Quality of documents'),
(48, 'Network Engineer', 'Comments'),
(49, 'Network Engineer', 'Task ownership'),
(50, 'Network Engineer', 'Comments'),
(51, 'Network Engineer', 'Timely Project Updates On The Tool'),
(52, 'Network Engineer', 'Comments'),
(53, 'Network Engineer', 'Certifications & Trainning'),
(54, 'Network Engineer', 'Comments'),
(55, 'Network Engineer', 'Technical Compitency- Wired And Wireless L 1 Level / Training'),
(56, 'Network Engineer', 'Comments'),
(57, 'Network Engineer', 'Soft Skills- Communitations- Verbal & Written, Presentation,'),
(58, 'Network Engineer', 'Comments'),
(59, 'Network Engineer', 'Behaviour- Punctuality, Transparency- Effective Escalations'),
(60, 'Network Engineer', 'Comments'),
(61, 'Network Engineer', 'Total Percentage'),
(62, 'Network Engineer', 'Technical comments'),
(63, 'Network Engineer', 'Executive comments'),
(64, 'Technical Associate', 'No of Heatmap  - Major and Minor'),
(65, 'Technical Associate', 'Quality of heatmap'),
(66, 'Technical Associate', 'Comments'),
(67, 'Technical Associate', 'Projects - Major and Minor'),
(68, 'Technical Associate', 'Quality of Project task delivery'),
(69, 'Technical Associate', 'Comments'),
(70, 'Technical Associate', 'Onsite Visits/Audit & Surveys- Min 10 Site Visits'),
(71, 'Technical Associate', 'Quality of Survey and Client handling skill'),
(72, 'Technical Associate', 'Comments'),
(73, 'Technical Associate', 'Tasks -Documentation, visio\'s, survey reports, etc'),
(74, 'Technical Associate', 'Quality of documents'),
(75, 'Technical Associate', 'Comments'),
(76, 'Technical Associate', 'Task ownership'),
(77, 'Technical Associate', 'Timely Project Updates On The Tool'),
(78, 'Technical Associate', 'Certifications'),
(79, 'Technical Associate', 'Comments'),
(80, 'Technical Associate', 'Technical Compitency- Wired And Wireless L 1 Level / Training'),
(81, 'Technical Associate', 'Soft Skills- Communitations- Verbal & Written, Presentation,'),
(82, 'Technical Associate', 'Behaviour- Punctuality, Transparency- Effective Escalations'),
(83, 'Technical Associate', 'Total Percentage'),
(84, 'Technical Associate', 'Technical comments'),
(85, 'Technical Associate', 'Executive comments'),
(86, 'Senior Network Engineer', 'Solution Design'),
(87, 'Senior Network Engineer', 'Quality of solution design delivery'),
(88, 'Senior Network Engineer', 'Comments'),
(89, 'Senior Network Engineer', 'Poc\'S/Per month'),
(90, 'Senior Network Engineer', 'Quality of POC delivery'),
(91, 'Senior Network Engineer', 'Comments'),
(92, 'Senior Network Engineer', 'Escalation Taken'),
(93, 'Senior Network Engineer', 'Effective solution given for the escalation'),
(94, 'Senior Network Engineer', 'Comments'),
(95, 'Senior Network Engineer', 'Project Implementation/Per Month - Monitor'),
(96, 'Senior Network Engineer', 'Quality of Project completion on the basis of completion days'),
(97, 'Senior Network Engineer', 'Comments'),
(98, 'Senior Network Engineer', 'Task Owner ship'),
(99, 'Senior Network Engineer', 'Mentoring Juniors-2 Junior'),
(100, 'Senior Network Engineer', 'Certifications (Asso/professional level)'),
(101, 'Senior Network Engineer', 'Technical Competency- Wired, Wi-Fi, CPPM, Sd-Wan / training'),
(102, 'Senior Network Engineer', 'Behaviour- Punctuality, Transparency'),
(103, 'Senior Network Engineer', 'Soft Skills- Communications- Verbal & Written, Presentation, Timely Project Updates On The Tool'),
(104, 'Senior Network Engineer', 'Total Percentage'),
(105, 'Senior Network Engineer', 'Technical comments'),
(106, 'Senior Network Engineer', 'Executive comments'),
(107, 'template_name', 'kra_item'),
(108, 'kra_v2_network_engineer', 'No of onsite visit'),
(109, 'kra_v2_network_engineer', 'comments'),
(110, 'kra_v2_network_engineer', 'Customer satisfaction'),
(111, 'kra_v2_network_engineer', 'comments');

-- --------------------------------------------------------

--
-- Table structure for table `lab`
--

CREATE TABLE `lab` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `purpose` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `material` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `dataadded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Part_No` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `serialNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Noserial',
  `tno` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rreason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lab`
--

INSERT INTO `lab` (`id`, `name`, `purpose`, `material`, `quantity`, `start_date`, `end_date`, `status`, `dataadded`, `pname`, `Part_No`, `serialNumber`, `tno`, `rreason`) VALUES
(73, 'suraj', 'Training', 'AP-505H-RW', 2, '2024-05-27', '2024-05-28', 'rejected by manager', '2024-05-27 01:20:16', '', 'R3V46A', 'Noserial', 'ANPL-28748', 'Wrong emtnry');

-- --------------------------------------------------------

--
-- Table structure for table `lms`
--

CREATE TABLE `lms` (
  `id` int NOT NULL,
  `lname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sdate` date NOT NULL,
  `edate` date NOT NULL,
  `to_a` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oem_cert`
--

CREATE TABLE `oem_cert` (
  `id` int NOT NULL,
  `cname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `OEM` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cost` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `oem_cert`
--

INSERT INTO `oem_cert` (`id`, `cname`, `OEM`, `cost`) VALUES
(1, 'Aruba product specialist central (APSC)', 'Aruba ', 10000),
(3, 'Aruba Certified Switching Associate (ACSA)', 'Aruba ', 0),
(5, 'Aruba accredited SDWAN professional (AASP)', 'Aruba ', 0),
(6, 'Aruba Certified Switching professional (ACSP)', 'Aruba ', 0),
(7, 'HPE Sales Certified - Aruba Networking Solutions(APAS)', 'Aruba ', 0),
(9, 'ACX - Network Security', 'Aruba ', 0),
(10, 'Aruba Certified ClearPass Expert (ACCX)', 'Aruba ', 0),
(12, ' Aruba product - Configuring SD Branch ', 'Aruba ', 0),
(13, ' HPE Sales Certified - Aruba Networking Solutions(APAS)', 'Aruba ', 0),
(14, ' Secure SD-WAN Provisioning', 'Aruba ', 0),
(15, 'Aruba networking product specilist - security service edge (APS-SSE)', 'Aruba ', 0),
(16, 'Aruba Certified Mobility Associate (ACMA)', 'Aruba ', 0),
(20, 'Aruba Certified ClearPass Associate (ACCA)', 'Aruba ', 0),
(21, 'Aruba Certified Edge Associate (ACEA)', 'Aruba ', 0),
(22, 'Aruba Certified Edge Professional (ACEP) ', 'Aruba ', 0),
(24, 'Aruba Product specialist- CX 10K Switch', 'Aruba ', 0),
(25, ' Aruba Data Center Network Specialist  (ADCNS)', 'Aruba ', 0),
(28, 'Aruba Certified Mobility Professional (ACMP)', 'Aruba ', 0),
(29, 'Aruba Certified ClearPass Professional (ACCP)', 'Aruba ', 0),
(32, ' Certified customer scuccess manager (CCSM) Level 1', 'Aruba ', 0),
(36, 'Aruba Certified Canpus Associate (ACA)', 'Aruba ', 0),
(46, ' Aruba accredited sdwan expert assessment (ACSX)', 'Aruba ', 0),
(56, 'Aruba Certified Design Professional (ACDP)', 'Aruba ', 0),
(57, 'Aruba Certified Design Associate (ACDA)', 'Aruba ', 0),
(59, 'Aruba Certified Edge Professional (ACEP)', 'Aruba ', 0),
(66, 'Aruba accredited sdwan professional (AASP) ', 'Aruba ', 0),
(92, 'Aruba Certified Canpus Associate (ACCA)', 'Aruba ', 0),
(93, 'Aruba Data Center Network Specialist (ADCNS)', 'Aruba ', 0),
(99, 'ACMX', 'Aruba ', 0),
(100, 'Aruba certified network security associate (ACNSA)', 'Aruba ', 0),
(102, 'Cerified wireless network associate (CWNA)', 'Aruba ', 0),
(103, 'ACNSP', 'Aruba ', 0),
(104, 'ACNA campus', 'Aruba ', 0),
(107, 'ACNA DC', 'Aruba ', 0),
(125, 'ACNSA', 'Aruba ', 0),
(126, 'Aruba Certified Canpus Associate (ACA)\nSilverpeak', 'Aruba ', 0),
(128, 'ZTNA -101', 'Cloudflare', 0),
(129, 'ZTNA -301', 'Cloudflare', 0),
(130, 'ZTNA', 'Cloudflare', 0),
(139, 'NSE 4', 'Fortinet', 0),
(140, 'FCA (Fortinet Certified Associate)', 'Fortinet', 0),
(143, 'FCF (Fortinet Certified Fundamentle in Cybersecurity)', 'Fortinet', 0),
(144, 'FCAC (Fortinet Certified Associate in Cybersecurity)', 'Fortinet', 0),
(145, 'Fortinet SD-WAN 7.2 Architect', 'Fortinet', 0),
(146, 'Fortinet FortiGate 7.4 Operator', 'Fortinet', 0),
(147, 'NSE 4- FortiOS 6.2', 'Fortinet', 0),
(148, 'NSE 5- Fortiedr 5.0', 'Fortinet', 0),
(149, 'NSE 5- FortiManager 6.2', 'Fortinet', 0),
(150, 'NSE 5- FortiAnalyzer 6.2', 'Fortinet', 0),
(151, 'NSE 7- Enterprise Firewall 7.0', 'Fortinet', 0),
(152, '  NSE 7- OT Security 6.4  ', ' Fortinet  ', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payout_details`
--

CREATE TABLE `payout_details` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  `Activity` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending with PM',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `rreason` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payout_details`
--

INSERT INTO `payout_details` (`id`, `name`, `startdate`, `enddate`, `Activity`, `status`, `start_time`, `end_time`, `rreason`) VALUES
(1, 'suraj', '2024-03-25', '2024-03-26', 'ANPL123\r\n                                            ', 'approved', '11:27:00', '18:27:00', NULL),
(2, 'suraj', '2024-03-27', '2024-03-28', 'gbv                                        ', 'approved', '13:04:00', '14:04:00', NULL),
(6, 'mj', '2024-03-30', '2024-03-30', 'ANPL-1234\r\n                                            ', 'approved', '09:30:00', '18:50:00', NULL),
(7, 'suraj', '2024-03-28', '2024-04-29', 'Test \r\n                                            ', 'approved', '18:00:00', '21:00:00', NULL),
(8, 'suraj', '2024-04-01', '2024-04-02', 'dfg\r\n                                            ', 'approved', '19:44:00', '21:47:00', NULL),
(9, 'suraj', '2024-04-09', '2024-04-11', 'ANPL\r\n                                            ', 'approved', '14:43:00', '12:45:00', NULL),
(10, 'suraj', '2024-04-11', '2024-04-12', '12w456u\r\n                                            ', 'approved', '12:44:00', '11:45:00', NULL),
(11, 'suraj', '2024-04-11', '2024-04-12', 'asdfh\r\n                                            ', 'rejected by manager', '12:54:00', '12:54:00', 'ji'),
(12, 'suraj', '2024-04-11', '2024-04-12', 'assdfghjmnbvcexcwrtrtjy\r\n                                            ', 'rejected by manager', '11:58:00', '13:56:00', NULL),
(13, 'kiran patil', '2024-05-03', '2024-05-03', 'ANPL-123 Decathlon \r\n                                            ', 'approved', '10:30:00', '20:36:00', NULL),
(14, 'Punit', '2024-05-03', '2024-05-03', 'INC#123456', 'Pending with HR', '10:43:00', '22:43:00', NULL),
(15, 'rutuja', '2024-05-07', '2024-05-07', 'TEST\r\n                                            ', 'rejected by manager', '16:46:00', '14:50:00', 'ccc'),
(16, 'rutuja', '2024-05-08', '2024-05-29', 'fv\r\n                                            ', 'rejected by manager', '15:05:00', '19:01:00', 'nm'),
(17, 'suraj', '2024-05-05', '2024-05-05', 'hi\r\n                                            ', 'rejected by manager', '19:20:00', '23:17:00', 'ji'),
(18, 'suraj', '2024-05-06', '2024-05-14', 'gh\r\n                                            ', 'rejected by manager', '19:25:00', '21:24:00', 'hi'),
(19, 'suraj', '2024-05-08', '2024-05-08', 'hi\r\n                                            ', 'approved', '19:30:00', '23:27:00', NULL),
(20, 'Punit', '2024-05-07', '2024-05-14', 'hi\r\n                                            ', 'approved', '19:37:00', '21:34:00', NULL),
(21, 'rutuja', '2024-05-06', '2024-05-06', 'TS\r\n                                            ', 'rejected', '21:37:00', '22:37:00', 'Ji'),
(22, 'suraj', '2024-05-09', '2024-05-09', 'ji\r\n                                            ', 'approved', '09:51:00', '12:48:00', NULL),
(23, 'suraj', '2024-05-15', '2024-05-29', '\r\n         gh                                   ', 'rejected by manager', '12:25:00', '15:21:00', 'jk'),
(24, 'suraj', '2024-05-16', '2024-05-16', 'KM\r\n                                            ', 'approved', '12:59:00', '12:59:00', NULL),
(25, 'suraj', '2024-05-14', '2024-05-15', 'JK\r\n                                            ', 'rejected', '16:47:00', '17:47:00', 'Invalid date'),
(26, 'suraj', '2024-05-17', '2024-05-17', 'ji\r\n                                            ', 'rejected', '10:53:00', '06:55:00', 'Login hours less'),
(27, 'abhishek', '2024-05-16', '2024-05-20', 'anpl-134\r\n                                            ', 'approved', '12:18:00', '16:18:00', NULL),
(28, 'suraj', '2024-05-22', '2024-05-23', 'xyz\r\n                                            ', 'rejected', '14:18:00', '16:18:00', 'rejecting it'),
(29, 'rutuja', '2024-05-16', '2024-05-17', 'PARY', 'Pending with HR', '18:33:00', '12:33:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pms`
--

CREATE TABLE `pms` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `KRA` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Weigtage` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Jan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Feb` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Mar` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `April` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `May` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `June` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `July` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Aug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Sept` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Oct` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Nov` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `Dece` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NA',
  `year` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pms`
--

INSERT INTO `pms` (`id`, `name`, `KRA`, `Weigtage`, `Jan`, `Feb`, `Mar`, `April`, `May`, `June`, `July`, `Aug`, `Sept`, `Oct`, `Nov`, `Dece`, `year`) VALUES
(22, 'abhishek', 'No of Heatmap  - Major and Minor', '7.5', '7.5', '7.5', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(23, 'abhishek', 'Quality of heatmap', '7.5', '7', '7', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(24, 'abhishek', 'Comments', '', 'Doing good in Heatmaps', 'Doing good in Heatmaps', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(25, 'abhishek', 'Projects - Major and Minor', '5', '5', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(26, 'abhishek', 'Quality of Project task delivery', '5', '3', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(27, 'abhishek', 'Comments', '', 'IDFC - Airoli - Wired Deployment', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(28, 'abhishek', 'Onsite Visits/Audit & Surveys- Min 10 Site Visits', '7.5', '7.5', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(29, 'abhishek', 'Quality of Survey and Client handling skill', '7.5', '5', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(30, 'abhishek', 'Comments', '', 'IDFC - Airoli - Onsite support', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(31, 'abhishek', 'Tasks -Documentation, visio\'s, survey reports, etc', '5', '5', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(32, 'abhishek', 'Quality of documents', '5', '3', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(33, 'abhishek', 'Comments', '', 'IDFC Documents', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(34, 'abhishek', 'Task ownership', '5', '3', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(35, 'abhishek', 'Comments', '', 'Require Proactivness', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(36, 'abhishek', 'Timely Project Updates On The Tool', '5', '2', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(37, 'abhishek', 'Comments', '', 'Need to update regular tasks', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(38, 'abhishek', 'Certifications & Trainning', '20', '15', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(39, 'abhishek', 'Comments', '', 'No certificate completed due to projects', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(40, 'abhishek', 'Technical Compitency- Wired And Wireless L 1 Level / Training', '10', '6', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(41, 'abhishek', 'Comments', '', 'Need to scale up in Wireless technology', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(42, 'abhishek', 'Soft Skills- Communitations- Verbal & Written, Presentation,', '5', '3', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(43, 'abhishek', 'Comments', '', 'Need to improve customer handling skills', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(44, 'abhishek', 'Behaviour- Punctuality, Transparency- Effective Escalations', '5', '3', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(45, 'abhishek', 'Comments', '', 'Good ', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(46, 'abhishek', 'Total Percentage', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(47, 'abhishek', 'Technical comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(48, 'abhishek', 'Executive comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(49, 'setu', 'Solution Design', '5', '5', '6', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(50, 'setu', 'Quality of solution design delivery', '', '7', '9', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(51, 'setu', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(52, 'setu', 'Poc\'S/Per month', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(53, 'setu', 'Quality of POC delivery', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(54, 'setu', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(55, 'setu', 'Escalation Taken', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(56, 'setu', 'Effective solution given for the escalation', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(57, 'setu', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(58, 'setu', 'Project Implementation/Per Month - Monitor', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(59, 'setu', 'Quality of Project completion on the basis of completion days', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(60, 'setu', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(61, 'setu', 'Task Owner ship', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(62, 'setu', 'Mentoring Juniors-2 Junior', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(63, 'setu', 'Certifications (Asso/professional level)', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(64, 'setu', 'Technical Competency- Wired, Wi-Fi, CPPM, Sd-Wan / training', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(65, 'setu', 'Behaviour- Punctuality, Transparency', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(66, 'setu', 'Soft Skills- Communications- Verbal & Written, Presentation, Timely Project Updates On The Tool', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(67, 'setu', 'Total Percentage', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(68, 'setu', 'Technical comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(69, 'setu', 'Executive comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(128, 'suraj', 'No of Heatmap  - Major and Minor', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(129, 'suraj', 'Quality of heatmap', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(130, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(131, 'suraj', 'Projects - Major and Minor', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(132, 'suraj', 'Quality of Project task delivery', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(133, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(134, 'suraj', 'Onsite Visits/Audit & Surveys- Min 10 Site Visits', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(135, 'suraj', 'Quality of Survey and Client handling skill', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(136, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(137, 'suraj', 'Tasks -Documentation, visio\'s, survey reports, etc', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(138, 'suraj', 'Quality of documents', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(139, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(140, 'suraj', 'Task ownership', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(141, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(142, 'suraj', 'Timely Project Updates On The Tool', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(143, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(144, 'suraj', 'Certifications & Trainning', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(145, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(146, 'suraj', 'Technical Compitency- Wired And Wireless L 1 Level / Training', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(147, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(148, 'suraj', 'Soft Skills- Communitations- Verbal & Written, Presentation,', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(149, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(150, 'suraj', 'Behaviour- Punctuality, Transparency- Effective Escalations', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(151, 'suraj', 'Comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(152, 'suraj', 'Total Percentage', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(153, 'suraj', 'Technical comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024'),
(154, 'suraj', 'Executive comments', '', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2024');

-- --------------------------------------------------------

--
-- Table structure for table `task_list`
--

CREATE TABLE `task_list` (
  `id` int NOT NULL,
  `task_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `assigned_to` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `priority` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sdate` date NOT NULL,
  `ddate` date NOT NULL,
  `assigned_by` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Not yet started',
  `notes` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `attachments` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `uname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `tname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Not_Approved',
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uname`, `password`, `type`, `tname`, `designation`, `status`, `email`) VALUES
(1, 'suraj', '$2b$12$wOaKwSNbI8CYk1L7NzDAP.c4xXS80VHZgYgM45cWshpveYlb6Z2yi', 'manager', 'project', 'Senior_Network_Engineer', 'approved', 'yogesh@airowire.com'),
(2, 'abhishek', '$2b$12$1F9O.eNGoVJ2ZtqA77El9OJvUxKYvgQi2IKbIj.655ZE1QXljYgj.', 'user', 'project', 'Network_Engineer', 'approved', 'abhishek.t@airowire.com'),
(3, 'jeevan', '$2b$12$PBGKDlOe2gZgB5.x9h8G8uHBSU4ax1O3acEt.B6lDYJvNqSyN5Lwq', 'manager', 'operation', 'dffg', 'approved', 'jeevan@airowire.com'),
(4, 'shilpa', '$2b$12$g54V7MbZ/pu.8gX.WzZ3keApwzZ9LVsOiPFLdj62UNi5Vyt7w4HqG', 'manager', 'hr', 'Technical_Associate', 'approved', 'shilpa@airowire.com'),
(5, 'setu', '$2b$12$BANWWcoi6SMt1Cy/K4GyLeCYEk1D2ow6afAxnx7Azi.gewYsDWRvO', 'user', 'project', 'Senior_Network_Engineer', 'approved', 'setu@airowire.com'),
(6, 'shivaraj.E', '$2b$12$LkqjB1b6PweHFM/j2z/GR.h3/7W9nBH84K4bKXdmVSt7leMcN1GiS', 'user', 'project', 'Network_Engineer', 'approved', 'shivaraj.e@airowire.com'),
(8, 'Swarup Kumar', '$2b$12$kcuDqYSItJvUQxcodYopLOZvykzTUSFh6PaCth.yDhJNR9UZJsmv6', 'manager', 'sales', 'other', 'approved', 'swarup@airowire.com'),
(9, 'shwetha', '$2b$12$Y00RteuCGiBN6OnWmb9rMOW2bPT3YNwIxJLKyJNu2uJDP/WkWMdgq', 'user', 'sales', 'other', 'approved', 'shweta@airowire.com'),
(10, 'Sanketh N', '$2b$12$V551cpi67vZBeWKeKUfOp.12bmdHNaTissI1kmeWIF9LDIx4Qv4n6', 'user', 'project', 'Network_Engineer', 'approved', 'sanketh@airowire.com'),
(11, 'Adarsh PR', '$2b$12$kfxd7yaJihkWvhmzar3gt.vf3Fm0TnBv/GbVBLuBOY5XxKo67IN8.', 'user', 'project', 'Senior_Network_Engineer', 'approved', 'adarsh@airowire.com'),
(12, 'Karthik', '$2b$12$BgEJNy4wccae23/7T772T.7lJKQKxyMsZjAvd7Adb3YTncoBydeai', 'user', 'project', 'Network_Engineer', 'approved', 'karthik@airowire.com'),
(13, 'Mallikarjun', '$2b$12$J6SfTLe92U3bfGA/hhkxDuDAzia2j4E.hlt16wQfs8EETMZGG8x8e', 'manager', 'project', 'other', 'approved', 'mj@airowire.com'),
(14, 'Sai', '$2b$12$d.ki7fH5fGYw/BlVnIehwuW4VM.5RADQ7HeIBGrIJqZiy3grlxK7a', 'user', 'project', 'Network_Engineer', 'approved', 'saipraveen@airowire.com'),
(16, 'vivek k', '$2b$12$fklpMLYZfgNCGsPe5tvgJu5IS2KA946T8FYlxirj3jUKHbWFpGJ/G', 'user', 'project', 'Senior_Network_Engineer', 'approved', 'vivek@airowire.com'),
(17, 'Punit', '$2b$12$wV8jpaCuQ80Xv65RW4BY3.wvJ2yFjFm2VtK0MD/WY.wWUiR6jJdeG', 'user', 'noc', 'other', 'approved', 'punit@airowire.com'),
(18, 'rutuja', '$2b$12$i6tOgXVFGgwup3I4oUgrDe1l/dfeXh2k2QFrG9A9/wwxvhs.CY5o2', 'manager', 'noc', 'other', 'approved', 'rutuja@airowire.com'),
(19, 'yogesh', '$2b$12$2HA9sP/0Apt/SjgHc.LopuNYXb7Hlj9X3qhIrdDZSDX7YaMOBTqCa', 'user', 'project', 'other', 'approved', 'yogesh@airowire.com'),
(20, 'kiran patil', '$2b$12$plwQANF79vSEKPLWJwJSL.8fzf5TWHrlL7F0sBPScvsWg0ItMl3hG', 'user', 'project', 'other', 'approved', 'kiran.p@airowire.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certification`
--
ALTER TABLE `certification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certification_cost`
--
ALTER TABLE `certification_cost`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `elab`
--
ALTER TABLE `elab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fpotp`
--
ALTER TABLE `fpotp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`slno`);

--
-- Indexes for table `kra_template`
--
ALTER TABLE `kra_template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kra_template_data`
--
ALTER TABLE `kra_template_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab`
--
ALTER TABLE `lab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lms`
--
ALTER TABLE `lms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oem_cert`
--
ALTER TABLE `oem_cert`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payout_details`
--
ALTER TABLE `payout_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pms`
--
ALTER TABLE `pms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_list`
--
ALTER TABLE `task_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certification`
--
ALTER TABLE `certification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `certification_cost`
--
ALTER TABLE `certification_cost`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `elab`
--
ALTER TABLE `elab`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `fpotp`
--
ALTER TABLE `fpotp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `slno` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `kra_template`
--
ALTER TABLE `kra_template`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kra_template_data`
--
ALTER TABLE `kra_template_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `lab`
--
ALTER TABLE `lab`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `lms`
--
ALTER TABLE `lms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oem_cert`
--
ALTER TABLE `oem_cert`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;

--
-- AUTO_INCREMENT for table `payout_details`
--
ALTER TABLE `payout_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `pms`
--
ALTER TABLE `pms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `task_list`
--
ALTER TABLE `task_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
