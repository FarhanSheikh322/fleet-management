DROP TABLE IF EXISTS `preferences`;
CREATE TABLE `preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pref_key` text,
  `pref_value` text,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `bin_inventory`;
CREATE TABLE `bin_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_bin` bigint NOT NULL,
  `card_type` varchar(255) NOT NULL,
  `member_id` int NOT NULL,
  `service_type` int NOT NULL DEFAULT '0',
  `inventory` int NOT NULL DEFAULT '0',
  `inventory1` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `bin_valet_service`;
CREATE TABLE `bin_valet_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_catalog_id` int DEFAULT NULL,
  `bin` bigint DEFAULT NULL,
  `is_visits` tinyint(1) DEFAULT '0',
  `total_quantity` int DEFAULT '0',
  `monthly_quantity` int DEFAULT '0',
  `weekly_quantity` int DEFAULT '0',
  `created_date` bigint DEFAULT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `hours_visit` int DEFAULT '0',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `service_packages`;
CREATE TABLE `service_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `country_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_service_packages_country_id` (`country_id`),
  CONSTRAINT `fk_service_packages_country_id` FOREIGN KEY (`country_id`) REFERENCES `default_schema`.`country` (`id`)
);

DROP TABLE IF EXISTS `service_package_items`;
CREATE TABLE `service_package_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `service_package_id` int NOT NULL,
  `service_catalog_id` int NOT NULL,
  `quantity` int DEFAULT '0',
  `platform_scope` VARCHAR(45) NULL,
  `created_date` bigint DEFAULT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_service_package_items_service_package_id` (`service_package_id`),
  KEY `idx_service_package_items_service_catalog_id` (`service_catalog_id`),
  CONSTRAINT `fk_service_package_items_service_catalog_id` FOREIGN KEY (`service_catalog_id`) REFERENCES `default_schema`.`service_catalog` (`id`),
  CONSTRAINT `fk_service_package_items_service_package_id` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`)
);

DROP TABLE IF EXISTS `activation_codes`;
CREATE TABLE `activation_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activation_code` VARCHAR(12) NULL,
  `user_id` INT NULL,
  `service_package_id` INT NULL,
  `created_date` BIGINT NOT NULL,
  `expiry_date` BIGINT NOT NULL,
  `deleted_at` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activation_codes_service_package_id` (`service_package_id`),
  CONSTRAINT `service_package_id` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`)
);

