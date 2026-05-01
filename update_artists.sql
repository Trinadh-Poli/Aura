USE aura_db;
UPDATE artists 
SET profile_image_url = CONCAT('https://picsum.photos/seed/', REPLACE(stage_name, ' ', ''), '-pfp/400/400'),
    header_image_url = CONCAT('https://picsum.photos/seed/', REPLACE(stage_name, ' ', ''), '-cover/1200/400');
