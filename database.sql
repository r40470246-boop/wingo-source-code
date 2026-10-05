-- WinGo Game Database Schema
CREATE DATABASE IF NOT EXISTS `92lottery`;
USE `92lottery`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `invite` varchar(50) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `veri` int(11) DEFAULT 1,
  `otp` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `money` double DEFAULT 0,
  `roses_f1` double DEFAULT 0,
  `roses_f2` double DEFAULT 0,
  `roses_f3` double DEFAULT 0,
  `roses_f4` double DEFAULT 0,
  `roses_f` double DEFAULT 0,
  `roses_today` double DEFAULT 0,
  `level` int(11) DEFAULT 0,
  `rank` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  `ctv` varchar(50) DEFAULT '0',
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin Table
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wingo1` varchar(255) DEFAULT '-1',
  `wingo3` varchar(255) DEFAULT '-1',
  `wingo5` varchar(255) DEFAULT '-1',
  `wingo10` varchar(255) DEFAULT '-1',
  `k5d` varchar(255) DEFAULT '-1',
  `k5d3` varchar(255) DEFAULT '-1',
  `k5d5` varchar(255) DEFAULT '-1',
  `k5d10` varchar(255) DEFAULT '-1',
  `k3d` varchar(255) DEFAULT '-1',
  `k3d3` varchar(255) DEFAULT '-1',
  `k3d5` varchar(255) DEFAULT '-1',
  `k3d10` varchar(255) DEFAULT '-1',
  `win_rate` int(11) DEFAULT 80,
  `telegram` varchar(255) DEFAULT 'https://t.me/support',
  `cskh` varchar(255) DEFAULT 'https://t.me/support',
  `app` varchar(255) DEFAULT '#',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- WinGo Game Draws Table
CREATE TABLE IF NOT EXISTS `wingo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT 0,
  `game` varchar(20) NOT NULL,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5D Game Table
CREATE TABLE IF NOT EXISTS `5d` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(50) NOT NULL,
  `result` varchar(20) DEFAULT '0',
  `game` int(11) NOT NULL,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- K3 Game Table
CREATE TABLE IF NOT EXISTS `k3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(50) NOT NULL,
  `result` varchar(20) DEFAULT '0',
  `game` int(11) NOT NULL,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Bets Table (minutes_1)
CREATE TABLE IF NOT EXISTS `minutes_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `invite` varchar(50) DEFAULT NULL,
  `stage` varchar(50) NOT NULL,
  `result` varchar(50) DEFAULT NULL,
  `more` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT 1,
  `fee` double DEFAULT 0,
  `get` double DEFAULT 0,
  `game` varchar(20) NOT NULL,
  `bet` varchar(20) NOT NULL,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Level Commission Rates
CREATE TABLE IF NOT EXISTS `level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` int(11) NOT NULL,
  `f1` double DEFAULT 0,
  `f2` double DEFAULT 0,
  `f3` double DEFAULT 0,
  `f4` double DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Seed Data
INSERT INTO `users` (`id`, `phone`, `password`, `code`, `invite`, `money`, `level`, `veri`, `status`, `time`) VALUES
(1, '9999999999', '482c811da5d5b4bc6d497ffa98491e38', 'ADMIN123', '0', 100000, 1, 1, 1, '1655689155500');

INSERT INTO `admin` (`id`, `wingo1`, `wingo3`, `wingo5`, `wingo10`, `k5d`, `k5d3`, `k5d5`, `k5d10`, `k3d`, `k3d3`, `k3d5`, `k3d10`, `win_rate`, `telegram`, `cskh`, `app`) VALUES
(1, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', 80, 'https://t.me/support', 'https://t.me/support', '#');

INSERT INTO `level` (`id`, `level`, `f1`, `f2`, `f3`, `f4`) VALUES
(1, 0, 0.6, 0.18, 0.054, 0.0162),
(2, 1, 0.7, 0.21, 0.063, 0.0189),
(3, 2, 0.75, 0.225, 0.0675, 0.0203),
(4, 3, 0.8, 0.24, 0.072, 0.0216),
(5, 4, 0.85, 0.255, 0.0765, 0.023),
(6, 5, 0.9, 0.27, 0.081, 0.0243),
(7, 6, 1, 0.3, 0.09, 0.027);

INSERT INTO `wingo` (`id`, `period`, `amount`, `game`, `status`, `time`) VALUES
(1, '202610050001', 6, 'wingo', 1, '1655689155500'),
(2, '202610050002', 0, 'wingo', 0, '1655689155500');