DROP TABLE IF EXISTS `airport_service_bookings`;
CREATE TABLE `airport_service_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` varchar(45) DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `booking_voucher_no` varchar(255) DEFAULT NULL,
  `contact_number_isd_code` varchar(45) DEFAULT NULL,
  `contact_number` mediumtext,
  `service_code` varchar(255) DEFAULT NULL,
  `job_id` int DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `created_date` bigint NOT NULL,
  `in_progress_sla` bigint DEFAULT NULL,
  `confirmation_sla` bigint DEFAULT NULL,
  `reschedule_cancellation_sla` bigint DEFAULT NULL,
  `display_in_progress_sla` bigint DEFAULT NULL,
  `display_confirmation_sla` bigint DEFAULT NULL,
  `note` varchar(250) DEFAULT NULL,
  `booking_voucher_pdf` varchar(255) DEFAULT NULL,
  `assign_user_id` int DEFAULT NULL,
  `cancellation_remark` varchar(250) DEFAULT NULL,
  `service_package_id` int NOT NULL,
  `service_catalog_id` int NOT NULL,
  `created_by_user_id` int NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `reschedule_count` int NOT NULL DEFAULT '0',
  `is_cancel` int NOT NULL DEFAULT '0',
  `is_reschedule` int NOT NULL DEFAULT '0',
  `is_work_in_progress` int NOT NULL DEFAULT '0',
  `is_invalid` int NOT NULL DEFAULT '0',
  `invalid_notes` text DEFAULT NULL,
  `is_invalid_time` bigint DEFAULT NULL,
  `service_provider_code` VARCHAR(255) NULL,
  `reschedule_remarks` VARCHAR(255) NULL,
  `requestor_title` VARCHAR(255) DEFAULT NULL ,
  `requestor_name` VARCHAR(255) DEFAULT NULL ,
  `requestor_email` VARCHAR(255) DEFAULT NULL ,
  `requestor_mobile` VARCHAR(255) DEFAULT NULL ,
  `preferred_language` VARCHAR(255) DEFAULT NULL,
  `welcome_board_display` VARCHAR(255) DEFAULT NULL,
  `addons_selected` VARCHAR(255) DEFAULT NULL,
  `hand_over_title` VARCHAR(255) DEFAULT NULL ,
  `hand_over_name` VARCHAR(255) DEFAULT NULL ,
  `hand_over_email` VARCHAR(255) DEFAULT NULL ,
  `hand_over_mobile` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_service_request_service_package_id` (`service_package_id`),
  KEY `idx_service_request_service_catalog_id` (`service_catalog_id`),
  KEY `idx_service_request_created_by_user_id` (`created_by_user_id`),
  CONSTRAINT `fk_service_request_created_by_user_id` FOREIGN KEY (`created_by_user_id`) REFERENCES `default_schema`.`users` (`id`),
  CONSTRAINT `fk_service_request_service_catalog_id` FOREIGN KEY (`service_catalog_id`) REFERENCES `default_schema`.`service_catalog` (`id`),
  CONSTRAINT `fk_service_request_service_package_id` FOREIGN KEY (`service_package_id`) REFERENCES `service_packages` (`id`)
);

DROP TABLE IF EXISTS `flight_details`;
CREATE TABLE `flight_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `travel_type` varchar(50) DEFAULT NULL,
  `flight_number` varchar(50) DEFAULT NULL,
  `flight_date` mediumtext,
  `arrival_date` bigint NULL DEFAULT NULL,
  `departure_date` bigint NULL DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `flight_time` mediumtext,
  `terminal` varchar(50) DEFAULT NULL,
  `carrier` varchar(50) DEFAULT NULL, -- added only for QNB (AL-MAHA)
  `destination` varchar(255) DEFAULT NULL,
  `eta` varchar(45) DEFAULT NULL,
  `service_request_id` int NOT NULL,
  `airport_id` int NOT NULL,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_flight_details_airport_id` (`airport_id`),
  KEY `idx_flight_details_service_request_id` (`service_request_id`),
  CONSTRAINT `fk_flight_details_airport_id` FOREIGN KEY (`airport_id`) REFERENCES `default_schema`.`airport` (`id`),
  CONSTRAINT `fk_flight_details_service_request_id` FOREIGN KEY (`service_request_id`) REFERENCES `airport_service_bookings` (`id`)
);

DROP TABLE IF EXISTS `passenger_details`;
CREATE TABLE `passenger_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `pax_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `contact_number_isd_code` varchar(45) DEFAULT NULL,
  `contact_number` mediumtext,
  `nationality` varchar(50) DEFAULT NULL,
  `passport_number` varchar(50) DEFAULT NULL,
  `dob_child` bigint DEFAULT NULL,
  `ticket_class` varchar(50) DEFAULT NULL,
  `pnr` varchar(50) DEFAULT NULL,
  `age_group` varchar(50) DEFAULT NULL,
  `primary_card` tinyint(1) DEFAULT NULL,
  `service_request_id` int NOT NULL,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_passenger_details_service_request_id` (`service_request_id`),
  CONSTRAINT `fk_passenger_details_service_request_id` FOREIGN KEY (`service_request_id`) REFERENCES `airport_service_bookings` (`id`)
);

DROP TABLE IF EXISTS `airport_transfer_details`;
CREATE TABLE `airport_transfer_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `address` text,
  `additional_requirement` varchar(225) DEFAULT NULL,
  `pick_up_date_time` mediumtext,
  `driver_name` varchar(255) DEFAULT NULL,
  `driver_contact_isd_code` varchar(45) DEFAULT NULL,
  `driver_contact_number` mediumtext,
  `destination` varchar(255) DEFAULT NULL,
  `car_type` varchar(255) DEFAULT NULL,
  `registration_no` varchar(45) DEFAULT NULL,
  `service_request_id` int NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `created_date` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_airport_transfer_details_service_request_id` (`service_request_id`),
  CONSTRAINT `fk_airport_transfer_details_service_request_id` FOREIGN KEY (`service_request_id`) REFERENCES `airport_service_bookings` (`id`)
);

