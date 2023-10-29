export const tableSingleData = {
  id: '11',
  sql: 'CREATE TABLE `city` (  `id` int(11) NOT NULL AUTO_INCREMENT,  `name` varchar(50) NOT NULL,  `email` varchar(100) NOT NULL,  `age` int(3) DEFAULT NULL,  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (`id`),  UNIQUE KEY `email_unique` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=utf8',
  sql_fingerprint:
    'CREATE TABLE `city` (  `id` int(11) NOT NULL AUTO_INCREMENT,  `name` varchar(50) NOT NULL,  `email` varchar(100) NOT NULL,  `age` int(3) DEFAULT NULL,  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (`id`),  UNIQUE KEY `email_unique` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=utf8',
  source: 'audit_plan', // sql_audit_record
  instance_name: 'instance_name',
  audit_result: [{ level: '', message: 'aa', rule_name: 'aa' }],
  first_appear_time: '2023-10-16 15:14:30',
  last_appear_time: '2023-10-16 15:14:30',
  appear_num: 1,
  assignees: ['a', 'b'],
  status: 'unhandled',
  remark: 'aaa'
};