DROP TABLE IF EXISTS `event_logs`;
CREATE TABLE `event_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(255) NOT NULL,
  `entity_id` int NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `performed_by` int DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `source` varchar(45) NOT NULL,
  `previous_values` text,
  `new_values` text,
  `additional_info` text,
  `created_date` bigint NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `consumers`;
CREATE TABLE `consumers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(145) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `password` varchar(145) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `is_active` int DEFAULT NULL,
  `tnc` varchar(245) DEFAULT NULL,
  `isd_code` int DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `card_holder_name` varchar(145) DEFAULT NULL,
  `first_nine_digit` bigint DEFAULT NULL,
  `last_five_digit` bigint DEFAULT NULL,
  `created_date` bigint DEFAULT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `binNumbers` varchar(50) DEFAULT NULL,
  `verification_status` enum('verification_pending','verified') DEFAULT NULL,
  `otp_type` enum('login_otp','register_otp','forgot_password_otp') DEFAULT NULL,
  `otp` varchar(4) DEFAULT NULL,
  `otp_expires_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

DROP TABLE IF EXISTS `delete_consumer`;
CREATE TABLE `delete_consumer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` varchar(255) DEFAULT NULL,
  `consumer_name` varchar(255) NOT NULL,
  `consumer_email` varchar(255) NOT NULL,
  `date_and_time` bigint NOT NULL,
  `deletion_reason` text NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `contact_us`;
CREATE TABLE `contact_us` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` varchar(255) DEFAULT NULL,
  `consumer_name` varchar(255) NOT NULL,
  `consumer_email` varchar(255) NOT NULL,
  `date_and_time` bigint NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_date` bigint NOT NULL,
  `deleted_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `card_bins`;
CREATE TABLE `card_bins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card` varchar(145) DEFAULT NULL,
  `bin` bigint DEFAULT NULL,
  `deleted_at` bigint DEFAULT NULL,
  `created_date` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
);

INSERT INTO `card_bins` (`card`, `bin`, `deleted_at`, `created_date`, `is_deleted`) VALUES 
('SAB World Elite Exclusive Mastercard', 549799, null, 1726669835, 0),
('SAB Visa Signature Credit Card', 427222, null, 1726669835, 0),
('SAB Premier Credit Card', 512060, null, 1726669835, 0),
('SAB Advance Credit Card', 456893, null, 1726669835, 0),
('SAB Visa Platinum Credit Card', 433786, null, 1726669835, 0),
('SAB Cashback Credit Card', 433786, null, 1726669835, 0),
('SAB Platinum Mastercard Credit Card', 543199, null, 1726669835, 0),
('Mastercard business', 547645, null, 1726669835, 0),
('SAB Titanium Mastercard Credit Card', 540236, null, 1726669835, 0); 

DROP TABLE IF EXISTS `user_devices`;
CREATE TABLE `user_devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `consumer_id` int NOT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `device_model` varchar(255) DEFAULT NULL,
  `token` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `os_version` varchar(50) DEFAULT NULL,
  `app_version` varchar(50) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location` point DEFAULT NULL,
  `platform` enum('android','ios','web') DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `valet_inventory`;
CREATE TABLE `valet_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `consumer_id` int DEFAULT NULL,
  `service_catalog_id` int NOT NULL,
  `remaining_quantity` int NOT NULL DEFAULT '0',
  `consumed_quantity` int DEFAULT '0',
  `created_date_time` bigint DEFAULT '0',
  `updated_date_time` bigint DEFAULT '0',
  `is_visits` tinyint(1) DEFAULT '0',
  `is_hours` tinyint(1) DEFAULT '0',
  `total_quantity` int DEFAULT '0',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `tblcoupons`;
CREATE TABLE `tblcoupons` (
  `coupon_id` bigint NOT NULL AUTO_INCREMENT,
  `status_id` int DEFAULT NULL,
  `created_date_time` datetime DEFAULT NULL,
  `coupon_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consumer_id` int DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `validity_duration` int DEFAULT '0',
  `transaction_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`coupon_id`),
  KEY `consumer_id` (`consumer_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `tblCoupons_fk2` FOREIGN KEY (`status_id`) REFERENCES `default_schema`.`tblstatus` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tblredeem`;
CREATE TABLE `tblredeem` (
  `redemp_id` bigint NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `coupon_id` bigint DEFAULT NULL,
  `created_date_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `status_id` int DEFAULT NULL,
  `consumer_id` int DEFAULT NULL,
  `redeem_start_date` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redeem_end_date` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validity_duration` int DEFAULT '0',
  `service_catalogId` int DEFAULT NULL,
  `transaction_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`redemp_id`),
  KEY `location_id` (`location_id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `tblredeem_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `default_schema`.`tblserviceproviderlocations` (`location_id`),
  CONSTRAINT `tblredeem_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `tblcoupons` (`coupon_id`),
  CONSTRAINT `tblredeem_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `default_schema`.`tblstatus` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

